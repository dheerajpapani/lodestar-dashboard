/* eslint-disable no-console */
// src/pages/Maps.jsx
import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { FaMapMarkerAlt, FaCloudSunRain, FaTimes, FaLayerGroup } from 'react-icons/fa';
import { kml as kmlToGeoJSON } from '@tmcw/togeojson';
import '../App.css';

// ==== Study Sites ====
const studySites = {
  'Bengaluru': { center: [77.5946, 12.9716], zoom: 10, hazard: 'Urban Floods', bounds: [[77.4, 12.8], [78.0, 13.2]] },
  'Guwahati': { center: [91.7362, 26.1445], zoom: 11, hazard: 'Compound Pluvial & Fluvial Floods', bounds: [[91.5, 26.0], [91.9, 26.3]] },
  'Anantapur': { center: [77.6000, 14.6819], zoom: 9, hazard: 'Compound Flood & Drought', bounds: [[77.3, 14.5], [78.0, 15.0]] },
  'Dordrecht': { center: [4.6667, 51.8167], zoom: 11, hazard: 'Urban Floods & Evacuation Planning', bounds: [[4.5, 51.7], [4.8, 51.9]] },
  'Tilburg & Breda': { center: [4.8916, 51.5830], zoom: 9, hazard: 'Droughts & Urban Development', bounds: [[4.7, 51.5], [5.2, 51.7]] }
};

// ==== Mock data for right panel ====
const siteData = {
  'Bengaluru': {
    alerts: [{ id: 1, level: 'Moderate', text: 'Heavy rainfall predicted, risk of waterlogging in low-lying areas.' }],
    forecast: [
      { day: 'Mon', rainfall: 25, temp: 28, humidity: 85 },
      { day: 'Tue', rainfall: 40, temp: 27, humidity: 90 },
      { day: 'Wed', rainfall: 15, temp: 29, humidity: 80 },
      { day: 'Thu', rainfall: 5, temp: 30, humidity: 75 },
      { day: 'Fri', rainfall: 10, temp: 31, humidity: 70 },
      { day: 'Sat', rainfall: 30, temp: 29, humidity: 88 },
      { day: 'Sun', rainfall: 20, temp: 28, humidity: 82 },
    ],
    citizenReports: [{ id: 1, user: 'A. Kumar', text: 'Water level rising near Bellandur lake.', time: '1h ago' }]
  },
  'Guwahati': {
    alerts: [{ id: 1, level: 'High', text: 'Brahmaputra river level approaching warning mark. Stay vigilant.' }],
    forecast: [
      { day: 'Mon', rainfall: 50, temp: 30, humidity: 92 },
      { day: 'Tue', rainfall: 65, temp: 29, humidity: 95 },
      { day: 'Wed', rainfall: 30, temp: 31, humidity: 88 },
      { day: 'Thu', rainfall: 20, temp: 32, humidity: 85 },
      { day: 'Fri', rainfall: 25, temp: 32, humidity: 87 },
      { day: 'Sat', rainfall: 45, temp: 30, humidity: 93 },
      { day: 'Sun', rainfall: 55, temp: 29, humidity: 94 },
    ],
    citizenReports: [{ id: 1, user: 'R. Das', text: 'Anil Nagar area is already experiencing some waterlogging.', time: '45m ago' }]
  },
  'Anantapur': {
    alerts: [{ id: 1, level: 'Low', text: 'Scattered thunderstorms possible later this week. No immediate drought relief expected.' }],
    forecast: [
      { day: 'Mon', rainfall: 0, temp: 35, humidity: 40 },
      { day: 'Tue', rainfall: 0, temp: 36, humidity: 38 },
      { day: 'Wed', rainfall: 5, temp: 34, humidity: 50 },
      { day: 'Thu', rainfall: 10, temp: 33, humidity: 55 },
      { day: 'Fri', rainfall: 2, temp: 35, humidity: 45 },
      { day: 'Sat', rainfall: 0, temp: 37, humidity: 35 },
      { day: 'Sun', rainfall: 0, temp: 36, humidity: 37 },
    ],
    citizenReports: [{ id: 1, user: 'Local Farmer', text: 'Soil is extremely dry in Kalyandurg mandal.', time: '8h ago' }]
  },
  'Dordrecht': {
    alerts: [{ id: 1, level: 'Minor', text: 'Elevated river levels due to North Sea tidal surge. No flooding expected.' }],
    forecast: [
      { day: 'Mon', rainfall: 10, temp: 18, humidity: 75 },
      { day: 'Tue', rainfall: 5, temp: 19, humidity: 70 },
      { day: 'Wed', rainfall: 15, temp: 17, humidity: 85 },
      { day: 'Thu', rainfall: 20, temp: 16, humidity: 88 },
      { day: 'Fri', rainfall: 5, temp: 20, humidity: 65 },
      { day: 'Sat', rainfall: 2, temp: 21, humidity: 60 },
      { day: 'Sun', rainfall: 12, temp: 19, humidity: 78 },
    ],
    citizenReports: [{ id: 1, user: 'Water Board', text: 'All flood gates are operating normally.', time: '2h ago' }]
  },
  'Tilburg & Breda': {
    alerts: [{ id: 1, level: 'Low', text: 'Drought conditions persist. Water conservation measures remain in effect.' }],
    forecast: [
      { day: 'Mon', rainfall: 2, temp: 22, humidity: 60 },
      { day: 'Tue', rainfall: 0, temp: 24, humidity: 55 },
      { day: 'Wed', rainfall: 0, temp: 25, humidity: 50 },
      { day: 'Thu', rainfall: 5, temp: 23, humidity: 65 },
      { day: 'Fri', rainfall: 8, temp: 21, humidity: 70 },
      { day: 'Sat', rainfall: 1, temp: 25, humidity: 52 },
      { day: 'Sun', rainfall: 0, temp: 26, humidity: 48 },
    ],
    citizenReports: [{ id: 1, user: 'City Official', text: 'Please continue to limit non-essential water usage.', time: '1d ago' }]
  },
};

