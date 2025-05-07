import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface TrafficStatsProps {
  city: string;
}

const TrafficStats: React.FC<TrafficStatsProps> = ({ city }) => {
  // Mock data for traffic statistics for Indian cities
  const stats = {
    'delhi': {
      congestionLevel: 85,
      avgSpeed: 15,
      incidentCount: 58,
      congestionChange: 7,
      speedChange: -3,
    },
    'mumbai': {
      congestionLevel: 90,
      avgSpeed: 12,
      incidentCount: 64,
      congestionChange: 5,
      speedChange: -2,
    },
    'bengaluru': {
      congestionLevel: 82,
      avgSpeed: 14,
      incidentCount: 47,
      congestionChange: 8,
      speedChange: -4,
    },
    'chennai': {
      congestionLevel: 75,
      avgSpeed: 18,
      incidentCount: 39,
      congestionChange: 3,
      speedChange: -1,
    },
    'kolkata': {
      congestionLevel: 80,
      avgSpeed: 16,
      incidentCount: 45,
      congestionChange: 4,
      speedChange: -2,
    },
    'hyderabad': {
      congestionLevel: 72,
      avgSpeed: 20,
      incidentCount: 36,
      congestionChange: -2,
      speedChange: 1,
    },
    'pune': {
      congestionLevel: 68,
      avgSpeed: 22,
      incidentCount: 31,
      congestionChange: -3,
      speedChange: 2,
    },
    'ahmedabad': {
      congestionLevel: 65,
      avgSpeed: 24,
      incidentCount: 28,
      congestionChange: -5,
      speedChange: 3,
    },
    'lucknow': {
      congestionLevel: 60,
      avgSpeed: 25,
      incidentCount: 24,
      congestionChange: -2,
      speedChange: 1,
    },
    'jaipur': {
      congestionLevel: 62,
      avgSpeed: 23,
      incidentCount: 26,
      congestionChange: -1,
      speedChange: 1,
    },
  };

  // Default to Delhi if city not found
  const cityStats = stats[city as keyof typeof stats] || stats['delhi'];

  // Get congestion level color
  const getCongestionColor = (level: number) => {
    if (level >= 80) return 'bg-red-500';
    if (level >= 60) return 'bg-yellow-500';
    if (level >= 40) return 'bg-orange-400';
    return 'bg-green-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Congestion Level</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">{cityStats.congestionLevel}%</div>
            <div className={`flex items-center text-xs ${cityStats.congestionChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {cityStats.congestionChange > 0 ? (
                <ArrowUpIcon className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 mr-1" />
              )}
              {Math.abs(cityStats.congestionChange)}%
            </div>
          </div>
          <Progress 
            value={cityStats.congestionLevel} 
            className={`h-2 mt-2 ${getCongestionColor(cityStats.congestionLevel)}`} 
          />
          <p className="text-xs text-muted-foreground mt-2">
            Current traffic density compared to normal conditions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Average Speed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">{cityStats.avgSpeed} km/h</div>
            <div className={`flex items-center text-xs ${cityStats.speedChange < 0 ? 'text-red-500' : 'text-green-500'}`}>
              {cityStats.speedChange > 0 ? (
                <ArrowUpIcon className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 mr-1" />
              )}
              {Math.abs(cityStats.speedChange)} km/h
            </div>
          </div>
          <Progress 
            value={(cityStats.avgSpeed / 40) * 100} 
            className="h-2 mt-2 bg-blue-500" 
          />
          <p className="text-xs text-muted-foreground mt-2">
            Average vehicle speed across major roads
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cityStats.incidentCount}</div>
          <div className="grid grid-cols-3 gap-1 mt-2">
            <div className="h-2 bg-red-500 rounded"></div>
            <div className="h-2 bg-yellow-500 rounded"></div>
            <div className="h-2 bg-green-500 rounded"></div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Total number of active traffic incidents
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrafficStats;