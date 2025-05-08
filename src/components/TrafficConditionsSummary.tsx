import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface TrafficConditionsSummaryProps {
  city: string;
  congestionLevel: number;
}

const TrafficConditionsSummary: React.FC<TrafficConditionsSummaryProps> = ({ 
  city, 
  congestionLevel 
}) => {
  // Determine traffic status based on congestion level
  const getTrafficStatus = () => {
    if (congestionLevel >= 80) {
      return {
        status: 'Heavy Traffic',
        description: 'Significant delays expected on major roads',
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
        color: 'bg-red-100 text-red-800 border-red-300'
      };
    } else if (congestionLevel >= 60) {
      return {
        status: 'Moderate Traffic',
        description: 'Some delays on main routes',
        icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
      };
    } else {
      return {
        status: 'Light Traffic',
        description: 'Roads are generally clear',
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        color: 'bg-green-100 text-green-800 border-green-300'
      };
    }
  };

  const trafficStatus = getTrafficStatus();

  return (
    <div className={`p-2 rounded-md border mb-3 flex items-center gap-2 ${trafficStatus.color}`}>
      {trafficStatus.icon}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{trafficStatus.status}</span>
          <Badge variant="outline" className="text-xs font-normal">
            {city.charAt(0).toUpperCase() + city.slice(1)}
          </Badge>
        </div>
        <p className="text-xs">{trafficStatus.description}</p>
      </div>
    </div>
  );
};

export default TrafficConditionsSummary;