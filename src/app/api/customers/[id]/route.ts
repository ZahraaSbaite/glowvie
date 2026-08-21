import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Next.js already URL-decodes dynamic segments, so a guest id arrives as "guest:name@example.com".
  const appointments = params.id.startsWith("guest:")
    ? await prisma.appointment.findMany({
        where: { userId: null, email: params.id.slice("guest:".length) },
        include: { service: true, specialist: true },
        orderBy: [{ date: "desc" }],
      })
    : await prisma.appointment.findMany({
        where: { userId: params.id },
        include: { service: true, specialist: true },
        orderBy: [{ date: "desc" }],
      });

  return NextResponse.json(appointments);
}
