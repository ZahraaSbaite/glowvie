import Image from "next/image";
import Link from "next/link";
import { Quote, Droplet, Hand, Eye, PenTool } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toUtcDate, formatPrice } from "@/lib/utils";
import { Hero } from "@/components/Hero";
import { Sparkle, SparkleField } from "@/components/Sparkles";
import { ScrollReveal } from "@/components/ScrollReveal";
import { RitualCarousel } from "@/components/RitualCarousel";
import { Magnetic } from "@/components/Magnetic";
import { RotatingBadge } from "@/components/RotatingBadge";
import { ReviewForm } from "@/components/ReviewForm";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";

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

  const [services, featuredOffer, beforeAfterImage, testimonials] = await Promise.all([
    prisma.service.findMany({ where: { isActive: true }, orderBy: { displayOrder: "asc" } }),
    prisma.offer.findFirst({
      where: { isActive: true, OR: [{ validUntil: null }, { validUntil: { gte: toUtcDate(todayIso) } }] },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.galleryImage.findFirst({ where: { isActive: true, isBeforeAfter: true }, orderBy: { displayOrder: "asc" } }),
    prisma.testimonial.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } }),
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
      <section id="choose-your-ritual" className="section-rose mb-3 rounded-[2.5rem] py-24 md:mx-3 md:py-32">
        <div className="container-lux">
          <ScrollReveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="eyebrow">Our Categories</span>
              <h2 className="mt-5 text-5xl leading-[0.95] text-ink md:text-7xl">
                Choose your <em className="text-glow pr-2">ritual</em>
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              Four ways to glow — each one tailored to you, from the first consultation to the final touch.
            </p>
          </ScrollReveal>

          <ScrollReveal className="mt-10">
            <RitualCarousel
              items={categories.map((c) => ({
                category: c,
                image: CATEGORY_INFO[c].image,
                blurb: CATEGORY_INFO[c].blurb,
                href: `/services?category=${encodeURIComponent(c)}`,
              }))}
            />
          </ScrollReveal>
        </div>
      </section>

      {/* The Glow Menu */}
      <section className="section-dark relative overflow-hidden rounded-[2.5rem] py-24 md:mx-3 md:py-32">
        <SparkleField className="opacity-40" />
        <div className="container-lux relative">
          <ScrollReveal className="text-center">
            <span className="eyebrow">Pricing</span>
            <h2 className="mt-5 text-5xl leading-[0.95] text-ink md:text-7xl">
              The <em className="text-glow pr-2">Glow</em> Menu
            </h2>
            <p className="mx-auto mt-5 max-w-md text-sm text-muted">A taste of what's waiting for you — full details on every treatment's own page.</p>
          </ScrollReveal>

          <div className="mt-16 grid gap-x-16 gap-y-14 md:grid-cols-2">
            {byCategory.map(({ category, items }) => {
              const Icon = CATEGORY_ICON[category] ?? Droplet;
              return (
                <ScrollReveal key={category}>
                  <div>
                    <div className="flex items-center gap-3 border-b border-gold/40 pb-4">
                      <Icon size={18} strokeWidth={1.5} className="text-gold" />
                      <h3 className="font-display text-3xl italic text-ink">{category}</h3>
                    </div>
                    <ul className="mt-5 space-y-1">
                      {items.slice(0, 6).map((s) => (
                        <li key={s.id} className="group -mx-3 flex items-baseline gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-surface">
                          <span className="text-ink/80 transition-colors group-hover:text-ink">{s.title}</span>
                          <span
                            className="h-px flex-1 translate-y-[-3px] opacity-60 transition-opacity group-hover:opacity-100"
                            style={{
                              backgroundImage:
                                "repeating-linear-gradient(to right, rgb(var(--color-line)) 0, rgb(var(--color-line)) 2px, transparent 2px, transparent 6px)",
                            }}
                          />
                          <span className="font-display text-lg text-gold-light">{s.price ? formatPrice(Number(s.price)) : "—"}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/services?category=${encodeURIComponent(category)}`}
                      className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-gold-light transition-colors hover:text-ink"
                    >
                      View Full Menu →
                    </Link>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {featuredOffer && (
            <ScrollReveal className="mt-20">
              <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-[2rem] p-[1px] text-center md:text-left" style={{ backgroundImage: "var(--glow-gradient)" }}>
                <div className="flex w-full flex-col items-center gap-6 rounded-[calc(2rem-1px)] bg-bg-soft px-8 py-10 md:flex-row md:justify-between">
                  <div className="relative">
                    <span className="eyebrow">Special Offer</span>
                    <h3 className="mt-3 font-display text-3xl leading-tight text-ink md:text-4xl">{featuredOffer.title}</h3>
                    <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted md:mx-0">{featuredOffer.description}</p>
                  </div>
                  <div className="relative flex flex-col items-center gap-4 md:items-end">
                    <div className="flex items-baseline gap-3">
                      {featuredOffer.promoPrice !== null && <span className="text-glow font-display text-4xl">{formatPrice(Number(featuredOffer.promoPrice))}</span>}
                      {featuredOffer.originalPrice !== null && <span className="text-base text-muted line-through">{formatPrice(Number(featuredOffer.originalPrice))}</span>}
                    </div>
                    <Magnetic>
                      <Link href="/book" className="btn-primary w-fit">Book Now</Link>
                    </Magnetic>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* The Glow Story */}
      <section className="py-24 md:py-32">
        <div className="container-lux grid items-center gap-16 lg:grid-cols-2">
          <ScrollReveal className="relative">
            <div data-parallax className="relative h-[480px] overflow-hidden rounded-[2.5rem] shadow-soft">
              <Image src="/images/clinic.jpg" alt="Glow Vie treatment room" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-10 -right-2 rounded-full bg-bg sm:-right-10">
              <RotatingBadge id="story-badge" href="/about" text="Our story ✦ Our story ✦ Our story ✦ " />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <span className="eyebrow">Our Story</span>
            <h2 className="mt-5 text-5xl leading-[0.95] text-ink md:text-7xl">
              The glow <em className="text-glow pr-2">story</em>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
              At Glow Vie, we believe beauty is more than skin deep. It's an experience, a
              ritual, a moment of self-care. Our mission is to enhance your natural glow with
              expert care and treatments tailored just for you.
            </p>
            <Link href="/about" className="btn-outline mt-8 inline-flex">Learn More</Link>

            <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line">
              {[
                { title: "Personalized", desc: "Just for you." },
                { title: "Intentional", desc: "Every detail matters." },
                { title: "Elegant", desc: "Luxury in every visit." },
                { title: "Confident", desc: "Because you deserve it." },
              ].map((f) => (
                <div key={f.title} className="group bg-bg p-5 transition-colors hover:bg-surface">
                  <Sparkle size={14} className="text-gold transition-transform duration-500 group-hover:rotate-90" />
                  <p className="mt-3 font-display text-xl italic text-ink">{f.title}</p>
                  <p className="text-xs text-muted">{f.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Client Love */}
      <section id="testimonials" className="section-rose scroll-mt-24 rounded-[2.5rem] py-24 md:mx-3 md:py-32">
        <div className="container-lux">
          <ScrollReveal>
            <span className="eyebrow">Client Love</span>
            <h2 className="mt-5 text-5xl leading-[0.95] text-ink md:text-7xl">
              Leave a <em className="text-glow pr-2">review</em>
            </h2>
          </ScrollReveal>

          <ScrollReveal className="mt-14">
            <TestimonialCarousel
              testimonials={testimonials.map((t) => ({ id: t.id, name: t.name, rating: t.rating, quote: t.quote }))}
            />
          </ScrollReveal>

          {/* Same plum panel language as the Glow Menu: heading on the left, form on the right. */}
          <ScrollReveal className="mt-20">
            <div className="section-dark relative overflow-hidden rounded-[2.5rem] px-6 py-14 sm:px-12 md:py-20 lg:px-16">
              <SparkleField className="opacity-40" />
              <div className="relative grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
                <div>
                  <span className="eyebrow">Share Your Experience</span>
                  <h3 className="mt-5 text-5xl leading-[0.95] text-ink md:text-6xl">
                    How was your <em className="text-glow pr-2">visit?</em>
                  </h3>
                  <p className="mt-6 max-w-sm text-base leading-relaxed text-muted">
                    We'd love to hear how your visit went. Every review is read by our team — and helps the next guest find their glow.
                  </p>
                  <Quote size={56} strokeWidth={1} className="mt-10 hidden text-gold/50 lg:block" />
                </div>
                <ReviewForm />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Quick-links strip */}
      <section className="pb-24 pt-16 md:pb-32 md:pt-20">
        <div className="container-lux grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickTile
            href="/gallery"
            label="Before & After"
            desc="Real results, real glow."
            cta="Explore"
            image={beforeAfterImage?.afterUrl || "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1200"}
          />
          <QuickTile href="#testimonials" label="Testimonials" desc="What our clients say about us." cta="Read More" icon />
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
      <Link href={href} className="group relative block h-64 overflow-hidden rounded-[1.75rem] shadow-soft">
        {icon ? (
          <div className="flex h-full w-full flex-col items-center justify-center" style={{ backgroundImage: "var(--glow-gradient)" }}>
            <Quote size={36} className="text-plum transition-transform duration-500 group-hover:scale-110" />
          </div>
        ) : (
          <>
            <Image src={image!} alt={label} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-plum/80 via-plum/10 to-transparent" />
          </>
        )}
        <div className={`absolute inset-x-0 bottom-0 p-5 ${icon ? "text-plum" : "text-white"}`}>
          <h3 className="font-display text-2xl transition-all group-hover:italic">{label}</h3>
          <p className={`mt-1 text-xs ${icon ? "text-plum/70" : "text-white/80"}`}>{desc}</p>
          <span className="mt-2 inline-block text-[10px] font-medium uppercase tracking-[0.2em]">{cta} →</span>
        </div>
      </Link>
    </ScrollReveal>
  );
}
