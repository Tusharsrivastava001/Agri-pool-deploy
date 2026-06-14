import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CheckCircle2, Loader2, Truck } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useSocket } from "../context/SocketContext";

export default function TransporterDashboard() {
  const [openRequests, setOpenRequests] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  const loadData = async () => {
    setLoading(true);
    try {
      const [openRes, assignedRes] = await Promise.all([
        api.get("/api/transport/open"),
        api.get("/api/transport/assigned"),
      ]);
      setOpenRequests(openRes.data);
      setAssigned(assignedRes.data);
    } catch {
      toast.error("Unable to load transport marketplace");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onNewRequest = (request) => {
      setOpenRequests((items) => [request, ...items]);
      toast.success("New transport request received");
    };
    socket.on("new_request", onNewRequest);
    return () => socket.off("new_request", onNewRequest);
  }, [socket]);

  const accept = async (id) => {
    try {
      const res = await api.put(`/api/transport/${id}/accept`);
      setOpenRequests((items) => items.filter((item) => item._id !== id));
      setAssigned((items) => [res.data.request, ...items]);
      toast.success("Request accepted");
    } catch (error) {
      toast.error(error.response?.data?.error || "Unable to accept request");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`/api/transport/${id}/status`, { status });
      setAssigned((items) => items.map((item) => item._id === id ? res.data.request : item));
      toast.success(`Marked as ${status}`);
    } catch {
      toast.error("Unable to update status");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 flex items-center gap-2 text-3xl font-black text-emerald-950"><Truck className="h-8 w-8 text-emerald-600" /> Transporter Dashboard</h1>
        <p className="mb-6 text-gray-600">Accept open loads and update live delivery status.</p>
        {loading ? <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" /> : (
          <div className="grid gap-6 lg:grid-cols-2">
            <RequestColumn title="Open Requests" requests={openRequests} action={(item) => (
              <button onClick={() => accept(item._id)} className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 font-bold text-white">Accept</button>
            )} />
            <RequestColumn title="Assigned Loads" requests={assigned} action={(item) => (
              <div className="mt-4 flex flex-wrap gap-2">
                {item.status === "Accepted" && <button onClick={() => updateStatus(item._id, "In Transit")} className="rounded-lg bg-blue-600 px-4 py-2 font-bold text-white">In Transit</button>}
                {item.status === "In Transit" && <button onClick={() => updateStatus(item._id, "Delivered")} className="rounded-lg bg-emerald-600 px-4 py-2 font-bold text-white">Delivered</button>}
                {item.status === "Delivered" && <span className="flex items-center gap-2 text-sm font-bold text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Complete</span>}
              </div>
            )} />
          </div>
        )}
      </div>
    </main>
  );
}

function RequestColumn({ title, requests, action }) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-xl font-black text-emerald-950">{title}</h2>
      <div className="space-y-4">
        {requests.length === 0 ? <p className="text-sm text-gray-500">No requests here.</p> : requests.map((item) => (
          <article key={item._id} className="rounded-lg border border-gray-100 p-4">
            {item.cropPhotoUrl && <img src={item.cropPhotoUrl} alt={item.cropName} className="mb-3 h-36 w-full rounded-lg object-cover" />}
            <div className="flex justify-between gap-4">
              <div>
                <h3 className="font-black text-gray-900">{item.cropName}</h3>
                <p className="text-sm text-gray-500">{item.quantity} kg | {new Date(item.date).toLocaleDateString()}</p>
              </div>
              <span className="h-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">{item.status}</span>
            </div>
            <p className="mt-3 text-sm text-gray-600">{item.pickupLocation} to {item.destination}</p>
            {item.userId && <p className="mt-2 text-xs text-gray-500">Farmer: {item.userId.name} ({item.userId.phone})</p>}
            {action(item)}
          </article>
        ))}
      </div>
    </section>
  );
}

RequestColumn.propTypes = {
  title: PropTypes.string.isRequired,
  requests: PropTypes.array.isRequired,
  action: PropTypes.func.isRequired,
};
