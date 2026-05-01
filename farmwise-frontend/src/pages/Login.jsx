import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Sprout, 
  Mail, 
  Lock, 
  User, 
  Loader2,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  // PRE-LOADED DUMMY USER
  const defaultDummyUser = {
    email: "farmer@farmwise.com",
    password: "password123",
    name: "Master Farmer"
  };

  // Check if a user is already logged in when the page loads
  useEffect(() => {
    const activeSession = localStorage.getItem("farmwise_active_user");
    if (activeSession) {
      navigate("/Dashboard"); // Auto-redirect to dashboard if already logged in!
    }
  }, [navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate network delay to make it feel real
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Fetch all registered dummy users from browser memory
      const savedUsersJSON = localStorage.getItem("farmwise_users");
      const savedUsers = savedUsersJSON ? JSON.parse(savedUsersJSON) : [defaultDummyUser];

      if (isLogin) {
        // --- LOGIN LOGIC ---
        const user = savedUsers.find(u => u.email === formData.email);
        
        if (!user) {
          setError("No account found with this email.");
          setIsLoading(false);
          return;
        }
        if (user.password !== formData.password) {
          setError("Incorrect password. Try again.");
          setIsLoading(false);
          return;
        }

        // Success! Save session and redirect
        localStorage.setItem("farmwise_active_user", JSON.stringify(user));
        navigate("/Dashboard");

      } else {
        // --- SIGN UP LOGIC ---
        const userExists = savedUsers.find(u => u.email === formData.email);
        if (userExists) {
          setError("An account with this email already exists!");
          setIsLoading(false);
          return;
        }

        const newUser = {
          email: formData.email,
          password: formData.password,
          name: formData.name
        };

        // Save new user to dummy database
        const updatedUsers = [...savedUsers, newUser];
        localStorage.setItem("farmwise_users", JSON.stringify(updatedUsers));
        
        // Log them in instantly
        localStorage.setItem("farmwise_active_user", JSON.stringify(newUser));
        navigate("/Dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div 
        className="w-full max-w-md z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-inner">
              <Sprout className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">FarmWise</h1>
            <p className="text-green-100 mt-2 text-sm">
              Your intelligent agricultural assistant
            </p>
          </div>

          <CardContent className="p-8">
            <CardHeader className="px-0 pt-0 pb-6 text-center">
              <CardTitle className="text-2xl text-gray-800">
                {isLogin ? "Welcome back" : "Create an account"}
              </CardTitle>
              <CardDescription>
                {isLogin 
                  ? "Enter your credentials to access your dashboard" 
                  : "Sign up with a dummy email to test the app"}
              </CardDescription>
            </CardHeader>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }} 
                className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-600"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleAuth} className="space-y-5">
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input 
                        id="name" 
                        placeholder="e.g. John Doe" 
                        className="pl-9 bg-gray-50/50"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required={!isLogin}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="farmer@farmwise.com" 
                    className="pl-9 bg-gray-50/50"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-9 bg-gray-50/50"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
                {isLogin && (
                  <div className="text-right">
                    <button type="button" className="text-xs text-green-600 hover:text-green-700 font-medium">
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white h-11 text-lg font-medium shadow-md transition-all hover:shadow-lg mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(""); // Clear errors when flipping
                }}
                className="ml-1 text-green-600 hover:text-green-700 font-semibold transition-colors"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
            
            {/* Helpful testing hint */}
            {isLogin && (
              <div className="mt-6 p-3 bg-blue-50 rounded-lg text-xs text-blue-700 text-center border border-blue-100">
                <span className="font-semibold">Demo Account:</span><br/>
                Email: <code className="font-bold">farmer@farmwise.com</code><br/>
                Pass: <code className="font-bold">password123</code>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}