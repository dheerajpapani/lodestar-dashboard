// src/pages/Maps.jsx
import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FaMapMarkerAlt, FaExclamationTriangle, FaCloudSunRain, FaUsers, FaTimes, FaLayerGroup } from 'react-icons/fa';
import '../App.css';

const studySites = {
  'Bengaluru': { center: [77.5946, 12.9716], zoom: 10, hazard: 'Urban Floods', bounds: [[77.4, 12.8], [78.0, 13.2]] },
  'Guwahati': { center: [91.7362, 26.1445], zoom: 11, hazard: 'Compound Pluvial & Fluvial Floods', bounds: [[91.5, 26.0], [91.9, 26.3]] },
  'Anantapur': { center: [77.6000, 14.6819], zoom: 9, hazard: 'Compound Flood & Drought', bounds: [[77.3, 14.5], [78.0, 15.0]] },
  'Dordrecht': { center: [4.6667, 51.8167], zoom: 11, hazard: 'Urban Floods & Evacuation Planning', bounds: [[4.5, 51.7], [4.8, 51.9]] },
  'Tilburg & Breda': { center: [4.8916, 51.5830], zoom: 9, hazard: 'Droughts & Urban Development', bounds: [[4.7, 51.5], [5.2, 51.7]] }
};
const siteData = {
  'Bengaluru': {
    alerts: [{ id: 1, level: 'Moderate', text: 'Heavy rainfall predicted, risk of waterlogging in low-lying areas.' }],
    forecast: [
      { day: 'Mon', rainfall: 25, temp: 28, humidity: 85 }, { day: 'Tue', rainfall: 40, temp: 27, humidity: 90 },
      { day: 'Wed', rainfall: 15, temp: 29, humidity: 80 }, { day: 'Thu', rainfall: 5, temp: 30, humidity: 75 },
      { day: 'Fri', rainfall: 10, temp: 31, humidity: 70 }, { day: 'Sat', rainfall: 30, temp: 29, humidity: 88 },
      { day: 'Sun', rainfall: 20, temp: 28, humidity: 82 },
    ],
    citizenReports: [ { id: 1, user: 'A. Kumar', text: 'Water level rising near Bellandur lake.', time: '1h ago' } ]
  },
  'Guwahati': {
    alerts: [{ id: 1, level: 'High', text: 'Brahmaputra river level approaching warning mark. Stay vigilant.' }],
    forecast: [
      { day: 'Mon', rainfall: 50, temp: 30, humidity: 92 }, { day: 'Tue', rainfall: 65, temp: 29, humidity: 95 },
      { day: 'Wed', rainfall: 30, temp: 31, humidity: 88 }, { day: 'Thu', rainfall: 20, temp: 32, humidity: 85 },
      { day: 'Fri', rainfall: 25, temp: 32, humidity: 87 }, { day: 'Sat', rainfall: 45, temp: 30, humidity: 93 },
      { day: 'Sun', rainfall: 55, temp: 29, humidity: 94 },
    ],
    citizenReports: [ { id: 1, user: 'R. Das', text: 'Anil Nagar area is already experiencing some waterlogging.', time: '45m ago' } ]
  },
  'Anantapur': {
    alerts: [{ id: 1, level: 'Low', text: 'Scattered thunderstorms possible later this week. No immediate drought relief expected.' }],
    forecast: [
      { day: 'Mon', rainfall: 0, temp: 35, humidity: 40 }, { day: 'Tue', rainfall: 0, temp: 36, humidity: 38 },
      { day: 'Wed', rainfall: 5, temp: 34, humidity: 50 }, { day: 'Thu', rainfall: 10, temp: 33, humidity: 55 },
      { day: 'Fri', rainfall: 2, temp: 35, humidity: 45 }, { day: 'Sat', rainfall: 0, temp: 37, humidity: 35 },
      { day: 'Sun', rainfall: 0, temp: 36, humidity: 37 },
    ],
    citizenReports: [ { id: 1, user: 'Local Farmer', text: 'Soil is extremely dry in Kalyandurg mandal.', time: '8h ago' } ]
  },
  'Dordrecht': {
    alerts: [{ id: 1, level: 'Minor', text: 'Elevated river levels due to North Sea tidal surge. No flooding expected.' }],
    forecast: [
      { day: 'Mon', rainfall: 10, temp: 18, humidity: 75 }, { day: 'Tue', rainfall: 5, temp: 19, humidity: 70 },
      { day: 'Wed', rainfall: 15, temp: 17, humidity: 85 }, { day: 'Thu', rainfall: 20, temp: 16, humidity: 88 },
      { day: 'Fri', rainfall: 5, temp: 20, humidity: 65 }, { day: 'Sat', rainfall: 2, temp: 21, humidity: 60 },
      { day: 'Sun', rainfall: 12, temp: 19, humidity: 78 },
    ],
    citizenReports: [ { id: 1, user: 'Water Board', text: 'All flood gates are operating normally.', time: '2h ago' } ]
  },
  'Tilburg & Breda': {
    alerts: [{ id: 1, level: 'Low', text: 'Drought conditions persist. Water conservation measures remain in effect.' }],
    forecast: [
      { day: 'Mon', rainfall: 2, temp: 22, humidity: 60 }, { day: 'Tue', rainfall: 0, temp: 24, humidity: 55 },
      { day: 'Wed', rainfall: 0, temp: 25, humidity: 50 }, { day: 'Thu', rainfall: 5, temp: 23, humidity: 65 },
      { day: 'Fri', rainfall: 8, temp: 21, humidity: 70 }, { day: 'Sat', rainfall: 1, temp: 25, humidity: 52 },
      { day: 'Sun', rainfall: 0, temp: 26, humidity: 48 },
    ],
    citizenReports: [ { id: 1, user: 'City Official', text: 'Please continue to limit non-essential water usage.', time: '1d ago' } ]
  },
};
const MT_KEY = import.meta.env.VITE_MAPTILER_KEY;
const OWM_KEY = import.meta.env.VITE_OPENWEATHERMAP_KEY;
const baseStyles = {
  'Streets': `https://api.maptiler.com/maps/streets-v2/style.json?key=${MT_KEY}`,
  'Satellite': `https://api.maptiler.com/maps/hybrid/style.json?key=${MT_KEY}`,
  'Terrain': 'https://tiles.stadiamaps.com/styles/stamen_terrain.json',
};
const weatherLayers = {
  'Rain': `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
  'Clouds': `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
  'Temp': `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
};

export default function Maps() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [activeSite, setActiveSite] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('alerts');
  const [mapStyle, setMapStyle] = useState(baseStyles['Streets']);
  const [activeOverlay, setActiveOverlay] = useState(null);

  useEffect(() => {
    if (mapRef.current) return;
    mapRef.current = new maplibregl.Map({
      container: mapContainer.current, style: mapStyle,
      center: [78.96, 20.59], zoom: 4,
    });
    mapRef.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
  }, [mapStyle]);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(mapStyle);
  }, [mapStyle]);

  const handleSiteSelect = (siteName) => {
    const map = mapRef.current;
    if (!siteName) {
      setActiveSite(null); setPanelOpen(false);
      if (markerRef.current) { markerRef.current.remove(); markerRef.current = null; }
      if (map.getLayer('site-boundary-layer')) { map.removeLayer('site-boundary-layer'); }
      if (map.getSource('site-boundary')) { map.removeSource('site-boundary'); }
      map.flyTo({ center: [78.96, 20.59], zoom: 4 });
      return;
    }
    const site = studySites[siteName];
    setActiveSite(siteName); setPanelOpen(true); setActiveTab('alerts');
    map.flyTo({ center: site.center, zoom: site.zoom, essential: true });
    if (markerRef.current) markerRef.current.remove();
    markerRef.current = new maplibregl.Marker({ color: "#E63946" }).setLngLat(site.center).addTo(map);
    const [sw, ne] = site.bounds;
    const boundaryGeoJSON = { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[ [sw[0], sw[1]], [ne[0], sw[1]], [ne[0], ne[1]], [sw[0], ne[1]], [sw[0], sw[1]] ]] } };
    if (map.getSource('site-boundary')) {
        map.getSource('site-boundary').setData(boundaryGeoJSON);
    } else {
        map.addSource('site-boundary', { type: 'geojson', data: boundaryGeoJSON });
        map.addLayer({ id: 'site-boundary-layer', type: 'fill', source: 'site-boundary', paint: { 'fill-color': '#1D3557', 'fill-opacity': 0.2 } });
    }
  };

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const styleLoadHandler = () => {
        Object.keys(weatherLayers).forEach(layerName => {
            if (map.getLayer(layerName)) map.removeLayer(layerName);
            if (map.getSource(layerName)) map.removeSource(layerName);
        });
        if (activeOverlay) {
            map.addSource(activeOverlay, { type: 'raster', tiles: [weatherLayers[activeOverlay]], tileSize: 256 });
            map.addLayer({ id: activeOverlay, type: 'raster', source: activeOverlay, paint: { 'raster-opacity': 0.6 } });
        }
    };
    map.on('style.load', styleLoadHandler);
    styleLoadHandler();
    return () => { map.off('style.load', styleLoadHandler); };
  }, [activeOverlay, mapStyle]);

  const currentSiteData = activeSite ? siteData[activeSite] : null;

  return (
    <div className="map-page-wrapper">
      <div className="map-top-bar">
        <div className="map-logo">LODESTAR Geo-Dashboard</div>
        <select className="site-selector" onChange={(e) => handleSiteSelect(e.target.value)} value={activeSite || ""}>
          <option value="">-- Select a Study Site --</option>
          {Object.keys(studySites).map(siteName => <option key={siteName} value={siteName}>{siteName}</option>)}
        </select>
      </div>
      <div ref={mapContainer} className="map-container-full" />
      <div className="map-controls-bottom-right">
        <h4><FaLayerGroup /> Map Layers</h4>
        <div className="control-group">
          {Object.keys(baseStyles).map(name => ( <button key={name} className={`map-control-btn ${mapStyle === baseStyles[name] ? 'active' : ''}`} onClick={() => setMapStyle(baseStyles[name])}>{name}</button>))}
        </div>
        <h4><FaCloudSunRain /> Weather Overlays</h4>
        <div className="control-group">
          {Object.keys(weatherLayers).map(name => ( <button key={name} className={`map-control-btn ${activeOverlay === name ? 'active' : ''}`} onClick={() => setActiveOverlay(prev => prev === name ? null : name)}>{name}</button>))}
        </div>
      </div>
      <div className={`side-panel ${panelOpen ? 'open' : ''}`}>
        {currentSiteData ? (
          <>
            <button className="panel-close-btn" onClick={() => setPanelOpen(false)}><FaTimes /></button>
            <div className="panel-header"> <FaMapMarkerAlt /> <h2>{activeSite}</h2> </div>
            <p className="panel-sub-header">Focus: {studySites[activeSite].hazard}</p>
            <div className="panel-tabs">
                <button className={activeTab === 'alerts' ? 'active' : ''} onClick={() => setActiveTab('alerts')}>Alerts</button>
                <button className={activeTab === 'forecast' ? 'active' : ''} onClick={() => setActiveTab('forecast')}>Forecast</button>
                <button className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}>Reports</button>
            </div>
            <div className="panel-content">
                {activeTab === 'alerts' && (
                    <div className="panel-section"> {currentSiteData.alerts.map(alert => ( <div key={alert.id} className={`alert-item alert-${alert.level.toLowerCase()}`}> <strong>{alert.level}:</strong> {alert.text} </div> ))} </div>
                )}
                {activeTab === 'forecast' && (
                    <div className="panel-section">
                        <h4 className="chart-title">7-Day Forecast</h4>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={currentSiteData.forecast} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis yAxisId="left" label={{ value: 'mm / °C', angle: -90, position: 'insideLeft' }} stroke="#8884d8" />
                                <YAxis yAxisId="right" orientation="right" label={{ value: '%', angle: -90, position: 'insideRight' }} stroke="#82ca9d" />
                                <Tooltip />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="rainfall" name="Rainfall (mm)" stroke="#3B82F6" strokeWidth={2} />
                                <Line yAxisId="left" type="monotone" dataKey="temp" name="Temp (°C)" stroke="#EF4444" strokeWidth={2} />
                                <Line yAxisId="right" type="monotone" dataKey="humidity" name="Humidity (%)" stroke="#82ca9d" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
                {activeTab === 'reports' && (
                    <div className="panel-section">
                        <div className="reports-list"> {currentSiteData.citizenReports.map(report => ( <div key={report.id} className="report-item"> <p>"{report.text}"</p> <span>- {report.user}, {report.time}</span> </div> ))} </div>
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
