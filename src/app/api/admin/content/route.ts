import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifySessionToken, COOKIE_NAME } from "@/lib/admin-auth";
import { fetchFullPortfolio, savePortfolioSection, PortfolioBundle } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token || !verifySessionToken(token).valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bundle = await fetchFullPortfolio();
  return NextResponse.json({ success: true, data: bundle });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token || !verifySessionToken(token).valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { section, data } = body as { section?: keyof PortfolioBundle; data?: unknown };

    if (!section || !data) {
      return NextResponse.json({ error: "Section key and data are required." }, { status: 400 });
    }

    const saved = await savePortfolioSection(section, data);
    if (!saved) {
      return NextResponse.json(
        { error: "Failed to save section to Supabase. Make sure database schema is created." },
        { status: 500 }
      );
    }

    // Revalidate paths so changes reflect instantly
    try {
      revalidatePath("/");
      revalidatePath("/projects/[id]");
    } catch (err) {
      console.warn("Revalidation note:", err);
    }

    return NextResponse.json({
      success: true,
      message: `Section '${section}' successfully updated in Supabase and revalidated.`,
    });
  } catch (err) {
    console.error("Save content route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
