"use client";

import Link from "next/link";
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
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
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

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-surface/85 backdrop-blur-md shadow-soft" : "bg-surface/0"
        }`}
      >
        <nav className="container-lux flex h-20 items-center justify-between">
          <Logo />

          <ul className="hidden items-center gap-7 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-xs font-medium uppercase tracking-[0.15em] text-ink/80 transition-colors hover:text-brand-dark"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <ThemeToggle className="hidden sm:flex" />
            <Link href="/book" className="btn-primary hidden sm:inline-flex">
              Book Appointment
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-brand hover:text-brand-dark lg:hidden"
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </header>

      {/* Backdrop (mobile drawer only) */}
      <div
        className={`fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Side drawer (mobile navigation) */}
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-sm flex-col bg-surface shadow-soft transition-transform duration-500 ease-out lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        <div className="flex items-center justify-between px-6 py-6">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:text-brand-dark"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        <ul className="flex-1 overflow-y-auto px-6 py-2">
          {links.map((l) => (
            <li key={l.href} className="border-b border-line">
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-4 text-sm font-medium uppercase tracking-[0.15em] text-ink/80 transition-colors hover:text-brand-dark"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="p-6">
          <Link href="/book" onClick={() => setOpen(false)} className="btn-primary w-full">
            Book Appointment
          </Link>
        </div>
      </aside>
    </>
  );
}
