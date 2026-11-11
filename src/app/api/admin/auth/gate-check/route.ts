import { NextRequest, NextResponse } from "next/server";
import { verifyGateToken, GATE_COOKIE_NAME } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(GATE_COOKIE_NAME)?.value;
  if (!token || !verifyGateToken(token)) {
    return NextResponse.json({ passed: false }, { status: 401 });
  }
  return NextResponse.json({ passed: true });
}

