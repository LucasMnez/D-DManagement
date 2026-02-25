import Link from "next/link";

const campanhas = [
  { nome: "One-Shot: Mina Perdida", preco: "R$ 50 por jogador", vagas: 5 },
  { nome: "Campanha Semanal: Ravenloft", preco: "R$ 180/mês", vagas: 6 },
  { nome: "Mesa VIP Personalizada", preco: "A partir de R$ 300", vagas: 4 }
];

export default function HomePage() {
  return (
    <main>
      <h1>D&D Management</h1>
      <p>
        Esqueleto inicial para venda de mesas de RPG com login, checkout Pix, painel do jogador e área
        administrativa financeira.
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <Link className="button" href="/painel">
          Área do jogador
        </Link>
        <Link className="button" href="/admin/financeiro">
          Painel admin
        </Link>
        <Link className="button" href="/login">
          Login
        </Link>
      </div>

      <section className="grid">
        {campanhas.map((campanha) => (
          <article className="card" key={campanha.nome}>
            <h3>{campanha.nome}</h3>
            <p>{campanha.preco}</p>
            <small>{campanha.vagas} vagas disponíveis</small>
          </article>
        ))}
      </section>
    </main>
  );
}
