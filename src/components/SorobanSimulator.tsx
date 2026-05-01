"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Play, RotateCcw, Trophy, Activity, Terminal } from "lucide-react";
import { useMechanicalSound } from "@/hooks/useMechanicalSound";

/* ═══════════════════════════════════════════════════
   CONSTANTS & TYPES
   ═══════════════════════════════════════════════════ */
const RODS = 10;
const LABELS = ['10⁹','10⁸','10⁷','10⁶','10⁵','10⁴','10³','10²','10¹','10⁰'];

type BeadState = { heaven: boolean; earth: number };

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function SorobanSimulator() {
  const { playClick, isMuted, setIsMuted } = useMechanicalSound();
  
  const [beads, setBeads] = useState<BeadState[]>(
    Array.from({ length: RODS }, () => ({ heaven: false, earth: 0 }))
  );
  
  // Layout measurements
  const containerRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({
    heavenH: 60,
    earthH: 140,
    beadW: 44,
    beadH: 22,
    beadGap: 3
  });

  // Gamification State
  const [isChallenge, setIsChallenge] = useState(false);
  const [targetValue, setTargetValue] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [interactions, setInteractions] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /* ── RESIZE OBSERVER ── */
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        // Available frame height roughly = height - padding/lcd
        const frameAvailable = Math.max(150, height - 120);
        
        const hH = Math.max(30, Math.floor(frameAvailable * 0.22));
        const eH = Math.max(60, Math.floor(frameAvailable * 0.78));
        
        const rodW = (width - 16) / RODS;
        const bW = Math.max(18, Math.min(56, Math.floor(rodW * 0.85)));
        const bH = Math.max(10, Math.min(30, Math.floor(bW * 0.5)));
        const gap = Math.max(1, Math.min(5, Math.floor((eH - 4 * bH - 8) / 5)));

        setLayout({
          heavenH: hH,
          earthH: eH,
          beadW: bW,
          beadH: bH,
          beadGap: gap
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  /* ── CALCULATOR ── */
  const currentValue = beads.reduce((acc, rod, idx) => {
    const val = (rod.heaven ? 5 : 0) + rod.earth;
    return acc + val * Math.pow(10, RODS - 1 - idx);
  }, 0);

  /* ── GAMIFICATION LOOP ── */
  useEffect(() => {
    if (isChallenge && targetValue !== null && !showSuccess) {
      if (currentValue === targetValue) {
        // Win!
        if (timerRef.current) clearInterval(timerRef.current);
        setShowSuccess(true);
        setIsChallenge(false);
      }
    }
  }, [currentValue, isChallenge, targetValue, showSuccess]);

  useEffect(() => {
    if (isChallenge && startTime) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isChallenge, startTime]);

  const startChallenge = () => {
    // Generate random target (e.g. 100 to 99999)
    const max = 99999;
    const min = 100;
    const randomTarget = Math.floor(Math.random() * (max - min + 1)) + min;
    setTargetValue(randomTarget);
    setIsChallenge(true);
    setShowSuccess(false);
    setStartTime(Date.now());
    setElapsedTime(0);
    setInteractions(0);
    setBeads(Array.from({ length: RODS }, () => ({ heaven: false, earth: 0 })));
  };

  /* ── INTERACTIONS ── */
  const toggleHeaven = (r: number) => {
    setBeads((prev) => {
      const next = [...prev];
      next[r] = { ...next[r], heaven: !next[r].heaven };
      return next;
    });
    if (isChallenge) setInteractions(i => i + 1);
    playClick();
  };

  const toggleEarth = (r: number, b: number) => {
    setBeads((prev) => {
      const next = [...prev];
      const currentEarth = next[r].earth;
      next[r] = { ...next[r], earth: b < currentEarth ? b : b + 1 };
      return next;
    });
    if (isChallenge) setInteractions(i => i + 1);
    playClick();
  };

  const resetSoroban = () => {
    setBeads(Array.from({ length: RODS }, () => ({ heaven: false, earth: 0 })));
    setIsChallenge(false);
    setShowSuccess(false);
    playClick();
  };

  return (
    <div className="flex flex-col xl:flex-row w-full gap-4 xl:gap-8 justify-center items-stretch" style={{ fontFamily: "var(--font-mono)" }}>
      
      {/* ════════ LEFT: HUD ════════ */}
      <div className="hidden xl:flex flex-col w-72 shrink-0 border border-white/10 bg-black/40 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl relative">
        <DataStreamHUD value={currentValue} isChallenge={isChallenge} target={targetValue} />
      </div>

      {/* ════════ CENTER: SOROBAN ════════ */}
      <div 
        ref={containerRef} 
        className="relative flex-1 w-full max-w-4xl bg-[#090809] border border-white/10 rounded-xl p-2 sm:p-4 flex flex-col gap-2 min-h-[400px] sm:min-h-[500px]"
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)" }}
      >
        {/* Top Controls: Audio & Challenge */}
        <div className="flex justify-between items-center px-2 mb-2">
          <button 
            onClick={() => setIsChallenge(true)}
            className="flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-widest text-[#00F5FF] hover:bg-[#00F5FF]/10 px-3 py-1.5 rounded transition-colors"
          >
            <Trophy className="w-3.5 h-3.5" />
            {isChallenge ? "Desafio Ativo" : "Speedrun Mode"}
          </button>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-gray-500 hover:text-white transition-colors p-2"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {/* LCD DISPLAY */}
        <div className="w-full bg-gradient-to-b from-[#001414]/70 to-[#000a0a]/90 border border-[#00F5FF]/10 border-t-[#00F5FF]/20 rounded p-2 sm:p-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,245,255,0.04),transparent_70%)] pointer-events-none" />
          <p className="text-[7px] tracking-[3px] text-[#00F5FF]/30 mb-1 uppercase">
            {isChallenge ? "TARGET VALUE" : "DECIMAL OUTPUT"}
          </p>
          <motion.div 
            key={isChallenge ? targetValue : currentValue}
            initial={{ opacity: 0, filter: "brightness(2)" }}
            animate={{ opacity: 1, filter: "brightness(1)" }}
            className={`font-medium text-3xl sm:text-5xl text-[#00F5FF] tracking-[4px] sm:tracking-[8px] leading-tight drop-shadow-[0_0_15px_rgba(0,245,255,0.6)] ${isChallenge && !targetValue ? 'animate-pulse' : ''}`}
          >
            {isChallenge 
              ? (targetValue ?? "---") 
              : currentValue.toString().padStart(RODS, '0')
            }
          </motion.div>

          {/* Gamification Timer */}
          {isChallenge && (
            <div className="absolute top-2 right-4 text-[10px] text-[#00F5FF]/70 tracking-widest">
              {(elapsedTime / 1000).toFixed(1)}s
            </div>
          )}
        </div>

        {/* RECKONING FRAME */}
        <div className="relative flex-1 w-full bg-[#090809] border border-white/5 rounded mt-2 pb-2 px-1 flex flex-col justify-end">
          <button onClick={resetSoroban} className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-[#222] border border-white/10 text-[8px] uppercase tracking-widest px-2 py-1 rounded text-white/30 hover:text-[#00F5FF] transition-all">
            <RotateCcw className="w-3 h-3 inline mr-1" />
            Reset
          </button>

          {/* Rods Area */}
          <div className="flex justify-around w-full relative z-0 h-full mt-8">
            {/* Reckoning Bar Line */}
            <div className="absolute left-0 right-0 h-1 sm:h-1.5 z-20 bg-gradient-to-b from-[#333] via-[#222] to-[#1a1a1a] border-t border-white/10 border-b border-black/50 shadow-[0_0_15px_rgba(0,245,255,0.08)]" style={{ top: layout.heavenH + 'px' }} />

            {beads.map((rod, r) => (
              <div key={r} className="relative flex flex-col items-center flex-1 h-full">
                {/* Rod pole */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 sm:w-1 bg-gradient-to-b from-[#2a2a2a] via-[#1a1a1a] to-[#2a2a2a] rounded-sm shadow-[inset_0_0_2px_rgba(0,0,0,0.8)] z-0" />
                
                {/* Heaven Area */}
                <div className="relative w-full z-10" style={{ height: layout.heavenH }}>
                  <Bead 
                    active={rod.heaven} 
                    onClick={() => toggleHeaven(r)}
                    layout={layout}
                    isHeaven
                  />
                </div>

                {/* Earth Area */}
                <div className="relative w-full z-10 mt-1 sm:mt-1.5" style={{ height: layout.earthH }}>
                  {[0, 1, 2, 3].map((b) => (
                    <Bead
                      key={b}
                      active={b < rod.earth}
                      index={b}
                      onClick={() => toggleEarth(r, b)}
                      layout={layout}
                      isHeaven={false}
                      activeCount={rod.earth}
                    />
                  ))}
                </div>

                {/* Label */}
                <div className="absolute -bottom-6 text-[8px] sm:text-[10px] text-white/30 tracking-widest">{LABELS[r]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SUCCESS MODAL OVERLAY */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center rounded-xl border border-[#00F5FF]/50"
            >
              <Trophy className="w-16 h-16 text-[#00F5FF] mb-4 drop-shadow-[0_0_20px_rgba(0,245,255,0.8)]" />
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">ALVO ATINGIDO</h2>
              <div className="flex gap-8 mt-6">
                <div className="text-center">
                  <p className="text-[10px] text-[#00F5FF]/50 uppercase tracking-widest mb-1">Tempo</p>
                  <p className="text-2xl font-bold text-white">{(elapsedTime / 1000).toFixed(2)}s</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-[#00F5FF]/50 uppercase tracking-widest mb-1">APM</p>
                  <p className="text-2xl font-bold text-white">{Math.round((interactions / (elapsedTime / 1000)) * 60)}</p>
                </div>
              </div>
              <button 
                onClick={resetSoroban}
                className="mt-10 px-8 py-3 bg-[#00F5FF]/10 hover:bg-[#00F5FF]/20 text-[#00F5FF] border border-[#00F5FF]/30 rounded uppercase tracking-widest text-xs transition-all"
              >
                Continuar
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ════════ MOBILE HUD ════════ */}
      <div className="flex xl:hidden w-full border border-white/10 bg-black/40 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl relative mt-4">
         <DataStreamHUD value={currentValue} isChallenge={isChallenge} target={targetValue} />
      </div>

    </div>
  );
}

/* ═══════════════════════════════════════════════════
   BEAD COMPONENT
   ═══════════════════════════════════════════════════ */
function Bead({ active, onClick, layout, isHeaven, index = 0, activeCount = 0 }: any) {
  const { beadW, beadH, beadGap, heavenH, earthH } = layout;
  
  // Calculate vertical position
  let top = 0;
  if (isHeaven) {
    top = active ? (heavenH - beadH - 2) : 4;
  } else {
    if (active) {
      // Stack from top (against bar)
      top = 2 + index * (beadH + beadGap);
    } else {
      // Stack from bottom
      const inactiveCount = 4 - activeCount;
      const idx = index - activeCount;
      const totalInactiveH = inactiveCount * beadH + (inactiveCount - 1) * beadGap;
      const startBottom = earthH - totalInactiveH - 2;
      top = startBottom + idx * (beadH + beadGap);
    }
  }

  return (
    <div
      onClick={onClick}
      className={`absolute left-1/2 -translate-x-1/2 cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.22,1.4,0.36,1)] ${active ? 'z-20' : 'z-10'}`}
      style={{
        width: beadW,
        height: beadH,
        top: top,
        clipPath: "polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)",
        background: active 
          ? "radial-gradient(ellipse at 50% 50%, rgba(0,245,255,0.4), transparent 70%), linear-gradient(180deg, #00E5EE 0%, #00CED1 40%, #008B8B 100%)"
          : "radial-gradient(ellipse at 40% 30%, rgba(255,255,255,0.08), transparent 60%), linear-gradient(180deg, #444 0%, #2a2a2a 45%, #1f1f1f 100%)",
        boxShadow: active ? "0 0 15px rgba(0,245,255,0.4)" : "none",
        filter: active ? "drop-shadow(0 0 6px rgba(0,245,255,0.7)) brightness(1.1)" : "drop-shadow(0 2px 3px rgba(0,0,0,0.7))"
      }}
    >
      {/* Inner Bevel */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          clipPath: "polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 40%, rgba(0,0,0,0.2) 100%)"
        }}
      />
      {/* Center ridge */}
      <div 
        className="absolute top-[35%] left-[12%] right-[12%] h-[30%] pointer-events-none"
        style={{
          clipPath: "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)",
          background: active ? "rgba(0,245,255,0.15)" : "rgba(0,0,0,0.2)"
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   DATA STREAM HUD COMPONENT
   ═══════════════════════════════════════════════════ */
function DataStreamHUD({ value, isChallenge, target }: { value: number, isChallenge: boolean, target: number | null }) {
  const binary = value.toString(2).padStart(32, '0');
  const hex = "0x" + value.toString(16).toUpperCase().padStart(8, '0');
  
  // Format binary into chunks of 8
  const binFormatted = binary.match(/.{1,8}/g)?.join(' ') || binary;

  return (
    <div className="w-full h-full p-4 flex flex-col gap-6 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00F5FF]/30 to-transparent" />
      
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <Terminal className="w-4 h-4 text-[#00F5FF]/50" />
        <h3 className="text-xs uppercase tracking-[3px] text-white/50 font-bold">Data Stream</h3>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <p className="text-[9px] uppercase tracking-widest text-[#00F5FF]/40 mb-2">[BIN] BASE_2_CONV</p>
          <motion.div
            key={`bin-${value}`}
            initial={{ opacity: 0.3, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs text-white/80 font-medium tracking-widest break-words"
          >
            {binFormatted}
          </motion.div>
        </div>

        <div>
          <p className="text-[9px] uppercase tracking-widest text-[#00F5FF]/40 mb-2">[HEX] BASE_16_CONV</p>
          <motion.div
            key={`hex-${value}`}
            initial={{ opacity: 0.3, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm text-[#00F5FF] font-bold tracking-[4px]"
          >
            {hex}
          </motion.div>
        </div>

        {/* STATUS PANEL */}
        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-3 h-3 text-[#00F5FF]/50" />
            <p className="text-[9px] uppercase tracking-widest text-white/40">Status do Motor</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-500">GAMIFICATION</span>
            <span className={`text-[10px] tracking-widest uppercase ${isChallenge ? 'text-green-400' : 'text-yellow-500/70'}`}>
              {isChallenge ? "ACTIVE" : "STANDBY"}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-gray-500">SYNC RATE</span>
            <span className="text-[10px] tracking-widest uppercase text-[#00F5FF]/70">1000 HZ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
