"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminLogoutButton from "./AdminLogoutButton";

const items = [
  { href: "/admin", label: "Overview", icon: "◆" },
  { href: "/admin/lessons", label: "Lessons", icon: "▤" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <Link href="/admin" className="text-lg font-semibold tracking-tight">
          Admin
        </Link>
        <p className="text-xs text-slate-500 mt-1">Content &amp; curriculum</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <span className="opacity-80">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800 space-y-2 text-xs">
        <Link href="/" className="block text-slate-400 hover:text-white">
          ← Back to site
        </Link>
        <AdminLogoutButton />
      </div>
    </aside>
  );
}
