"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white">
          <CheckCircle2 size={26} />
        </div>
        <h2 className="mt-5 text-xl text-ink">Message Sent</h2>
        <p className="mt-2 text-sm text-muted">Thanks for reaching out — we'll get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <input name="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full rounded-full border border-line bg-surface px-5 py-3 text-sm outline-none focus:border-brand" />
      <input name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full rounded-full border border-line bg-surface px-5 py-3 text-sm outline-none focus:border-brand" />
      <input name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className="w-full rounded-full border border-line bg-surface px-5 py-3 text-sm outline-none focus:border-brand" />
      <input name="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="w-full rounded-full border border-line bg-surface px-5 py-3 text-sm outline-none focus:border-brand" />
      <textarea name="message" required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your Message" className="w-full rounded-xl2 border border-line bg-surface px-5 py-3 text-sm outline-none focus:border-brand" />

      {error && <p className="rounded-xl2 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
        {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
        {submitting ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
