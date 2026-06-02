"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const cards = [
  {
    icon: "📅",
    label: "Data",
    value: "9 de Junho de 2026",
    sub: "Terça-feira",
    accent: "from-primary to-primary-ring",
    ring: "ring-primary/25",
    bg: "bg-primary-soft",
  },
  {
    icon: "🕕",
    label: "Horário",
    value: "18h00",
    sub: "A partir das 18 horas",
    accent: "from-primary-ring to-primary",
    ring: "ring-primary/25",
    bg: "bg-primary-muted",
  },
  {
    icon: "📍",
    label: "Localização",
    value: "Rua do BFA, Travessa 26",
    sub: "Bairro Benfica, Município de Talatona · Luanda",
    accent: "from-primary to-primary-ring",
    ring: "ring-primary/25",
    bg: "bg-gradient-to-br from-primary-soft to-primary-muted",
  },
];

export default function EventInfoCards() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3">
            ✦ Detalhes do Evento ✦
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-foreground">
            Marque na Sua <span className="text-primary">Agenda</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-md mx-auto">
            Tudo o que precisa saber para não perder este momento especial.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 45 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`relative rounded-3xl p-7 ring-2 ${card.ring} ${card.bg}
                          hover:shadow-2xl hover:-translate-y-2 hover:ring-4
                          transition-all duration-400 cursor-default group`}
            >
              {/* Icon bubble */}
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl
                            bg-gradient-to-br ${card.accent} text-3xl mb-5
                            shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                {card.icon}
              </div>

              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                {card.label}
              </div>
              <div className="text-xl font-black text-foreground mb-1">{card.value}</div>
              <div className="text-sm text-gray-500 leading-snug">{card.sub}</div>

              {/* Decorative corner */}
              <div className={`absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-br ${card.accent} opacity-60`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
