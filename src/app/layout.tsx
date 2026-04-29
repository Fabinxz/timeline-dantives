import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Timeline — Evolução Histórica da Computação",
  description:
    "Linha do tempo interativa da evolução histórica da computação — Dantives System v2.0 — ICMC USP São Carlos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
