"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminPageHeader, {
  adminPrimaryButtonClass,
} from "@/components/admin/AdminPageHeader";
import AdminImageField from "@/components/admin/AdminImageField";

const LESSON_TYPES = [
  "VOCABULARY",
  "GRAMMAR",
  "CONVERSATION",
  "PRONUNCIATION",
  "CULTURE",
  "MIXED",
] as const;

const TITLE_MAX = 200;
const THUMB_MAX = 2000;

type UnitOption = {
  id: number;
  title: string;
  isActive: boolean;
  course: { title: string | null } | null;
};

type FieldErrors = {
  unitId?: string;
  title?: string;
  difficulty?: string;
  estimatedTime?: string;
  thumbnail?: string;
};

function messageFromResponseBody(text: string, status: number): string {
  const t = text.trim();
  if (!t) return `Request failed (${status})`;
  try {
    const j = JSON.parse(t) as { error?: string };
    if (typeof j.error === "string" && j.error.trim()) return j.error.trim();
  } catch {
    /* plain text or HTML */
  }
  return t.slice(0, 280);
}

function validateFields(input: {
  unitId: string;
  title: string;
  difficulty: string;
  estimatedTime: string;
  thumbnail: string;
}): FieldErrors {
  const err: FieldErrors = {};
  if (!input.unitId.trim()) {
    err.unitId = "Choose a unit for this lesson.";
  }
  const t = input.title.trim();
  if (!t) {
    err.title = "Title is required.";
  } else if (t.length > TITLE_MAX) {
    err.title = `Title must be at most ${TITLE_MAX} characters.`;
  }
  const d = Number(input.difficulty);
  if (!Number.isFinite(d) || !Number.isInteger(d) || d < 1 || d > 5) {
    err.difficulty = "Difficulty must be a whole number from 1 to 5.";
  }
  if (input.estimatedTime.trim()) {
    const et = Number(input.estimatedTime);
    if (!Number.isFinite(et) || !Number.isInteger(et) || et < 0) {
      err.estimatedTime =
        "Estimated time must be a whole number of minutes (0 or greater).";
    }
  }
  const th = input.thumbnail.trim();
  if (th.length > THUMB_MAX) {
    err.thumbnail = `URL or path is too long (max ${THUMB_MAX} characters).`;
  }
  return err;
}

