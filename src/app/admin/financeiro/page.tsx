import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

export default async function FinanceiroAdminPage() {
  const session = await requireRole(["ADMIN"]);

  if (!session) {
    redirect("/login");
  }

  const [receitaMes, pixPendentes, reservasConfirmadas, logsResult] = await Promise.all([
    getPrisma().payment.aggregate({
      _sum: { amountInCents: true },
      where: {
        status: "PAID",
        paidAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    }),
    getPrisma().payment.count({ where: { status: "PENDING" } }),
    getPrisma().reservation.count({ where: { status: "CONFIRMED" } }),
    getPrisma().financialLog.findMany({
      take: 20,
      orderBy: { createdAt: "desc" }
    })
  ]);

  const logs = logsResult as Array<{ id: string; createdAt: Date; event: string }>

  return (
    <main>
      <h1>Painel financeiro</h1>
      <p>Resumo financeiro e logs de eventos Pix para auditoria.</p>
      <p>
        <a className="button" href="/api/admin/financeiro/export">
          Exportar CSV financeiro
        </a>
      </p>

      <section className="grid">
        <article className="card">
          <p>Receita do mês</p>
          <h2>R$ {((receitaMes._sum.amountInCents ?? 0) / 100).toFixed(2)}</h2>
        </article>
        <article className="card">
          <p>Pix pendentes</p>
          <h2>{pixPendentes}</h2>
        </article>
        <article className="card">
          <p>Reservas confirmadas</p>
          <h2>{reservasConfirmadas}</h2>
        </article>
      </section>

      <section className="card" style={{ marginTop: 18 }}>
        <h3>Últimos logs financeiros</h3>
        <ul>
          {logs.map((log) => (
            <li key={log.id}>
              {new Date(log.createdAt).toLocaleString("pt-BR")} - <strong>{log.event}</strong>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
