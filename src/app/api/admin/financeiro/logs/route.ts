import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

export async function GET() {
  const session = await requireRole(["ADMIN"]);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const logs = await getPrisma().financialLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      payment: {
        select: {
          id: true,
          provider: true,
          status: true,
          amountInCents: true
        }
      }
    }
  });

  return NextResponse.json({ logs });
}
