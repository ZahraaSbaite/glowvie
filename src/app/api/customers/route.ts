import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase();

  const [users, guestAppointments] = await Promise.all([
    prisma.user.findMany({
      where: { role: "CLIENT" },
      include: { _count: { select: { appointments: true } } },
      orderBy: { createdAt: "desc" },
    }),
    // Guests never registered an account, so they only exist as appointment rows with no userId.
    prisma.appointment.findMany({
      where: { userId: null },
      select: { email: true, fullName: true, phone: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const guestMap = new Map<string, { email: string; fullName: string; phone: string; count: number; lastBooking: Date }>();
  for (const a of guestAppointments) {
    const key = a.email.toLowerCase();
    const existing = guestMap.get(key);
    if (existing) existing.count += 1;
    else guestMap.set(key, { email: a.email, fullName: a.fullName, phone: a.phone, count: 1, lastBooking: a.createdAt });
  }

  const registered = users.map((u) => ({
    id: u.id,
    type: "registered" as const,
    fullName: u.fullName,
    email: u.email,
    phone: u.phone || "",
    appointmentCount: u._count.appointments,
    createdAt: u.createdAt,
  }));

  const guests = Array.from(guestMap.values()).map((g) => ({
    id: `guest:${encodeURIComponent(g.email)}`,
    type: "guest" as const,
    fullName: g.fullName,
    email: g.email,
    phone: g.phone,
    appointmentCount: g.count,
    createdAt: g.lastBooking,
  }));

  let all = [...registered, ...guests];
  if (q) {
    all = all.filter((c) => c.fullName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  }
  all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json(all);
}
