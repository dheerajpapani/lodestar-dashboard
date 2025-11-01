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
const hasOWM = !!OWM_KEY;
const PUBLIC_FALLBACK = 'https://demotiles.maplibre.org/style.json';

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
  const popupRef = useRef(null);
  const cachedSensors = useRef(null);

  const [activeSite, setActiveSite] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('alerts');
  const [mapStyle, setMapStyle] = useState(baseStyles.Streets);
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [sensorsOn, setSensorsOn] = useState(false);

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
    };
    map.on('style.load', handler);
    handler();
    return () => map.off('style.load', handler);
  }, [activeOverlay, mapStyle]);

  // ==== Sensors (Improved marker styling) ====
  const loadSensors = async () => {
    if (!cachedSensors.current) {
      const res = await fetch(KML_URL);
      const text = await res.text();
      const xml = new DOMParser().parseFromString(text, 'text/xml');
      cachedSensors.current = kmlToGeoJSON(xml);
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

  // ==== Site selection (with translucent bounding box) ====
  const handleSiteSelect = async (siteName) => {
    const map = mapRef.current;
    if (!map) return;

    if (!siteName) {
      setActiveSite(null);
      setPanelOpen(false);
      if (markerRef.current) markerRef.current.remove();
      removeSensors();
      map.flyTo({ center: [78.96, 20.59], zoom: 4 });
      return;
    }

    const site = studySites[siteName];
    setActiveSite(siteName);
    setPanelOpen(true);
    setActiveTab('alerts');
    map.flyTo({ center: site.center, zoom: site.zoom, essential: true });

    if (markerRef.current) markerRef.current.remove();
    markerRef.current = new maplibregl.Marker({ color: "#E63946" }).setLngLat(site.center).addTo(map);

    const [sw, ne] = site.bounds;
    const boundary = {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [[[sw[0], sw[1]], [ne[0], sw[1]], [ne[0], ne[1]], [sw[0], ne[1]], [sw[0], sw[1]]]] }
    };
    if (map.getSource('site-boundary')) {
      map.getSource('site-boundary').setData(boundary);
    } else {
      map.addSource('site-boundary', { type: 'geojson', data: boundary });
      map.addLayer({
        id: 'site-boundary-layer',
        type: 'fill',
        source: 'site-boundary',
        paint: { 'fill-color': '#1D3557', 'fill-opacity': 0.25 }
      });
    }

    if (siteName !== 'Guwahati') {
      removeSensors();
      setSensorsOn(false);
    } else if (sensorsOn) {
      await loadSensors();
    }
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
