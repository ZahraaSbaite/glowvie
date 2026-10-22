import Link from "next/link";
import { Sparkle } from "./Sparkles";

/**
 * Placeholder wordmark — no logo file was supplied, so this renders a refined
 * text mark using the brand's display face plus the sparkle motif. Swap this
 * component out for an <Image> once a final logo file exists.
 */
export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2">
      <Sparkle size={18} className="text-gold transition-transform duration-500 group-hover:rotate-90" />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-xl font-semibold tracking-wide ${dark ? "text-white" : "text-ink"}`}>
          GLOW <em className="text-glow pr-0.5">Vie</em>
        </span>
        <span className={`mt-1 text-[9px] font-medium uppercase tracking-[0.35em] ${dark ? "text-white/70" : "text-muted"}`}>
          Beauty Clinic
        </span>
      </span>
    </Link>
  );
}
