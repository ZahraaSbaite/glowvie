"use client";

import { useState } from "react";
import { Star, Loader2, CheckCircle2 } from "lucide-react";

const RATING_LABELS = ["", "Not for me", "Could be better", "Good", "Loved it", "Absolutely glowing"];

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

  const shown = hoverRating || rating;

  if (sent) {
    return (
      <div className="flex h-full flex-col items-start justify-center gap-4 py-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full text-plum" style={{ backgroundImage: "var(--glow-gradient)" }}>
          <CheckCircle2 size={26} />
        </div>
        <h3 className="font-display text-4xl text-ink">
          Thank <em className="text-glow pr-1">you</em>
        </h3>
        <p className="max-w-sm text-sm leading-relaxed text-muted">Your review has been posted — thanks for sharing your experience with us.</p>
      </div>
    );
  }

  // Underlined, editorial-style fields that pick up the gold accent on focus.
  const field =
    "w-full border-0 border-b border-line bg-transparent px-0 py-3 text-base text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-gold";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted">Your Rating</p>
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                onMouseEnter={() => setHoverRating(n)}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                aria-pressed={rating === n}
                className={`transition-all duration-300 hover:scale-125 ${shown >= n ? "text-gold drop-shadow-[0_0_10px_rgba(217,164,65,0.7)]" : "text-line"}`}
              >
                <Star size={30} fill="currentColor" strokeWidth={0} />
              </button>
            ))}
          </div>
          <span className="font-display text-xl italic text-ink/80">{RATING_LABELS[shown]}</span>
        </div>
      </div>

      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted">Your Name</span>
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Nour A." className={field} />
      </label>

      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted">Your Experience</span>
        <textarea
          required
          rows={3}
          minLength={5}
          maxLength={600}
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="Tell us about your visit…"
          className={`${field} resize-none`}
        />
      </label>

      {error && <p className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}

      <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60 sm:w-auto">
        {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
        {submitting ? "Submitting…" : "Submit Review →"}
      </button>
    </form>
  );
}
