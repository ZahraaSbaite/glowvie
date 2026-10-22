import { GlowBlobs } from "./GlowBlobs";

/**
 * The shared opening for every inner page: a small eyebrow, an oversized editorial title
 * whose last word flows in the glow gradient, and an optional line of copy. Extra content
 * (e.g. the FAQ search) goes in children.
 */
export function PageHeader({
  eyebrow,
  title,
  accent,
  description,
  children,
}: {
  eyebrow: string;
  title?: string;
  accent: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden pb-14 pt-14 md:pb-20 md:pt-20">
      <GlowBlobs />
      <div className="container-lux">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="mt-6 max-w-5xl text-5xl leading-[0.95] text-ink sm:text-7xl md:text-8xl">
          {title && <>{title} </>}
          <em className="text-glow pr-2">{accent}</em>
        </h1>
        {description && <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{description}</p>}
        {children}
      </div>
    </section>
  );
}
