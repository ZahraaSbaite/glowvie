import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { toUtcDate } from "@/lib/utils";

function serialize(o: { originalPrice: unknown; promoPrice: unknown; validUntil: Date | null; [k: string]: unknown }) {
  return {
    ...o,
    originalPrice: o.originalPrice ? Number(o.originalPrice) : null,
    promoPrice: o.promoPrice ? Number(o.promoPrice) : null,
    validUntil: o.validUntil ? o.validUntil.toISOString().slice(0, 10) : null,
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const session = await getSession();
  const showAll = searchParams.get("all") === "1" && session?.role === "ADMIN";

  const todayIso = new Date().toISOString().slice(0, 10);
  const offers = await prisma.offer.findMany({
    where: showAll
      ? {}
      : { isActive: true, OR: [{ validUntil: null }, { validUntil: { gte: toUtcDate(todayIso) } }] },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(offers.map(serialize));
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const offer = await prisma.offer.create({
    data: {
      title: body.title,
      description: body.description || "",
      category: body.category || "Promotion",
      imageUrl: body.imageUrl || "",
      originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
      promoPrice: body.promoPrice ? Number(body.promoPrice) : null,
      validUntil: body.validUntil ? toUtcDate(body.validUntil) : null,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      displayOrder: Number(body.displayOrder) || 0,
    },
  });
  return NextResponse.json(serialize(offer), { status: 201 });
}
