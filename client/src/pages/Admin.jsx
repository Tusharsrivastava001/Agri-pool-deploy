import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Loader2, Shield } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/api";

const COLORS = ["#16a34a", "#2563eb", "#f97316", "#9333ea", "#ef4444"];

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdmin = async () => {
      try {
        const [statsRes, usersRes, contactsRes] = await Promise.all([
          api.get("/api/admin/stats"),
          api.get("/api/admin/users"),
          api.get("/api/admin/contacts"),
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setContacts(contactsRes.data);
      } catch {
        toast.error("Unable to load admin dashboard");
      } finally {
        setLoading(false);
      }
    };
    loadAdmin();
  }, []);

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-emerald-600" /></main>;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 flex items-center gap-2 text-3xl font-black text-emerald-950"><Shield className="h-8 w-8 text-emerald-600" /> Admin Analytics</h1>
        <p className="mb-6 text-gray-600">Platform activity, users, and latest contact requests.</p>
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Stat label="Users" value={users.length} />
          <Stat label="AI Queries This Month" value={stats?.fertilizerQueriesThisMonth || 0} />
          <Stat label="Top Crops" value={stats?.topCrops?.length || 0} />
          <Stat label="Contacts" value={contacts.length} />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <ChartPanel title="Users by Role">
            <BarChart data={stats?.usersByRole || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="role" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#16a34a" />
            </BarChart>
          </ChartPanel>
          <ChartPanel title="Requests Last 7 Days">
            <LineChart data={stats?.requestsByDay || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} />
            </LineChart>
          </ChartPanel>
          <ChartPanel title="Top Crops">
            <PieChart>
              <Pie data={stats?.topCrops || []} dataKey="count" nameKey="crop" outerRadius={90} label>
                {(stats?.topCrops || []).map((entry, index) => <Cell key={entry.crop} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ChartPanel>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Table title="Recent Users" rows={users.slice(0, 8)} columns={["name", "phone", "role"]} />
          <Table title="Recent Contacts" rows={contacts.slice(0, 8)} columns={["name", "email", "subject"]} />
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }) {
  return <div className="rounded-lg border bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">{label}</p><p className="mt-2 text-3xl font-black text-emerald-950">{value}</p></div>;
}

function ChartPanel({ title, children }) {
  return (
    <section className="rounded-lg border bg-white p-5 shadow-sm">
      <h2 className="mb-4 font-black text-emerald-950">{title}</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
      </div>
    </section>
  );
}

function Table({ title, rows, columns }) {
  return (
    <section className="rounded-lg border bg-white p-5 shadow-sm">
      <h2 className="mb-4 font-black text-emerald-950">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <tbody>
            {rows.map((row) => (
              <tr key={row._id} className="border-t">
                {columns.map((column) => <td key={column} className="px-3 py-3">{row[column] || "-"}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

Stat.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

ChartPanel.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

Table.propTypes = {
  title: PropTypes.string.isRequired,
  rows: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
};
