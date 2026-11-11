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
 * Validate candidate secret keyword using constant-time timingSafeEqual comparison
 */
export async function validateSecretKeyword(candidate: string): Promise<boolean> {
  if (!candidate || typeof candidate !== "string") return false;
  // Sanitize: strip control characters, null bytes, enforce bounds
  const sanitized = candidate.replace(/[\x00-\x1F\x7F]/g, "").trim();
  if (sanitized.length < 3 || sanitized.length > 64) return false;

  const active = await getActiveSecretKeyword();
  const cleanActive = (active || DEFAULT_SECRET_KEYWORD).trim();

  // Timing-safe constant time comparison to eliminate side-channel attacks
  const hashA = crypto.createHash("sha256").update(cleanActive).digest();
  const hashB = crypto.createHash("sha256").update(sanitized).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

/**
 * Update the secret keyword in Supabase with strict validation
 */
export async function updateSecretKeyword(newKeyword: string): Promise<boolean> {
  if (!newKeyword || typeof newKeyword !== "string") return false;
  const sanitized = newKeyword.replace(/[\x00-\x1F\x7F]/g, "").trim();
  if (sanitized.length < 4 || sanitized.length > 64) return false;
  return await setPortfolioSetting("secret_keyword", sanitized);
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

export const GATE_COOKIE_NAME = "portfolio_terminal_gate";

/**
 * Create a signed gate token valid for 15 minutes after terminal verification
 */
export function createGateToken(): string {
  const payload = JSON.stringify({
    gate: "passed",
    created: Date.now(),
    expires: Date.now() + 15 * 60 * 1000, // 15-minute validity to reach and complete login
  });
  const encoded = Buffer.from(payload).toString("base64url");
  const signature = crypto.createHmac("sha256", SESSION_SECRET).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

/**
 * Verify gate token
 */
export function verifyGateToken(token: string): boolean {
  if (!token || !token.includes(".")) return false;
  const [encoded, signature] = token.split(".");
  const expectedSig = crypto.createHmac("sha256", SESSION_SECRET).update(encoded).digest("base64url");

  if (signature !== expectedSig) {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf-8"));
    if (Date.now() > payload.expires) {
      return false;
    }
    return payload.gate === "passed";
  } catch {
    return false;
  }
}

