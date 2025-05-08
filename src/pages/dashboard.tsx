import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, LogOut, Info, ChevronRight, Menu } from "lucide-react";
import Head from "next/head";
import TrafficMap from "@/components/TrafficMap";
import CitySelector from "@/components/CitySelector";
import TrafficFilters from "@/components/TrafficFilters";
import TrafficIncidents from "@/components/TrafficIncidents";
import TrafficStats from "@/components/TrafficStats";
import TrafficConditionsSummary from "@/components/TrafficConditionsSummary";
import TrafficLegend from "@/components/TrafficLegend";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Dashboard() {
  const { signOut, user } = useAuth();
  const [selectedCity, setSelectedCity] = useState("delhi");
  const [mapCenter, setMapCenter] = useState<[number, number]>([77.1025, 28.7041]); // Default to Delhi
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [showLegend, setShowLegend] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.4 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };
  
  const slideIn = {
    hidden: { x: -20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // TomTom API key from environment variables
  const tomtomApiKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY || "";
  
  // Log API key availability (not the actual key for security)
  useEffect(() => {
    console.log("TomTom API key available:", !!tomtomApiKey);
  }, [tomtomApiKey]);

  // Handle city change
  const handleCityChange = (city: string, coordinates: [number, number]) => {
    setSelectedCity(city);
    setMapCenter(coordinates);
  };

  // Handle filter change
  const handleFilterChange = (filters: string[]) => {
    setSelectedFilters(filters);
  };

  // Simulate data refresh
  const refreshData = () => {
    setIsRefreshing(true);
    // In a real app, this would fetch new data from the API
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date());
    }, 1000);
  };

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>TrafficPulse Dashboard</title>
        <meta name="description" content="Real-time traffic monitoring dashboard" />
        <link rel="stylesheet" href="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps.css" />
      </Head>

      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Desktop Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              className="hidden md:flex w-72 flex-col border-r bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-5 shadow-lg"
              initial={{ x: -72, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -72, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <motion.div 
                className="flex items-center mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-xl font-bold flex items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    className="w-6 h-6 mr-2 text-blue-500"
                  >
                    <path d="M15 3H9v12h6V3zM8 3c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v12c0 .6-.4 1-1 1H9c-.6 0-1-.4-1-1V3z"/>
                    <path d="M8 14h8v4H8v-4zm-5-9h4v10H3V5zm18 0h-4v10h4V5z"/>
                    <path d="M12 17.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/>
                    <path d="M5 16h14v2H5z"/>
                  </svg>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    TrafficPulse
                  </span>
                </div>
              </motion.div>

              <motion.div 
                className="space-y-6"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={slideIn}>
                  <h2 className="text-sm font-medium mb-3 text-slate-500 dark:text-slate-400 uppercase tracking-wider">Location</h2>
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-3 border border-slate-200 dark:border-slate-700">
                    <CitySelector 
                      selectedCity={selectedCity} 
                      onCityChange={handleCityChange} 
                    />
                  </div>
                </motion.div>

                <Separator className="my-6 bg-slate-200 dark:bg-slate-700" />

                <motion.div variants={slideIn}>
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-3 border border-slate-200 dark:border-slate-700">
                    <TrafficFilters 
                      selectedFilters={selectedFilters} 
                      onFilterChange={handleFilterChange} 
                    />
                  </div>
                </motion.div>

                <Separator className="my-6 bg-slate-200 dark:bg-slate-700" />

                <motion.div variants={slideIn}>
                  <h2 className="text-sm font-medium mb-3 text-slate-500 dark:text-slate-400 uppercase tracking-wider">Traffic Conditions</h2>
                  <div className="space-y-3">
                    <TrafficConditionsSummary 
                      city={selectedCity} 
                      congestionLevel={
                        selectedCity === 'delhi' ? 85 :
                        selectedCity === 'mumbai' ? 90 :
                        selectedCity === 'bengaluru' ? 82 :
                        selectedCity === 'chennai' ? 75 :
                        selectedCity === 'kolkata' ? 80 :
                        selectedCity === 'hyderabad' ? 72 :
                        selectedCity === 'pune' ? 68 :
                        selectedCity === 'ahmedabad' ? 65 :
                        selectedCity === 'lucknow' ? 60 :
                        selectedCity === 'jaipur' ? 62 : 75
                      }
                    />
                    
                    {/* Traffic Legend */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-3 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-medium">Traffic Signs</h2>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-700"
                          onClick={() => setShowLegend(!showLegend)}
                        >
                          <Info className="h-3 w-3 mr-1" />
                          {showLegend ? 'Hide' : 'Show'}
                        </Button>
                      </div>
                      <AnimatePresence>
                        {showLegend && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <TrafficLegend className="mt-2" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="mt-auto pt-6"
                  variants={slideIn}
                >
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700" 
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <motion.main 
          className="flex-1 overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6">
            {/* Header */}
            <motion.div 
              className="flex justify-between items-center mb-8"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2 md:flex hidden"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Traffic Dashboard</h1>
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-green-500 mr-2"
                    ></motion.div>
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={refreshData}
                    disabled={isRefreshing}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </motion.div>
                
                {/* Mobile menu */}
                <div className="md:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                      <div className="py-4">
                        <div className="text-xl font-bold flex items-center mb-6">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            className="w-6 h-6 mr-2 text-blue-500"
                          >
                            <path d="M15 3H9v12h6V3zM8 3c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v12c0 .6-.4 1-1 1H9c-.6 0-1-.4-1-1V3z"/>
                            <path d="M8 14h8v4H8v-4zm-5-9h4v10H3V5zm18 0h-4v10h4V5z"/>
                            <path d="M12 17.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/>
                            <path d="M5 16h14v2H5z"/>
                          </svg>
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            TrafficPulse
                          </span>
                        </div>
                        
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-sm font-medium mb-3 text-slate-500 dark:text-slate-400 uppercase tracking-wider">Location</h2>
                            <CitySelector 
                              selectedCity={selectedCity} 
                              onCityChange={handleCityChange} 
                            />
                          </div>
                          
                          <Separator className="my-6" />
                          
                          <TrafficFilters 
                            selectedFilters={selectedFilters} 
                            onFilterChange={handleFilterChange} 
                          />
                          
                          <Separator className="my-6" />
                          
                          <div>
                            <h2 className="text-sm font-medium mb-3 text-slate-500 dark:text-slate-400 uppercase tracking-wider">Traffic Conditions</h2>
                            <TrafficConditionsSummary 
                              city={selectedCity} 
                              congestionLevel={
                                selectedCity === 'delhi' ? 85 :
                                selectedCity === 'mumbai' ? 90 :
                                selectedCity === 'bengaluru' ? 82 :
                                selectedCity === 'chennai' ? 75 :
                                selectedCity === 'kolkata' ? 80 :
                                selectedCity === 'hyderabad' ? 72 :
                                selectedCity === 'pune' ? 68 :
                                selectedCity === 'ahmedabad' ? 65 :
                                selectedCity === 'lucknow' ? 60 :
                                selectedCity === 'jaipur' ? 62 : 75
                              }
                            />
                            
                            {/* Traffic Legend */}
                            <div className="mt-4">
                              <div className="flex items-center justify-between mb-2">
                                <h2 className="text-sm font-medium">Traffic Signs</h2>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 px-2 text-xs"
                                  onClick={() => setShowLegend(!showLegend)}
                                >
                                  <Info className="h-3 w-3 mr-1" />
                                  {showLegend ? 'Hide Legend' : 'Show Legend'}
                                </Button>
                              </div>
                              {showLegend && <TrafficLegend className="mt-2" />}
                            </div>
                          </div>
                          
                          <div className="pt-6">
                            <Button 
                              variant="outline" 
                              className="w-full justify-start" 
                              onClick={() => signOut()}
                            >
                              <LogOut className="mr-2 h-4 w-4" />
                              Log Out
                            </Button>
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </motion.div>

            {/* Stats cards */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <TrafficStats city={selectedCity} />
            </motion.div>

            {/* Map and incidents */}
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="lg:col-span-2 overflow-hidden border-slate-200 dark:border-slate-700 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700/50">
                  <CardTitle className="flex items-center">
                    <span className="mr-2">Traffic Map</span>
                    <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full">
                      Live
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <motion.div 
                    className="h-[500px] w-full relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    {!tomtomApiKey ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <p className="text-muted-foreground">TomTom API key not found. Please check your environment variables.</p>
                      </div>
                    ) : (
                      <TrafficMap 
                        apiKey={tomtomApiKey}
                        center={mapCenter}
                        zoom={12}
                      />
                    )}
                  </motion.div>
                </CardContent>
              </Card>

              <motion.div 
                className="lg:col-span-1 space-y-6"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={fadeIn}>
                  <TrafficIncidents selectedFilters={selectedFilters} />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.main>
      </div>
    </>
  );
}