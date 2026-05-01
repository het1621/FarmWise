import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Added to read the "backpack"
// Removed Base44 Weather import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Droplets, 
  Wind, 
  Eye,
  Sun,
  CloudRain,
  Cloud,
  MapPin,
  Calendar,
  AlertCircle // Added for error handling
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

const WeatherIcon = ({ condition, size = "w-6 h-6" }) => {
  const normalized = condition?.toLowerCase() || 'sunny';
  if (normalized.includes("cloud")) return <Cloud className={`${size} text-gray-500`} />;
  if (normalized.includes("rain") || normalized.includes("storm")) return <CloudRain className={`${size} text-blue-500`} />;
  if (normalized.includes("fog")) return <Eye className={`${size} text-gray-400`} />;
  return <Sun className={`${size} text-yellow-500`} />;
};

export default function WeatherPage() {
  // 1. Open the backpack from the Dashboard
  const routerLocation = useLocation();
  const initialCity = routerLocation.state?.location || "Ahmedabad";

  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(initialCity); // Search bar text
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Fetch data as soon as the page loads
  useEffect(() => {
    fetchWeather(initialCity);
  }, [initialCity]);

  // 3. The Real Python API Call
  const fetchWeather = async (city) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/weather?location=${city}`);
      const data = await response.json();
      
      if (response.ok) {
        setWeatherData(data);
        setLocation(data.location); // Update search bar with exact verified name
      } else {
        setError(data.error || "City not found. Please try another location.");
      }
    } catch (err) {
      setError("Failed to connect to the weather server.");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Handle Search Bar Submission
  const handleLocationSearch = (e) => {
    e.preventDefault(); // Prevents page reload
    if (location.trim()) {
      fetchWeather(location);
    }
  };

  if (isLoading && !weatherData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normalize condition for the Farm Tips
  const currentCondition = weatherData?.condition?.toLowerCase() || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Weather Forecast</h1>
          
          {/* Form wrapper allows users to press "Enter" to search */}
          <form onSubmit={handleLocationSearch} className="flex gap-3 mb-6">
            <Input
              placeholder="Enter your farm location (e.g., Pune, London, Tokyo)..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="max-w-md bg-white"
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              <MapPin className="w-4 h-4 mr-2" />
              {isLoading ? "Searching..." : "Get Weather"}
            </Button>
          </form>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}
        </motion.div>

        {!error && weatherData && (
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Current Weather Card */}
            <Card className="bg-gradient-to-br from-white to-blue-50 shadow-xl border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <WeatherIcon condition={weatherData.condition} size="w-8 h-8" />
                  Current Weather
                </CardTitle>
                <p className="text-blue-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {weatherData.location}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-gray-900 mb-2">
                    {weatherData.temperature}°C
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-lg px-4 py-2 capitalize">
                    {weatherData.condition}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">Humidity</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{weatherData.humidity}%</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Wind className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">Wind Speed</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{weatherData.wind_speed} km/h</p>
                  </div>
                </div>
                
                {/* Will only show if rainfall > 0, which we can add to the backend later! */}
                {weatherData.rainfall > 0 && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <CloudRain className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">Rainfall</span>
                    </div>
                    <p className="text-xl font-bold text-blue-700">{weatherData.rainfall} mm</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Farming Tips Based on Weather */}
            <Card className="bg-gradient-to-br from-green-50 to-lime-50 shadow-xl border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-green-700">
                  <Calendar className="w-6 h-6" />
                  Today's Farm Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Normalized the string matching so "Partly Cloudy" or "Sunny" triggers correctly */}
                  {currentCondition.includes('sun') && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-sm">
                      <h4 className="font-semibold text-yellow-800 mb-2">Sunny Day Tips</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Perfect day for harvesting mature crops</li>
                        <li>• Ensure adequate irrigation for young plants</li>
                        <li>• Good time for field preparation</li>
                      </ul>
                    </div>
                  )}
                  
                  {(currentCondition.includes('rain') || currentCondition.includes('storm')) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
                      <h4 className="font-semibold text-blue-800 mb-2">Rainy Day Tips</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Check drainage systems</li>
                        <li>• Avoid heavy field work</li>
                        <li>• Monitor for fungal diseases</li>
                        <li>• Good natural irrigation for crops</li>
                      </ul>
                    </div>
                  )}
                  
                  {weatherData.humidity > 70 && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 shadow-sm">
                      <h4 className="font-semibold text-purple-800 mb-2">High Humidity Alert</h4>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• Watch for pest activity</li>
                        <li>• Consider fungicide application</li>
                        <li>• Improve air circulation in crops</li>
                      </ul>
                    </div>
                  )}
                  
                  {weatherData.wind_speed > 25 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 shadow-sm">
                      <h4 className="font-semibold text-orange-800 mb-2">Windy Conditions</h4>
                      <ul className="text-sm text-orange-700 space-y-1">
                        <li>• Secure loose materials</li>
                        <li>• Support tall crops</li>
                        <li>• Avoid spraying activities</li>
                      </ul>
                    </div>
                  )}

                  {/* Fallback tip if weather is perfectly mild */}
                  {!currentCondition.includes('rain') && weatherData.wind_speed <= 25 && weatherData.humidity <= 70 && !currentCondition.includes('sun') && (
                     <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
                      <h4 className="font-semibold text-green-800 mb-2">Mild Weather Tips</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Excellent day for general farm maintenance</li>
                        <li>• Safely apply fertilizers or gentle sprays</li>
                        <li>• Great conditions for planting new seeds</li>
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* 7-Day Forecast */}
        {/* We kept your exact code! It will automatically appear once we update the Python backend to send this data. */}
        {weatherData?.forecast_7_days && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">7-Day Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                  {weatherData.forecast_7_days.map((day, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="font-medium text-gray-700 mb-2">
                        {format(new Date(day.date), "EEE")}
                      </p>
                      <WeatherIcon condition={day.condition} size="w-8 h-8 mx-auto" />
                      <div className="mt-2">
                        <p className="font-bold text-lg">{day.max_temp}°</p>
                        <p className="text-sm text-gray-600">{day.min_temp}°</p>
                      </div>
                      <p className="text-xs text-blue-600 mt-1">
                        {day.rainfall_chance}% rain
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}