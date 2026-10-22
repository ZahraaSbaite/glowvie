"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { faqs, faqCategories } from "@/lib/faqs";
import { classNames } from "@/lib/utils";
import { PageHeader } from "@/components/PageHeader";

export function FAQClient() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter((f) => {
      const matchesCategory = activeCategory === "All" || f.category === activeCategory;
      const matchesQuery = !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  return (
    <>
      <PageHeader eyebrow="Support" title="Frequently asked" accent="questions">
        <div className="mt-8 flex w-full max-w-md items-center gap-2 rounded-full border border-line bg-surface px-5 py-3.5 shadow-soft">
          <Search size={16} className="text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions…"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </PageHeader>

      <section className="py-20">
        <div className="container-lux">
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            {["All", ...faqCategories].map((c) => (
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

          {filtered.length === 0 ? (
            <p className="text-center text-muted">No questions match your search.</p>
          ) : (
            <FAQAccordion items={filtered} />
          )}
        </div>
      </section>
    </>
  );
}
