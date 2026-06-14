import React, { useState } from "react";
import api from "../utils/api";
import { User, Phone, Lock, UserCog, ArrowRight, Leaf, Users, CheckCircle, Github } from "lucide-react";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", role: "farmer" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await api.post("/api/auth/register", form);
      setMessage({ 
        text: res.data.message || "Account created! You can now login.", 
        type: "success" 
      });
      toast.success("Account created. Please login.");
      // Optional: Redirect to login after 2 seconds
      // setTimeout(() => window.location.href = "/login", 2000);
    } catch (err) {
      setMessage({ text: "Registration failed. Try again.", type: "error" });
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-white">
      
      {/* LEFT SIDE: Visual Content (Branding) */}
      <div className="hidden lg:flex w-1/2 bg-emerald-900 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-30" 
            alt="Farmers cooperating"
          />
        </div>
        
        <div className="relative z-10 p-16 flex flex-col justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-2 rounded-lg">
              <Leaf className="text-white" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold tracking-tight">AgriPool</span>
          </div>

          <div>
            <h1 className="text-5xl font-extrabold leading-tight mb-6">
              Grow Your Profits <br /> 
              <span className="text-orange-400">Together.</span>
            </h1>
            <ul className="space-y-4 text-emerald-100 text-lg">
              <li className="flex items-center gap-3"><CheckCircle className="text-orange-400" size={22} /> Share transport costs</li>
              <li className="flex items-center gap-3"><CheckCircle className="text-orange-400" size={22} /> Get precision fertilizer plans</li>
              <li className="flex items-center gap-3"><CheckCircle className="text-orange-400" size={22} /> Connect with local markets</li>
            </ul>
          </div>

          <div className="flex items-center gap-2 text-sm text-emerald-200">
            <Users size={20} className="text-orange-400" /> Join 10,000+ local farmers
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-10 lg:hidden flex justify-center">
             <div className="flex items-center gap-2">
                <Leaf className="text-emerald-600" size={32} />
                <span className="text-2xl font-bold text-emerald-900">AgriPool</span>
             </div>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-500 mb-8">Join the AgriPool community today.</p>

          {message.text && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-bold ${
              message.type === "success" ? "bg-emerald-100 text-emerald-700" : "bg-red-50 text-red-600"
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="phone"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email Address</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  placeholder="name@gmail.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">I am a...</label>
              <div className="relative">
                <UserCog className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="farmer">Farmer</option>
                  <option value="transporter">Transporter</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 mt-2"
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="my-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200"></div>
            <span className="text-xs font-bold uppercase text-gray-400">or sign up with</span>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href={`${apiBaseUrl}/api/oauth/google`}
              className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 font-bold text-gray-700 transition hover:border-emerald-400 hover:text-emerald-700"
            >
              <span className="text-lg font-black text-red-500">G</span>
              Google
            </a>
            <a
              href={`${apiBaseUrl}/api/oauth/github`}
              className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 font-bold text-gray-700 transition hover:border-emerald-400 hover:text-emerald-700"
            >
              <Github size={20} />
              GitHub
            </a>
          </div>

          <p className="text-center mt-8 text-gray-600 font-medium">
            Already have an account?{" "}
            <a href="/login" className="text-emerald-600 font-bold hover:text-emerald-700 underline underline-offset-4">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
