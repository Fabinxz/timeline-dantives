"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{ height: "90vh", minHeight: "500px" }}
    >
      {/* ── Radial ambient glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 45%, rgba(0,245,255,0.06) 0%, transparent 70%)",
        }}
      />

      {/* ── Grid lines background ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
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
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
      >
        {/* Eyebrow label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-[10px] sm:text-xs tracking-[6px] sm:tracking-[8px] uppercase mb-6 sm:mb-8"
          style={{
            fontFamily: "var(--font-mono)",
            color: "rgba(0,245,255,0.4)",
          }}
        >
          Exposição Virtual Interativa
        </motion.p>

        {/* Main headline — outline text */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
          className="text-outline text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-[0.9] tracking-tight mb-4 sm:mb-6"
          style={{ fontFamily: "var(--font-display)" }}
        >
          A MÁQUINA
          <br />
          ANCESTRAL
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-8 sm:mb-12 leading-relaxed"
          style={{ color: "rgba(224,224,224,0.6)" }}
        >
          Uma jornada interativa desde os sulcos na areia da Mesopotâmia
          até os registradores dos computadores modernos.
        </motion.p>

        {/* CTA Button */}
        <motion.a
          href="#conteudo"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="
            cta-pulse
            inline-flex items-center gap-2
            px-6 py-3 sm:px-8 sm:py-3.5
            rounded-full
            text-xs sm:text-sm tracking-[3px] uppercase
            border border-[#00F5FF]/40
            transition-all duration-300
            hover:bg-[#00F5FF]/10 hover:border-[#00F5FF]/70
            cursor-pointer
          "
          style={{
            fontFamily: "var(--font-mono)",
            color: "#00F5FF",
            background: "rgba(0,245,255,0.05)",
          }}
        >
          Explorar
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </motion.a>
      </motion.div>

      {/* ── Bottom fade ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to top, #050505, transparent)",
        }}
      />
    </section>
  );
}
