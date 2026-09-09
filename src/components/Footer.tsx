import Link from "next/link";
import { Instagram, Facebook, MapPin, Phone, Mail } from "lucide-react";
import { Logo } from "./Logo";
import { prisma } from "@/lib/prisma";

export async function Footer() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });

  return (
    <footer className="border-t border-line bg-bg-soft">
      <div className="container-lux grid gap-10 py-14 sm:grid-cols-3">
        <div>
          <Logo />
          <div className="mt-5 flex gap-3">
            <a
              href={settings?.instagramUrl || "https://www.instagram.com/glowvie_lounge?stkn=MWh1MjJlczQwNG5rZQ=="}
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-brand text-brand-dark transition-colors hover:bg-brand hover:text-white"
              aria-label="Instagram"
            >
              <Instagram size={16} />
            </a>
            <a
              href={settings?.facebookUrl || "#"}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-brand text-brand-dark transition-colors hover:bg-brand hover:text-white"
              aria-label="Facebook"
            >
              <Facebook size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink">
            Quick Links
          </h4>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted sm:block sm:space-y-2.5">
            <li><Link href="/services" className="hover:text-brand-dark">Services</Link></li>
            <li><Link href="/about" className="hover:text-brand-dark">About</Link></li>
            <li><Link href="/contact" className="hover:text-brand-dark">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink">Contact</h4>
          <ul className="space-y-2.5 text-sm text-muted">
            <li className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0 text-brand-dark" /> {settings?.address || "Beirut, Lebanon"}</li>
            <li className="flex items-start gap-2"><Phone size={15} className="mt-0.5 shrink-0 text-brand-dark" /> {settings?.phone || "+961 81 145 280"}</li>
            <li className="flex items-start gap-2"><Mail size={15} className="mt-0.5 shrink-0 text-brand-dark" /> {settings?.email || "glowviebeauty@gmail.com"}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line py-6">
        <div className="container-lux flex flex-col items-center justify-between gap-3 text-xs text-muted md:flex-row">
          <p>© {new Date().getFullYear()} Glow Vie Beauty Clinic. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-brand-dark">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-dark">Terms</Link>
            <span className="text-line">|</span>
            <a
              href="https://www.instagram.com/dev_oratech?igsh=MWluNHBzN2RiNGc1cA=="
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand-dark"
            >
              Website by <span className="font-medium">DevOraTech</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
