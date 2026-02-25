import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "D&D Management",
  description: "Plataforma para reservas de mesas de D&D com Pix e painel admin"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
