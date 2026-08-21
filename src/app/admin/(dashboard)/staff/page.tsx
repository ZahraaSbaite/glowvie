"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, CalendarOff } from "lucide-react";

type Specialist = {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  imageUrl: string;
  isActive: boolean;
  serviceIds: string[];
};

type Service = { id: string; title: string };

type StaffHour = {
  weekday: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breakStart: string | null;
  breakEnd: string | null;
};

type BlockedSlot = { id: string; date: string; startTime: string; endTime: string; reason: string };

const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const emptyForm = { name: "", title: "", bio: "", email: "", phone: "", imageUrl: "", serviceIds: [] as string[] };

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<Specialist[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [scheduleFor, setScheduleFor] = useState<string | null>(null);

  async function load() {
    const [staffRes, servicesRes] = await Promise.all([fetch("/api/specialists"), fetch("/api/services")]);
    setStaff(await staffRes.json());
    setServices(await servicesRes.json());
  }
  useEffect(() => {
    load();
  }, []);

  function startCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }
  function startEdit(s: Specialist) {
    setForm({ name: s.name, title: s.title, bio: s.bio, email: s.email, phone: s.phone, imageUrl: s.imageUrl, serviceIds: s.serviceIds });
    setEditingId(s.id);
    setShowForm(true);
  }

  async function submit() {
    if (editingId) {
      await fetch(`/api/specialists/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      const res = await fetch("/api/specialists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const created = await res.json();
      await fetch(`/api/specialists/${created.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceIds: form.serviceIds }),
      });
    }
    setShowForm(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Remove this staff member? Past appointments are preserved.")) return;
    await fetch(`/api/specialists/${id}`, { method: "DELETE" });
    load();
  }

  function toggleService(id: string) {
    setForm((f) => ({
      ...f,
      serviceIds: f.serviceIds.includes(id) ? f.serviceIds.filter((x) => x !== id) : [...f.serviceIds, id],
    }));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-ink">Staff</h1>
        <button onClick={startCreate} className="btn-primary !py-2 text-sm"><Plus size={16} /> Add Staff Member</button>
      </div>

      {showForm && (
        <div className="mt-6 card-lux p-6">
          <h2 className="text-lg text-ink">{editingId ? "Edit Staff Member" : "New Staff Member"}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-full border border-line px-4 py-2 text-sm" />
            <input placeholder="Title (e.g. Senior Nail Technician)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-full border border-line px-4 py-2 text-sm" />
            <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-full border border-line px-4 py-2 text-sm" />
            <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-full border border-line px-4 py-2 text-sm" />
            <input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="sm:col-span-2 rounded-full border border-line px-4 py-2 text-sm" />
            <textarea placeholder="Short bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={2} className="sm:col-span-2 rounded-xl2 border border-line px-4 py-2 text-sm" />
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted">Services Performed</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {services.map((svc) => (
              <label key={svc.id} className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs ${form.serviceIds.includes(svc.id) ? "border-brand bg-brand text-white" : "border-line text-muted"}`}>
                <input type="checkbox" className="hidden" checked={form.serviceIds.includes(svc.id)} onChange={() => toggleService(svc.id)} />
                {svc.title}
              </label>
            ))}
            {services.length === 0 && <p className="text-xs text-muted">No services yet.</p>}
          </div>
          <p className="mt-1.5 text-xs text-muted">Leave none selected to let this staff member take any service (no restriction).</p>

          <div className="mt-4 flex gap-3">
            <button onClick={submit} className="btn-primary !py-2 text-sm">Save Staff Member</button>
            <button onClick={() => setShowForm(false)} className="btn-outline !py-2 text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {staff.map((s) => (
          <div key={s.id} className="card-lux p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-ink">{s.name}</p>
                <p className="text-xs text-muted">{s.title || "—"}</p>
              </div>
              {!s.isActive && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">Inactive</span>}
            </div>
            <p className="mt-2 text-xs text-muted">{s.serviceIds.length > 0 ? `${s.serviceIds.length} service(s) assigned` : "No service restriction"}</p>
            <div className="mt-4 flex flex-wrap gap-3 border-t border-line pt-3">
              <button onClick={() => startEdit(s)} className="flex items-center gap-1 text-xs text-brand-dark hover:underline"><Pencil size={13} /> Edit</button>
              <button onClick={() => setScheduleFor(scheduleFor === s.id ? null : s.id)} className="flex items-center gap-1 text-xs text-brand-dark hover:underline"><CalendarOff size={13} /> Schedule</button>
              <button onClick={() => remove(s.id)} className="flex items-center gap-1 text-xs text-red-500 hover:underline"><Trash2 size={13} /> Remove</button>
            </div>

            {scheduleFor === s.id && <StaffSchedule specialistId={s.id} />}
          </div>
        ))}
        {staff.length === 0 && <p className="text-muted">No staff members yet.</p>}
      </div>
    </div>
  );
}

function StaffSchedule({ specialistId }: { specialistId: string }) {
  const [hours, setHours] = useState<StaffHour[]>([]);
  const [blocked, setBlocked] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDate, setNewDate] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [newReason, setNewReason] = useState("");

  async function load() {
    setLoading(true);
    const [hoursRes, globalRes, blockedRes] = await Promise.all([
      fetch(`/api/specialists/${specialistId}/hours`),
      fetch("/api/settings/working-hours"),
      fetch(`/api/settings/blocked-slots?specialistId=${specialistId}`),
    ]);
    const overrides: StaffHour[] = await hoursRes.json();
    const global = await globalRes.json();
    const merged = weekdayNames.map((_, weekday) => {
      const override = overrides.find((h) => h.weekday === weekday);
      if (override) return override;
      const g = global.find((h: any) => h.weekday === weekday);
      return {
        weekday,
        isOpen: g?.isOpen ?? true,
        openTime: g?.openTime ?? "09:00",
        closeTime: g?.closeTime ?? "18:00",
        breakStart: g?.breakStart ?? null,
        breakEnd: g?.breakEnd ?? null,
      };
    });
    setHours(merged);
    setBlocked(await blockedRes.json());
    setLoading(false);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specialistId]);

  async function updateHour(h: StaffHour) {
    setHours((prev) => prev.map((x) => (x.weekday === h.weekday ? h : x)));
    await fetch(`/api/specialists/${specialistId}/hours`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(h),
    });
  }

  async function addBlockedSlot() {
    if (!newDate || !newStart || !newEnd) return;
    await fetch("/api/settings/blocked-slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: newDate, startTime: newStart, endTime: newEnd, specialistId, reason: newReason }),
    });
    setNewDate("");
    setNewStart("");
    setNewEnd("");
    setNewReason("");
    load();
  }

  async function removeBlockedSlot(id: string) {
    await fetch(`/api/settings/blocked-slots/${id}`, { method: "DELETE" });
    load();
  }

  if (loading) return <p className="mt-4 text-xs text-muted">Loading schedule…</p>;

  return (
    <div className="mt-4 space-y-4 border-t border-line pt-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Weekly Hours (overrides clinic default)</p>
        <div className="mt-2 space-y-2">
          {hours.map((h) => (
            <div key={h.weekday} className="flex flex-wrap items-center gap-2 rounded-xl2 border border-line p-2 text-xs">
              <label className="flex w-24 items-center gap-1.5">
                <input type="checkbox" checked={h.isOpen} onChange={(e) => updateHour({ ...h, isOpen: e.target.checked })} />
                {weekdayNames[h.weekday].slice(0, 3)}
              </label>
              <input type="time" value={h.openTime} disabled={!h.isOpen} onChange={(e) => updateHour({ ...h, openTime: e.target.value })} className="rounded-full border border-line px-2 py-1 disabled:opacity-40" />
              <span className="text-muted">to</span>
              <input type="time" value={h.closeTime} disabled={!h.isOpen} onChange={(e) => updateHour({ ...h, closeTime: e.target.value })} className="rounded-full border border-line px-2 py-1 disabled:opacity-40" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Blocked Time Slots</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="rounded-full border border-line px-2 py-1 text-xs" />
          <input type="time" value={newStart} onChange={(e) => setNewStart(e.target.value)} className="rounded-full border border-line px-2 py-1 text-xs" />
          <input type="time" value={newEnd} onChange={(e) => setNewEnd(e.target.value)} className="rounded-full border border-line px-2 py-1 text-xs" />
          <input placeholder="Reason (optional)" value={newReason} onChange={(e) => setNewReason(e.target.value)} className="rounded-full border border-line px-2 py-1 text-xs" />
          <button onClick={addBlockedSlot} className="btn-primary !py-1 text-xs">Block</button>
        </div>
        <div className="mt-2 space-y-1">
          {blocked.map((b) => (
            <div key={b.id} className="flex items-center justify-between rounded-xl2 border border-line px-3 py-1.5 text-xs">
              <span>{b.date.slice(0, 10)} · {b.startTime}–{b.endTime}{b.reason ? ` · ${b.reason}` : ""}</span>
              <button onClick={() => removeBlockedSlot(b.id)} className="text-red-500 hover:underline">Remove</button>
            </div>
          ))}
          {blocked.length === 0 && <p className="text-xs text-muted">No blocked slots for this staff member.</p>}
        </div>
      </div>
    </div>
  );
}
