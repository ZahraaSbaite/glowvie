import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, RotateCcw, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDuration, formatPrice } from "@/lib/utils";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ServiceCard } from "@/components/ServiceCard";

export const revalidate = 60;

export async function generateStaticParams() {
  const services = await prisma.service.findMany({ select: { slug: true } });
  return services.map((s) => ({ slug: s.slug }));
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = await prisma.service.findUnique({ where: { slug: params.slug } });
  if (!service || !service.isActive) notFound();

  const relatedServices = await prisma.service.findMany({
    where: { isActive: true, category: service.category, id: { not: service.id } },
    orderBy: { displayOrder: "asc" },
    take: 3,
  });

  const faqs = [
    { question: "Is there any downtime?", answer: service.recoveryTime || "Most clients return to their day immediately." },
    { question: "How many sessions will I need?", answer: "This depends on your goals — your specialist will recommend a plan during your consultation." },
    { question: "Is this treatment right for my skin type?", answer: "Our specialists assess your skin before every treatment to confirm suitability and adjust the approach." },
  ];

  return (
    <>
      <section className="relative h-[50vh] min-h-[380px] w-full overflow-hidden">
        {service.imageUrl && (
          <Image src={service.imageUrl} alt={service.title} fill className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />
        <div className="container-lux absolute inset-x-0 bottom-10 text-white">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-light">
            {service.category}
          </span>
          <h1 className="mt-2 text-4xl md:text-6xl">{service.title}</h1>
        </div>
      </section>

      <section className="py-20">
        <div className="container-lux grid gap-14 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-3xl text-ink">Overview</h2>
            <p className="mt-4 text-base leading-relaxed text-muted">{service.fullDesc || service.shortDesc}</p>

            {service.benefits.length > 0 && (
              <>
                <h3 className="mt-10 text-2xl text-ink">Benefits</h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {service.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-muted">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand-dark" /> {b}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {service.procedure && (
              <>
                <h3 className="mt-10 text-2xl text-ink">Procedure</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted">{service.procedure}</p>
              </>
            )}

            {service.prepInfo && (
              <>
                <h3 className="mt-10 text-2xl text-ink">How to Prepare</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted">{service.prepInfo}</p>
              </>
            )}

            <h3 className="mt-10 text-2xl text-ink">Aftercare</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted">{service.recoveryTime || "Minimal aftercare needed — your specialist will walk you through it after your session."}</p>

            {service.importantNotes && (
              <div className="mt-8 rounded-xl2 bg-bg-soft p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-dark">Important Notes</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{service.importantNotes}</p>
              </div>
            )}

            <h3 className="mt-10 text-2xl text-ink">Frequently Asked Questions</h3>
            <div className="mt-4">
              <FAQAccordion items={faqs} />
            </div>
          </div>

          <aside className="h-fit rounded-xl3 border border-line bg-bg-soft p-8 shadow-soft lg:sticky lg:top-28">
            <ul className="space-y-4 text-sm">
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted"><Clock size={16} className="text-brand-dark" /> Duration</span>
                <span className="font-medium text-ink">{formatDuration(service.durationMins)}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted"><RotateCcw size={16} className="text-brand-dark" /> Recovery</span>
                <span className="font-medium text-ink text-right">{service.recoveryTime || "Minimal"}</span>
              </li>
              {service.price && (
                <li className="flex items-center justify-between border-t border-line pt-4">
                  <span className="text-muted">Starting at</span>
                  <span className="text-xl font-medium text-brand-dark">{formatPrice(Number(service.price))}</span>
                </li>
              )}
            </ul>
            <Link href={`/book?service=${service.slug}`} className="btn-primary mt-6 w-full">
              Book Appointment
            </Link>
          </aside>
        </div>
      </section>

      {relatedServices.length > 0 && (
        <section className="bg-bg-soft py-20">
          <div className="container-lux">
            <h2 className="text-2xl text-ink">Related Services</h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedServices.map((s) => (
                <ServiceCard key={s.id} service={{ ...s, price: s.price ? Number(s.price) : null }} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
