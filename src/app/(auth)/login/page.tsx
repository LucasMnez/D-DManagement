import Link from "next/link";

export default function LoginPage() {
  return (
    <main>
      <h1>Entrar</h1>
      <p>Integre aqui o NextAuth com credenciais, Google e Discord.</p>
      <form className="card" style={{ maxWidth: 420, display: "grid", gap: 10 }}>
        <input placeholder="E-mail" type="email" />
        <input placeholder="Senha" type="password" />
        <button className="button" type="submit">
          Entrar
        </button>
      </form>
      <p>
        Ainda não tem conta? <Link href="/cadastro">Crie agora</Link>
      </p>
    </main>
  );
}
