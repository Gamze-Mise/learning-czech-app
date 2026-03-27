import { Resend } from "resend";
import { devLog } from "@/lib/logger";

const DEFAULT_EMAIL_BRAND = "Learning Czech";

function getEmailBrand(): string {
  const fromEnv = process.env.EMAIL_BRAND?.trim();
  return fromEnv || DEFAULT_EMAIL_BRAND;
}

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key || key === "re_xxxxxxxx") return null;
  return new Resend(key);
}

async function sendViaResendHttp(params: {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<SendEmailResult> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key || key === "re_xxxxxxxx") {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[email] Add RESEND_API_KEY to .env.local and restart `npm run dev`."
      );
    } else {
      console.error(
        "[email] RESEND_API_KEY missing or placeholder — transactional email disabled. Set it in Vercel Project Settings → Environment Variables."
      );
    }
    return { ok: false, error: "Email not configured (RESEND_API_KEY)" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: params.from,
        to: [params.to],
        subject: params.subject,
        html: params.html,
        text: params.text,
      }),
    });

    const raw = await res.text();
    let parsed: { message?: string; id?: string } = {};
    try {
      parsed = JSON.parse(raw) as typeof parsed;
    } catch {
      /* ignore */
    }

    if (!res.ok) {
      console.error("[email] Resend API error", res.status, raw);
      return {
        ok: false,
        error:
          parsed.message ||
          `Resend request failed (${res.status}). Check RESEND_API_KEY, EMAIL_FROM, and recipient rules.`,
      };
    }

    devLog("[email] Resend email id:", parsed.id ?? "(none)");
    return { ok: true, delivered: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[email] Resend fetch failed:", e);
    return { ok: false, error: msg };
  }
}

export type SendVerificationEmailParams = {
  to: string;
  name: string | null;
  verifyUrl: string;
};

export type SendEmailResult =
  | { ok: true; delivered: true }
  | { ok: true; delivered: false }
  | { ok: false; error: string };

export async function sendVerificationEmail(
  params: SendVerificationEmailParams
): Promise<SendEmailResult> {
  const from =
    process.env.EMAIL_FROM ?? "Learning Czech <onboarding@resend.dev>";
  const brand = getEmailBrand();

  const html = `
    <div lang="en" style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
      <h1 style="color: #1e3a8a;">${brand}</h1>
      <p>Hi${params.name ? ` ${params.name}` : ""},</p>
      <p>Please confirm your email address by clicking the button below:</p>
      <p style="margin: 24px 0;">
        <a href="${params.verifyUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
          Verify email
        </a>
      </p>
      <p style="color: #64748b; font-size: 14px;">If you did not create an account, you can ignore this email.</p>
      <p style="color: #64748b; font-size: 12px; word-break: break-all;">Or copy this link: ${params.verifyUrl}</p>
    </div>
  `;

  const resend = getResend();
  if (!resend) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[email] RESEND_API_KEY not set — verification link (dev only):",
        params.verifyUrl
      );
      return { ok: true, delivered: false };
    }
    return { ok: false, error: "Email not configured (RESEND_API_KEY)" };
  }

  const { data, error } = await resend.emails.send({
    from,
    to: [params.to],
    subject: `Confirm your ${brand} account`,
    html,
  });

  if (error) {
    console.error("[email] Resend error (verification):", error);
    return { ok: false, error: error.message };
  }
  devLog("[email] Verification sent. Resend id:", data?.id ?? "(none)");
  return { ok: true, delivered: true };
}

export type SendPasswordResetEmailParams = {
  to: string;
  name: string | null;
  resetUrl: string;
};

export async function sendPasswordResetEmail(
  params: SendPasswordResetEmailParams
): Promise<SendEmailResult> {
  const from =
    process.env.EMAIL_FROM ?? "Learning Czech <onboarding@resend.dev>";
  const brand = getEmailBrand();

  const html = `
    <div lang="en" style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
      <h1 style="color: #1e3a8a;">${brand}</h1>
      <p>Hi${params.name ? ` ${params.name}` : ""},</p>
      <p>We received a request to reset your password. Click the button below to choose a new password:</p>
      <p style="margin: 24px 0;">
        <a href="${params.resetUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
          Reset password
        </a>
      </p>
      <p style="color: #64748b; font-size: 14px;">This link expires in 1 hour. If you didn’t ask for a reset, you can ignore this email.</p>
      <p style="color: #64748b; font-size: 12px; word-break: break-all;">Or copy: ${params.resetUrl}</p>
    </div>
  `;

  const text = [
    `${brand} — reset your password`,
    "",
    `Open this link (expires in 1 hour):`,
    params.resetUrl,
    "",
    `If you did not request a reset, you can ignore this email.`,
  ].join("\n");

  return sendViaResendHttp({
    from,
    to: params.to.trim(),
    subject: `Reset your ${brand} password`,
    html,
    text,
  });
}
