import crypto from "crypto";
import { getPortfolioSetting, setPortfolioSetting } from "@/lib/supabase";

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "shriram_secure_admin_session_secret_2026_key";
const DEFAULT_EMAIL = (process.env.ADMIN_DEFAULT_EMAIL || "shriram2005au@gmail.com").toLowerCase().trim();
const DEFAULT_PASSWORD = process.env.ADMIN_DEFAULT_PASSWORD || "Admin@Shriram2026!";
const DEFAULT_SECRET_KEYWORD = process.env.ADMIN_SECRET_KEYWORD || "aus-master";

export const COOKIE_NAME = "portfolio_admin_session";

/**
 * Hash a password using PBKDF2 with salt
 */
export function hashPassword(password: string, salt = "shriram_salt_v1"): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
}

/**
 * Get the current secret keyword for the developer terminal
 */
export async function getActiveSecretKeyword(): Promise<string> {
  try {
    const fromDb = await getPortfolioSetting("secret_keyword");
    if (fromDb && fromDb.trim()) {
      return fromDb.trim();
    }
  } catch (err) {
    console.warn("Could not read secret_keyword from DB, using fallback:", err);
  }
  return DEFAULT_SECRET_KEYWORD;
}

/**
 * Validate candidate secret keyword
 */
export async function validateSecretKeyword(candidate: string): Promise<boolean> {
  if (!candidate) return false;
  const active = await getActiveSecretKeyword();
  return active.trim() === candidate.trim();
}

/**
 * Update the secret keyword in Supabase
 */
export async function updateSecretKeyword(newKeyword: string): Promise<boolean> {
  if (!newKeyword || newKeyword.trim().length < 4) return false;
  return await setPortfolioSetting("secret_keyword", newKeyword.trim());
}

/**
 * Validate admin login credentials
 */
export async function validateAdminCredentials(email: string, password: string): Promise<boolean> {
  const cleanEmail = email.toLowerCase().trim();
  const cleanPass = password.trim();

  // 1. Check custom DB settings if set
  try {
    const dbEmail = await getPortfolioSetting("admin_email");
    const dbPassHash = await getPortfolioSetting("admin_password_hash");

    if (dbEmail && dbPassHash) {
      if (cleanEmail === dbEmail.toLowerCase().trim()) {
        const candidateHash = hashPassword(cleanPass);
        if (candidateHash === dbPassHash) return true;
      }
    }
  } catch (err) {
    console.warn("Error reading DB admin credentials:", err);
  }

  // 2. Fallback to environment variables
  if (cleanEmail === DEFAULT_EMAIL && cleanPass === DEFAULT_PASSWORD) {
    return true;
  }

  return false;
}

/**
 * Create a signed session token
 */
export function createSessionToken(email: string): string {
  const payload = JSON.stringify({
    email,
    created: Date.now(),
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  const encoded = Buffer.from(payload).toString("base64url");
  const signature = crypto.createHmac("sha256", SESSION_SECRET).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

/**
 * Verify a session token
 */
export function verifySessionToken(token: string): { valid: boolean; email?: string } {
  if (!token || !token.includes(".")) return { valid: false };
  const [encoded, signature] = token.split(".");
  const expectedSig = crypto.createHmac("sha256", SESSION_SECRET).update(encoded).digest("base64url");

  if (signature !== expectedSig) {
    return { valid: false };
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf-8"));
    if (Date.now() > payload.expires) {
      return { valid: false };
    }
    return { valid: true, email: payload.email };
  } catch {
    return { valid: false };
  }
}
