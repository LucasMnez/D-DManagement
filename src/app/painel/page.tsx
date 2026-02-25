import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

export default async function PainelJogadorPage() {
  const session = await requireRole(["PLAYER", "ADMIN"]);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const reservasResult = await getPrisma().reservation.findMany({
    where: session.user.role === "ADMIN" ? undefined : { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      campaign: {
        select: {
          title: true,
          startsAt: true
        }
      },
      payment: {
        select: {
          status: true,
          amountInCents: true
        }
      }
    }
  });

  const reservas = reservasResult as Array<{
    id: string;
    status: string;
    campaign: { title: string; startsAt: Date };
    payment: { status: string; amountInCents: number } | null;
  }>;

  return (
    <main>
      <h1>Painel do jogador</h1>
      <p>Bem-vindo, {session.user.name}. Aqui estão suas reservas e pagamentos.</p>
      <div className="grid">
        {reservas.map((reserva) => (
          <article className="card" key={reserva.id}>
            <h3>{reserva.campaign.title}</h3>
            <p>Data: {new Date(reserva.campaign.startsAt).toLocaleString("pt-BR")}</p>
            <p>Status reserva: {reserva.status}</p>
            <p>Status pagamento: {reserva.payment?.status ?? "SEM_PAGAMENTO"}</p>
            <strong>Valor: R$ {((reserva.payment?.amountInCents ?? 0) / 100).toFixed(2)}</strong>
          </article>
        ))}
      </div>
    </main>
  );
}
