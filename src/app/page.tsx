import Image from "next/image";
import Link from "next/link";
import { Quote, Droplet, Hand, Eye, PenTool } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toUtcDate, formatPrice } from "@/lib/utils";
import { Hero } from "@/components/Hero";
import { Sparkle, SparkleField } from "@/components/Sparkles";
import { ScrollReveal } from "@/components/ScrollReveal";

export const revalidate = 60;

const CATEGORY_INFO: Record<string, { image: string; blurb: string }> = {
  Facials: { image: "/images/categories/facial.jpg", blurb: "Glow starts with healthy skin." },
  Nails: { image: "/images/categories/nails.jpg", blurb: "Beauty at your fingertips." },
  Lashes: { image: "/images/categories/lashes.jpg", blurb: "Lift your natural beauty." },
  Tattoo: { image: "/images/categories/tattoo.jpg", blurb: "Art that stays with you." },
};
const CATEGORY_ORDER = ["Facials", "Nails", "Lashes", "Tattoo"];
const CATEGORY_ICON: Record<string, typeof Droplet> = {
  Facials: Droplet,
  Nails: Hand,
  Lashes: Eye,
  Tattoo: PenTool,
};

export default async function HomePage() {
  const todayIso = new Date().toISOString().slice(0, 10);

  const [services, featuredOffer, beforeAfterImage] = await Promise.all([
    prisma.service.findMany({ where: { isActive: true }, orderBy: { displayOrder: "asc" } }),
    prisma.offer.findFirst({
      where: { isActive: true, OR: [{ validUntil: null }, { validUntil: { gte: toUtcDate(todayIso) } }] },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.galleryImage.findFirst({ where: { isActive: true, isBeforeAfter: true }, orderBy: { displayOrder: "asc" } }),
  ]);

  const categories = CATEGORY_ORDER.filter((c) => services.some((s) => s.category === c));
  const byCategory = categories.map((c) => ({
    category: c,
    items: services.filter((s) => s.category === c),
  }));

  return (
    <>
      <Hero />

      {/* Choose Your Ritual */}
      <section id="choose-your-ritual" className="bg-surface py-24">
        <div className="container-lux">
          <ScrollReveal className="mx-auto max-w-xl text-center">
            <span className="eyebrow">Our Categories</span>
            <h2 className="mt-3 text-4xl uppercase text-ink md:text-5xl">Choose Your Ritual</h2>
          </ScrollReveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c, i) => (
              <ScrollReveal key={c} delay={i * 0.08}>
                <Link
                  href={`/services?category=${encodeURIComponent(c)}`}
                  className="group relative block h-80 overflow-hidden rounded-xl3 shadow-soft"
                >
                  <Image src={CATEGORY_INFO[c].image} alt={c} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <h3 className="text-2xl uppercase">{c}</h3>
                    <p className="mt-1 text-xs text-white/80">{CATEGORY_INFO[c].blurb}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.15em] text-brand-light">
                      Discover →
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* The Glow Menu */}
      <section className="relative overflow-hidden bg-bg-soft py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgb(var(--color-ink)) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="container-lux relative">
          <ScrollReveal className="mx-auto max-w-xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-gold-dark">Pricing</span>
            <h2 className="mt-3 font-display text-4xl uppercase text-ink md:text-5xl">The Glow Menu</h2>
            <div className="mx-auto mt-5 h-px w-16 bg-gold" />
            <p className="mx-auto mt-5 text-sm text-muted">A taste of what's waiting for you — full details on every treatment's own page.</p>
          </ScrollReveal>

          <div className="mt-16 grid gap-x-16 gap-y-14 md:grid-cols-2">
            {byCategory.map(({ category, items }) => {
              const Icon = CATEGORY_ICON[category] ?? Droplet;
              return (
                <ScrollReveal key={category}>
                  <div>
                    <div className="flex items-center gap-3 border-b border-gold/40 pb-4">
                      <Icon size={18} strokeWidth={1.5} className="text-gold-dark" />
                      <h3 className="font-display text-2xl uppercase tracking-wide text-ink">{category}</h3>
                    </div>
                    <ul className="mt-5 space-y-4">
                      {items.slice(0, 6).map((s) => (
                        <li key={s.id} className="flex items-baseline gap-3 text-sm">
                          <span className="text-muted">{s.title}</span>
                          <span
                            className="h-px flex-1 translate-y-[-3px]"
                            style={{
                              backgroundImage:
                                "repeating-linear-gradient(to right, rgb(var(--color-line)) 0, rgb(var(--color-line)) 2px, transparent 2px, transparent 6px)",
                            }}
                          />
                          <span className="font-display text-base text-gold-dark">{s.price ? formatPrice(Number(s.price)) : "—"}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/services?category=${encodeURIComponent(category)}`}
                      className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-gold-dark transition-colors hover:text-brand-dark"
                    >
                      View Full Menu →
                    </Link>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {featuredOffer && (
            <ScrollReveal className="mt-16">
              <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-xl3 border border-gold/40 bg-surface px-8 py-10 text-center shadow-soft md:flex-row md:justify-between md:text-left">
                <SparkleField />
                <div className="relative">
                  <span className="text-xs font-semibold uppercase tracking-[0.35em] text-gold-dark">Special Offer</span>
                  <h3 className="mt-3 font-display text-2xl uppercase leading-tight text-ink md:text-3xl">{featuredOffer.title}</h3>
                  <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted md:mx-0">{featuredOffer.description}</p>
                </div>
                <div className="relative flex flex-col items-center gap-4 md:items-end">
                  <div className="flex items-baseline gap-3">
                    {featuredOffer.promoPrice !== null && <span className="font-display text-3xl text-gold-dark">{formatPrice(Number(featuredOffer.promoPrice))}</span>}
                    {featuredOffer.originalPrice !== null && <span className="text-base text-muted line-through">{formatPrice(Number(featuredOffer.originalPrice))}</span>}
                  </div>
                  <Link href="/book" className="btn-primary w-fit">Book Now</Link>
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* The Glow Story */}
      <section className="bg-surface py-24">
        <div className="container-lux grid items-center gap-14 lg:grid-cols-2">
          <ScrollReveal className="relative h-[460px] overflow-hidden rounded-xl3 shadow-soft">
            <Image
              src="/images/clinic.jpg"
              alt="Glow Vie treatment room"
              fill
              className="object-cover"
            />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <span className="eyebrow flex items-center gap-2"><Sparkle size={14} /> Our Story</span>
            <h2 className="mt-3 text-4xl uppercase leading-tight text-ink md:text-5xl">The Glow Story</h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
              At Glow Vie, we believe beauty is more than skin deep. It's an experience, a
              ritual, a moment of self-care. Our mission is to enhance your natural glow with
              expert care and treatments tailored just for you.
            </p>
            <Link href="/about" className="btn-outline mt-7 inline-flex">Learn More</Link>

            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5">
              {[
                { title: "Personalized", desc: "Just for you." },
                { title: "Intentional", desc: "Every detail matters." },
                { title: "Elegant", desc: "Luxury in every visit." },
                { title: "Confident", desc: "Because you deserve it." },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-2.5">
                  <Sparkle size={14} className="mt-0.5 shrink-0 text-brand-dark" />
                  <div>
                    <p className="text-sm font-medium text-ink">{f.title}</p>
                    <p className="text-xs text-muted">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Quick-links strip */}
      <section className="bg-bg-soft py-16">
        <div className="container-lux grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickTile
            href="/gallery"
            label="Before & After"
            desc="Real results, real glow."
            cta="Explore"
            image={beforeAfterImage?.afterUrl || "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1200"}
          />
          <QuickTile href="/testimonials" label="Testimonials" desc="What our clients say about us." cta="Read More" icon />
          <QuickTile
            href="/book"
            label="Book Appointment"
            desc="Your glow starts here."
            cta="Book Now"
            image="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1200"
          />
          <QuickTile
            href="/contact"
            label="Visit Us"
            desc="We can't wait to pamper you."
            cta="Get Directions"
            image="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200"
          />
        </div>
      </section>

      {/* Ready to Glow CTA */}
      <section className="relative overflow-hidden bg-brand-light py-20 text-center">
        <SparkleField />
        <div className="container-lux relative">
          <h2 className="text-4xl uppercase text-ink md:text-5xl">Ready to Glow?</h2>
          <p className="mx-auto mt-3 max-w-md text-muted">Book your appointment and let us take care of the rest.</p>
          <Link href="/book" className="btn-primary mt-8 inline-flex">Book Your Appointment →</Link>
        </div>
      </section>
    </>
  );
}

function QuickTile({
  href,
  label,
  desc,
  cta,
  image,
  icon,
}: {
  href: string;
  label: string;
  desc: string;
  cta: string;
  image?: string;
  icon?: boolean;
}) {
  return (
    <ScrollReveal>
      <Link href={href} className="group relative block h-56 overflow-hidden rounded-xl2 shadow-soft">
        {icon ? (
          <div className="flex h-full w-full flex-col items-center justify-center bg-brand-light">
            <Quote size={32} className="text-brand-dark" />
          </div>
        ) : (
          <>
            <Image src={image!} alt={label} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
          </>
        )}
        <div className={`absolute inset-x-0 bottom-0 p-5 ${icon ? "text-ink" : "text-white"}`}>
          <h3 className="text-sm font-semibold uppercase tracking-wide">{label}</h3>
          <p className={`mt-1 text-xs ${icon ? "text-muted" : "text-white/80"}`}>{desc}</p>
          <span className="mt-2 inline-block text-xs font-medium uppercase tracking-[0.15em] text-brand-dark">{cta} →</span>
        </div>
      </Link>
    </ScrollReveal>
  );
}
