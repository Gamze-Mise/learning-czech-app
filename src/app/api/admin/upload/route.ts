import { NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { jsonError, jsonOk, logApiError } from "@/lib/api-response";
import { getCloudinary } from "@/lib/cloudinary";
import {
  classifyUploadMime,
  IMAGE_EXT_BY_MIME,
  MAX_AUDIO_BYTES,
  MAX_IMAGE_BYTES,
  resolveUploadMime,
} from "@/lib/admin/upload-mime";

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
    const mime = resolveUploadMime(entry, rawMime);
    const kind = classifyUploadMime(mime);

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
          const ext = IMAGE_EXT_BY_MIME[mime] ?? "bin";
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
