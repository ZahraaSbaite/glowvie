import { prisma } from "@/lib/prisma";
import { toUtcDate, formatPrice } from "@/lib/utils";
import { Sparkle } from "@/components/Sparkles";
import Link from "next/link";

export const metadata = { title: "Offers — Glow Vie Beauty Clinic" };
export const revalidate = 60;

export default async function OffersPage() {
  const todayIso = new Date().toISOString().slice(0, 10);
  const offers = await prisma.offer.findMany({
    where: { isActive: true, OR: [{ validUntil: null }, { validUntil: { gte: toUtcDate(todayIso) } }] },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <>
      <section className="bg-bg-soft py-20 text-center">
        <span className="eyebrow flex items-center justify-center gap-2"><Sparkle size={14} /> Special Offers</span>
        <h1 className="mt-3 text-5xl text-ink md:text-6xl">Current Offers</h1>
        <p className="mx-auto mt-4 max-w-lg text-muted">Seasonal promotions, treatment packages, and new-client offers — book while they last.</p>
      </section>

      <section className="bg-surface py-20">
        <div className="container-lux">
          {offers.length === 0 ? (
            <p className="text-center text-muted">No active offers right now — check back soon.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {offers.map((o) => (
                <div key={o.id} className="card-lux group flex flex-col overflow-hidden hover:-translate-y-1 hover:shadow-card">
                  {o.imageUrl && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <img src={o.imageUrl} alt={o.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <span className="absolute left-4 top-4 rounded-full bg-surface/90 px-3 py-1 text-xs font-medium text-brand-dark backdrop-blur">
                        {o.category}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    {!o.imageUrl && (
                      <span className="mb-2 inline-block w-fit rounded-full bg-bg-soft px-3 py-1 text-xs font-medium text-brand-dark">{o.category}</span>
                    )}
                    <h3 className="text-xl text-ink">{o.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{o.description}</p>

                    <div className="mt-4 flex items-center gap-3">
                      {o.promoPrice !== null && <span className="text-xl font-medium text-brand-dark">{formatPrice(Number(o.promoPrice))}</span>}
                      {o.originalPrice !== null && <span className="text-sm text-muted line-through">{formatPrice(Number(o.originalPrice))}</span>}
                    </div>
                    {o.validUntil && (
                      <p className="mt-1 text-xs text-muted">Valid until {new Date(o.validUntil).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                    )}

                    <Link href="/book" className="btn-primary mt-5 w-full">Book Now</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
