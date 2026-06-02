"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const EVENT = new Date("2026-06-09T18:00:00");

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function calc() {
  const diff = EVENT.getTime() - Date.now();
  if (diff <= 0) return { dias: 0, horas: 0, minutos: 0, segundos: 0, over: true };
  return {
    dias:     Math.floor(diff / 86_400_000),
    horas:    Math.floor((diff % 86_400_000) / 3_600_000),
    minutos:  Math.floor((diff % 3_600_000) / 60_000),
    segundos: Math.floor((diff % 60_000) / 1_000),
    over: false,
  };
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {/* Glow pulse behind the card */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary to-primary-ring blur-md opacity-40 animate-pulseRing" />
        <motion.div
          key={value}
          initial={{ scale: 1.25, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-2xl sm:rounded-3xl
                     bg-gradient-to-br from-primary to-primary-ring
                     flex items-center justify-center
                     shadow-xl shadow-primary/30"
        >
          <span className="text-2xl sm:text-4xl md:text-5xl font-black text-primary-foreground tabular-nums">
            {pad(value)}
          </span>
        </motion.div>
      </div>
      <span className="text-primary-muted/70 text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

const SEP = (
  <span className="hidden xs:flex self-start mt-7 sm:mt-10 md:mt-14 text-2xl sm:text-3xl md:text-4xl font-black text-primary/60 select-none">
    :
  </span>
);

export default function Countdown() {
  const [time, setTime] = useState(calc);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section ref={ref} className="relative py-28 px-6 overflow-hidden">
      {/* Dark background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-ink-raised via-brand-ink to-[#12110e]" />
      {/* Soft top glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-56 rounded-full
                      bg-primary/10 blur-3xl pointer-events-none" />
      {/* Grid dots */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "radial-gradient(circle, var(--primary) 1px, transparent 1px)",
        backgroundSize: "42px 42px",
      }} />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-primary/80 text-xs font-bold uppercase tracking-widest mb-4">
            ✦ Contagem Decrescente ✦
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-16 leading-tight">
            Faltam para o{" "}
            <span className="shimmer-text">Grande Dia</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4 md:gap-6"
        >
          {time.over ? (
            <p className="text-white text-2xl font-bold">🎉 O evento está a decorrer agora!</p>
          ) : (
            <>
              <Unit value={time.dias}     label="Dias"     />
              {SEP}
              <Unit value={time.horas}    label="Horas"    />
              {SEP}
              <Unit value={time.minutos}  label="Minutos"  />
              {SEP}
              <Unit value={time.segundos} label="Segundos" />
            </>
          )}
        </motion.div>

        {/* Event reminder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-14 inline-flex flex-col sm:flex-row items-center gap-3 glass px-6 py-4 rounded-2xl text-center sm:text-left max-w-sm sm:max-w-none mx-auto"
        >
          <span className="text-xl shrink-0">🗓️</span>
          <span className="text-primary-muted/70 text-sm leading-relaxed">
            <strong className="text-primary">9 de Junho</strong> às <strong className="text-primary">18h00</strong>
            {" "}— Rua do BFA, Travessa 26, Bairro Benfica, Talatona · Luanda
          </span>
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 leading-none">
        <svg viewBox="0 0 1440 70" className="w-full block" preserveAspectRatio="none">
          <path d="M0 70 L0 35 Q360 0 720 35 Q1080 70 1440 35 L1440 70 Z" fill="var(--background)" />
        </svg>
      </div>
    </section>
  );
}
