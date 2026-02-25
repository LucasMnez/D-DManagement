import { NextRequest, NextResponse } from "next/server";
import { handlePixWebhook } from "@/lib/pix";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const result = await handlePixWebhook(payload);

  return NextResponse.json({ ok: true, result });
}
