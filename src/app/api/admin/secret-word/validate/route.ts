import { NextRequest, NextResponse } from "next/server";
import { validateSecretKeyword } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { keyword } = body;

    if (!keyword || typeof keyword !== "string") {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    const isValid = await validateSecretKeyword(keyword);
    return NextResponse.json({ valid: isValid });
  } catch (err) {
    console.error("Error validating secret keyword:", err);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}

