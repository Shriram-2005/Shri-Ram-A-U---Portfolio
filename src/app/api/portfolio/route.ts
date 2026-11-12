import { NextResponse } from "next/server";
import { fetchFullPortfolio } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchFullPortfolio();
    const res = NextResponse.json({ success: true, data });
    res.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
    return res;
  } catch (err) {
    console.error("Public portfolio API error:", err);
    return NextResponse.json({ success: false, error: "Failed to load portfolio" }, { status: 500 });
  }
}

