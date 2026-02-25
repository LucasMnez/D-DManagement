export type PixCharge = {
  reservationId: string;
  amountInCents: number;
  qrCodeBase64: string;
  copyPasteCode: string;
  expiresAt: string;
};

export async function createPixCharge(reservationId: string, amountInCents: number): Promise<PixCharge> {
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  // TODO: substituir por integração real com Mercado Pago / Asaas / Pagar.me
  return {
    reservationId,
    amountInCents,
    qrCodeBase64: "iVBORw0KGgoAAAANSUhEUgAAAAUA",
    copyPasteCode: `PIX-${reservationId}-${amountInCents}`,
    expiresAt
  };
}

export async function handlePixWebhook(payload: Record<string, unknown>) {
  // TODO: validar assinatura do gateway e atualizar pagamento/reserva no banco
  return {
    processedAt: new Date().toISOString(),
    providerEventId: String(payload.id ?? "unknown")
  };
}
