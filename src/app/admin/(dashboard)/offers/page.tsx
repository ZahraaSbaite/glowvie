"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Offer = {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  originalPrice: number | null;
  promoPrice: number | null;
  validUntil: string | null;
  isActive: boolean;
  displayOrder: number;
};

const categories = ["Promotion", "Seasonal", "Package", "New Client"];

const emptyForm = {
  title: "", description: "", category: "Promotion", imageUrl: "",
  originalPrice: "", promoPrice: "", validUntil: "", isActive: true, displayOrder: 0,
};

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const res = await fetch("/api/offers?all=1");
    setOffers(await res.json());
  }
  useEffect(() => {
    load();
  }, []);

  function startCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }
  function startEdit(o: Offer) {
    setForm({
      title: o.title, description: o.description, category: o.category, imageUrl: o.imageUrl,
      originalPrice: o.originalPrice?.toString() || "", promoPrice: o.promoPrice?.toString() || "",
      validUntil: o.validUntil || "", isActive: o.isActive, displayOrder: o.displayOrder,
    });
    setEditingId(o.id);
    setShowForm(true);
  }

  async function submit() {
    const payload = {
      ...form,
      originalPrice: form.originalPrice || null,
      promoPrice: form.promoPrice || null,
      validUntil: form.validUntil || null,
    };
    if (editingId) {
      await fetch(`/api/offers/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setShowForm(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this offer?")) return;
    await fetch(`/api/offers/${id}`, { method: "DELETE" });
    load();
  }

  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-ink">Offers</h1>
        <button onClick={startCreate} className="btn-primary !py-2 text-sm"><Plus size={16} /> Add Offer</button>
      </div>

      {showForm && (
        <div className="mt-6 card-lux p-6">
          <h2 className="text-lg text-ink">{editingId ? "Edit Offer" : "New Offer"}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-full border border-line px-4 py-2 text-sm" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-full border border-line px-4 py-2 text-sm">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="sm:col-span-2 rounded-full border border-line px-4 py-2 text-sm" />
            <input type="number" placeholder="Original Price (optional)" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} className="rounded-full border border-line px-4 py-2 text-sm" />
            <input type="number" placeholder="Promo Price (optional)" value={form.promoPrice} onChange={(e) => setForm({ ...form, promoPrice: e.target.value })} className="rounded-full border border-line px-4 py-2 text-sm" />
            <label className="flex items-center gap-2 text-sm text-muted">
              Valid Until
              <input type="date" value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} className="rounded-full border border-line px-3 py-1.5 text-sm" />
            </label>
            <label className="flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active
            </label>
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="sm:col-span-2 rounded-xl2 border border-line px-4 py-2 text-sm" rows={2} />
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={submit} className="btn-primary !py-2 text-sm">Save Offer</button>
            <button onClick={() => setShowForm(false)} className="btn-outline !py-2 text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((o) => {
          const expired = o.validUntil !== null && o.validUntil < todayIso;
          return (
            <div key={o.id} className="card-lux p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-ink">{o.title}</p>
                  <p className="text-xs text-muted">
                    {o.category}
                    {o.promoPrice !== null && ` · ${formatPrice(o.promoPrice)}`}
                    {o.originalPrice !== null && <span className="line-through"> {formatPrice(o.originalPrice)}</span>}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {!o.isActive && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">Hidden</span>}
                  {expired && <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] text-red-500">Expired</span>}
                </div>
              </div>
              <p className="mt-2 line-clamp-2 text-xs text-muted">{o.description}</p>
              {o.validUntil && <p className="mt-1 text-[11px] text-muted">Valid until {o.validUntil}</p>}
              <div className="mt-4 flex gap-3 border-t border-line pt-3">
                <button onClick={() => startEdit(o)} className="flex items-center gap-1 text-xs text-brand-dark hover:underline"><Pencil size={13} /> Edit</button>
                <button onClick={() => remove(o.id)} className="flex items-center gap-1 text-xs text-red-500 hover:underline"><Trash2 size={13} /> Delete</button>
              </div>
            </div>
          );
        })}
        {offers.length === 0 && <p className="text-muted">No offers yet.</p>}
      </div>
    </div>
  );
}
