import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(testimonials);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const testimonial = await prisma.testimonial.create({
    data: {
      name: body.name,
      rating: Number(body.rating) || 5,
      quote: body.quote,
      imageUrl: body.imageUrl || "",
    },
  });
  return NextResponse.json(testimonial, { status: 201 });
}
