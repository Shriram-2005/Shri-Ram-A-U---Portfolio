import crypto from "crypto";
import nodemailer from "nodemailer";

export type OtpPurpose = "login" | "request_change" | "confirm_change";

interface OtpRecord {
  code: string;
  purpose: OtpPurpose;
  expiresAt: number; // Unix timestamp in ms
  attempts: number;
}

// In-memory OTP storage for rapid 30s validation
const activeOtps = new Map<string, OtpRecord>();

// OTP lifespan: exactly 30 seconds
export const OTP_EXPIRY_SECONDS = 30;

function cleanupExpired() {
  const now = Date.now();
  for (const [key, record] of activeOtps.entries()) {
    if (now > record.expiresAt) {
      activeOtps.delete(key);
    }
  }
}

/**
 * Generate a cryptographically secure 6-digit OTP
 */
export function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Create and register an OTP with exact 30s lifespan
 */
export function registerOtp(purpose: OtpPurpose): { code: string; expiresAt: number } {
  cleanupExpired();
  const code = generateOtp();
  const expiresAt = Date.now() + OTP_EXPIRY_SECONDS * 1000;

  activeOtps.set(purpose, {
    code,
    purpose,
    expiresAt,
    attempts: 0,
  });

  return { code, expiresAt };
}

/**
 * Verify an OTP. Returns { valid: boolean, error?: string }
 */
export function verifyOtp(purpose: OtpPurpose, candidate: string): { valid: boolean; error?: string } {
  cleanupExpired();
  const record = activeOtps.get(purpose);

  if (!record) {
    return { valid: false, error: "OTP expired or not found. Please request a new OTP." };
  }

  const now = Date.now();
  if (now > record.expiresAt) {
    activeOtps.delete(purpose);
    return { valid: false, error: "OTP expired (30-second window exceeded). Please request a new code." };
  }

  record.attempts += 1;
  if (record.attempts > 3) {
    activeOtps.delete(purpose);
    return { valid: false, error: "Too many failed attempts. OTP invalidated." };
  }

  if (record.code.trim() !== candidate.trim()) {
    const remainingSeconds = Math.max(0, Math.ceil((record.expiresAt - now) / 1000));
    return { valid: false, error: `Invalid code. ${remainingSeconds}s remaining.` };
  }

  // Consume on success
  activeOtps.delete(purpose);
  return { valid: true };
}

/**
 * Dispatch OTP via SMTP to owner email
 */
export async function sendOtpEmail(code: string, purpose: OtpPurpose): Promise<boolean> {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";
  const to = process.env.CONTACT_EMAIL_TO || user || "shriram2005au@gmail.com";

  if (!user || !pass) {
    console.error("SMTP credentials missing in environment variables");
    return false;
  }

  let title = "Portfolio Admin Access";
  let description = "Enter this one-time code within 30 seconds to authenticate without a username or password.";

  if (purpose === "login") {
    title = "One-Time Passwordless Login Code";
    description = "You requested to log into your Portfolio CMS. Enter this code within 30 seconds. No password or username required.";
  } else if (purpose === "request_change") {
    title = "Authorize Secret Keyword Change";
    description = "You requested to change your developer terminal secret keyword. Enter this code within 30 seconds to proceed.";
  } else if (purpose === "confirm_change") {
    title = "Confirm Secret Keyword Update";
    description = "Enter this verification code in the developer terminal within 30 seconds to finalize and commit your new secret keyword to Supabase.";
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  const mailOptions = {
    from: `"Shri Ram Portfolio Security" <${user}>`,
    to,
    subject: `[30s Code: ${code}] ${title} - Portfolio Terminal`,
    text: `${title}\n\nYour one-time authorization code is: ${code}\n\nWARNING: This code expires in exactly 30 seconds.\n\n${description}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #27272a; border-radius: 12px; background: #09090b; color: #f4f4f5;">
        <div style="border-bottom: 1px solid #27272a; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #a855f7; font-size: 18px; font-family: monospace;">[SECURITY ACCESS VERIFICATION]</h2>
          <p style="margin: 6px 0 0; color: #a1a1aa; font-size: 13px;">Shri Ram A U Portfolio - Developer Shell</p>
        </div>
        
        <p style="color: #e4e4e7; font-size: 14px; line-height: 1.5;">${description}</p>

        <div style="margin: 24px 0; padding: 20px; background: #18181b; border: 1px dashed #a855f7; border-radius: 8px; text-align: center;">
          <div style="font-size: 11px; text-transform: uppercase; color: #a1a1aa; font-family: monospace; letter-spacing: 1.5px; margin-bottom: 6px;">
            One-Time Security Code (Expires in 30 Seconds)
          </div>
          <div style="font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: 8px; font-family: monospace;">
            ${code}
          </div>
        </div>

        <p style="color: #ef4444; font-size: 12px; margin: 0; font-family: monospace;">
          Strict 30-second window. Passwordless authentication. If you did not initiate this from your terminal, no action is needed.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error("Failed to send OTP email:", err);
    return false;
  }
}
