import { Resend } from "resend";
import { devLog } from "@/lib/logger";

/** English product name used in all transactional email subjects and HTML (do not use non-English APP_NAME here). */
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

export type SendVerificationEmailParams = {
  to: string;
  name: string | null;
  verifyUrl: string;
};

/**
 * Sends verification email via Resend (free tier: https://resend.com).
 * If RESEND_API_KEY is missing, logs to console in development (no throw).
 */
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

/**
 * Password reset email (same Resend setup as verification).
 */
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

  const resend = getResend();
  if (!resend) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[email] RESEND_API_KEY not set — password reset link (dev only):",
        params.resetUrl
      );
      return { ok: true, delivered: false };
    }
    return { ok: false, error: "Email not configured (RESEND_API_KEY)" };
  }

  const { data, error } = await resend.emails.send({
    from,
    to: [params.to],
    subject: `Reset your ${brand} password`,
    html,
  });

  if (error) {
    console.error("[email] Resend error (password reset):", error);
    return { ok: false, error: error.message };
  }
  devLog("[email] Password reset sent. Resend id:", data?.id ?? "(none)");
  return { ok: true, delivered: true };
}
