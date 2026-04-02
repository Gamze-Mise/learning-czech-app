"use client";

import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="w-full rounded-lg border border-slate-700/80 bg-slate-800/50 px-3 py-2 text-left text-xs font-medium text-slate-300 transition hover:border-red-500/40 hover:bg-red-950/30 hover:text-red-200"
    >
      Sign out
    </button>
  );
}