// ==== ENV & Tiles ====
const MT_KEY = import.meta.env.VITE_MAPTILER_KEY ?? '';
const OWM_KEY = import.meta.env.VITE_OPENWEATHERMAP_KEY ?? '';
const BHUVAN_KEY = import.meta.env.VITE_BHUVAN_LULC_KEY ?? '';
const hasOWM = !!OWM_KEY;
const hasBhuvan = !!BHUVAN_KEY;
const PUBLIC_FALLBACK = 'https://demotiles.maplibre.org/style.json';

// India sites eligible for LULC stats from Bhuvan
const INDIA_SITES = ['Bengaluru', 'Guwahati', 'Anantapur'];

const baseStyles = {
  Streets: MT_KEY ? `https://api.maptiler.com/maps/streets-v2/style.json?key=${MT_KEY}` : PUBLIC_FALLBACK,
  Satellite: MT_KEY ? `https://api.maptiler.com/maps/hybrid/style.json?key=${MT_KEY}` : PUBLIC_FALLBACK,
  Bright: MT_KEY ? `https://api.maptiler.com/maps/bright-v2/style.json?key=${MT_KEY}` : PUBLIC_FALLBACK,
};

const weatherLayers = hasOWM ? {
  Rain: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
  Clouds: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
  Temp: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
} : {};

const KML_URL = 'https://www.google.com/maps/d/kml?forcekml=1&mid=1GRr_qSOqCC8AdtNGTZG0nr6NlW9B3iY';

