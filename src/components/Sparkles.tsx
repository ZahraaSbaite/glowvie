type SparkleProps = {
  className?: string;
  size?: number;
  delay?: number;
};

/** A single four-point sparkle, matching the logo's mark. Used sparingly as a signature accent. */
export function Sparkle({ className = "", size = 20, delay = 0 }: SparkleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`animate-sparkle ${className}`}
      style={{ animationDelay: `${delay}s` }}
      aria-hidden="true"
    >
      <path
        d="M12 1C12.4 6.5 13.5 10.6 17.5 12C13.5 13.4 12.4 17.5 12 23C11.6 17.5 10.5 13.4 6.5 12C10.5 10.6 11.6 6.5 12 1Z"
        fill="currentColor"
      />
    </svg>
  );
}

type Bubble = { top: string; left: string; size: number; opacity: number; blur?: boolean; delay: number };

const BUBBLES: Bubble[] = [
  { top: "6%", left: "58%", size: 8, opacity: 0.55, delay: 0 },
  { top: "10%", left: "82%", size: 20, opacity: 0.32, blur: true, delay: 0.4 },
  { top: "16%", left: "96%", size: 6, opacity: 0.65, delay: 1.1 },
  { top: "26%", left: "68%", size: 5, opacity: 0.7, delay: 0.8 },
  { top: "34%", left: "92%", size: 14, opacity: 0.4, blur: true, delay: 0.2 },
  { top: "46%", left: "60%", size: 4, opacity: 0.75, delay: 1.6 },
  { top: "50%", left: "99%", size: 10, opacity: 0.5, delay: 0.6 },
  { top: "60%", left: "86%", size: 26, opacity: 0.28, blur: true, delay: 1.3 },
  { top: "68%", left: "66%", size: 6, opacity: 0.6, delay: 0.9 },
  { top: "76%", left: "94%", size: 8, opacity: 0.55, delay: 0.3 },
  { top: "84%", left: "78%", size: 16, opacity: 0.35, blur: true, delay: 1.0 },
  { top: "90%", left: "62%", size: 5, opacity: 0.65, delay: 1.7 },
];

/** Soft champagne-gold bokeh "bubbles" of varying size and blur, scattered near the hero visual. */
export function BubbleField({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="absolute animate-float rounded-full"
          style={{
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            opacity: b.opacity,
            filter: b.blur ? "blur(2px)" : undefined,
            background:
              "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95), rgba(201,166,107,0.55) 55%, rgba(201,166,107,0) 76%)",
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/** A loose cluster of sparkles used as ambient decoration in hero/section backgrounds. */
export function SparkleField({ className = "" }: { className?: string }) {
  const sparkles = [
    { top: "12%", left: "8%", size: 16, delay: 0 },
    { top: "22%", left: "88%", size: 22, delay: 0.6 },
    { top: "68%", left: "5%", size: 14, delay: 1.2 },
    { top: "78%", left: "92%", size: 18, delay: 0.3 },
    { top: "45%", left: "50%", size: 12, delay: 1.8 },
  ];
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden text-brand ${className}`} aria-hidden="true">
      {sparkles.map((s, i) => (
        <div key={i} className="absolute" style={{ top: s.top, left: s.left }}>
          <Sparkle size={s.size} delay={s.delay} />
        </div>
      ))}
    </div>
  );
}
