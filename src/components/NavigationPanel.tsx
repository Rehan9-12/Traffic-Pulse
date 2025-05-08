import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { MapPin, Navigation, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';

interface LocationSuggestion {
  id: string;
  name: string;
  address: string;
  position: {
    lat: number;
    lon: number;
  };
}

interface NavigationPanelProps {
  apiKey: string;
  onRouteCalculated?: (route: {
    origin: [number, number];
    destination: [number, number];
    points: [number, number][];
    summary: {
      lengthInMeters: number;
      travelTimeInSeconds: number;
      trafficDelayInSeconds: number;
      departureTime: string;
      arrivalTime: string;
    };
  }) => void;
}

const NavigationPanel: React.FC<NavigationPanelProps> = ({ apiKey, onRouteCalculated }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState<LocationSuggestion[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoadingOriginSuggestions, setIsLoadingOriginSuggestions] = useState(false);
  const [isLoadingDestSuggestions, setIsLoadingDestSuggestions] = useState(false);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [routeSummary, setRouteSummary] = useState<{
    distance: string;
    duration: string;
    trafficDelay: string;
    arrivalTime: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Refs for debouncing
  const originDebounceTimer = useRef<NodeJS.Timeout | null>(null);
  const destDebounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Function to search for location suggestions
  const fetchLocationSuggestions = async (query: string): Promise<LocationSuggestion[]> => {
    if (!query.trim() || !apiKey) return [];
    
    try {
      const response = await fetch(
        `https://api.tomtom.com/search/2/search/${encodeURIComponent(query)}.json?key=${apiKey}&limit=5`
      );
      
      if (!response.ok) {
        throw new Error('Location search failed');
      }
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        return data.results.map((result: any) => ({
          id: result.id,
          name: result.poi?.name || result.address.freeformAddress,
          address: result.address.freeformAddress,
          position: result.position
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      return [];
    }
  };

  // Function to search for locations using TomTom's Fuzzy Search API
  const searchLocation = async (query: string): Promise<[number, number] | null> => {
    try {
      const response = await fetch(
        `https://api.tomtom.com/search/2/search/${encodeURIComponent(query)}.json?key=${apiKey}&limit=1`
      );
      
      if (!response.ok) {
        throw new Error('Location search failed');
      }
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const position = data.results[0].position;
        return [position.lon, position.lat];
      }
      
      return null;
    } catch (error) {
      console.error('Error searching for location:', error);
      return null;
    }
  };

  // Handle origin input change with debounce
  const handleOriginChange = (value: string) => {
    setOrigin(value);
    
    // Clear previous timer
    if (originDebounceTimer.current) {
      clearTimeout(originDebounceTimer.current);
    }
    
    if (value.trim().length > 2) {
      setIsLoadingOriginSuggestions(true);
      setShowOriginSuggestions(true);
      
      // Set new timer
      originDebounceTimer.current = setTimeout(async () => {
        const suggestions = await fetchLocationSuggestions(value);
        setOriginSuggestions(suggestions);
        setIsLoadingOriginSuggestions(false);
      }, 300);
    } else {
      setOriginSuggestions([]);
      setShowOriginSuggestions(false);
      setIsLoadingOriginSuggestions(false);
    }
  };

  // Handle destination input change with debounce
  const handleDestinationChange = (value: string) => {
    setDestination(value);
    
    // Clear previous timer
    if (destDebounceTimer.current) {
      clearTimeout(destDebounceTimer.current);
    }
    
    if (value.trim().length > 2) {
      setIsLoadingDestSuggestions(true);
      setShowDestSuggestions(true);
      
      // Set new timer
      destDebounceTimer.current = setTimeout(async () => {
        const suggestions = await fetchLocationSuggestions(value);
        setDestinationSuggestions(suggestions);
        setIsLoadingDestSuggestions(false);
      }, 300);
    } else {
      setDestinationSuggestions([]);
      setShowDestSuggestions(false);
      setIsLoadingDestSuggestions(false);
    }
  };

  // Handle selection of origin suggestion
  const handleSelectOriginSuggestion = (suggestion: LocationSuggestion) => {
    setOrigin(suggestion.address);
    setOriginSuggestions([]);
    setShowOriginSuggestions(false);
  };

  // Handle selection of destination suggestion
  const handleSelectDestinationSuggestion = (suggestion: LocationSuggestion) => {
    setDestination(suggestion.address);
    setDestinationSuggestions([]);
    setShowDestSuggestions(false);
  };

  // Function to calculate route using TomTom's Routing API
  const calculateRoute = async () => {
    setIsCalculating(true);
    setError(null);
    
    try {
      // Search for origin and destination coordinates
      const originCoords = await searchLocation(origin);
      if (!originCoords) {
        throw new Error('Could not find origin location');
      }
      
      const destinationCoords = await searchLocation(destination);
      if (!destinationCoords) {
        throw new Error('Could not find destination location');
      }
      
      // Calculate route
      const routeUrl = `https://api.tomtom.com/routing/1/calculateRoute/${originCoords[1]},${originCoords[0]}:${destinationCoords[1]},${destinationCoords[0]}/json?key=${apiKey}&traffic=true&travelMode=car`;
      
      const response = await fetch(routeUrl);
      
      if (!response.ok) {
        throw new Error('Route calculation failed');
      }
      
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const summary = route.summary;
        
        // Format distance
        const distance = summary.lengthInMeters < 1000 
          ? `${summary.lengthInMeters} m` 
          : `${(summary.lengthInMeters / 1000).toFixed(1)} km`;
        
        // Format duration
        const hours = Math.floor(summary.travelTimeInSeconds / 3600);
        const minutes = Math.floor((summary.travelTimeInSeconds % 3600) / 60);
        const duration = hours > 0 
          ? `${hours} hr ${minutes} min` 
          : `${minutes} min`;
        
        // Format traffic delay
        const delayMinutes = Math.floor(summary.trafficDelayInSeconds / 60);
        const trafficDelay = delayMinutes > 0 
          ? `+${delayMinutes} min delay` 
          : 'No delay';
        
        // Calculate arrival time
        const now = new Date();
        const arrivalTime = new Date(now.getTime() + summary.travelTimeInSeconds * 1000);
        
        // Set route summary
        setRouteSummary({
          distance,
          duration,
          trafficDelay,
          arrivalTime: arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        
        // Extract route points for the map
        const points = route.legs.flatMap(leg => 
          leg.points.map(point => [point.longitude, point.latitude] as [number, number])
        );
        
        // Call the onRouteCalculated callback if provided
        if (onRouteCalculated) {
          onRouteCalculated({
            origin: originCoords,
            destination: destinationCoords,
            points,
            summary: {
              lengthInMeters: summary.lengthInMeters,
              travelTimeInSeconds: summary.travelTimeInSeconds,
              trafficDelayInSeconds: summary.trafficDelayInSeconds,
              departureTime: now.toISOString(),
              arrivalTime: arrivalTime.toISOString()
            }
          });
        }
      } else {
        throw new Error('No routes found');
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      setError(error instanceof Error ? error.message : 'Failed to calculate route');
      setRouteSummary(null);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Navigation className="h-5 w-5 mr-2" />
          Navigation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="origin">Starting Point</Label>
            <div className="flex items-center space-x-2 relative">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div className="w-full">
                <Popover open={showOriginSuggestions} onOpenChange={setShowOriginSuggestions}>
                  <Input
                    id="origin"
                    placeholder="Enter starting location"
                    value={origin}
                    onChange={(e) => handleOriginChange(e.target.value)}
                    onFocus={() => {
                      if (origin.trim().length > 2) {
                        setShowOriginSuggestions(true);
                      }
                    }}
                  />
                  <PopoverContent 
                    className="p-0 w-[calc(100%-2rem)] ml-4" 
                    align="start" 
                    side="bottom"
                    sideOffset={5}
                  >
                    <Command>
                      <CommandList>
                        {isLoadingOriginSuggestions ? (
                          <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="ml-2 text-sm">Loading suggestions...</span>
                          </div>
                        ) : originSuggestions.length === 0 ? (
                          <CommandEmpty>No locations found</CommandEmpty>
                        ) : (
                          <CommandGroup heading="Suggestions">
                            {originSuggestions.map((suggestion) => (
                              <CommandItem
                                key={suggestion.id}
                                onSelect={() => handleSelectOriginSuggestion(suggestion)}
                                className="cursor-pointer"
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">{suggestion.name}</span>
                                  <span className="text-xs text-muted-foreground">{suggestion.address}</span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <div className="flex items-center space-x-2 relative">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div className="w-full">
                <Popover open={showDestSuggestions} onOpenChange={setShowDestSuggestions}>
                  <Input
                    id="destination"
                    placeholder="Enter destination"
                    value={destination}
                    onChange={(e) => handleDestinationChange(e.target.value)}
                    onFocus={() => {
                      if (destination.trim().length > 2) {
                        setShowDestSuggestions(true);
                      }
                    }}
                  />
                  <PopoverContent 
                    className="p-0 w-[calc(100%-2rem)] ml-4" 
                    align="start" 
                    side="bottom"
                    sideOffset={5}
                  >
                    <Command>
                      <CommandList>
                        {isLoadingDestSuggestions ? (
                          <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="ml-2 text-sm">Loading suggestions...</span>
                          </div>
                        ) : destinationSuggestions.length === 0 ? (
                          <CommandEmpty>No locations found</CommandEmpty>
                        ) : (
                          <CommandGroup heading="Suggestions">
                            {destinationSuggestions.map((suggestion) => (
                              <CommandItem
                                key={suggestion.id}
                                onSelect={() => handleSelectDestinationSuggestion(suggestion)}
                                className="cursor-pointer"
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">{suggestion.name}</span>
                                  <span className="text-xs text-muted-foreground">{suggestion.address}</span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full" 
            onClick={calculateRoute} 
            disabled={!origin || !destination || isCalculating}
          >
            {isCalculating ? 'Calculating...' : 'Get Directions'}
          </Button>
          
          {error && (
            <div className="text-sm text-red-500 mt-2">
              {error}
            </div>
          )}
          
          {routeSummary && (
            <div className="mt-4 space-y-3 border-t pt-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm font-medium">ETA</span>
                </div>
                <span className="text-sm">{routeSummary.arrivalTime}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Distance</span>
                <span className="text-sm">{routeSummary.distance}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Travel Time</span>
                <div className="flex items-center">
                  <span className="text-sm">{routeSummary.duration}</span>
                  {routeSummary.trafficDelay !== 'No delay' && (
                    <Badge variant="outline" className="ml-2 text-xs bg-yellow-50 text-yellow-800 border-yellow-200">
                      {routeSummary.trafficDelay}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground mt-2">
                Real-time traffic conditions included
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NavigationPanel;