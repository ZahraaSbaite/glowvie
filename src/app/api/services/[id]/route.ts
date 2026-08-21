import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return null;
  return session;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const service = await prisma.service.update({
    where: { id: params.id },
    data: {
      ...body,
      price: body.price !== undefined ? (body.price ? Number(body.price) : null) : undefined,
      durationMins: body.durationMins !== undefined ? Number(body.durationMins) : undefined,
      displayOrder: body.displayOrder !== undefined ? Number(body.displayOrder) : undefined,
    },
  });
  return NextResponse.json(service);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Soft-delete: keep history for existing appointments intact
  await prisma.service.update({ where: { id: params.id }, data: { isActive: false } });
  return NextResponse.json({ ok: true });
}
