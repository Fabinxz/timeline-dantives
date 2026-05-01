"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ghost, Hand, Calculator, RotateCcw } from "lucide-react";

/* ═══════════════════════════════════════════════════
   CONSTANTS & CONFIG
   ═══════════════════════════════════════════════════ */
const NUM_RODS = 13;
const BEAD_W = 60;
const BEAD_H = 24;
const BEAD_GAP = 4;
const HEAVEN_H = 80;
const EARTH_H = 160;

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
      transition={disabled 
        ? { type: "spring", stiffness: 50, damping: 20, mass: 1 } // Slow and didactic for Tutor Mode
        : { type: "spring", stiffness: 350, damping: 28, mass: 0.5 } // Ultra responsive for Manual Mode
      }
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
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Tutor Mode State
  const [tutorMessage, setTutorMessage] = useState<string>("Aguardando equação...");
  const [displayedGhostValue, setDisplayedGhostValue] = useState<string>("0");
  const [activeTutorRod, setActiveTutorRod] = useState<number | null>(null);
  const sequenceRef = useRef(0);

  // Responsive scale hook to fit the massive soroban perfectly into ANY viewport
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const availableWidth = containerRef.current.clientWidth;
        // The intrinsic width of the Soroban board is around 1100px with its padding/borders
        const targetWidth = 1100;
        const newScale = Math.min(1, availableWidth / targetWidth);
        setScale(newScale);
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // Async Animation Engine for Tutor Mode
  useEffect(() => {
    if (!isGhostMode) return;
    
    const currentSeq = ++sequenceRef.current;
    
    const timeoutId = setTimeout(async () => {
      const expr = inputValue.trim();
      if (!expr) {
        setDisplayedGhostValue("0");
        setTutorMessage("> Aguardando equação...");
        return;
      }

      setTutorMessage("> Analisando equação...");
      
      try {
        const sanitized = expr.replace(/[^0-9+\-*/().]/g, "");
        const tokens = sanitized.match(/(\d+|\+|-|\*|\/)/g);
        
        if (!tokens || tokens.length === 0) {
          throw new Error("Invalid");
        }

        let currentValue = parseInt(tokens[0], 10);
        if (isNaN(currentValue)) throw new Error("Invalid");
        
        setDisplayedGhostValue(currentValue.toString());
        setTutorMessage(`> Registrando valor inicial (${currentValue})...`);
        await pause(1500);
        if (sequenceRef.current !== currentSeq) return;

        for (let i = 1; i < tokens.length - 1; i += 2) {
          const op = tokens[i];
          const numStr = tokens[i+1];
          if (!numStr) break;
          const numVal = parseInt(numStr, 10);
          if (isNaN(numVal)) break;

          if (op === "+" || op === "-") {
            const digits = numStr.split("");
            for (let j = 0; j < digits.length; j++) {
              const digitVal = parseInt(digits[j], 10);
              if (digitVal === 0) continue;
              
              const power = digits.length - 1 - j;
              const placeValue = digitVal * Math.pow(10, power);
              
              const placeName = power === 0 ? "Unidades" : power === 1 ? "Dezenas" : power === 2 ? "Centenas" : "Milhares";
              const v = Math.floor(currentValue / Math.pow(10, power)) % 10;
              const d = digitVal;
              
              // Determine target rod (0 to 12). Unidades (power=0) -> Rod 12. Dezenas (power=1) -> Rod 11.
              const targetRod = NUM_RODS - 1 - power;

              setActiveTutorRod(targetRod);

              if (op === "+") {
                if (v + d >= 10) {
                  setTutorMessage(`> [${placeName}] Queremos somar ${d}, mas faltam peças nesta haste.`);
                  await pause(2500);
                  if (sequenceRef.current !== currentSeq) return;

                  setActiveTutorRod(targetRod - 1);
                  setTutorMessage(`> Passo 1: Pegamos 1 peça 'emprestada' da casa vizinha à esquerda (+10).`);
                  currentValue += Math.pow(10, power + 1);
                  setDisplayedGhostValue(Math.max(0, currentValue).toString());
                  await pause(2500);
                  if (sequenceRef.current !== currentSeq) return;

                  setActiveTutorRod(targetRod);
                  setTutorMessage(`> Passo 2: Para compensar, retiramos ${10 - d} peças das ${placeName} (-${10 - d}).`);
                  currentValue -= (10 - d) * Math.pow(10, power);
                  setDisplayedGhostValue(Math.max(0, currentValue).toString());
                  await pause(2500);
                } else if (v < 5 && v + d >= 5) {
                  setTutorMessage(`> [${placeName}] Queremos somar ${d}, mas faltam peças terrestres.`);
                  await pause(2500);
                  if (sequenceRef.current !== currentSeq) return;

                  setTutorMessage(`> Passo 1: Abaixamos a conta Celestial que vale 5 (+5).`);
                  currentValue += 5 * Math.pow(10, power);
                  setDisplayedGhostValue(Math.max(0, currentValue).toString());
                  await pause(2500);
                  if (sequenceRef.current !== currentSeq) return;

                  setTutorMessage(`> Passo 2: Para compensar, retiramos ${5 - d} peças terrestres (-${5 - d}).`);
                  currentValue -= (5 - d) * Math.pow(10, power);
                  setDisplayedGhostValue(Math.max(0, currentValue).toString());
                  await pause(2500);
                } else {
                  setTutorMessage(`> [${placeName}] Subimos ${d} conta(s) nas ${placeName} diretamente.`);
                  currentValue += placeValue;
                  setDisplayedGhostValue(Math.max(0, currentValue).toString());
                  await pause(2500);
                }
              } else {
                if (v - d < 0) {
                  setTutorMessage(`> [${placeName}] Queremos subtrair ${d}, mas faltam peças nesta haste.`);
                  await pause(2500);
                  if (sequenceRef.current !== currentSeq) return;

                  setActiveTutorRod(targetRod - 1);
                  setTutorMessage(`> Passo 1: Retiramos 1 peça da casa vizinha à esquerda (-10).`);
                  currentValue -= Math.pow(10, power + 1);
                  setDisplayedGhostValue(Math.max(0, currentValue).toString());
                  await pause(2500);
                  if (sequenceRef.current !== currentSeq) return;

                  setActiveTutorRod(targetRod);
                  setTutorMessage(`> Passo 2: Para compensar, devolvemos ${10 - d} peças nas ${placeName} (+${10 - d}).`);
                  currentValue += (10 - d) * Math.pow(10, power);
                  setDisplayedGhostValue(Math.max(0, currentValue).toString());
                  await pause(2500);
                } else if (v >= 5 && v - d < 5) {
                  setTutorMessage(`> [${placeName}] Queremos subtrair ${d}, mas precisamos usar a conta Celestial.`);
                  await pause(2500);
                  if (sequenceRef.current !== currentSeq) return;

                  setTutorMessage(`> Passo 1: Retiramos a conta Celestial (-5).`);
                  currentValue -= 5 * Math.pow(10, power);
                  setDisplayedGhostValue(Math.max(0, currentValue).toString());
                  await pause(2500);
                  if (sequenceRef.current !== currentSeq) return;

                  setTutorMessage(`> Passo 2: Para compensar, devolvemos ${5 - d} peças terrestres (+${5 - d}).`);
                  currentValue += (5 - d) * Math.pow(10, power);
                  setDisplayedGhostValue(Math.max(0, currentValue).toString());
                  await pause(2500);
                } else {
                  setTutorMessage(`> [${placeName}] Abaixamos ${d} conta(s) nas ${placeName} diretamente.`);
                  currentValue -= placeValue;
                  setDisplayedGhostValue(Math.max(0, currentValue).toString());
                  await pause(2500);
                }
              }
              
              if (sequenceRef.current !== currentSeq) return;
            }
          } else {
            setActiveTutorRod(null);
            currentValue = op === "*" ? currentValue * numVal : Math.floor(currentValue / numVal);
            setDisplayedGhostValue(Math.max(0, currentValue).toString());
            setTutorMessage(`> Operação Completa: ${op === "*" ? "Multiplicando" : "Dividindo"} tudo por ${numVal}...`);
            await pause(2500);
            if (sequenceRef.current !== currentSeq) return;
          }
        }
        
        setActiveTutorRod(null);
        setTutorMessage(`> Cálculo finalizado: ${currentValue}`);
        
      } catch (err) {
        setDisplayedGhostValue(inputValue.replace(/[^0-9]/g, ""));
        setTutorMessage("> Formato inválido. Digite uma equação (ex: 12 + 15)");
      }
    }, 600); // 600ms debounce

    return () => clearTimeout(timeoutId);
  }, [inputValue, isGhostMode]);

  const [manualRods, setManualRods] = useState(
    Array.from({ length: NUM_RODS }).map(() => ({ heaven: 0, earth: 0 }))
  );

  const handleReset = () => {
    if (isGhostMode) {
      setInputValue("");
      setDisplayedGhostValue("0");
      setTutorMessage("> Aguardando equação...");
      setActiveTutorRod(null);
      sequenceRef.current++; // Aborts any ongoing async sequence
    } else {
      setManualRods(Array.from({ length: NUM_RODS }).map(() => ({ heaven: 0, earth: 0 })));
    }
  };

  // Derive ghost rods from displayed ghost value (async controlled)
  const strVal = displayedGhostValue.slice(0, NUM_RODS);
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
        <div className="flex w-full sm:w-auto justify-center items-center gap-2 sm:gap-3 bg-black/50 p-1.5 rounded-lg border border-white/10">
          <button 
            onClick={() => setIsGhostMode(false)}
            className={`flex items-center gap-2 px-3 py-2 sm:py-1.5 rounded-md text-[10px] sm:text-xs tracking-widest uppercase transition-all duration-300 ${!isGhostMode ? 'bg-[#00F5FF]/20 text-[#00F5FF] shadow-[0_0_15px_rgba(0,245,255,0.2)]' : 'text-gray-500 hover:text-white'}`}
          >
            <Hand className="w-3.5 h-3.5" />
            Manual
          </button>
          <button 
            onClick={() => setIsGhostMode(true)}
            className={`flex items-center gap-2 px-3 py-2 sm:py-1.5 rounded-md text-[10px] sm:text-xs tracking-widest uppercase transition-all duration-300 ${isGhostMode ? 'bg-[#00F5FF]/20 text-[#00F5FF] shadow-[0_0_15px_rgba(0,245,255,0.2)]' : 'text-gray-500 hover:text-white'}`}
          >
            <Ghost className="w-3.5 h-3.5" />
            Fantasma
          </button>
          
          {/* Reset Button */}
          <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />
          <button 
            onClick={handleReset}
            className="flex items-center justify-center p-2 rounded-md text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            title="Zerar Ábaco"
          >
            <RotateCcw className="w-4 h-4 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* LED Display */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 bg-black px-4 sm:px-6 py-3 rounded border border-[#00F5FF]/20 shadow-[inset_0_0_20px_rgba(0,0,0,1)] relative overflow-hidden group w-full sm:w-auto">
          <div className="absolute inset-0 bg-[#00F5FF]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-[#00F5FF]/40 font-mono text-xl sm:text-2xl md:text-3xl tracking-[2px] sm:tracking-[4px] md:tracking-[8px] pointer-events-none">
            [
          </span>
          <span 
            className="text-[#00F5FF] font-mono text-xl sm:text-3xl md:text-5xl font-bold tracking-[3px] sm:tracking-[6px] md:tracking-[12px] drop-shadow-[0_0_12px_rgba(0,245,255,0.8)]"
            style={{ textShadow: "0 0 10px rgba(0,245,255,0.6), 0 0 20px rgba(0,245,255,0.4)" }}
          >
            {displayValue}
          </span>
          <span className="text-[#00F5FF]/40 font-mono text-xl sm:text-2xl md:text-3xl tracking-[2px] sm:tracking-[4px] md:tracking-[8px] pointer-events-none">
            ]
          </span>
        </div>

      </div>

      {/* ── SOROBAN BOARD ── */}
      <div className="w-full pb-6 flex justify-center" ref={containerRef}>
        {/* Responsive Scaler Wrapper */}
        <div 
          className="relative w-[1100px] flex justify-center transition-all duration-300"
          style={{ height: `${360 * scale}px` }}
        >
          <div 
            className="absolute top-0 origin-top flex justify-center"
            style={{ transform: `scale(${scale})` }}
          >
            <div className="min-w-max p-4 md:p-8 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-xl border-4 border-[#333] shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative">
          
          {/* Wood Frame Texture */}
          <div className="absolute inset-0 rounded-lg opacity-20 pointer-events-none"
               style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)" }} />

          {/* Rods Container */}
          <div className="flex" style={{ gap: "20px" }}>
            {activeRods.map((rod, r) => (
              <div 
                key={r} 
                className={`relative flex flex-col items-center flex-shrink-0 transition-all duration-700 rounded-lg p-1 ${activeTutorRod === r ? 'bg-[#00F5FF]/20 shadow-[0_0_30px_rgba(0,245,255,0.4)] ring-2 ring-[#00F5FF]' : ''}`} 
                style={{ width: BEAD_W + 8, minWidth: BEAD_W + 8 }}
              >
                
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
        </div>
      </div>

      {/* ── GHOST MODE INPUT AREA ── */}
      <AnimatePresence>
        {isGhostMode && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="mt-8 relative max-w-xl w-full flex flex-col gap-4"
          >
            {/* Input Container */}
            <div className="relative group">
              <div className="absolute inset-0 bg-[#00F5FF]/10 blur-xl rounded-full" />
              <div className="relative flex items-center bg-[#090909]/80 backdrop-blur-md border border-[#00F5FF]/30 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,245,255,0.1)] p-3">
                <div className="pl-4 pr-3 text-[#00F5FF]/70">
                  <Calculator className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ex: 12 + 15"
                  maxLength={30}
                  className="flex-1 w-full min-w-0 bg-transparent border-none text-white text-lg sm:text-2xl md:text-3xl font-bold placeholder:text-white/20 focus:outline-none focus:ring-0 py-2 sm:py-3"
                  style={{ fontFamily: "var(--font-mono)", letterSpacing: "2px" }}
                />
              </div>
            </div>

            {/* Narrator HUD */}
            <div className="relative flex items-center bg-[#050505]/90 backdrop-blur-md border border-[#00F5FF]/20 rounded-lg overflow-hidden p-4 shadow-[0_0_20px_rgba(0,245,255,0.05)]">
               <span className="text-[#00F5FF]/90 font-mono text-sm tracking-wide">
                 {tutorMessage}
                 <motion.span 
                   animate={{ opacity: [1, 0] }} 
                   transition={{ repeat: Infinity, duration: 0.8 }}
                   className="inline-block w-2 h-4 bg-[#00F5FF] ml-1 align-middle shadow-[0_0_8px_rgba(0,245,255,0.8)]"
                 />
               </span>
            </div>

            <p className="text-center text-[10px] sm:text-xs text-[#00F5FF]/50 font-mono tracking-widest uppercase mt-2">
              Modo Tutor ativado. Digite a operação e aguarde a animação.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
