/* eslint-disable no-console */
// src/pages/Maps.jsx
import { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { FaMapMarkerAlt, FaCloudSunRain, FaTimes, FaLayerGroup, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { kml as kmlToGeoJSON } from '@tmcw/togeojson';
import '../App.css';
import { fetchWeatherData } from '../services/weatherService';
import sensorConfig from '../data/sensors.config.json';
import { testSensor, fetchSensorData } from '../services/sensorApi';
import NetherlandsVisualsModal from '../components/NetherlandsVisualsModal';
import NetherlandsTimeSlider from '../components/NetherlandsTimeSlider';
import { parseGeoTiff } from '../utils/tiffParser';

const formatShortDate = (dateStr) => {
  if (!dateStr) return '';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${months[parseInt(parts[1], 10) - 1]} ${parseInt(parts[2], 10)}`;
  }
  return dateStr;
};

// ==== Study Sites ====
const studySites = {
  'Bengaluru': { center: [77.5946, 12.9716], zoom: 10, hazard: 'Urban Floods', bounds: [[77.4, 12.8], [78.0, 13.2]] },
  'Guwahati': { center: [91.7362, 26.1445], zoom: 11, hazard: 'Compound Pluvial & Fluvial Floods', bounds: [[91.5, 26.0], [91.9, 26.3]] },
  'Anantapur': { center: [77.6000, 14.6819], zoom: 9, hazard: 'Compound Flood & Drought', bounds: [[77.3, 14.5], [78.0, 15.0]] },
  'Dordrecht': { center: [4.6667, 51.8167], zoom: 11, hazard: 'Urban Floods & Evacuation Planning', bounds: [[4.5, 51.7], [4.8, 51.9]] },
  'Geertruidenberg': { center: [4.8617, 51.7017], zoom: 9, hazard: 'Droughts & Urban Development', bounds: [[4.7, 51.5], [5.2, 51.7]] }
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
  'Geertruidenberg': {
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
const hasOWM = !!OWM_KEY;
const PUBLIC_FALLBACK = 'https://demotiles.maplibre.org/style.json';
// India sites eligible for LULC stats from Bhuvan
const INDIA_SITES = ['Bengaluru', 'Guwahati', 'Anantapur'];

// Hardcoded LULC 250K data (2018-19) for the 3 Indian sites to guarantee 100% uptime on GitHub Pages
// bypassing Bhuvan's API proxy blocks, CORS issues, and daily token expirations.
const STATIC_LULC_DATA = {
  Bengaluru: {
    year: '2018-19',
    rows: [
      { "class": "Built-up", "area_km2": 932.73 },
      { "class": "Kharif Crop", "area_km2": 454.26 },
      { "class": "Plantation", "area_km2": 393.18 },
      { "class": "Double/Triple Crop", "area_km2": 196.48 },
      { "class": "Rabi Crop", "area_km2": 150.39 },
      { "class": "Current Fallow", "area_km2": 113.88 },
      { "class": "Deciduous Forest", "area_km2": 80.51 },
      { "class": "Wasteland", "area_km2": 66.82 }
    ]
  },
  Guwahati: {
    year: '2018-19',
    rows: [
      { "class": "Evergreen/Semi-evergreen", "area_km2": 526.96 },
      { "class": "Deciduous Forest", "area_km2": 376.10 },
      { "class": "Built-up", "area_km2": 204.34 },
      { "class": "Plantation", "area_km2": 139.75 },
      { "class": "Waterbodies max", "area_km2": 97.46 },
      { "class": "Kharif Crop", "area_km2": 89.47 },
      { "class": "Degraded/Scrub Forest", "area_km2": 52.80 },
      { "class": "Current Fallow", "area_km2": 26.56 }
    ]
  },
  Anantapur: {
    year: '2018-19',
    rows: [
      { "class": "Kharif Crop", "area_km2": 2189.65 },
      { "class": "Wasteland", "area_km2": 414.93 },
      { "class": "Deciduous Forest", "area_km2": 140.40 },
      { "class": "Current Fallow", "area_km2": 90.58 },
      { "class": "Built-up", "area_km2": 72.93 },
      { "class": "Degraded/Scrub Forest", "area_km2": 63.88 },
      { "class": "Double/Triple Crop", "area_km2": 59.56 },
      { "class": "Plantation", "area_km2": 47.92 }
    ]
  }
};

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
  const sensorMarkersRef = useRef([]);
  const popupRef = useRef(null);
  const cachedSensors = useRef(null);
  // Double-buffer refs for smooth raster crossfade
  const rasterSlotRef = useRef(0);      // alternates 0 vs 1
  const rasterFittedRef = useRef(false); // has map been zoomed to imagery yet?
  const activeSiteRef = useRef(null);    // stable read of activeSite for callbacks

  const [activeSite, setActiveSite] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('alerts');
  const [mapStyle, setMapStyle] = useState(baseStyles.Streets);
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [sensorsOn, setSensorsOn] = useState(false);
  const [lulcData, setLulcData] = useState(null);
  const [lulcLoading, setLulcLoading] = useState(false);
  const [lulcCollapsed, setLulcCollapsed] = useState(false);
  const [realSensors, setRealSensors] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [sensorDataLoading, setSensorDataLoading] = useState(false);
  const [sensorData, setSensorData] = useState(null);
  const [sensorStatusLog, setSensorStatusLog] = useState([]);
  const [showNlModal, setShowNlModal] = useState(false);
  const [showNlRasterPanel, setShowNlRasterPanel] = useState(false);

  // Weather States
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [rasterLoading, setRasterLoading] = useState(false);

  // ==== Raster Overlay Logic (double-buffer crossfade) ====

  // Remove both buffer slots cleanly
  const removeRasterOverlay = () => {
    const map = mapRef.current;
    if (!map) return;
    [0, 1].forEach(i => {
      if (map.getLayer(`sentinel-raster-layer-${i}`)) map.removeLayer(`sentinel-raster-layer-${i}`);
      if (map.getSource(`sentinel-raster-source-${i}`)) map.removeSource(`sentinel-raster-source-${i}`);
    });
    rasterSlotRef.current = 0;
    rasterFittedRef.current = false;
  };

  // Pre-warm the parse cache for all 6 COG frames in the background
  // so when the user hits play, each frame switches instantly
  const preloadRasterFrames = useCallback(() => {
    const FILES = [
      '2023-06-11_cog.tiff', '2023-06-16_cog.tiff', '2023-06-28_cog.tiff',
      '2023-06-30_cog.tiff', '2023-07-05_cog.tiff', '2023-07-22_cog.tiff',
    ];
    FILES.forEach(f => {
      parseGeoTiff(`${import.meta.env.BASE_URL}sentinel_cog/${f}`).catch(() => {});
    });
  }, []);

  const handleRasterDateChange = useCallback(async (filename, label) => {
    const map = mapRef.current;
    if (!map) return;

    const doLoad = async () => {
      setRasterLoading(true);
      try {
        const url = `${import.meta.env.BASE_URL}sentinel_cog/${filename}`;
        const { url: dataUrl, coordinates, bbox } = await parseGeoTiff(url);

        // --- Double-buffer crossfade ---
        const currentSlot = rasterSlotRef.current;
        const nextSlot = 1 - currentSlot;
        const currentLayerId  = `sentinel-raster-layer-${currentSlot}`;
        const nextLayerId     = `sentinel-raster-layer-${nextSlot}`;
        const nextSourceId    = `sentinel-raster-source-${nextSlot}`;
        const currentSourceId = `sentinel-raster-source-${currentSlot}`;

        // Clean up the next slot from any previous cycle
        if (map.getLayer(nextLayerId))   map.removeLayer(nextLayerId);
        if (map.getSource(nextSourceId)) map.removeSource(nextSourceId);

        // Add new frame at opacity 0 (invisible, on top of current)
        map.addSource(nextSourceId, { type: 'image', url: dataUrl, coordinates });
        map.addLayer({
          id: nextLayerId,
          type: 'raster',
          source: nextSourceId,
          paint: { 'raster-opacity': 0, 'raster-fade-duration': 0 },
        });

        // Crossfade: ease next IN and current OUT simultaneously
        const FADE_MS = 600;
        const TARGET_OPACITY = 0.85;
        const startTime = performance.now();

        const animate = (now) => {
          const t = Math.min((now - startTime) / FADE_MS, 1);
          // Ease-in-out quad
          const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

          if (map.getLayer(nextLayerId)) {
            map.setPaintProperty(nextLayerId, 'raster-opacity', eased * TARGET_OPACITY);
          }
          if (map.getLayer(currentLayerId)) {
            map.setPaintProperty(currentLayerId, 'raster-opacity', (1 - eased) * TARGET_OPACITY);
          }

          if (t < 1) {
            requestAnimationFrame(animate);
          } else {
            // Fade complete — drop the old layer
            if (map.getLayer(currentLayerId))   map.removeLayer(currentLayerId);
            if (map.getSource(currentSourceId)) map.removeSource(currentSourceId);
          }
        };
        requestAnimationFrame(animate);

        // Swap active slot
        rasterSlotRef.current = nextSlot;

        // Zoom to image on first enable — using the actual bbox from the file
        // with balanced padding to keep it centered in the visible area.
        if (!rasterFittedRef.current && bbox && bbox.length === 4) {
          rasterFittedRef.current = true;
          const [minLon, minLat, maxLon, maxLat] = bbox;
          map.fitBounds(
            [[minLon, minLat], [maxLon, maxLat]],
            {
              padding: { top: 250, bottom: 250, left: 630, right: 250 },
              duration: 900,
              maxZoom: 14,
            }
          );
        }
      } catch (err) {
        console.error('[Raster] Failed to load overlay:', err);
      } finally {
        setRasterLoading(false);
      }
    };

    if (map.isStyleLoaded()) {
      await doLoad();
    } else {
      map.once('style.load', () => doLoad());
    }
  }, []); // stable — all deps are refs or module-level constants

  const toggleNlRaster = useCallback(() => {
    setShowNlRasterPanel(prev => {
      if (prev) {
        removeRasterOverlay();
        // Zoom back to the site's normal view (Guwahati)
        const map = mapRef.current;
        const site = studySites['Guwahati']; // Always Guwahati for this layer
        if (map && site) {
          map.fitBounds(site.bounds, {
            padding: { top: 100, bottom: 50, left: 450, right: 50 },
            duration: 900,
          });
        }
        return false;
      } else {
        preloadRasterFrames();
        return true;
      }
    });
  }, [removeRasterOverlay, preloadRasterFrames]);

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

      marker.siteName = name;

      // Declutter overlapping European sites at low zoom
      if (name === 'Dordrecht' || name === 'Geertruidenberg') {
        const updatePosition = () => {
          const z = map.getZoom();
          if (z < 6) {
            // Spread them slightly apart on the macro map so they are both legible
            if (name === 'Dordrecht') {
              marker.setLngLat([site.center[0] - 0.5, site.center[1] + 0.3]);
            }
            if (name === 'Geertruidenberg') {
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

  // ==== Sensors (Real API Integration) ====
  const loadSensors = async () => {
    const map = mapRef.current;
    if (!map) return;

    const sensorsToRender = [];

    for (const sensor of sensorConfig) {
      if (!sensor.visible) continue;

      const result = await testSensor(sensor.uid);
      const isOnline = result.online;
      
      let lat = sensor.lat;
      let lon = sensor.lon;

      if (result.location) {
        lat = result.location.lat;
        lon = result.location.lon;
      }

      if (lat && lon) {
        sensorsToRender.push({
          ...sensor,
          lat,
          lon,
          online: isOnline,
          latestData: result.data
        });
      }
    }

    setRealSensors(sensorsToRender);

    // Create markers for sensors with coordinates
    sensorsToRender.forEach(sensor => {
      const el = document.createElement('div');
      el.className = `sensor-marker ${sensor.online ? 'sensor-marker-static-green' : 'sensor-marker-static-red'}`;
      el.title = `${sensor.name} (${sensor.uid})`;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([sensor.lon, sensor.lat])
        .addTo(map);

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        handleSensorClick(sensor);
      });

      sensorMarkersRef.current.push(marker); // Keep separate from default markers

    });
  };

  const handleSensorClick = async (sensor) => {
    setSelectedSensor(sensor);
    setPanelOpen(true);
    setActiveTab('sensor');
    setSensorDataLoading(true);

    try {
      const endTime = Math.floor(Date.now() / 1000);
      const startTime = endTime - 86400;
      const data = await fetchSensorData(sensor.uid, startTime, endTime);
      setSensorData(data);
    } catch (err) {
      console.error('Failed to fetch sensor data', err);
    } finally {
      setSensorDataLoading(false);
    }
  };

  const removeSensors = () => {
    const map = mapRef.current;
    if (!map) return;
    if (popupRef.current) popupRef.current.remove();
    // Clean up sensor markers
    if (sensorMarkersRef.current) {
      sensorMarkersRef.current.forEach(m => m.remove());
      sensorMarkersRef.current = [];
    }
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

  // ==== LULC Stats from Static Offline Data ====
  const fetchLulcStats = async (siteName) => {
    if (!INDIA_SITES.includes(siteName)) {
      setLulcData(null);
      return;
    }

    // Instantly load the hardcoded 2018-19 offline data
    setLulcLoading(true);
    setLulcCollapsed(false);

    // Simulate a tiny network delay so the UX still feels like it's "loading" data,
    // which gives better visual feedback than popping in violently.
    setTimeout(() => {
      setLulcData(STATIC_LULC_DATA[siteName]);
      setLulcLoading(false);
    }, 400);
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
      removeRasterOverlay();
      setShowNlRasterPanel(false);
      if (map.getLayer('site-boundary-label-layer')) map.removeLayer('site-boundary-label-layer');
      if (map.getLayer('site-boundary-layer')) map.removeLayer('site-boundary-layer');
      if (map.getSource('site-boundary')) map.removeSource('site-boundary');
      if (map.getSource('site-boundary-label')) map.removeSource('site-boundary-label');

      // Restore ALL markers to default state
      defaultMarkersRef.current.forEach(m => m.addTo(map));
      map.flyTo({ center: [78.96, 20.59], zoom: 4 });
      return;
    }

    const site = studySites[siteName];
    setActiveSite(siteName);
    setPanelOpen(true);
    setActiveTab('forecast');

    if (!isRefresh) {
      // Hide ONLY the selected site's marker (bounding box takes over), keep others visible
      defaultMarkersRef.current.forEach(m => {
        if (m.siteName === siteName) {
          m.remove();
        } else {
          m.addTo(map);
        }
      });

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
  // True when sensors are toggled on but every sensor came back offline
  const allSensorsOffline = sensorsOn && realSensors.length > 0 && realSensors.every(s => !s.online);

  // ==== Fetch Weather Data Effect ====
  useEffect(() => {
    if (activeSite) {
      const fetchWeather = async () => {
        setWeatherLoading(true);
        setWeatherError(null);
        try {
          const site = studySites[activeSite];
          // Lng is center[0], Lat is center[1]
          const data = await fetchWeatherData(activeSite, site.center[1], site.center[0]);
          setWeatherData(data);
        } catch (err) {
          setWeatherError('Failed to load weather data.');
        } finally {
          setWeatherLoading(false);
        }
      };
      fetchWeather();
    } else {
      setWeatherData(null);
    }
  }, [activeSite]);

  // Keep activeSiteRef in sync so stable useCallback functions can read current site
  useEffect(() => { activeSiteRef.current = activeSite; }, [activeSite]);

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
        {activeSite && INDIA_SITES.includes(activeSite) && (lulcLoading || lulcData) && (
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
                        {lulcData.rows.slice(0, 8).map((row, i) => (
                          <tr key={i}>
                            <td>{row.class}</td>
                            <td>{row.area_km2.toFixed(2)}</td>
                          </tr>
                        ))}
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
            <div className="control-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button className={`map-control-btn ${sensorsOn ? 'active' : ''}`} onClick={toggleSensors}>Guwahati Water Sensors</button>
              {allSensorsOffline && (
                <div style={{
                  fontSize: '11px',
                  color: '#ff3366',
                  backgroundColor: 'rgba(255,51,102,0.08)',
                  border: '1px solid rgba(255,51,102,0.25)',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontWeight: 600,
                }}>
                  ⚠️ All sensors offline
                </div>
              )}
              <button
                className={`map-control-btn ${showNlRasterPanel ? 'active' : ''}`}
                onClick={toggleNlRaster}
                style={showNlRasterPanel ? { backgroundColor: '#10b981', color: '#fff', borderColor: '#059669' } : {}}
              >
                {showNlRasterPanel ? 'Disable Satellite Overlay' : 'Enable Satellite Overlay'}
              </button>
            </div>
          </>
        )}

        {['Dordrecht'].includes(activeSite) && (
          <>
            <h4>Data Layers</h4>
            <div className="control-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button className={`map-control-btn ${showNlModal ? 'active' : ''}`} onClick={() => setShowNlModal(true)}>Netherlands Study Visuals</button>
            </div>
          </>
        )}
      </div>

      {/* === Open Panel Handle === */}
      {activeSite && !panelOpen && (
        <button className="panel-open-handle" onClick={() => setPanelOpen(true)}>
          <FaAngleDoubleRight />
        </button>
      )}

      {/* === Right Panel === */}
      <div className={`side-panel ${panelOpen ? 'open' : ''}`}>
        {currentSiteData ? (
          <>
            <button className="panel-retract-btn" onClick={() => setPanelOpen(false)} title="Retract Panel"><FaAngleDoubleLeft /></button>
            <div className="panel-header"><FaMapMarkerAlt /> <h2>{activeSite}</h2></div>
            <p className="panel-sub-header">Focus: {studySites[activeSite].hazard}</p>

            {/* SENSOR QUICK-VIEW (Placed above tabs/forecast) */}
            {activeSite === 'Guwahati' && sensorsOn && allSensorsOffline && (
              <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255,51,102,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff3366', fontWeight: 700, fontSize: '0.85rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>📡</span>
                  All Water Sensors Offline
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  The Guwahati sensor network is not reporting data right now. Sensors typically go offline at night or during connectivity issues. Check back during daytime hours.
                </p>
              </div>
            )}
            {activeSite === 'Guwahati' && sensorsOn && !allSensorsOffline && selectedSensor && (
               <div style={{ padding: '0 1.5rem 1rem 1.5rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(0,255,204,0.03)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0 0.5rem 0' }}>
                   <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>📡 {selectedSensor.name}</h3>
                   <span className={selectedSensor.online ? 'sensor-badge-online' : 'sensor-badge-offline'}>
                     {selectedSensor.online ? 'LIVE' : 'OFFLINE'}
                   </span>
                 </div>
                 {sensorData && sensorData.length > 0 ? (
                   <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                     {selectedSensor.type === 'rain_gauge' ? 'Precipitation: ' : 'Water Level: '}
                     {selectedSensor.type === 'rain_gauge' 
                       ? `${sensorData[sensorData.length - 1].daily_rain_mm ?? 0} mm`
                       : `${sensorData[sensorData.length - 1].water_level ?? 0} m`
                     }
                     <span style={{ marginLeft: '8px', fontSize: '0.75rem', opacity: 0.6, fontWeight: 'normal' }}>
                       ({new Date(sensorData[sensorData.length - 1].date_time).toLocaleTimeString()})
                     </span>
                   </div>
                 ) : <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>Waiting for data...</div>}
               </div>
            )}

            <div className="panel-tabs">
              <button className={activeTab === 'forecast' ? 'active' : ''} onClick={() => setActiveTab('forecast')}>Forecast</button>
              <button className={activeTab === 'alerts' ? 'active' : ''} onClick={() => setActiveTab('alerts')}>Alerts</button>
              <button className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}>Reports</button>
              {selectedSensor && <button className={activeTab === 'sensor' ? 'active' : ''} onClick={() => setActiveTab('sensor')}>Sensor</button>}
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
                  {weatherLoading && <div style={{textAlign: 'center', padding: '20px', opacity: 0.7}}>Loading weather data...</div>}
                  {weatherError && <div style={{color: '#EF4444', padding: '10px'}}>{weatherError}</div>}
                  {!weatherLoading && !weatherError && weatherData && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Today's Details</h4>
                        <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600', backgroundColor: '#e2e8f0', padding: '2px 8px', borderRadius: '12px' }}>
                          {formatShortDate(weatherData.today.day || new Date().toISOString().split('T')[0])}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <div style={{ flex: 1, backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>Temperature</div>
                          <div style={{ fontSize: '18px', color: '#0f172a', fontWeight: '800' }}>{weatherData.today.temp}°C</div>
                        </div>
                        <div style={{ flex: 1, backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>Precipitation</div>
                          <div style={{ fontSize: '18px', color: '#0f172a', fontWeight: '800' }}>{weatherData.today.precipitation} mm</div>
                        </div>
                        <div style={{ flex: 1, backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>Humidity</div>
                          <div style={{ fontSize: '18px', color: '#0f172a', fontWeight: '800' }}>{weatherData.today.humidity}%</div>
                        </div>
                      </div>

                      <h4 className="chart-title">Past 6 days (historical data)</h4>
                      <ResponsiveContainer width="100%" height={200} style={{ marginBottom: '20px' }}>
                        <LineChart data={weatherData.past7Days}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" tick={{fontSize: 10}} tickMargin={5} tickFormatter={formatShortDate} />
                          <YAxis yAxisId="left" stroke="#8884d8" width={30} tick={{fontSize: 10}} />
                          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" width={30} tick={{fontSize: 10}} />
                          <Tooltip contentStyle={{fontSize: '12px'}} />
                          <Legend wrapperStyle={{fontSize: "11px", paddingTop: "5px"}} />
                          <Line yAxisId="left" type="monotone" name="Temp (°C)" dataKey="temp" stroke="#EF4444" strokeWidth={2} dot={{r: 2}} />
                          <Line yAxisId="left" type="monotone" name="Precip (mm)" dataKey="precipitation" stroke="#3B82F6" strokeWidth={2} dot={{r: 2}} />
                          <Line yAxisId="right" type="monotone" name="Humidity (%)" dataKey="humidity" stroke="#10B981" strokeWidth={2} dot={{r: 2}} />
                        </LineChart>
                      </ResponsiveContainer>

                      <h4 className="chart-title">Next 6 days (forecast)</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={weatherData.future7Days}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" tick={{fontSize: 10}} tickMargin={5} tickFormatter={formatShortDate} />
                          <YAxis yAxisId="left" stroke="#8884d8" width={30} tick={{fontSize: 10}} />
                          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" width={30} tick={{fontSize: 10}} />
                          <Tooltip contentStyle={{fontSize: '12px'}} />
                          <Legend wrapperStyle={{fontSize: "11px", paddingTop: "5px"}} />
                          <Line yAxisId="left" type="monotone" name="Temp (°C)" dataKey="temp" stroke="#EF4444" strokeWidth={2} dot={{r: 2}} />
                          <Line yAxisId="left" type="monotone" name="Precip (mm)" dataKey="precipitation" stroke="#3B82F6" strokeWidth={2} dot={{r: 2}} />
                          <Line yAxisId="right" type="monotone" name="Humidity (%)" dataKey="humidity" stroke="#10B981" strokeWidth={2} dot={{r: 2}} />
                        </LineChart>
                      </ResponsiveContainer>
                    </>
                  )}
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

              {activeTab === 'sensor' && selectedSensor && (
                <div className="panel-section">
                  <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b' }}>{selectedSensor.name}</h3>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px', backgroundColor: selectedSensor.online ? '#dcfce7' : '#fee2e2', color: selectedSensor.online ? '#166534' : '#991b1b' }}>
                        {selectedSensor.online ? 'ONLINE' : 'OFFLINE'}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>UID: {selectedSensor.uid}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Type: {selectedSensor.type === 'rain_gauge' ? 'Rain Gauge' : 'Level Meter'}</div>
                  </div>

                  {sensorDataLoading && <div style={{ textAlign: 'center', padding: '40px', opacity: 0.7 }}>Fetching latest sensor readings...</div>}
                  
                  {!sensorDataLoading && sensorData && sensorData.length > 0 ? (
                    <div className="sensor-readings">
                      <div style={{ marginBottom: '15px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#475569', marginBottom: '10px' }}>Latest Reading</div>
                        <div style={{ padding: '15px', backgroundColor: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                          <div style={{ fontSize: '24px', fontWeight: '800', color: '#1d4ed8' }}>
                            {selectedSensor.type === 'rain_gauge' 
                              ? `${sensorData[sensorData.length - 1].daily_rain_mm ?? sensorData[sensorData.length - 1].value ?? 0} mm`
                              : `${sensorData[sensorData.length - 1].water_level ?? sensorData[sensorData.length - 1].value ?? 0} m`
                            }
                          </div>
                          <div style={{ fontSize: '11px', color: '#60a5fa', marginTop: '4px' }}>
                            Measured at: {new Date(sensorData[sensorData.length - 1].date_time || sensorData[sensorData.length - 1].timestamp || Date.now()).toLocaleString()}
                          </div>
                        </div>
                        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                          <div style={{ fontSize: '11px', backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>
                            Battery: {sensorData[sensorData.length - 1].battery_voltage}V
                          </div>
                          <div style={{ fontSize: '11px', backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>
                            Solar: {sensorData[sensorData.length - 1].solar_voltage}V
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : !sensorDataLoading && (
                    <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f1f5f9', borderRadius: '12px', color: '#64748b' }}>
                      <p>No recent data available for this sensor.</p>
                      <small>Checked last 24 hours.</small>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : <div className="panel-placeholder"><p>Select a study site to view details.</p></div>}
      </div>
      {showNlRasterPanel && activeSite === 'Guwahati' && (
        <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, width: '100%', display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ width: '640px', pointerEvents: 'auto' }}>
            <NetherlandsTimeSlider onDateChange={handleRasterDateChange} isLoading={rasterLoading} />
          </div>
        </div>
      )}

      <NetherlandsVisualsModal isOpen={showNlModal} onClose={() => setShowNlModal(false)} />

    </div>
  );
}
