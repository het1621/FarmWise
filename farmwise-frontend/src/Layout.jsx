import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Cloud, 
  Sprout, 
  TrendingUp, 
  MapPin, 
  Phone
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    color: "text-green-600"
  },
  {
    title: "Weather",
    url: "/Weather",
    icon: Cloud,
    color: "text-blue-500"
  },
  {
    title: "Crop Guide",
    url: "/CropRecommendations",
    icon: Sprout,
    color: "text-green-500"
  },
  {
    title: "Market Prices",
    url: "/MarketPrices",
    icon: TrendingUp,
    color: "text-yellow-600"
  },
  {
    title: "Land Analysis",
    url: "/LandAnalysis",
    icon: MapPin,
    color: "text-amber-700"
  },
  {
    title: "Help & Services",
    url: "/Helpline",
    icon: Phone,
    color: "text-purple-600"
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-green-50 to-lime-50">
        <style>{`
          :root {
            --primary-green: #2D5016;
            --accent-lime: #7CB342;
            --warm-yellow: #FFC107;
            --earth-brown: #8D6E63;
          }
        `}</style>
        
        <Sidebar className="border-r border-green-100 bg-white/95 backdrop-blur-sm">
          <SidebarHeader className="border-b border-green-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-lime-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-gray-900">FarmWise</h2>
                <p className="text-sm text-green-600">Smart Agriculture Assistant</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`
                          hover:bg-green-50 hover:text-green-700 transition-all duration-300 rounded-xl mb-1 h-12
                          ${location.pathname === item.url ? 'bg-green-100 text-green-700 shadow-sm' : 'text-gray-700'}
                        `}
                      >
                        <Link to={item.url} className="flex items-center gap-4 px-4 py-3">
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-green-100 p-4">
            <div className="bg-gradient-to-r from-green-500 to-lime-500 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Cloud className="w-5 h-5" />
                <span className="font-medium">Weather Alert</span>
              </div>
              <p className="text-sm opacity-90">
                Light rain expected tomorrow. Plan accordingly!
              </p>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-green-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-gray-900">FarmWise</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}