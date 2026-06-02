import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inauguração da Nova Sede | Nawabus",
  description:
    "Confirme a sua presença na inauguração da nova sede da Nawabus — 8 de Junho de 2026 às 17h00, Segunda Rua à Direita depois do ITA.",
  openGraph: {
    title: "Inauguração da Nova Sede | Nawabus",
    description: "Marque presença neste momento histórico. 8 de Junho de 2026, 17h00.",
    locale: "pt_AO",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className={geist.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
