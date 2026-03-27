"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import Button from "@/components/Button";

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirect = searchParams.get("redirect") ?? "/admin";
  const reset = searchParams.get("reset");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function userLoginUrl() {
    const userRedirect = redirect.startsWith("/admin") ? "/" : redirect;
    return `/login?redirect=${encodeURIComponent(userRedirect)}`;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }
      if (data?.user?.role !== "SUPER_ADMIN") {
        setError("This account does not have Super Admin access.");
        return;
      }
      router.push(redirect);
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10 sm:py-14 px-4">
      <div className="w-full max-w-lg space-y-3">
        <PageHeader
          title="Super Admin sign in"
          subtitle="Sign in with a Super Admin account."
        />

        <Card
          hover={false}
          className="max-w-md mx-auto w-full shadow-md border border-slate-200/80"
        >
          {reset === "1" && (
            <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg mb-4">
              Password updated. Sign in with your new password.
            </p>
          )}
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => router.push(userLoginUrl())}
                className="rounded-lg px-3 py-2 text-sm font-semibold transition-colors text-slate-600 hover:text-slate-900"
              >
                User
              </button>
              <button
                type="button"
                className="rounded-lg px-3 py-2 text-sm font-semibold transition-colors bg-white text-slate-900 shadow-sm"
              >
                Admin
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}

          <form onSubmit={onSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-1">
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <Link
                  href="/forgot-password?intent=admin&redirect=%2Fadmin%2Flogin"
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full !bg-indigo-600 hover:!bg-indigo-700"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-600">
          Loading…
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
