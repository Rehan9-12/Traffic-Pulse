import React, { useEffect, useRef, useState } from 'react';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

interface TrafficMapProps {
  apiKey: string;
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
  style?: React.CSSProperties;
  className?: string;
}

const TrafficMap: React.FC<TrafficMapProps> = ({
  apiKey,
  center = [-74.0060, 40.7128], // Default to New York City
  zoom = 13,
  style = { width: '100%', height: '100%' },
  className = '',
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Dynamic import of TomTom SDK to avoid SSR issues
    const loadMap = async () => {
      try {
        // Import both maps and services for traffic layers
        const ttMaps = await import('@tomtom-international/web-sdk-maps');
        const ttServices = await import('@tomtom-international/web-sdk-services');
        
        if (mapRef.current && !mapInstance) {
          const map = ttMaps.map({
            key: apiKey,
            container: mapRef.current,
            center: center,
            zoom: zoom,
            stylesVisibility: {
              trafficFlow: true,
              trafficIncidents: true
            }
          });
          
          // Add traffic flow visualization when map is loaded
          map.on('load', () => {
            // Use the correct method to add traffic layers
            // The exact implementation depends on TomTom SDK version
            try {
              // For newer versions of TomTom SDK
              if (ttMaps.services && ttMaps.services.traffic) {
                const trafficFlow = new ttMaps.services.traffic.TrafficFlow({
                  key: apiKey
                });
                map.addLayer(trafficFlow);
              }
              // Fallback for different API versions
              else if (ttServices && ttServices.traffic) {
                const trafficLayer = new ttServices.traffic.TrafficFlowLayer({
                  key: apiKey
                });
                map.addLayer(trafficLayer);
              }
            } catch (e) {
              console.warn("Could not add traffic layer:", e);
              // Fallback to basic map without traffic layers
            }
            
            setIsLoaded(true);
          });
          
          setMapInstance(map);
        }
      } catch (error) {
        console.error('Error loading TomTom map:', error);
      }
    };

    loadMap();

    // Cleanup function
    return () => {
      if (mapInstance) {
        mapInstance.remove();
        setMapInstance(null);
      }
    };
  }, [apiKey, center, zoom]);

  // Update map center if props change
  useEffect(() => {
    if (mapInstance && isLoaded) {
      mapInstance.setCenter(center);
      mapInstance.setZoom(zoom);
    }
  }, [center, zoom, mapInstance, isLoaded]);

  return (
    <div 
      ref={mapRef} 
      style={style} 
      className={`traffic-map ${className}`}
      data-testid="traffic-map"
    />
  );
};

export default TrafficMap;