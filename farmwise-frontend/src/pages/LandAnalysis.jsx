import React, { useState, useEffect } from "react";
// Removed the Base44 import!
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  Droplets, 
  Mountain,
  TestTube,
  Plus,
  Edit,
  Trash2,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandAnalysisPage() {
  const [landData, setLandData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLand, setEditingLand] = useState(null);
  
  // Loading states for buttons
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  
  // Added "location" to match our database requirements
  const [formData, setFormData] = useState({
    farm_name: "",
    location: "", 
    area: "",
    soil_type: "",
    ph_level: "",
    organic_matter: "",
    drainage: "",
    water_source: [],
    topography: "",
    recommendations: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLandData();
  }, []);

  // 1. Fetch data from Python!
  const loadLandData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/lands');
      const data = await response.json();
      
      // Map Python's 'size_acres' to your UI's 'area' variable
      const formattedData = data.map(land => ({
        ...land,
        area: land.size_acres 
      }));
      
      setLandData(formattedData);
    } catch (error) {
      console.error("Error loading land data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Send data to Python Database!
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // <-- Turn on spinner
    try {
      // Package the data exactly how Python expects it
      const payload = {
        farm_name: formData.farm_name,
        location: formData.location,
        size_acres: parseFloat(formData.area),
        soil_type: formData.soil_type,
        ph_level: formData.ph_level,
        organic_matter: formData.organic_matter,
        drainage: formData.drainage,
        topography: formData.topography
      };

      if (editingLand) {
        await fetch(`http://127.0.0.1:5000/api/lands/${editingLand.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch('http://127.0.0.1:5000/api/lands', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      setShowForm(false);
      setEditingLand(null);
      resetForm();
      await loadLandData(); // Refresh the UI with the new data
    } catch (error) {
      console.error("Error saving land data:", error);
    } finally {
      setIsSubmitting(false); // <-- Turn off spinner
    }
  };

  // 3. Delete Land
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this farm plot? This cannot be undone.")) {
      setDeletingId(id); // <-- Turn on spinner for this specific card
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/lands/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          await loadLandData(); 
        } else {
          alert(`Server Error: Could not delete. Status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error deleting land:", error);
        alert("Network Error: Could not reach the server.");
      } finally {
        setDeletingId(null); // <-- Turn off spinner
      }
    }
  };

  const handleEdit = (land) => {
    setEditingLand(land);
    setFormData(land);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      farm_name: "", location: "", area: "", soil_type: "", ph_level: "",
      organic_matter: "", drainage: "", water_source: [], topography: "", recommendations: []
    });
  };

  const getSoilTypeColor = (soilType) => {
    const colors = {
      alluvial: "bg-yellow-100 text-yellow-800",
      black_soil: "bg-gray-800 text-white",
      red_soil: "bg-red-100 text-red-800",
      laterite: "bg-orange-100 text-orange-800",
      desert_soil: "bg-yellow-200 text-yellow-900",
      mountain_soil: "bg-green-100 text-green-800"
    };
    return colors[soilType] || "bg-gray-100 text-gray-800";
  };

  const getDrainageColor = (drainage) => {
    const colors = {
      excellent: "bg-green-100 text-green-800",
      good: "bg-lime-100 text-lime-800",
      moderate: "bg-yellow-100 text-yellow-800",
      poor: "bg-red-100 text-red-800"
    };
    return colors[drainage] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-brown-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-brown-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Land Analysis</h1>
              <p className="text-lg text-gray-600">Analyze and manage your farm land characteristics</p>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" /> Add Farm Land
            </Button>
          </div>
        </motion.div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="mb-8 shadow-lg">
              <CardHeader>
                <CardTitle>{editingLand ? "Edit Farm Land" : "Add New Farm Land"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="farm_name">Farm Name</Label>
                      <Input id="farm_name" value={formData.farm_name} onChange={(e) => setFormData({...formData, farm_name: e.target.value})} required />
                    </div>
                    <div>
                      <Label htmlFor="location">Location (City/Region)</Label>
                      <Input id="location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
                    </div>
                    <div>
                      <Label htmlFor="area">Area (acres)</Label>
                      <Input id="area" type="number" step="0.1" value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} required />
                    </div>
                    <div>
                      <Label htmlFor="soil_type">Soil Type</Label>
                      <Select value={formData.soil_type} onValueChange={(value) => setFormData({...formData, soil_type: value})}>
                        <SelectTrigger><SelectValue placeholder="Select soil type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alluvial">Alluvial</SelectItem>
                          <SelectItem value="black_soil">Black Soil</SelectItem>
                          <SelectItem value="red_soil">Red Soil</SelectItem>
                          <SelectItem value="laterite">Laterite</SelectItem>
                          <SelectItem value="desert_soil">Desert Soil</SelectItem>
                          <SelectItem value="mountain_soil">Mountain Soil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="ph_level">pH Level</Label>
                      <Input id="ph_level" type="number" step="0.1" min="0" max="14" value={formData.ph_level} onChange={(e) => setFormData({...formData, ph_level: e.target.value})} />
                    </div>
                    <div>
                      <Label htmlFor="organic_matter">Organic Matter (%)</Label>
                      <Input id="organic_matter" type="number" step="0.1" value={formData.organic_matter} onChange={(e) => setFormData({...formData, organic_matter: e.target.value})} />
                    </div>
                    <div>
                      <Label htmlFor="drainage">Drainage Quality</Label>
                      <Select value={formData.drainage} onValueChange={(value) => setFormData({...formData, drainage: value})}>
                        <SelectTrigger><SelectValue placeholder="Select drainage quality" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="topography">Topography</Label>
                      <Select value={formData.topography} onValueChange={(value) => setFormData({...formData, topography: value})}>
                        <SelectTrigger><SelectValue placeholder="Select topography" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flat">Flat</SelectItem>
                          <SelectItem value="gently_sloped">Gently Sloped</SelectItem>
                          <SelectItem value="hilly">Hilly</SelectItem>
                          <SelectItem value="terraced">Terraced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {/* BUTTON UPDATED: Spinners added */}
                    <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                      {isSubmitting ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                      ) : (
                        <>{editingLand ? "Update" : "Save"} Farm Land</>
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingLand(null); resetForm(); }} disabled={isSubmitting}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
          {landData.map((land, index) => (
            <motion.div key={land.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
              <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <MapPin className="w-5 h-5 text-green-600" /> {land.farm_name}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50" onClick={() => handleEdit(land)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      {/* TRASH BUTTON UPDATED: Spinners added */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-600 hover:bg-red-50" 
                        onClick={() => handleDelete(land.id)}
                        disabled={deletingId === land.id}
                      >
                        {deletingId === land.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-gray-700">{land.area} acres</p>
                  <p className="text-sm text-gray-500">{land.location}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Soil Type</p>
                      <Badge className={getSoilTypeColor(land.soil_type)} variant="secondary">{land.soil_type?.replace('_', ' ')}</Badge>
                    </div>
                    {land.drainage && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Drainage</p>
                        <Badge className={getDrainageColor(land.drainage)} variant="secondary">{land.drainage}</Badge>
                      </div>
                    )}
                  </div>
                  {land.ph_level && (
                    <div className="flex items-center gap-2">
                      <TestTube className="w-4 h-4 text-blue-500" /><span className="font-medium">pH Level:</span><span className="text-gray-700">{land.ph_level}</span>
                    </div>
                  )}
                  {land.organic_matter && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Organic Matter:</span><span className="text-gray-700">{land.organic_matter}%</span>
                    </div>
                  )}
                  {land.topography && (
                    <div className="flex items-center gap-2">
                      <Mountain className="w-4 h-4 text-brown-500" /><span className="font-medium">Topography:</span><span className="text-gray-700 capitalize">{land.topography.replace('_', ' ')}</span>
                    </div>
                  )}
                  {land.water_source && land.water_source.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Water Sources:</p>
                      <div className="flex flex-wrap gap-1">
                        {land.water_source.map((source, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs"><Droplets className="w-3 h-3 mr-1" />{source.replace('_', ' ')}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {land.recommendations && land.recommendations.length > 0 && (
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-green-800 mb-2">Recommendations:</p>
                      <ul className="text-sm text-green-700 space-y-1">
                        {land.recommendations.map((rec, idx) => <li key={idx}>• {rec}</li>)}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {landData.length === 0 && !showForm && (
          <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No farm land data</h3>
            <p className="text-gray-500 mb-4">Add your first farm land to start analyzing soil conditions</p>
            <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" /> Add Farm Land
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}