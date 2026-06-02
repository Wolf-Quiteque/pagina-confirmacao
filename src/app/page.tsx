import HeroSection from "@/components/HeroSection";
import EventInfoCards from "@/components/EventInfoCards";
import Countdown from "@/components/Countdown";
import ConfirmationSection from "@/components/ConfirmationSection";
import Image from "next/image";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <HeroSection />
      <EventInfoCards />
      <Countdown />
      <ConfirmationSection />

      {/* Footer */}
      <footer className="relative bg-[#0d0300] py-12 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050100] to-[#1e0800]" />
        <div className="relative z-10 max-w-lg mx-auto">
          <div className="inline-flex items-center justify-center mb-4">
            <Image
              src="/nawabus_logo_white.webp"
              alt="Nawabus"
              width={120}
              height={60}
              className="h-12 w-auto"
            />
          </div>
          <p className="text-amber-200/40 text-sm mb-1">
            Rede Integrada de Transporte de Angola
          </p>
          <a
            href="https://nawabus.co.ao"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400/60 text-xs hover:text-amber-400 transition-colors"
          >
            nawabus.co.ao
          </a>
          <p className="text-gray-700 text-xs mt-6">
            © 2026 Nawabus · Todos os direitos reservados
          </p>
        </div>
      </footer>
    </main>
  );
}
