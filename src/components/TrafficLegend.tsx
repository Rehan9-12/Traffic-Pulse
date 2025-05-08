import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface TrafficLegendProps {
  className?: string;
  isInMap?: boolean;
}

const TrafficLegend: React.FC<TrafficLegendProps> = ({ className = '', isInMap = false }) => {
  const legendItems = [
    { color: 'bg-gradient-to-r from-green-400 to-green-500', label: 'Free flow' },
    { color: 'bg-gradient-to-r from-yellow-400 to-yellow-500', label: 'Moderate' },
    { color: 'bg-gradient-to-r from-orange-400 to-orange-500', label: 'Slow' },
    { color: 'bg-gradient-to-r from-red-400 to-red-500', label: 'Heavy congestion' },
    { color: 'bg-gradient-to-r from-red-600 to-red-700', label: 'Standstill' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <Card className={`${isInMap ? 'absolute bottom-4 left-4 z-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm' : ''} shadow-lg border-slate-200 dark:border-slate-700 ${className}`}>
      <CardContent className="p-3">
        <h3 className="text-sm font-medium mb-3">Traffic Conditions</h3>
        <motion.div 
          className="space-y-2.5"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {legendItems.map((legendItem, index) => (
            <motion.div 
              key={index} 
              className="flex items-center gap-3"
              variants={item}
              transition={{ duration: 0.3 }}
            >
              <div className={`w-8 h-2.5 ${legendItem.color} rounded-full shadow-sm`}></div>
              <span className="text-xs text-slate-700 dark:text-slate-300">{legendItem.label}</span>
            </motion.div>
          ))}
          
          <motion.div 
            className="flex items-center gap-3 pt-1"
            variants={item}
            transition={{ duration: 0.3 }}
          >
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 shadow-sm flex items-center justify-center">
              <motion.span 
                className="text-white text-[8px] font-bold"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                !
              </motion.span>
            </div>
            <span className="text-xs text-slate-700 dark:text-slate-300">Incident</span>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default TrafficLegend;