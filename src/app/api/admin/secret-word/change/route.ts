import { NextRequest, NextResponse } from "next/server";
import { validateSecretKeyword, updateSecretKeyword } from "@/lib/admin-auth";
import { verifyOtp } from "@/lib/otp-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { oldPassword, newPassword, confirmPassword, otp } = body;

    if (!oldPassword || !newPassword || !confirmPassword || !otp) {
      return NextResponse.json(
        { success: false, error: "All fields (old password, new password, confirm password, and OTP) are required." },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: "New password and confirmation do not match." },
        { status: 400 }
      );
    }

    if (newPassword.trim().length < 4) {
      return NextResponse.json(
        { success: false, error: "New secret keyword must be at least 4 characters long." },
        { status: 400 }
      );
    }

    // 1. Verify old password against current secret keyword
    const isOldValid = await validateSecretKeyword(oldPassword);
    if (!isOldValid) {
      return NextResponse.json(
        { success: false, error: "Current secret keyword is incorrect." },
        { status: 401 }
      );
    }

    // 2. Verify confirmation OTP (exact 30-second window)
    const otpResult = verifyOtp("confirm_change", otp.toString());
    if (!otpResult.valid) {
      return NextResponse.json(
        { success: false, error: otpResult.error || "Confirmation OTP is invalid or expired." },
        { status: 400 }
      );
    }

    // 3. Commit new secret keyword to Supabase
    const saved = await updateSecretKeyword(newPassword.trim());
    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Failed to persist new secret keyword to Supabase. Check database connection." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Secret keyword successfully updated and committed to Supabase.",
    });
  } catch (err) {
    console.error("Error changing secret keyword:", err);
    return NextResponse.json({ success: false, error: "Failed to update secret keyword" }, { status: 500 });
  }
}

