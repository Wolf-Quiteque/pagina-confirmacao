"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";

interface Confirmacao {
  id: string;
  nome: string;
  telefone: string;
  confirmado_em: string;
  sms_status?: string;
}

function formatTelefone(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 9);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
}

export default function ConfirmationSection() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [confirmed, setConfirmed] = useState<Confirmacao | null>(null);
  const [error, setError] = useState("");

  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!nome.trim()) { setError("Por favor, insira o seu nome completo."); return; }
    if (telefone.replace(/\D/g, "").length < 9) {
      setError("Por favor, insira um número válido (9 dígitos).");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nome.trim(), telefone }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error ?? "Ocorreu um erro. Tente novamente.");
      } else {
        setConfirmed(d.confirmacao);
        setSuccess(true);
      }
    } catch {
      setError("Erro de conexão. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="confirmacao"
      ref={ref}
      className="py-28 px-6 bg-background relative overflow-hidden"
    >
      {/* Soft background shapes */}
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full
                      bg-primary-soft/70 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full
                      bg-primary-muted/60 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3">
            🎟️ Confirmação de Presença
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-foreground">
            Confirme a Sua{" "}
            <span className="text-primary">Presença</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-md mx-auto">
            Preencha os seus dados para garantir o seu lugar neste momento histórico.
          </p>
        </motion.div>

        {/* Single centered column layout */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="w-full max-w-md"
          >
            <AnimatePresence mode="wait">
              {!success ? (
                <motion.div
                  key="form"
                  exit={{ opacity: 0, scale: 0.92, y: -10 }}
                  className="bg-white rounded-3xl shadow-2xl shadow-primary-soft/70
                             border border-primary/20 p-6 sm:p-8 md:p-10"
                >
                  <h3 className="text-xl font-black text-foreground mb-7">
                    Preencha os seus dados
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Nome */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-500 mb-2">
                        Nome Completo <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Ex: Ana Rodrigues"
                        disabled={loading}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 text-foreground
                                   placeholder:text-gray-300 text-base
                                   focus:border-primary-ring focus:ring-4 focus:ring-primary/20
                                   disabled:opacity-50 outline-none transition-all duration-200"
                      />
                    </div>

                    {/* Telefone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-500 mb-2">
                        Número de Telefone <span className="text-primary">*</span>
                      </label>
                      <div className="flex gap-2">
                        <div className="flex items-center px-4 py-4 rounded-2xl
                                        bg-primary-soft border-2 border-primary/20
                                        text-primary-foreground font-semibold text-sm whitespace-nowrap shrink-0">
                          🇦🇴 +244
                        </div>
                        <input
                          type="tel"
                          value={telefone}
                          onChange={(e) => setTelefone(formatTelefone(e.target.value))}
                          placeholder="9XX XXX XXX"
                          disabled={loading}
                          className="flex-1 px-5 py-4 rounded-2xl border-2 border-gray-100 text-foreground
                                     placeholder:text-gray-300 text-base
                                     focus:border-primary-ring focus:ring-4 focus:ring-primary/20
                                     disabled:opacity-50 outline-none transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="flex items-start gap-3 px-4 py-3 rounded-2xl
                                     bg-red-50 border border-red-200 text-red-600 text-sm"
                        >
                          <span className="mt-0.5">⚠️</span>
                          <span>{error}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-5 rounded-2xl font-bold text-lg text-primary-foreground
                                 bg-gradient-to-r from-primary to-primary-ring
                                 shadow-xl shadow-primary/35
                                 hover:from-primary-ring hover:to-primary
                                 hover:shadow-primary/50 hover:scale-[1.02]
                                 active:scale-[0.98]
                                 disabled:opacity-60 disabled:cursor-not-allowed
                                 transition-all duration-300
                                 flex items-center justify-center gap-3"
                    >
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                          />
                          <span>A confirmar...</span>
                        </>
                      ) : (
                        <>
                          <span>Confirmar Presença</span>
                          <span className="text-xl">✓</span>
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                /* ── Success state ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  className="bg-white rounded-3xl shadow-2xl shadow-green-100/60
                             border border-green-100 p-8 md:p-10 text-center"
                >
                  {/* Trophy icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 16 }}
                    className="w-28 h-28 mx-auto rounded-full
                               bg-gradient-to-br from-primary to-primary-ring
                               flex items-center justify-center text-6xl
                               shadow-2xl shadow-primary/40 mb-6"
                  >
                    🎉
                  </motion.div>

                  <h3 className="text-2xl font-black text-foreground mb-2">
                    Presença Confirmada!
                  </h3>
                  <p className="text-gray-500 mb-8 leading-relaxed">
                    Obrigado,{" "}
                    <strong className="text-primary">{confirmed?.nome}</strong>!
                    <br />
                    Esperamos por si dia{" "}
                    <strong className="text-foreground">9 de Junho às 18h00</strong> 🚌
                  </p>

                  <div className="rounded-2xl bg-primary-soft border border-primary/25 p-5 text-left space-y-3">
                    {[
                      { icon: "📍", text: "Rua do BFA, Travessa 26, Bairro Benfica, Talatona · Luanda" },
                      { icon: "🕕", text: "18h00 — Terça-feira, 9 de Junho de 2026" },
                      { icon: "🚌", text: "Inauguração da Nova Sede Nawabus" },
                    ].map((row) => (
                      <div key={row.icon} className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="text-base">{row.icon}</span>
                        <span>{row.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Floating stars */}
                  <div className="relative h-10 mt-4 overflow-hidden">
                    {["✨", "🌟", "⭐", "✨"].map((s, i) => (
                      <motion.span
                        key={i}
                        className="absolute text-xl"
                        style={{ left: `${15 + i * 22}%` }}
                        animate={{ y: [0, -28, 0], opacity: [0, 1, 0] }}
                        transition={{
                          duration: 2,
                          delay: i * 0.25,
                          repeat: Infinity,
                          repeatDelay: 1.5,
                        }}
                      >
                        {s}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
