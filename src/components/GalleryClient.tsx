"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { classNames } from "@/lib/utils";
import { PageHeader } from "@/components/PageHeader";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Resting depth (px) for each photo, cycled — gives the grid its layered, 3D-room feel.
const DEPTHS = [40, -30, 70, 0, -50, 30, 60, -20];

type GalleryItem = {
  id: string;
  category: string;
  title: string;
  imageUrl: string;
  beforeUrl: string;
  afterUrl: string;
  isBeforeAfter: boolean;
};

const categories = ["All", "Clinic", "Skin", "Nails", "Brows", "Lashes", "Treatments"];

export function GalleryClient() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);

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

  // The photo wall tilts in 3D: with the mouse (left/right, up/down) and as it scrolls past.
  useEffect(() => {
    const stage = stageRef.current;
    const wall = wallRef.current;
    if (!stage || !wall || loading) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wall,
        { rotationX: 10 },
        { rotationX: -6, ease: "none", scrollTrigger: { trigger: stage, start: "top bottom", end: "bottom top", scrub: true } }
      );
    });

    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return () => ctx.revert();

    const ryTo = gsap.quickTo(wall, "rotationY", { duration: 1, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      ryTo(((e.clientX - rect.left) / rect.width - 0.5) * 12);
    };
    const onLeave = () => ryTo(0);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      ctx.revert();
    };
  }, [loading]);

  const active = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <>
      <PageHeader
        eyebrow="Our Work"
        title="The"
        accent="Gallery"
        description="A look inside Glow Vie — our space, and real results from our treatments."
      />

      <section className="py-20">
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
            <div ref={stageRef} className="px-2 py-6" style={{ perspective: "1600px" }}>
              <div
                ref={wallRef}
                className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-8 lg:grid-cols-4 lg:gap-10"
                style={{ transformStyle: "preserve-3d" }}
              >
                {filtered.map((item, i) => (
                  <button
                    key={item.id}
                    onClick={() => setLightboxIndex(i)}
                    className="gallery-depth group relative aspect-square overflow-hidden rounded-[1.5rem] shadow-soft"
                    style={{ "--z": `${DEPTHS[i % DEPTHS.length]}px` } as React.CSSProperties}
                  >
                    {item.isBeforeAfter ? (
                      <BeforeAfterSlider
                        mode="follow"
                        before={item.beforeUrl}
                        after={item.afterUrl}
                        alt={item.title || item.category}
                        className="h-full w-full"
                      />
                    ) : (
                      <img src={item.imageUrl} alt={item.title || item.category} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    )}
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/60 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="text-xs font-medium text-white">{item.title || item.category}</span>
                    </div>
                  </button>
                ))}
              </div>
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
              <>
                <BeforeAfterSlider
                  before={active.beforeUrl}
                  after={active.afterUrl}
                  alt={active.title || active.category}
                  className="aspect-[4/5] h-[min(75vh,118vw)] max-w-[88vw] rounded-[1.5rem]"
                />
                <p className="mt-3 text-center text-xs uppercase tracking-[0.2em] text-white/70">Drag to compare</p>
              </>
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
