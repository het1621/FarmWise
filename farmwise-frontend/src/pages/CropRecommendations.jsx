import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Sprout, 
  TrendingUp, 
  Droplets, 
  Clock,
  Search,
  Filter,
  MapPin // Added MapPin for the Land selector
} from "lucide-react";
import { motion } from "framer-motion";

export default function CropRecommendations() {
  const [crops, setCrops] = useState([]);
  const [lands, setLands] = useState([]); // NEW: State to hold user's farm lands
  const [filteredCrops, setFilteredCrops] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSeason, setSelectedSeason] = useState("all");
  const [selectedLandId, setSelectedLandId] = useState("none"); // NEW: Tracks which farm is selected

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch both Crops and Lands at the exact same time
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [cropsRes, landsRes] = await Promise.all([
          fetch('http://127.0.0.1:5000/api/crops'),
          fetch('http://127.0.0.1:5000/api/lands')
        ]);

        if (cropsRes.ok && landsRes.ok) {
          const cropsData = await cropsRes.json();
          const landsData = await landsRes.json();

          // Safety Net for Crops
          const mappedCrops = cropsData.map(crop => ({
            ...crop,
            category: crop.category || "cereals", 
            season: crop.season || "kharif",
            water_requirement: crop.water_requirement || "medium",
            growing_period: crop.growing_period || 120,
            suitable_soil: crop.suitable_soil ? JSON.parse(crop.suitable_soil) : ["Alluvial", "Black Soil"]
          }));

          setCrops(mappedCrops);
          setLands(landsData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // --- THE SMART FILTERING ENGINE ---
  useEffect(() => {
    let filtered = crops;

    // 1. Filter by Smart Land Recommendation (Match Soil Types)
    if (selectedLandId !== "none") {
      const selectedLand = lands.find(l => l.id.toString() === selectedLandId);
      if (selectedLand) {
        // Normalize the database soil string (e.g. "black_soil" -> "black soil")
        const landSoil = selectedLand.soil_type.toLowerCase().replace('_', ' ');
        
        // Only keep crops where one of its suitable soils matches the land's soil
        filtered = filtered.filter(crop => 
          crop.suitable_soil.some(soil => soil.toLowerCase().includes(landSoil))
        );
      }
    }

    // 2. Filter by Search Bar
    if (searchTerm) {
      filtered = filtered.filter(crop => 
        crop.crop_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 3. Filter by Category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(crop => crop.category === selectedCategory);
    }

    // 4. Filter by Season
    if (selectedSeason !== "all") {
      filtered = filtered.filter(crop => crop.season === selectedSeason);
    }

    setFilteredCrops(filtered);
  }, [crops, lands, searchTerm, selectedCategory, selectedSeason, selectedLandId]);

  const getProfitColor = (profit) => {
    const colors = {
      very_high: "bg-green-100 text-green-800 border-green-200",
      high: "bg-lime-100 text-lime-800 border-lime-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-orange-100 text-orange-800 border-orange-200"
    };
    return colors[profit] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getWaterColor = (water) => {
    const colors = {
      low: "bg-yellow-100 text-yellow-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-cyan-100 text-cyan-800"
    };
    return colors[water] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Crop Recommendations</h1>
          <p className="text-lg text-gray-600 mb-6">
            Discover the best crops for your farm based on current conditions and market potential
          </p>

          {/* NEW: Smart Land Selector */}
          {lands.length > 0 && (
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-green-100 flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-center gap-2 text-green-800 font-medium">
                <MapPin className="w-5 h-5" />
                Smart Recommendations:
              </div>
              <Select value={selectedLandId} onValueChange={setSelectedLandId}>
                <SelectTrigger className="w-full md:w-72 bg-green-50 border-green-200">
                  <SelectValue placeholder="Select one of your farm plots..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Show All Crops</SelectItem>
                  {lands.map(land => (
                    <SelectItem key={land.id} value={land.id.toString()}>
                      Match for: {land.farm_name} ({land.soil_type.replace('_', ' ')})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search crops..."
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
                <SelectItem value="cereals">Cereals</SelectItem>
                <SelectItem value="vegetables">Vegetables</SelectItem>
                <SelectItem value="fruits">Fruits</SelectItem>
                <SelectItem value="pulses">Pulses</SelectItem>
                <SelectItem value="cash_crops">Cash Crops</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Seasons</SelectItem>
                <SelectItem value="kharif">Kharif (Monsoon)</SelectItem>
                <SelectItem value="rabi">Rabi (Winter)</SelectItem>
                <SelectItem value="summer">Summer</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              className="bg-white"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedSeason("all");
                setSelectedLandId("none"); // Resets the land filter too!
              }}
            >
              Clear Filters
            </Button>
          </div>
        </motion.div>

        {/* Crops Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {filteredCrops.map((crop, index) => (
            <motion.div
              key={crop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Sprout className="w-5 h-5 text-green-600" />
                      {crop.crop_name}
                    </CardTitle>
                    <Badge variant="outline" className="capitalize">
                      {crop.category?.replace('_', ' ')}
                    </Badge>
                  </div>
                  <Badge variant="secondary" className="w-fit capitalize">
                    {crop.season} Season
                  </Badge>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Profit Potential
                    </span>
                    <Badge className={getProfitColor(crop.profit_potential)}>
                      {crop.profit_potential?.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-medium flex items-center gap-2">
                      <Droplets className="w-4 h-4" />
                      Water Needs
                    </span>
                    <Badge className={getWaterColor(crop.water_requirement)}>
                      {crop.water_requirement}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Growing Period
                    </span>
                    <span className="text-gray-700">{crop.growing_period} days</span>
                  </div>

                  {crop.expected_yield && (
                    <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                      <p className="text-sm font-medium text-green-800">Expected Yield</p>
                      <p className="text-green-700 font-semibold">{crop.expected_yield}</p>
                    </div>
                  )}

                  {crop.market_price_range && (
                    <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-100">
                      <p className="text-sm font-medium text-yellow-800">Market Price</p>
                      <p className="text-yellow-700 font-semibold">{crop.market_price_range}</p>
                    </div>
                  )}

                  {crop.suitable_soil && crop.suitable_soil.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Suitable Soil Types:</p>
                      <div className="flex flex-wrap gap-1">
                        {crop.suitable_soil.map((soil, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-gray-50">
                            {soil}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredCrops.length === 0 && !isLoading && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
          
            <Sprout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No crops match this soil!</h3>
            <p className="text-gray-500">Try adjusting your search or selecting a different farm plot.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}