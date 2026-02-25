import { getServerSession } from "next-auth";
import type { AppRole } from "@/lib/auth";
import { authOptions } from "@/lib/auth";

export async function requireRole(allowedRoles: AppRole[]) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role || !allowedRoles.includes(session.user.role)) {
    return null;
  }

  return session;
}
