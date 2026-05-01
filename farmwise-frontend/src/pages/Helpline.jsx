import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  MessageCircle,
  Users,
  BookOpen,
  Video,
  Clock,
  AlertTriangle,
  Truck,
  ShoppingCart,
  Wrench
} from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    title: "Agricultural Extension Services",
    description: "Get expert advice from agricultural scientists and extension officers",
    icon: Users,
    color: "bg-green-100 text-green-800",
    contact: "+91-1800-180-1551",
    available: "24/7"
  },
  {
    title: "Crop Disease Identification",
    description: "Send photos of diseased crops for instant identification and treatment",
    icon: AlertTriangle,
    color: "bg-red-100 text-red-800",
    contact: "disease@farmwise.com",
    available: "Mon-Sat: 9 AM - 6 PM"
  },
  {
    title: "Equipment Rental",
    description: "Rent farm equipment and machinery at affordable rates",
    icon: Wrench,
    color: "bg-blue-100 text-blue-800",
    contact: "+91-9876543210",
    available: "Mon-Fri: 8 AM - 5 PM"
  },
  {
    title: "Input Supplies",
    description: "Quality seeds, fertilizers, and pesticides delivered to your farm",
    icon: ShoppingCart,
    color: "bg-purple-100 text-purple-800",
    contact: "orders@farmwise.com",
    available: "24/7 Online"
  },
  {
    title: "Transportation Services",
    description: "Logistics support for moving your produce to markets",
    icon: Truck,
    color: "bg-yellow-100 text-yellow-800",
    contact: "+91-8765432109",
    available: "Mon-Sat: 6 AM - 8 PM"
  }
];

const emergencyContacts = [
  {
    title: "Kisan Call Centre",
    number: "1800-180-1551",
    description: "24/7 agricultural helpline by Government of India"
  },
  {
    title: "Weather Emergency",
    number: "1800-266-6677",
    description: "Severe weather alerts and emergency assistance"
  },
  {
    title: "Crop Insurance Claims",
    number: "1800-266-6999",
    description: "File and track crop insurance claims"
  },
  {
    title: "Veterinary Emergency",
    number: "1962",
    description: "Emergency veterinary services for livestock"
  }
];

const knowledgeResources = [
  {
    title: "Video Tutorials",
    description: "Step-by-step farming techniques and best practices",
    icon: Video,
    count: "500+ videos"
  },
  {
    title: "Crop Guides",
    description: "Comprehensive guides for different crops and seasons",
    icon: BookOpen,
    count: "100+ guides"
  },
  {
    title: "Expert Webinars",
    description: "Live sessions with agricultural experts",
    icon: Users,
    count: "Weekly sessions"
  }
];

export default function HelplinePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & Services</h1>
          <p className="text-xl text-gray-600">
            Get expert support and access essential agricultural services
          </p>
        </motion.div>

        {/* Emergency Contacts */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-red-700">
                <Phone className="w-6 h-6" />
                Emergency Helplines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emergencyContacts.map((contact, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-l-red-500"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{contact.title}</h4>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => window.open(`tel:${contact.number}`)}
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                    </div>
                    <p className="text-lg font-bold text-red-600 mb-1">{contact.number}</p>
                    <p className="text-sm text-gray-600">{contact.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Agricultural Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className={`p-3 rounded-lg ${service.color}`}>
                        <service.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{service.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{service.available}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{service.description}</p>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => window.open(`tel:${service.contact}`)}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(`mailto:${service.contact}`)}
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <p className="text-sm font-medium text-gray-700">{service.contact}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Knowledge Resources */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Knowledge Center</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {knowledgeResources.map((resource, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                      <resource.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{resource.title}</h4>
                    <p className="text-gray-600 mb-3">{resource.description}</p>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {resource.count}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Methods */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Phone className="w-5 h-5" />
                Call Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Speak directly with our agricultural experts
              </p>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Phone className="w-4 h-4 mr-2" />
                +91-1800-FARMWISE
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <MessageCircle className="w-5 h-5" />
                Live Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Get instant answers to your farming questions
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Mail className="w-5 h-5" />
                Email Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Send us your queries and get detailed responses
              </p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Need Immediate Assistance?</h3>
            <p className="text-gray-600">
              For urgent farming emergencies, call our 24/7 helpline: 
              <span className="font-bold text-green-600 ml-2">1800-180-1551</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}