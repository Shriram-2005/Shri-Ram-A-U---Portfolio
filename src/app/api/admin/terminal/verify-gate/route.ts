import { NextRequest, NextResponse } from "next/server";
import { verifyOtp, deleteGmailOtpEmail } from "@/lib/otp-service";
import { createGateToken, GATE_COOKIE_NAME } from "@/lib/admin-auth";
import { checkRateLimit, resetRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimitKey = `gate_otp:${ip}`;

    // Maximum 5 verification attempts per 5 minutes per IP
    const rateCheck = checkRateLimit(rateLimitKey, 5, 5 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Gateway locked: Too many attempts. Please try again in ${rateCheck.retryAfterSeconds}s.`,
        },
        { status: 429, headers: { "Retry-After": rateCheck.retryAfterSeconds.toString() } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { otp } = body;

    if (!otp || typeof otp !== "string" && typeof otp !== "number") {
      return NextResponse.json(
        { success: false, error: "Please provide the 6-digit verification code." },
        { status: 400 }
      );
    }

    const cleanOtp = otp.toString().trim().replace(/\D/g, "");
    if (cleanOtp.length !== 6) {
      return NextResponse.json(
        { success: false, error: "Invalid code format. Must be exactly 6 numeric digits." },
        { status: 400 }
      );
    }

    const verification = verifyOtp("terminal_gate", cleanOtp);
    if (!verification.valid) {
      return NextResponse.json(
        { success: false, error: verification.error || "Invalid or expired gateway code." },
        { status: 401 }
      );
    }

    // Immediately sweep and expunge this OTP email from Gmail
    await deleteGmailOtpEmail(cleanOtp).catch(() => {});

    // Reset rate limit on success
    resetRateLimit(rateLimitKey);

    // Generate signed gateway ticket valid for 15 minutes
    const gateToken = createGateToken();

    const response = NextResponse.json({
      success: true,
      message: "Gateway verified. Access granted to Admin Login Portal.",
    });

    response.cookies.set({
      name: GATE_COOKIE_NAME,
      value: gateToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60, // 15 minutes
    });

    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    response.headers.set("X-Content-Type-Options", "nosniff");
    return response;
  } catch (err) {
    console.error("Terminal gate verification error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error during gateway verification." },
      { status: 500 }
    );
  }
}
