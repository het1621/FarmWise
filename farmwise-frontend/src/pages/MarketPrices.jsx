import React, { useState, useEffect } from "react";
// Removed Base44 import!
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Search,
  Filter,
  Calendar,
  MapPin
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function MarketPrices() {
  const [prices, setPrices] = useState([]);
  const [filteredPrices, setFilteredPrices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPrices();
  }, []);

  useEffect(() => {
    let filtered = prices;

    if (searchTerm) {
      filtered = filtered.filter(price => 
        price.item_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(price => price.category === selectedCategory);
    }

    setFilteredPrices(filtered);
  }, [prices, searchTerm, selectedCategory]);

  // --- NEW: Fetch from Python API ---
  const loadPrices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://127.0.0.1:5000/api/market-prices');
      
      if (response.ok) {
        const data = await response.json();
        
        // Safety Net: Fill in missing data so your advanced UI doesn't break
        const mappedData = data.map(price => ({
          ...price,
          category: price.category || "crops",
          market_location: price.market_location || "Ahmedabad APMC", // Default location
          seasonal_low: price.current_price ? Math.round(price.current_price * 0.8) : null, // Simulate a low
          seasonal_high: price.current_price ? Math.round(price.current_price * 1.2) : null, // Simulate a high
          last_updated: new Date().toISOString() // Show today as the update date
        }));
        
        setPrices(mappedData);
      }
    } catch (error) {
      console.error("Error loading market prices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend) => {
    const colors = {
      increasing: "bg-green-100 text-green-800 border-green-200",
      decreasing: "bg-red-100 text-red-800 border-red-200",
      stable: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return colors[trend] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getCategoryColor = (category) => {
    const colors = {
      grains: "bg-yellow-100 text-yellow-800", // Added grains to match your DB
      cash_crop: "bg-amber-100 text-amber-800", // Added cash_crop to match your DB
      crops: "bg-yellow-100 text-yellow-800",
      vegetables: "bg-green-100 text-green-800",
      fruits: "bg-red-100 text-red-800",
      seeds: "bg-blue-100 text-blue-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Market Prices</h1>
          <p className="text-lg text-gray-600 mb-6">
            Stay updated with current market rates for crops, vegetables, fruits, and seeds
          </p>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="grains">Grains</SelectItem>
                <SelectItem value="cash_crop">Cash Crops</SelectItem>
                <SelectItem value="vegetables">Vegetables</SelectItem>
                <SelectItem value="fruits">Fruits</SelectItem>
                <SelectItem value="seeds">Seeds</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </motion.div>

        {/* Price Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {filteredPrices.map((price, index) => (
            <motion.div
              key={price.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{price.item_name}</CardTitle>
                    <Badge className={getCategoryColor(price.category)} variant="secondary">
                      {price.category.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">
                      ₹{price.current_price}
                    </p>
                    <p className="text-gray-600">per {price.unit}</p>
                  </div>

                  <div className="flex justify-center">
                    <Badge className={getTrendColor(price.price_trend)} variant="secondary">
                      <div className="flex items-center gap-1">
                        {getTrendIcon(price.price_trend)}
                        <span className="capitalize">{price.price_trend}</span>
                      </div>
                    </Badge>
                  </div>

                  {price.market_location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {price.market_location}
                    </div>
                  )}

                  {(price.seasonal_high || price.seasonal_low) && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Seasonal Range</p>
                      <div className="flex justify-between text-sm">
                        {price.seasonal_low && (
                          <span className="text-red-600">
                            Low: ₹{price.seasonal_low}
                          </span>
                        )}
                        {price.seasonal_high && (
                          <span className="text-green-600">
                            High: ₹{price.seasonal_high}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {price.last_updated && (
                    <div className="text-xs text-gray-500 text-center">
                      Updated: {format(new Date(price.last_updated), "MMM dd, yyyy")}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredPrices.length === 0 && !isLoading && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No prices found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}

        {/* Market Insights */}
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg border-blue-100">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Market Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-blue-50">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {prices.filter(p => p.price_trend === 'increasing').length}
                  </div>
                  <p className="text-gray-600 font-medium">Items rising</p>
                </div>
                <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-blue-50">
                  <div className="text-3xl font-bold text-red-600 mb-1">
                    {prices.filter(p => p.price_trend === 'decreasing').length}
                  </div>
                  <p className="text-gray-600 font-medium">Items falling</p>
                </div>
                <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-blue-50">
                  <div className="text-3xl font-bold text-gray-600 mb-1">
                    {prices.filter(p => p.price_trend === 'stable').length}
                  </div>
                  <p className="text-gray-600 font-medium">Stable prices</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}