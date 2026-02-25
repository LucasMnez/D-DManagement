const reservas = [
  { mesa: "One-Shot: Mina Perdida", status: "Pendente", data: "2026-03-02" },
  { mesa: "Ravenloft", status: "Pago", data: "2026-03-09" }
];

export default function PainelJogadorPage() {
  return (
    <main>
      <h1>Painel do jogador</h1>
      <div className="grid">
        {reservas.map((reserva) => (
          <article className="card" key={`${reserva.mesa}-${reserva.data}`}>
            <h3>{reserva.mesa}</h3>
            <p>Data: {reserva.data}</p>
            <strong>Status: {reserva.status}</strong>
          </article>
        ))}
      </div>
    </main>
  );
}
