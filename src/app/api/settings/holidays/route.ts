import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { toUtcDate } from "@/lib/utils";

export async function GET() {
  const holidays = await prisma.holiday.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json(holidays);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json(); // { date: "YYYY-MM-DD", label }
  const holiday = await prisma.holiday.create({
    data: { date: toUtcDate(body.date), label: body.label || "Holiday" },
  });
  return NextResponse.json(holiday, { status: 201 });
}
