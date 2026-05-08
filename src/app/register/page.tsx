"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import Button from "@/components/Button";
import PasswordInput from "@/components/PasswordInput";

function RegisterForm() {
  const searchParams = useSearchParams();
  const err = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [devVerificationUrl, setDevVerificationUrl] = useState<string | null>(
    null
  );
  const [emailSendNote, setEmailSendNote] = useState<string | null>(null);

  const errorHint =
    err === "missing_token"
      ? "Verification link is invalid."
      : err === "invalid_token"
        ? "This verification link has expired or was already used."
        : err === "verification_failed"
          ? "Email verification could not be completed. Try registering again or contact support."
          : null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setDevVerificationUrl(null);
    setEmailSendNote(null);
    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: name || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed");
        return;
      }
      setMessage(data.message ?? "Check your email.");
      if (typeof data.devVerificationUrl === "string") {
        setDevVerificationUrl(data.devVerificationUrl);
      }
      if (typeof data.emailError === "string") {
        setEmailSendNote(data.emailError);
      }
      setEmail("");
      setPassword("");
      setPasswordConfirm("");
      setName("");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <form onSubmit={onSubmit} className="space-y-4">
        {errorHint && (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {errorHint}
          </p>
        )}
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
        {emailSendNote && (
          <p className="text-sm text-amber-800 bg-amber-50 p-3 rounded-lg border border-amber-200">
            <strong>Email error:</strong> {emailSendNote}
          </p>
        )}
        {devVerificationUrl && (
          <div className="text-sm bg-blue-50 text-blue-900 p-3 rounded-lg border border-blue-200 space-y-2">
            <p className="font-medium">Development: open this link to verify</p>
            <p className="break-all text-xs font-mono bg-white p-2 rounded border border-blue-100">
              {devVerificationUrl}
            </p>
            <button
              type="button"
              className="text-sm text-blue-700 underline"
              onClick={() =>
                void navigator.clipboard.writeText(devVerificationUrl)
              }
            >
              Copy link
            </button>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name (optional)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
            autoComplete="name"
          />
        </div>
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password (min. 8 characters)
          </label>
          <PasswordInput
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
          <PasswordInput
            required
            minLength={8}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
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
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 font-medium">
          Sign in
        </Link>
      </p>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 space-y-6">
      <PageHeader
        title="Create account"
        subtitle="We’ll send a confirmation link to your email before you can sign in."
      />
      <Suspense fallback={<div className="text-center text-gray-600">Loading…</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
