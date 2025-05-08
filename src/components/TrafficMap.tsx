import React, { useEffect, useRef, useState } from 'react';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import TrafficLegend from './TrafficLegend';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

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
  const [showLegend, setShowLegend] = useState(true);

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
            try {
              // Add traffic flow layer with enhanced visibility
              if (ttMaps.services && ttMaps.services.traffic) {
                // Add traffic flow layer (colored roads based on traffic conditions)
                const trafficFlow = new ttMaps.services.traffic.TrafficFlow({
                  key: apiKey,
                  style: 'relative', // 'relative' shows traffic relative to free-flow conditions
                  refresh: 60, // refresh every 60 seconds
                });
                map.addLayer(trafficFlow);
                
                // Add traffic incidents layer (accident markers, etc.)
                const trafficIncidents = new ttMaps.services.traffic.TrafficIncidents({
                  key: apiKey,
                  refresh: 60,
                });
                map.addLayer(trafficIncidents);
              }
              // Fallback for different API versions
              else if (ttServices && ttServices.traffic) {
                // Add traffic flow layer
                const trafficFlowLayer = new ttServices.traffic.TrafficFlowLayer({
                  key: apiKey,
                  refresh: 60,
                });
                map.addLayer(trafficFlowLayer);
                
                // Add traffic incidents layer
                const trafficIncidentsLayer = new ttServices.traffic.TrafficIncidentsLayer({
                  key: apiKey,
                  refresh: 60,
                });
                map.addLayer(trafficIncidentsLayer);
              }
              
              // Add custom controls for toggling traffic layers
              map.addControl(new ttMaps.TrafficControl());
              map.addControl(new ttMaps.FullscreenControl());
              
            } catch (e) {
              console.warn("Could not add traffic layers:", e);
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
    <div className="relative">
      <div 
        ref={mapRef} 
        style={style} 
        className={`traffic-map ${className}`}
        data-testid="traffic-map"
      />
      {showLegend && <TrafficLegend />}
      <Button 
        size="sm" 
        variant="secondary" 
        className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm shadow-lg"
        onClick={() => setShowLegend(!showLegend)}
      >
        <Info className="h-4 w-4 mr-1" />
        {showLegend ? 'Hide Legend' : 'Show Legend'}
      </Button>
    </div>
  );
};

export default TrafficMap;