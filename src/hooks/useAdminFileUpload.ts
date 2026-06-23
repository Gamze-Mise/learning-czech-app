"use client";

import { useCallback, useState } from "react";
import { messageFromResponseBody } from "@/lib/http/parse-response";

type UploadResult = { ok: true; url: string } | { ok: false; error: string };

async function uploadAdminFile(file: File): Promise<UploadResult> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const text = await res.text();

  let data: { url?: string; error?: string };
  try {
    data = text ? (JSON.parse(text) as { url?: string; error?: string }) : {};
  } catch {
    return { ok: false, error: messageFromResponseBody(text) };
  }

  if (!res.ok) {
    return {
      ok: false,
      error:
        typeof data.error === "string" && data.error.trim()
          ? data.error
          : messageFromResponseBody(text, res.status),
    };
  }

  if (!data.url) return { ok: false, error: "Upload failed (no URL returned)." };
  return { ok: true, url: data.url };
}

export function useAdminFileUpload(onUploaded: (url: string) => void) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);
      try {
        const result = await uploadAdminFile(file);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        onUploaded(result.url);
      } catch {
        setError("Network error");
      } finally {
        setUploading(false);
      }
    },
    [onUploaded]
  );

  return { uploading, error, upload, setError };
}

export function isPreviewableMediaUrl(value: string): boolean {
  const trimmed = value.trim();
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  );
}
