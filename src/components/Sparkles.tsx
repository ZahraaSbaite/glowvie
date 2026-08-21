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
