import { prisma } from "@/lib/prisma";
import { toUtcDate } from "@/lib/utils";
import { CalendarClock, CheckCircle2, Clock3, Users, TrendingUp } from "lucide-react";

export const metadata = { title: "Admin Dashboard — Glow Vie" };

export default async function AdminDashboardPage() {
  const todayIso = new Date().toISOString().slice(0, 10);
  const today = toUtcDate(todayIso);
  const monthStartIso = todayIso.slice(0, 7) + "-01";

  const [
    pending,
    approvedToday,
    totalThisMonth,
    completedCount,
    cancelledCount,
    recent,
    registeredCustomers,
    guestEmails,
    topServiceGroups,
  ] = await Promise.all([
    prisma.appointment.count({ where: { status: "PENDING" } }),
    prisma.appointment.count({ where: { status: "APPROVED", date: today } }),
    prisma.appointment.count({ where: { createdAt: { gte: toUtcDate(monthStartIso) } } }),
    prisma.appointment.count({ where: { status: "COMPLETED" } }),
    prisma.appointment.count({ where: { status: "CANCELLED" } }),
    prisma.appointment.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { service: true },
    }),
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.appointment.findMany({ where: { userId: null }, select: { email: true }, distinct: ["email"] }),
    prisma.appointment.groupBy({
      by: ["serviceId"],
      _count: { _all: true },
      orderBy: { _count: { serviceId: "desc" } },
      take: 5,
    }),
  ]);

  const totalCustomers = registeredCustomers + guestEmails.length;

  const topServices = await prisma.service.findMany({
    where: { id: { in: topServiceGroups.map((g) => g.serviceId) } },
    select: { id: true, title: true },
  });
  const popularServices = topServiceGroups.map((g) => ({
    title: topServices.find((s) => s.id === g.serviceId)?.title || "Unknown",
    count: g._count._all,
  }));

  const stats = [
    { label: "Pending Approval", value: pending, icon: Clock3 },
    { label: "Approved for Today", value: approvedToday, icon: CheckCircle2 },
    { label: "Bookings This Month", value: totalThisMonth, icon: CalendarClock },
    { label: "Total Customers", value: totalCustomers, icon: Users },
    { label: "Completed", value: completedCount, icon: CheckCircle2 },
    { label: "Cancelled", value: cancelledCount, icon: Clock3 },
  ];

  return (
    <div>
      <h1 className="text-3xl text-ink">Dashboard</h1>
      <p className="mt-1 text-muted">A quick look at what needs your attention.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="card-lux p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-soft text-brand-dark">
                <s.icon size={18} />
              </div>
              <p className="text-sm text-muted">{s.label}</p>
            </div>
            <p className="mt-4 text-3xl text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="card-lux p-6">
          <h2 className="text-xl text-ink">Recent Bookings</h2>
          <div className="mt-4 divide-y divide-line">
            {recent.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-ink">{a.fullName}</p>
                  <p className="text-muted">{a.service.title} · {a.date.toISOString().slice(0, 10)} at {a.startTime}</p>
                </div>
                <span className="rounded-full bg-bg-soft px-3 py-1 text-xs text-ink">{a.status}</span>
              </div>
            ))}
            {recent.length === 0 && <p className="py-6 text-center text-muted">No bookings yet.</p>}
          </div>
        </div>

        <div className="card-lux p-6">
          <h2 className="flex items-center gap-2 text-xl text-ink"><TrendingUp size={18} className="text-brand-dark" /> Popular Services</h2>
          <div className="mt-4 divide-y divide-line">
            {popularServices.map((s) => (
              <div key={s.title} className="flex items-center justify-between py-3 text-sm">
                <p className="text-ink">{s.title}</p>
                <span className="rounded-full bg-bg-soft px-3 py-1 text-xs text-ink">{s.count} booking{s.count === 1 ? "" : "s"}</span>
              </div>
            ))}
            {popularServices.length === 0 && <p className="py-6 text-center text-muted">No bookings yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
