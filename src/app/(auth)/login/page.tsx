"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const response = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    setLoading(false);

    if (response?.error) {
      setError("Credenciais inválidas");
      return;
    }

    router.push("/painel");
  }

  return (
    <main>
      <h1>Entrar</h1>
      <p>Acesse sua conta para reservar e pagar suas mesas.</p>
      <form
        className="card"
        style={{ maxWidth: 420, display: "grid", gap: 10 }}
        action={async (formData) => {
          await onSubmit(formData);
        }}
      >
        <input name="email" placeholder="E-mail" type="email" required />
        <input name="password" placeholder="Senha" type="password" required />
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
      {error ? <p>{error}</p> : null}
      <p>
        Ainda não tem conta? <Link href="/cadastro">Crie agora</Link>
      </p>
    </main>
  );
}
