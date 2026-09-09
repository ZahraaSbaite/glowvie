"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ArrowRight, Clock } from "lucide-react";
import { ServiceDTO } from "@/types";
import { formatDuration, formatPrice } from "@/lib/utils";
import { getCategoryIcon } from "@/lib/categoryStyle";

export type CategoryGroup = {
  category: string;
  tagline: string;
  description: string;
  items: ServiceDTO[];
};

export function ServiceCategoryList({ groups }: { groups: CategoryGroup[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const open = openIndex !== null;
  const active = open ? groups[openIndex] : null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-5">
        {groups.map((g, i) => (
          <div
            key={g.category}
            className="flex items-center gap-5 rounded-xl3 border border-line bg-surface px-6 py-6 transition-colors hover:border-gold/50 sm:gap-6 sm:px-8"
          >
            <span className="font-display text-4xl text-gold/50 sm:text-5xl">{String(i + 1).padStart(2, "0")}</span>
            <span className="hidden h-12 w-px bg-line sm:block" />
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-2xl text-ink sm:text-3xl">{g.category}</h3>
              <p className="mt-1 text-sm italic text-muted">&ldquo;{g.tagline}&rdquo;</p>
            </div>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`View ${g.category} treatments`}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold-dark transition-all duration-300 hover:bg-gold hover:text-white"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-ink/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpenIndex(null)}
        aria-hidden="true"
      />

      {/* Slide-in detail panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto bg-surface shadow-2xl transition-transform duration-500 ease-out sm:max-w-lg ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        {active && (
          <div className="px-8 py-10 sm:px-10">
            <div className="flex items-center gap-4">
              <span className="font-display text-3xl text-gold-dark">{String((openIndex ?? 0) + 1).padStart(2, "0")}</span>
              <span className="h-px flex-1 bg-line" />
              <button
                type="button"
                onClick={() => setOpenIndex(null)}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-gold hover:text-gold-dark"
              >
                <X size={16} />
              </button>
            </div>

            <span className="mt-8 block text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">{active.tagline}</span>
            <h2 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">{active.category}</h2>
            <p className="mt-5 text-base leading-relaxed text-muted">{active.description}</p>

            <div className="mt-8 h-px w-16 bg-gold" />

            <ul className="mt-8 space-y-4">
              {active.items.map((s) => {
                const Icon = getCategoryIcon(s.category);
                return (
                  <li
                    key={s.id}
                    className="flex items-start gap-4 rounded-xl2 border border-line p-4 transition-colors hover:border-gold/50"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold-dark">
                      <Icon size={16} strokeWidth={1.5} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <Link href={`/services/${s.slug}`} className="font-display text-lg text-ink hover:text-brand-dark">
                          {s.title}
                        </Link>
                        {s.price !== null && <span className="shrink-0 text-sm font-medium text-gold-dark">{formatPrice(s.price)}</span>}
                      </div>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                        <Clock size={12} /> {formatDuration(s.durationMins)}
                      </p>
                      <Link
                        href={`/book?service=${s.slug}`}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.15em] text-brand-dark hover:text-brand"
                      >
                        Book Now →
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
