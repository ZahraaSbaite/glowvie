import { prisma } from "@/lib/prisma";
import { Sparkle } from "@/components/Sparkles";
import { ServiceCategoryList, type CategoryGroup } from "@/components/ServiceCategoryList";

export const metadata = { title: "Services — Glow Vie Beauty Clinic" };
export const revalidate = 60;

const CATEGORY_ORDER = ["Facials", "Nails", "Lashes", "Tattoo"];
const CATEGORY_COPY: Record<string, { tagline: string; description: string }> = {
  Facials: {
    tagline: "Glow starts with healthy skin.",
    description:
      "Deep-cleansing, hydrating, and restorative facials tailored to your skin's needs — leaving you fresh, calm, and glowing from within.",
  },
  Nails: {
    tagline: "Beauty at your fingertips.",
    description:
      "Precision manicures, pedicures, and nail artistry — from clean classics to statement designs, finished with lasting care.",
  },
  Lashes: {
    tagline: "Lift your natural beauty.",
    description:
      "Lash lifts, tints, and extensions designed to open up your eyes and simplify your routine — effortless, every morning.",
  },
  Tattoo: {
    tagline: "Art that stays with you.",
    description:
      "Semi-permanent makeup and fine-line artistry, applied with a steady hand — so you wake up looking like the best version of you.",
  },
};

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });

  const categories = CATEGORY_ORDER.filter((c) => services.some((s) => s.category === c));
  const groups: CategoryGroup[] = categories.map((category) => ({
    category,
    tagline: CATEGORY_COPY[category]?.tagline ?? "",
    description: CATEGORY_COPY[category]?.description ?? "",
    items: services
      .filter((s) => s.category === category)
      .map((s) => ({ ...s, price: s.price ? Number(s.price) : null })),
  }));

  return (
    <>
      <section className="bg-bg-soft py-20 text-center">
        <span className="eyebrow flex items-center justify-center gap-2"><Sparkle size={14} /> Treatments</span>
        <h1 className="mt-3 text-5xl text-ink md:text-6xl">Our Services</h1>
        <p className="mx-auto mt-4 max-w-lg text-muted">
          From facials to nails, lashes, and semi-permanent makeup — every treatment is tailored to you.
        </p>
      </section>

      <section className="bg-surface py-20">
        <div className="container-lux">
          <ServiceCategoryList groups={groups} />
        </div>
      </section>
    </>
  );
}
