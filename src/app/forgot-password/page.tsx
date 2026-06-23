"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import Button from "@/components/Button";
import AuthAlert from "@/components/auth/AuthAlert";

function intentFromSearch(search: string): "admin" | "user" {
  const v = new URLSearchParams(search).get("intent")?.trim().toLowerCase();
  return v === "admin" ? "admin" : "user";
}

export default function ForgotPasswordPage() {
  const [intent, setIntent] = useState<"admin" | "user">("user");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIntent(intentFromSearch(window.location.search));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const intentAtSubmit = intentFromSearch(window.location.search);
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Password-Reset-Intent": intentAtSubmit,
        },
        body: JSON.stringify({ email, intent: intentAtSubmit }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      setMessage(data.message ?? "Check your email.");
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
          {intent === "admin" && (
            <p className="text-sm text-indigo-800 bg-indigo-50 border border-indigo-100 p-3 rounded-lg">
              Super Admin password reset only. Use the user sign-in flow for learner
              accounts.
            </p>
          )}
          {error && <AuthAlert>{error}</AuthAlert>}
          {message && <AuthAlert variant="success">{message}</AuthAlert>}
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
          {intent === "admin" ? (
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
