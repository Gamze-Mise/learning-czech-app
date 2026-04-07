"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminPageHeader, {
  adminPrimaryButtonClass,
} from "@/components/admin/AdminPageHeader";

export default function NewUnitPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("1");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    if (!successOpen) return;
    const t = window.setTimeout(() => {
      router.push("/admin/units");
    }, 2500);
    return () => window.clearTimeout(t);
  }, [successOpen, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          level: Number(level) || 1,
          description: description.trim() || null,
          thumbnail: thumbnail.trim() || null,
          isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Create failed");
        return;
      }
      setSuccessOpen(true);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl space-y-8">
      {successOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="unit-create-success-title"
        >
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl ring-1 ring-black/5 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="absolute inset-0 rounded-full bg-emerald-500/20 motion-safe:animate-ping" />
                <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow motion-safe:animate-bounce">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                    <path
                      fillRule="evenodd"
                      d="M16.704 5.29a1 1 0 0 1 .006 1.415l-7.5 7.6a1 1 0 0 1-1.42.004L3.296 9.814a1 1 0 1 1 1.408-1.42l3.083 3.06 6.793-6.887a1 1 0 0 1 1.424.723Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
              <div>
                <h2
                  id="unit-create-success-title"
                  className="text-base font-semibold text-slate-900"
                >
                  Oluşturuldu
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Listeye dönülüyor…</p>
              </div>
            </div>
            <button
              type="button"
              className="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-center text-sm font-medium text-white hover:bg-slate-800"
              onClick={() => router.push("/admin/units")}
            >
              Listeye dön
            </button>
          </div>
        </div>
      )}
      <AdminPageHeader
        title="New unit"
        description="Create a unit. Order is assigned automatically."
        action={
          <Link
            href="/admin/units"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back
          </Link>
        }
      />

      <form
        onSubmit={onSubmit}
        className="space-y-5 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm"
      >
        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Title *
          </label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Level
          </label>
          <input
            type="number"
            min={1}
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Thumbnail URL
          </label>
          <input
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
            placeholder="https://…"
          />
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-slate-900">Status</p>
            <p className="text-xs text-slate-600 mt-0.5">
              {isActive ? "Active (visible in app)" : "Passive (hidden in app)"}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            onClick={() => setIsActive(!isActive)}
            className={[
              "relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
              isActive ? "bg-indigo-600" : "bg-slate-300",
            ].join(" ")}
          >
            <span
              className={[
                "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
                isActive ? "translate-x-6" : "translate-x-1",
              ].join(" ")}
            />
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={adminPrimaryButtonClass + (loading ? " opacity-60" : "")}
        >
          {loading ? "Creating…" : "Create unit"}
        </button>
      </form>
    </div>
  );
}

