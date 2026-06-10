"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function ConfirmationSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="confirmacao"
      ref={ref}
      className="relative overflow-hidden bg-background px-6 py-28"
    >
      <div className="pointer-events-none absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary-soft/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary-muted/60 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">
            Obrigado pela presenca
          </p>
          <h2 className="text-3xl font-black text-foreground md:text-5xl">
            Confirmacoes encerradas
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-500">
            A inauguracao foi um momento especial para a Nawabus, e agradecemos a
            todos que estiveram connosco.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-10 max-w-xl rounded-3xl border border-primary/20 bg-white p-8 shadow-2xl shadow-primary-soft/70 sm:p-10"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-ring text-4xl text-primary-foreground shadow-2xl shadow-primary/35">
            +
          </div>
          <h3 className="text-2xl font-black text-foreground">
            Em breve podera descarregar as fotos da inauguracao.
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-gray-500">
            Estamos a preparar os melhores registos deste dia para partilhar com
            todos os nossos convidados.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
