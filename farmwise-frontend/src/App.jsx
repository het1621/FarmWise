import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";

// Import all your pages
import Dashboard from './pages/Dashboard';
import LandAnalysis from './pages/LandAnalysis';
import CropRecommendations from './pages/CropRecommendations';
import MarketPrices from './pages/MarketPrices';
import Weather from './pages/Weather';
import Helpline from './pages/Helpline';
import Login from './pages/Login';
import Layout from './Layout';
import PageNotFound from './lib/PageNotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Public Route: The Login Page (No Layout wrapper!) */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 2. Protected Routes: Wrapped safely inside your Layout */}
        <Route path="/Dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/Weather" element={<Layout><Weather /></Layout>} />
        <Route path="/CropRecommendations" element={<Layout><CropRecommendations /></Layout>} />
        <Route path="/MarketPrices" element={<Layout><MarketPrices /></Layout>} />
        <Route path="/LandAnalysis" element={<Layout><LandAnalysis /></Layout>} />
        <Route path="/Helpline" element={<Layout><Helpline /></Layout>} />

        {/* 3. Catch-all for 404s */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}