import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Sparkle } from "@/components/Sparkles";
import { ContactForm } from "@/components/ContactForm";

export const metadata = { title: "Contact — Glow Vie Beauty Clinic" };

export default async function ContactPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });

  return (
    <>
      <section className="bg-bg-soft py-20 text-center">
        <span className="eyebrow flex items-center justify-center gap-2"><Sparkle size={14} /> Get In Touch</span>
        <h1 className="mt-3 text-5xl text-ink md:text-6xl">Contact Us</h1>
      </section>

      <section className="bg-surface py-20">
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
