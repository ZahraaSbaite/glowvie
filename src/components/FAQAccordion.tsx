"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export type FAQItem = { question: string; answer: string };

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="py-5">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-lg text-ink">{item.question}</span>
              <Plus
                size={20}
                className={`shrink-0 text-brand-dark transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
              />
            </button>
            <div
              className={`grid overflow-hidden transition-all duration-300 ease-out ${
                isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <p className="overflow-hidden text-sm leading-relaxed text-muted">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
