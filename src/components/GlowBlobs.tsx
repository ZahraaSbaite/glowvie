/** Soft, slowly drifting colour blobs in the glow palette — the ambient backdrop behind headers. */
export function GlowBlobs({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent)] ${className}`}
      aria-hidden="true"
    >
      <div className="absolute -left-[10%] top-[5%] h-[45vw] max-h-[560px] w-[45vw] max-w-[560px] animate-drift rounded-full bg-rose/30 blur-[90px]" />
      <div
        className="absolute right-[-8%] top-[-10%] h-[40vw] max-h-[520px] w-[40vw] max-w-[520px] animate-drift rounded-full bg-lilac/35 blur-[90px]"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="absolute bottom-[-20%] left-[35%] h-[38vw] max-h-[480px] w-[38vw] max-w-[480px] animate-drift rounded-full bg-peach/35 blur-[90px]"
        style={{ animationDelay: "-12s" }}
      />
    </div>
  );
}
