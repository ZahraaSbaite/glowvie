"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Sparkles as SparklesIcon,
  MessageSquareQuote,
  Settings,
  LogOut,
  Users,
  Tag,
  Image as ImageIcon,
} from "lucide-react";
import { classNames } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/admin/services", label: "Services", icon: SparklesIcon },
  { href: "/admin/staff", label: "Staff", icon: Users },
  { href: "/admin/offers", label: "Offers", icon: Tag },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/testimonials", label: "Reviews", icon: MessageSquareQuote },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-line bg-white p-6">
      <div className="mb-8 shrink-0">
        <span className="font-display text-2xl italic text-ink">Glow <span className="text-brand-dark">Vie</span></span>
        <p className="text-xs uppercase tracking-widest text-muted">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={classNames(
                "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm transition-colors",
                active ? "bg-brand text-white" : "text-ink/70 hover:bg-bg-soft"
              )}
            >
              <l.icon size={17} /> {l.label}
            </Link>
          );
        })}
      </nav>

      <button onClick={logout} className="mt-6 flex shrink-0 items-center gap-3 rounded-full px-4 py-2.5 text-sm text-muted hover:bg-bg-soft">
        <LogOut size={17} /> Log Out
      </button>
    </aside>
  );
}
