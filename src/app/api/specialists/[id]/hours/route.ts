import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const hours = await prisma.staffWorkingHours.findMany({
    where: { specialistId: params.id },
    orderBy: { weekday: "asc" },
  });
  return NextResponse.json(hours);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json(); // { weekday, isOpen, openTime, closeTime, breakStart, breakEnd }
  const updated = await prisma.staffWorkingHours.upsert({
    where: { specialistId_weekday: { specialistId: params.id, weekday: body.weekday } },
    update: {
      isOpen: body.isOpen,
      openTime: body.openTime,
      closeTime: body.closeTime,
      breakStart: body.breakStart || null,
      breakEnd: body.breakEnd || null,
    },
    create: {
      specialistId: params.id,
      weekday: body.weekday,
      isOpen: body.isOpen,
      openTime: body.openTime,
      closeTime: body.closeTime,
      breakStart: body.breakStart || null,
      breakEnd: body.breakEnd || null,
    },
  });
  return NextResponse.json(updated);
}
