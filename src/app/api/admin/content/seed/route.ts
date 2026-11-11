import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifySessionToken, COOKIE_NAME } from "@/lib/admin-auth";
import { seedDefaultsToSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token || !verifySessionToken(token).valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const success = await seedDefaultsToSupabase();
  if (!success) {
    return NextResponse.json(
      { error: "Failed to seed content to Supabase. Check if tables exist." },
      { status: 500 }
    );
  }

  try {
    revalidatePath("/");
    revalidatePath("/projects/[id]");
  } catch {}

  return NextResponse.json({
    success: true,
    message: "Codebase defaults seeded into Supabase successfully.",
  });
}
