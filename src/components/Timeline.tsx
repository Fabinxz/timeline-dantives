"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";

/* ═══════════════════════════════════════════════════
   DATA INTERFACE & CONTENT
   ═══════════════════════════════════════════════════ */
interface TimelineEvent {
  id: number;
  year: string;
  era: string;
  title: string;
  description: string;
  tag?: string;
  image: string;
}

const TIMELINE_DATA: TimelineEvent[] = [
  {
    id: 1,
    year: "2700 a.C.",
    era: "Mesopotâmia",
    title: "Ábaco Mesopotâmico",
    description:
      "Considerado a primeira 'máquina de calcular' da história. Desenvolvido para auxiliar em transações comerciais com pedras movidas sobre sulcos na areia.",
    tag: "Origem",
    image: "/assets/mesopotamico.png",
  },
  {
    id: 2,
    year: "300 a.C.",
    era: "Grécia Antiga",
    title: "Ábaco Grego",
    description:
      "A Tábua de Salamis. O ábaco mais antigo já encontrado fisicamente, comprovando o uso de sistemas de numeração em mármore na antiguidade.",
    tag: "Arqueologia",
    image: "/assets/grego.png",
  },
  {
    id: 3,
    year: "200 a.C.",
    era: "Império Romano",
    title: "Ábaco Romano",
    description:
      "O primeiro dispositivo portátil de cálculo. Feito de bronze com pinos que deslizavam em fendas, essencial para cobradores de impostos.",
    tag: "Portabilidade",
    image: "/assets/romano.png",
  },
  {
    id: 4,
    year: "1200 d.C.",
    era: "China Imperial",
    title: "Ábaco Chinês (Suanpan)",
    description:
      "A versão clássica com hastes. Utiliza uma divisória separando as contas superiores (valendo 5) das inferiores (valendo 1).",
    tag: "Evolução",
    image: "/assets/chines.png",
  },
  {
    id: 5,
    year: "1600 d.C.",
    era: "Japão Feudal",
    title: "Ábaco Japonês (Soroban)",
    description:
      "Derivado do modelo chinês, eliminou contas redundantes, otimizando cálculos para velocidades extremas que exigem alto raciocínio lógico.",
    tag: "Otimização",
    image: "/assets/japones.png",
  },
  {
    id: 6,
    year: "1600 d.C.",
    era: "Rússia Imperial",
    title: "Ábaco Russo (Schoty)",
    description:
      "Único por não ter barra divisória. Usa hastes curvadas com 10 contas por linha, sendo amplamente utilizado no comércio local.",
    tag: "Variação",
    image: "/assets/russo.png",
  },
];

/* ═══════════════════════════════════════════════════
   SPRING ANIMATION CONFIG
   ═══════════════════════════════════════════════════ */
const cardSpring = {
  type: "spring" as const,
  stiffness: 100,
  damping: 18,
  mass: 0.8,
};

/* ═══════════════════════════════════════════════════
   TIMELINE CARD COMPONENT
   ═══════════════════════════════════════════════════ */
interface CardProps {
  event: TimelineEvent;
  index: number;
}

