"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

type Testimonial = { id: string; name: string; rating: number; quote: string };

const PER_VIEW_MAX = 3;
const SLIDE_MS = 1400;
const INTERVAL_MS = 5000;

/**
 * Shows three reviews at a time (two on tablets, one on phones) and glides slowly to the
 * next one on a timer; the arrows step either way. The first few cards are cloned onto the
 * end so the loop wraps seamlessly instead of rewinding.
 */
export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const count = testimonials.length;
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);

  const slides = count > 1 ? [...testimonials, ...testimonials.slice(0, PER_VIEW_MAX)] : testimonials;

  const next = useCallback(() => {
    setAnimate(true);
    setIndex((i) => Math.min(i + 1, count));
  }, [count]);

  const prev = useCallback(() => {
    if (index === 0) {
      // Jump (unanimated) to the matching clone at the end, then slide back one.
      setAnimate(false);
      setIndex(count);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setAnimate(true);
          setIndex(count - 1);
        })
      );
      return;
    }
    setAnimate(true);
    setIndex((i) => i - 1);
  }, [index, count]);

  // Landing on the clone of the first card: snap back to the real one without animating.
  useEffect(() => {
    if (index !== count || count <= 1) return;
    const t = setTimeout(() => {
      setAnimate(false);
      setIndex(0);
    }, SLIDE_MS);
    return () => clearTimeout(t);
  }, [index, count]);

  useEffect(() => {
    if (count <= 1 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(next, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [count, paused, next]);

  if (count === 0) {
    return <p className="text-muted">No reviews yet — be the first to share your experience.</p>;
  }

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="-mx-3 overflow-hidden">
        <div
          className="flex [--card:100%] md:[--card:50%] lg:[--card:33.3333%]"
          style={{
            transform: `translateX(calc(${-index} * var(--card)))`,
            transition: animate ? `transform ${SLIDE_MS}ms cubic-bezier(0.65, 0, 0.35, 1)` : "none",
          }}
        >
          {slides.map((t, i) => (
            <div key={`${t.id}-${i}`} className="shrink-0 basis-[var(--card)] px-3" aria-hidden={i >= count}>
              <div className="card-lux flex h-full flex-col p-8">
                <div className="flex gap-1 text-gold">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="mt-5 flex-1 font-display text-xl italic leading-relaxed text-ink">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-muted">— {t.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-10 flex items-center gap-3">
          <button
            onClick={prev}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bg"
            aria-label="Previous review"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bg"
            aria-label="Next review"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
