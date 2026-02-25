import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createPixCharge } from "@/lib/pix";
import { getPrisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

const schema = z.object({
  reservationId: z.string().min(1),
  amountInCents: z.number().int().positive()
});

export async function POST(request: NextRequest) {
  const session = await requireRole(["PLAYER", "ADMIN"]);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const data = schema.parse(body);

  const reservation = await getPrisma().reservation.findUnique({
    where: { id: data.reservationId },
    select: { id: true, userId: true }
  });

  if (!reservation) {
    return NextResponse.json({ error: "Reserva não encontrada" }, { status: 404 });
  }

  const isOwner = reservation.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Sem permissão para esta reserva" }, { status: 403 });
  }

  const charge = await createPixCharge(data.reservationId, data.amountInCents);
  return NextResponse.json(charge, { status: 201 });
}
