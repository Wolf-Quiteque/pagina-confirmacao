"use client";
import { motion } from "framer-motion";

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0d0300]">
      {/* Deep gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e0800] via-[#0d0300] to-[#050100]" />

      {/* Animated glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-orb"
        style={{ background: "radial-gradient(circle, rgba(234,88,12,0.25) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl animate-orb"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%)", animationDelay: "3s" }}
      />
      <div
        className="absolute top-2/3 left-1/2 w-64 h-64 rounded-full blur-2xl animate-orb"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)", animationDelay: "6s" }}
      />

      {/* Decorative spinning rings */}
      <div className="absolute top-16 right-16 w-40 h-40 rounded-full border border-amber-500/15 animate-spinSlow" />
      <div className="absolute top-16 right-16 w-28 h-28 rounded-full border border-orange-400/10 animate-spinReverse" />
      <div className="absolute bottom-24 left-16 w-24 h-24 rounded-full border border-amber-400/15 animate-spinSlow" style={{ animationDuration: "18s" }} />

      {/* Floating dots grid */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: "radial-gradient(circle, #f97316 1px, transparent 1px)",
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
             className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-orange-500/30">
              🚌
            </div>
            <span className="text-2xl font-black tracking-widest">
              <span className="text-amber-400 group-hover:text-amber-300 transition-colors">NAWA</span>
              <span className="text-white group-hover:text-gray-200 transition-colors">BUS</span>
            </span>
          </a>
        </motion.div>

        {/* Invitation badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.25, ease: "backOut" }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/15 border border-amber-500/35 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-amber-300 text-sm font-semibold tracking-widest uppercase">Convite Especial</span>
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease }}
          className="text-5xl sm:text-6xl md:text-8xl font-black text-white leading-[1.05] mb-6"
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
          className="text-amber-100/60 text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed"
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
            { icon: "📅", label: "8 de Junho de 2026", sub: "Segunda-feira" },
            { icon: "🕔", label: "17h00",              sub: "Hora de início" },
            { icon: "📍", label: "Nova Sede",          sub: "2ª Rua dpôs do ITA" },
          ].map((pill) => (
            <div key={pill.label} className="glass flex items-center gap-3 px-5 py-3.5 rounded-2xl">
              <span className="text-2xl">{pill.icon}</span>
              <div className="text-left">
                <div className="text-white font-bold text-sm leading-tight">{pill.label}</div>
                <div className="text-amber-300/60 text-xs">{pill.sub}</div>
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
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg text-white
                       bg-gradient-to-r from-amber-500 to-orange-500
                       shadow-xl shadow-orange-600/30
                       hover:shadow-orange-500/50 hover:from-amber-400 hover:to-orange-400
                       hover:scale-105 active:scale-95
                       transition-all duration-300"
          >
            <span>Confirmar Presença</span>
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
          <path d="M0 90 L0 45 Q360 0 720 45 Q1080 90 1440 45 L1440 90 Z" fill="#fffbf4" />
        </svg>
      </div>
    </section>
  );
}
