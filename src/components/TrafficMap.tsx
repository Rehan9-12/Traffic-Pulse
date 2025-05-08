import React, { useEffect, useRef, useState } from 'react';
// Import CSS directly in the component to ensure it's loaded
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import Script from 'next/script';

// Add TomTom SDK type definition
declare global {
  interface Window {
    tt: any;
  }
}
import { Button } from '@/components/ui/button';

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
  // Legend is now handled in the dashboard

  // Function to initialize the map
  const initializeMap = () => {
    if (!window.tt || !mapRef.current || mapInstance) return;
    
    try {
      const map = window.tt.map({
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
        try {
          // Add traffic flow layer (colored roads based on traffic conditions)
          const trafficFlow = new window.tt.services.traffic.TrafficFlow({
            key: apiKey,
            style: 'relative', // 'relative' shows traffic relative to free-flow conditions
            refresh: 60, // refresh every 60 seconds
          });
          map.addLayer(trafficFlow);
          
          // Add traffic incidents layer (accident markers, etc.)
          const trafficIncidents = new window.tt.services.traffic.TrafficIncidents({
            key: apiKey,
            refresh: 60,
          });
          map.addLayer(trafficIncidents);
          
          // Add custom controls for toggling traffic layers
          map.addControl(new window.tt.TrafficControl());
          map.addControl(new window.tt.FullscreenControl());
          
        } catch (e) {
          console.warn("Could not add traffic layers:", e);
          // Fallback to basic map without traffic layers
        }
        
        setIsLoaded(true);
      });
      
      setMapInstance(map);
    } catch (error) {
      console.error('Error initializing TomTom map:', error);
    }
  };

  // Load the map when the SDK is ready
  useEffect(() => {
    // Check if TomTom SDK is loaded
    if (window.tt) {
      initializeMap();
    }
    
    // Cleanup function
    return () => {
      if (mapInstance) {
        mapInstance.remove();
        setMapInstance(null);
      }
    };
  }, [apiKey]);

  // Update map center if props change
  useEffect(() => {
    if (mapInstance && isLoaded) {
      mapInstance.setCenter(center);
      mapInstance.setZoom(zoom);
    }
  }, [center, zoom, mapInstance, isLoaded]);

  return (
    <div className="relative">
      {/* Load TomTom SDK */}
      <Script 
        src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps-web.min.js"
        onLoad={initializeMap}
        strategy="afterInteractive"
      />
      <Script 
        src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/services/services-web.min.js"
        strategy="afterInteractive"
      />
      
      <div 
        ref={mapRef} 
        style={style} 
        className={`traffic-map ${className}`}
        data-testid="traffic-map"
      />
    </div>
  );
};

export default TrafficMap;