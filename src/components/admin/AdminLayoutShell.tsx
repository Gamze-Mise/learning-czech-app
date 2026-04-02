"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminLogin = pathname === "/admin/login";

  if (isAdminLogin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-100/90 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.12),transparent)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] overflow-hidden rounded-none border-slate-200/80 bg-white shadow-sm lg:rounded-2xl lg:border">
        <AdminSidebar />
        <div className="min-h-screen flex-1 bg-gradient-to-b from-slate-50/80 to-slate-100/40">
          <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
