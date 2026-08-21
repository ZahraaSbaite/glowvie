import { prisma } from "./prisma";
import { toUtcDate } from "./utils";

/** Converts "HH:mm" to minutes since midnight. */
function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function toTimeString(mins: number): string {
  const h = Math.floor(mins / 60)
    .toString()
    .padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

type HoursRow = {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breakStart: string | null;
  breakEnd: string | null;
};

type Range = { start: number; end: number };

function computeSlots(
  hours: HoursRow,
  duration: number,
  interval: number,
  bookedRanges: Range[],
  blockedRanges: Range[],
  isToday: boolean,
  nowMins: number
): string[] {
  if (!hours.isOpen) return [];

  const openMins = toMinutes(hours.openTime);
  const closeMins = toMinutes(hours.closeTime);
  const breakStart = hours.breakStart ? toMinutes(hours.breakStart) : null;
  const breakEnd = hours.breakEnd ? toMinutes(hours.breakEnd) : null;

  const slots: string[] = [];
  for (let start = openMins; start + duration <= closeMins; start += interval) {
    const end = start + duration;

    if (breakStart !== null && breakEnd !== null && start < breakEnd && end > breakStart) continue;
    if (bookedRanges.some((b) => start < b.end && end > b.start)) continue;
    if (blockedRanges.some((b) => start < b.end && end > b.start)) continue;
    if (isToday && start <= nowMins) continue;

    slots.push(toTimeString(start));
  }
  return slots;
}

/**
 * Returns available start-time slots ("HH:mm"[]) for a given service (and optionally a
 * specific specialist) on a given date.
 *
 * - If `specialistId` is given, availability is computed for that specialist only: their
 *   working-hours override (falling back to the clinic-wide schedule), their own booked
 *   appointments, and any blocked slots (clinic-wide or theirs).
 * - If no specialist is given and the service has staff assigned via `ServiceSpecialist`,
 *   availability is the union of every assigned staff member's open slots (a slot is offered
 *   if at least one eligible specialist can take it).
 * - If no specialist is given and the service has NO staff assignments at all (the case for
 *   every service today, since the assignment table starts empty), this falls back to the
 *   original clinic-wide behavior: global hours + date-wide appointment conflicts, unchanged.
 */
export async function getAvailableSlots(
  dateStr: string,
  serviceId: string,
  specialistId?: string | null
): Promise<string[]> {
  const date = toUtcDate(dateStr);
  const weekday = date.getUTCDay();

  const [globalHours, holiday, service, settings] = await Promise.all([
    prisma.workingHours.findUnique({ where: { weekday } }),
    prisma.holiday.findFirst({ where: { date } }),
    prisma.service.findUnique({ where: { id: serviceId } }),
    prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
  ]);

  if (!globalHours || !globalHours.isOpen) return [];
  if (holiday) return [];
  if (!service) return [];

  const duration = service.durationMins || 60;
  const interval = settings?.slotIntervalMins || 60;

  const now = new Date();
  const isToday = now.toDateString() === date.toDateString();
  const nowMins = now.getHours() * 60 + now.getMinutes();

  let targetSpecialistIds: string[] | null = null;
  if (specialistId) {
    targetSpecialistIds = [specialistId];
  } else {
    const assigned = await prisma.serviceSpecialist.findMany({
      where: { serviceId },
      select: { specialistId: true },
    });
    if (assigned.length > 0) targetSpecialistIds = assigned.map((a) => a.specialistId);
  }

  // Legacy path: no specialist constraint in play — original clinic-wide behavior.
  if (targetSpecialistIds === null) {
    const [existingAppointments, blockedSlots] = await Promise.all([
      prisma.appointment.findMany({
        where: { date, status: { in: ["PENDING", "APPROVED"] } },
        select: { startTime: true, endTime: true },
      }),
      prisma.blockedSlot.findMany({ where: { date, specialistId: null } }),
    ]);
    const bookedRanges = existingAppointments.map((a) => ({ start: toMinutes(a.startTime), end: toMinutes(a.endTime) }));
    const blockedRanges = blockedSlots.map((b) => ({ start: toMinutes(b.startTime), end: toMinutes(b.endTime) }));
    return computeSlots(globalHours, duration, interval, bookedRanges, blockedRanges, isToday, nowMins);
  }

  // Staff-aware path: fetch shared data once for every specialist in play, then compute
  // each one's slots and merge.
  const [staffHoursRows, allBlockedSlots, allAppointments] = await Promise.all([
    prisma.staffWorkingHours.findMany({ where: { specialistId: { in: targetSpecialistIds }, weekday } }),
    prisma.blockedSlot.findMany({
      where: { date, OR: [{ specialistId: null }, { specialistId: { in: targetSpecialistIds } }] },
    }),
    prisma.appointment.findMany({
      where: { date, status: { in: ["PENDING", "APPROVED"] }, specialistId: { in: targetSpecialistIds } },
      select: { startTime: true, endTime: true, specialistId: true },
    }),
  ]);

  const staffHoursMap = new Map(staffHoursRows.map((h) => [h.specialistId, h]));
  const clinicWideBlocked: Range[] = allBlockedSlots
    .filter((b) => b.specialistId === null)
    .map((b) => ({ start: toMinutes(b.startTime), end: toMinutes(b.endTime) }));

  const union = new Set<string>();
  for (const sid of targetSpecialistIds) {
    const hours = staffHoursMap.get(sid) ?? globalHours;
    const staffBlocked: Range[] = allBlockedSlots
      .filter((b) => b.specialistId === sid)
      .map((b) => ({ start: toMinutes(b.startTime), end: toMinutes(b.endTime) }));
    const staffBooked: Range[] = allAppointments
      .filter((a) => a.specialistId === sid)
      .map((a) => ({ start: toMinutes(a.startTime), end: toMinutes(a.endTime) }));

    const slots = computeSlots(hours, duration, interval, staffBooked, [...clinicWideBlocked, ...staffBlocked], isToday, nowMins);
    for (const s of slots) union.add(s);
  }

  return Array.from(union).sort();
}

/**
 * Returns which dates in a month are fully unavailable (closed weekday or holiday).
 * When `specialistId` is given, a staff working-hours override for that weekday (if any)
 * takes precedence over the clinic-wide schedule.
 */
export async function getUnavailableDates(year: number, month: number, specialistId?: string | null): Promise<string[]> {
  const [workingHoursList, holidays, staffHoursList] = await Promise.all([
    prisma.workingHours.findMany(),
    prisma.holiday.findMany(),
    specialistId
      ? prisma.staffWorkingHours.findMany({ where: { specialistId } })
      : Promise.resolve([] as { weekday: number; isOpen: boolean }[]),
  ]);

  const closedWeekdays = new Set(workingHoursList.filter((w) => !w.isOpen).map((w) => w.weekday));
  const staffOverrideByWeekday = new Map(staffHoursList.map((h) => [h.weekday, h.isOpen]));
  const holidayDates = new Set(holidays.map((h) => h.date.toISOString().slice(0, 10)));

  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const unavailable: string[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const iso = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    const weekday = new Date(Date.UTC(year, month, day)).getUTCDay();
    const staffOverride = staffOverrideByWeekday.get(weekday);
    const closedByWeekday = staffOverride !== undefined ? !staffOverride : closedWeekdays.has(weekday);
    if (closedByWeekday || holidayDates.has(iso)) {
      unavailable.push(iso);
    }
  }
  return unavailable;
}

/**
 * Picks which specialist a booking should actually be assigned to when the customer didn't
 * choose one. If the service has no `ServiceSpecialist` assignments it's unrestricted and no
 * specific staff member needs to be reserved (`restricted: false`, `specialistId: null`). If it
 * does have assigned staff, this finds whichever eligible specialist is genuinely free at the
 * exact date/time and returns their id — appointments must never be stored with a null
 * specialistId for a staff-restricted service, or that staff member's own conflict checks (in
 * getAvailableSlots) would never see the booking and a real double-booking becomes possible.
 * If no eligible specialist is actually free (a race with another booking), returns
 * `restricted: true, specialistId: null` so the caller can reject the booking.
 */
export async function pickAvailableSpecialist(
  dateStr: string,
  serviceId: string,
  time: string
): Promise<{ restricted: boolean; specialistId: string | null }> {
  const assigned = await prisma.serviceSpecialist.findMany({
    where: { serviceId },
    select: { specialistId: true },
  });
  if (assigned.length === 0) return { restricted: false, specialistId: null };

  for (const { specialistId } of assigned) {
    const slots = await getAvailableSlots(dateStr, serviceId, specialistId);
    if (slots.includes(time)) return { restricted: true, specialistId };
  }
  return { restricted: true, specialistId: null };
}
