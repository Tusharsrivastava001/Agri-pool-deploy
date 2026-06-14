import React, { useState } from "react";
import { Loader2, Search } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/api";

export default function Mandi() {
  const [filters, setFilters] = useState({ state: "Punjab", commodity: "Wheat" });
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPrices = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.get("/api/mandi", { params: filters });
      setRecords(res.data.records || []);
      toast.success(`Loaded mandi prices from ${res.data.source}`);
    } catch (error) {
      toast.error(error.response?.data?.error || "Unable to fetch mandi prices");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-black text-emerald-950">Live Mandi Price Tracker</h1>
        <p className="mt-2 text-gray-600">Filter data.gov.in commodity prices by state and crop.</p>
        <form onSubmit={fetchPrices} className="mt-6 grid gap-3 rounded-lg border bg-white p-4 shadow-sm md:grid-cols-[1fr_1fr_auto]">
          <input className="input" value={filters.state} onChange={(e) => setFilters({ ...filters, state: e.target.value })} placeholder="State" required />
          <input className="input" value={filters.commodity} onChange={(e) => setFilters({ ...filters, commodity: e.target.value })} placeholder="Commodity" />
          <button disabled={loading} className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 font-bold text-white disabled:opacity-60">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />} Search
          </button>
        </form>
        <div className="mt-6 overflow-hidden rounded-lg border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-emerald-600 text-white">
                <tr>
                  <th className="px-4 py-3">Commodity</th>
                  <th className="px-4 py-3">Market</th>
                  <th className="px-4 py-3">Min Price</th>
                  <th className="px-4 py-3">Max Price</th>
                  <th className="px-4 py-3">Modal Price</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr><td className="px-4 py-6 text-center text-gray-500" colSpan="6">No mandi records loaded.</td></tr>
                ) : records.map((item, index) => (
                  <tr key={`${item.market}-${index}`} className="border-t">
                    <td className="px-4 py-3 font-semibold">{item.commodity}</td>
                    <td className="px-4 py-3">{item.market}</td>
                    <td className="px-4 py-3">{item.minPrice}</td>
                    <td className="px-4 py-3">{item.maxPrice}</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">{item.modalPrice}</td>
                    <td className="px-4 py-3">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
