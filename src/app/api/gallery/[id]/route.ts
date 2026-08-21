import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getSession();
  return session && session.role === "ADMIN" ? session : null;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const image = await prisma.galleryImage.update({
    where: { id: params.id },
    data: {
      ...body,
      displayOrder: body.displayOrder !== undefined ? Number(body.displayOrder) : undefined,
    },
  });
  return NextResponse.json(image);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.galleryImage.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
