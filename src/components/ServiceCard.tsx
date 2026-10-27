import Link from "next/link";
import { Clock, RotateCw } from "lucide-react";
import { FlipCard } from "./FlipCard";
import { ServiceDTO } from "@/types";
import { formatDuration, formatPrice, classNames } from "@/lib/utils";
import { getCategoryIcon, getCategoryTint } from "@/lib/categoryStyle";

export function ServiceCard({ service }: { service: ServiceDTO }) {
  const Icon = getCategoryIcon(service.category);
  const tint = getCategoryTint(service.category);

  return (
    <FlipCard
      label={`${service.title} — flip for details`}
      className="h-[22rem]"
      front={
        <div className="flex h-full flex-col overflow-hidden rounded-xl3 border border-line bg-surface shadow-soft">
          <div className={classNames("relative flex h-14 items-center justify-between overflow-hidden bg-gradient-to-r px-6", tint)}>
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-dark">{service.category}</span>
            <Icon size={22} strokeWidth={1.5} className="text-brand-dark/50" />
          </div>
          <div className="flex flex-1 flex-col p-6">
            <h3 className="font-display text-3xl leading-tight text-ink">{service.title}</h3>
            <span className="my-5 block h-px w-full bg-gradient-to-r from-gold via-line to-transparent" />
            <div className="flex items-center justify-between text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-brand-dark" /> {formatDuration(service.durationMins)}
              </span>
              {service.price !== null && <span className="font-display text-2xl text-ink">{formatPrice(service.price)}</span>}
            </div>
            <span className="mt-auto inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted">
              <RotateCw size={13} /> Flip for details
            </span>
          </div>
        </div>
      }
      back={
        <div className="section-dark flex h-full flex-col rounded-xl3 p-7 shadow-soft">
          <span className="eyebrow">{service.category}</span>
          <h3 className="mt-4 font-display text-2xl leading-tight text-ink">{service.title}</h3>
          <p className="mt-3 flex-1 overflow-y-auto text-sm leading-relaxed text-muted">{service.shortDesc}</p>
          <div className="mt-5 flex gap-3">
            <Link href={`/services/${service.slug}`} className="btn-outline flex-1 !py-2.5 text-xs">
              Learn More
            </Link>
            <Link href={`/book?service=${service.slug}`} className="btn-primary flex-1 !py-2.5 text-xs">
              Book Now
            </Link>
          </div>
        </div>
      }
    />
  );
}
