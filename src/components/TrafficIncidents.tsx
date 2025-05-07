import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Construction, Car, CloudRain, AlertCircle } from 'lucide-react';

// Mock data for traffic incidents
const mockIncidents = [
  {
    id: '1',
    type: 'accident',
    description: 'Multi-vehicle collision',
    location: 'I-95 Northbound, Exit 7',
    severity: 'high',
    time: '10:30 AM',
  },
  {
    id: '2',
    type: 'construction',
    description: 'Road work - lane closure',
    location: 'Main St & 5th Ave',
    severity: 'medium',
    time: '09:15 AM',
  },
  {
    id: '3',
    type: 'congestion',
    description: 'Heavy traffic',
    location: 'Downtown area',
    severity: 'medium',
    time: '08:45 AM',
  },
  {
    id: '4',
    type: 'weather',
    description: 'Flooding on roadway',
    location: 'River Rd near Park',
    severity: 'high',
    time: '11:20 AM',
  },
  {
    id: '5',
    type: 'event',
    description: 'Sports event causing delays',
    location: 'Stadium area',
    severity: 'low',
    time: '07:30 PM',
  },
  {
    id: '6',
    type: 'accident',
    description: 'Vehicle overturned',
    location: 'Highway 101 Southbound',
    severity: 'high',
    time: '02:15 PM',
  },
];

interface TrafficIncidentsProps {
  selectedFilters: string[];
}

const TrafficIncidents: React.FC<TrafficIncidentsProps> = ({ selectedFilters }) => {
  // Filter incidents based on selected filters
  const filteredIncidents = selectedFilters.length === 0
    ? mockIncidents
    : mockIncidents.filter(incident => {
        if (incident.type === 'accident' && selectedFilters.includes('accidents')) return true;
        if (incident.type === 'construction' && selectedFilters.includes('construction')) return true;
        if (incident.type === 'congestion' && selectedFilters.includes('congestion')) return true;
        if (incident.type === 'weather' && selectedFilters.includes('weather')) return true;
        if (incident.type === 'event' && selectedFilters.includes('events')) return true;
        return false;
      });

  // Get icon based on incident type
  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'accident':
        return <Car className="h-4 w-4" />;
      case 'construction':
        return <Construction className="h-4 w-4" />;
      case 'congestion':
        return <AlertTriangle className="h-4 w-4" />;
      case 'weather':
        return <CloudRain className="h-4 w-4" />;
      case 'event':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Get badge color based on severity
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Traffic Incidents</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {filteredIncidents.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No incidents match your filters</p>
          ) : (
            <div className="space-y-4">
              {filteredIncidents.map((incident) => (
                <div 
                  key={incident.id} 
                  className="p-4 border rounded-lg flex items-start gap-3"
                >
                  <div className={`p-2 rounded-full bg-muted`}>
                    {getIncidentIcon(incident.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{incident.description}</h4>
                      <Badge className={`${getSeverityColor(incident.severity)} text-white`}>
                        {incident.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{incident.location}</p>
                    <p className="text-xs text-muted-foreground mt-2">Reported at {incident.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TrafficIncidents;