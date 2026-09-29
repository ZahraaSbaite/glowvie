"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkle } from "@/components/Sparkles";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Invalid credentials");
      return;
    }
    if (data.user.role !== "ADMIN") {
      setError("This account does not have admin access.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <section className="force-light flex min-h-screen items-center justify-center bg-bg-soft py-16">
      <div className="w-full max-w-md px-6">
        <div className="card-lux p-10">
          <div className="mb-6 text-center">
            <span className="eyebrow flex items-center justify-center gap-2"><Sparkle size={14} /> Admin Access</span>
            <h1 className="mt-2 text-3xl text-ink">Glow Vie Admin</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Admin Email" className="w-full rounded-full border border-line px-5 py-3 text-sm outline-none focus:border-brand" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="Password" className="w-full rounded-full border border-line px-5 py-3 text-sm outline-none focus:border-brand" />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
