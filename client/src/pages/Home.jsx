import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, Sprout, MapPin, TrendingUp, ChevronRight, CheckCircle2, Leaf, User, LogOut } from 'lucide-react';
const Home = () => {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Check if user is logged in on component mount
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    // If you saved the name in localStorage during login, get it here
    const userName = localStorage.getItem("userName") || "Farmer";
    const userRole = localStorage.getItem("userRole") || "farmer";

    if (userId && token) {
      setUser({ id: userId, name: userName, role: userRole });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // Clear token, userId, etc.
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      
      {/* 1. NAVBAR - Fixed and Glassmorphism effect */}
      {/* 1. NAVBAR */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <div className="bg-emerald-600 p-2 rounded-lg">
                <Leaf className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-emerald-900 tracking-tight">AgriPool</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
              <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
              {(!user || user.role === "farmer") && <Link to="/transport" className="hover:text-emerald-600 transition-colors">Transport Hub</Link>}
              {(!user || user.role === "farmer") && <Link to="/fertilizer" className="hover:text-emerald-600 transition-colors">AI Plans</Link>}
              {user?.role === "farmer" && <Link to="/my-bookings" className="hover:text-emerald-600 transition-colors">My Bookings</Link>}
              {user?.role === "transporter" && <Link to="/transporter-dashboard" className="hover:text-emerald-600 transition-colors">Transporter Dashboard</Link>}
              {user?.role === "admin" && <Link to="/admin" className="hover:text-emerald-600 transition-colors">Admin</Link>}
              {user && <Link to="/weather" className="hover:text-emerald-600 transition-colors">Weather</Link>}
              {user && <Link to="/mandi" className="hover:text-emerald-600 transition-colors">Mandi</Link>}
              <Link to="/about" className="hover:text-emerald-600 transition-colors">About Us</Link>
            </div>

            {/* Auth Condition: Show User Name or Get Started */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                  <div className="bg-emerald-600 p-1.5 rounded-full">
                    <User className="text-white w-4 h-4" />
                  </div>
                  <span className="font-bold text-emerald-900 text-sm">Hi, {user.name}</span>
                  <button 
                    onClick={handleLogout}
                    className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40">
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION - Immersive Background */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop" 
            alt="Farm and Logistics" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-emerald-800/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 text-center lg:text-left">
          <div className="lg:w-2/3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/50 border border-emerald-500/30 text-emerald-300 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Now Live: AI-Driven Crop Planning
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Smart Logistics & <br />
              <span className="text-emerald-300">Precision Farming</span>
            </h1>
            
            <p className="text-lg text-emerald-100 mb-8 max-w-xl leading-relaxed">
              AgriPool bridges the gap between harvest and market. Share transport costs with neighbors and get data-driven fertilizer plans for your specific land parcels.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/register" className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-orange-900/20">
                Join AgriPool Free
                <ChevronRight className="w-5 h-5" />
              </Link>
              <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-xl font-bold text-lg transition-all">
                How it Works
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CORE FEATURES - Floating Cards */}
      <div className="relative z-20 -mt-16 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
          
          {/* Feature 1: Transport */}
          <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Truck className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Transport Sharing</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Don't pay for empty space. Connect with nearby farmers to pool your produce. Features include real-time GPS tracking and route optimization.
            </p>
            <a href="/Transport" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700">
              Find Transport <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </div>

          {/* Feature 2: Precision */}
          <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Sprout className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Precision Input Plans</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Maximize ROI with land-specific analysis. We calculate the exact fertilizer mix based on your soil health and crop requirements.
            </p>
            <Link  to="/fertilizer" className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700">
              Generate Plan <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

        </div>
      </div>

      {/* 4. STATISTICS SECTION */}
      <div className="py-24 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-8 text-center divide-x divide-gray-100">
            <div>
              <div className="text-4xl font-extrabold text-emerald-900 mb-2">25%</div>
              <div className="text-gray-500 font-medium">Average Cost Reduction</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-emerald-900 mb-2">1,200+</div>
              <div className="text-gray-500 font-medium">Farmers Connected</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-emerald-900 mb-2">500 Tons</div>
              <div className="text-gray-500 font-medium">Produce Delivered</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. HOW IT WORKS */}
      <div className="py-24 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How AgriPool Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Three simple steps to smarter farming and cheaper logistics.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { 
                icon: <MapPin className="w-6 h-6 text-white" />, 
                title: "Register & Map", 
                desc: "Create your profile and map your land parcels using our satellite tool." 
              },
              { 
                icon: <TrendingUp className="w-6 h-6 text-white" />, 
                title: "Request or Plan", 
                desc: "Post a transport request or generate a fertilizer plan for your specific crop." 
              },
              { 
                icon: <CheckCircle2 className="w-6 h-6 text-white" />, 
                title: "Optimize & Save", 
                desc: "Transporters accept loads instantly. Farmers get actionable yield data." 
              }
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg mb-6 relative">
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. FOOTER */}
      <footer className="bg-emerald-950 text-emerald-200 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-emerald-500" />
            <span className="text-xl font-bold text-white">AgriPool</span>
          </div>
          <div className="flex gap-8 text-sm font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="/contact" className="hover:text-white transition-colors">Contact Support</a>
          </div>
          <div className="text-sm opacity-60">
            © 2024 AgriPool Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
