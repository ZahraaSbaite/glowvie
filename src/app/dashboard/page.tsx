import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { DashboardAppointmentList } from "@/components/DashboardAppointmentList";
import { Sparkle } from "@/components/Sparkles";

export const metadata = { title: "My Dashboard — Glow Vie Beauty Clinic" };

export default async function DashboardPage() {
  const session = await getSession(); // middleware guarantees this exists for this route
  const appointments = await prisma.appointment.findMany({
    where: { userId: session!.userId },
    include: { service: true, specialist: true },
    orderBy: [{ date: "desc" }, { startTime: "asc" }],
  });

  return (
    <section className="bg-bg-soft py-16">
      <div className="container-lux">
        <span className="eyebrow flex items-center gap-2"><Sparkle size={14} /> My Account</span>
        <h1 className="mt-2 text-4xl text-ink">Welcome, {session!.fullName.split(" ")[0]}</h1>
        <p className="mt-1 text-muted">View, cancel, or reschedule your appointments below.</p>

        <div className="mt-10">
          <DashboardAppointmentList
            appointments={appointments.map((a) => ({
              id: a.id,
              serviceTitle: a.service.title,
              serviceId: a.serviceId,
              specialistId: a.specialistId,
              specialistName: a.specialist?.name || null,
              date: a.date.toISOString().slice(0, 10),
              startTime: a.startTime,
              status: a.status,
            }))}
          />
        </div>
      </div>
    </section>
  );
}
