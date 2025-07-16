/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../App.css';

const cityBounds = {
  Bengaluru: [[77.4, 12.8], [78.0, 13.2]],
  Guwahati:  [[91.3, 25.9], [92.1, 26.4]],
  Anantapur: [[77.3, 14.5], [78.0, 15.0]],
  Dordrecht: [[4.5, 51.6],  [4.9, 51.9]],
};

const OWM_KEY = import.meta.env.VITE_OPENWEATHERMAP_KEY;
const weatherLayers = {
  '☁️ Clouds': `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
  '🌡️ Temp':   `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
  '💨 Wind':    `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
  '🌧️ Rain':   `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
};

const MT_KEY = import.meta.env.VITE_MAPTILER_KEY;
const baseStyles = {
  ...(MT_KEY ? {
    'Streets':    `https://api.maptiler.com/maps/streets/style.json?key=${MT_KEY}`,
    'Outdoor':    `https://api.maptiler.com/maps/outdoor/style.json?key=${MT_KEY}`,
    'Sat Hybrid': `https://api.maptiler.com/maps/hybrid/style.json?key=${MT_KEY}`,
  } : {}),
  'OSM Liberty':    'https://maputnik.github.io/osm-liberty/style.json',
  'Stamen Toner':   'https://tiles.stadiamaps.com/styles/stamen_toner.json',
  'Stamen Terrain': 'https://tiles.stadiamaps.com/styles/stamen_terrain.json',
};

export default function Maps() {
  const mapContainer = useRef(null);
  const mapRef       = useRef(null);

  const [city, setCity]                     = useState('');
  const [styleName, setStyleName]           = useState(Object.keys(baseStyles)[0]);
  const [panelOpen, setPanelOpen]           = useState(false);
  const [visibleOverlay, setVisibleOverlay] = useState(null);

  const drawCityBorder = m => {
    if (!city) return;
    const [sw, ne] = cityBounds[city];
    const coords   = [
      [sw[0], sw[1]],
      [ne[0], sw[1]],
      [ne[0], ne[1]],
      [sw[0], ne[1]],
      [sw[0], sw[1]]
    ];
    if (m.getSource('city-border')) {
      m.removeLayer('city-border-line');
      m.removeSource('city-border');
    }
    m.addSource('city-border', {
      type: 'geojson',
      data: { type: 'Feature', geometry:{ type: 'LineString', coordinates: coords } }
    });
    m.addLayer({
      id: 'city-border-line',
      type: 'line',
      source: 'city-border',
      paint: { 'line-color':'#000', 'line-width':2 }
    });
  };

  const addWeatherOverlay = m => {
    Object.keys(weatherLayers).forEach(name => {
      const id = `wx-${name}`;
      if (m.getLayer(id)) m.removeLayer(id);
      if (m.getSource(id)) m.removeSource(id);
    });
    if (!visibleOverlay) return;
    const id = `wx-${visibleOverlay}`;
    m.addSource(id, { type:'raster', tiles:[weatherLayers[visibleOverlay]], tileSize:256 });
    m.addLayer({ id, type:'raster', source:id, paint:{ 'raster-opacity':0.6 } });
  };

  useEffect(() => {
    const m = new maplibregl.Map({
      container: mapContainer.current,
      style:     baseStyles[styleName],
      center:    [78.96, 20.59],
      zoom:      4
    });
    m.addControl(new maplibregl.NavigationControl());
    mapRef.current = m;
    m.on('load', () => {
      if (visibleOverlay) addWeatherOverlay(m);
      if (city) {
        m.fitBounds(cityBounds[city], { padding:50, animate:true });
        drawCityBorder(m);
      }
    });
  }, []);

  useEffect(() => {
    const m = mapRef.current;
    if (!m) return;
    m.once('styledata', () => {
      if (visibleOverlay) addWeatherOverlay(m);
      if (city) drawCityBorder(m);
    });
    m.setStyle(baseStyles[styleName]);
  }, [styleName]);

  useEffect(() => {
    const m = mapRef.current;
    if (!m) return;
    if (m.isStyleLoaded()) addWeatherOverlay(m);
    else m.once('styledata', () => addWeatherOverlay(m));
  }, [visibleOverlay]);

  useEffect(() => {
    const m = mapRef.current;
    if (!m || !city) return;
    m.fitBounds(cityBounds[city], { padding:50, animate:true });
    drawCityBorder(m);
  }, [city]);

  return (
    <div className="map-wrapper">
      <div className="controls-panel">
        <select
          className="select-input"
          value={city}
          onChange={e=>setCity(e.target.value)}
        >
          <option value="">📍 Select City</option>
          {Object.keys(cityBounds).map(c=>
            <option key={c} value={c}>{c}</option>
          )}
        </select>

        <select
          className="select-input"
          value={styleName}
          onChange={e=>setStyleName(e.target.value)}
        >
          {Object.keys(baseStyles).map(b=>
            <option key={b} value={b}>{b}</option>
          )}
        </select>
      </div>

      <button
        className={`toggle-btn ${panelOpen?'active':''}`}
        onClick={()=>setPanelOpen(p=>!p)}
      >
        {panelOpen ? '▶' : '◀'}
      </button>

      {panelOpen && (
        <div className="weather-panel">
          {Object.keys(weatherLayers).map(name=>(
            <label key={name} className="weather-label">
              <input
                type="radio"
                name="wx"
                className="custom-radio"
                checked={visibleOverlay===name}
                onChange={()=>setVisibleOverlay(v=>v===name?null:name)}
              />
              <span>{name}</span>
            </label>
          ))}
          <button className="clear-btn" onClick={()=>setVisibleOverlay(null)}>
            Clear
          </button>
        </div>
      )}

      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
