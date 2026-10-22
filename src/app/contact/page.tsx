import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Contact — Glow Vie Beauty Clinic" };

export default async function ContactPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });

  return (
    <>
      <PageHeader eyebrow="Get In Touch" title="Contact" accent="Us" />

      <section className="py-20">
        <div className="container-lux grid gap-14 lg:grid-cols-2">
          <div>
            <div className="mb-8 overflow-hidden rounded-xl3 border border-line">
              <iframe
                title="Glow Vie location"
                src={settings?.mapEmbedUrl || "https://maps.google.com/maps?q=Beirut,Lebanon&z=13&output=embed"}
                className="h-80 w-full"
                loading="lazy"
              />
            </div>
            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="mt-0.5 text-brand-dark" />
                <span className="text-muted">{settings?.address || "Beirut, Lebanon"}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={20} className="mt-0.5 text-brand-dark" />
                <span className="text-muted">{settings?.phone || "+961 3 000 000"}</span>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle size={20} className="mt-0.5 text-brand-dark" />
                <a href={`https://wa.me/${settings?.whatsapp || "9613000000"}`} className="text-muted hover:text-brand-dark">
                  WhatsApp Us
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={20} className="mt-0.5 text-brand-dark" />
                <span className="text-muted">{settings?.email || "hello@glowvie.com"}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={20} className="mt-0.5 text-brand-dark" />
                <span className="text-muted">Mon–Sat, hours vary by day — see Book Appointment for live availability.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl3 border border-line bg-bg-soft p-8">
            <h2 className="text-2xl text-ink">Send a Message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
