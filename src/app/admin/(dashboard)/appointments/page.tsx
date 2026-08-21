"use client";

import { useEffect, useState } from "react";
import { CalendarDays, List } from "lucide-react";
import { classNames, formatDisplayDate } from "@/lib/utils";
import { AdminAppointmentCalendar } from "@/components/AdminAppointmentCalendar";

type Appointment = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  notes: string;
  date: string;
  startTime: string;
  endTime: string;
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

export default function AdminAppointmentsPage() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [specialistId, setSpecialistId] = useState("");
  const [specialists, setSpecialists] = useState<{ id: string; name: string }[]>([]);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    if (specialistId) params.set("specialistId", specialistId);
    const res = await fetch(`/api/appointments?${params.toString()}`);
    const data = await res.json();
    setAppointments(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    fetch("/api/specialists").then((r) => r.json()).then(setSpecialists);
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, specialistId]);

  async function updateStatus(id: string, newStatus: string) {
    await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-ink">Appointments</h1>
        <div className="flex rounded-full border border-line bg-white p-1">
          <button
            onClick={() => setView("list")}
            className={classNames(
              "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
              view === "list" ? "bg-brand text-white" : "text-muted hover:text-ink"
            )}
          >
            <List size={14} /> List
          </button>
          <button
            onClick={() => setView("calendar")}
            className={classNames(
              "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
              view === "calendar" ? "bg-brand text-white" : "text-muted hover:text-ink"
            )}
          >
            <CalendarDays size={14} /> Calendar
          </button>
        </div>
      </div>

      {view === "calendar" ? (
        <AdminAppointmentCalendar />
      ) : (
        <>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          placeholder="Search name, email, phone…"
          className="rounded-full border border-line bg-white px-4 py-2 text-sm outline-none focus:border-brand"
        />
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-full border border-line bg-white px-4 py-2 text-sm outline-none focus:border-brand" />
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-full border border-line bg-white px-4 py-2 text-sm outline-none focus:border-brand" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-full border border-line bg-white px-4 py-2 text-sm outline-none focus:border-brand">
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <select value={specialistId} onChange={(e) => setSpecialistId(e.target.value)} className="rounded-full border border-line bg-white px-4 py-2 text-sm outline-none focus:border-brand">
          <option value="">All Staff</option>
          {specialists.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <button onClick={load} className="btn-outline !py-2 text-xs">Apply Filters</button>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl3 border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-bg-soft text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Service</th>
              <th className="px-5 py-3">Date & Time</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {appointments.map((a) => (
              <tr key={a.id}>
                <td className="px-5 py-4">
                  <p className="font-medium text-ink">{a.fullName}</p>
                  <p className="text-xs text-muted">{a.email} · {a.phone}</p>
                </td>
                <td className="px-5 py-4">{a.service.title}{a.specialist ? ` · ${a.specialist.name}` : ""}</td>
                <td className="px-5 py-4">{formatDisplayDate(a.date)}<br /><span className="text-xs text-muted">{a.startTime}–{a.endTime}</span></td>
                <td className="px-5 py-4">
                  <span className={classNames("rounded-full px-3 py-1 text-xs font-medium", statusStyles[a.status])}>{a.status}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    {a.status === "PENDING" && (
                      <>
                        <button onClick={() => updateStatus(a.id, "APPROVED")} className="rounded-full bg-brand px-3 py-1 text-xs text-white hover:bg-brand-dark">Approve</button>
                        <button onClick={() => updateStatus(a.id, "REJECTED")} className="rounded-full border border-line px-3 py-1 text-xs text-muted hover:border-red-300 hover:text-red-500">Reject</button>
                      </>
                    )}
                    {a.status === "APPROVED" && (
                      <button onClick={() => updateStatus(a.id, "COMPLETED")} className="rounded-full border border-line px-3 py-1 text-xs text-muted hover:border-brand">Mark Completed</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!loading && appointments.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-muted">No appointments match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
        </>
      )}
    </div>
  );
}
