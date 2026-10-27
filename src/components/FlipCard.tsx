"use client";

import { useState } from "react";

/**
 * A card that flips over in 3D: on hover with a mouse, on tap on touch screens, and when it
 * receives keyboard focus (so links on the back are reachable by tabbing). The parent sets
 * the height via className, since both faces are stacked absolutely.
 */
export function FlipCard({
  front,
  back,
  className = "",
  label,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  label: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`flip-card ${className}`}
      data-flipped={flipped || undefined}
      tabIndex={0}
      aria-label={label}
      onClick={(e) => {
        // Taps on the back's links/buttons should act, not flip the card back.
        if ((e.target as Element).closest("a, button")) return;
        setFlipped((f) => !f);
      }}
    >
      <div className="flip-card__inner">
        <div className="flip-card__face">{front}</div>
        <div className="flip-card__face flip-card__back">{back}</div>
      </div>
    </div>
  );
}
