import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, LogOut } from "lucide-react";
import Head from "next/head";
import TrafficMap from "@/components/TrafficMap";
import CitySelector from "@/components/CitySelector";
import TrafficFilters from "@/components/TrafficFilters";
import TrafficIncidents from "@/components/TrafficIncidents";
import TrafficStats from "@/components/TrafficStats";
import TrafficConditionsSummary from "@/components/TrafficConditionsSummary";

export default function Dashboard() {
  const { signOut, user } = useAuth();
  const [selectedCity, setSelectedCity] = useState("delhi");
  const [mapCenter, setMapCenter] = useState<[number, number]>([77.1025, 28.7041]); // Default to Delhi
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // TomTom API key - in a real app, this would be an environment variable
  const tomtomApiKey = "YOUR_TOMTOM_API_KEY"; // Placeholder - will be replaced with env var

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

      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 flex-col border-r bg-card p-4">
          <div className="flex items-center mb-6">
            <h1 className="text-xl font-bold">TrafficPulse</h1>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-medium mb-2">Location</h2>
              <CitySelector 
                selectedCity={selectedCity} 
                onCityChange={handleCityChange} 
              />
            </div>

            <Separator />

            <TrafficFilters 
              selectedFilters={selectedFilters} 
              onFilterChange={handleFilterChange} 
            />

            <Separator />

            <div className="mt-auto pt-6">
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

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold">Traffic Dashboard</h1>
                <p className="text-muted-foreground">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshData}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="md:hidden"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Mobile city selector */}
            <div className="block md:hidden mb-4">
              <CitySelector 
                selectedCity={selectedCity} 
                onCityChange={handleCityChange} 
              />
            </div>

            {/* Stats cards */}
            <TrafficStats city={selectedCity} />

            {/* Map and incidents */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle>Traffic Map</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {/* Traffic conditions summary */}
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
                  <div className="h-[500px] w-full">
                    <TrafficMap 
                      apiKey={process.env.NEXT_PUBLIC_TOMTOM_API_KEY || tomtomApiKey}
                      center={mapCenter}
                      zoom={12}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="lg:col-span-1">
                {/* Mobile filters */}
                <div className="block md:hidden mb-4">
                  <TrafficFilters 
                    selectedFilters={selectedFilters} 
                    onFilterChange={handleFilterChange} 
                  />
                </div>

                <TrafficIncidents selectedFilters={selectedFilters} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}