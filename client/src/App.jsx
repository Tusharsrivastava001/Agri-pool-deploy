import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import FertilizerPlanner from "./pages/FertilizerPlanner";
import Transport from "./pages/Transport";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Weather from "./pages/Weather";
import Mandi from "./pages/Mandi";
import MyBookings from "./pages/MyBookings";
import TransporterDashboard from "./pages/TransporterDashboard";
import Admin from "./pages/Admin";
import PrivateRoute from "./utils/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/fertilizer" element={<PrivateRoute roles={["farmer"]}><FertilizerPlanner /></PrivateRoute>} />
        <Route path="/transport" element={<PrivateRoute roles={["farmer"]}><Transport /></PrivateRoute>} />
        <Route path="/weather" element={<PrivateRoute><Weather /></PrivateRoute>} />
        <Route path="/mandi" element={<PrivateRoute><Mandi /></PrivateRoute>} />
        <Route path="/my-bookings" element={<PrivateRoute roles={["farmer"]}><MyBookings /></PrivateRoute>} />
        <Route path="/transporter-dashboard" element={<PrivateRoute roles={["transporter"]}><TransporterDashboard /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute roles={["admin"]}><Admin /></PrivateRoute>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </Router>
  );
}
