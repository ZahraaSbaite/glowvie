import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Admin user ---
  const adminPassword = await bcrypt.hash("GlowVieAdmin123!", 10);
  await prisma.user.upsert({
    where: { email: "admin@glowvie.com" },
    update: {},
    create: {
      fullName: "Glow Vie Admin",
      email: "admin@glowvie.com",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  // --- Working hours, Mon–Sat open, Sunday closed ---
  const defaults = [
    { weekday: 0, isOpen: false, openTime: "10:00", closeTime: "16:00" }, // Sun
    { weekday: 1, isOpen: true, openTime: "09:00", closeTime: "18:00" }, // Mon
    { weekday: 2, isOpen: true, openTime: "09:00", closeTime: "18:00" }, // Tue
    { weekday: 3, isOpen: true, openTime: "09:00", closeTime: "18:00" }, // Wed
    { weekday: 4, isOpen: true, openTime: "09:00", closeTime: "18:00" }, // Thu
    { weekday: 5, isOpen: true, openTime: "09:00", closeTime: "19:00" }, // Fri
    { weekday: 6, isOpen: true, openTime: "10:00", closeTime: "17:00" }, // Sat
  ];
  for (const d of defaults) {
    await prisma.workingHours.upsert({
      where: { weekday: d.weekday },
      update: d,
      create: d,
    });
  }

  // --- Site settings ---
  const siteSettings = {
    address: "Beirut, Lebanon",
    phone: "+961 3 000 000",
    whatsapp: "9613000000",
    email: "hello@glowvie.com",
    instagramUrl: "https://www.instagram.com/glowvie_lounge",
    mapEmbedUrl: "https://www.google.com/maps?q=33.8548611,35.5120000&output=embed",
  };
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: siteSettings,
    create: { id: "singleton", ...siteSettings },
  });

  // --- Services (from Glow Vie's current Instagram price list) ---
  // Real photos of Glow Vie's own work, supplied by the client — stored in /public/images/categories.
  const facialImg = "/images/categories/facial.jpg";
  const nailImg = "/images/categories/nails.jpg";
  const nailImg2 = "/images/categories/nails.jpg";
  const lashImg = "/images/categories/lashes.jpg";
  const tattooImg = "/images/categories/tattoo.jpg";

  const services = [
    // --- Facials ---
    {
      title: "Facial",
      slug: "facial",
      category: "Facials",
      shortDesc: "A classic cleansing facial to refresh and brighten your skin.",
      fullDesc: "A relaxing, deep-cleansing facial that clears impurities and leaves skin feeling fresh and balanced.",
      benefits: ["Deep cleansing", "Refreshed complexion", "Relaxing"],
      procedure: "Cleanse, steam, extraction, hydrating mask.",
      recoveryTime: "None.",
      durationMins: 45,
      price: 20,
      featured: false,
      displayOrder: 1,
      imageUrl: facialImg,
    },
    {
      title: "Deep Facial",
      slug: "deep-facial",
      category: "Facials",
      shortDesc: "An intensive facial for a deeper clean and lasting glow.",
      fullDesc: "A more thorough version of our classic facial with extended extraction and nourishing treatment steps for visibly clearer skin.",
      benefits: ["Deep pore cleansing", "Brighter skin tone", "Long-lasting glow"],
      procedure: "Double cleanse, steam, thorough extraction, mask, moisturize.",
      recoveryTime: "None.",
      durationMins: 60,
      price: 25,
      featured: true,
      displayOrder: 2,
      imageUrl: facialImg,
    },
    {
      title: "Plasma",
      slug: "plasma",
      category: "Facials",
      shortDesc: "Plasma skin treatment for a firmer, more even complexion.",
      fullDesc: "A targeted plasma treatment designed to refresh skin texture and tone.",
      benefits: ["Improves texture", "Evens tone"],
      procedure: "Cleanse, plasma application, soothing finish.",
      recoveryTime: "Mild redness possible for a few hours.",
      durationMins: 45,
      price: 20,
      displayOrder: 3,
      imageUrl: facialImg,
    },
    {
      title: "Carbon Laser",
      slug: "carbon-laser",
      category: "Facials",
      shortDesc: "Carbon laser facial to refine pores and brighten skin — priced per session.",
      fullDesc: "A carbon layer is applied and lifted with laser to exfoliate deeply, refine pores, and even out skin tone. Priced per session.",
      benefits: ["Refines pores", "Brightens complexion", "Reduces oiliness"],
      procedure: "Carbon paste application, laser pass, cooling finish.",
      recoveryTime: "None — light pinkness for under an hour.",
      durationMins: 30,
      price: 10,
      displayOrder: 4,
      imageUrl: facialImg,
    },
    {
      title: "Microneedling",
      slug: "microneedling",
      category: "Facials",
      shortDesc: "Collagen induction therapy for firmer, smoother skin.",
      fullDesc: "Fine micro-needles create controlled micro-channels that trigger the skin's natural collagen production.",
      benefits: ["Boosts collagen", "Improves texture", "Reduces scarring"],
      procedure: "Numbing cream, micro-needling pass, calming serum.",
      recoveryTime: "1–2 days of mild redness.",
      durationMins: 45,
      price: 20,
      displayOrder: 5,
      imageUrl: facialImg,
    },
    {
      title: "Summer Peel",
      slug: "summer-peel",
      category: "Facials",
      shortDesc: "A light seasonal peel to refresh sun-exposed, tired skin.",
      fullDesc: "A gentle exfoliating peel formulated to brighten and refresh skin during the warmer months.",
      benefits: ["Brightens skin", "Removes dullness", "Light exfoliation"],
      procedure: "Cleanse, peel application, neutralize, hydrate.",
      recoveryTime: "Light peeling possible for 1–2 days.",
      durationMins: 30,
      price: 25,
      displayOrder: 6,
      imageUrl: facialImg,
    },
    {
      title: "Light Peel",
      slug: "light-peel",
      category: "Facials",
      shortDesc: "A gentle chemical peel to renew and even out skin tone.",
      fullDesc: "A tailored, gentle-strength peel that resurfaces the top skin layer to reveal a brighter, more even complexion.",
      benefits: ["Evens skin tone", "Improves texture", "Gentle formula"],
      procedure: "Cleanse, layered peel application, neutralize, hydrating finish.",
      recoveryTime: "1–3 days of light peeling.",
      durationMins: 30,
      price: 30,
      displayOrder: 7,
      imageUrl: facialImg,
    },
    // --- Nails ---
    {
      title: "Minicure",
      slug: "minicure",
      category: "Nails",
      shortDesc: "A quick, essential nail tidy-up for your hands.",
      fullDesc: "A fast hand treatment covering shaping, cuticle care and a light buff — perfect for a quick refresh.",
      benefits: ["Quick service", "Neat, clean nails"],
      procedure: "Shape, cuticle care, buff.",
      recoveryTime: "None.",
      durationMins: 20,
      price: 5,
      displayOrder: 10,
      imageUrl: nailImg,
    },
    {
      title: "Pedicure",
      slug: "pedicure",
      category: "Nails",
      shortDesc: "A relaxing foot treatment to leave your feet soft and polished.",
      fullDesc: "Foot soak, shaping, cuticle care and buffing for smooth, well-groomed feet.",
      benefits: ["Softens feet", "Neat, clean nails", "Relaxing"],
      procedure: "Soak, shape, cuticle care, buff.",
      recoveryTime: "None.",
      durationMins: 30,
      price: 7,
      displayOrder: 11,
      imageUrl: nailImg2,
    },
    {
      title: "Pose",
      slug: "pose",
      category: "Nails",
      shortDesc: "Plain polish application.",
      fullDesc: "A simple, single-color polish application on natural nails.",
      benefits: ["Fast", "Fresh color"],
      procedure: "Shape, base coat, color, top coat.",
      recoveryTime: "None.",
      durationMins: 15,
      price: 3,
      displayOrder: 12,
      imageUrl: nailImg,
    },
    {
      title: "French Pose",
      slug: "french-pose",
      category: "Nails",
      shortDesc: "Classic French-tip polish application.",
      fullDesc: "A timeless French-tip polish finish on natural nails.",
      benefits: ["Classic look", "Clean finish"],
      procedure: "Shape, base coat, white tip, sheer overlay, top coat.",
      recoveryTime: "None.",
      durationMins: 25,
      price: 5,
      displayOrder: 13,
      imageUrl: nailImg,
    },
    {
      title: "Gel Color",
      slug: "gel-color",
      category: "Nails",
      shortDesc: "Long-lasting gel polish in the color of your choice.",
      fullDesc: "Chip-resistant gel polish, cured for a glossy, long-lasting finish.",
      benefits: ["Long-lasting", "High shine", "Chip-resistant"],
      procedure: "Shape, base gel, color gel, cure, top gel.",
      recoveryTime: "None.",
      durationMins: 45,
      price: 10,
      displayOrder: 14,
      imageUrl: nailImg2,
    },
    {
      title: "French Ombre Gel Color",
      slug: "french-ombre-gel-color",
      category: "Nails",
      shortDesc: "Soft ombré French finish in long-lasting gel.",
      fullDesc: "A blended, gradient French look applied in durable gel polish.",
      benefits: ["Trendy finish", "Long-lasting", "High shine"],
      procedure: "Shape, base gel, ombré blend application, cure, top gel.",
      recoveryTime: "None.",
      durationMins: 60,
      price: 15,
      displayOrder: 15,
      imageUrl: nailImg2,
    },
    {
      title: "Gel Extension",
      slug: "gel-extension",
      category: "Nails",
      shortDesc: "Sculpted gel extensions for added length and strength.",
      fullDesc: "Gel is sculpted over nail forms or tips to build length and a durable, natural-looking finish.",
      benefits: ["Adds length", "Durable", "Natural finish"],
      procedure: "Prep, form/tip application, gel sculpting, shape, cure, finish.",
      recoveryTime: "None.",
      durationMins: 90,
      price: 30,
      displayOrder: 16,
      imageUrl: nailImg,
    },
    {
      title: "Fiber",
      slug: "fiber",
      category: "Nails",
      shortDesc: "Fiberglass nail extension system for extra strength.",
      fullDesc: "A reinforced fiber overlay system for strong, natural-looking extensions.",
      benefits: ["Extra strength", "Natural look", "Durable"],
      procedure: "Prep, fiber application, shaping, cure, finish.",
      recoveryTime: "None.",
      durationMins: 90,
      price: 40,
      displayOrder: 17,
      imageUrl: nailImg,
    },
    {
      title: "Refill Gel Extensions",
      slug: "refill-gel-extensions",
      category: "Nails",
      shortDesc: "Maintenance fill-in for existing gel extensions.",
      fullDesc: "Regrowth is filled and extensions are reshaped and refinished to look freshly done.",
      benefits: ["Maintains extensions", "Fresh finish"],
      procedure: "Fill regrowth, reshape, cure, finish.",
      recoveryTime: "None.",
      durationMins: 60,
      price: 20,
      displayOrder: 18,
      imageUrl: nailImg,
    },
    {
      title: "Rubber Base",
      slug: "rubber-base",
      category: "Nails",
      shortDesc: "Flexible rubber base gel for a strong, natural manicure.",
      fullDesc: "A flexible base gel that strengthens natural nails while allowing a color or French finish on top.",
      benefits: ["Strengthens nails", "Flexible, chip-resistant"],
      procedure: "Shape, rubber base application, cure, color/finish.",
      recoveryTime: "None.",
      durationMins: 45,
      price: 10,
      displayOrder: 19,
      imageUrl: nailImg2,
    },
    {
      title: "Fake Nails",
      slug: "fake-nails",
      category: "Nails",
      shortDesc: "Press-on style false nail application.",
      fullDesc: "False nail tips applied and shaped for instant length and a polished look.",
      benefits: ["Instant length", "Quick service"],
      procedure: "Fit tips, glue, shape, finish.",
      recoveryTime: "None.",
      durationMins: 30,
      price: 10,
      displayOrder: 20,
      imageUrl: nailImg,
    },
    {
      title: "Remove Gel Color",
      slug: "remove-gel-color",
      category: "Nails",
      shortDesc: "Safe soak-off removal of gel polish.",
      fullDesc: "Gentle soak-off removal that protects the natural nail bed.",
      benefits: ["Nail-safe removal"],
      procedure: "Soak, gently remove, buff, condition.",
      recoveryTime: "None.",
      durationMins: 15,
      price: 2,
      displayOrder: 21,
      imageUrl: nailImg,
    },
    {
      title: "Hand Parafine",
      slug: "hand-parafine",
      category: "Nails",
      shortDesc: "Warm paraffin wax treatment for soft, hydrated hands.",
      fullDesc: "Hands are dipped in warm paraffin wax to deeply moisturize and soothe skin.",
      benefits: ["Deep hydration", "Soothing warmth"],
      procedure: "Cleanse, warm paraffin dip, wrap, remove, moisturize.",
      recoveryTime: "None.",
      durationMins: 20,
      price: 5,
      displayOrder: 22,
      imageUrl: nailImg2,
    },
    {
      title: "Feet Parafine",
      slug: "feet-parafine",
      category: "Nails",
      shortDesc: "Warm paraffin wax treatment for soft, hydrated feet.",
      fullDesc: "Feet are dipped in warm paraffin wax to deeply moisturize and soothe tired skin.",
      benefits: ["Deep hydration", "Soothing warmth"],
      procedure: "Cleanse, warm paraffin dip, wrap, remove, moisturize.",
      recoveryTime: "None.",
      durationMins: 20,
      price: 5,
      displayOrder: 23,
      imageUrl: nailImg2,
    },
    // --- Lashes ---
    {
      title: "Lifting & Lamination",
      slug: "lash-lift-lamination",
      category: "Lashes",
      shortDesc: "Lifts and tints natural lashes for a curled, fuller look.",
      fullDesc: "Your natural lashes are lifted and set for a longer-looking, curled effect without extensions.",
      benefits: ["Low maintenance", "Enhances natural lashes", "Lasts several weeks"],
      procedure: "Cleanse, lifting solution, setting solution, tint, nourishing serum.",
      recoveryTime: "None.",
      durationMins: 45,
      price: 10,
      displayOrder: 30,
      imageUrl: lashImg,
    },
    {
      title: "Single Lashes",
      slug: "single-lashes",
      category: "Lashes",
      shortDesc: "Classic one-to-one lash extensions for natural definition.",
      fullDesc: "Individual extensions are applied one-to-one to natural lashes for a soft, defined look.",
      benefits: ["Natural look", "Lightweight", "Long-lasting"],
      procedure: "Cleanse, isolate lashes, apply extensions, set.",
      recoveryTime: "None.",
      durationMins: 60,
      price: 20,
      featured: false,
      displayOrder: 31,
      imageUrl: lashImg,
    },
    {
      title: "Hybrid",
      slug: "hybrid-lashes",
      category: "Lashes",
      shortDesc: "A mix of classic and volume lashes for texture and fullness.",
      fullDesc: "A blend of classic and volume fans creates a textured, fuller lash line.",
      benefits: ["Fuller than classic", "Textured finish", "Long-lasting"],
      procedure: "Cleanse, isolate lashes, apply mixed fans, set.",
      recoveryTime: "None.",
      durationMins: 90,
      price: 30,
      displayOrder: 32,
      imageUrl: lashImg,
    },
    {
      title: "Volume",
      slug: "volume-lashes",
      category: "Lashes",
      shortDesc: "Full, dramatic volume lash extensions.",
      fullDesc: "Multiple lightweight extensions are fanned onto each natural lash for maximum fullness and drama.",
      benefits: ["Dramatic fullness", "Long-lasting", "Customizable"],
      procedure: "Cleanse, isolate lashes, apply volume fans, set.",
      recoveryTime: "None.",
      durationMins: 120,
      price: 40,
      featured: true,
      displayOrder: 33,
      imageUrl: lashImg,
    },
    // --- Tattoo (semi-permanent makeup) ---
    {
      title: "Microblading",
      slug: "microblading",
      category: "Tattoo",
      shortDesc: "Semi-permanent, hair-stroke eyebrow tattooing.",
      fullDesc: "Fine, hair-like strokes are hand-drawn into the brow to create natural-looking, fuller eyebrows.",
      benefits: ["Natural hair-stroke effect", "Saves daily makeup time", "Lasts 1–2 years"],
      procedure: "Consultation & mapping, numbing, hair-stroke tattooing, aftercare guidance.",
      recoveryTime: "7–14 days of light scabbing and fading as it heals.",
      durationMins: 90,
      price: 50,
      featured: true,
      displayOrder: 40,
      imageUrl: tattooImg,
    },
    {
      title: "Lip Blush",
      slug: "lip-blush",
      category: "Tattoo",
      shortDesc: "Semi-permanent lip tint for natural, long-lasting color.",
      fullDesc: "Pigment is deposited into the lips to enhance natural shape and add soft, long-lasting color.",
      benefits: ["Natural tint", "Defines lip shape", "Long-lasting"],
      procedure: "Consultation & color matching, numbing, pigment application, aftercare guidance.",
      recoveryTime: "5–10 days of light peeling as color settles.",
      durationMins: 90,
      price: 50,
      displayOrder: 41,
      imageUrl: tattooImg,
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }

  // Deactivate any previously-seeded services that are no longer on the menu
  // (kept, not deleted, so past appointments referencing them stay intact).
  const currentSlugs = services.map((s) => s.slug);
  await prisma.service.updateMany({
    where: { slug: { notIn: currentSlugs } },
    data: { isActive: false, featured: false },
  });

  // --- Testimonials ---
  const testimonials = [
    { name: "Layla H.", rating: 5, quote: "The most luxurious lounge experience I've had — my skin has never looked better." },
    { name: "Rita K.", rating: 5, quote: "Professional, clean, and my nails have never lasted this long." },
    { name: "Sarah M.", rating: 5, quote: "Booking was effortless and the staff made me feel completely at ease." },
    { name: "Nour A.", rating: 5, quote: "Glow Vie is my go-to for every treatment now. Truly premium care." },
  ];
  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t }).catch(() => {});
  }

  // --- Staff ---
  const nailServices = await prisma.service.findMany({ where: { category: "Nails" }, select: { id: true } });
  const lashServices = await prisma.service.findMany({ where: { category: "Lashes" }, select: { id: true } });
  const facialAndTattooServices = await prisma.service.findMany({
    where: { category: { in: ["Facials", "Tattoo"] } },
    select: { id: true },
  });

  const staffData = [
    {
      name: "Maya Haddad",
      title: "Senior Nail Technician",
      bio: "Maya has been perfecting nail art and extensions for over 8 years, known for flawless gel work.",
      email: "maya@glowvie.com",
      phone: "+961 3 111 111",
      imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800",
      serviceIds: nailServices.map((s) => s.id),
      fridayOff: true,
    },
    {
      name: "Sara Khalil",
      title: "Lash & Brow Specialist",
      bio: "Sara specializes in lash lifts, extensions, and volume sets tailored to every eye shape.",
      email: "sara@glowvie.com",
      phone: "+961 3 222 222",
      imageUrl: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=800",
      serviceIds: lashServices.map((s) => s.id),
      fridayOff: false,
    },
    {
      name: "Nour Fares",
      title: "Facial & Semi-Permanent Makeup Specialist",
      bio: "Nour blends skincare expertise with precision microblading and lip blush artistry.",
      email: "nour@glowvie.com",
      phone: "+961 3 333 333",
      imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800",
      serviceIds: facialAndTattooServices.map((s) => s.id),
      fridayOff: false,
    },
  ];

  for (const s of staffData) {
    const { serviceIds, fridayOff, ...fields } = s;
    const existingStaff = await prisma.specialist.findFirst({ where: { name: fields.name } });
    const specialist = existingStaff
      ? await prisma.specialist.update({ where: { id: existingStaff.id }, data: fields })
      : await prisma.specialist.create({ data: fields });

    await prisma.serviceSpecialist.deleteMany({ where: { specialistId: specialist.id } });
    if (serviceIds.length > 0) {
      await prisma.serviceSpecialist.createMany({
        data: serviceIds.map((serviceId) => ({ serviceId, specialistId: specialist.id })),
      });
    }

    if (fridayOff) {
      await prisma.staffWorkingHours.upsert({
        where: { specialistId_weekday: { specialistId: specialist.id, weekday: 5 } },
        update: { isOpen: false },
        create: { specialistId: specialist.id, weekday: 5, isOpen: false },
      });
    }
  }

  // --- Offers ---
  const offers = [
    {
      title: "New Client Special",
      description: "First-time guests enjoy a discounted Deep Facial — the perfect introduction to Glow Vie.",
      category: "New Client",
      imageUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=1200",
      originalPrice: 25,
      promoPrice: 20,
      validUntil: "2026-12-31",
      displayOrder: 1,
    },
    {
      title: "Lash & Brow Bundle",
      description: "Lifting & Lamination paired with Single Lashes for a fuller, low-maintenance look.",
      category: "Package",
      imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200",
      originalPrice: 30,
      promoPrice: 25,
      validUntil: "2026-12-31",
      displayOrder: 2,
    },
    {
      title: "Summer Glow Package",
      description: "Summer Peel + Carbon Laser combo for brighter, refreshed skin all season.",
      category: "Seasonal",
      imageUrl: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=1200",
      originalPrice: 35,
      promoPrice: 28,
      validUntil: "2026-10-31",
      displayOrder: 3,
    },
    {
      title: "Bridal Nails Package",
      description: "Gel Extension with a French Ombré finish — booked well ahead for your big day.",
      category: "Package",
      imageUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=1200",
      originalPrice: 45,
      promoPrice: 38,
      validUntil: "2026-12-31",
      displayOrder: 4,
    },
    {
      title: "Winter Warmth — Paraffin Duo",
      description: "Hand and Feet Parafine treatments bundled for the cold season.",
      category: "Seasonal",
      imageUrl: "https://images.unsplash.com/photo-1595475884562-073c30d45670?q=80&w=1200",
      originalPrice: 10,
      promoPrice: 8,
      validUntil: "2026-01-31", // intentionally in the past — proves expired offers auto-hide
      displayOrder: 5,
    },
  ];
  for (const o of offers) {
    const existing = await prisma.offer.findFirst({ where: { title: o.title } });
    if (existing) {
      await prisma.offer.update({ where: { id: existing.id }, data: { ...o, validUntil: new Date(`${o.validUntil}T00:00:00Z`) } });
    } else {
      await prisma.offer.create({ data: { ...o, validUntil: new Date(`${o.validUntil}T00:00:00Z`) } });
    }
  }

  // --- Gallery ---
  const galleryItems = [
    { category: "Clinic", title: "Our treatment lounge", imageUrl: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=1200", isBeforeAfter: false },
    { category: "Clinic", title: "Reception area", imageUrl: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1200", isBeforeAfter: false },
    { category: "Skin", title: "Facial treatment in progress", imageUrl: facialImg, isBeforeAfter: false },
    { category: "Skin", title: "Deep Facial glow", beforeUrl: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1200", afterUrl: "https://images.unsplash.com/photo-1523263685509-57c1d050d19b?q=80&w=1200", isBeforeAfter: true },
    { category: "Nails", title: "Gel color manicure", imageUrl: nailImg2, isBeforeAfter: false },
    { category: "Nails", title: "Gel extension transformation", beforeUrl: nailImg, afterUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1200", isBeforeAfter: true },
    { category: "Lashes", title: "Volume lash set", imageUrl: lashImg, isBeforeAfter: false },
    { category: "Lashes", title: "Lash lift result", beforeUrl: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?q=80&w=1200", afterUrl: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=1200", isBeforeAfter: true },
    { category: "Treatments", title: "Microblading result", beforeUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800", afterUrl: tattooImg, isBeforeAfter: true },
  ];
  for (const g of galleryItems) {
    const existing = await prisma.galleryImage.findFirst({ where: { title: g.title } });
    const data = {
      category: g.category,
      title: g.title,
      imageUrl: (g as any).imageUrl || "",
      beforeUrl: (g as any).beforeUrl || "",
      afterUrl: (g as any).afterUrl || "",
      isBeforeAfter: g.isBeforeAfter,
      consentConfirmed: true,
      isActive: true,
    };
    if (existing) {
      await prisma.galleryImage.update({ where: { id: existing.id }, data });
    } else {
      await prisma.galleryImage.create({ data });
    }
  }

  console.log("Seed complete. Admin login: admin@glowvie.com / GlowVieAdmin123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
