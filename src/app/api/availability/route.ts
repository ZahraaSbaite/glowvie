import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots, getUnavailableDates } from "@/lib/availability";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const serviceId = searchParams.get("serviceId");
  const specialistId = searchParams.get("specialistId");
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  // Month view: return which dates are fully closed (weekday off or holiday)
  if (year && month) {
    const unavailable = await getUnavailableDates(Number(year), Number(month), specialistId);
    return NextResponse.json({ unavailableDates: unavailable });
  }

  // Day view: return open time slots for a specific service
  if (!date || !serviceId) {
    return NextResponse.json({ error: "date and serviceId are required" }, { status: 400 });
  }

  const slots = await getAvailableSlots(date, serviceId, specialistId);
  return NextResponse.json({ slots });
}
