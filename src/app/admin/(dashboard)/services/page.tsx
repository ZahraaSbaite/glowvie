"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Service = {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  procedure: string;
  recoveryTime: string;
  prepInfo: string;
  importantNotes: string;
  durationMins: number;
  price: number | null;
  imageUrl: string;
  featured: boolean;
  displayOrder: number;
};

const emptyForm = {
  title: "", slug: "", category: "", shortDesc: "", fullDesc: "", procedure: "", recoveryTime: "",
  prepInfo: "", importantNotes: "", durationMins: 60, price: "", imageUrl: "", featured: false, displayOrder: 0,
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const res = await fetch("/api/services");
    setServices(await res.json());
  }
  useEffect(() => {
    load();
  }, []);

  function startCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }
  function startEdit(s: Service) {
    setForm({
      title: s.title, slug: s.slug, category: s.category, shortDesc: s.shortDesc,
      fullDesc: s.fullDesc, procedure: s.procedure, recoveryTime: s.recoveryTime,
      prepInfo: s.prepInfo, importantNotes: s.importantNotes,
      durationMins: s.durationMins, price: s.price?.toString() || "", imageUrl: s.imageUrl,
      featured: s.featured, displayOrder: s.displayOrder,
    });
    setEditingId(s.id);
    setShowForm(true);
  }

  async function submit() {
    const payload = { ...form, price: form.price || null };
    if (editingId) {
      await fetch(`/api/services/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setShowForm(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Remove this service? It will be hidden from the site but past bookings are preserved.")) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-ink">Services</h1>
        <button onClick={startCreate} className="btn-primary !py-2 text-sm"><Plus size={16} /> Add Service</button>
      </div>

      {showForm && (
        <div className="mt-6 card-lux p-6">
          <h2 className="text-lg text-ink">{editingId ? "Edit Service" : "New Service"}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-full border border-line px-4 py-2 text-sm" />
            <input placeholder="Slug (e.g. hydrafacial)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="rounded-full border border-line px-4 py-2 text-sm" />
            <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-full border border-line px-4 py-2 text-sm" />
            <input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="rounded-full border border-line px-4 py-2 text-sm" />
            <input type="number" placeholder="Duration (mins)" value={form.durationMins} onChange={(e) => setForm({ ...form, durationMins: Number(e.target.value) })} className="rounded-full border border-line px-4 py-2 text-sm" />
            <input type="number" placeholder="Price (optional)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="rounded-full border border-line px-4 py-2 text-sm" />
            <input type="number" placeholder="Display Order" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} className="rounded-full border border-line px-4 py-2 text-sm" />
            <label className="flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured on homepage
            </label>
            <textarea placeholder="Short description (shown on cards)" value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} className="sm:col-span-2 rounded-xl2 border border-line px-4 py-2 text-sm" rows={2} />
            <textarea placeholder="Full description (shown on the service page)" value={form.fullDesc} onChange={(e) => setForm({ ...form, fullDesc: e.target.value })} className="sm:col-span-2 rounded-xl2 border border-line px-4 py-2 text-sm" rows={3} />
            <textarea placeholder="Procedure — how the treatment is done" value={form.procedure} onChange={(e) => setForm({ ...form, procedure: e.target.value })} className="rounded-xl2 border border-line px-4 py-2 text-sm" rows={2} />
            <textarea placeholder="Preparation info — what to do beforehand" value={form.prepInfo} onChange={(e) => setForm({ ...form, prepInfo: e.target.value })} className="rounded-xl2 border border-line px-4 py-2 text-sm" rows={2} />
            <textarea placeholder="Aftercare / recovery" value={form.recoveryTime} onChange={(e) => setForm({ ...form, recoveryTime: e.target.value })} className="rounded-xl2 border border-line px-4 py-2 text-sm" rows={2} />
            <textarea placeholder="Important notes" value={form.importantNotes} onChange={(e) => setForm({ ...form, importantNotes: e.target.value })} className="rounded-xl2 border border-line px-4 py-2 text-sm" rows={2} />
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={submit} className="btn-primary !py-2 text-sm">Save Service</button>
            <button onClick={() => setShowForm(false)} className="btn-outline !py-2 text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div key={s.id} className="card-lux p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-ink">{s.title}</p>
                <p className="text-xs text-muted">{s.category} · {s.durationMins} min{s.price ? ` · ${formatPrice(s.price)}` : ""}</p>
              </div>
              {s.featured && <span className="rounded-full bg-brand-light px-2 py-0.5 text-[10px] text-brand-dark">Featured</span>}
            </div>
            <p className="mt-2 line-clamp-2 text-xs text-muted">{s.shortDesc}</p>
            <div className="mt-4 flex gap-3 border-t border-line pt-3">
              <button onClick={() => startEdit(s)} className="flex items-center gap-1 text-xs text-brand-dark hover:underline"><Pencil size={13} /> Edit</button>
              <button onClick={() => remove(s.id)} className="flex items-center gap-1 text-xs text-red-500 hover:underline"><Trash2 size={13} /> Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
