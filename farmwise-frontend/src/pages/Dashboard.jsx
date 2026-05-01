import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { 
  Droplets, 
  Wind, 
  TrendingUp, 
  Sprout,
  Sun,
  CloudRain,
  Eye,
  ArrowRight,
  MapPin, 
  Phone,
  AlertTriangle, // Added for alerts
  MessageCircle, X, Send, Globe // Added for the chatbot
} from "lucide-react";
import { motion } from "framer-motion";

// --- THE INLINE CHATBOT COMPONENT ---
// (Put here so you don't have to create a new file!)
const FarmWiseChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('en'); 
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "Hello! I am your FarmWise AI assistant. 🌾", sender: 'bot' }
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { text: input, sender: 'user' }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, language: language })
      });
      const data = await response.json();
      setMessages([...newMessages, { text: data.reply, sender: 'bot' }]);
    } catch (error) {
      setMessages([...newMessages, { text: "Connection error. Please try again.", sender: 'bot' }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <Button onClick={() => setIsOpen(true)} className="rounded-full w-14 h-14 bg-green-600 hover:bg-green-700 shadow-xl flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      )}

      {isOpen && (
        <Card className="w-80 md:w-96 shadow-2xl flex flex-col h-[500px] border-green-200">
          <CardHeader className="bg-green-600 text-white rounded-t-lg p-4 flex flex-row justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> FarmWise AI
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-green-700">
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          
          <div className="bg-green-50 p-2 flex justify-center gap-2 border-b border-green-100">
            <Globe className="w-4 h-4 mt-1 text-green-700" />
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="text-sm bg-transparent border-none text-green-800 font-medium outline-none cursor-pointer">
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="gu">ગુજરાતી (Gujarati)</option>
            </select>
          </div>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2 max-w-[85%] text-sm shadow-sm ${msg.sender === 'user' ? 'bg-green-600 text-white rounded-2xl rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-bl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </CardContent>

          <div className="p-3 bg-white border-t rounded-b-lg">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex w-full gap-2">
              <Input placeholder="Type a message..." value={input} onChange={(e) => setInput(e.target.value)} className="flex-1" />
              <Button type="submit" size="icon" className="bg-green-600 hover:bg-green-700 shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </div>
  );
};
// --- END CHATBOT ---

const WeatherIcon = ({ condition }) => {
  const normalizedCondition = condition?.toLowerCase() || 'sunny';
  const icons = {
    sunny: <Sun className="w-6 h-6 text-yellow-500" />,
    cloudy: <Eye className="w-6 h-6 text-gray-500" />,
    rainy: <CloudRain className="w-6 h-6 text-blue-500" />,
    stormy: <CloudRain className="w-6 h-6 text-purple-600" />,
    foggy: <Eye className="w-6 h-6 text-gray-400" />
  };
  
  for (const key in icons) {
      if (normalizedCondition.includes(key)) {
          return icons[key];
      }
  }
  return <Sun className="w-6 h-6 text-yellow-500" />; 
};

export default function Dashboard() {
  const [weather, setWeather] = useState({ 
    temperature: '--', 
    condition: 'Loading...', 
    humidity: '--', 
    location: 'Connecting to server...',
    alerts: [] // Added alerts state
  });
  
  const [cropRecommendations, setCropRecommendations] = useState([]);
  const [marketPrices, setMarketPrices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const weatherResponse = await fetch('http://127.0.0.1:5000/api/weather');
        if (weatherResponse.ok) {
           const weatherData = await weatherResponse.json();
           setWeather(weatherData);
        }
        
        const cropsResponse = await fetch('http://127.0.0.1:5000/api/crops');
        if (cropsResponse.ok) {
           const cropsData = await cropsResponse.json();
           setCropRecommendations(cropsData);
        }

        const marketResponse = await fetch('http://127.0.0.1:5000/api/market-prices');
        if (marketResponse.ok) {
           const marketData = await marketResponse.json();
           setMarketPrices(marketData);
        }

      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delayChildren: 0.1, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            Good Morning, Farmer! 🌾
          </h1>
          <p className="text-lg text-gray-600">
            Here's what's happening on your farm today
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Current Weather Card with ALERTS */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className="h-full shadow-lg transition-shadow duration-300 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex gap-2 items-center text-xl">
                  {weather && <WeatherIcon condition={weather.condition} />}
                  <span>Local Weather</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-bold text-gray-900">
                        {weather.temperature}°C
                      </span>
                      <Badge variant="secondary" className="capitalize bg-blue-100 text-blue-800">
                        {weather.condition}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center text-sm font-medium text-blue-800">
                      <MapPin className="w-4 h-4 mr-1" />
                      {weather.location}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex gap-2 items-center">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <span>{weather.humidity}% Humidity</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Wind className="w-4 h-4 text-gray-500" />
                        <span>{weather.wind_speed || '--'} km/h</span>
                      </div>
                    </div>

                    {/* DYNAMIC WEATHER ALERTS INJECTED HERE */}
                    {weather.alerts && weather.alerts.length > 0 ? (
                      <div className="mt-6 space-y-3">
                        {weather.alerts.map((alert, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-red-50 border-l-4 border-red-500 rounded-md">
                            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                              <h4 className="text-sm font-semibold text-red-800">Farm Alert</h4>
                              <p className="text-sm text-red-700">{alert}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : weather.condition !== 'Loading...' && (
                      <div className="mt-6 flex items-start gap-3 p-3 bg-green-50 border-l-4 border-green-500 rounded-md">
                        <AlertTriangle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-green-800">All Clear</h4>
                          <p className="text-sm text-green-700">Conditions are optimal. No active alerts today.</p>
                        </div>
                      </div>
                    )}

                    <Link to="/Weather" state={{ location: weather.location }} className="block pt-2">
                      <Button variant="outline" className="w-full hover:bg-blue-50">
                        View Detailed Forecast
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Crop Recommendations */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="h-full shadow-lg transition-shadow duration-300 bg-gradient-to-br from-green-50 to-lime-50 border-green-200 hover:shadow-xl flex flex-col">
              <CardHeader>
                <CardTitle className="flex gap-2 items-center text-xl">
                  <Sprout className="w-6 h-6 text-green-600" />
                  Recommended Crops
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {cropRecommendations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 flex-1">Connecting to API for crop data...</div>
                ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 flex-1">
                  {cropRecommendations.slice(0, 3).map((crop, index) => (
                    <div key={crop.id} className="p-4 bg-white rounded-lg border shadow-sm border-green-100 flex flex-col">
                      <h4 className="mb-2 font-semibold text-gray-900">{crop.crop_name}</h4>
                      <div className="space-y-2 flex-1">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            crop.profit_potential === 'very_high' ? 'bg-green-100 text-green-800' :
                            crop.profit_potential === 'high' ? 'bg-lime-100 text-lime-800' :
                            crop.profit_potential === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {crop.profit_potential?.replace('_', ' ')} profit
                        </Badge>
                        <p className="text-sm text-gray-600">{crop.expected_yield}</p>
                        <p className="text-xs font-medium text-green-600">{crop.market_price_range}</p>
                      </div>
                    </div>
                  ))}
                </div>
                )}
                <Link to="/CropRecommendations" className="block mt-4">
                  <Button variant="outline" className="w-full hover:bg-green-50">
                    View All Recommendations
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Market Prices Overview */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
          <Card className="shadow-lg transition-shadow duration-300 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 hover:shadow-xl">
            <CardHeader>
              <CardTitle className="flex gap-2 items-center text-xl">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
                Today's Market Prices
              </CardTitle>
            </CardHeader>
            <CardContent>
                {marketPrices.length === 0 ? (
                     <div className="p-4 text-center text-gray-500">Connecting to API for market data...</div>
                ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {marketPrices.slice(0, 4).map((item) => (
                  <div key={item.id} className="p-4 bg-white rounded-lg border shadow-sm border-yellow-100">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{item.item_name}</h4>
                      <Badge 
                        variant="secondary"
                        className={`text-xs ${
                          item.price_trend === 'increasing' ? 'bg-green-100 text-green-800' :
                          item.price_trend === 'decreasing' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.price_trend}
                      </Badge>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      ₹{item.current_price}/{item.unit}
                    </p>
                    <p className="text-sm capitalize text-gray-600">{item.category}</p>
                  </div>
                ))}
              </div>
              )}
              <Link to="/MarketPrices" className="block mt-4">
                <Button variant="outline" className="w-full hover:bg-yellow-50">
                  View All Market Prices
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="grid grid-cols-2 gap-4 mt-8 md:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          {[
            { title: "Analyze Land", url: "/LandAnalysis", icon: MapPin, color: "amber" },
            { title: "Get Help", url: "/Helpline", icon: Phone, color: "purple" },
            { title: "Weather Forecast", url: "/Weather", icon: CloudRain, color: "blue" },
            { title: "Crop Guide", url: "/CropRecommendations", icon: Sprout, color: "green" }
          ].map((action, index) => (
            <motion.div key={action.title} variants={itemVariants}>
              <Link to={action.url}>
                <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <action.icon className={`w-8 h-8 mx-auto mb-3 text-${action.color}-500`} />
                    <p className="font-medium text-gray-900">{action.title}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CHATBOT RENDERED HERE */}
      <FarmWiseChatbot />
    </div>
  );
}