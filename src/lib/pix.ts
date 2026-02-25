import { createHmac, timingSafeEqual } from "crypto";
import { getPrisma } from "@/lib/prisma";

export type PixCharge = {
  reservationId: string;
  amountInCents: number;
  qrCodeBase64: string;
  copyPasteCode: string;
  expiresAt: string;
  providerChargeId?: string;
  provider: string;
};

type MercadoPagoPixResponse = {
  id: number;
  date_of_expiration: string;
  point_of_interaction?: {
    transaction_data?: {
      qr_code_base64?: string;
      qr_code?: string;
    };
  };
};

function getProvider() {
  return (process.env.PIX_PROVIDER ?? "mock").toLowerCase();
}

async function createMercadoPagoCharge(reservationId: string, amountInCents: number): Promise<PixCharge> {
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!token) {
    throw new Error("MERCADO_PAGO_ACCESS_TOKEN não configurado");
  }

  const amount = Number((amountInCents / 100).toFixed(2));
  const response = await fetch("https://api.mercadopago.com/v1/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Idempotency-Key": `reservation-${reservationId}-${amountInCents}`
    },
    body: JSON.stringify({
      transaction_amount: amount,
      description: `Reserva D&D ${reservationId}`,
      payment_method_id: "pix",
      payer: {
        email: process.env.PIX_PAYER_EMAIL ?? "comprador@example.com"
      },
      external_reference: reservationId
    })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Erro ao criar pagamento Pix no Mercado Pago: ${details}`);
  }

  const mpPayment = (await response.json()) as MercadoPagoPixResponse;

  return {
    reservationId,
    amountInCents,
    qrCodeBase64: mpPayment.point_of_interaction?.transaction_data?.qr_code_base64 ?? "",
    copyPasteCode: mpPayment.point_of_interaction?.transaction_data?.qr_code ?? "",
    expiresAt: mpPayment.date_of_expiration,
    providerChargeId: String(mpPayment.id),
    provider: "mercado_pago"
  };
}

function createMockCharge(reservationId: string, amountInCents: number): PixCharge {
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  return {
    reservationId,
    amountInCents,
    qrCodeBase64: "iVBORw0KGgoAAAANSUhEUgAAAAUA",
    copyPasteCode: `PIX-${reservationId}-${amountInCents}`,
    expiresAt,
    providerChargeId: `mock-${reservationId}`,
    provider: "mock"
  };
}

export async function createPixCharge(reservationId: string, amountInCents: number): Promise<PixCharge> {
  const provider = getProvider();
  const charge = provider === "mercadopago"
    ? await createMercadoPagoCharge(reservationId, amountInCents)
    : createMockCharge(reservationId, amountInCents);

  await getPrisma().payment.upsert({
    where: { reservationId },
    create: {
      reservationId,
      amountInCents,
      provider: charge.provider,
      providerChargeId: charge.providerChargeId,
      pixCopyPaste: charge.copyPasteCode,
      qrCodeBase64: charge.qrCodeBase64,
      status: "PENDING"
    },
    update: {
      amountInCents,
      provider: charge.provider,
      providerChargeId: charge.providerChargeId,
      pixCopyPaste: charge.copyPasteCode,
      qrCodeBase64: charge.qrCodeBase64,
      status: "PENDING"
    }
  });

  await getPrisma().financialLog.create({
    data: {
      event: "PIX_CHARGE_CREATED",
      amountInCents,
      metadata: {
        reservationId,
        provider: charge.provider,
        providerChargeId: charge.providerChargeId
      }
    }
  });

  return charge;
}

export function verifyPixWebhookSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.PIX_WEBHOOK_SECRET;

  if (!secret) {
    return false;
  }

  if (!signature) {
    return false;
  }

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const provided = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (provided.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(provided, expectedBuffer);
}

export async function handlePixWebhook(payload: Record<string, unknown>) {
  const providerChargeId = String(payload.id ?? "");
  const reservationId = String(payload.external_reference ?? "");
  const status = String(payload.status ?? "pending").toLowerCase();

  const resolvedPaymentStatus = status === "approved" || status === "paid" ? "PAID" : "PENDING";

  if (reservationId) {
    await getPrisma().reservation.updateMany({
      where: { id: reservationId },
      data: {
        status: resolvedPaymentStatus === "PAID" ? "PAID" : "PENDING"
      }
    });
  }

  const payment = await getPrisma().payment.updateMany({
    where: { providerChargeId },
    data: {
      status: resolvedPaymentStatus,
      paidAt: resolvedPaymentStatus === "PAID" ? new Date() : null
    }
  });

  await getPrisma().financialLog.create({
    data: {
      event: "PIX_WEBHOOK_RECEIVED",
      metadata: {
        providerChargeId,
        status,
        reservationId,
        updatedPayments: payment.count
      }
    }
  });

  return {
    processedAt: new Date().toISOString(),
    providerEventId: providerChargeId || "unknown"
  };
}
