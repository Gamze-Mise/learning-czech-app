"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminPageHeader, {
  adminPrimaryButtonClass,
} from "@/components/admin/AdminPageHeader";
import AdminImageField from "@/components/admin/AdminImageField";

type UnitDetail = {
  id: number;
  title: string;
  order: number;
  level: number;
  description: string | null;
  thumbnail: string | null;
  isActive: boolean;
  courseId: number | null;
  course?: { id: number; title: string };
  lessons?: Array<{ id: number; title: string; order: number; type: string; isActive: boolean }>;
};

export default function EditUnitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [unit, setUnit] = useState<UnitDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccessOpen, setSaveSuccessOpen] = useState(false);

  useEffect(() => {
    if (!saveSuccessOpen) return;
    const t = window.setTimeout(() => {
      router.push("/admin/units");
    }, 2500);
    return () => window.clearTimeout(t);
  }, [saveSuccessOpen, router]);

  useEffect(() => {
    setLoading(true);
    setLoadError(null);
    fetch(`/api/admin/units/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((d) => {
        setUnit(d.unit);
        setLoadError(null);
      })
      .catch(() => {
        setUnit(null);
        setLoadError("Unit not found");
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!unit) return;
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`/api/admin/units/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: unit.title,
          level: unit.level,
          description: unit.description,
          thumbnail: unit.thumbnail,
          isActive: unit.isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error ?? "Update failed");
        return;
      }
      setUnit((prev) => {
        const u = data.unit as UnitDetail;
        if (!prev) return u;
        return { ...u, lessons: prev.lessons, course: prev.course };
      });
      setSaveSuccessOpen(true);
    } catch {
      setSaveError("Network error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-slate-600">Loading…</p>;
  if (!unit) {
    return (
      <div>
        <p className="text-red-600">{loadError ?? "Not found"}</p>
        <Link href="/admin/units" className="text-indigo-600 hover:underline">
          ← Back
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-8 relative">
      {saveSuccessOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="unit-save-success-title"
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl ring-1 ring-black/5 animate-pulse"
          >
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
                <h2 id="unit-save-success-title" className="text-base font-semibold text-slate-900">
                  Saved
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Returning to the list…</p>
              </div>
            </div>
            <button
              type="button"
              className="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-center text-sm font-medium text-white hover:bg-slate-800"
              onClick={() => router.push("/admin/units")}
            >
              Back to list
            </button>
          </div>
        </div>
      )}
      <AdminPageHeader
        title="Edit unit"
        description="Edit unit details, visibility, and manage lessons."
        action={
          <Link
            href="/admin/units"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back
          </Link>
        }
      />

      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold text-slate-900">Lessons in this unit</h2>
            <p className="text-sm text-slate-600 mt-1">
              Jump into a lesson to manage parts, flashcards, and exercises.
            </p>
          </div>
          <Link
            href={`/admin/lessons/new?unitId=${encodeURIComponent(String(unit.id))}`}
            className={adminPrimaryButtonClass}
          >
            + New lesson
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="px-3 py-2.5 font-semibold">Lesson</th>
                <th className="px-3 py-2.5 font-semibold">Type</th>
                <th className="px-3 py-2.5 font-semibold">Status</th>
                <th className="px-3 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {(unit.lessons ?? []).map((l) => (
                <tr key={l.id} className="border-b border-slate-100">
                  <td className="px-3 py-2.5 font-medium text-slate-900">
                    <span className="text-slate-400 mr-2">{l.order}.</span>
                    {l.title}
                  </td>
                  <td className="px-3 py-2.5 text-slate-600">{l.type}</td>
                  <td className="px-3 py-2.5">
                    {l.isActive ? (
                      <span className="text-green-700">Active</span>
                    ) : (
                      <span className="text-slate-500">Inactive</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <Link
                      href={`/admin/lessons/${l.id}`}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
              {(unit.lessons?.length ?? 0) === 0 && (
                <tr>
                  <td className="px-3 py-6 text-center text-slate-500" colSpan={4}>
                    No lessons yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-5 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm"
      >
        {saveError && (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{saveError}</p>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Title
          </label>
          <input
            value={unit.title}
            onChange={(e) => setUnit({ ...unit, title: e.target.value })}
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
            value={unit.level}
            onChange={(e) => setUnit({ ...unit, level: Number(e.target.value) })}
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            value={unit.description ?? ""}
            onChange={(e) => setUnit({ ...unit, description: e.target.value || null })}
            rows={4}
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
          />
        </div>

        <AdminImageField
          label="Thumbnail"
          value={unit.thumbnail ?? ""}
          onChange={(v) => setUnit({ ...unit, thumbnail: v.trim() || null })}
          description="Upload a file (stored under /public/uploads) or paste an image URL."
        />

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-slate-900">Status</p>
            <p className="text-xs text-slate-600 mt-0.5">
              {unit.isActive ? "Active (visible in app)" : "Passive (hidden in app)"}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={unit.isActive}
            onClick={() => setUnit({ ...unit, isActive: !unit.isActive })}
            className={[
              "relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
              unit.isActive ? "bg-indigo-600" : "bg-slate-300",
            ].join(" ")}
          >
            <span
              className={[
                "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
                unit.isActive ? "translate-x-6" : "translate-x-1",
              ].join(" ")}
            />
          </button>
        </div>

        <button
          type="submit"
          disabled={saving}
          className={adminPrimaryButtonClass + (saving ? " opacity-60" : "")}
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>

    </div>
  );
}

