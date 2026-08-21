"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { classNames, formatDisplayDate } from "@/lib/utils";

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

const dotStyles: Record<string, string> = {
  PENDING: "bg-amber-500",
  APPROVED: "bg-emerald-500",
  REJECTED: "bg-red-400",
  COMPLETED: "bg-slate-400",
  CANCELLED: "bg-slate-300",
};

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function AdminAppointmentCalendar() {
  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(todayIso);

  useEffect(() => {
    setLoading(true);
    const from = `${viewYear}-${pad(viewMonth + 1)}-01`;
    const lastDay = new Date(viewYear, viewMonth + 1, 0).getDate();
    const to = `${viewYear}-${pad(viewMonth + 1)}-${pad(lastDay)}`;
    fetch(`/api/appointments?dateFrom=${from}&dateTo=${to}`)
      .then((r) => r.json())
      .then((data) => setAppointments(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [viewYear, viewMonth]);

  const byDate = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    for (const a of appointments) {
      const key = a.date.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(a);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
    return map;
  }, [appointments]);

  function changeMonth(delta: number) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setViewMonth(m);
    setViewYear(y);
  }

  async function updateStatus(id: string, newStatus: string) {
    await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
  }

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const selectedAppointments = byDate.get(selectedDate) || [];

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="rounded-xl3 border border-line bg-white p-6">
        <div className="flex items-center justify-between">
          <button onClick={() => changeMonth(-1)} className="rounded-full border border-line p-2 hover:border-brand">
            <ChevronLeft size={16} />
          </button>
          <div className="flex items-center gap-3">
            <p className="text-lg font-medium text-ink">{monthLabel}</p>
            <button
              onClick={() => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); setSelectedDate(todayIso); }}
              className="rounded-full border border-line px-3 py-1 text-xs text-muted hover:border-brand"
            >
              Today
            </button>
          </div>
          <button onClick={() => changeMonth(1)} className="rounded-full border border-line p-2 hover:border-brand">
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-7 gap-1.5 text-center text-xs text-muted">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-1 font-medium">{d}</div>
          ))}
          {Array.from({ length: firstWeekday }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const iso = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
            const dayAppointments = byDate.get(iso) || [];
            const isToday = iso === todayIso;
            const isSelected = iso === selectedDate;
            const statuses = Array.from(new Set(dayAppointments.map((a) => a.status)));
            return (
              <button
                key={iso}
                onClick={() => setSelectedDate(iso)}
                className={classNames(
                  "flex aspect-square flex-col items-center justify-start gap-1 rounded-lg pt-1.5 text-sm transition-colors",
                  isSelected && "bg-brand text-white",
                  !isSelected && isToday && "bg-bg-soft font-semibold text-brand-dark",
                  !isSelected && !isToday && "text-ink hover:bg-bg-soft"
                )}
              >
                {day}
                <div className="flex gap-0.5">
                  {statuses.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className={classNames("h-1.5 w-1.5 rounded-full", isSelected ? "bg-white" : dotStyles[s])}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {loading && <p className="mt-4 text-center text-xs text-muted">Loading appointments…</p>}
      </div>

      <div className="rounded-xl3 border border-line bg-white p-6">
        <h3 className="text-lg text-ink">{formatDisplayDate(selectedDate)}</h3>
        <div className="mt-4 space-y-3">
          {selectedAppointments.length === 0 && (
            <p className="text-sm text-muted">No appointments on this day.</p>
          )}
          {selectedAppointments.map((a) => (
            <div key={a.id} className="rounded-xl2 border border-line p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-ink">{a.startTime}–{a.endTime}</p>
                  <p className="text-sm text-ink">{a.fullName}</p>
                  <p className="text-xs text-muted">{a.service.title}{a.specialist ? ` · ${a.specialist.name}` : ""}</p>
                  <p className="text-xs text-muted">{a.email} · {a.phone}</p>
                </div>
                <span className={classNames("shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium", statusStyles[a.status])}>
                  {a.status}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
