"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Star } from "lucide-react";

type Testimonial = { id: string; name: string; rating: number; quote: string; isActive: boolean };

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState("");

  async function load() {
    const res = await fetch("/api/testimonials");
    setItems(await res.json());
  }
  useEffect(() => {
    load();
  }, []);

  async function add() {
    if (!name || !quote) return;
    await fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, rating, quote }),
    });
    setName("");
    setQuote("");
    load();
  }

  async function toggleActive(t: Testimonial) {
    await fetch(`/api/testimonials/${t.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !t.isActive }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="text-3xl text-ink">Testimonials</h1>

      <div className="mt-6 card-lux space-y-3 p-5">
        <div className="flex flex-wrap gap-3">
          <input placeholder="Client name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-full border border-line px-4 py-2 text-sm" />
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="rounded-full border border-line px-4 py-2 text-sm">
            {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} stars</option>)}
          </select>
        </div>
        <textarea placeholder="Testimonial quote" value={quote} onChange={(e) => setQuote(e.target.value)} rows={2} className="w-full rounded-xl2 border border-line px-4 py-2 text-sm" />
        <button onClick={add} className="btn-primary !py-2 text-sm"><Plus size={16} /> Add Testimonial</button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {items.map((t) => (
          <div key={t.id} className="card-lux p-5">
            <div className="flex gap-1 text-brand">
              {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}
            </div>
            <p className="mt-2 text-sm italic text-ink">"{t.quote}"</p>
            <p className="mt-2 text-xs text-muted">— {t.name}</p>
            <div className="mt-3 flex gap-3 border-t border-line pt-3 text-xs">
              <button onClick={() => toggleActive(t)} className="text-brand-dark hover:underline">
                {t.isActive ? "Hide from site" : "Show on site"}
              </button>
              <button onClick={() => remove(t.id)} className="flex items-center gap-1 text-red-500 hover:underline"><Trash2 size={12} /> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
