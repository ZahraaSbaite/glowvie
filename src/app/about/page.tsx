import Image from "next/image";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Sparkle } from "@/components/Sparkles";

export const metadata = { title: "About — Glow Vie Beauty Clinic" };

export default function AboutPage() {
  return (
    <>
      <section className="bg-bg-soft py-20 text-center">
        <span className="eyebrow flex items-center justify-center gap-2"><Sparkle size={14} /> Our Story</span>
        <h1 className="mt-3 text-5xl text-ink md:text-6xl">About Glow Vie</h1>
      </section>

      <section className="bg-surface py-24">
        <div className="container-lux grid items-center gap-14 md:grid-cols-2">
          <div className="relative h-[460px] overflow-hidden rounded-xl3">
            <Image
              src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=1200"
              alt="Glow Vie treatment room"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-4xl leading-tight text-ink md:text-5xl">
              Where luxury meets meticulous care
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Glow Vie Beauty Clinic was founded on a simple belief: premium beauty care shouldn't
              feel rushed or impersonal. Our space blends a calming, elegant environment with
              skilled specialists and quality products, so every visit feels as good as it looks.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted">
              From your first appointment to your last touch-up, our team takes the time to get
              every detail right — nails, lashes, skin, and beyond — around your goals and your
              schedule.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-3 text-sm text-ink">
              <li className="flex items-center gap-2"><Sparkle size={12} className="text-brand-dark" /> Luxury environment</li>
              <li className="flex items-center gap-2"><Sparkle size={12} className="text-brand-dark" /> Skilled specialists</li>
              <li className="flex items-center gap-2"><Sparkle size={12} className="text-brand-dark" /> Quality products</li>
              <li className="flex items-center gap-2"><Sparkle size={12} className="text-brand-dark" /> Personalized care</li>
            </ul>
          </div>
        </div>
      </section>

      <WhyChooseUs />
    </>
  );
}
