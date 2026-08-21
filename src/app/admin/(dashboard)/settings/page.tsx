"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Check } from "lucide-react";

type WorkingHour = {
  id: string;
  weekday: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breakStart: string | null;
  breakEnd: string | null;
};

type Holiday = { id: string; date: string; label: string };
type BlockedSlot = { id: string; date: string; startTime: string; endTime: string; reason: string };
type SiteSettings = {
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagramUrl: string;
  facebookUrl: string;
  mapEmbedUrl: string;
};

const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const emptySiteSettings: SiteSettings = { address: "", phone: "", whatsapp: "", email: "", instagramUrl: "", facebookUrl: "", mapEmbedUrl: "" };

export default function AdminSettingsPage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(emptySiteSettings);
  const [savingContact, setSavingContact] = useState(false);
  const [savedContact, setSavedContact] = useState(false);
  const [hours, setHours] = useState<WorkingHour[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [newHolidayDate, setNewHolidayDate] = useState("");
  const [newHolidayLabel, setNewHolidayLabel] = useState("");
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [newSlotDate, setNewSlotDate] = useState("");
  const [newSlotStart, setNewSlotStart] = useState("");
  const [newSlotEnd, setNewSlotEnd] = useState("");
  const [newSlotReason, setNewSlotReason] = useState("");

  async function loadHours() {
    const res = await fetch("/api/settings/working-hours");
    setHours(await res.json());
  }
  async function loadHolidays() {
    const res = await fetch("/api/settings/holidays");
    const data = await res.json();
    setHolidays(data.map((h: any) => ({ ...h, date: h.date.slice(0, 10) })));
  }
  async function loadBlockedSlots() {
    const res = await fetch("/api/settings/blocked-slots");
    const data = await res.json();
    setBlockedSlots(data.filter((b: any) => !b.specialistId).map((b: any) => ({ ...b, date: b.date.slice(0, 10) })));
  }

  async function loadSiteSettings() {
    const res = await fetch("/api/settings/site");
    const data = await res.json();
    if (data) setSiteSettings({ ...emptySiteSettings, ...data });
  }

  useEffect(() => {
    loadSiteSettings();
    loadHours();
    loadHolidays();
    loadBlockedSlots();
  }, []);

  async function saveSiteSettings() {
    setSavingContact(true);
    await fetch("/api/settings/site", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(siteSettings),
    });
    setSavingContact(false);
    setSavedContact(true);
    setTimeout(() => setSavedContact(false), 2000);
  }

  async function addBlockedSlot() {
    if (!newSlotDate || !newSlotStart || !newSlotEnd) return;
    await fetch("/api/settings/blocked-slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: newSlotDate, startTime: newSlotStart, endTime: newSlotEnd, reason: newSlotReason }),
    });
    setNewSlotDate("");
    setNewSlotStart("");
    setNewSlotEnd("");
    setNewSlotReason("");
    loadBlockedSlots();
  }

  async function removeBlockedSlot(id: string) {
    await fetch(`/api/settings/blocked-slots/${id}`, { method: "DELETE" });
    loadBlockedSlots();
  }

  async function updateHour(wh: WorkingHour) {
    setHours((prev) => prev.map((h) => (h.weekday === wh.weekday ? wh : h)));
    await fetch("/api/settings/working-hours", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(wh),
    });
  }

  async function addHoliday() {
    if (!newHolidayDate) return;
    await fetch("/api/settings/holidays", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: newHolidayDate, label: newHolidayLabel || "Holiday" }),
    });
    setNewHolidayDate("");
    setNewHolidayLabel("");
    loadHolidays();
  }

  async function removeHoliday(id: string) {
    await fetch(`/api/settings/holidays/${id}`, { method: "DELETE" });
    loadHolidays();
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl text-ink">Settings</h1>
        <p className="mt-1 text-muted">Manage contact info, working hours, holidays, and blocked slots.</p>
      </div>

      <div className="card-lux p-6">
        <h2 className="text-xl text-ink">Contact Info</h2>
        <p className="mt-1 text-sm text-muted">Shown across the site — homepage, footer, and Contact page.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input placeholder="Address" value={siteSettings.address} onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })} className="rounded-full border border-line px-4 py-2 text-sm" />
          <input placeholder="Phone (e.g. +961 3 000 000)" value={siteSettings.phone} onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })} className="rounded-full border border-line px-4 py-2 text-sm" />
          <input placeholder="WhatsApp number (digits only, e.g. 9613000000)" value={siteSettings.whatsapp} onChange={(e) => setSiteSettings({ ...siteSettings, whatsapp: e.target.value })} className="rounded-full border border-line px-4 py-2 text-sm" />
          <input placeholder="Email" value={siteSettings.email} onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })} className="rounded-full border border-line px-4 py-2 text-sm" />
          <input placeholder="Instagram URL" value={siteSettings.instagramUrl} onChange={(e) => setSiteSettings({ ...siteSettings, instagramUrl: e.target.value })} className="rounded-full border border-line px-4 py-2 text-sm" />
          <input placeholder="Facebook URL" value={siteSettings.facebookUrl} onChange={(e) => setSiteSettings({ ...siteSettings, facebookUrl: e.target.value })} className="rounded-full border border-line px-4 py-2 text-sm" />
          <input placeholder="Google Maps embed URL" value={siteSettings.mapEmbedUrl} onChange={(e) => setSiteSettings({ ...siteSettings, mapEmbedUrl: e.target.value })} className="sm:col-span-2 rounded-full border border-line px-4 py-2 text-sm" />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button onClick={saveSiteSettings} disabled={savingContact} className="btn-primary !py-2 text-sm disabled:opacity-60">
            {savingContact ? "Saving…" : "Save Contact Info"}
          </button>
          {savedContact && <span className="flex items-center gap-1 text-xs text-emerald-600"><Check size={14} /> Saved</span>}
        </div>
      </div>

      <div className="card-lux p-6">
        <h2 className="text-xl text-ink">Working Days & Hours</h2>
        <div className="mt-4 space-y-3">
          {hours
            .slice()
            .sort((a, b) => a.weekday - b.weekday)
            .map((wh) => (
              <div key={wh.weekday} className="flex flex-wrap items-center gap-3 rounded-xl2 border border-line p-3">
                <label className="flex w-32 items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={wh.isOpen}
                    onChange={(e) => updateHour({ ...wh, isOpen: e.target.checked })}
                  />
                  {weekdayNames[wh.weekday]}
                </label>
                <input
                  type="time"
                  value={wh.openTime}
                  disabled={!wh.isOpen}
                  onChange={(e) => updateHour({ ...wh, openTime: e.target.value })}
                  className="rounded-full border border-line px-3 py-1.5 text-sm disabled:opacity-40"
                />
                <span className="text-xs text-muted">to</span>
                <input
                  type="time"
                  value={wh.closeTime}
                  disabled={!wh.isOpen}
                  onChange={(e) => updateHour({ ...wh, closeTime: e.target.value })}
                  className="rounded-full border border-line px-3 py-1.5 text-sm disabled:opacity-40"
                />
                <span className="text-xs text-muted">break (optional)</span>
                <input
                  type="time"
                  value={wh.breakStart || ""}
                  disabled={!wh.isOpen}
                  onChange={(e) => updateHour({ ...wh, breakStart: e.target.value || null })}
                  className="rounded-full border border-line px-3 py-1.5 text-sm disabled:opacity-40"
                />
                <input
                  type="time"
                  value={wh.breakEnd || ""}
                  disabled={!wh.isOpen}
                  onChange={(e) => updateHour({ ...wh, breakEnd: e.target.value || null })}
                  className="rounded-full border border-line px-3 py-1.5 text-sm disabled:opacity-40"
                />
              </div>
            ))}
        </div>
      </div>

      <div className="card-lux p-6">
        <h2 className="text-xl text-ink">Holidays & Closures</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <input type="date" value={newHolidayDate} onChange={(e) => setNewHolidayDate(e.target.value)} className="rounded-full border border-line px-4 py-2 text-sm" />
          <input placeholder="Label (e.g. Eid Holiday)" value={newHolidayLabel} onChange={(e) => setNewHolidayLabel(e.target.value)} className="rounded-full border border-line px-4 py-2 text-sm" />
          <button onClick={addHoliday} className="btn-primary !py-2 text-sm"><Plus size={16} /> Add</button>
        </div>
        <div className="mt-5 divide-y divide-line">
          {holidays.map((h) => (
            <div key={h.id} className="flex items-center justify-between py-3 text-sm">
              <span>{h.date} — {h.label}</span>
              <button onClick={() => removeHoliday(h.id)} className="flex items-center gap-1 text-xs text-red-500 hover:underline">
                <Trash2 size={12} /> Remove
              </button>
            </div>
          ))}
          {holidays.length === 0 && <p className="py-4 text-center text-muted">No holidays added.</p>}
        </div>
      </div>

      <div className="card-lux p-6">
        <h2 className="text-xl text-ink">Blocked Time Slots</h2>
        <p className="mt-1 text-sm text-muted">Block a specific time window clinic-wide (e.g. equipment maintenance). For a single staff member's schedule, use their entry on the Staff page.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <input type="date" value={newSlotDate} onChange={(e) => setNewSlotDate(e.target.value)} className="rounded-full border border-line px-4 py-2 text-sm" />
          <input type="time" value={newSlotStart} onChange={(e) => setNewSlotStart(e.target.value)} className="rounded-full border border-line px-4 py-2 text-sm" />
          <input type="time" value={newSlotEnd} onChange={(e) => setNewSlotEnd(e.target.value)} className="rounded-full border border-line px-4 py-2 text-sm" />
          <input placeholder="Reason (optional)" value={newSlotReason} onChange={(e) => setNewSlotReason(e.target.value)} className="rounded-full border border-line px-4 py-2 text-sm" />
          <button onClick={addBlockedSlot} className="btn-primary !py-2 text-sm"><Plus size={16} /> Block</button>
        </div>
        <div className="mt-5 divide-y divide-line">
          {blockedSlots.map((b) => (
            <div key={b.id} className="flex items-center justify-between py-3 text-sm">
              <span>{b.date} · {b.startTime}–{b.endTime}{b.reason ? ` — ${b.reason}` : ""}</span>
              <button onClick={() => removeBlockedSlot(b.id)} className="flex items-center gap-1 text-xs text-red-500 hover:underline">
                <Trash2 size={12} /> Remove
              </button>
            </div>
          ))}
          {blockedSlots.length === 0 && <p className="py-4 text-center text-muted">No clinic-wide blocked slots.</p>}
        </div>
      </div>
    </div>
  );
}
