import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Label } from '@/components/ui/label';
import { 
  AlertTriangle, 
  Construction, 
  Car, 
  CloudRain, 
  AlertCircle 
} from 'lucide-react';

interface TrafficFiltersProps {
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

const TrafficFilters: React.FC<TrafficFiltersProps> = ({ 
  selectedFilters, 
  onFilterChange 
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium mb-2 block">Traffic Filters</Label>
        <ToggleGroup 
          type="multiple" 
          variant="outline"
          value={selectedFilters}
          onValueChange={onFilterChange}
          className="justify-start"
        >
          <ToggleGroupItem value="accidents" aria-label="Toggle accidents">
            <Car className="h-4 w-4 mr-2" />
            Accidents
          </ToggleGroupItem>
          <ToggleGroupItem value="construction" aria-label="Toggle construction">
            <Construction className="h-4 w-4 mr-2" />
            Construction
          </ToggleGroupItem>
          <ToggleGroupItem value="congestion" aria-label="Toggle congestion">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Congestion
          </ToggleGroupItem>
          <ToggleGroupItem value="weather" aria-label="Toggle weather">
            <CloudRain className="h-4 w-4 mr-2" />
            Weather
          </ToggleGroupItem>
          <ToggleGroupItem value="events" aria-label="Toggle events">
            <AlertCircle className="h-4 w-4 mr-2" />
            Events
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default TrafficFilters;