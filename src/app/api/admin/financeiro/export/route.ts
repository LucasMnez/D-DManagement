import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

function escapeCsv(value: string | number | null | undefined) {
  if (value == null) {
    return "";
  }

  const text = String(value).replaceAll('"', '""');
  return `"${text}"`;
}

export async function GET() {
  const session = await requireRole(["ADMIN"]);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const paymentsResult = await getPrisma().payment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      reservation: {
        select: {
          id: true,
          user: { select: { email: true, name: true } },
          campaign: { select: { title: true } }
        }
      }
    }
  });

  const header = [
    "paymentId",
    "reservationId",
    "playerName",
    "playerEmail",
    "campaignTitle",
    "amountInCents",
    "provider",
    "providerChargeId",
    "status",
    "createdAt",
    "paidAt"
  ];

  const payments = paymentsResult as Array<{
    id: string;
    amountInCents: number;
    provider: string;
    providerChargeId: string | null;
    status: string;
    createdAt: Date;
    paidAt: Date | null;
    reservation: {
      id: string;
      user: { name: string; email: string };
      campaign: { title: string };
    };
  }>;

  const rows = payments.map((payment) => [
    payment.id,
    payment.reservation.id,
    payment.reservation.user.name,
    payment.reservation.user.email,
    payment.reservation.campaign.title,
    payment.amountInCents,
    payment.provider,
    payment.providerChargeId,
    payment.status,
    payment.createdAt.toISOString(),
    payment.paidAt?.toISOString() ?? ""
  ]);

  const csvContent = [header, ...rows]
    .map((row) => row.map((cell) => escapeCsv(cell)).join(","))
    .join("\n");

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="financeiro.csv"'
    }
  });
}
