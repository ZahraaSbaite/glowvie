import { AdminSidebar } from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="force-light flex bg-bg-soft">
      <AdminSidebar />
      <div className="min-h-screen flex-1 overflow-y-auto p-8 md:p-12">{children}</div>
    </div>
  );
}
