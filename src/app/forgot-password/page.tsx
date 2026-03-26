"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setDevResetUrl(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      setMessage(data.message ?? "Check your email.");
      setDevResetUrl(
        typeof data.devResetUrl === "string" ? data.devResetUrl : null
      );
      setEmail("");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 space-y-6">
      <PageHeader
        title="Forgot password"
        subtitle="Enter your email and we’ll send you a link to reset your password."
      />
      <Card className="max-w-md mx-auto">
        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}
          {message && (
            <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">
              {message}
            </p>
          )}
          {devResetUrl && (
            <div className="text-sm text-amber-800 bg-amber-50 border border-amber-200 p-3 rounded-lg space-y-1">
              <p>Email delivery is unavailable in local/dev mode.</p>
              <Link href={devResetUrl} className="font-medium underline break-all">
                Open reset link
              </Link>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
              autoComplete="email"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Sending…" : "Send reset link"}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          <Link href="/login" className="text-blue-600 font-medium">
            Back to sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
