import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface City {
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
}

interface CitySelectorProps {
  selectedCity: string;
  onCityChange: (city: string, coordinates: [number, number]) => void;
}

const CitySelector: React.FC<CitySelectorProps> = ({ selectedCity, onCityChange }) => {
  // Predefined list of major cities with their coordinates
  const cities: Record<string, City> = {
    'new-york': { name: 'New York', coordinates: [-74.0060, 40.7128] },
    'los-angeles': { name: 'Los Angeles', coordinates: [-118.2437, 34.0522] },
    'chicago': { name: 'Chicago', coordinates: [-87.6298, 41.8781] },
    'houston': { name: 'Houston', coordinates: [-95.3698, 29.7604] },
    'phoenix': { name: 'Phoenix', coordinates: [-112.0740, 33.4484] },
    'philadelphia': { name: 'Philadelphia', coordinates: [-75.1652, 39.9526] },
    'san-antonio': { name: 'San Antonio', coordinates: [-98.4936, 29.4241] },
    'san-diego': { name: 'San Diego', coordinates: [-117.1611, 32.7157] },
    'dallas': { name: 'Dallas', coordinates: [-96.7970, 32.7767] },
    'san-francisco': { name: 'San Francisco', coordinates: [-122.4194, 37.7749] },
  };

  const handleCityChange = (value: string) => {
    const city = cities[value];
    if (city) {
      onCityChange(value, city.coordinates);
    }
  };

  return (
    <div className="w-full max-w-xs">
      <Select value={selectedCity} onValueChange={handleCityChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a city" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(cities).map(([id, city]) => (
            <SelectItem key={id} value={id}>
              {city.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CitySelector;