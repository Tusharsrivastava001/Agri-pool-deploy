import React, { useState } from "react";
import PropTypes from "prop-types";
import { CalendarDays, Image, Loader2, MapPin, Navigation, Package, Send, Truck } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/api";

export default function Transport() {
  const [form, setForm] = useState({
    cropName: "",
    quantity: "",
    pickupLocation: "",
    destination: "",
    date: "",
  });
  const [cropPhoto, setCropPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    if (cropPhoto) payload.append("cropPhoto", cropPhoto);

    try {
      await api.post("/api/transport/request", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Transport request posted");
      setForm({ cropName: "", quantity: "", pickupLocation: "", destination: "", date: "" });
      setCropPhoto(null);
    } catch (error) {
      toast.error(error.response?.data?.error || "Unable to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-emerald-50/50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <Truck className="mx-auto mb-3 h-10 w-10 text-emerald-600" />
          <h1 className="text-3xl font-black text-emerald-950">Create Transport Request</h1>
          <p className="mt-2 text-gray-600">Post your load to the live transporter marketplace.</p>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto grid max-w-3xl gap-4 rounded-lg border border-emerald-100 bg-white p-6 shadow-sm md:grid-cols-2">
          <Field icon={<Package />} label="Crop Type">
            <input required name="cropName" value={form.cropName} onChange={(e) => setForm({ ...form, cropName: e.target.value })} placeholder="Wheat" className="input" />
          </Field>
          <Field icon={<Package />} label="Quantity (kg)">
            <input required type="number" min="1" name="quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="1200" className="input" />
          </Field>
          <Field icon={<MapPin />} label="Pickup Location">
            <input required name="pickupLocation" value={form.pickupLocation} onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })} placeholder="Village / District" className="input" />
          </Field>
          <Field icon={<Navigation />} label="Destination">
            <input required name="destination" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="Mandi / Market" className="input" />
          </Field>
          <Field icon={<CalendarDays />} label="Pickup Date">
            <input required type="date" name="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input" />
          </Field>
          <Field icon={<Image />} label="Crop Photo (optional)">
            <input type="file" accept="image/*" onChange={(e) => setCropPhoto(e.target.files?.[0] || null)} className="input file:mr-3 file:rounded-md file:border-0 file:bg-emerald-100 file:px-3 file:py-2 file:text-emerald-800" />
          </Field>
          <button disabled={loading} className="md:col-span-2 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-60">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            {loading ? "Posting..." : "Post Request"}
          </button>
        </form>
      </div>
    </main>
  );
}

function Field({ icon, label, children }) {
  return (
    <label className="block text-sm font-semibold text-gray-700">
      <span className="mb-2 flex items-center gap-2">{React.cloneElement(icon, { className: "h-4 w-4 text-emerald-600" })}{label}</span>
      {children}
    </label>
  );
}

Field.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
