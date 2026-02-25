"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CadastroPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setMessage("");

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? "")
    };

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setMessage(data.error ?? "Não foi possível concluir cadastro");
      setLoading(false);
      return;
    }

    setMessage("Cadastro realizado! Redirecionando para login...");
    setLoading(false);

    setTimeout(() => {
      router.push("/login");
    }, 1200);
  }

  return (
    <main>
      <h1>Criar conta</h1>
      <p>Cadastro inicial do jogador para reservar mesas.</p>
      <form
        className="card"
        style={{ maxWidth: 420, display: "grid", gap: 10 }}
        action={async (formData) => {
          await onSubmit(formData);
        }}
      >
        <input name="name" placeholder="Nome" type="text" required />
        <input name="email" placeholder="E-mail" type="email" required />
        <input name="password" placeholder="Senha (mín. 8 caracteres)" type="password" minLength={8} required />
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Criando..." : "Criar conta"}
        </button>
      </form>
      {message ? <p>{message}</p> : null}
    </main>
  );
}
