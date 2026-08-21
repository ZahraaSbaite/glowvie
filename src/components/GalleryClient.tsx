"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { classNames } from "@/lib/utils";
import { Sparkle } from "@/components/Sparkles";

type GalleryItem = {
  id: string;
  category: string;
  title: string;
  imageUrl: string;
  beforeUrl: string;
  afterUrl: string;
  isBeforeAfter: boolean;
};

const categories = ["All", "Clinic", "Skin", "Hair", "Nails", "Brows", "Lashes", "Treatments"];

export function GalleryClient() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => (activeCategory === "All" ? items : items.filter((i) => i.category === activeCategory)),
    [items, activeCategory]
  );

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showPrev = useCallback(() => setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length)), [filtered.length]);
  const showNext = useCallback(() => setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length)), [filtered.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, closeLightbox, showPrev, showNext]);

  const active = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <>
      <section className="bg-bg-soft py-20 text-center">
        <span className="eyebrow flex items-center justify-center gap-2"><Sparkle size={14} /> Our Work</span>
        <h1 className="mt-3 text-5xl text-ink md:text-6xl">Gallery</h1>
        <p className="mx-auto mt-4 max-w-lg text-muted">A look inside Glow Vie — our space, and real results from our treatments.</p>
      </section>

      <section className="bg-surface py-20">
        <div className="container-lux">
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={classNames(
                  "rounded-full border px-5 py-2 text-sm transition-colors",
                  activeCategory === c ? "border-brand bg-brand text-white" : "border-line text-muted hover:border-brand"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-center text-muted">Loading gallery…</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted">No images in this category yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => setLightboxIndex(i)}
                  className="group relative aspect-square overflow-hidden rounded-xl2"
                >
                  {item.isBeforeAfter ? (
                    <div className="grid h-full grid-cols-2">
                      <img src={item.beforeUrl} alt={`${item.title || item.category} before`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <img src={item.afterUrl} alt={`${item.title || item.category} after`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  ) : (
                    <img src={item.imageUrl} alt={item.title || item.category} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  )}
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/60 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="text-xs font-medium text-white">{item.title || item.category}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute right-5 top-5 text-white/80 hover:text-white" aria-label="Close">
            <X size={28} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); showPrev(); }} className="absolute left-4 text-white/70 hover:text-white" aria-label="Previous image">
            <ChevronLeft size={36} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); showNext(); }} className="absolute right-4 text-white/70 hover:text-white" aria-label="Next image">
            <ChevronRight size={36} />
          </button>

          <div className="max-h-[85vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            {active.isBeforeAfter ? (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <img src={active.beforeUrl} alt="Before" className="max-h-[75vh] w-full rounded-xl2 object-contain" />
                  <p className="mt-2 text-center text-xs uppercase tracking-wider text-white/70">Before</p>
                </div>
                <div>
                  <img src={active.afterUrl} alt="After" className="max-h-[75vh] w-full rounded-xl2 object-contain" />
                  <p className="mt-2 text-center text-xs uppercase tracking-wider text-white/70">After</p>
                </div>
              </div>
            ) : (
              <img src={active.imageUrl} alt={active.title || active.category} className="max-h-[85vh] rounded-xl2 object-contain" />
            )}
            {active.title && <p className="mt-3 text-center text-sm text-white/90">{active.title}</p>}
          </div>
        </div>
      )}
    </>
  );
}
