import { getServerSession, type Session } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireAdminApi() {
  const session = (await getServerSession(authOptions as any)) as (Session & {
    user?: Session["user"] & { isAdmin?: boolean; role?: string };
  }) | null;
  if (!session?.user?.isAdmin) return null;
  return session;
}
