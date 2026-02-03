import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

type Role = "SUPER_ADMIN" | "ADMIN" | "USER";

function isAdminRole(role?: string | null) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export async function requireAdminApi() {
  const session = await getServerSession(authOptions);

  const role = (session?.user as any)?.role as Role | undefined;
  const isAdmin = !!(session?.user as any)?.isAdmin || isAdminRole(role);

  if (!session || !isAdmin) return null;
  return session;
}
