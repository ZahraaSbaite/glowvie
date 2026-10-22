"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Magnetic } from "./Magnetic";
import { GlowBlobs } from "./GlowBlobs";
import { RotatingBadge } from "./RotatingBadge";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Entrance: the wordmark's letters rise out of a blur one by one, then the rest fades up.
  // As the hero scrolls away, the word drifts down and fades.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from("[data-hero-letter]", {
          yPercent: 110,
          rotate: 8,
          opacity: 0,
          filter: "blur(18px)",
          duration: 1.7,
          stagger: 0.08,
          clearProps: "transform,filter",
        })
        .from("[data-hero-fade]", { opacity: 0, y: 24, duration: 1.1, stagger: 0.12 }, "-=1.2");

      gsap.to("[data-hero-word]", {
        yPercent: 18,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: { trigger: rootRef.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // A soft glow that trails the cursor behind the wordmark (mouse devices only).
  useEffect(() => {
    const root = rootRef.current;
    const spot = spotlightRef.current;
    if (!root || !spot) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const xTo = gsap.quickTo(spot, "x", { duration: 1.2, ease: "power3.out" });
    const yTo = gsap.quickTo(spot, "y", { duration: 1.2, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      // Offsets from the spotlight's resting spot (centered, a little above middle).
      xTo(e.clientX - rect.left - rect.width / 2);
      yTo(e.clientY - rect.top - rect.height * 0.45);
    };
    root.addEventListener("pointermove", onMove);
    return () => root.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <section ref={rootRef} className="relative isolate flex min-h-[calc(100svh-5.5rem)] flex-col overflow-hidden">
      <GlowBlobs />
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute left-1/2 top-[45%] -z-10 -ml-[17rem] -mt-[17rem] h-[34rem] w-[34rem] rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(244,195,168,0.85), rgba(205,182,230,0.45) 45%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div data-hero-fade className="container-lux flex items-center justify-between pt-4 text-[11px] font-medium uppercase tracking-[0.3em] text-muted">
        <span>Beauty Clinic</span>
        <span className="hidden sm:inline">Facials · Nails · Lashes · PMU</span>
        <span>Beirut</span>
      </div>

      <div className="flex flex-1 items-center justify-center px-2 py-6">
        <h1
          data-hero-word
          aria-label="Glow Vie"
          className="select-none text-center font-display text-[27vw] font-medium leading-[0.82] tracking-[-0.04em] sm:text-[15.5vw]"
        >
          {/* "GLOW" in Bodoni capitals, letter by letter; "Vie" as one calligraphic word,
              since script letters join and can't be split apart. */}
          <span className="block whitespace-nowrap sm:inline" aria-hidden="true">
            {"GLOW".split("").map((ch, i) => (
              <span key={i} data-hero-letter className="inline-block">
                <span className="hero-letter hero-name inline-block" style={{ animationDelay: `${-i * 0.35}s` }}>
                  {ch}
                </span>
              </span>
            ))}
          </span>
          <span className="block whitespace-nowrap sm:ml-[0.12em] sm:inline" aria-hidden="true">
            <span data-hero-letter className="inline-block">
              <span
                className="hero-letter hero-name inline-block px-[0.08em] font-script text-[1.15em] font-normal tracking-normal"
                style={{ animationDelay: "-1.4s" }}
              >
                Vie
              </span>
            </span>
          </span>
        </h1>
      </div>

      <div className="container-lux pb-8">
        {/* Tagline and description sit side by side, split by a thin gradient rule. */}
        <div data-hero-fade className="grid gap-5 md:grid-cols-2 md:items-center md:gap-12">
          <p className="font-display text-3xl italic leading-tight text-ink md:text-5xl">Your beauty, your ritual.</p>
          <p className="max-w-md text-base leading-relaxed text-muted md:border-l md:border-ink/15 md:pl-12">
            Luxury beauty treatments designed to reveal the most confident you — nails, lashes, facials, and semi-permanent makeup in a space built entirely around you.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between gap-8">
          <div data-hero-fade className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
            <Magnetic className="sm:inline-block">
              <Link href="/book" className="btn-primary w-full sm:w-auto">
                Book Appointment
              </Link>
            </Magnetic>
            <Link href="/services" className="btn-outline">
              Explore Services
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "9613000000"}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-ink/70 transition-colors hover:text-ink"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
          <div data-hero-fade className="hidden shrink-0 md:block">
            <RotatingBadge id="hero-badge" href="#choose-your-ritual" text="Scroll to discover ✦ Scroll to discover ✦ " size={104} />
          </div>
        </div>
      </div>
    </section>
  );
}
