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
  // Predefined list of major Indian cities with their coordinates
  const cities: Record<string, City> = {
    'delhi': { name: 'Delhi', coordinates: [77.1025, 28.7041] },
    'mumbai': { name: 'Mumbai', coordinates: [72.8777, 19.0760] },
    'bengaluru': { name: 'Bengaluru', coordinates: [77.5946, 12.9716] },
    'chennai': { name: 'Chennai', coordinates: [80.2707, 13.0827] },
    'kolkata': { name: 'Kolkata', coordinates: [88.3639, 22.5726] },
    'hyderabad': { name: 'Hyderabad', coordinates: [78.4867, 17.3850] },
    'pune': { name: 'Pune', coordinates: [73.8567, 18.5204] },
    'ahmedabad': { name: 'Ahmedabad', coordinates: [72.5714, 23.0225] },
    'lucknow': { name: 'Lucknow', coordinates: [80.9462, 26.8467] },
    'jaipur': { name: 'Jaipur', coordinates: [75.7873, 26.9124] },
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