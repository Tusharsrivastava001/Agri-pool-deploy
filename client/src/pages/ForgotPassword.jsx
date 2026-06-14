import React, { useState } from "react";
import { ArrowLeft, KeyRound, Leaf, Loader2, Mail, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function ForgotPassword() {
  const [step, setStep] = useState("request");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const requestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/auth/forgot-password", { identifier });
      toast.success(res.data.message || "OTP sent to your email");
      setStep("reset");
    } catch (error) {
      toast.error(error.response?.data?.error || "Unable to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/auth/reset-password", {
        identifier,
        otp,
        newPassword,
      });
      if (res.data.token && res.data.user) {
        login(res.data.user, res.data.token);
        toast.success(res.data.message || "Password reset successfully");
        navigate("/");
      } else {
        toast.success("Password reset successfully. Please login.");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Unable to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-emerald-50 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-emerald-100 bg-white p-8 shadow-xl">
        <Link to="/login" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-lg bg-emerald-600 p-2 text-white">
            <Leaf className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-emerald-950">Reset Password</h1>
            <p className="text-sm text-gray-500">OTP will be sent to your registered Gmail/email.</p>
          </div>
        </div>

        {step === "request" ? (
          <form onSubmit={requestOtp} className="space-y-5">
            <label className="block text-sm font-bold text-gray-700">
              Phone number or email
              <div className="relative mt-2">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="9876543210 or name@gmail.com"
                  required
                  className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </label>
            <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 font-bold text-white hover:bg-emerald-700 disabled:opacity-60">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={resetPassword} className="space-y-5">
            <label className="block text-sm font-bold text-gray-700">
              OTP
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6 digit OTP"
                required
                maxLength="6"
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 tracking-[0.35em] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </label>
            <label className="block text-sm font-bold text-gray-700">
              New Password
              <div className="relative mt-2">
                <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create new password"
                  required
                  minLength="6"
                  className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </label>
            <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 font-bold text-white hover:bg-emerald-700 disabled:opacity-60">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <KeyRound className="h-5 w-5" />}
              Verify OTP & Login
            </button>
            <button type="button" onClick={() => setStep("request")} className="w-full text-sm font-bold text-emerald-700">
              Send OTP again
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
