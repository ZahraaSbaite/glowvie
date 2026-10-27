/**
 * Soft, slowly drifting colour blobs in the glow palette — the ambient backdrop behind headers.
 * Drawn as radial gradients rather than blurred circles: same soft look, but no filter: blur(),
 * which on iPhones eats enough graphics memory to make Safari give up and show a black page.
 */
const BLOBS = [
  { className: "-left-[10%] top-[5%] h-[45vw] max-h-[560px] w-[45vw] max-w-[560px]", color: "227,154,156", alpha: 0.38, delay: "0s" },
  { className: "right-[-8%] top-[-10%] h-[40vw] max-h-[520px] w-[40vw] max-w-[520px]", color: "205,182,230", alpha: 0.42, delay: "-6s" },
  { className: "bottom-[-20%] left-[35%] h-[38vw] max-h-[480px] w-[38vw] max-w-[480px]", color: "244,195,168", alpha: 0.42, delay: "-12s" },
];

export function GlowBlobs({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent)] ${className}`}
      aria-hidden="true"
    >
      {BLOBS.map((b) => (
        <div
          key={b.delay}
          className={`absolute animate-drift rounded-full ${b.className}`}
          style={{
            animationDelay: b.delay,
            // Scaled up so the gradient's soft falloff spreads like the old blur did.
            scale: "1.6",
            background: `radial-gradient(circle, rgba(${b.color},${b.alpha}) 0%, rgba(${b.color},${b.alpha * 0.45}) 35%, transparent 70%)`,
          }}
        />
      ))}
    </div>
  );
}
