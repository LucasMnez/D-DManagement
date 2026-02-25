import { NextRequest, NextResponse } from "next/server";
import { handlePixWebhook, verifyPixWebhookSignature } from "@/lib/pix";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-pix-signature");

  const valid = verifyPixWebhookSignature(rawBody, signature);
  if (!valid) {
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as Record<string, unknown>;
  const result = await handlePixWebhook(payload);

  return NextResponse.json({ ok: true, result });
}