export default function Maps() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const defaultMarkersRef = useRef([]);
  const popupRef = useRef(null);
  const cachedSensors = useRef(null);

  const [activeSite, setActiveSite] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('alerts');
  const [mapStyle, setMapStyle] = useState(baseStyles.Streets);
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [sensorsOn, setSensorsOn] = useState(false);
  const [lulcData, setLulcData] = useState(null);
  const [lulcLoading, setLulcLoading] = useState(false);
  const [lulcCollapsed, setLulcCollapsed] = useState(false);

  // Init Map
  useEffect(() => {
    if (mapRef.current) return;
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [78.96, 20.59],
      zoom: 4,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    mapRef.current = map;

    // Add default markers
    Object.entries(studySites).forEach(([name, site]) => {
      // Create a custom container for the pin and label
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';
      container.style.cursor = 'pointer';

      // The label (Site Name)
      const label = document.createElement('div');
      label.textContent = name;
      label.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
      label.style.color = '#0b2244';
      label.style.padding = '6px 12px';
      label.style.borderRadius = '16px';
      label.style.fontSize = '15px';
      label.style.fontWeight = '800';
      label.style.marginBottom = '4px';
      label.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
      label.style.whiteSpace = 'nowrap';
      label.style.border = '2px solid #cbd5e1';

      // The Pin icon (using an SVG)
      const pin = document.createElement('div');
      pin.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="36" height="36" fill="#E63946" style="filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.5));">
          <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
          <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
        </svg>
      `;

      container.appendChild(label);
      container.appendChild(pin);

      const marker = new maplibregl.Marker({ element: container, anchor: 'bottom' })
        .setLngLat(site.center)
        .addTo(map);

      // Declutter overlapping European sites at low zoom
      if (name === 'Dordrecht' || name === 'Tilburg & Breda') {
        const updatePosition = () => {
          const z = map.getZoom();
          if (z < 6) {
            // Spread them slightly apart on the macro map so they are both legible
            if (name === 'Dordrecht') {
              marker.setLngLat([site.center[0] - 0.5, site.center[1] + 0.3]);
            }
            if (name === 'Tilburg & Breda') {
              marker.setLngLat([site.center[0] + 0.5, site.center[1] - 0.3]);
            }
          } else {
            // Snap to exact locations seamlessly when zooming in
            marker.setLngLat(site.center);
          }
        };
        map.on('zoom', updatePosition);
        // Initialize position on load
        updatePosition();
      }

      // Hover effect: Pop the pin slightly
      container.addEventListener('mouseenter', () => {
        pin.style.transform = 'translateY(-4px)';
        label.style.transform = 'translateY(-4px)';
        pin.style.transition = 'transform 0.2s';
        label.style.transition = 'transform 0.2s';
      });
      container.addEventListener('mouseleave', () => {
        pin.style.transform = 'translateY(0)';
        label.style.transform = 'translateY(0)';
      });

      // Click to select site (handles both mouse and touch on modern browsers)
      container.addEventListener('click', (e) => {
        e.stopPropagation();
        handleSiteSelect(name);
      });

      defaultMarkersRef.current.push(marker);
    });
  }, []);

  // Base style switching
  useEffect(() => {
    if (mapRef.current) mapRef.current.setStyle(mapStyle);
  }, [mapStyle]);

  // Weather layers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const handler = () => {
      Object.keys(weatherLayers).forEach((n) => {
        if (map.getLayer(n)) map.removeLayer(n);
        if (map.getSource(n)) map.removeSource(n);
      });
      if (hasOWM && activeOverlay) {
        map.addSource(activeOverlay, { type: 'raster', tiles: [weatherLayers[activeOverlay]], tileSize: 256 });
        map.addLayer({ id: activeOverlay, type: 'raster', source: activeOverlay, paint: { 'raster-opacity': 0.6 } });
      }

      // Re-trigger site boundaries if a site is currently active
      // MapLibre removes non-base layers on setStyle
      if (activeSite) {
        // Use a timeout to ensure the style is fully parsed before adding sources
        setTimeout(() => {
          // Need to read fresh state, but since this is in an effect, we rely on the component re-rendering
          // when activeSite changes. However, activeSite inside this closure might be stale if we don't put it in dependency array.
          // Let's use a ref or just call it directly since we will add activeSite to deps.
          handleSiteSelect(activeSite, true);
        }, 50);
      }
    };
    map.on('style.load', handler);
    handler();
    return () => map.off('style.load', handler);
  }, [activeOverlay, mapStyle, activeSite]);

  // ==== Sensors (Improved marker styling) ====
  const loadSensors = async () => {
    if (!cachedSensors.current) {
      const res = await fetch(KML_URL);
      const text = await res.text();
      const xml = new DOMParser().parseFromString(text, 'text/xml');
      const geojson = kmlToGeoJSON(xml);

      // Inject "firstName" by parsing the full name of each sensor
      geojson.features.forEach(f => {
        const fullName = f.properties.Name || f.properties.name || 'Sensor';
        f.properties.firstName = fullName.split(' ')[0];
      });
      cachedSensors.current = geojson;
    }
    const gj = cachedSensors.current;
    const map = mapRef.current;

    if (!map.getSource('guw-sensors')) {
      map.addSource('guw-sensors', { type: 'geojson', data: gj });

      // Neon cyan, calm tone + glow
      map.addLayer({
        id: 'guw-sensors',
        type: 'circle',
        source: 'guw-sensors',
        paint: {
          'circle-radius': 6,
          'circle-color': '#00e5ff',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.95,
        },
      });

      map.addLayer({
        id: 'guw-sensors-glow',
        type: 'circle',
        source: 'guw-sensors',
        paint: {
          'circle-radius': 12,
          'circle-color': '#00e5ff',
          'circle-opacity': 0.15,
        },
      });

      // Show sensor first name just above the pin
      map.addLayer({
        id: 'guw-sensors-label',
        type: 'symbol',
        source: 'guw-sensors',
        layout: {
          'text-field': ['get', 'firstName'],
          'text-size': 12,
          'text-offset': [0, -1.5],
          'text-anchor': 'bottom'
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#000000',
          'text-halo-width': 1.5
        }
      });
    }

    map.on('click', 'guw-sensors', (e) => {
      const f = e.features[0];
      const name = f.properties.Name || f.properties.name || 'Sensor';
      const desc = f.properties.description || '';
      const cleanDesc = desc.replace(/[\{\}@type"value":]|html|Sl\. No\.:/g, '').replace(/\n/g, '<br/>');
      if (popupRef.current) popupRef.current.remove();
      popupRef.current = new maplibregl.Popup({ offset: 15, closeButton: true, closeOnMove: true })
        .setLngLat(f.geometry.coordinates)
        .setHTML(`
          <div style="font-family:sans-serif;font-size:13px;max-width:240px">
            <div style="font-weight:600;color:#111;margin-bottom:4px">${name}</div>
            <div style="line-height:1.3;color:#444;">${cleanDesc}</div>
          </div>
        `)
        .addTo(map);
    });

    // Fit bounds
    const pts = gj.features.filter(f => f.geometry?.type === 'Point').map(f => f.geometry.coordinates);
    if (pts.length) {
      const lons = pts.map(c => c[0]);
      const lats = pts.map(c => c[1]);
      const sw = [Math.min(...lons), Math.min(...lats)];
      const ne = [Math.max(...lons), Math.max(...lats)];
      map.fitBounds([sw, ne], { padding: 50 });
    }
  };

  const removeSensors = () => {
    const map = mapRef.current;
    if (!map) return;
    if (popupRef.current) popupRef.current.remove();
    if (map.getLayer('guw-sensors-label')) map.removeLayer('guw-sensors-label');
    if (map.getLayer('guw-sensors-glow')) map.removeLayer('guw-sensors-glow');
    if (map.getLayer('guw-sensors')) map.removeLayer('guw-sensors');
    if (map.getSource('guw-sensors')) map.removeSource('guw-sensors');
  };

  const toggleSensors = async () => {
    if (sensorsOn) {
      removeSensors();
      setSensorsOn(false);
    } else {
      await loadSensors();
      setSensorsOn(true);
    }
  };

  // ==== LULC Stats from Bhuvan Portal ====
  const fetchLulcStats = async (siteName) => {
    if (!hasBhuvan || !INDIA_SITES.includes(siteName)) {
      setLulcData(null);
      return;
    }
    const site = studySites[siteName];
    const [[minLng, minLat], [maxLng, maxLat]] = site.bounds;
    // WKT polygon from site bounding box
    const wkt = `POLYGON ((${minLng} ${minLat}, ${maxLng} ${minLat}, ${maxLng} ${maxLat}, ${minLng} ${maxLat}, ${minLng} ${minLat}))`;

    setLulcLoading(true);
    setLulcData(null);
    setLulcCollapsed(false);
    try {
      // Bhuvan's curl_lulc250k.php reads $_GET — send params as query string
      // Year format is fiscal year e.g. 2018_19 (latest available)
      const params = new URLSearchParams({
        polygon: wkt,
        year: '2018_19',
        option: 'json',
        token: BHUVAN_KEY,
      });

      const res = await fetch(`/bhuvan-api/lulc250k/curl_lulc250k.php?${params.toString()}`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      // Bhuvan wraps the JSON in an HTML prefix — extract the JSON array starting at '['
      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']');
      if (jsonStart === -1 || jsonEnd === -1) throw new Error(`No JSON found — got: ${text.slice(0, 80)}`);
      const jsonText = text.slice(jsonStart, jsonEnd + 1);
      let parsed;
      try { parsed = JSON.parse(jsonText); } catch { throw new Error(`JSON parse failed: ${jsonText.slice(0, 80)}`); }
      // API returns: [{"Year":"2018_19", "LULC Description":"Built-up", "Area in Sq. Km":"1.90"}, ...]
      const rows = Array.isArray(parsed) ? parsed : (parsed.data ?? parsed.result ?? null);
      if (!rows || rows.length === 0) throw new Error('No data rows');
      setLulcData({ site: siteName, year: '2018-19', rows });
    } catch (err) {
      console.warn('[LULC] Bhuvan API unavailable or returned no data:', err.message);
      setLulcData(null);
    } finally {
      setLulcLoading(false);
    }
  };

  // ==== Site selection (with translucent bounding box) ====
  const handleSiteSelect = async (siteName, isRefresh = false) => {
    const map = mapRef.current;
    if (!map) return;

    if (!siteName) {
      setActiveSite(null);
      setPanelOpen(false);
      setLulcData(null);
      setLulcCollapsed(false);
      if (markerRef.current) markerRef.current.remove();
      removeSensors();
      if (map.getLayer('site-boundary-label-layer')) map.removeLayer('site-boundary-label-layer');
      if (map.getLayer('site-boundary-layer')) map.removeLayer('site-boundary-layer');
      if (map.getSource('site-boundary')) map.removeSource('site-boundary');
      if (map.getSource('site-boundary-label')) map.removeSource('site-boundary-label');

      // Restore default markers
      defaultMarkersRef.current.forEach(m => m.addTo(map));
      map.flyTo({ center: [78.96, 20.59], zoom: 4 });
      return;
    }

    const site = studySites[siteName];
    setActiveSite(siteName);
    setPanelOpen(true);
    setActiveTab('alerts');

    if (!isRefresh) {
      // Hide default markers when zooming in
      defaultMarkersRef.current.forEach(m => m.remove());

      // Use fitBounds to ensure the entire site boundary is visible, accounting for the left side panel
      const isMobile = window.innerWidth <= 768;
      map.fitBounds(site.bounds, {
        padding: isMobile
          ? { top: 50, bottom: 50, left: 50, right: 50 }
          : { top: 100, bottom: 50, left: 450, right: 50 },
        duration: 1000
      });
    }

    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    const [sw, ne] = site.bounds;
    const boundary = {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [[[sw[0], sw[1]], [ne[0], sw[1]], [ne[0], ne[1]], [sw[0], ne[1]], [sw[0], sw[1]]]] }
    };
    // Calculate position for the top-left corner above the line
    const leftLng = sw[0];
    const topLat = ne[1]; // Set exactly on the northern edge of the box

    const boundaryLabelPoint = {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [leftLng, topLat] },
      properties: { title: siteName }
    };

    console.log(`Setting bounds for ${siteName}. isRefresh=${isRefresh}`);
    // Always remove existing layers and sources first to ensure a clean update
    if (map.getLayer('site-boundary-label-layer')) map.removeLayer('site-boundary-label-layer');
    if (map.getLayer('site-boundary-layer')) map.removeLayer('site-boundary-layer');
    if (map.getSource('site-boundary')) map.removeSource('site-boundary');
    if (map.getSource('site-boundary-label')) map.removeSource('site-boundary-label');

    console.log('Adding fresh site-boundary source and layer');
    map.addSource('site-boundary', { type: 'geojson', data: boundary });
    map.addLayer({
      id: 'site-boundary-layer',
      type: 'fill',
      source: 'site-boundary',
      paint: { 'fill-color': '#1D3557', 'fill-opacity': 0.25 }
    });

    console.log('Adding fresh site-boundary-label source and layer with title:', siteName);
    map.addSource('site-boundary-label', { type: 'geojson', data: boundaryLabelPoint });
    map.addLayer({
      id: 'site-boundary-label-layer',
      type: 'symbol',
      source: 'site-boundary-label',
      layout: {
        'text-field': ['get', 'title'],
        'text-size': 26,
        'text-anchor': 'bottom-left',
        'text-offset': [0.2, 0] // Slightly pushing right so it isn't literally touching the left edge, and exactly 0 on the Y axis
      },
      paint: {
        'text-color': '#1D3557',
        'text-halo-color': '#ffffff',
        'text-halo-width': 3
      }
    });

    if (siteName !== 'Guwahati') {
      removeSensors();
      setSensorsOn(false);
    } else if (sensorsOn) {
      await loadSensors();
    }

    // Fetch LULC stats for India sites (skip on style refresh)
    if (!isRefresh) fetchLulcStats(siteName);
  };

  const currentSiteData = activeSite ? siteData[activeSite] : null;

  return (
    <div className="map-page-wrapper">
      <div className="map-top-bar">
        <div className="map-logo">LODESTAR Geo-Dashboard</div>
        <select className="site-selector" onChange={(e) => handleSiteSelect(e.target.value)} value={activeSite || ""}>
          <option value="">-- Select a Study Site --</option>
          {Object.keys(studySites).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div ref={mapContainer} className="map-container-full" />

      <div className="map-controls-bottom-right">

        {/* === LULC Stats Section — only shown when data or loading === */}
        {hasBhuvan && activeSite && INDIA_SITES.includes(activeSite) && (lulcLoading || lulcData) && (
          <>
            <h4>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="currentColor" style={{ marginRight: 5, verticalAlign: 'middle' }}><path d="M3 3h18v2H3zm0 4h18v2H3zm0 4h10v2H3zm0 4h10v2H3zm12 0h6v6h-6z" /></svg>
              LULC Statistics
            </h4>
            <div className="control-group">
              {lulcLoading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, opacity: 0.75, padding: '4px 0' }}>
                  <span className="lulc-spinner" />Loading LULC data…
                </div>
              )}
              {!lulcLoading && lulcData && (
                <div className="lulc-inline">
                  {/* Clickable header row — toggles table open/closed */}
                  <div
                    className="lulc-inline-meta"
                    onClick={() => setLulcCollapsed(c => !c)}
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                    title={lulcCollapsed ? 'Expand LULC data' : 'Collapse LULC data'}
                  >
                    <span className="lulc-badge">LULC 250K</span>
                    <span style={{ fontSize: 11, opacity: 0.6, marginLeft: 4 }}>2018-19 &bull; Bhuvan ISRO</span>
                    <span style={{ marginLeft: 'auto', fontSize: 13, opacity: 0.55, fontWeight: 600, letterSpacing: 0 }}>
                      {lulcCollapsed ? '^' : 'v'}
                    </span>
                  </div>
                  {!lulcCollapsed && (
                    <table className="lulc-table">
                      <thead>
                        <tr><th>Land Cover Class</th><th>Area (km²)</th></tr>
                      </thead>
                      <tbody>
                        {lulcData.rows.slice(0, 8).map((row, i) => {
                          const cls = row['LULC Description'] ?? row.lulc_class ?? row.class ?? row.name ?? `Class ${i + 1}`;
                          const area = row['Area in Sq. Km'] ?? row.area ?? row.area_km2 ?? '—';
                          return (
                            <tr key={i}>
                              <td>{typeof cls === 'string' ? cls.trim() : cls}</td>
                              <td>{typeof area === 'number' ? area.toFixed(2) : area}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </>
        )}
        <h4><FaLayerGroup /> Map Layers</h4>
        <div className="control-group">
          {Object.keys(baseStyles).map((n) => (
            <button key={n} className={`map-control-btn ${mapStyle === baseStyles[n] ? 'active' : ''}`} onClick={() => setMapStyle(baseStyles[n])}>{n}</button>
          ))}
        </div>

        <h4><FaCloudSunRain /> Weather Overlays</h4>
        <div className="control-group">
          {hasOWM ? Object.keys(weatherLayers).map((n) => (
            <button key={n} className={`map-control-btn ${activeOverlay === n ? 'active' : ''}`} onClick={() => setActiveOverlay(p => p === n ? null : n)}>{n}</button>
          )) : <small style={{ opacity: 0.7 }}>Add <code>VITE_OPENWEATHERMAP_KEY</code> in <code>.env</code></small>}
        </div>

        {activeSite === 'Guwahati' && (
          <>
            <h4>Data Layers</h4>
            <div className="control-group">
              <button className={`map-control-btn ${sensorsOn ? 'active' : ''}`} onClick={toggleSensors}>Guwahati Water Sensors</button>
            </div>
          </>
        )}
      </div>

      {/* === Right Panel === */}
      <div className={`side-panel ${panelOpen ? 'open' : ''}`}>
        {currentSiteData ? (
          <>
            <button className="panel-close-btn" onClick={() => setPanelOpen(false)}><FaTimes /></button>
            <div className="panel-header"><FaMapMarkerAlt /> <h2>{activeSite}</h2></div>
            <p className="panel-sub-header">Focus: {studySites[activeSite].hazard}</p>

            <div className="panel-tabs">
              <button className={activeTab === 'alerts' ? 'active' : ''} onClick={() => setActiveTab('alerts')}>Alerts</button>
              <button className={activeTab === 'forecast' ? 'active' : ''} onClick={() => setActiveTab('forecast')}>Forecast</button>
              <button className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}>Reports</button>
            </div>

            <div className="panel-content">
              {activeTab === 'alerts' && (
                <div className="panel-section">
                  {currentSiteData.alerts.map(a => (
                    <div key={a.id} className={`alert-item alert-${a.level.toLowerCase()}`}>
                      <strong>{a.level}:</strong> {a.text}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'forecast' && (
                <div className="panel-section">
                  <h4 className="chart-title">7-Day Forecast</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={currentSiteData.forecast}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis yAxisId="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="rainfall" stroke="#3B82F6" strokeWidth={2} />
                      <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#EF4444" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="panel-section">
                  <div className="reports-list">
                    {currentSiteData.citizenReports.map(r => (
                      <div key={r.id} className="report-item">
                        <p>"{r.text}"</p>
                        <span>- {r.user}, {r.time}</span>
                      </div>
                    ))}
                  </div>
                  <button className="cta-button panel-cta">Submit a Report</button>
                </div>
              )}
            </div>
          </>
        ) : <div className="panel-placeholder"><p>Select a study site to view details.</p></div>}
      </div>
    </div>
  );
}
