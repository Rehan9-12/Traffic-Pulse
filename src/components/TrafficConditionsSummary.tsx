import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        color: 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/30',
        gauge: {
          color: 'from-red-500 to-red-600',
          pulse: true
        }
      };
    } else if (congestionLevel >= 60) {
      return {
        status: 'Moderate Traffic',
        description: 'Some delays on main routes',
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        color: 'bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/30',
        gauge: {
          color: 'from-yellow-400 to-yellow-500',
          pulse: false
        }
      };
    } else {
      return {
        status: 'Light Traffic',
        description: 'Roads are generally clear',
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        color: 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/30',
        gauge: {
          color: 'from-green-400 to-green-500',
          pulse: false
        }
      };
    }
  };

  const trafficStatus = getTrafficStatus();

  return (
    <motion.div 
      className={`p-4 rounded-xl border shadow-sm backdrop-blur-sm ${trafficStatus.color}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-start gap-3">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {trafficStatus.icon}
        </motion.div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <motion.span 
              className="font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {trafficStatus.status}
            </motion.span>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Badge variant="outline" className="text-xs font-normal">
                {city.charAt(0).toUpperCase() + city.slice(1)}
              </Badge>
            </motion.div>
          </div>
          <motion.p 
            className="text-xs opacity-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            {trafficStatus.description}
          </motion.p>
          
          {/* Congestion level gauge */}
          <motion.div 
            className="mt-3 space-y-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <div className="flex justify-between text-xs">
              <span>Congestion Level</span>
              <span className="font-medium">{congestionLevel}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full bg-gradient-to-r ${trafficStatus.gauge.color} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${congestionLevel}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {trafficStatus.gauge.pulse && (
                  <motion.div 
                    className="absolute top-0 right-0 bottom-0 w-4 bg-white/30"
                    animate={{ 
                      x: ["-100%", "100%"],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default TrafficConditionsSummary;