export default function NewLessonPage() {
  const router = useRouter();
  const [units, setUnits] = useState<UnitOption[]>([]);
  const [unitsLoading, setUnitsLoading] = useState(true);
  const [unitsError, setUnitsError] = useState<string | null>(null);
  const [unitId, setUnitId] = useState("");
  const [unitQuery, setUnitQuery] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<string>("VOCABULARY");
  const [difficulty, setDifficulty] = useState("1");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [successOpen, setSuccessOpen] = useState(false);
  const [createdLessonId, setCreatedLessonId] = useState<number | null>(null);

  const unitsForSelect = useMemo(() => {
    const q = unitQuery.trim().toLowerCase();
    const filtered = !q
      ? units
      : units.filter((u) => {
          const courseTitle = u.course?.title ?? "";
          return (
            u.title.toLowerCase().includes(q) ||
            courseTitle.toLowerCase().includes(q)
          );
        });
    const selected =
      unitId !== "" ? units.find((u) => String(u.id) === unitId) : undefined;
    if (selected && !filtered.some((u) => u.id === selected.id)) {
      return [selected, ...filtered];
    }
    return filtered;
  }, [units, unitQuery, unitId]);

  const loadUnits = useCallback(async () => {
    setUnitsLoading(true);
    setUnitsError(null);
    try {
      const res = await fetch("/api/admin/units");
      const text = await res.text();
      let obj: { units?: unknown; error?: string };
      try {
        obj = text ? (JSON.parse(text) as { units?: unknown; error?: string }) : {};
      } catch {
        setUnits([]);
        setUnitsError(
          res.ok
            ? "Units response was not valid JSON."
            : messageFromResponseBody(text, res.status)
        );
        return;
      }
      if (!res.ok) {
        setUnits([]);
        setUnitsError(
          typeof obj.error === "string" && obj.error.trim()
            ? obj.error
            : messageFromResponseBody(text, res.status)
        );
        return;
      }
      setUnits(Array.isArray(obj.units) ? (obj.units as UnitOption[]) : []);
    } catch {
      setUnits([]);
      setUnitsError("Network error while loading units. Check your connection.");
    } finally {
      setUnitsLoading(false);
    }
  }, []);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const initialUnitId = sp.get("unitId");
    if (initialUnitId && /^\d+$/.test(initialUnitId)) {
      setUnitId(initialUnitId);
    }
    void loadUnits();
  }, [loadUnits]);

  useEffect(() => {
    if (!successOpen) return;
    const t = window.setTimeout(() => {
      if (createdLessonId != null) {
        router.replace(`/admin/lessons/${createdLessonId}`);
      } else {
        router.replace("/admin/lessons");
      }
    }, 900);
    return () => window.clearTimeout(t);
  }, [successOpen, createdLessonId, router]);

  const canSubmit =
    !submitting &&
    !unitsLoading &&
    !unitsError &&
    units.length > 0 &&
    unitId !== "" &&
    units.some((u) => String(u.id) === unitId) &&
    title.trim().length > 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const nextField = validateFields({
      unitId,
      title,
      difficulty,
      estimatedTime,
      thumbnail,
    });
    setFieldErrors(nextField);
    if (Object.keys(nextField).length > 0) {
      setFormError("Fix the highlighted fields and try again.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitId: Number(unitId),
          title: title.trim(),
          description: description.trim() || null,
          type,
          difficulty: Number(difficulty),
          estimatedTime: estimatedTime.trim()
            ? Number(estimatedTime)
            : null,
          isActive,
          thumbnail: thumbnail.trim() || null,
        }),
      });

      const text = await res.text();
      let payload: unknown;
      try {
        payload = text ? JSON.parse(text) : null;
      } catch {
        setFormError(messageFromResponseBody(text, res.status));
        return;
      }

      if (!res.ok) {
        const msg =
          typeof (payload as { error?: string }).error === "string" &&
          (payload as { error: string }).error.trim()
            ? (payload as { error: string }).error.trim()
            : messageFromResponseBody(text, res.status);
        if (res.status === 400) {
          if (/unit/i.test(msg) && /select|valid/i.test(msg)) {
            setFieldErrors((prev) => ({ ...prev, unitId: msg }));
          } else if (/title/i.test(msg)) {
            setFieldErrors((prev) => ({ ...prev, title: msg }));
          } else if (/difficulty/i.test(msg)) {
            setFieldErrors((prev) => ({ ...prev, difficulty: msg }));
          } else if (/time|estimated/i.test(msg)) {
            setFieldErrors((prev) => ({ ...prev, estimatedTime: msg }));
          } else if (/thumbnail|url/i.test(msg)) {
            setFieldErrors((prev) => ({ ...prev, thumbnail: msg }));
          }
        }
        setFormError(msg);
        return;
      }

      const lesson = (payload as { lesson?: { id?: number } }).lesson;
      if (lesson?.id != null) {
        setCreatedLessonId(lesson.id);
      }
      setSuccessOpen(true);
    } catch {
      setFormError(
        "Network error — could not reach the server. Check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = (hasError: boolean) =>
    [
      "w-full rounded-xl border px-3 py-2 text-slate-900",
      hasError
        ? "border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-red-200"
        : "border-slate-300 focus:border-indigo-400 focus:ring-indigo-100",
    ].join(" ");

  return (
    <div className="max-w-xl space-y-8">
      {successOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lesson-create-success-title"
        >
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl ring-1 ring-black/5">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path
                    fillRule="evenodd"
                    d="M16.704 5.29a1 1 0 0 1 .006 1.415l-7.5 7.6a1 1 0 0 1-1.42.004L3.296 9.814a1 1 0 1 1 1.408-1.42l3.083 3.06 6.793-6.887a1 1 0 0 1 1.424.723Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <div>
                <h2
                  id="lesson-create-success-title"
                  className="text-base font-semibold text-slate-900"
                >
                  Lesson created
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Opening the editor to add parts, flashcards, and exercises…
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              {createdLessonId != null ? (
                <Link
                  href={`/admin/lessons/${createdLessonId}`}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-indigo-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Edit lesson
                </Link>
              ) : null}
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white py-2.5 text-center text-sm font-semibold text-slate-800 hover:bg-slate-50"
                onClick={() => router.push("/admin/lessons")}
              >
                All lessons
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminPageHeader
        title="New lesson"
        description="Step 1: create the lesson shell (unit, title, type). Step 2: on the next screen you add lesson parts, flashcards, and exercises."
        action={
          <Link
            href="/admin/lessons"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back
          </Link>
        }
      />

      {unitsLoading ? (
        <p className="text-sm text-slate-600">Loading units…</p>
      ) : null}

      {unitsError ? (
        <div
          className="rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-800"
          role="alert"
        >
          <p className="font-medium">Could not load units</p>
          <p className="mt-1 text-red-700/90">{unitsError}</p>
          <button
            type="button"
            onClick={() => void loadUnits()}
            className="mt-3 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-900 hover:bg-red-50"
          >
            Retry
          </button>
        </div>
      ) : null}

      {!unitsLoading && !unitsError && units.length === 0 ? (
        <div
          className="rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-sm text-amber-950"
          role="status"
        >
          <p className="font-medium">No units yet</p>
          <p className="mt-1 text-amber-900/90">
            Create a unit first, then you can attach lessons to it.
          </p>
          <Link
            href="/admin/units/new"
            className="mt-3 inline-block text-sm font-semibold text-amber-950 underline underline-offset-2 hover:text-amber-800"
          >
            New unit →
          </Link>
        </div>
      ) : null}

      {!unitsLoading && !unitsError && units.length > 0 ? (
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 text-sm text-indigo-950">
          <p className="font-medium text-indigo-950">Where is the rest?</p>
          <p className="mt-1 leading-relaxed text-indigo-900/90">
            This page only creates the lesson record. After you click{" "}
            <span className="font-semibold">Create lesson</span>, you go to{" "}
            <span className="font-semibold">Edit lesson</span> — there you add{" "}
            <span className="font-semibold">parts</span>,{" "}
            <span className="font-semibold">flashcards</span>, and{" "}
            <span className="font-semibold">exercises</span>.
          </p>
        </div>
      ) : null}

      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm"
        noValidate
      >
        {formError ? (
          <div
            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800"
            role="alert"
          >
            {formError}
          </div>
        ) : null}

        <div className="grid gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Find unit
            </label>
            <input
              value={unitQuery}
              onChange={(e) => {
                setUnitQuery(e.target.value);
                setFieldErrors((f) => ({ ...f, unitId: undefined }));
              }}
              disabled={unitsLoading || !!unitsError || units.length === 0}
              placeholder="Search by unit or course…"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 disabled:bg-slate-100 disabled:text-slate-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Unit *
            </label>
            <select
              value={unitId}
              onChange={(e) => {
                setUnitId(e.target.value);
                setFieldErrors((f) => ({ ...f, unitId: undefined }));
                setFormError(null);
              }}
              disabled={unitsLoading || !!unitsError || units.length === 0}
              aria-invalid={Boolean(fieldErrors.unitId)}
              aria-describedby={fieldErrors.unitId ? "err-unit" : undefined}
              className={inputClass(Boolean(fieldErrors.unitId))}
            >
              <option value="">Select unit…</option>
              {unitsForSelect.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.title}
                  {!u.isActive ? " (inactive)" : ""}
                  {u.course?.title ? ` — ${u.course.title}` : ""}
                </option>
              ))}
            </select>
            {fieldErrors.unitId ? (
              <p id="err-unit" className="mt-1 text-xs font-medium text-red-600">
                {fieldErrors.unitId}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Title *{" "}
            <span className="font-normal text-slate-400">
              ({title.trim().length}/{TITLE_MAX})
            </span>
          </label>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setFieldErrors((f) => ({ ...f, title: undefined }));
              setFormError(null);
            }}
            maxLength={TITLE_MAX}
            disabled={unitsLoading || !!unitsError}
            aria-invalid={Boolean(fieldErrors.title)}
            aria-describedby={fieldErrors.title ? "err-title" : undefined}
            className={inputClass(Boolean(fieldErrors.title))}
            placeholder="e.g. Greetings in a café"
          />
          {fieldErrors.title ? (
            <p id="err-title" className="mt-1 text-xs font-medium text-red-600">
              {fieldErrors.title}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Difficulty
            </label>
            <input
              type="number"
              min={1}
              max={5}
              step={1}
              value={difficulty}
              onChange={(e) => {
                setDifficulty(e.target.value);
                setFieldErrors((f) => ({ ...f, difficulty: undefined }));
                setFormError(null);
              }}
              aria-invalid={Boolean(fieldErrors.difficulty)}
              aria-describedby={fieldErrors.difficulty ? "err-diff" : undefined}
              className={inputClass(Boolean(fieldErrors.difficulty))}
            />
            {fieldErrors.difficulty ? (
              <p id="err-diff" className="mt-1 text-xs font-medium text-red-600">
                {fieldErrors.difficulty}
              </p>
            ) : null}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Estimated time (min)
            </label>
            <input
              type="number"
              min={0}
              step={1}
              value={estimatedTime}
              onChange={(e) => {
                setEstimatedTime(e.target.value);
                setFieldErrors((f) => ({ ...f, estimatedTime: undefined }));
                setFormError(null);
              }}
              placeholder="optional"
              aria-invalid={Boolean(fieldErrors.estimatedTime)}
              aria-describedby={
                fieldErrors.estimatedTime ? "err-time" : undefined
              }
              className={inputClass(Boolean(fieldErrors.estimatedTime))}
            />
            {fieldErrors.estimatedTime ? (
              <p id="err-time" className="mt-1 text-xs font-medium text-red-600">
                {fieldErrors.estimatedTime}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
          >
            {LESSON_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
          />
        </div>

        <div className={fieldErrors.thumbnail ? "rounded-xl ring-2 ring-red-200" : ""}>
          <AdminImageField
            label="Lesson cover"
            value={thumbnail}
            onChange={(v) => {
              setThumbnail(v);
              setFieldErrors((f) => ({ ...f, thumbnail: undefined }));
              setFormError(null);
            }}
            description="Optional thumbnail for lesson lists."
          />
          {fieldErrors.thumbnail ? (
            <p className="mt-1 text-xs font-medium text-red-600">
              {fieldErrors.thumbnail}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-slate-900">Status</p>
            <p className="mt-0.5 text-xs text-slate-600">
              {isActive ? "Active (visible in app)" : "Inactive (hidden in app)"}
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
          disabled={!canSubmit}
          className={
            adminPrimaryButtonClass +
            (!canSubmit || submitting ? " cursor-not-allowed opacity-60" : "")
          }
        >
          {submitting ? "Creating…" : "Create lesson"}
        </button>
        {!canSubmit && !submitting && units.length > 0 && !unitsLoading ? (
          <p className="text-center text-xs text-slate-500">
            Choose a unit and enter a title to enable create.
          </p>
        ) : null}
      </form>
    </div>
  );
}
