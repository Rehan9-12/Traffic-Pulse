import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TrafficLegendProps {
  className?: string;
  isInMap?: boolean;
}

const TrafficLegend: React.FC<TrafficLegendProps> = ({ className = '', isInMap = false }) => {
  return (
    <Card className={`${isInMap ? 'absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm' : ''} shadow-lg ${className}`}>
      <CardContent className="p-3">
        <h3 className="text-sm font-medium mb-2">Traffic Conditions</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-2 bg-green-500 rounded"></div>
            <span className="text-xs">Free flow</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-2 bg-yellow-500 rounded"></div>
            <span className="text-xs">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-2 bg-orange-500 rounded"></div>
            <span className="text-xs">Slow</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-2 bg-red-500 rounded"></div>
            <span className="text-xs">Heavy congestion</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-2 bg-red-700 rounded"></div>
            <span className="text-xs">Standstill</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-white text-[8px]">!</span>
            </div>
            <span className="text-xs">Incident</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrafficLegend;