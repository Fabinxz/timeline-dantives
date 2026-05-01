"use client";

import { useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { X, Maximize2 } from "lucide-react";

/* ═══════════════════════════════════════════════════
   DATA INTERFACE & CONTENT
   ═══════════════════════════════════════════════════ */
interface TimelineEvent {
  id: number;
  year: string;
  era: string;
  title: string;
  description: string;
  detailedContent: string;
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
    detailedContent:
      "O ábaco mesopotâmico não possuía hastes ou contas furadas. Tratava-se de uma tábua coberta com areia fina ou pó (do grego 'abax', que significa superfície plana), onde eram desenhadas linhas. Pedrinhas (cálculos, origem da palavra 'calcular') eram movidas sobre essas linhas para representar diferentes potências de 10 ou 60, visto que utilizavam um sistema sexagesimal. Foi um salto cognitivo fundamental: externalizar a memória matemática para um meio físico.",
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
    detailedContent:
      "Descoberta na ilha de Salamina, esta enorme placa de mármore branco possui linhas gravadas e símbolos gregos representando valores monetários (talentos, dracmas, óbolos). Os operadores usavam contadores físicos posicionados nas linhas. O interessante da Tábua de Salamis é que ela prova matematicamente que os gregos usavam conceitos de valor posicional muito antes da adoção do zero arábico.",
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
    detailedContent:
      "Uma verdadeira maravilha da micro-engenharia antiga. O ábaco manual romano era uma placa de bronze contendo fendas verticais onde pequenos botões esféricos podiam deslizar. Ele já utilizava o sistema bi-quinário (semelhante ao ábaco moderno), com uma fenda inferior contendo 4 pinos (valendo 1 cada) e uma fenda superior contendo 1 pino (valendo 5). Isso permitia aos engenheiros e comerciantes romanos realizar cálculos rápidos em qualquer lugar do Império.",
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
    detailedContent:
      "O Suanpan popularizou o ábaco em hastes que conhecemos hoje. Ele possui 2 contas na parte superior (Céu) valendo 5 cada, e 5 contas na parte inferior (Terra) valendo 1 cada. Essa redundância (podendo representar o número 15 em uma única haste de várias formas) permitia algoritmos específicos e era útil para contagens hexadecimais de peso usadas na China. A velocidade dos operadores de Suanpan era lendária nas rotas comerciais asiáticas.",
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
    detailedContent:
      "Quando o Suanpan chegou ao Japão, os matemáticos japoneses perceberam que as contas extras eram desnecessárias para o sistema decimal puro. Eles removeram uma conta do Céu e uma da Terra, criando o formato 1/4. Essa remoção de redundância transformou o Soroban em uma máquina de estado perfeito: cada número de 0 a 9 só tem UMA representação física possível. Isso forçou a mente humana a se adaptar, originando o método de cálculo mental 'Anzan', onde operadores visualizam o ábaco no cérebro e calculam mais rápido que uma calculadora eletrônica.",
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
    detailedContent:
      "Diferente da linhagem Sino-Japonesa, o Schoty não usa valor bi-quinário (contas que valem 5). Cada haste possui 10 contas, e para representar um número, desliza-se a quantidade de contas da direita para a esquerda. Para facilitar a contagem visual, a 5ª e 6ª conta de cada haste geralmente possuem uma cor diferente (escura). O Schoty foi ensinado em todas as escolas soviéticas até o início da década de 1990.",
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
  onClick: () => void;
}

function TimelineCard({ event, index, onClick }: CardProps) {
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
        layoutId={`card-${event.id}`}
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
          onClick={onClick}
          className={`
            group relative rounded-lg overflow-hidden
            backdrop-blur-md cursor-pointer
            border transition-all duration-700
            ${isInView ? "border-[#00F5FF]/30" : "border-gray-800"}
            hover:border-[#00F5FF]/60 hover:shadow-[0_0_30px_rgba(0,245,255,0.15)]
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
          <motion.div layoutId={`image-${event.id}`} className="relative w-full aspect-[16/10] overflow-hidden">
            
            {/* HOVER EXPAND HINT */}
            <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/20 text-[#00F5FF]">
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="text-[10px] tracking-widest uppercase font-semibold">Expandir</span>
              </div>
            </div>

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
              <motion.span
                layoutId={`year-${event.id}`}
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
              </motion.span>
              <motion.span layoutId={`era-${event.id}`} className="ml-2 sm:ml-3 text-[8px] sm:text-[10px] text-gray-400 tracking-widest uppercase">
                {event.era}
              </motion.span>
            </div>
          </motion.div>

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
            <motion.h4 layoutId={`title-${event.id}`} className="text-sm sm:text-base md:text-lg font-semibold text-white/90 mb-1 sm:mb-2 tracking-tight">
              {event.title}
            </motion.h4>

            {/* DESCRIPTION */}
            <motion.p
              layoutId={`desc-${event.id}`}
              className="text-xs sm:text-sm leading-relaxed"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "rgba(224, 224, 224, 0.8)",
              }}
            >
              {event.description}
            </motion.p>
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
  const [selectedId, setSelectedId] = useState<number | null>(null);

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
            <TimelineCard key={event.id} event={event} index={index} onClick={() => setSelectedId(event.id)} />
          ))}
        </div>
      </div>

      {/* ════════ EXPANDED MODAL ════════ */}
      <AnimatePresence>
        {selectedId && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              {TIMELINE_DATA.filter((e) => e.id === selectedId).map((event) => (
                <motion.div
                  key={event.id}
                  layoutId={`card-${event.id}`}
                  className="relative w-full max-w-2xl bg-[#090909] rounded-xl overflow-hidden border border-[#00F5FF]/30 shadow-[0_0_50px_rgba(0,245,255,0.1)] pointer-events-auto flex flex-col max-h-[90vh]"
                >
                  <button
                    onClick={() => setSelectedId(null)}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-[#00F5FF]/20 border border-white/10 hover:border-[#00F5FF]/50 text-white/70 hover:text-[#00F5FF] transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <motion.div layoutId={`image-${event.id}`} className="relative w-full h-48 sm:h-64 shrink-0">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-6" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      <motion.span layoutId={`year-${event.id}`} className="text-2xl sm:text-3xl font-bold text-[#00F5FF] drop-shadow-[0_0_15px_rgba(0,245,255,0.5)]">
                        {event.year}
                      </motion.span>
                      <motion.span layoutId={`era-${event.id}`} className="ml-3 text-xs text-gray-400 tracking-widest uppercase">
                        {event.era}
                      </motion.span>
                    </div>
                  </motion.div>

                  <div className="p-6 sm:p-8 overflow-y-auto">
                    <motion.h3 layoutId={`title-${event.id}`} className="text-2xl sm:text-3xl font-bold text-white/90 mb-4">
                      {event.title}
                    </motion.h3>
                    <motion.p layoutId={`desc-${event.id}`} className="text-sm sm:text-base text-[#00F5FF]/70 mb-6 font-medium">
                      {event.description}
                    </motion.p>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-gray-300 leading-relaxed text-sm sm:text-base space-y-4 border-t border-white/10 pt-6"
                    >
                      <p>{event.detailedContent}</p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
