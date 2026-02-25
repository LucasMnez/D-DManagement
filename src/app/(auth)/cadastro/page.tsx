export default function CadastroPage() {
  return (
    <main>
      <h1>Criar conta</h1>
      <p>Cadastro inicial do jogador para reservar mesas.</p>
      <form className="card" style={{ maxWidth: 420, display: "grid", gap: 10 }}>
        <input placeholder="Nome" type="text" />
        <input placeholder="E-mail" type="email" />
        <input placeholder="Senha" type="password" />
        <button className="button" type="submit">
          Criar conta
        </button>
      </form>
    </main>
  );
}
