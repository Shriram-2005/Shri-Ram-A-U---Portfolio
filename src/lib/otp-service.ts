import crypto from "crypto";
import tls from "tls";
import nodemailer from "nodemailer";

export type OtpPurpose = "login" | "request_change" | "confirm_change" | "terminal_gate";

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

  // Consume on success and immediately delete from Gmail inbox
  activeOtps.delete(purpose);
  deleteGmailOtpEmail(candidate.trim()).catch(() => {});
  return { valid: true };
}

/**
 * Connect to Gmail IMAP and expunge/delete OTP emails matching code or pattern
 * Sweeps INBOX, Sent Mail, and permanently expunges from [Gmail]/Trash
 */
export async function deleteGmailOtpEmail(codePattern?: string): Promise<{ deleted: number }> {
  const host = "imap.gmail.com";
  const port = 993;
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";

  if (!user || !pass) {
    return { deleted: 0 };
  }

  // Exact search phrase: if 6-digit code is provided search it, otherwise search "Portfolio Terminal"
  const searchPhrase = codePattern && /^\d{6}$/.test(codePattern.trim())
    ? codePattern.trim()
    : "Portfolio Terminal";

  return new Promise((resolve) => {
    let deletedCount = 0;
    let step = 0;
    let buffer = "";

    const socket = tls.connect(port, host, { rejectUnauthorized: false });
    socket.setEncoding("utf-8");

    const timeoutTimer = setTimeout(() => {
      try {
        socket.destroy();
      } catch {}
      resolve({ deleted: deletedCount });
    }, 15000); // 15s max connection window

    const send = (cmd: string) => {
      socket.write(cmd);
    };

    socket.on("data", (data: string) => {
      try {
        buffer += data;

        // Step 0: Initial connection banner -> Login
        if (step === 0 && buffer.includes("* OK")) {
          step = 1;
          buffer = "";
          send(`A01 LOGIN "${user}" "${pass}"\r\n`);
        }
        // Step 1: Login result
        else if (step === 1 && buffer.includes("A01 OK")) {
          step = 2;
          buffer = "";
          send(`A02 SELECT "INBOX"\r\n`);
        } else if (step === 1 && (buffer.includes("A01 NO") || buffer.includes("A01 BAD"))) {
          clearTimeout(timeoutTimer);
          socket.end();
          resolve({ deleted: 0 });
        }
        // Step 2: INBOX selected -> Search OTP in INBOX
        else if (step === 2 && buffer.includes("A02 OK")) {
          step = 3;
          buffer = "";
          send(`A03 UID SEARCH SUBJECT "${searchPhrase}"\r\n`);
        }
        // Step 3: Search INBOX result -> Move to Trash or check Sent Mail
        else if (step === 3 && buffer.includes("A03 OK")) {
          const match = buffer.match(/\* SEARCH ([\d\s]+)/);
          if (match && match[1].trim()) {
            const uids = match[1].trim().split(/\s+/).join(",");
            deletedCount += match[1].trim().split(/\s+/).length;
            step = 4;
            buffer = "";
            send(`A04 UID MOVE ${uids} "[Gmail]/Trash"\r\n`);
          } else {
            step = 5;
            buffer = "";
            send(`A05 SELECT "[Gmail]/Sent Mail"\r\n`);
          }
        }
        // Step 4: Moved to Trash from INBOX -> Select Sent Mail
        else if (step === 4 && (buffer.includes("A04 OK") || buffer.includes("A04 NO"))) {
          step = 5;
          buffer = "";
          send(`A05 SELECT "[Gmail]/Sent Mail"\r\n`);
        }
        // Step 5: Sent Mail selected -> Search OTP in Sent Mail
        else if (step === 5 && buffer.includes("A05 OK")) {
          step = 6;
          buffer = "";
          send(`A06 UID SEARCH SUBJECT "${searchPhrase}"\r\n`);
        }
        // Step 6: Search Sent Mail result -> Move to Trash or select Trash
        else if (step === 6 && buffer.includes("A06 OK")) {
          const match = buffer.match(/\* SEARCH ([\d\s]+)/);
          if (match && match[1].trim()) {
            const uids = match[1].trim().split(/\s+/).join(",");
            deletedCount += match[1].trim().split(/\s+/).length;
            step = 7;
            buffer = "";
            send(`A07 UID MOVE ${uids} "[Gmail]/Trash"\r\n`);
          } else {
            step = 8;
            buffer = "";
            send(`A08 SELECT "[Gmail]/Trash"\r\n`);
          }
        }
        // Step 7: Moved to Trash from Sent Mail -> Select Trash
        else if (step === 7 && (buffer.includes("A07 OK") || buffer.includes("A07 NO"))) {
          step = 8;
          buffer = "";
          send(`A08 SELECT "[Gmail]/Trash"\r\n`);
        }
        // Step 8: Trash selected -> Search OTP in Trash
        else if (step === 8 && buffer.includes("A08 OK")) {
          step = 9;
          buffer = "";
          send(`A09 UID SEARCH SUBJECT "${searchPhrase}"\r\n`);
        }
        // Step 9: Search Trash result -> Permanently erase with \Deleted + EXPUNGE
        else if (step === 9 && buffer.includes("A09 OK")) {
          const match = buffer.match(/\* SEARCH ([\d\s]+)/);
          if (match && match[1].trim()) {
            const uids = match[1].trim().split(/\s+/).join(",");
            step = 10;
            buffer = "";
            send(`A10 UID STORE ${uids} +FLAGS (\\Deleted)\r\n`);
          } else {
            step = 12;
            buffer = "";
            send(`A12 LOGOUT\r\n`);
          }
        }
        // Step 10: Flags Deleted applied in Trash -> Permanently expunge
        else if (step === 10 && buffer.includes("A10 OK")) {
          step = 11;
          buffer = "";
          send(`A11 EXPUNGE\r\n`);
        }
        // Step 11: Permanent expunge complete -> Logout
        else if (step === 11 && buffer.includes("A11 OK")) {
          step = 12;
          buffer = "";
          send(`A12 LOGOUT\r\n`);
        }
        // Step 12: Logout acknowledged
        else if (step === 12 && buffer.includes("A12 OK")) {
          clearTimeout(timeoutTimer);
          socket.end();
          resolve({ deleted: deletedCount });
        }
      } catch {
        clearTimeout(timeoutTimer);
        try {
          socket.end();
        } catch {}
        resolve({ deleted: deletedCount });
      }
    });

    socket.on("error", () => {
      clearTimeout(timeoutTimer);
      resolve({ deleted: deletedCount });
    });

    socket.on("close", () => {
      clearTimeout(timeoutTimer);
      resolve({ deleted: deletedCount });
    });
  });
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

  if (purpose === "terminal_gate") {
    title = "Terminal Gateway Access Code";
    description = "You requested access to the Admin Login Portal from the Developer Terminal. Enter this 6-digit code in your terminal within 30 seconds to unlock the gateway.";
  } else if (purpose === "login") {
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

    // Schedule automated deletion of this OTP email from Gmail after exact 30 seconds
    setTimeout(async () => {
      try {
        await deleteGmailOtpEmail(code);
      } catch (err) {
        console.error("Auto-delete expired OTP email error:", err);
      }
    }, OTP_EXPIRY_SECONDS * 1000);

    return true;
  } catch (err) {
    console.error("Failed to send OTP email:", err);
    return false;
  }
}
