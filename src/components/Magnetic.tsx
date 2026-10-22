"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Pulls its child gently toward the cursor while hovered, then eases back on leave.
 * Reserved for primary calls to action. Mouse devices only; no-ops under reduced motion.
 */
export function Magnetic({
  children,
  className = "",
  strength = 0.3,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const xTo = gsap.quickTo(inner, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(inner, "y", { duration: 0.5, ease: "power3.out" });

    // Measured on the static wrapper so the moving child doesn't feed back into its own offset.
    const onMove = (e: PointerEvent) => {
      const rect = outer.getBoundingClientRect();
      xTo((e.clientX - (rect.left + rect.width / 2)) * strength);
      yTo((e.clientY - (rect.top + rect.height / 2)) * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    outer.addEventListener("pointermove", onMove);
    outer.addEventListener("pointerleave", onLeave);
    return () => {
      outer.removeEventListener("pointermove", onMove);
      outer.removeEventListener("pointerleave", onLeave);
      gsap.set(inner, { x: 0, y: 0 });
    };
  }, [strength]);

  return (
    <div ref={outerRef} className={className}>
      <span ref={innerRef} className="block">
        {children}
      </span>
    </div>
  );
}
