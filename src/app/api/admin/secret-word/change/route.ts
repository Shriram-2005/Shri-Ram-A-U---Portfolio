import { NextRequest, NextResponse } from "next/server";
import { validateSecretKeyword, updateSecretKeyword } from "@/lib/admin-auth";
import { verifyOtp, deleteGmailOtpEmail } from "@/lib/otp-service";
import { checkRateLimit, resetRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimitKey = `change_keyword:${ip}`;

    // Rate-limit change attempts
    const rateCheck = checkRateLimit(rateLimitKey, 5, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Change protocol locked: Too many attempts. Try again in ${rateCheck.retryAfterSeconds}s.`,
        },
        { status: 429, headers: { "Retry-After": rateCheck.retryAfterSeconds.toString() } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { oldPassword, newPassword, confirmPassword, otp } = body;

    if (!oldPassword || !newPassword || !confirmPassword || !otp) {
      return NextResponse.json(
        { success: false, error: "All fields (old password, new password, confirm password, and OTP) are required." },
        { status: 400 }
      );
    }

    if (
      typeof oldPassword !== "string" ||
      typeof newPassword !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid field format." },
        { status: 400 }
      );
    }

    const cleanNew = newPassword.trim();
    const cleanConfirm = confirmPassword.trim();

    if (cleanNew !== cleanConfirm) {
      return NextResponse.json(
        { success: false, error: "New password and confirmation do not match." },
        { status: 400 }
      );
    }

    if (cleanNew.length < 4 || cleanNew.length > 64) {
      return NextResponse.json(
        { success: false, error: "New secret keyword must be between 4 and 64 characters long." },
        { status: 400 }
      );
    }

    // 1. Verify old password against current secret keyword (constant time)
    const isOldValid = await validateSecretKeyword(oldPassword);
    if (!isOldValid) {
      return NextResponse.json(
        { success: false, error: "Current secret keyword is incorrect." },
        { status: 401 }
      );
    }

    // 2. Verify confirmation OTP (exact 30-second window)
    const cleanOtp = otp.toString().trim().replace(/\D/g, "");
    const otpResult = verifyOtp("confirm_change", cleanOtp);
    if (!otpResult.valid) {
      return NextResponse.json(
        { success: false, error: otpResult.error || "Confirmation OTP is invalid or expired." },
        { status: 400 }
      );
    }

    // Immediately sweep and expunge this OTP email from Gmail
    await deleteGmailOtpEmail(cleanOtp).catch(() => {});

    // 3. Commit new secret keyword to Supabase
    const saved = await updateSecretKeyword(cleanNew);
    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Database error updating secret keyword in Supabase." },
        { status: 500 }
      );
    }

    // Reset rate limiter on success
    resetRateLimit(rateLimitKey);

    const response = NextResponse.json({
      success: true,
      message: "Secret keyword successfully updated in Supabase.",
    });
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    response.headers.set("X-Content-Type-Options", "nosniff");
    return response;
  } catch (err) {
    console.error("Error changing secret keyword:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error while changing secret keyword." },
      { status: 500 }
    );
  }
}
