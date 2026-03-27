"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState("");
  const [isAdminFlow, setIsAdminFlow] = useState(false);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    setToken(sp.get("token") ?? "");
    setIsAdminFlow(sp.get("intent") === "admin");
    setReady(true);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!token) {
      setError("Missing reset token. Open the link from your email.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not reset password");
        return;
      }
      router.push(isAdminFlow ? "/admin/login?reset=1" : "/login?reset=1");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 space-y-6">
        <PageHeader
          title="Set a new password"
          subtitle="Choose a strong password you haven’t used elsewhere."
        />
        <div className="text-center text-gray-600 py-8">Loading…</div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 space-y-6">
        <PageHeader
          title="Set a new password"
          subtitle="Choose a strong password you haven’t used elsewhere."
        />
        <Card className="max-w-md mx-auto">
          <p className="text-sm text-red-600 mb-4">
            This link is missing a token. Open the link from your email, or
            request a new reset.
          </p>
          <Link
            href={
              isAdminFlow
                ? "/forgot-password?intent=admin&redirect=%2Fadmin%2Flogin"
                : "/forgot-password"
            }
            className="text-blue-600 font-medium text-sm"
          >
            Request a new link
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 space-y-6">
      <PageHeader
        title="Set a new password"
        subtitle="Choose a strong password you haven’t used elsewhere."
      />
      <Card className="max-w-md mx-auto">
        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New password (min. 8 characters)
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
              autoComplete="new-password"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Saving…" : "Set new password"}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          {isAdminFlow ? (
            <Link href="/admin/login" className="text-indigo-600 font-medium">
              Back to Super Admin sign in
            </Link>
          ) : (
            <Link href="/login" className="text-blue-600 font-medium">
              Back to sign in
            </Link>
          )}
        </p>
      </Card>
    </div>
  );
}
