"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { formatDisplayDate, classNames } from "@/lib/utils";

type Customer = {
  id: string;
  type: "registered" | "guest";
  fullName: string;
  email: string;
  phone: string;
  appointmentCount: number;
  createdAt: string;
};

type HistoryAppointment = {
  id: string;
  date: string;
  startTime: string;
  status: string;
  service: { title: string };
  specialist: { name: string } | null;
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  APPROVED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-red-50 text-red-700",
  COMPLETED: "bg-slate-100 text-slate-700",
  CANCELLED: "bg-slate-100 text-slate-400",
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [history, setHistory] = useState<HistoryAppointment[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  async function load() {
    setLoading(true);
    const params = q ? `?q=${encodeURIComponent(q)}` : "";
    const res = await fetch(`/api/customers${params}`);
    setCustomers(await res.json());
    setLoading(false);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function openHistory(c: Customer) {
    setSelected(c);
    setHistoryLoading(true);
    const res = await fetch(`/api/customers/${c.id}`);
    setHistory(await res.json());
    setHistoryLoading(false);
  }

  return (
    <div>
      <h1 className="text-3xl text-ink">Customers</h1>

      <div className="mt-6 flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2">
          <Search size={16} className="text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder="Search name or email…"
            className="text-sm outline-none"
          />
        </div>
        <button onClick={load} className="btn-outline !py-2 text-xs">Search</button>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl3 border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-bg-soft text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Appointments</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {customers.map((c) => (
              <tr key={c.id}>
                <td className="px-5 py-4 font-medium text-ink">{c.fullName}</td>
                <td className="px-5 py-4 text-xs text-muted">{c.email}{c.phone ? ` · ${c.phone}` : ""}</td>
                <td className="px-5 py-4">
                  <span className={classNames("rounded-full px-3 py-1 text-xs", c.type === "registered" ? "bg-brand-light text-brand-dark" : "bg-bg-soft text-muted")}>
                    {c.type === "registered" ? "Registered" : "Guest"}
                  </span>
                </td>
                <td className="px-5 py-4">{c.appointmentCount}</td>
                <td className="px-5 py-4">
                  <button onClick={() => openHistory(c)} className="text-xs text-brand-dark hover:underline">View History</button>
                </td>
              </tr>
            ))}
            {!loading && customers.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-muted">No customers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" onClick={() => setSelected(null)}>
          <div className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-xl3 bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl text-ink">{selected.fullName}</h2>
              <button onClick={() => setSelected(null)} className="text-muted hover:text-ink"><X size={18} /></button>
            </div>
            <p className="text-xs text-muted">{selected.email}{selected.phone ? ` · ${selected.phone}` : ""}</p>

            <div className="mt-5 space-y-3">
              {historyLoading && <p className="text-sm text-muted">Loading history…</p>}
              {!historyLoading && history.length === 0 && <p className="text-sm text-muted">No appointments found.</p>}
              {history.map((a) => (
                <div key={a.id} className="rounded-xl2 border border-line p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-ink">{a.service.title}</p>
                    <span className={classNames("rounded-full px-2.5 py-0.5 text-[11px]", statusStyles[a.status])}>{a.status}</span>
                  </div>
                  <p className="text-xs text-muted">{formatDisplayDate(a.date.slice(0, 10))} at {a.startTime}{a.specialist ? ` · ${a.specialist.name}` : ""}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
