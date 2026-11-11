import { NextResponse } from "next/server";
import { fetchFullPortfolio } from "@/lib/supabase";

export const revalidate = 60; // 60 seconds revalidation

export async function GET() {
  try {
    const data = await fetchFullPortfolio();
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Public portfolio API error:", err);
    return NextResponse.json({ success: false, error: "Failed to load portfolio" }, { status: 500 });
  }
}
