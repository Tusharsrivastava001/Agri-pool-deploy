import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AlertTriangle, CalendarDays, FlaskConical, History, Loader2, Sprout } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/api";

export default function FertilizerPlanner() {
  const [form, setForm] = useState({ crop: "", soilType: "", season: "", landSize: "" });
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/api/fertilizer/my-plans");
      setHistory(res.data);
    } catch (error) {
      if (error.response?.status !== 401) toast.error("Unable to load fertilizer history");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/fertilizer/ai-recommend", form);
      setPlan(res.data.plan);
      setForm({ crop: "", soilType: "", season: "", landSize: "" });
      toast.success("AI fertilizer plan generated");
      fetchHistory();
    } catch (error) {
      toast.error(error.response?.data?.error || "Unable to generate plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-emerald-50/40 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-wide text-emerald-600">AI Crop Advisor</p>
          <h1 className="mt-2 text-3xl font-black text-emerald-950">Crop & Fertilizer Recommendation</h1>
          <p className="mt-2 max-w-2xl text-gray-600">Enter your farm details and get fertilizer quantities, application timing, and warnings from the backend Gemini advisor.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[390px_1fr]">
          <section className="rounded-lg border border-emerald-100 bg-white p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Crop Type
                <input className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-emerald-500" name="crop" value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })} placeholder="Wheat, Rice, Cotton" required />
              </label>
              <label className="block text-sm font-semibold text-gray-700">
                Soil Type
                <select className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-emerald-500" name="soilType" value={form.soilType} onChange={(e) => setForm({ ...form, soilType: e.target.value })} required>
                  <option value="">Select soil</option>
                  <option value="Clay">Clay</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Loamy">Loamy</option>
                  <option value="Black">Black</option>
                  <option value="Alluvial">Alluvial</option>
                </select>
              </label>
              <label className="block text-sm font-semibold text-gray-700">
                Season
                <select className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-emerald-500" name="season" value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value })} required>
                  <option value="">Select season</option>
                  <option value="Kharif">Kharif</option>
                  <option value="Rabi">Rabi</option>
                  <option value="Zaid">Zaid</option>
                </select>
              </label>
              <label className="block text-sm font-semibold text-gray-700">
                Land Area (acres)
                <input className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-emerald-500" type="number" min="0.1" step="0.1" name="landSize" value={form.landSize} onChange={(e) => setForm({ ...form, landSize: e.target.value })} placeholder="2.5" required />
              </label>
              <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-60">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <FlaskConical className="h-5 w-5" />}
                {loading ? "Generating..." : "Generate AI Plan"}
              </button>
            </form>
          </section>

          <section className="space-y-6">
            <div className="rounded-lg border border-emerald-100 bg-white p-6 shadow-sm">
              {!plan ? (
                <div className="flex min-h-80 flex-col items-center justify-center text-center text-gray-500">
                  <Sprout className="mb-4 h-14 w-14 text-emerald-600" />
                  <h2 className="text-xl font-bold text-emerald-950">Your recommendation will appear here</h2>
                  <p className="mt-2 max-w-md">The response includes fertilizer quantities, a schedule, and practical warnings.</p>
                </div>
              ) : (
                <PlanCard plan={plan} />
              )}
            </div>

            <div className="rounded-lg border border-emerald-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <History className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-black text-emerald-950">Saved Plans</h2>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {history.length === 0 ? <p className="text-sm text-gray-500">No saved plans yet.</p> : history.map((item) => (
                  <button key={item._id} onClick={() => setPlan(item)} className="rounded-lg border border-gray-200 p-4 text-left hover:border-emerald-400">
                    <p className="font-bold text-emerald-950">{item.crop} on {item.landSize} acres</p>
                    <p className="text-sm text-gray-500">{item.soilType} soil, {item.season}</p>
                    <p className="mt-2 text-xs text-gray-400">{new Date(item.createdAt).toLocaleString()}</p>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function PlanCard({ plan }) {
  const response = plan.aiResponse || {};
  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase text-emerald-600">Recommendation</p>
        <h2 className="text-2xl font-black text-emerald-950">{plan.crop} Fertilizer Plan</h2>
        <p className="mt-2 text-gray-600">{response.summary}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {(response.fertilizers || []).map((item, index) => (
          <div key={`${item.name}-${index}`} className="rounded-lg bg-emerald-50 p-4">
            <p className="font-black text-emerald-950">{item.name}</p>
            <p className="mt-1 text-2xl font-black text-emerald-700">{item.quantity}</p>
            <p className="mt-2 text-sm text-gray-600">{item.purpose}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="mb-3 flex items-center gap-2 font-black text-gray-800"><CalendarDays className="h-5 w-5 text-emerald-600" /> Schedule</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {(response.schedule || []).map((item, index) => <li key={index} className="rounded-lg bg-gray-50 p-3">{item}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 flex items-center gap-2 font-black text-gray-800"><AlertTriangle className="h-5 w-5 text-orange-500" /> Warnings</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {(response.warnings || []).map((item, index) => <li key={index} className="rounded-lg bg-orange-50 p-3 text-orange-800">{item}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

PlanCard.propTypes = {
  plan: PropTypes.shape({
    crop: PropTypes.string,
    landSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    aiResponse: PropTypes.shape({
      summary: PropTypes.string,
      fertilizers: PropTypes.array,
      schedule: PropTypes.array,
      warnings: PropTypes.array,
    }),
  }).isRequired,
};
