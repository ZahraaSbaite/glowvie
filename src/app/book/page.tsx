import { BookingWizard } from "@/components/BookingWizard";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Book Appointment — Glow Vie Beauty Clinic" };

export default function BookPage({ searchParams }: { searchParams: { service?: string } }) {
  return (
    <>
      <PageHeader eyebrow="Reserve Your Visit" title="Book your" accent="appointment" />
      <section className="py-16">
        <div className="container-lux">
          <BookingWizard preselectedSlug={searchParams.service} />
        </div>
      </section>
    </>
  );
}
