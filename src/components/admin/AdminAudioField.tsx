"use client";

import { useRef, useState } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (next: string) => void;
  description?: string;
  compact?: boolean;
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

export default function AdminAudioField({
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
            Paste an audio URL below. Turn on file upload when storage is configured.
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        {showPreview ? (
          <div className="min-w-0 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2 shadow-sm">
            <audio
              controls
              src={trimmed}
              className={compact ? "h-10 w-48 max-w-full" : "h-10 w-full max-w-xs sm:w-56"}
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
                accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/webm,audio/aac,audio/mp4,audio/x-m4a,audio/flac,.mp3,.wav,.m4a"
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
                {uploading ? "Uploading…" : "Upload audio"}
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
