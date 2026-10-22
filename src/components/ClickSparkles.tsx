"use client";

import { useEffect } from "react";
import { gsap } from "gsap";

const COLORS = ["#D8A7A7", "#C9A66B", "#F4C3A8", "#EDD3D1"];
// The same four-point star as the logo's sparkle.
const STAR =
  '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M12 1C12.4 6.5 13.5 10.6 17.5 12C13.5 13.4 12.4 17.5 12 23C11.6 17.5 10.5 13.4 6.5 12C10.5 10.6 11.6 6.5 12 1Z" fill="currentColor"/></svg>';
const MAX_LIVE = 80;

/**
 * A little burst of rose-gold sparkles wherever the visitor clicks or taps. Anything marked
 * with data-sparkle-big (the hero name) gets a bigger, wider burst. Purely decorative: the
 * layer ignores pointer events, and nothing runs under reduced motion.
 */
export function ClickSparkles() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layer = document.createElement("div");
    layer.setAttribute("aria-hidden", "true");
    Object.assign(layer.style, { position: "fixed", inset: "0", pointerEvents: "none", zIndex: "120", overflow: "hidden" });
    document.body.appendChild(layer);

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const big = e.target instanceof Element && e.target.closest("[data-sparkle-big]");
      burst(layer, e.clientX, e.clientY, big ? 24 : 10, big ? 160 : 60, big ? 26 : 15);
    };
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      layer.remove();
    };
  }, []);

  return null;
}

function burst(layer: HTMLElement, x: number, y: number, count: number, distance: number, maxSize: number) {
  const room = Math.max(0, MAX_LIVE - layer.childElementCount);
  for (let i = 0; i < Math.min(count, room); i++) {
    const size = maxSize * (0.45 + Math.random() * 0.55);
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.6;
    const dist = distance * (0.5 + Math.random() * 0.6);
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;

    const el = document.createElement("span");
    el.innerHTML = STAR;
    Object.assign(el.style, {
      position: "absolute",
      left: `${x - size / 2}px`,
      top: `${y - size / 2}px`,
      width: `${size}px`,
      height: `${size}px`,
      color: COLORS[i % COLORS.length],
      filter: "drop-shadow(0 0 4px currentColor)",
    });
    layer.appendChild(el);

    // Shoot out, twinkle, then drift down slightly as it fades.
    const duration = 0.7 + Math.random() * 0.45;
    gsap.set(el, { scale: 0 });
    gsap.to(el, {
      keyframes: [
        { x: dx * 0.75, y: dy * 0.75, scale: 1, rotation: 90, duration: duration * 0.45, ease: "power2.out" },
        { x: dx, y: dy + 18, scale: 0.2, rotation: 180, opacity: 0, duration: duration * 0.55, ease: "power1.in" },
      ],
      onComplete: () => el.remove(),
    });
  }
}
