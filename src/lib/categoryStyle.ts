import { Droplet, Hand, Eye, PenTool, Sparkles, type LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Facials: Droplet,
  Nails: Hand,
  Lashes: Eye,
  Tattoo: PenTool,
};

const TINTS = [
  "from-brand-light via-white to-white",
  "from-gold-light/50 via-white to-white",
  "from-bg-soft via-white to-white",
  "from-brand/15 via-white to-white",
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Falls back to a sparkle for any category the admin adds beyond the curated set. */
export function getCategoryIcon(category: string): LucideIcon {
  return ICONS[category] ?? Sparkles;
}

/** A stable, category-derived pastel gradient — same category always gets the same tint. */
export function getCategoryTint(category: string): string {
  return TINTS[hashString(category) % TINTS.length];
}
