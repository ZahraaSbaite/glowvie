import { Instagram } from "lucide-react";

// Static placeholders until INSTAGRAM_ACCESS_TOKEN is configured — see /src/app/api/instagram/route.ts
const placeholderPosts = [
  "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=600",
  "https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=600",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600",
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600",
];

export function InstagramSection() {
  return (
    <section className="bg-bg-soft py-24">
      <div className="container-lux text-center">
        <span className="eyebrow">@glowvie_lounge</span>
        <h2 className="mt-3 text-4xl text-ink md:text-5xl">Follow Our Glow</h2>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {placeholderPosts.map((src, i) => (
            <a
              key={i}
              href="https://www.instagram.com/glowvie_lounge"
              target="_blank"
              rel="noreferrer"
              className="group relative block aspect-square overflow-hidden rounded-xl2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt="Instagram post"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors group-hover:bg-ink/30">
                <Instagram className="text-white opacity-0 transition-opacity group-hover:opacity-100" size={22} />
              </div>
            </a>
          ))}
        </div>

        <a href="https://www.instagram.com/glowvie_lounge" target="_blank" rel="noreferrer" className="btn-primary mt-10 inline-flex">
          <Instagram size={16} /> Follow on Instagram
        </a>
      </div>
    </section>
  );
}
