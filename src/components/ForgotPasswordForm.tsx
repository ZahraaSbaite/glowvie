"use client";

import { useState } from "react";
import { Sparkle } from "@/components/Sparkles";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Something went wrong. Please try again.");
      return;
    }
    setSent(true);
  }

  return (
    <section className="bg-bg-soft py-24">
      <div className="container-lux mx-auto max-w-md">
        <div className="card-lux p-10">
          <div className="mb-6 text-center">
            <span className="eyebrow flex items-center justify-center gap-2"><Sparkle size={14} /> Account Recovery</span>
            <h1 className="mt-2 text-3xl text-ink">Reset Your Password</h1>
          </div>

          {sent ? (
            <p className="text-center text-sm text-muted">
              If an account exists for <strong className="text-ink">{email}</strong>, we've sent a link to reset your password.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="Email Address"
                className="w-full rounded-full border border-line px-5 py-3 text-sm outline-none focus:border-brand"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Please wait…" : "Send Reset Link"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted">
            <a href="/login" className="font-medium text-brand-dark hover:underline">Back to Log In</a>
          </p>
        </div>
      </div>
    </section>
  );
}
