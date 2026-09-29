"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

type GalleryItem = {
  id: string;
  category: string;
  title: string;
  imageUrl: string;
  beforeUrl: string;
  afterUrl: string;
  isBeforeAfter: boolean;
  consentConfirmed: boolean;
  isActive: boolean;
  displayOrder: number;
};

const categories = ["Clinic", "Skin", "Nails", "Brows", "Lashes", "Treatments"];

const emptyForm = {
  category: "Clinic", title: "", imageUrl: "", beforeUrl: "", afterUrl: "",
  isBeforeAfter: false, consentConfirmed: false, isActive: true, displayOrder: 0,
};

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const res = await fetch("/api/gallery?all=1");
    setItems(await res.json());
  }
  useEffect(() => {
    load();
  }, []);

  function startCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }
  function startEdit(g: GalleryItem) {
    setForm({
      category: g.category, title: g.title, imageUrl: g.imageUrl, beforeUrl: g.beforeUrl, afterUrl: g.afterUrl,
      isBeforeAfter: g.isBeforeAfter, consentConfirmed: g.consentConfirmed, isActive: g.isActive, displayOrder: g.displayOrder,
    });
    setEditingId(g.id);
    setShowForm(true);
  }

  async function submit() {
    if (form.isActive && !form.consentConfirmed) {
      alert("Please confirm you have permission to publish this image before making it active.");
      return;
    }
    if (editingId) {
      await fetch(`/api/gallery/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setShowForm(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this gallery image?")) return;
    await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-ink">Gallery</h1>
        <button onClick={startCreate} className="btn-primary !py-2 text-sm"><Plus size={16} /> Add Image</button>
      </div>

      {showForm && (
        <div className="mt-6 card-lux p-6">
          <h2 className="text-lg text-ink">{editingId ? "Edit Image" : "New Image"}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-full border border-line px-4 py-2 text-sm">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input placeholder="Title (optional)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-full border border-line px-4 py-2 text-sm" />
            <label className="flex items-center gap-2 text-sm text-muted sm:col-span-2">
              <input type="checkbox" checked={form.isBeforeAfter} onChange={(e) => setForm({ ...form, isBeforeAfter: e.target.checked })} /> This is a Before &amp; After pair
            </label>

            {form.isBeforeAfter ? (
              <>
                <input placeholder="Before Image URL" value={form.beforeUrl} onChange={(e) => setForm({ ...form, beforeUrl: e.target.value })} className="rounded-full border border-line px-4 py-2 text-sm" />
                <input placeholder="After Image URL" value={form.afterUrl} onChange={(e) => setForm({ ...form, afterUrl: e.target.value })} className="rounded-full border border-line px-4 py-2 text-sm" />
              </>
            ) : (
              <input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="sm:col-span-2 rounded-full border border-line px-4 py-2 text-sm" />
            )}

            <label className="flex items-center gap-2 text-sm text-muted sm:col-span-2">
              <input type="checkbox" checked={form.consentConfirmed} onChange={(e) => setForm({ ...form, consentConfirmed: e.target.checked })} />
              I confirm I have permission to publish this photo
            </label>
            <label className="flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active
            </label>
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={submit} className="btn-primary !py-2 text-sm">Save Image</button>
            <button onClick={() => setShowForm(false)} className="btn-outline !py-2 text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((g) => (
          <div key={g.id} className="card-lux overflow-hidden">
            <div className="relative h-36 w-full bg-bg-soft">
              {g.isBeforeAfter ? (
                <div className="grid h-full grid-cols-2">
                  {g.beforeUrl && <img src={g.beforeUrl} alt="Before" className="h-full w-full object-cover" />}
                  {g.afterUrl && <img src={g.afterUrl} alt="After" className="h-full w-full object-cover" />}
                </div>
              ) : (
                g.imageUrl && <img src={g.imageUrl} alt={g.title} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="p-4">
              <p className="text-xs font-medium text-ink">{g.category}</p>
              <p className="mt-0.5 line-clamp-1 text-xs text-muted">{g.title || "Untitled"}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {!g.isActive && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">Hidden</span>}
                {!g.consentConfirmed && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] text-amber-700">No consent on file</span>}
              </div>
              <div className="mt-3 flex gap-3 border-t border-line pt-3">
                <button onClick={() => startEdit(g)} className="flex items-center gap-1 text-xs text-brand-dark hover:underline"><Pencil size={13} /> Edit</button>
                <button onClick={() => remove(g.id)} className="flex items-center gap-1 text-xs text-red-500 hover:underline"><Trash2 size={13} /> Delete</button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-muted">No gallery images yet.</p>}
      </div>
    </div>
  );
}
