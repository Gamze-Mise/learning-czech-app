"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminLogoutButton from "./AdminLogoutButton";
import { IconLessons, IconOverview, IconUnits } from "./AdminNavIcons";

const items = [
  { href: "/admin", label: "Overview", Icon: IconOverview },
  { href: "/admin/units", label: "Units", Icon: IconUnits },
  { href: "/admin/lessons", label: "Lessons", Icon: IconLessons },
] as const;

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 min-h-screen flex-col border-r border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="border-b border-slate-800/80 p-5">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-400/30">
            <IconOverview className="h-5 w-5" />
          </span>
          <div>
            <Link
              href="/admin"
              className="text-[15px] font-semibold tracking-tight text-white"
            >
              Admin
            </Link>
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
              Learning Czech
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          Curriculum &amp; content
        </p>
      </div>
      <nav className="flex-1 space-y-0.5 p-3">
        {items.map(({ href, label, Icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-slate-800/90 text-white shadow-sm ring-1 ring-white/10"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  active
                    ? "bg-indigo-500/25 text-indigo-200"
                    : "bg-slate-800/60 text-slate-500 group-hover:bg-slate-700/80 group-hover:text-slate-300"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
              {label}
              {active ? (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" />
              ) : null}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-3 border-t border-slate-800/80 p-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium text-slate-400 transition hover:bg-slate-800/60 hover:text-white"
        >
          <span aria-hidden>←</span>
          Back to site
        </Link>
        <AdminLogoutButton />
      </div>
    </aside>
  );
}
