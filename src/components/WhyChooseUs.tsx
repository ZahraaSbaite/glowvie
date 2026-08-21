import { Award, Cpu, Stethoscope, Gem, ClipboardList, Heart } from "lucide-react";

const points = [
  { icon: Award, title: "Skilled Specialists", desc: "Every treatment is performed by trained, experienced professionals." },
  { icon: Cpu, title: "Quality Products", desc: "We use premium, trusted products and tools across every treatment." },
  { icon: Stethoscope, title: "Hygiene First", desc: "Clean, sanitized tools and stations for every single guest." },
  { icon: Gem, title: "Luxury Environment", desc: "A calm, refined space designed for your comfort from arrival to departure." },
  { icon: ClipboardList, title: "Personalized Plans", desc: "Every treatment is tailored to your skin, style, and goals." },
  { icon: Heart, title: "High Satisfaction", desc: "A client-first approach that keeps our guests coming back." },
];

export function WhyChooseUs() {
  return (
    <section className="bg-surface py-24">
      <div className="container-lux">
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow">Why Glow Vie</span>
          <h2 className="mt-3 text-4xl text-ink md:text-5xl">Care, refined to every detail</h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((p, i) => (
            <div
              key={p.title}
              className="card-lux group p-8 hover:-translate-y-1 hover:shadow-card"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-bg-soft text-brand-dark transition-colors group-hover:bg-brand group-hover:text-white">
                <p.icon size={22} />
              </div>
              <h3 className="mb-2 text-xl text-ink">{p.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
