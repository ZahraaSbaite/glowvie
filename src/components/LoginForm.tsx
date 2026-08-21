"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkle } from "@/components/Sparkles";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const url = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const body = mode === "login" ? { email, password } : { fullName, email, phone, password };
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <section className="bg-bg-soft py-24">
      <div className="container-lux mx-auto max-w-md">
        <div className="card-lux p-10">
          <div className="mb-6 text-center">
            <span className="eyebrow flex items-center justify-center gap-2"><Sparkle size={14} /> Your Account</span>
            <h1 className="mt-2 text-3xl text-ink">{mode === "login" ? "Welcome Back" : "Create an Account"}</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Full Name" className="w-full rounded-full border border-line px-5 py-3 text-sm outline-none focus:border-brand" />
            )}
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Email Address" className="w-full rounded-full border border-line px-5 py-3 text-sm outline-none focus:border-brand" />
            {mode === "register" && (
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className="w-full rounded-full border border-line px-5 py-3 text-sm outline-none focus:border-brand" />
            )}
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={8} placeholder="Password" className="w-full rounded-full border border-line px-5 py-3 text-sm outline-none focus:border-brand" />

            {mode === "login" && (
              <p className="text-right text-xs">
                <a href="/forgot-password" className="text-muted hover:text-brand-dark">Forgot password?</a>
              </p>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Please wait…" : mode === "login" ? "Log In" : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            {mode === "login" ? "New to Glow Vie?" : "Already have an account?"}{" "}
            <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="font-medium text-brand-dark hover:underline">
              {mode === "login" ? "Create an account" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
