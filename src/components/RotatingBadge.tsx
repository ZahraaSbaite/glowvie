import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/** A circular line of text that slowly spins around an arrow — a playful link accent. */
export function RotatingBadge({
  id,
  href,
  text,
  size = 136,
  className = "",
}: {
  id: string;
  href: string;
  text: string;
  size?: number;
  className?: string;
}) {
  return (
    <Link href={href} className={`group relative grid shrink-0 place-items-center ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-spin-slow" aria-hidden="true">
        <defs>
          <path id={id} d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text className="fill-ink font-body uppercase" style={{ fontSize: 8.4, letterSpacing: "0.3em" }}>
          <textPath href={`#${id}`} textLength="236" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="grid h-14 w-14 place-items-center rounded-full bg-ink text-bg transition-transform duration-500 group-hover:rotate-45 group-hover:scale-110">
        <ArrowUpRight size={20} />
      </span>
      <span className="sr-only">{text}</span>
    </Link>
  );
}
