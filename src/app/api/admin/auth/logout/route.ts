import { NextResponse } from "next/server";
import { COOKIE_NAME, GATE_COOKIE_NAME } from "@/lib/admin-auth";

export async function POST() {
  const res = NextResponse.json({ success: true, message: "Logged out successfully." });
  res.cookies.delete(COOKIE_NAME);
  res.cookies.delete(GATE_COOKIE_NAME);
  return res;
}

