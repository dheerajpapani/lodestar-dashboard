import * as GeoTIFF from 'geotiff';

// Parsed result cache (permanent)
const tiffCache = {};
// In-flight promises — prevents duplicate 25MB fetches when the preloader
// and the time slider both request the same file simultaneously
const tiffInFlight = {};

/**
 * Convert Web Mercator (EPSG:3857) x,y to WGS84 lon,lat
 */
function mercatorToWGS84(x, y) {
  const lon = (x / 20037508.34) * 180;
  let lat = (y / 20037508.34) * 180;
  lat = (180 / Math.PI) * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
  return [lon, lat];
}

/**
 * Convert any SAR band to dark grayscale (0-255).
 *
 * Works regardless of data format (DN uint16, linear sigma0 float, etc.) by:
 * 1. Sampling 10% of pixels to find the 2nd & 98th percentile range (robust to outliers)
 * 2. Stretching that range linearly to [0, 1]
 * 3. Applying gamma = 2 (squaring the value) — this keeps the lower half of the
 *    image genuinely dark/black while bright features (urban, metal) stay visible.
 *
 * Result: most of the image appears dark/black (authentic SAR look),
 * with bright structures standing out clearly.
 */
function sarToGrayscale(band, nodataValue) {
  // Sample every 10th pixel for fast percentile estimation
  const STEP = 10;
  const samples = [];
  for (let i = 0; i < band.length; i += STEP) {
    const v = band[i];
    if (isFinite(v) && v !== nodataValue && v > 0) samples.push(v);
  }

  if (samples.length === 0) return new Uint8Array(band.length);

  samples.sort((a, b) => a - b);
  const lo  = samples[Math.floor(samples.length * 0.02)]; // 2nd percentile
  const hi  = samples[Math.floor(samples.length * 0.98)]; // 98th percentile
  const range = hi - lo || 1;

  const out = new Uint8Array(band.length);
  for (let i = 0; i < band.length; i++) {
    const v = band[i];
    if (!isFinite(v) || v === nodataValue || v <= 0) {
      out[i] = 0; // nodata → transparent
      continue;
    }
    // Linear stretch → [0,1], then gamma=2 (t²) to keep dark areas dark
    const t = Math.min(1, Math.max(0, (v - lo) / range));
    out[i] = Math.round(t * t * 255);
  }
  return out;
}

export async function parseGeoTiff(url) {
  if (tiffCache[url]) return tiffCache[url];
  if (tiffInFlight[url]) return tiffInFlight[url]; // piggyback on existing parse

  const parsePromise = (async () => {
    try {
      const tiff = await GeoTIFF.fromUrl(url);
      const image = await tiff.getImage();
      const bbox = image.getBoundingBox(); // [minX, minY, maxX, maxY] — may be projected
      const width = image.getWidth();
      const height = image.getHeight();

      // --- CRS detection & coordinate fix ---
      let minLon, minLat, maxLon, maxLat;
      if (Math.abs(bbox[0]) > 181 || Math.abs(bbox[1]) > 91) {
        [minLon, minLat] = mercatorToWGS84(bbox[0], bbox[1]);
        [maxLon, maxLat] = mercatorToWGS84(bbox[2], bbox[3]);
        console.log('[tiffParser] Reprojected from Web Mercator:', [minLon, minLat, maxLon, maxLat]);
      } else {
        [minLon, minLat, maxLon, maxLat] = [bbox[0], bbox[1], bbox[2], bbox[3]];
        console.log('[tiffParser] Geographic bbox:', [minLon, minLat, maxLon, maxLat]);
      }

      // MapLibre image source corners: [top-left, top-right, bottom-right, bottom-left]
      const coordinates = [
        [minLon, maxLat],
        [maxLon, maxLat],
        [maxLon, minLat],
        [minLon, minLat],
      ];

      // --- Read raster data ---
      const rasters = await image.readRasters();
      const nodataValue = image.getGDALNoData?.() ?? null;

      const isFloat = rasters[0] instanceof Float32Array || rasters[0] instanceof Float64Array;
      const isRGB   = rasters.length >= 3 && !isFloat;

      let r, g, b;
      if (isRGB) {
        if (rasters[0] instanceof Uint16Array) {
          r = new Uint8Array(rasters[0].length);
          g = new Uint8Array(rasters[1].length);
          b = new Uint8Array(rasters[2].length);
          for (let i = 0; i < rasters[0].length; i++) {
            r[i] = rasters[0][i] >> 8;
            g[i] = rasters[1][i] >> 8;
            b[i] = rasters[2][i] >> 8;
          }
          console.log('[tiffParser] RGB uint16 mode scaled to uint8');
        } else {
          // True-color uint8 — use as-is
          r = rasters[0]; g = rasters[1]; b = rasters[2];
          console.log('[tiffParser] RGB uint8 mode');
        }
      } else if (rasters.length >= 2) {
        // Two-band SAR (VV + VH): convert each band to dark grayscale, then average
        const vv   = sarToGrayscale(rasters[0], nodataValue);
        const vh   = sarToGrayscale(rasters[1], nodataValue);
        const gray = new Uint8Array(vv.length);
        for (let i = 0; i < vv.length; i++) gray[i] = Math.round((vv[i] + vh[i]) / 2);
        r = gray; g = gray; b = gray;
        console.log('[tiffParser] 2-band SAR dark grayscale (VV+VH averaged)');
      } else {
        // Single-band
        const gray = sarToGrayscale(rasters[0], nodataValue);
        r = gray; g = gray; b = gray;
        console.log('[tiffParser] Single-band SAR dark grayscale');
      }

      // --- Paint to canvas ---
      const canvas = document.createElement('canvas');
      canvas.width  = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      const imageData = ctx.createImageData(width, height);

      for (let i = 0; i < width * height; i++) {
        const idx = i * 4;
        const rv = r[i];
        const gv = g[i];
        const bv = b[i];
        imageData.data[idx]     = rv;
        imageData.data[idx + 1] = gv;
        imageData.data[idx + 2] = bv;
        // All-zero pixels → transparent (nodata); otherwise 85% opaque
        imageData.data[idx + 3] = (rv === 0 && gv === 0 && bv === 0) ? 0 : 220;
      }

      ctx.putImageData(imageData, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');

      const result = { url: dataUrl, coordinates, bbox: [minLon, minLat, maxLon, maxLat] };
      tiffCache[url] = result;
      return result;
    } catch (err) {
      console.error('[tiffParser] Error parsing TIFF:', err);
      throw err;
    } finally {
      delete tiffInFlight[url];
    }
  })();

  tiffInFlight[url] = parsePromise;
  return parsePromise;
}
