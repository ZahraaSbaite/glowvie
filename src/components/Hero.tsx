"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, ArrowDown } from "lucide-react";
import { gsap } from "gsap";
import { SparkleField, BubbleField } from "./Sparkles";

const FLOWER_IMAGE = "/images/hero/flower.png";

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const desktopFlowerRef = useRef<HTMLDivElement>(null);
  const mobileFlowerRef = useRef<HTMLDivElement>(null);

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

  // Gives the flat flower photo a sense of depth: a slow perpetual float/tilt loop for life,
  // plus (mouse devices only) a cursor-driven parallax tilt on top — both are real CSS 3D
  // transforms (rotateX/rotateY against a perspective'd parent), not just a 2D wobble.
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const elements = [desktopFlowerRef.current, mobileFlowerRef.current].filter(
      (el): el is HTMLDivElement => el !== null
    );
    if (reduceMotion || elements.length === 0) return;

    const ctx = gsap.context(() => {
      elements.forEach((el, i) => {
        gsap.to(el, {
          y: -16,
          rotateZ: 1.4,
          duration: 4.5 + i * 0.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        if (isTouch) {
          gsap.to(el, {
            rotateY: 9,
            rotateX: -4,
            duration: 7,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        }
      });
    }, rootRef);

    if (isTouch) return () => ctx.revert();

    const setters = elements.map((el) => ({
      x: gsap.quickTo(el, "rotateY", { duration: 0.7, ease: "power3.out" }),
      y: gsap.quickTo(el, "rotateX", { duration: 0.7, ease: "power3.out" }),
    }));

    const handlePointerMove = (e: PointerEvent) => {
      elements.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        setters[i].x(gsap.utils.clamp(-14, 14, relX * 14));
        setters[i].y(gsap.utils.clamp(-10, 10, -relY * 10));
      });
    };
    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className="relative bg-bg-soft">
      <SparkleField />

      <div className="flex min-h-[80vh] items-center overflow-hidden sm:min-h-[90vh] lg:min-h-screen">
        {/* Desktop: flower bleeds full-bleed to the right edge, unboxed, behind the text. */}
        <div
          data-hero-image
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[60%] items-center justify-end lg:flex"
          style={{ perspective: "1400px" }}
        >
          <BubbleField />
          <div ref={desktopFlowerRef} className="absolute right-[8%] h-[82%] w-[92%]">
            <Image src={FLOWER_IMAGE} alt="Translucent glass flower" fill priority sizes="60vw" className="object-contain object-right" />
          </div>
        </div>

        <div className="container-lux relative grid w-full items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
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

          {/* Mobile/tablet: simple contained visual, stacked below the text. */}
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md lg:hidden" style={{ perspective: "1200px" }}>
            <BubbleField />
            <div ref={mobileFlowerRef} className="absolute inset-0">
              <Image src={FLOWER_IMAGE} alt="Translucent glass flower" fill priority className="object-contain" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
