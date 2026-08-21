export type FAQItem = { question: string; answer: string; category: string };

export const faqCategories = ["Appointments", "Services", "Payments", "Preparation", "Aftercare", "Cancellation", "General"];

export const faqs: FAQItem[] = [
  {
    category: "Appointments",
    question: "How do I book an appointment?",
    answer: "Use the \"Book Appointment\" button anywhere on the site — choose your service, optionally a specialist, then pick a date and time from what's actually available. You'll get a confirmation once our team approves it.",
  },
  {
    category: "Appointments",
    question: "Do I need to create an account to book?",
    answer: "No — you can book as a guest with your name, phone, and email. Creating an account lets you view and manage your appointment history.",
  },
  {
    category: "Appointments",
    question: "What happens after I book?",
    answer: "You'll receive a confirmation once your appointment is approved by our team — your booking starts as Pending until then.",
  },
  {
    category: "Appointments",
    question: "Do you accept walk-ins?",
    answer: "We recommend booking in advance to guarantee your preferred time, though walk-ins are welcome subject to availability.",
  },
  {
    category: "Services",
    question: "How long does a treatment take?",
    answer: "It depends on the service — each service page lists its exact duration, and you'll see it again during booking before you confirm.",
  },
  {
    category: "Services",
    question: "Do you offer consultations?",
    answer: "Yes — for treatments like microblading or lip blush, we recommend a quick consultation beforehand so we can match colors and expectations. Mention it in the notes when booking.",
  },
  {
    category: "Services",
    question: "Can I request a specific specialist?",
    answer: "Yes — the booking flow lets you choose a specialist, or select \"No preference\" and we'll assign the best available team member.",
  },
  {
    category: "Payments",
    question: "Is my payment information required to book?",
    answer: "No — appointments are confirmed on arrival. No payment is required online.",
  },
  {
    category: "Payments",
    question: "What payment methods do you accept?",
    answer: "We accept cash and card payments in-lounge at the end of your appointment.",
  },
  {
    category: "Preparation",
    question: "What should I do before my appointment?",
    answer: "Arrive with clean skin/nails where possible (no makeup or old polish), and avoid sun exposure for 48 hours before facials or laser-based treatments. Specific prep notes are listed on each service's page.",
  },
  {
    category: "Preparation",
    question: "Should I avoid anything before a lash or brow appointment?",
    answer: "Avoid caffeine right before lash treatments if you're prone to fluttering, and skip eye makeup on the day of your lash appointment.",
  },
  {
    category: "Aftercare",
    question: "Is there any downtime after treatments?",
    answer: "Most of our treatments have little to no downtime. Semi-permanent makeup (microblading, lip blush) needs about a week of light aftercare — full instructions are given after your session.",
  },
  {
    category: "Aftercare",
    question: "How do I care for my nails or lashes after my appointment?",
    answer: "We'll walk you through simple aftercare at the end of every appointment, and it's also noted on the relevant service page under \"Recovery.\"",
  },
  {
    category: "Cancellation",
    question: "Can I cancel my appointment?",
    answer: "Yes — log into your dashboard to cancel or reschedule any upcoming appointment, or contact us directly via WhatsApp.",
  },
  {
    category: "Cancellation",
    question: "What is your cancellation policy?",
    answer: "We kindly ask for at least 24 hours' notice for cancellations or rescheduling so we can offer the slot to someone else.",
  },
  {
    category: "General",
    question: "Where are you located?",
    answer: "We're in Beirut, Lebanon — see the map on our Contact page for exact directions.",
  },
  {
    category: "General",
    question: "Do you have parking or public transport nearby?",
    answer: "Yes, please reach out via WhatsApp before your visit and we're happy to share the best directions and parking notes for your area.",
  },
];
