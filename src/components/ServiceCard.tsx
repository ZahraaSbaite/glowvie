import Link from "next/link";
import { Clock, ArrowUpRight } from "lucide-react";
import { ServiceDTO } from "@/types";
import { formatDuration, formatPrice, classNames } from "@/lib/utils";
import { getCategoryIcon, getCategoryTint } from "@/lib/categoryStyle";

export function ServiceCard({ service }: { service: ServiceDTO }) {
  const Icon = getCategoryIcon(service.category);
  const tint = getCategoryTint(service.category);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl3 border border-line bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-card">
      <div className={classNames("relative flex h-14 items-center justify-between overflow-hidden bg-gradient-to-r px-6", tint)}>
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-dark">
          {service.category}
        </span>
        <div className="relative flex items-center">
          <Icon
            size={22}
            strokeWidth={1.5}
            className="text-brand-dark/50 transition-opacity duration-300 group-hover:opacity-0"
          />
          <ArrowUpRight
            size={16}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-dark opacity-0 transition-opacity duration-300 group-hover:opacity-70"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl text-ink">{service.title}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
          {service.shortDesc}
        </p>

        <span className="my-4 block h-px w-full bg-gradient-to-r from-gold via-line to-transparent" />

        <div className="flex items-center justify-between text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-brand-dark" /> {formatDuration(service.durationMins)}
          </span>
          {service.price !== null && <span className="text-base font-medium text-ink">{formatPrice(service.price)}</span>}
        </div>

        <div className="mt-5 flex gap-3">
          <Link href={`/services/${service.slug}`} className="btn-outline flex-1 !py-2.5 text-xs">
            Learn More
          </Link>
          <Link href={`/book?service=${service.slug}`} className="btn-primary flex-1 !py-2.5 text-xs">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
