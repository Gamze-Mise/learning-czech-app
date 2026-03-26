"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function AdminLoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirect = searchParams.get("redirect") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
                  href="/forgot-password?redirect=%2Fadmin%2Flogin"
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

            <div className="text-center text-sm text-slate-600">
              <Link href="/login" className="text-indigo-600 hover:underline">
                Back to user sign in
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

