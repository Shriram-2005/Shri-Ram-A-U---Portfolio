import { NextRequest, NextResponse } from "next/server";
import { deleteGmailOtpEmail } from "@/lib/otp-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const code = body.code ? String(body.code) : undefined;
    const result = await deleteGmailOtpEmail(code);
    return NextResponse.json({
      success: true,
      message: `Cleaned up ${result.deleted} OTP email(s) from Gmail.`,
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code") || undefined;
    const result = await deleteGmailOtpEmail(code);
    return NextResponse.json({
      success: true,
      message: `Cleaned up ${result.deleted} OTP email(s) from Gmail.`,
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

