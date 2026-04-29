"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16 pt-16 sm:pt-20"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 w-full"
        >
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-[#00F5FF]/40" strokeWidth={1.5} />
            <p
              className="text-[10px] sm:text-xs tracking-[5px] uppercase"
              style={{
                fontFamily: "var(--font-mono)",
                color: "rgba(0,245,255,0.35)",
              }}
            >
              Contexto Histórico
            </p>
          </div>
          
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-white/90 tracking-tight"
          >
            Primeira calculadora da história
          </h1>

          <div
            className="text-sm sm:text-base md:text-lg leading-relaxed max-w-4xl"
            style={{ color: "rgba(180,180,180,0.8)" }}
          >
            <p>
              O ábaco é um antigo instrumento de cálculo que, segundo muitos historiadores, foi inventado na Mesopotâmia (pelo menos em sua forma primitiva) e depois foi aperfeiçoado pelos chineses e romanos. Sua criação veio da necessidade do comércio de contabilizar mercadorias, permitindo operações aritméticas muito antes da adoção dos numerais arábicos.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
