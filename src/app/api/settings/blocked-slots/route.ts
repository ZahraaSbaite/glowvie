import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { toUtcDate } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const specialistId = searchParams.get("specialistId");

  const blockedSlots = await prisma.blockedSlot.findMany({
    where: specialistId ? { specialistId } : {},
    include: { specialist: { select: { name: true } } },
    orderBy: { date: "asc" },
  });
  return NextResponse.json(blockedSlots);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json(); // { date, startTime, endTime, specialistId?, reason? }
  const blockedSlot = await prisma.blockedSlot.create({
    data: {
      date: toUtcDate(body.date),
      startTime: body.startTime,
      endTime: body.endTime,
      specialistId: body.specialistId || null,
      reason: body.reason || "",
    },
  });
  return NextResponse.json(blockedSlot, { status: 201 });
}
