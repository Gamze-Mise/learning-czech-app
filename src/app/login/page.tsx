"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import Button from "@/components/Button";
import PasswordInput from "@/components/PasswordInput";
import AuthAlert from "@/components/auth/AuthAlert";
import AuthRoleToggle from "@/components/auth/AuthRoleToggle";
import { safeRedirect } from "@/lib/auth/safe-redirect";

export default function LoginPage() {
  const router = useRouter();
  const [redirect, setRedirect] = useState("/");
  const [verified, setVerified] = useState(false);
  const [reset, setReset] = useState(false);
  const [queryReady, setQueryReady] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);

    if (sp.get("mode") === "admin") {
      const r = safeRedirect(sp.get("redirect"), "/");
      const adminRedirect = r.startsWith("/admin") ? r : "/admin";
      router.replace(
        `/admin/login?redirect=${encodeURIComponent(adminRedirect)}`,
      );
      return;
    }

    setRedirect(safeRedirect(sp.get("redirect"), "/"));
    setVerified(sp.get("verified") === "1");
    setReset(sp.get("reset") === "1");
    setQueryReady(true);
  }, [router]);

  function adminLoginUrl() {
    const adminRedirect = redirect.startsWith("/admin") ? redirect : "/admin";
    return `/admin/login?redirect=${encodeURIComponent(adminRedirect)}`;
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
      <div className="w-full max-w-lg space-y-2">
        <PageHeader
          title="Sign in"
          subtitle="Use the email and password you registered with."
        />

        <Card
          hover={false}
          className="max-w-md mx-auto w-full shadow-md border border-slate-200/80"
        >
          <AuthRoleToggle
            activeRole="user"
            onAdminClick={() => router.push(adminLoginUrl())}
          />

          {queryReady && verified && (
            <AuthAlert variant="success" className="mb-4">
              Email verified. You can sign in now.
            </AuthAlert>
          )}
          {queryReady && reset && (
            <AuthAlert variant="success" className="mb-4">
              Password updated. Sign in with your new password.
            </AuthAlert>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            {error && <AuthAlert>{error}</AuthAlert>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                autoComplete="email"
              />
            </div>
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <PasswordInput
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                autoComplete="current-password"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <div className="text-center text-sm text-gray-600 mt-6 space-y-2">
            <p>
              No account?{" "}
              <Link href="/register" className="text-blue-600 font-medium">
                Create account
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
