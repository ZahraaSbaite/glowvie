"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const STORAGE_KEY = "glowvie-theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
  }

  if (!mounted) {
    return <div className={`h-9 w-9 ${className}`} aria-hidden="true" />;
  }

  return (
    <button
      onClick={toggle}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-brand hover:text-brand-dark ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
