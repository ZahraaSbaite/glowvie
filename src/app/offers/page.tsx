import { prisma } from "@/lib/prisma";
import { toUtcDate, formatPrice } from "@/lib/utils";
import Link from "next/link";
import { RotateCw } from "lucide-react";
import { FlipCard } from "@/components/FlipCard";
import { PageHeader } from "@/components/PageHeader";

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
      <PageHeader
        eyebrow="Special Offers"
        title="Current"
        accent="Offers"
        description="Seasonal promotions, treatment packages, and new-client offers — book while they last."
      />

      <section className="py-20">
        <div className="container-lux">
          {offers.length === 0 ? (
            <p className="text-center text-muted">No active offers right now — check back soon.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {offers.map((o) => {
                const promo = o.promoPrice !== null ? formatPrice(Number(o.promoPrice)) : null;
                const original = o.originalPrice !== null ? formatPrice(Number(o.originalPrice)) : null;
                return (
                  <FlipCard
                    key={o.id}
                    label={`${o.title} — flip for details`}
                    className="h-[27rem]"
                    front={
                      <div className="card-lux flex h-full flex-col overflow-hidden">
                        <div className="relative h-56 w-full overflow-hidden" style={o.imageUrl ? undefined : { backgroundImage: "var(--glow-gradient)" }}>
                          {o.imageUrl && <img src={o.imageUrl} alt={o.title} className="h-full w-full object-cover" />}
                          <span className="absolute left-4 top-4 rounded-full bg-surface/90 px-3 py-1 text-xs font-medium text-brand-dark backdrop-blur">
                            {o.category}
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                          <h3 className="font-display text-2xl leading-tight text-ink">{o.title}</h3>
                          <div className="mt-3 flex items-baseline gap-3">
                            {promo && <span className="font-display text-3xl text-brand-dark">{promo}</span>}
                            {original && <span className="text-sm text-muted line-through">{original}</span>}
                          </div>
                          <span className="mt-auto inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted">
                            <RotateCw size={13} /> Flip for details
                          </span>
                        </div>
                      </div>
                    }
                    back={
                      <div className="section-dark flex h-full flex-col rounded-[1.75rem] p-8 shadow-soft">
                        <span className="eyebrow">{o.category}</span>
                        <h3 className="mt-4 font-display text-3xl leading-tight text-ink">{o.title}</h3>
                        <p className="mt-4 flex-1 overflow-y-auto text-sm leading-relaxed text-muted">{o.description}</p>
                        <div className="mt-4 flex items-baseline gap-3">
                          {promo && <span className="text-glow font-display text-3xl">{promo}</span>}
                          {original && <span className="text-sm text-muted line-through">{original}</span>}
                        </div>
                        {o.validUntil && (
                          <p className="mt-1 text-xs text-muted">
                            Valid until {new Date(o.validUntil).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                          </p>
                        )}
                        <Link href="/book" className="btn-primary mt-5 w-full">Book Now</Link>
                      </div>
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
