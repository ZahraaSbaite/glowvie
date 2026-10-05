import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  rating: z.number().int().min(1).max(5),
  quote: z.string().trim().min(5).max(600),
});

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(testimonials);
}

// Public — anyone visiting the site can leave a review. Admin's only moderation tool
// afterward is deleting one, not approving/authoring them (see admin testimonials page).
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse({ ...body, rating: Number(body.rating) });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const testimonial = await prisma.testimonial.create({
    data: {
      name: parsed.data.name,
      rating: parsed.data.rating,
      quote: parsed.data.quote,
    },
  });
  return NextResponse.json(testimonial, { status: 201 });
}
