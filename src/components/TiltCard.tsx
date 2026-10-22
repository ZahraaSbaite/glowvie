"use client";

import { useEffect, useRef } from "react";

/**
 * Tilts toward the cursor in 3D with a moving glare. Exposes its pointer position as CSS
 * variables so children opt into parallax via the .tilt-card__media / __content / __glare
 * classes (see globals.css). Pure CSS transforms — no WebGL. Mouse devices only; no-ops
 * under reduced motion.
 */
export function TiltCard({
  children,
  className = "",
  max = 8,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const card = cardRef.current;
    if (!outer || !card) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      const rect = outer.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        card.dataset.tilting = "";
        card.style.setProperty("--rx", `${(0.5 - py) * max * 2}deg`);
        card.style.setProperty("--ry", `${(px - 0.5) * max * 2}deg`);
        card.style.setProperty("--mx", `${px * 2 - 1}`);
        card.style.setProperty("--my", `${py * 2 - 1}`);
        card.style.setProperty("--gx", `${px * 100}%`);
        card.style.setProperty("--gy", `${py * 100}%`);
        card.style.setProperty("--glare", "1");
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      delete card.dataset.tilting;
      ["--rx", "--ry", "--mx", "--my", "--gx", "--gy", "--glare"].forEach((v) => card.style.removeProperty(v));
    };

    outer.addEventListener("pointermove", onMove);
    outer.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      outer.removeEventListener("pointermove", onMove);
      outer.removeEventListener("pointerleave", onLeave);
    };
  }, [max]);

  return (
    <div ref={outerRef} className={className} style={{ perspective: "1000px" }}>
      <div ref={cardRef} className="tilt-card h-full">
        {children}
      </div>
    </div>
  );
}
