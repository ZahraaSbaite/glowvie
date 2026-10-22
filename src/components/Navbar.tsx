"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/offers", label: "Offers" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      {/* A floating glass pill rather than a full-width bar. */}
      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
        <nav
          className={`mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between rounded-full border px-4 transition-all duration-500 sm:px-6 ${
            scrolled ? "border-line bg-surface/75 shadow-soft backdrop-blur-xl" : "border-transparent bg-transparent"
          }`}
        >
          <Logo />

          <ul className="hidden items-center gap-1 xl:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`relative rounded-full px-3.5 py-2 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors ${
                    isActive(l.href) ? "text-ink" : "text-ink/60 hover:text-ink"
                  }`}
                >
                  {l.label}
                  {isActive(l.href) && (
                    <span className="absolute inset-x-3.5 -bottom-0.5 h-px" style={{ backgroundImage: "var(--glow-gradient)" }} />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <ThemeToggle className="hidden sm:flex" />
            <Link href="/book" className="btn-primary hidden !py-3 sm:inline-flex">
              Book Now
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink xl:hidden"
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen menu (below xl) */}
      <aside
        className={`section-dark fixed inset-0 z-[70] flex flex-col transition-[clip-path] duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] xl:hidden ${
          open ? "[clip-path:circle(150%_at_100%_0%)]" : "pointer-events-none [clip-path:circle(0%_at_100%_0%)]"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <Logo dark />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink"
              aria-label="Close menu"
              tabIndex={open ? 0 : -1}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        <ul className="flex-1 overflow-y-auto px-6 py-4">
          {links.map((l, i) => (
            <li key={l.href} className="border-b border-line">
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className="group flex items-baseline gap-4 py-3.5"
              >
                <span className="text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className={`font-display text-4xl transition-all duration-300 group-hover:translate-x-2 group-hover:italic ${isActive(l.href) ? "text-glow italic" : "text-ink"}`}>
                  {l.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="p-6">
          <Link href="/book" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1} className="btn-primary w-full">
            Book Appointment
          </Link>
        </div>
      </aside>
    </>
  );
}
