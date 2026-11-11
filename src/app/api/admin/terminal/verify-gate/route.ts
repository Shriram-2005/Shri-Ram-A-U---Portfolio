import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp-service";
import { createGateToken, GATE_COOKIE_NAME } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { otp } = body;

    if (!otp) {
      return NextResponse.json(
        { success: false, error: "Please provide the 6-digit verification code." },
        { status: 400 }
      );
    }

    const verification = verifyOtp("terminal_gate", otp.toString());
    if (!verification.valid) {
      return NextResponse.json(
        { success: false, error: verification.error || "Invalid or expired gateway code." },
        { status: 401 }
      );
    }

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

    return response;
  } catch (err) {
    console.error("Terminal gate verification error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error during gateway verification." },
      { status: 500 }
    );
  }
}

