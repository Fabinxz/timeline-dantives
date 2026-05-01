"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Ghost, Calculator } from "lucide-react";

/* ═══════════════════════════════════════════════════
   CONSTANTS & CONFIG
   ═══════════════════════════════════════════════════ */
const NUM_RODS = 13;
const BEAD_W = 34;
const BEAD_H = 14;
const BEAD_GAP = 2;
const HEAVEN_H = 46;
const EARTH_H = 90;

const LABELS = [
  "T", "B", "M", "c", "d", "u",
  "C", "D", "U",
  "c", "d", "u",
  "d",
];

/* ═══════════════════════════════════════════════════
   BEAD COMPONENT
   ═══════════════════════════════════════════════════ */
interface BeadProps {
  active: boolean;
  isHeaven: boolean;
  index?: number;
  activeCount?: number;
}

function Bead({ active, isHeaven, index = 0, activeCount = 0 }: BeadProps) {
  let top = 0;
  if (isHeaven) {
    // Heaven bead: active means it's pushed DOWN towards the center bar
    top = active ? (HEAVEN_H - BEAD_H - 2) : 2;
  } else {
    // Earth beads: active means they are pushed UP towards the center bar
    if (active) {
      top = 2 + index * (BEAD_H + BEAD_GAP);
    } else {
      const inactiveCount = 4 - activeCount;
      const idx = index - activeCount;
      const totalInactiveH = inactiveCount * BEAD_H + (inactiveCount - 1) * BEAD_GAP;
      const startBottom = EARTH_H - totalInactiveH - 2;
      top = startBottom + idx * (BEAD_H + BEAD_GAP);
    }
  }

  return (
    <motion.div
      layout
      initial={false}
      transition={{ type: "spring", stiffness: 120, damping: 14, mass: 0.8 }}
      className={`absolute left-1/2 -translate-x-1/2 ${active ? 'z-20' : 'z-10'}`}
      style={{
        width: BEAD_W,
        height: BEAD_H,
        top: top,
        clipPath: "polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)",
        background: active 
          ? "radial-gradient(ellipse at 50% 50%, rgba(0,245,255,0.5), transparent 70%), linear-gradient(180deg, #00E5EE 0%, #00CED1 40%, #008B8B 100%)"
          : "radial-gradient(ellipse at 40% 30%, rgba(255,255,255,0.08), transparent 60%), linear-gradient(180deg, #333 0%, #222 45%, #151515 100%)",
        boxShadow: active ? "0 0 15px rgba(0,245,255,0.5)" : "none",
        filter: active ? "drop-shadow(0 0 8px rgba(0,245,255,0.6)) brightness(1.1)" : "drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
      }}
    >
      {/* Inner Bevel */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          clipPath: "polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 40%, rgba(0,0,0,0.3) 100%)"
        }}
      />
      {/* Center ridge */}
      <div 
        className="absolute top-[35%] left-[12%] right-[12%] h-[30%] pointer-events-none"
        style={{
          clipPath: "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)",
          background: active ? "rgba(0,245,255,0.2)" : "rgba(0,0,0,0.4)"
        }}
      />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function SorobanSimulator() {
  const [inputValue, setInputValue] = useState("");

  // Process input to generate rods
  const strVal = inputValue.replace(/[^0-9]/g, "").slice(0, NUM_RODS);
  
  const rods = Array.from({ length: NUM_RODS }).map((_, i) => {
    const strIndex = i - (NUM_RODS - strVal.length);
    if (strIndex >= 0 && strIndex < strVal.length) {
      const digit = parseInt(strVal[strIndex], 10);
      return {
        heaven: digit >= 5 ? 1 : 0,
        earth: digit % 5,
        isActive: true,
        digit
      };
    }
    return { heaven: 0, earth: 0, isActive: false, digit: 0 };
  });

  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      
      {/* TITLE & DECORATION */}
      <div className="flex items-center gap-3 mb-8">
        <Ghost className="w-6 h-6 text-[#00F5FF]" />
        <h2 className="text-2xl md:text-3xl font-bold tracking-widest text-white/90" style={{ fontFamily: "var(--font-display)" }}>
          MODO FANTASMA
        </h2>
      </div>

      {/* SOROBAN BOARD */}
      <div className="w-full max-w-4xl overflow-x-auto pb-8 scrollbar-hide flex justify-center">
        <div className="min-w-max p-4 md:p-8 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-xl border-4 border-[#333] shadow-2xl relative">
          
          {/* Wood Frame Texture */}
          <div className="absolute inset-0 rounded-lg opacity-20 pointer-events-none"
               style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)" }} />

          {/* Rods Container */}
          <div className="flex gap-4 md:gap-6">
            {rods.map((rod, r) => (
              <div key={r} className="relative flex flex-col items-center" style={{ width: BEAD_W }}>
                
                {/* Bamboo Rod (Background) */}
                <div className="absolute top-0 bottom-0 w-1.5 bg-gradient-to-r from-[#222] via-[#444] to-[#111] rounded-full shadow-inner" />

                {/* HEAVEN COMPARTMENT */}
                <div className="relative w-full" style={{ height: HEAVEN_H }}>
                  <Bead active={rod.heaven === 1} isHeaven={true} />
                </div>

                {/* DIVIDER BAR */}
                <div className="w-12 h-3 bg-gradient-to-r from-[#222] via-[#555] to-[#222] rounded-sm my-1 shadow-md z-30" />

                {/* EARTH COMPARTMENT */}
                <div className="relative w-full" style={{ height: EARTH_H }}>
                  {[0, 1, 2, 3].map((b) => (
                    <Bead
                      key={`earth-${r}-${b}`}
                      index={b}
                      active={b < rod.earth}
                      activeCount={rod.earth}
                      isHeaven={false}
                    />
                  ))}
                </div>

                {/* BOTTOM LABEL & VALUE */}
                <div className="absolute -bottom-8 flex flex-col items-center gap-1">
                  <div className="text-[10px] text-white/30 tracking-widest">{LABELS[r]}</div>
                  <motion.div 
                    className={`text-sm font-bold ${rod.isActive ? 'text-[#00F5FF]' : 'text-gray-700'}`}
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {rod.digit}
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GHOST MODE INPUT */}
      <div className="mt-8 relative max-w-md w-full">
        <div className="absolute inset-0 bg-[#00F5FF]/10 blur-xl rounded-full" />
        <div className="relative flex items-center bg-[#090909]/80 backdrop-blur-md border border-[#00F5FF]/30 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,245,255,0.1)] p-2">
          <div className="pl-4 pr-3 text-[#00F5FF]/70">
            <Calculator className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Digite um número..."
            maxLength={13}
            className="flex-1 bg-transparent border-none text-white text-xl md:text-2xl font-bold placeholder:text-white/20 focus:outline-none focus:ring-0 py-3"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "2px" }}
          />
        </div>
        <p className="text-center text-xs text-white/40 mt-4 font-mono tracking-widest uppercase">
          As hastes respondem automaticamente à entrada
        </p>
      </div>
      
    </div>
  );
}
