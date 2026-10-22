import Link from "next/link";
import { Instagram, Facebook, MapPin, Phone, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Sparkle } from "./Sparkles";

export async function Footer() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });

  return (
    <footer className="section-dark relative overflow-hidden rounded-t-[2.5rem]">
      <div className="container-lux pt-20">
        <div className="flex flex-col items-start justify-between gap-8 border-b border-line pb-14 md:flex-row md:items-end">
          <h2 className="max-w-2xl text-5xl leading-[0.95] text-ink md:text-7xl">
            Ready to <em className="text-glow pr-2">glow?</em>
          </h2>
          <Link href="/book" className="btn-primary">Book Your Appointment →</Link>
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-3">
          <div>
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              Luxury beauty treatments in a calm, refined space — nails, lashes, facials and semi-permanent makeup.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={settings?.instagramUrl || "https://www.instagram.com/glowvie_lounge?stkn=MWh1MjJlczQwNG5rZQ=="}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bg"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href={settings?.facebookUrl || "#"}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bg"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-5 font-body text-[11px] font-semibold uppercase tracking-[0.3em] text-muted">Explore</h4>
            <ul className="space-y-2.5 font-display text-xl text-ink">
              <li><Link href="/services" className="transition-all hover:italic hover:text-gold-light">Services</Link></li>
              <li><Link href="/gallery" className="transition-all hover:italic hover:text-gold-light">Gallery</Link></li>
              <li><Link href="/about" className="transition-all hover:italic hover:text-gold-light">About</Link></li>
              <li><Link href="/contact" className="transition-all hover:italic hover:text-gold-light">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 font-body text-[11px] font-semibold uppercase tracking-[0.3em] text-muted">Visit</h4>
            <ul className="space-y-3 text-sm text-ink/85">
              <li className="flex items-start gap-2.5"><MapPin size={15} className="mt-0.5 shrink-0 text-gold" /> {settings?.address || "Beirut, Lebanon"}</li>
              <li className="flex items-start gap-2.5"><Phone size={15} className="mt-0.5 shrink-0 text-gold" /> {settings?.phone || "+961 81 145 280"}</li>
              <li className="flex items-start gap-2.5"><Mail size={15} className="mt-0.5 shrink-0 text-gold" /> {settings?.email || "glowviebeauty@gmail.com"}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative border-t border-line py-6">
        <div className="container-lux flex flex-col items-center justify-between gap-3 text-xs text-muted md:flex-row">
          <p className="flex items-center gap-2"><Sparkle size={12} className="text-gold" /> © {new Date().getFullYear()} Glow Vie Beauty Clinic. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-ink">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-ink">Terms</Link>
            <span className="text-line">|</span>
            <a
              href="https://www.instagram.com/dev_oratech?igsh=MWluNHBzN2RiNGc1cA=="
              target="_blank"
              rel="noreferrer"
              className="hover:text-ink"
            >
              Website by <span className="font-medium">DevOraTech</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
