import { NextRequest, NextResponse } from "next/server";
import { registerOtp, sendOtpEmail, OTP_EXPIRY_SECONDS, OtpPurpose } from "@/lib/otp-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const purpose: OtpPurpose =
      body.purpose === "terminal_gate"
        ? "terminal_gate"
        : body.purpose === "login"
        ? "login"
        : body.purpose === "confirm_change"
        ? "confirm_change"
        : "request_change";

    const { code, expiresAt } = registerOtp(purpose);
    const sent = await sendOtpEmail(code, purpose);

    if (!sent) {
      return NextResponse.json(
        { success: false, error: "Failed to dispatch email. Please check SMTP configuration." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      expiresAt,
      remainingSeconds: OTP_EXPIRY_SECONDS,
      message: `30-second verification OTP sent to admin email.`,
    });
  } catch (err) {
    console.error("Error sending OTP:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
