import React, { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
// Import CSS directly in the component to ensure it's loaded
import '@tomtom-international/web-sdk-maps/dist/maps.css';

// Add TomTom SDK type definition
declare global {
  interface Window {
    tt: any;
  }
}

interface TrafficMapProps {
  apiKey: string;
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
  style?: React.CSSProperties;
  className?: string;
  route?: {
    origin: [number, number];
    destination: [number, number];
    points: [number, number][];
  };
}

const TrafficMap: React.FC<TrafficMapProps> = ({
  apiKey,
  center = [-74.0060, 40.7128], // Default to New York City
  zoom = 13,
  style = { width: '100%', height: '100%' },
  className = '',
  route,
}) => {
  // References for markers and route layer
  const originMarkerRef = useRef<any>(null);
  const destinationMarkerRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  // Legend is now handled in the dashboard

  // Function to initialize the map
  const initializeMap = () => {
    console.log("Initializing map with API key:", apiKey);
    console.log("TomTom SDK loaded:", !!window.tt);
    console.log("Map ref exists:", !!mapRef.current);
    
    if (!window.tt || !mapRef.current || mapInstance) {
      console.log("Cannot initialize map - missing dependencies");
      return;
    }
    
    try {
      console.log("Creating map instance with center:", center, "and zoom:", zoom);
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
        console.log("Map loaded successfully");
        try {
          // Add traffic flow layer (colored roads based on traffic conditions)
          const trafficFlow = new window.tt.services.traffic.TrafficFlow({
            key: apiKey,
            style: 'relative', // 'relative' shows traffic relative to free-flow conditions
            refresh: 60, // refresh every 60 seconds
          });
          map.addLayer(trafficFlow);
          console.log("Traffic flow layer added");
          
          // Add traffic incidents layer (accident markers, etc.)
          const trafficIncidents = new window.tt.services.traffic.TrafficIncidents({
            key: apiKey,
            refresh: 60,
          });
          map.addLayer(trafficIncidents);
          console.log("Traffic incidents layer added");
          
          // Add custom controls for toggling traffic layers
          map.addControl(new window.tt.TrafficControl());
          map.addControl(new window.tt.FullscreenControl());
          console.log("Map controls added");
          
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

  // Track script loading status
  const [scriptsLoaded, setScriptsLoaded] = useState({
    maps: false,
    services: false
  });

  // Initialize map when both scripts are loaded or when component mounts if scripts are already loaded
  useEffect(() => {
    // Check if scripts are already loaded
    if (window.tt && !mapInstance) {
      console.log("TomTom SDK already available on mount");
      initializeMap();
      return;
    }
    
    // Otherwise wait for scripts to load
    if (scriptsLoaded.maps && scriptsLoaded.services && window.tt && !mapInstance) {
      console.log("Both scripts loaded, initializing map");
      initializeMap();
    }
  }, [scriptsLoaded, apiKey, mapInstance, center, zoom]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstance) {
        console.log("Cleaning up map instance");
        mapInstance.remove();
        setMapInstance(null);
      }
    };
  }, [mapInstance]);

  // Update map center if props change (only if no route is displayed)
  useEffect(() => {
    if (mapInstance && isLoaded && !route) {
      mapInstance.setCenter(center);
      mapInstance.setZoom(zoom);
    }
  }, [center, zoom, mapInstance, isLoaded, route]);

  // Display route on map when route changes
  useEffect(() => {
    if (!mapInstance || !isLoaded || !route || !window.tt) return;
    
    console.log("Displaying route on map:", route);
    
    // Clear previous route and markers
    if (routeLayerRef.current) {
      mapInstance.removeLayer(routeLayerRef.current.id);
      routeLayerRef.current = null;
    }
    
    if (originMarkerRef.current) {
      originMarkerRef.current.remove();
      originMarkerRef.current = null;
    }
    
    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.remove();
      destinationMarkerRef.current = null;
    }
    
    try {
      // Create origin marker (green)
      const originElement = document.createElement('div');
      originElement.className = 'origin-marker';
      originElement.style.width = '24px';
      originElement.style.height = '24px';
      originElement.style.borderRadius = '50%';
      originElement.style.backgroundColor = '#4CAF50';
      originElement.style.border = '2px solid white';
      originElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      
      originMarkerRef.current = new window.tt.Marker({
        element: originElement,
        anchor: 'bottom'
      })
        .setLngLat(route.origin)
        .addTo(mapInstance);
      
      // Create destination marker (red)
      const destElement = document.createElement('div');
      destElement.className = 'destination-marker';
      destElement.style.width = '24px';
      destElement.style.height = '24px';
      destElement.style.borderRadius = '50%';
      destElement.style.backgroundColor = '#F44336';
      destElement.style.border = '2px solid white';
      destElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      
      destinationMarkerRef.current = new window.tt.Marker({
        element: destElement,
        anchor: 'bottom'
      })
        .setLngLat(route.destination)
        .addTo(mapInstance);
      
      // Add route line to map
      const routeLineData = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: route.points
        }
      };
      
      // Add the route as a layer if it doesn't exist yet
      if (!mapInstance.getSource('route')) {
        mapInstance.addSource('route', {
          type: 'geojson',
          data: routeLineData
        });
        
        mapInstance.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#4a89f3',
            'line-width': 6,
            'line-opacity': 0.8
          }
        });
        
        routeLayerRef.current = { id: 'route' };
      } else {
        // Update existing route
        mapInstance.getSource('route').setData(routeLineData);
      }
      
      // Fit map to show the entire route with padding
      const bounds = new window.tt.LngLatBounds();
      
      // Include origin and destination in bounds
      bounds.extend(route.origin);
      bounds.extend(route.destination);
      
      // Include all route points in bounds
      route.points.forEach(point => {
        bounds.extend(point);
      });
      
      // Fit the map to the route bounds with padding
      mapInstance.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 16
      });
      
      console.log("Route displayed successfully");
    } catch (error) {
      console.error("Error displaying route:", error);
    }
  }, [route, mapInstance, isLoaded]);

  // Add CSS to ensure map container is properly sized
  useEffect(() => {
    // Add specific CSS for the map container
    if (mapRef.current) {
      const mapElement = mapRef.current;
      mapElement.style.position = 'relative';
      mapElement.style.width = '100%';
      mapElement.style.height = '500px';
    }
  }, []);

  return (
    <div className="relative w-full h-full" style={{ minHeight: "500px" }}>
      {/* Load TomTom SDK */}
      <Script 
        src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps-web.min.js"
        onLoad={() => {
          console.log("Maps script loaded");
          setScriptsLoaded(prev => ({ ...prev, maps: true }));
        }}
        strategy="afterInteractive"
      />
      <Script 
        src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/services/services-web.min.js"
        onLoad={() => {
          console.log("Services script loaded");
          setScriptsLoaded(prev => ({ ...prev, services: true }));
        }}
        strategy="afterInteractive"
      />
      
      <div 
        ref={mapRef} 
        style={{ width: '100%', height: '500px' }}
        className={`traffic-map ${className} border rounded-md overflow-hidden`}
        data-testid="traffic-map"
      />
      
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <p>Loading map...</p>
        </div>
      )}
    </div>
  );
};

export default TrafficMap;