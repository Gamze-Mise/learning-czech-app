"use client";

import { useRef, useState } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (next: string) => void;
  description?: string;
  compact?: boolean;
  /**
   * File upload hits the server filesystem; leave off until storage is configured.
   * URL paste + preview still work.
   */
  enableFileUpload?: boolean;
};

function messageFromBody(text: string): string {
  const t = text.trim();
  if (!t) return "Upload failed";
  try {
    const j = JSON.parse(t) as { error?: string };
    if (typeof j.error === "string" && j.error.trim()) return j.error.trim();
  } catch {
    /* ignore */
  }
  return t.slice(0, 200);
}

export default function AdminImageField({
  label,
  value,
  onChange,
  description,
  compact,
  enableFileUpload = false,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = value.trim();
  const showPreview =
    trimmed &&
    (trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("/"));

  async function uploadFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const text = await res.text();
      let data: { url?: string; error?: string };
      try {
        data = text ? (JSON.parse(text) as { url?: string; error?: string }) : {};
      } catch {
        setError(messageFromBody(text));
        return;
      }
      if (!res.ok) {
        setError(
          typeof data.error === "string" && data.error.trim()
            ? data.error
            : messageFromBody(text)
        );
        return;
      }
      if (data.url) onChange(data.url);
    } catch {
      setError("Network error");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={compact ? "space-y-1.5" : "space-y-2"}>
      <div>
        <label
          className={
            compact
              ? "block text-xs font-semibold text-slate-700"
              : "block text-sm font-medium text-slate-700 mb-1"
          }
        >
          {label}
        </label>
        {description ? (
          <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{description}</p>
        ) : null}
        {!enableFileUpload ? (
          <p className="mt-1 text-xs text-slate-500">
            Paste an image URL below. File upload is turned off until storage is set up.
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        {showPreview ? (
          <div className="shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={trimmed}
              alt=""
              className={
                compact
                  ? "h-20 w-20 object-cover"
                  : "h-28 w-28 object-cover sm:h-32 sm:w-32"
              }
            />
          </div>
        ) : null}

        <div className="min-w-0 flex-1 space-y-2">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://…"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
          {enableFileUpload ? (
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  e.target.value = "";
                  if (f) void uploadFile(f);
                }}
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
              >
                {uploading ? "Uploading…" : "Upload image"}
              </button>
              {trimmed ? (
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="text-xs font-medium text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline"
                >
                  Clear
                </button>
              ) : null}
            </div>
          ) : trimmed ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-xs font-medium text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline"
            >
              Clear
            </button>
          ) : null}
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
