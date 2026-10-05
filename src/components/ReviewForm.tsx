"use client";

import { useState } from "react";
import { Star, Loader2, CheckCircle2 } from "lucide-react";

export function ReviewForm() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [quote, setQuote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, quote }),
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
      <div className="card-lux flex flex-col items-center justify-center gap-3 p-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white">
          <CheckCircle2 size={26} />
        </div>
        <h3 className="text-xl text-ink">Thank You!</h3>
        <p className="max-w-sm text-sm text-muted">Your review has been posted — thanks for sharing your experience with us.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card-lux mx-auto max-w-xl space-y-4 p-8">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted">Your Rating</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHoverRating(n)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              className="text-brand transition-transform hover:scale-110"
            >
              <Star size={26} fill={(hoverRating || rating) >= n ? "currentColor" : "none"} strokeWidth={1.5} />
            </button>
          ))}
        </div>
      </div>

      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your Name"
        className="w-full rounded-full border border-line bg-surface px-5 py-3 text-sm outline-none focus:border-brand"
      />
      <textarea
        required
        rows={4}
        minLength={5}
        maxLength={600}
        value={quote}
        onChange={(e) => setQuote(e.target.value)}
        placeholder="Tell us about your experience…"
        className="w-full rounded-xl2 border border-line bg-surface px-5 py-3 text-sm outline-none focus:border-brand"
      />

      {error && <p className="rounded-xl2 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
        {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
        {submitting ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
