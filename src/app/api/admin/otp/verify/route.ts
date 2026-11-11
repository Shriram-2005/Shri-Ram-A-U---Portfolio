import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { purpose, otp } = body;

    if (!purpose || !otp) {
      return NextResponse.json({ valid: false, error: "Missing OTP or purpose" }, { status: 400 });
    }

    const targetPurpose = purpose === "confirm_change" ? "confirm_change" : "request_change";
    const result = verifyOtp(targetPurpose, otp.toString());

    return NextResponse.json(result);
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return NextResponse.json({ valid: false, error: "Verification failed" }, { status: 500 });
  }
}

