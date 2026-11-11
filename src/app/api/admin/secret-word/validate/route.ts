import { NextRequest, NextResponse } from "next/server";
import { validateSecretKeyword } from "@/lib/admin-auth";
import { checkRateLimit, resetRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimitKey = `secret_word:${ip}`;

    // Apply strict brute-force rate limit (max 5 failed attempts per 5 minutes per IP)
    const rateCheck = checkRateLimit(rateLimitKey, 5, 5 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          valid: false,
          error: `Terminal security lockout: Too many failed keyword attempts. Try again in ${rateCheck.retryAfterSeconds}s.`,
        },
        { status: 429, headers: { "Retry-After": rateCheck.retryAfterSeconds.toString() } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { keyword } = body;

    // Strict type, length, and SQL injection prevention
    if (!keyword || typeof keyword !== "string") {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    const trimmed = keyword.trim();
    if (trimmed.length < 3 || trimmed.length > 64) {
      return NextResponse.json({ valid: false });
    }

    const isValid = await validateSecretKeyword(trimmed);

    if (isValid) {
      // Clear failed rate limit attempts on correct authentication
      resetRateLimit(rateLimitKey);
    }

    const response = NextResponse.json({ valid: isValid });
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    response.headers.set("X-Content-Type-Options", "nosniff");
    return response;
  } catch (err) {
    console.error("Error validating secret keyword:", err);
    return NextResponse.json({ valid: false, error: "Validation error" }, { status: 500 });
  }
}
