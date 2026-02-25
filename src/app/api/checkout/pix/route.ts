import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createPixCharge } from "@/lib/pix";

const schema = z.object({
  reservationId: z.string().min(1),
  amountInCents: z.number().int().positive()
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const data = schema.parse(body);

  const charge = await createPixCharge(data.reservationId, data.amountInCents);
  return NextResponse.json(charge, { status: 201 });
}
