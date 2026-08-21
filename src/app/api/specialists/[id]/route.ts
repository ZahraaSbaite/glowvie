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
  const { serviceIds, ...fields } = body as { serviceIds?: string[]; [key: string]: unknown };

  const specialist = await prisma.$transaction(async (tx) => {
    const updated = await tx.specialist.update({
      where: { id: params.id },
      data: {
        ...(fields.name !== undefined ? { name: fields.name as string } : {}),
        ...(fields.title !== undefined ? { title: fields.title as string } : {}),
        ...(fields.bio !== undefined ? { bio: fields.bio as string } : {}),
        ...(fields.email !== undefined ? { email: fields.email as string } : {}),
        ...(fields.phone !== undefined ? { phone: fields.phone as string } : {}),
        ...(fields.imageUrl !== undefined ? { imageUrl: fields.imageUrl as string } : {}),
        ...(fields.isActive !== undefined ? { isActive: Boolean(fields.isActive) } : {}),
      },
    });

    if (serviceIds) {
      await tx.serviceSpecialist.deleteMany({ where: { specialistId: params.id } });
      if (serviceIds.length > 0) {
        await tx.serviceSpecialist.createMany({
          data: serviceIds.map((serviceId) => ({ serviceId, specialistId: params.id })),
        });
      }
    }

    return updated;
  });

  return NextResponse.json(specialist);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Soft-delete: keep history for existing appointments intact
  await prisma.specialist.update({ where: { id: params.id }, data: { isActive: false } });
  return NextResponse.json({ ok: true });
}
