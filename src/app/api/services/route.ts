import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });
  return NextResponse.json(
    services.map((s) => ({ ...s, price: s.price ? Number(s.price) : null }))
  );
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const service = await prisma.service.create({
    data: {
      title: body.title,
      slug: body.slug,
      category: body.category,
      shortDesc: body.shortDesc,
      fullDesc: body.fullDesc || "",
      benefits: body.benefits || [],
      procedure: body.procedure || "",
      recoveryTime: body.recoveryTime || "",
      prepInfo: body.prepInfo || "",
      importantNotes: body.importantNotes || "",
      durationMins: Number(body.durationMins) || 60,
      price: body.price ? Number(body.price) : null,
      imageUrl: body.imageUrl || "",
      featured: Boolean(body.featured),
      displayOrder: Number(body.displayOrder) || 0,
    },
  });
  return NextResponse.json(service, { status: 201 });
}
