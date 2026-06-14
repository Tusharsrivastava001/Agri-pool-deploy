import React, { useState } from "react";
import PropTypes from "prop-types";
import { CloudRain, Droplets, Loader2, Thermometer, Wind } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/api";

export default function Weather() {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.get("/api/weather", { params: { city } });
      setData(res.data);
      toast.success("Weather advisory updated");
    } catch (error) {
      toast.error(error.response?.data?.error || "Unable to fetch weather");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-emerald-50/40 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-black text-emerald-950">Live Weather & Planting Advisory</h1>
        <p className="mt-2 text-gray-600">Check your district conditions before sowing, irrigation, or fertilizer application.</p>
        <form onSubmit={fetchWeather} className="mt-6 flex flex-col gap-3 rounded-lg border bg-white p-4 shadow-sm sm:flex-row">
          <input className="input flex-1" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city or district" required />
          <button disabled={loading} className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 font-bold text-white disabled:opacity-60">
            {loading && <Loader2 className="h-5 w-5 animate-spin" />} Get Advisory
          </button>
        </form>
        {data && (
          <section className="mt-6 rounded-lg border border-emerald-100 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-emerald-950">{data.weather.city}</h2>
            <p className="capitalize text-gray-500">{data.weather.condition}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Metric icon={<Thermometer />} label="Temperature" value={`${data.weather.temperature} C`} />
              <Metric icon={<Droplets />} label="Humidity" value={`${data.weather.humidity}%`} />
              <Metric icon={<CloudRain />} label="Rainfall" value={`${data.weather.rainfall} mm`} />
              <Metric icon={<Wind />} label="Wind" value={`${data.weather.wind} m/s`} />
            </div>
            <div className="mt-6 rounded-lg bg-emerald-50 p-5 text-emerald-900">
              <p className="text-sm font-bold uppercase">Advisory</p>
              <p className="mt-2 text-lg font-semibold">{data.advisory}</p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function Metric({ icon, label, value }) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      {React.cloneElement(icon, { className: "mb-3 h-6 w-6 text-emerald-600" })}
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-black text-emerald-950">{value}</p>
    </div>
  );
}

Metric.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};
