import { Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Sparkle } from "@/components/Sparkles";
import { ReviewForm } from "@/components/ReviewForm";

export const metadata = { title: "Testimonials — Glow Vie Beauty Clinic" };
export const revalidate = 60;

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <section className="bg-bg-soft py-20 text-center">
        <span className="eyebrow flex items-center justify-center gap-2"><Sparkle size={14} /> Client Love</span>
        <h1 className="mt-3 text-5xl text-ink md:text-6xl">Testimonials</h1>
      </section>

      <section className="bg-surface py-20">
        <div className="container-lux grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.id} className="card-lux p-8">
              <div className="flex gap-1 text-brand">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-4 text-base italic leading-relaxed text-ink">"{t.quote}"</p>
              <p className="mt-4 text-sm font-medium uppercase tracking-wider text-muted">— {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-bg-soft py-20">
        <div className="container-lux">
          <div className="mx-auto max-w-xl text-center">
            <span className="eyebrow flex items-center justify-center gap-2"><Sparkle size={14} /> Share Your Experience</span>
            <h2 className="mt-3 text-4xl text-ink md:text-5xl">Leave a Review</h2>
            <p className="mx-auto mt-4 max-w-md text-muted">We'd love to hear how your visit went.</p>
          </div>
          <div className="mt-12">
            <ReviewForm />
          </div>
        </div>
      </section>
    </>
  );
}
