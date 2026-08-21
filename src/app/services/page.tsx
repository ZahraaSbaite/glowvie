import { prisma } from "@/lib/prisma";
import { ServiceCard } from "@/components/ServiceCard";
import { Sparkle } from "@/components/Sparkles";

export const metadata = { title: "Services — Glow Vie Beauty Clinic" };
export const revalidate = 60;

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });

  const categories = Array.from(new Set(services.map((s) => s.category)));
  const activeCategory = searchParams.category;
  const filtered = activeCategory ? services.filter((s) => s.category === activeCategory) : services;

  return (
    <>
      <section className="bg-bg-soft py-20 text-center">
        <span className="eyebrow flex items-center justify-center gap-2"><Sparkle size={14} /> Treatments</span>
        <h1 className="mt-3 text-5xl text-ink md:text-6xl">Our Services</h1>
        <p className="mx-auto mt-4 max-w-lg text-muted">
          From facials to nails, lashes, and semi-permanent makeup — every treatment is tailored to you.
        </p>
      </section>

      <section className="bg-surface py-20">
        <div className="container-lux">
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            <a
              href="/services"
              className={`rounded-full border px-5 py-2 text-sm transition-colors ${
                !activeCategory ? "border-brand bg-brand text-white" : "border-line text-muted hover:border-brand"
              }`}
            >
              All
            </a>
            {categories.map((c) => (
              <a
                key={c}
                href={`/services?category=${encodeURIComponent(c)}`}
                className={`rounded-full border px-5 py-2 text-sm transition-colors ${
                  activeCategory === c ? "border-brand bg-brand text-white" : "border-line text-muted hover:border-brand"
                }`}
              >
                {c}
              </a>
            ))}
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <ServiceCard key={s.id} service={{ ...s, price: s.price ? Number(s.price) : null }} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
