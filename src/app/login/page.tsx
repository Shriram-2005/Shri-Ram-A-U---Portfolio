import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyGateToken, GATE_COOKIE_NAME } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const gateToken = cookieStore.get(GATE_COOKIE_NAME)?.value;

  if (!gateToken || !verifyGateToken(gateToken)) {
    redirect("/");
  }

  redirect("/admin/login");
}

