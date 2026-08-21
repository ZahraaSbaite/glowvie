import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getAvailableSlots } from "@/lib/availability";
import { toUtcDate } from "@/lib/utils";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const appointment = await prisma.appointment.findUnique({ where: { id: params.id } });
  if (!appointment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isOwner = appointment.userId === session.userId;
  const isAdmin = session.role === "ADMIN";
  if (!isOwner && !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();

  // --- Admin-only status transitions ---
  if (body.status) {
    if (!isAdmin) return NextResponse.json({ error: "Only admins can change status" }, { status: 403 });
    const updated = await prisma.appointment.update({
      where: { id: params.id },
      data: { status: body.status },
    });
    return NextResponse.json(updated);
  }

  // --- Reschedule (owner or admin): requires a new date + time, re-validated against availability ---
  if (body.date && body.time) {
    const service = await prisma.service.findUnique({ where: { id: appointment.serviceId } });
    if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

    const slots = await getAvailableSlots(body.date, appointment.serviceId, appointment.specialistId);
    if (!slots.includes(body.time)) {
      return NextResponse.json({ error: "That time slot is not available" }, { status: 409 });
    }

    const [h, m] = body.time.split(":").map(Number);
    const endMins = h * 60 + m + service.durationMins;
    const endTime = `${Math.floor(endMins / 60).toString().padStart(2, "0")}:${(endMins % 60).toString().padStart(2, "0")}`;

    const updated = await prisma.appointment.update({
      where: { id: params.id },
      data: {
        date: toUtcDate(body.date),
        startTime: body.time,
        endTime,
        status: "PENDING", // rescheduling re-queues it for approval
      },
    });
    return NextResponse.json(updated);
  }

  // --- Cancel (owner or admin) ---
  if (body.action === "cancel") {
    const updated = await prisma.appointment.update({
      where: { id: params.id },
      data: { status: "CANCELLED" },
    });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "No valid action specified" }, { status: 400 });
}
