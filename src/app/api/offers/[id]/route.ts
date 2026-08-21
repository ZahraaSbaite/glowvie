import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { toUtcDate } from "@/lib/utils";

async function requireAdmin() {
  const session = await getSession();
  return session && session.role === "ADMIN" ? session : null;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const offer = await prisma.offer.update({
    where: { id: params.id },
    data: {
      ...body,
      originalPrice: body.originalPrice !== undefined ? (body.originalPrice ? Number(body.originalPrice) : null) : undefined,
      promoPrice: body.promoPrice !== undefined ? (body.promoPrice ? Number(body.promoPrice) : null) : undefined,
      validUntil: body.validUntil !== undefined ? (body.validUntil ? toUtcDate(body.validUntil) : null) : undefined,
      displayOrder: body.displayOrder !== undefined ? Number(body.displayOrder) : undefined,
    },
  });
  return NextResponse.json({
    ...offer,
    originalPrice: offer.originalPrice ? Number(offer.originalPrice) : null,
    promoPrice: offer.promoPrice ? Number(offer.promoPrice) : null,
    validUntil: offer.validUntil ? offer.validUntil.toISOString().slice(0, 10) : null,
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.offer.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
