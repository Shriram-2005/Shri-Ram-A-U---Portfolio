import { NextResponse } from "next/server";
import { deleteGmailOtpEmail } from "@/lib/otp-service";

export async function POST() {
  try {
    const result = await deleteGmailOtpEmail();
    return NextResponse.json({
      success: true,
      message: `Cleaned up ${result.deleted} OTP email(s) from Gmail inbox.`,
      deleted: result.deleted,
    });
  } catch (err) {
    console.error("Manual OTP email cleanup error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to clean up OTP emails from Gmail." },
      { status: 500 }
    );
  }
}

