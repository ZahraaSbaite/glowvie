"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { MessageCircle, ArrowDown } from "lucide-react";
import { gsap } from "gsap";
import { SparkleField } from "./Sparkles";

const HERO_IMAGE = "https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=1400";

// WebGL needs the browser — never rendered on the server, and lazy-loaded so the
// Three.js bundle doesn't block the rest of the homepage from loading.
const Hero3D = dynamic(() => import("./Hero3D").then((m) => m.Hero3D), { ssr: false });

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.from("[data-hero-eyebrow]", { opacity: 0, y: 16, duration: 0.6 })
        .from("[data-hero-headline]", { opacity: 0, y: 24, duration: 0.8 }, "-=0.35")
        .from("[data-hero-desc]", { opacity: 0, y: 16, duration: 0.6 }, "-=0.45")
        .from("[data-hero-cta]", { opacity: 0, y: 16, duration: 0.6 }, "-=0.4")
        .from("[data-hero-image]", { opacity: 0, scale: 0.96, duration: 1 }, "-=0.9");
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-bg-soft">
      <SparkleField />
      <div className="container-lux relative grid min-h-[92vh] items-center gap-12 py-24 lg:grid-cols-2">
        <div className="relative z-10">
          <span data-hero-eyebrow className="eyebrow">Welcome to Glow Vie</span>
          <h1
            data-hero-headline
            className="mt-5 max-w-xl text-5xl uppercase leading-[1.08] tracking-tight text-ink md:text-6xl"
          >
            Your <span className="text-brand-dark">Beauty</span>,<br /> Your Ritual.
          </h1>
          <p data-hero-desc className="mt-6 max-w-md text-base leading-relaxed text-muted">
            Luxury beauty treatments designed to reveal the most confident you — nails, lashes, facials, and semi-permanent makeup in a space built entirely around you.
          </p>
          <div data-hero-cta className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link href="/book" className="btn-primary">
              Book Appointment
            </Link>
            <Link href="/services" className="btn-outline">
              Explore Services
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "9613000000"}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-ink/70 transition-colors hover:text-brand-dark"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>

          <a href="#choose-your-ritual" className="mt-14 hidden items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted hover:text-brand-dark sm:flex">
            Scroll to Discover <ArrowDown size={14} className="animate-float" />
          </a>
        </div>

        <div data-hero-image className="relative mx-auto aspect-[4/5] w-full max-w-md lg:max-w-none">
          <div className="relative h-full w-full overflow-hidden rounded-xl3 bg-bg-soft shadow-soft">
            <Hero3D
              fallback={
                <Image src={HERO_IMAGE} alt="Glow Vie beauty portrait" fill priority className="object-cover" />
              }
            />
          </div>

          <div className="absolute -left-6 top-8 hidden h-24 w-24 items-center justify-center rounded-full border border-brand bg-surface/80 text-center text-[9px] font-medium uppercase leading-tight tracking-[0.2em] text-brand-dark shadow-soft animate-float md:flex">
            Your Beauty · Our Passion
          </div>
        </div>
      </div>
    </section>
  );
}
