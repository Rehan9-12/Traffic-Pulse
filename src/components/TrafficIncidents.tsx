import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Construction, Car, CloudRain, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for traffic incidents in Indian cities
const mockIncidents = [
  {
    id: '1',
    type: 'accident',
    description: 'Multi-vehicle collision',
    location: 'NH-48, Gurugram Expressway',
    severity: 'high',
    time: '10:30 AM',
  },
  {
    id: '2',
    type: 'construction',
    description: 'Metro construction - lane closure',
    location: 'MG Road, Bengaluru',
    severity: 'medium',
    time: '09:15 AM',
  },
  {
    id: '3',
    type: 'congestion',
    description: 'Heavy traffic jam',
    location: 'Silk Board Junction, Bengaluru',
    severity: 'high',
    time: '08:45 AM',
  },
  {
    id: '4',
    type: 'weather',
    description: 'Waterlogging due to rain',
    location: 'Andheri Subway, Mumbai',
    severity: 'high',
    time: '11:20 AM',
  },
  {
    id: '5',
    type: 'event',
    description: 'Cricket match causing delays',
    location: 'Near Wankhede Stadium, Mumbai',
    severity: 'medium',
    time: '07:30 PM',
  },
  {
    id: '6',
    type: 'accident',
    description: 'Truck overturned',
    location: 'Outer Ring Road, Hyderabad',
    severity: 'high',
    time: '02:15 PM',
  },
  {
    id: '7',
    type: 'congestion',
    description: 'Rush hour traffic',
    location: 'DND Flyway, Delhi-Noida',
    severity: 'medium',
    time: '06:30 PM',
  },
  {
    id: '8',
    type: 'construction',
    description: 'Flyover repair work',
    location: 'Anna Salai, Chennai',
    severity: 'medium',
    time: '11:45 AM',
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

  // Get badge color and style based on severity
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'high':
        return {
          color: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
          pulse: true
        };
      case 'medium':
        return {
          color: 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white',
          pulse: false
        };
      case 'low':
        return {
          color: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
          pulse: false
        };
      default:
        return {
          color: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
          pulse: false
        };
    }
  };
  
  // Get background color based on incident type
  const getIncidentBgColor = (type: string) => {
    switch (type) {
      case 'accident':
        return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400';
      case 'construction':
        return 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400';
      case 'congestion':
        return 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400';
      case 'weather':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
      case 'event':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <Card className="overflow-hidden border-slate-200 dark:border-slate-700 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700/50">
        <CardTitle className="text-lg font-medium flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
          Traffic Incidents
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-[400px] pr-4">
          <AnimatePresence mode="wait">
            {filteredIncidents.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-full bg-slate-100 dark:bg-slate-700 p-3 mb-4"
                >
                  <AlertCircle className="h-6 w-6 text-slate-400" />
                </motion.div>
                <p className="text-slate-500 dark:text-slate-400">No incidents match your filters</p>
              </motion.div>
            ) : (
              <motion.div 
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredIncidents.map((incident) => {
                  const severityStyle = getSeverityStyle(incident.severity);
                  const bgColor = getIncidentBgColor(incident.type);
                  
                  return (
                    <motion.div 
                      key={incident.id}
                      variants={itemVariants}
                      layout
                      className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-slate-800 flex items-start gap-3 hover:shadow-md transition-shadow duration-200"
                    >
                      <motion.div 
                        className={`p-2 rounded-full ${bgColor}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {getIncidentIcon(incident.type)}
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{incident.description}</h4>
                          <Badge className={`${severityStyle.color} shadow-sm`}>
                            {severityStyle.pulse ? (
                              <motion.span
                                animate={{ opacity: [1, 0.7, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="flex items-center"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-white mr-1 inline-block"></span>
                                {incident.severity}
                              </motion.span>
                            ) : (
                              incident.severity
                            )}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{incident.location}</p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-slate-500 dark:text-slate-400">Reported at {incident.time}</p>
                          <motion.button 
                            className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Details
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TrafficIncidents;