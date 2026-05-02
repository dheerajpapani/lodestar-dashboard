import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { FaTimes } from 'react-icons/fa';
import NetherlandsTimeSlider from './NetherlandsTimeSlider';
import { parseGeoTiff } from '../utils/tiffParser';

export default function NetherlandsRasterPanel({ isOpen, onClose }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDateLabel, setCurrentDateLabel] = useState('');

  // Initialize Map
  useEffect(() => {
    if (!isOpen || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [4.67, 51.78], // Center around Dordrecht roughly
      zoom: 12
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    mapRef.current = map;

    return () => {
      // Don't auto-destroy on unmount so we can preserve if needed, 
      // but since it's a modal, we probably should destroy it when fully unmounted.
    };
  }, [isOpen]);

  const handleDateChange = async (filename, label) => {
    const map = mapRef.current;
    if (!map) return;

    setCurrentDateLabel(label);
    setIsLoading(true);

    const doLoad = async () => {
      try {
        const url = `${import.meta.env.BASE_URL}sentinel_cog/${filename}`;
        const { url: dataUrl, coordinates, bbox } = await parseGeoTiff(url);

        const sourceId = 'sentinel-raster-source';
        const layerId = 'sentinel-raster-layer';

        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);

        map.addSource(sourceId, {
          type: 'image',
          url: dataUrl,
          coordinates: coordinates,
        });

        map.addLayer({
          id: layerId,
          type: 'raster',
          source: sourceId,
          paint: {
            'raster-opacity': 0.85,
            'raster-fade-duration': 400,
          },
        });

        // Fit bounds using the reprojected bbox from tiffParser
        if (bbox && bbox.length === 4) {
          const [minLon, minLat, maxLon, maxLat] = bbox;
          map.fitBounds(
            [[minLon, minLat], [maxLon, maxLat]],
            { padding: 40, duration: 800, maxZoom: 14 }
          );
        }
      } catch (err) {
        console.error('[NlRasterPanel] Failed to load raster overlay:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (map.isStyleLoaded()) {
      await doLoad();
    } else {
      map.once('style.load', () => doLoad());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="nl-modal-overlay" style={{ zIndex: 2500 }}>
      <div className="nl-modal-container" style={{ width: '85%', height: '85%', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
        <div className="nl-modal-header" style={{ backgroundColor: '#1e293b' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#f8fafc' }}>Netherlands Satellite Monitoring (Sentinel-1 VV+VH)</h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#94a3b8' }}>June–July 2023 Temporal Analysis • {currentDateLabel}</p>
          </div>
          <button className="nl-modal-close" onClick={onClose} title="Close Panel">
            <FaTimes />
          </button>
        </div>

        <div style={{ flex: 1, position: 'relative' }}>
          <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
          
          <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', width: '80%' }}>
            <NetherlandsTimeSlider 
              onDateChange={handleDateChange} 
              isLoading={isLoading} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
