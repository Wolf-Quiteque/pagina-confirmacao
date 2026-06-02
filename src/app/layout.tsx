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
    "Confirme a sua presença na inauguração da nova sede da Nawabus — 9 de Junho de 2026 às 18h00, Rua do BFA, Travessa 26, Bairro Benfica, Talatona — Luanda.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Inauguração da Nova Sede | Nawabus",
    description: "Marque presença neste momento histórico. 9 de Junho de 2026, 18h00.",
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
