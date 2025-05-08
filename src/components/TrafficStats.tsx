import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowUpIcon, ArrowDownIcon, AlertTriangle, Car, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrafficStatsProps {
  city: string;
}

const TrafficStats: React.FC<TrafficStatsProps> = ({ city }) => {
  // Animation state for counters - initialize with actual values to avoid showing 0
  const [countProgress, setCountProgress] = useState({
    congestion: 0,
    speed: 0,
    incidents: 0
  });

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
    if (level >= 80) return 'from-red-500 to-red-600';
    if (level >= 60) return 'from-yellow-400 to-yellow-500';
    if (level >= 40) return 'from-orange-400 to-orange-500';
    return 'from-green-400 to-green-500';
  };

  // Animate counters when city changes
  useEffect(() => {
    // Set initial values immediately to avoid showing 0
    setCountProgress({
      congestion: cityStats.congestionLevel,
      speed: cityStats.avgSpeed,
      incidents: cityStats.incidentCount
    });
  }, [city, cityStats]);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
      >
        <Card className="overflow-hidden border-slate-200 dark:border-slate-700 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700/50">
            <CardTitle className="text-sm font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-red-500" />
              Congestion Level
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-baseline justify-between">
              <motion.div 
                className="text-3xl font-bold"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {Math.round(countProgress.congestion)}%
              </motion.div>
              <motion.div 
                className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${cityStats.congestionChange > 0 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {cityStats.congestionChange > 0 ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                )}
                {Math.abs(cityStats.congestionChange)}%
              </motion.div>
            </div>
            <div className="h-2 mt-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full bg-gradient-to-r ${getCongestionColor(cityStats.congestionLevel)} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${cityStats.congestionLevel}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
              Current traffic density compared to normal conditions
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        <Card className="overflow-hidden border-slate-200 dark:border-slate-700 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700/50">
            <CardTitle className="text-sm font-medium flex items-center">
              <Car className="h-4 w-4 mr-2 text-blue-500" />
              Average Speed
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-baseline justify-between">
              <motion.div 
                className="text-3xl font-bold"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {Math.round(countProgress.speed)} km/h
              </motion.div>
              <motion.div 
                className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${cityStats.speedChange < 0 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {cityStats.speedChange > 0 ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                )}
                {Math.abs(cityStats.speedChange)} km/h
              </motion.div>
            </div>
            <div className="h-2 mt-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(cityStats.avgSpeed / 40) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
              Average vehicle speed across major roads
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <Card className="overflow-hidden border-slate-200 dark:border-slate-700 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700/50">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
              Active Incidents
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <motion.div 
              className="text-3xl font-bold"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {Math.round(countProgress.incidents)}
            </motion.div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <motion.div 
                className="h-2 bg-gradient-to-r from-red-400 to-red-500 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                style={{ transformOrigin: "left" }}
              />
              <motion.div 
                className="h-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                style={{ transformOrigin: "left" }}
              />
              <motion.div 
                className="h-2 bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                style={{ transformOrigin: "left" }}
              />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-1">
              <div className="text-[10px] text-center text-slate-500 dark:text-slate-400">Critical</div>
              <div className="text-[10px] text-center text-slate-500 dark:text-slate-400">Major</div>
              <div className="text-[10px] text-center text-slate-500 dark:text-slate-400">Minor</div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
              Total number of active traffic incidents
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TrafficStats;