const indicadores = [
  { label: "Receita do mês", valor: "R$ 3.450,00" },
  { label: "Pix pendentes", valor: "7" },
  { label: "Reservas confirmadas", valor: "24" }
];

export default function FinanceiroAdminPage() {
  return (
    <main>
      <h1>Painel financeiro</h1>
      <p>Estrutura inicial para o admin acompanhar entradas, pendências e conciliação.</p>
      <section className="grid">
        {indicadores.map((item) => (
          <article className="card" key={item.label}>
            <p>{item.label}</p>
            <h2>{item.valor}</h2>
          </article>
        ))}
      </section>
    </main>
  );
}
