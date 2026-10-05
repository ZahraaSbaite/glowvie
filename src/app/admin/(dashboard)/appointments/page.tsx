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

  // No filters — every appointment, regardless of date or status, always shows here.
  async function load() {
    setLoading(true);
    const res = await fetch("/api/appointments");
    const data = await res.json();
    setAppointments(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

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
              <tr><td colSpan={5} className="px-5 py-10 text-center text-muted">No appointments yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
        </>
      )}
    </div>
  );
}
