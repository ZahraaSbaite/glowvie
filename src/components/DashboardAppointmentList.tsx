"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDisplayDate } from "@/lib/utils";
import { classNames } from "@/lib/utils";

type Appointment = {
  id: string;
  serviceTitle: string;
  serviceId: string;
  specialistId: string | null;
  specialistName: string | null;
  date: string;
  startTime: string;
  status: string;
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  APPROVED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-red-50 text-red-700",
  COMPLETED: "bg-slate-100 text-slate-700",
  CANCELLED: "bg-slate-100 text-slate-400",
};

export function DashboardAppointmentList({ appointments }: { appointments: Appointment[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rescheduling, setRescheduling] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [slots, setSlots] = useState<string[]>([]);

  async function cancelAppointment(id: string) {
    if (!confirm("Cancel this appointment?")) return;
    setBusyId(id);
    await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel" }),
    });
    setBusyId(null);
    router.refresh();
  }

  async function loadSlotsFor(serviceId: string, specialistId: string | null, date: string) {
    setNewDate(date);
    setNewTime("");
    const params = new URLSearchParams({ date, serviceId });
    if (specialistId) params.set("specialistId", specialistId);
    const res = await fetch(`/api/availability?${params.toString()}`);
    const data = await res.json();
    setSlots(data.slots || []);
  }

  async function submitReschedule(id: string) {
    if (!newDate || !newTime) return;
    setBusyId(id);
    const res = await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: newDate, time: newTime }),
    });
    setBusyId(null);
    if (res.ok) {
      setRescheduling(null);
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error || "Could not reschedule");
    }
  }

  if (appointments.length === 0) {
    return (
      <div className="card-lux p-10 text-center text-muted">
        You don't have any appointments yet. <a href="/book" className="text-brand-dark hover:underline">Book one now</a>.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((a) => {
        const canModify = a.status === "PENDING" || a.status === "APPROVED";
        return (
          <div key={a.id} className="card-lux p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium text-ink">{a.serviceTitle}</p>
                <p className="text-sm text-muted">
                  {formatDisplayDate(a.date)} at {a.startTime}
                  {a.specialistName ? ` · ${a.specialistName}` : ""}
                </p>
              </div>
              <span className={classNames("rounded-full px-3 py-1 text-xs font-medium", statusStyles[a.status])}>
                {a.status.charAt(0) + a.status.slice(1).toLowerCase()}
              </span>
            </div>

            {canModify && (
              <div className="mt-4 flex gap-3 border-t border-line pt-4">
                <button
                  onClick={() => setRescheduling(rescheduling === a.id ? null : a.id)}
                  className="text-sm font-medium text-brand-dark hover:underline"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => cancelAppointment(a.id)}
                  disabled={busyId === a.id}
                  className="text-sm font-medium text-red-500 hover:underline"
                >
                  Cancel
                </button>
              </div>
            )}

            {rescheduling === a.id && (
              <div className="mt-4 space-y-3 rounded-xl2 bg-bg-soft p-4">
                <input
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => loadSlotsFor(a.serviceId, a.specialistId, e.target.value)}
                  className="w-full rounded-full border border-line px-4 py-2 text-sm outline-none focus:border-brand"
                />
                {slots.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {slots.map((s) => (
                      <button
                        key={s}
                        onClick={() => setNewTime(s)}
                        className={classNames(
                          "rounded-lg border py-2 text-xs",
                          newTime === s ? "border-brand bg-brand text-white" : "border-line"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => submitReschedule(a.id)}
                  disabled={!newDate || !newTime || busyId === a.id}
                  className="btn-primary w-full !py-2 text-xs disabled:opacity-40"
                >
                  Confirm New Time
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
