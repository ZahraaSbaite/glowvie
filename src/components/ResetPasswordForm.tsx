"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkle } from "@/components/Sparkles";

export function ResetPasswordForm() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordFormInner />
    </Suspense>
  );
}

function ResetPasswordFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/login"), 2000);
  }

  return (
    <section className="bg-bg-soft py-24">
      <div className="container-lux mx-auto max-w-md">
        <div className="card-lux p-10">
          <div className="mb-6 text-center">
            <span className="eyebrow flex items-center justify-center gap-2"><Sparkle size={14} /> Account Recovery</span>
            <h1 className="mt-2 text-3xl text-ink">Choose a New Password</h1>
          </div>

          {!token ? (
            <p className="text-center text-sm text-red-600">This reset link is missing its token. Please request a new one.</p>
          ) : done ? (
            <p className="text-center text-sm text-muted">Your password has been updated. Redirecting to log in…</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                minLength={8}
                placeholder="New Password"
                className="w-full rounded-full border border-line px-5 py-3 text-sm outline-none focus:border-brand"
              />
              <input
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                type="password"
                required
                minLength={8}
                placeholder="Confirm New Password"
                className="w-full rounded-full border border-line px-5 py-3 text-sm outline-none focus:border-brand"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Please wait…" : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
