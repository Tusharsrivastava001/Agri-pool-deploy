import React, { useState } from "react";
import api from "../utils/api";
import { Phone, Lock, ArrowRight, Leaf, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({ phone: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await api.post("/api/auth/login", form);
      if (res.data.token) {
        login(res.data.user, res.data.token);
        toast.success("Login successful");
        window.location.href = "/";
      } else {
        setMessage({ text: res.data.error, type: "error" });
        toast.error(res.data.error || "Login failed");
      }
    } catch {
      setMessage({ text: "Invalid credentials or server error", type: "error" });
      toast.error("Invalid credentials or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-white">
      {/* LEFT SIDE: Visual Content (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-emerald-900 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-40" 
            alt="Farm landscape"
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
              Welcome back to the <br /> 
              <span className="text-orange-400">Future of Farming.</span>
            </h1>
            <p className="text-emerald-100 text-lg max-w-md leading-relaxed">
              Login to manage your transport pooling requests and access personalized fertilizer plans.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-emerald-200">
              <ShieldCheck className="text-orange-400" size={20} /> Verified Secure
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden flex justify-center">
             <div className="flex items-center gap-2">
                <Leaf className="text-emerald-600" size={32} />
                <span className="text-2xl font-bold text-emerald-900">AgriPool</span>
             </div>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Login</h2>
          <p className="text-gray-500 mb-8">Enter your details to access your dashboard.</p>

          {message.text && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-bold animate-shake ${
              message.type === "success" ? "bg-emerald-100 text-emerald-700" : "bg-red-50 text-red-600"
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="phone"
                  placeholder="e.g. 9876543210"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-gray-700">Password</label>
                <a href="/forgot-password" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {loading ? "Authenticating..." : "Login to Account"}
              {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="my-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200"></div>
            <span className="text-xs font-bold uppercase text-gray-400">or continue with</span>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>

          <div className="space-y-3">
            <a
              href={`${apiBaseUrl}/api/oauth/google`}
              className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 font-bold text-gray-700 transition hover:border-emerald-400 hover:text-emerald-700 w-full"
            >
              <span className="text-lg font-black text-red-500">G</span>
              Google
            </a>
          </div>

          <p className="text-center mt-10 text-gray-600 font-medium">
            New to AgriPool?{" "}
            <a href="/register" className="text-orange-500 font-bold hover:text-orange-600 underline underline-offset-4">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
