"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

type Testimonial = { id: string; name: string; rating: number; quote: string; imageUrl: string };

export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (testimonials.length === 0) {
    return <p className="text-center text-muted">No testimonials yet.</p>;
  }

  const t = testimonials[index];

  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="flex justify-center gap-1 text-brand">
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star key={i} size={18} fill="currentColor" strokeWidth={0} />
        ))}
      </div>
      <p className="mt-6 text-2xl italic leading-relaxed text-ink font-display">"{t.quote}"</p>
      <p className="mt-5 text-sm font-medium uppercase tracking-wider text-muted">— {t.name}</p>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-brand text-brand-dark transition-colors hover:bg-brand hover:text-white"
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full transition-all ${i === index ? "w-6 bg-brand-dark" : "bg-line"}`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-brand text-brand-dark transition-colors hover:bg-brand hover:text-white"
          aria-label="Next testimonial"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
