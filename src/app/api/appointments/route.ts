import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getAvailableSlots, pickAvailableSpecialist } from "@/lib/availability";
import { toUtcDate } from "@/lib/utils";
import { z } from "zod";

const bookingSchema = z.object({
  serviceId: z.string(),
  specialistId: z.string().nullable().optional(),
  date: z.string(), // "YYYY-MM-DD"
  time: z.string(), // "HH:mm"
  fullName: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email(),
  notes: z.string().optional().default(""),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid booking data", details: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
  if (!service || !service.isActive) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  // Re-check availability server-side — never trust the client's chosen slot blindly.
  const availableSlots = await getAvailableSlots(data.date, data.serviceId, data.specialistId);
  if (!availableSlots.includes(data.time)) {
    return NextResponse.json(
      { error: "That time slot is no longer available. Please choose another." },
      { status: 409 }
    );
  }

  // If the customer didn't choose a specialist, the appointment must still be pinned to a
  // specific, genuinely-free staff member whenever the service has assigned staff — otherwise
  // that staff member's own schedule would never see this booking and could be double-booked.
  let assignedSpecialistId = data.specialistId || null;
  if (!assignedSpecialistId) {
    const pick = await pickAvailableSpecialist(data.date, data.serviceId, data.time);
    if (pick.restricted && !pick.specialistId) {
      return NextResponse.json(
        { error: "That time slot is no longer available. Please choose another." },
        { status: 409 }
      );
    }
    assignedSpecialistId = pick.specialistId;
  }

  const [h, m] = data.time.split(":").map(Number);
  const endMins = h * 60 + m + service.durationMins;
  const endTime = `${Math.floor(endMins / 60).toString().padStart(2, "0")}:${(endMins % 60).toString().padStart(2, "0")}`;

  const session = await getSession();

  const appointment = await prisma.appointment.create({
    data: {
      serviceId: data.serviceId,
      specialistId: assignedSpecialistId,
      userId: session?.userId,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      notes: data.notes,
      date: toUtcDate(data.date),
      startTime: data.time,
      endTime,
      status: "PENDING",
    },
    include: { service: true },
  });

  // TODO: send confirmation email via SMTP once env vars are configured (see .env.example)

  return NextResponse.json({ appointment }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);

  if (session.role === "ADMIN") {
    const status = searchParams.get("status");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const serviceId = searchParams.get("serviceId");
    const specialistId = searchParams.get("specialistId");
    const q = searchParams.get("q"); // search by customer name/email/phone

    const appointments = await prisma.appointment.findMany({
      where: {
        ...(status ? { status: status as any } : {}),
        ...(serviceId ? { serviceId } : {}),
        ...(specialistId ? { specialistId } : {}),
        ...(dateFrom || dateTo
          ? {
              date: {
                ...(dateFrom ? { gte: toUtcDate(dateFrom) } : {}),
                ...(dateTo ? { lte: toUtcDate(dateTo) } : {}),
              },
            }
          : {}),
        ...(q
          ? {
              OR: [
                { fullName: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
                { phone: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: { service: true, specialist: true },
      orderBy: [{ date: "desc" }, { startTime: "asc" }],
    });
    return NextResponse.json(appointments);
  }

  // Regular client — only their own appointments
  const appointments = await prisma.appointment.findMany({
    where: { userId: session.userId },
    include: { service: true, specialist: true },
    orderBy: [{ date: "desc" }, { startTime: "asc" }],
  });
  return NextResponse.json(appointments);
}
