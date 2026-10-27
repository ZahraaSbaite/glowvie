"use client";

import { useState } from "react";
import { ChevronsLeftRight } from "lucide-react";

/**
 * Compares two photos with a draggable divider: "before" on the left, "after" on the right.
 * In `interactive` mode an invisible range input covers the image, which gives mouse drag,
 * touch swipe and keyboard arrows for free. In `follow` mode (grid thumbnails, which sit
 * inside a button) the divider simply tracks the mouse while hovered.
 */
export function BeforeAfterSlider({
  before,
  after,
  alt,
  mode = "interactive",
  fit = "cover",
  className = "",
}: {
  before: string;
  after: string;
  alt: string;
  mode?: "interactive" | "follow";
  fit?: "cover" | "contain";
  className?: string;
}) {
  const [pos, setPos] = useState(50);
  const img = `absolute inset-0 h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"}`;

  return (
    <div
      className={`relative select-none overflow-hidden ${className}`}
      onPointerMove={
        mode === "follow"
          ? (e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setPos(Math.min(95, Math.max(5, ((e.clientX - rect.left) / rect.width) * 100)));
            }
          : undefined
      }
      onPointerLeave={mode === "follow" ? () => setPos(50) : undefined}
    >
      <img src={after} alt={`${alt} — after`} className={img} draggable={false} />
      <img
        src={before}
        alt={`${alt} — before`}
        className={img}
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)`, transition: mode === "follow" ? "clip-path 0.25s ease-out" : undefined }}
        draggable={false}
      />

      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-plum/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
        Before
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-brand/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-plum backdrop-blur">
        After
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white/90 shadow-[0_0_12px_rgba(0,0,0,0.35)]"
        style={{ left: `${pos}%`, transition: mode === "follow" ? "left 0.25s ease-out" : undefined }}
      >
        <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-plum shadow-soft">
          <ChevronsLeftRight size={18} />
        </span>
      </div>

      {mode === "interactive" && (
        <input
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Compare before and after: ${alt}`}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      )}
    </div>
  );
}
