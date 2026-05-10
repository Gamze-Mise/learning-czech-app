import { NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { jsonError, jsonOk, logApiError } from "@/lib/api-response";
import { getCloudinary } from "@/lib/cloudinary";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_AUDIO_BYTES = 20 * 1024 * 1024;

const IMAGE_MIMES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const AUDIO_MIMES = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/wave",
  "audio/ogg",
  "audio/webm",
  "audio/aac",
  "audio/x-aac",
  "audio/mp4",
  "audio/x-m4a",
  "audio/m4a",
  "audio/flac",
  "audio/x-flac",
]);

const extByMime: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function guessMimeFromFilename(name: string): string | null {
  const n = name.trim().toLowerCase();
  if (n.endsWith(".mp3")) return "audio/mpeg";
  if (n.endsWith(".wav")) return "audio/wav";
  if (n.endsWith(".ogg")) return "audio/ogg";
  if (n.endsWith(".webm")) return "audio/webm";
  if (n.endsWith(".m4a") || n.endsWith(".mp4")) return "audio/mp4";
  if (n.endsWith(".aac")) return "audio/aac";
  if (n.endsWith(".flac")) return "audio/flac";
  if (n.endsWith(".jpg") || n.endsWith(".jpeg")) return "image/jpeg";
  if (n.endsWith(".png")) return "image/png";
  if (n.endsWith(".webp")) return "image/webp";
  if (n.endsWith(".gif")) return "image/gif";
  return null;
}

function resolveMime(entry: Blob, raw: string): string {
  if (raw && raw !== "application/octet-stream") return raw;
  const name =
    typeof File !== "undefined" && entry instanceof File && entry.name
      ? entry.name
      : "";
  return guessMimeFromFilename(name) ?? raw;
}

type UploadKind = "image" | "audio";

function classifyMime(mime: string): UploadKind | null {
  if (IMAGE_MIMES.has(mime)) return "image";
  if (AUDIO_MIMES.has(mime)) return "audio";
  return null;
}

export async function POST(request: NextRequest) {
  const { session, response } = await requireAdminSession();
  if (!session) return response!;

  try {
    const form = await request.formData();
    const entry = form.get("file");
    if (!(entry instanceof Blob)) {
      return jsonError("Missing file", 400);
    }

    const rawMime = entry.type || "application/octet-stream";
    const mime = resolveMime(entry, rawMime);
    const kind = classifyMime(mime);

    if (!kind) {
      return jsonError(
        "Only images (JPEG, PNG, WebP, GIF) or common audio formats (MP3, WAV, OGG, M4A, etc.) are allowed.",
        400
      );
    }

    const maxBytes = kind === "image" ? MAX_IMAGE_BYTES : MAX_AUDIO_BYTES;
    if (entry.size > maxBytes) {
      return jsonError(
        kind === "image"
          ? "Image must be 5MB or smaller."
          : "Audio must be 20MB or smaller.",
        400
      );
    }

    const buffer = Buffer.from(await entry.arrayBuffer());
    const publicId = `${Date.now()}-${randomBytes(8).toString("hex")}`;

    let result: { secure_url?: string };
    try {
      const cloudinary = getCloudinary();
      result = await new Promise<{ secure_url?: string }>((resolve, reject) => {
        if (kind === "image") {
          const ext = extByMime[mime] ?? "bin";
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: "image",
              folder: "learning-czech/admin",
              public_id: publicId,
              overwrite: false,
              format: ext,
            },
            (err, res) => {
              if (err) return reject(err);
              resolve(res ?? {});
            }
          );
          stream.end(buffer);
        } else {
          // Cloudinary serves many audio types under the "video" resource type.
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: "video",
              folder: "learning-czech/admin/audio",
              public_id: publicId,
              overwrite: false,
            },
            (err, res) => {
              if (err) return reject(err);
              resolve(res ?? {});
            }
          );
          stream.end(buffer);
        }
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "";
      if (message.includes("Cloudinary is not configured")) {
        return jsonError("Cloudinary is not configured on this server.", 503);
      }
      throw e;
    }

    const url = typeof result.secure_url === "string" ? result.secure_url : "";
    if (!url) {
      return jsonError("Upload failed (no URL returned).", 502);
    }
    return jsonOk({ url });
  } catch (error) {
    logApiError("admin/upload POST", error);
    return jsonError("Upload could not be saved. Paste a direct file URL instead.", 500);
  }
}
