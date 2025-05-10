
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mock data for density heatmap
const DENSITY_DATA = {
  type: 'FeatureCollection',
  features: [
    // San Francisco area
    { type: 'Feature', properties: { density: 35 }, geometry: { type: 'Point', coordinates: [-122.4194, 37.7749] } },
    { type: 'Feature', properties: { density: 28 }, geometry: { type: 'Point', coordinates: [-122.4284, 37.7649] } },
    { type: 'Feature', properties: { density: 42 }, geometry: { type: 'Point', coordinates: [-122.4094, 37.7849] } },
    // Los Angeles area
    { type: 'Feature', properties: { density: 30 }, geometry: { type: 'Point', coordinates: [-118.2437, 34.0522] } },
    { type: 'Feature', properties: { density: 25 }, geometry: { type: 'Point', coordinates: [-118.2537, 34.0422] } },
    { type: 'Feature', properties: { density: 38 }, geometry: { type: 'Point', coordinates: [-118.2337, 34.0622] } },
    // New York area
    { type: 'Feature', properties: { density: 50 }, geometry: { type: 'Point', coordinates: [-74.0060, 40.7128] } },
    { type: 'Feature', properties: { density: 45 }, geometry: { type: 'Point', coordinates: [-74.0160, 40.7028] } },
    { type: 'Feature', properties: { density: 55 }, geometry: { type: 'Point', coordinates: [-73.9960, 40.7228] } },
    // Chicago area
    { type: 'Feature', properties: { density: 20 }, geometry: { type: 'Point', coordinates: [-87.6298, 41.8781] } },
    { type: 'Feature', properties: { density: 18 }, geometry: { type: 'Point', coordinates: [-87.6398, 41.8681] } },
    { type: 'Feature', properties: { density: 22 }, geometry: { type: 'Point', coordinates: [-87.6198, 41.8881] } },
  ]
};

interface DensityMapProps {
  className?: string;
}

const DensityMap: React.FC<DensityMapProps> = ({ className }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGVtb3VzZXIxMjMiLCJhIjoiY2xzdXc0a2x0MHBiYTJrcGJ0NnhvNnNndiJ9.LBeeV5B7_UXRfY-l1Zez7A';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-95.7129, 37.0902], // Center of US
      zoom: 3.5
    });

    map.current.on('load', () => {
      setMapLoaded(true);
      
      if (!map.current) return;
      
      // Add heatmap data source
      map.current.addSource('density-data', {
        type: 'geojson',
        data: DENSITY_DATA
      });
      
      // Add heatmap layer
      map.current.addLayer({
        id: 'density-heat',
        type: 'heatmap',
        source: 'density-data',
        paint: {
          // Increase weight as density increases
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'density'],
            0, 0,
            60, 1
          ],
          // Increase intensity as zoom level increases
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 1,
            9, 3
          ],
          // Assign color values be applied to points depending on their density
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0, 0, 255, 0)',
            0.2, 'rgba(0, 255, 255, 0.5)',
            0.4, 'rgba(0, 255, 0, 0.6)',
            0.6, 'rgba(255, 255, 0, 0.7)',
            0.8, 'rgba(255, 0, 0, 0.8)',
            1, 'rgba(255, 0, 255, 0.9)'
          ],
          // Adjust the heatmap radius by zoom level
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 2,
            9, 20
          ],
          // Opacity based on zoom level
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5, 0.9,
            9, 0.5
          ]
        }
      });
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className={`relative ${className || 'h-[500px]'}`}>
      <div ref={mapContainer} className="absolute inset-0 rounded-lg overflow-hidden" />
      <div className="absolute bottom-4 left-4 bg-black/70 p-3 rounded-lg text-white text-sm">
        <h3 className="font-semibold text-primary mb-1">Resource Density Map</h3>
        <div className="flex items-center gap-2">
          <div className="flex h-2 w-24">
            <div className="bg-blue-500 h-2 w-1/5"></div>
            <div className="bg-cyan-500 h-2 w-1/5"></div>
            <div className="bg-green-500 h-2 w-1/5"></div>
            <div className="bg-yellow-500 h-2 w-1/5"></div>
            <div className="bg-red-500 h-2 w-1/5"></div>
          </div>
          <div className="flex justify-between w-24 text-xs text-gray-300">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DensityMap;