function TimelineCard({ event, index }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.25 });
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className="relative flex items-center w-full"
    >
      {/* ── NODE DOT (Desktop only) ── */}
      <div
        className={`
          hidden md:block absolute z-10
          w-3.5 h-3.5 rounded-full border
          transition-all duration-500
          left-1/2 -translate-x-1/2
          ${isInView
            ? "bg-[#00F5FF] border-[#00F5FF] shadow-[0_0_8px_rgba(0,245,255,0.6),0_0_20px_rgba(0,245,255,0.3)]"
            : "bg-gray-800 border-gray-600"
          }
        `}
      />

      {/* ── NODE DOT (Mobile only) ── */}
      <div
        className={`
          md:hidden absolute z-10
          w-2.5 h-2.5 rounded-full border
          transition-all duration-500
          ${isInView
            ? "bg-[#00F5FF] border-[#00F5FF] shadow-[0_0_6px_rgba(0,245,255,0.6),0_0_14px_rgba(0,245,255,0.3)]"
            : "bg-gray-800 border-gray-600"
          }
        `}
        style={{ left: "11px", top: "50%", transform: "translateY(-50%)" }}
      />

      {/* ── CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={cardSpring}
        className={`
          relative
          w-[calc(100%-2.5rem)] ml-[2.5rem]
          md:w-[calc(50%-40px)] md:ml-0
          ${isLeft ? "md:mr-auto" : "md:ml-auto"}
        `}
      >
        <div
          className={`
            relative rounded-lg overflow-hidden
            backdrop-blur-md
            border transition-all duration-700
            ${isInView ? "border-[#00F5FF]/30" : "border-gray-800"}
            hover:border-[#00F5FF]/40
          `}
          style={{
            backgroundColor: "rgba(12, 12, 12, 0.85)",
            ...(isInView ? {
              boxShadow: "0 0 25px rgba(0,245,255,0.06), inset 0 1px 0 rgba(0,245,255,0.06)",
            } : {
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            }),
          }}
        >
          {/* ── IMAGE CONTAINER ── */}
          <div className="relative w-full aspect-[16/10] overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="object-cover w-full h-full"
              loading="lazy"
            />
            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)",
              }}
            />
            {/* Year badge on image */}
            <div
              className="absolute bottom-2 left-3 sm:bottom-3 sm:left-4"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <span
                className={`
                  text-lg sm:text-xl md:text-2xl font-bold tracking-wide
                  transition-all duration-500
                  ${isInView ? "text-[#00F5FF]" : "text-gray-400"}
                `}
                style={{
                  textShadow: isInView
                    ? "0 0 15px rgba(0,245,255,0.5)"
                    : "none",
                }}
              >
                {event.year}
              </span>
              <span className="ml-2 sm:ml-3 text-[8px] sm:text-[10px] text-gray-400 tracking-widest uppercase">
                {event.era}
              </span>
            </div>
          </div>

          {/* ── CONNECTOR LINE (Desktop) ── */}
          <div
            className="hidden md:block absolute top-1/2 -translate-y-1/2 h-px"
            style={{
              width: "40px",
              ...(isLeft ? { right: "-40px" } : { left: "-40px" }),
              background: isInView
                ? "linear-gradient(90deg, rgba(0,245,255,0.3), rgba(0,245,255,0.05))"
                : "rgba(31,41,55,0.5)",
              transition: "background 0.7s ease",
            }}
          />

          {/* ── CONNECTOR LINE (Mobile) ── */}
          <div
            className="md:hidden absolute top-1/2 -translate-y-1/2 h-px"
            style={{
              width: "2rem",
              left: "-2rem",
              background: isInView ? "rgba(0,245,255,0.3)" : "rgba(31,41,55,0.5)",
              transition: "background 0.7s ease",
            }}
          />

          {/* ── TEXT CONTENT ── */}
          <div className="p-3 pt-2 sm:p-5 sm:pt-3">
            {/* TAG */}
            {event.tag && (
              <span
                className={`
                  inline-block text-[9px] sm:text-[10px] tracking-widest uppercase
                  px-2 py-0.5 rounded mb-2 sm:mb-3
                  transition-colors duration-500
                  ${isInView
                    ? "text-[#00F5FF] bg-[#00F5FF]/10 border border-[#00F5FF]/20"
                    : "text-gray-500 bg-gray-900/50 border border-gray-800"
                  }
                `}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {event.tag}
              </span>
            )}

            {/* TITLE */}
            <h4 className="text-sm sm:text-base md:text-lg font-semibold text-white/90 mb-1 sm:mb-2 tracking-tight">
              {event.title}
            </h4>

            {/* DESCRIPTION */}
            <p
              className="text-xs sm:text-sm leading-relaxed"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "rgba(224, 224, 224, 0.8)",
              }}
            >
              {event.description}
            </p>
          </div>

          {/* SUBTLE BOTTOM ACCENT */}
          <div
            className="absolute bottom-0 left-4 right-4 h-px transition-opacity duration-700"
            style={{
              opacity: isInView ? 1 : 0,
              background:
                "linear-gradient(90deg, transparent, rgba(0,245,255,0.2), transparent)",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN TIMELINE COMPONENT
   ═══════════════════════════════════════════════════ */
export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001,
  });

  const dotTop = useTransform(smoothProgress, [0, 1], ["2%", "98%"]);

  return (
    <section
      ref={containerRef}
      className="relative w-full px-3 sm:px-4 md:px-8 pb-0"
    >
      {/* ════════ TIMELINE SPINE ════════ */}
      <div className="relative max-w-4xl mx-auto">
        {/* Responsive overrides for desktop centering */}
        <style>{`
          @media (min-width: 768px) {
            .tl-spine { left: 50% !important; transform: translateX(-50%); }
            .tl-dot { left: 50% !important; transform: translateX(-50%) !important; }
          }
        `}</style>

        {/* CENTRAL LINE — Mobile: left-aligned, Desktop: centered */}
        <div
          className="absolute top-0 bottom-0 timeline-line tl-spine bg-gray-800 w-[2px]"
          style={{ left: "12px" }}
        />

        {/* SCROLL-TRACKING GLOW DOT */}
        <motion.div
          className="absolute z-20 neon-dot w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full tl-dot"
          style={{
            top: dotTop,
            left: "12px",
            transform: "translateX(-50%)",
            background: "#00F5FF",
          }}
        />

        {/* ════════ EVENTS ════════ */}
        <div className="relative flex flex-col gap-8 sm:gap-14 md:gap-20">
          {TIMELINE_DATA.map((event, index) => (
            <TimelineCard key={event.id} event={event} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
