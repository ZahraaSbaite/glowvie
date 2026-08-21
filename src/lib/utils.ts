export function formatPrice(price: number | null | undefined) {
  if (price === null || price === undefined) return "";
  return `$${Number(price).toFixed(0)}`;
}

export function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatDuration(mins: number) {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

export function formatDisplayDate(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

/**
 * Parses a "YYYY-MM-DD" calendar-date string as UTC midnight, so the resulting
 * Date always represents that exact calendar day regardless of server timezone
 * (avoids off-by-one-day bugs when the server runs east of UTC, e.g. Beirut).
 */
export function toUtcDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00Z`);
}
