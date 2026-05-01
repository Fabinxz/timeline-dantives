"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ghost, Hand, Calculator } from "lucide-react";

/* ═══════════════════════════════════════════════════
   CONSTANTS & CONFIG
   ═══════════════════════════════════════════════════ */
const NUM_RODS = 13;
const BEAD_W = 60;
const BEAD_H = 24;
const BEAD_GAP = 4;
const HEAVEN_H = 80;
const EARTH_H = 160;

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
  onClick: () => void;
  disabled: boolean;
}

function Bead({ active, isHeaven, index = 0, activeCount = 0, onClick, disabled }: BeadProps) {
  let top = 0;
  if (isHeaven) {
    top = active ? (HEAVEN_H - BEAD_H - 2) : 2;
  } else {
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
      onClick={() => { if (!disabled) onClick(); }}
      className={`absolute left-1/2 -translate-x-1/2 ${active ? 'z-20' : 'z-10'} ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
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
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          clipPath: "polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 40%, rgba(0,0,0,0.3) 100%)"
        }}
      />
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
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [manualRods, setManualRods] = useState(
    Array.from({ length: NUM_RODS }).map(() => ({ heaven: 0, earth: 0 }))
  );

  // Derive ghost rods from input (with real-time math evaluation)
  let calculatedStr = "0";
  if (inputValue.trim()) {
    try {
      // Allow only numbers and basic math operators
      const sanitized = inputValue.replace(/[^0-9+\-*/().]/g, "");
      if (sanitized) {
        // eslint-disable-next-line no-new-func
        const result = new Function("return " + sanitized)();
        if (Number.isFinite(result)) {
          calculatedStr = Math.floor(Math.abs(result)).toString();
        } else {
          calculatedStr = inputValue.replace(/[^0-9]/g, "");
        }
      }
    } catch (e) {
      // If incomplete expression (like "2+"), fallback to just digits typed
      calculatedStr = inputValue.replace(/[^0-9]/g, "");
    }
  }

  const strVal = calculatedStr.slice(0, NUM_RODS);
  const ghostRods = Array.from({ length: NUM_RODS }).map((_, i) => {
    const strIndex = i - (NUM_RODS - strVal.length);
    if (strIndex >= 0 && strIndex < strVal.length) {
      const digit = parseInt(strVal[strIndex], 10);
      return { heaven: digit >= 5 ? 1 : 0, earth: digit % 5 };
    }
    return { heaven: 0, earth: 0 };
  });

  const activeRods = isGhostMode ? ghostRods : manualRods;

  // Calculate Display Value
  const displayValue = activeRods.map(r => (r.heaven * 5 + r.earth).toString()).join('');

  const handleBeadClick = (rodIndex: number, isHeaven: boolean, beadIndex?: number) => {
    if (isGhostMode) return;
    
    setManualRods(prev => {
      const newRods = [...prev];
      const rod = { ...newRods[rodIndex] };

      if (isHeaven) {
        rod.heaven = rod.heaven === 1 ? 0 : 1;
      } else {
        // If clicking an active bead, deactivate it and all below it.
        // Wait, in soroban: 
        // Array index 0 is top earth bead, index 3 is bottom earth bead.
        // activeCount goes from 0 to 4.
        // If we click bead index `b`, and it is active (b < activeCount), we set activeCount to `b`.
        // If it is inactive (b >= activeCount), we set activeCount to `b + 1`.
        if (beadIndex !== undefined) {
          if (beadIndex < rod.earth) {
            rod.earth = beadIndex;
          } else {
            rod.earth = beadIndex + 1;
          }
        }
      }
      
      newRods[rodIndex] = rod;
      return newRods;
    });
  };

  const toggleMode = () => {
    setIsGhostMode(!isGhostMode);
    // Optionally clear input/manual state on swap, but leaving it allows seamless toggling to view different states.
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 relative">
      
      {/* ── HEADER CONSOLE ── */}
      <div className="w-full max-w-[1200px] flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-[#090909] p-4 rounded-xl border border-white/[0.05] shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        
        {/* Toggle Switch */}
        <div className="flex items-center gap-3 bg-black/50 p-1.5 rounded-lg border border-white/10">
          <button 
            onClick={() => setIsGhostMode(false)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs tracking-widest uppercase transition-all duration-300 ${!isGhostMode ? 'bg-[#00F5FF]/20 text-[#00F5FF] shadow-[0_0_15px_rgba(0,245,255,0.2)]' : 'text-gray-500 hover:text-white'}`}
          >
            <Hand className="w-3.5 h-3.5" />
            Manual
          </button>
          <button 
            onClick={() => setIsGhostMode(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs tracking-widest uppercase transition-all duration-300 ${isGhostMode ? 'bg-[#00F5FF]/20 text-[#00F5FF] shadow-[0_0_15px_rgba(0,245,255,0.2)]' : 'text-gray-500 hover:text-white'}`}
          >
            <Ghost className="w-3.5 h-3.5" />
            Fantasma
          </button>
        </div>

        {/* LED Display */}
        <div className="flex items-center gap-4 bg-black px-6 py-3 rounded border border-[#00F5FF]/20 shadow-[inset_0_0_20px_rgba(0,0,0,1)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#00F5FF]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-[#00F5FF]/40 font-mono text-2xl md:text-3xl tracking-[4px] md:tracking-[8px] pointer-events-none">
            [
          </span>
          <span 
            className="text-[#00F5FF] font-mono text-3xl md:text-5xl font-bold tracking-[6px] md:tracking-[12px] drop-shadow-[0_0_12px_rgba(0,245,255,0.8)]"
            style={{ textShadow: "0 0 10px rgba(0,245,255,0.6), 0 0 20px rgba(0,245,255,0.4)" }}
          >
            {displayValue}
          </span>
          <span className="text-[#00F5FF]/40 font-mono text-2xl md:text-3xl tracking-[4px] md:tracking-[8px] pointer-events-none">
            ]
          </span>
        </div>

      </div>

      {/* ── SOROBAN BOARD ── */}
      <div className="w-full max-w-[1400px] overflow-x-auto pb-6 scrollbar-hide flex justify-center">
        <div className="min-w-max p-4 md:p-8 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-xl border-4 border-[#333] shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative">
          
          {/* Wood Frame Texture */}
          <div className="absolute inset-0 rounded-lg opacity-20 pointer-events-none"
               style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)" }} />

          {/* Rods Container */}
          <div className="flex" style={{ gap: "20px" }}>
            {activeRods.map((rod, r) => (
              <div key={r} className="relative flex flex-col items-center flex-shrink-0" style={{ width: BEAD_W, minWidth: BEAD_W }}>
                
                {/* Bamboo Rod (Background) */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-2.5 bg-gradient-to-r from-[#222] via-[#444] to-[#111] rounded-full shadow-inner" />

                {/* HEAVEN COMPARTMENT */}
                <div className="relative w-full" style={{ height: HEAVEN_H }}>
                  <Bead 
                    active={rod.heaven === 1} 
                    isHeaven={true} 
                    onClick={() => handleBeadClick(r, true)}
                    disabled={isGhostMode}
                  />
                </div>

                {/* DIVIDER BAR */}
                <div className="w-[80px] h-4 bg-gradient-to-r from-[#222] via-[#555] to-[#222] rounded-sm my-1 shadow-md z-30 relative flex-shrink-0" />

                {/* EARTH COMPARTMENT */}
                <div className="relative w-full" style={{ height: EARTH_H }}>
                  {[0, 1, 2, 3].map((b) => (
                    <Bead
                      key={`earth-${r}-${b}`}
                      index={b}
                      active={b < rod.earth}
                      activeCount={rod.earth}
                      isHeaven={false}
                      onClick={() => handleBeadClick(r, false, b)}
                      disabled={isGhostMode}
                    />
                  ))}
                </div>

                {/* BOTTOM LABEL */}
                <div className="absolute -bottom-7 text-[12px] text-white/30 tracking-widest">{LABELS[r]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── GHOST MODE INPUT AREA ── */}
      <AnimatePresence>
        {isGhostMode && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="mt-8 relative max-w-xl w-full"
          >
            <div className="absolute inset-0 bg-[#00F5FF]/10 blur-xl rounded-full" />
            <div className="relative flex items-center bg-[#090909]/80 backdrop-blur-md border border-[#00F5FF]/30 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,245,255,0.1)] p-3">
              <div className="pl-4 pr-3 text-[#00F5FF]/70">
                <Calculator className="w-6 h-6" />
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ex: 10 + 15 * 2"
                maxLength={30}
                className="flex-1 bg-transparent border-none text-white text-2xl md:text-3xl font-bold placeholder:text-white/20 focus:outline-none focus:ring-0 py-3"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "2px" }}
              />
            </div>
            <p className="text-center text-[10px] sm:text-xs text-[#00F5FF]/50 mt-4 font-mono tracking-widest uppercase">
              As hastes estão bloqueadas. O Modo Fantasma controla o ábaco.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
