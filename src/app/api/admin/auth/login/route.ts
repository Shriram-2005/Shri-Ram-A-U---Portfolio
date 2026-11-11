import { NextRequest, NextResponse } from "next/server";
import { validateAdminCredentials, createSessionToken, COOKIE_NAME } from "@/lib/admin-auth";
import { verifyOtp } from "@/lib/otp-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { otp, email, password } = body;

    let adminEmail = "shriram2005au@gmail.com";

    // 1. Passwordless 30-second OTP login (preferred flow - no username or password needed)
    if (otp) {
      const otpResult = verifyOtp("login", otp.toString());
      if (!otpResult.valid) {
        return NextResponse.json(
          { success: false, error: otpResult.error || "Login code is invalid or expired." },
          { status: 401 }
        );
      }
    } else if (email && password) {
      // 2. Fallback email + password login
      const isValid = await validateAdminCredentials(email, password);
      if (!isValid) {
        return NextResponse.json({ success: false, error: "Invalid credentials." }, { status: 401 });
      }
      adminEmail = email.toLowerCase().trim();
    } else {
      return NextResponse.json({ success: false, error: "6-digit verification code is required." }, { status: 400 });
    }

    const token = createSessionToken(adminEmail);
    const res = NextResponse.json({ success: true, message: "Authentication successful." });

    res.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("Login route error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
