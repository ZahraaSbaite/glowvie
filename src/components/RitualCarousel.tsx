"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";

export type RitualItem = { category: string; image: string; blurb: string; href: string };

const MIN_SLOTS = 8; // enough cards that the front one always has angled neighbours
const REST_SECONDS = 2.6; // pause on each card before turning to the next

/**
 * The category cards float on a 3D ring that turns, rests on a card, then turns again.
 * Visitors can drag or swipe to spin it (with momentum, settling on the nearest card), use
 * the arrows, or click a card to open that service. Categories repeat around the ring so
 * there are always cards on either side; cards facing away fade back.
 */
export function RitualCarousel({ items }: { items: RitualItem[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const state = useRef({
    angle: 0,
    velocity: 0,
    dragging: false,
    moved: 0,
    lastX: 0,
    hover: false,
    target: null as number | null,
    settled: true,
    rest: 0,
  });
  const repeats = Math.max(1, Math.ceil(MIN_SLOTS / Math.max(items.length, 1)));
  const slots = Array.from({ length: repeats }, () => items).flat();
  const step = 360 / Math.max(slots.length, 1);

  useEffect(() => {
    const stage = stageRef.current;
    const ring = ringRef.current;
    if (!stage || !ring) return;
    const s = state.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const render = () => {
      ring.style.transform = `translateZ(calc(var(--ring-radius) * -1)) rotateY(${s.angle}deg)`;
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        // 1 when the card faces the viewer, -1 when it faces away.
        const facing = Math.cos(((i * step + s.angle) * Math.PI) / 180);
        card.style.opacity = String(0.25 + 0.75 * Math.max(0, (facing + 0.4) / 1.4));
        card.style.filter = `brightness(${0.55 + 0.45 * Math.max(0, facing)})`;
        card.style.zIndex = String(Math.round((facing + 1) * 10));
      });
    };

    const tick = (_time: number, deltaMs: number) => {
      const dt = Math.min(deltaMs, 50) / 1000;
      if (s.dragging) {
        // The pointer drives the angle directly.
      } else if (s.target !== null) {
        // Glide toward the chosen card.
        const diff = s.target - s.angle;
        s.angle += diff * Math.min(1, dt * 4);
        if (Math.abs(diff) < 0.05) {
          s.angle = s.target;
          s.target = null;
          s.settled = true;
          s.rest = 0;
        }
      } else if (Math.abs(s.velocity) > 20) {
        s.angle += s.velocity * dt;
        s.velocity *= Math.pow(0.04, dt); // momentum dies away over ~1s
      } else if (!s.settled) {
        // Momentum spent: settle onto the nearest card.
        s.velocity = 0;
        s.target = Math.round(s.angle / step) * step;
      } else if (!reduceMotion && !s.hover) {
        s.rest += dt;
        if (s.rest > REST_SECONDS) s.target = s.angle - step;
      }
      render();
    };

    const onDown = (e: PointerEvent) => {
      s.dragging = true;
      s.moved = 0;
      s.lastX = e.clientX;
      s.velocity = 0;
      s.target = null;
      s.settled = false;
    };
    const onMove = (e: PointerEvent) => {
      if (!s.dragging) return;
      const dx = e.clientX - s.lastX;
      s.lastX = e.clientX;
      s.moved += Math.abs(dx);
      s.angle += dx * 0.35;
      s.velocity = dx * 0.35 * 60;
    };
    const onUp = () => {
      s.dragging = false;
    };
    // A drag shouldn't also count as a click on the card underneath.
    const onClickCapture = (e: MouseEvent) => {
      if (s.moved > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const onEnter = () => (s.hover = true);
    const onLeave = () => {
      s.hover = false;
      s.dragging = false;
    };

    stage.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    stage.addEventListener("click", onClickCapture, true);
    stage.addEventListener("pointerenter", onEnter);
    stage.addEventListener("pointerleave", onLeave);
    gsap.ticker.add(tick);
    render();

    return () => {
      gsap.ticker.remove(tick);
      stage.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      stage.removeEventListener("click", onClickCapture, true);
      stage.removeEventListener("pointerenter", onEnter);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, [step]);

  const turn = (dir: number) => {
    const s = state.current;
    // Snap to the next card position in that direction.
    const base = Math.round(s.angle / step) * step;
    s.velocity = 0;
    s.settled = false;
    s.target = base + dir * step;
  };

  return (
    <div>
      <div
        ref={stageRef}
        data-no-reveal
        className="relative mx-auto h-[30rem] cursor-grab touch-pan-y select-none active:cursor-grabbing overflow-hidden [--card-w:13rem] [--ring-radius:15.7rem] sm:h-[32rem] sm:[--card-w:15rem] sm:[--ring-radius:18.2rem] lg:[--card-w:17rem] lg:[--ring-radius:20.6rem]"
        style={{ perspective: "1600px" }}
      >
        <div ref={ringRef} className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {slots.map((item, i) => (
            <div
              key={i}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="absolute left-1/2 top-1/2 h-[22rem] w-[var(--card-w)] sm:h-[24rem] lg:h-[26rem]"
              style={{ transform: `translate(-50%, -50%) rotateY(${i * step}deg) translateZ(var(--ring-radius))` }}
            >
              <Link
                href={item.href}
                draggable={false}
                className="group relative block h-full overflow-hidden rounded-[2rem] shadow-soft"
              >
                <Image
                  src={item.image}
                  alt={item.category}
                  fill
                  draggable={false}
                  sizes="17rem"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-plum/85 via-plum/10 to-transparent" />
                <span className="absolute left-6 top-5 font-display text-lg italic text-white/90">
                  {String((i % items.length) + 1).padStart(2, "0")}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="text-4xl transition-all duration-500 group-hover:italic">{item.category}</h3>
                  <p className="mt-1 text-xs text-white/80">{item.blurb}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/40 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-colors group-hover:bg-white group-hover:text-plum">
                    Discover →
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => turn(1)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/25 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bg"
          aria-label="Previous ritual"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted">Drag to explore</span>
        <button
          type="button"
          onClick={() => turn(-1)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/25 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bg"
          aria-label="Next ritual"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
