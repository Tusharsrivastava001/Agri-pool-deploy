import React, { useEffect, useState } from "react";
import { Loader2, RefreshCcw, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useSocket } from "../context/SocketContext";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/transport/my-requests");
      setBookings(res.data);
    } catch {
      toast.error("Unable to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const updateBooking = (request) => {
      setBookings((items) => items.map((item) => item._id === request._id ? request : item));
      toast.success(`Transport status: ${request.status}`);
    };
    socket.on("request_accepted", updateBooking);
    socket.on("status_update", updateBooking);
    return () => {
      socket.off("request_accepted", updateBooking);
      socket.off("status_update", updateBooking);
    };
  }, [socket]);

  const cancelBooking = async (id) => {
    try {
      const res = await api.put(`/api/transport/${id}/cancel`);
      setBookings((items) => items.map((item) => item._id === id ? res.data.request : item));
      toast.success("Request cancelled");
    } catch (error) {
      toast.error(error.response?.data?.error || "Unable to cancel request");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-emerald-950">My Bookings</h1>
            <p className="text-gray-600">Track live status updates from transporters.</p>
          </div>
          <button onClick={loadBookings} className="rounded-lg border bg-white p-3 text-emerald-700"><RefreshCcw className="h-5 w-5" /></button>
        </div>
        {loading ? <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" /> : (
          <div className="grid gap-4 md:grid-cols-2">
            {bookings.map((booking) => (
              <article key={booking._id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-emerald-950">{booking.cropName}</h2>
                    <p className="text-sm text-gray-500">{booking.quantity} kg | {new Date(booking.date).toLocaleDateString()}</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">{booking.status}</span>
                </div>
                <p className="mt-4 text-sm text-gray-600">{booking.pickupLocation} to {booking.destination}</p>
                {booking.transporterId && <p className="mt-2 text-sm text-gray-500">Transporter: {booking.transporterId.name} ({booking.transporterId.phone})</p>}
                {booking.status === "Pending" && (
                  <button onClick={() => cancelBooking(booking._id)} className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
                    <XCircle className="h-4 w-4" /> Cancel
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
