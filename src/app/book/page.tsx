import { BookingWizard } from "@/components/BookingWizard";
import { Sparkle } from "@/components/Sparkles";

export const metadata = { title: "Book Appointment — Glow Vie Beauty Clinic" };

export default function BookPage({ searchParams }: { searchParams: { service?: string } }) {
  return (
    <>
      <section className="bg-bg-soft py-16 text-center">
        <span className="eyebrow flex items-center justify-center gap-2"><Sparkle size={14} /> Reserve Your Visit</span>
        <h1 className="mt-3 text-5xl text-ink md:text-6xl">Book Your Appointment</h1>
      </section>
      <section className="bg-surface py-16">
        <div className="container-lux">
          <BookingWizard preselectedSlug={searchParams.service} />
        </div>
      </section>
    </>
  );
}
