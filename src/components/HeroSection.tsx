"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-brand-ink">
      {/* Deep gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-ink-raised via-brand-ink to-[#12110e]" />

      {/* Animated glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-orb"
        style={{ background: "radial-gradient(circle, color-mix(in oklch, var(--primary) 30%, transparent) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl animate-orb"
        style={{ background: "radial-gradient(circle, color-mix(in oklch, var(--primary-ring) 22%, transparent) 0%, transparent 70%)", animationDelay: "3s" }}
      />
      <div
        className="absolute top-2/3 left-1/2 w-64 h-64 rounded-full blur-2xl animate-orb"
        style={{ background: "radial-gradient(circle, color-mix(in oklch, var(--primary) 16%, transparent) 0%, transparent 70%)", animationDelay: "6s" }}
      />

      {/* Decorative spinning rings */}
      <div className="absolute top-16 right-16 w-40 h-40 rounded-full border border-primary/20 animate-spinSlow" />
      <div className="absolute top-16 right-16 w-28 h-28 rounded-full border border-primary-ring/15 animate-spinReverse" />
      <div className="absolute bottom-24 left-16 w-24 h-24 rounded-full border border-primary/20 animate-spinSlow" style={{ animationDuration: "18s" }} />

      {/* Floating dots grid */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: "radial-gradient(circle, var(--primary) 1px, transparent 1px)",
        backgroundSize: "48px 48px"
      }} />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">

        {/* Nawabus Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="mb-10"
        >
          <a href="https://nawabus.co.ao" target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center justify-center group">
            <Image
              src="/nawabus_logo_white.webp"
              alt="Nawabus"
              width={120}
              height={60}
              className="h-14 w-auto"
              priority
            />
          </a>
        </motion.div>

        {/* Invitation badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.25, ease: "backOut" }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/15 border border-primary/35 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">Convite Especial</span>
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease }}
          className="text-4xl sm:text-6xl md:text-8xl font-black text-white leading-[1.05] mb-6"
        >
          Inauguração da
          <br />
          <span className="shimmer-text">Nova Sede</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="text-primary-muted/70 text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed"
        >
          Convidamo-lo(a) a celebrar connosco este momento histórico.
          <br className="hidden sm:block" />
          A Nawabus abre as portas da sua nova sede!
        </motion.p>

        {/* Info pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="flex flex-wrap justify-center gap-3 mb-14"
        >
          {[
            { icon: "📅", label: "9 de Junho de 2026", sub: "Terça-feira" },
            { icon: "🕕", label: "18h00",              sub: "Hora de início" },
            { icon: "📍", label: "Rua do BFA, Trav. 26", sub: "Bairro Benfica · Talatona, Luanda" },
          ].map((pill) => (
            <div key={pill.label} className="glass flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl w-full sm:w-auto">
              <span className="text-2xl">{pill.icon}</span>
              <div className="text-left">
                <div className="text-white font-bold text-sm leading-tight">{pill.label}</div>
                <div className="text-primary/70 text-xs">{pill.sub}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <a
            href="#confirmacao"
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg text-primary-foreground
                       bg-gradient-to-r from-primary to-primary-ring
                       shadow-xl shadow-primary/30
                       hover:shadow-primary/50 hover:from-primary-ring hover:to-primary
                       hover:scale-105 active:scale-95
                       transition-all duration-300"
          >
            <span>Ver fotos em breve</span>
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className="text-xl"
            >
              ↓
            </motion.span>
          </a>
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 leading-none">
        <svg viewBox="0 0 1440 90" className="w-full block" preserveAspectRatio="none">
          <path d="M0 90 L0 45 Q360 0 720 45 Q1080 90 1440 45 L1440 90 Z" fill="var(--background)" />
        </svg>
      </div>
    </section>
  );
}
