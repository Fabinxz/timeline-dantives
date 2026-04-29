"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-center overflow-hidden py-16 md:py-20"
    >
      {/* ── Grid lines background ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Content ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 px-4 sm:px-8 max-w-5xl mx-auto w-full"
      >
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 text-[#00F5FF] tracking-tight"
        >
          Primeira calculadora da história:
        </h1>

        <div
          className="text-sm sm:text-base md:text-lg leading-[1.8] md:leading-[2] text-gray-300 space-y-6"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <p className="text-justify md:text-left">
            &nbsp;&nbsp;&nbsp;&nbsp;O ábaco é um antigo instrumento de cálculo que, segundo muitos historiadores, foi inventado na Mesopotâmia (pelo menos em sua forma primitiva) e depois foi aperfeiçoado pelos chineses e romanos. Sua criação veio da necessidade do comércio de contabilizar mercadorias, permitindo operações aritméticas muito antes da adoção dos numerais arábicos.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
