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
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-[1600px] overflow-hidden rounded-none lg:rounded-2xl lg:border lg:border-slate-200 lg:shadow-sm">
        <AdminSidebar />
        <div className="min-h-screen flex-1">
          <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
