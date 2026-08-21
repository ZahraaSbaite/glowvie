import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const hours = await prisma.workingHours.findMany({ orderBy: { weekday: "asc" } });
  return NextResponse.json(hours);
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json(); // { weekday, isOpen, openTime, closeTime, breakStart, breakEnd }
  const updated = await prisma.workingHours.update({
    where: { weekday: body.weekday },
    data: {
      isOpen: body.isOpen,
      openTime: body.openTime,
      closeTime: body.closeTime,
      breakStart: body.breakStart || null,
      breakEnd: body.breakEnd || null,
    },
  });
  return NextResponse.json(updated);
}
