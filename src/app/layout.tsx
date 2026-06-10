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
    "Obrigado por celebrar a inauguracao da nova sede da Nawabus. Em breve podera descarregar as fotos da inauguracao.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Inauguração da Nova Sede | Nawabus",
    description:
      "Obrigado por celebrar este momento historico com a Nawabus. Em breve podera descarregar as fotos da inauguracao.",
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
