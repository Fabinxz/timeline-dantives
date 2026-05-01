"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Calculator,
  Brain,
  Cpu,
  Cog,
  Coins,
  GraduationCap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ═══════════════════════════════════════════════════
   CARD DATA
   ═══════════════════════════════════════════════════ */
interface BentoCard {
  id: number;
  icon: LucideIcon;
  tag: string;
  title: string;
  body: string;
  /** Tailwind grid span classes */
  gridClass: string;
}

const CARDS: BentoCard[] = [
  {
    id: 1,
    icon: Cog,
    tag: "Fundação",
    title: "A Origem Mecânica",
    body: "O ábaco, surgido na Mesopotâmia, é o primeiro instrumento de cálculo mecânico e ancestral direto dos computadores modernos. Facilitava operações rápidas, moldando o desenvolvimento inicial do pensamento lógico-matemático humano.",
    gridClass: "md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    icon: Calculator,
    tag: "Matemática",
    title: "Sistema Decimal Posicional",
    body: "Cada haste representa uma potência de base 10 (unidades, dezenas...). O valor da conta depende de sua posição. É a materialização física da mesma fundação matemática que usamos hoje.",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    id: 3,
    icon: Coins,
    tag: "Economia",
    title: "O Motor do Comércio Antigo",
    body: "Antes das calculadoras, foi a ferramenta vital para o comércio. Transformou o caos das transações primitivas em um sistema organizado, permitindo o controle rápido de mercadorias e impostos.",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    id: 4,
    icon: Brain,
    tag: "Cognição",
    title: "Cálculo Mental (Anzan)",
    body: "A manipulação física exige o uso conjunto da visão e do tato. O operador desenvolve uma memória muscular profunda, permitindo realizar cálculos mentais incrivelmente rápidos, superando até calculadoras eletrônicas.",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    id: 5,
    icon: GraduationCap,
    tag: "Legado",
    title: "Sobrevivência na Sociedade Atual",
    body: "Com a era digital, perdeu seu uso comercial, mas encontrou um novo propósito insubstituível. Hoje funciona como uma poderosa ferramenta educacional e pedagógica para o desenvolvimento cognitivo.",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    id: 6,
    icon: Cpu,
    tag: "Engenharia",
    title: "O Princípio da Computação Discreta",
    body: "A ideia de representar estados numéricos através de posições físicas discretas é o exato princípio das memórias modernas. O ábaco usa contas deslizantes; a CPU usa transistores. Ambas são máquinas de estados construídas para processamento lógico.",
    gridClass: "md:col-span-4 md:row-span-1",
  },
];

/* ═══════════════════════════════════════════════════
   BENTO CARD COMPONENT
   ═══════════════════════════════════════════════════ */
function BentoCardItem({ card, index }: { card: BentoCard; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const Icon = card.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: "easeOut",
      }}
      className={`
        group relative overflow-hidden rounded-xl p-5 sm:p-6
        border border-white/[0.06]
        backdrop-blur-md
        transition-all duration-500
        hover:border-[#00F5FF]/40
        ${card.gridClass}
      `}
      style={{
        background:
          "linear-gradient(135deg, rgba(10,10,10,0.85) 0%, rgba(5,5,5,0.95) 100%)",
      }}
    >
      {/* Corner glow on hover */}
      <div
        className="
          absolute -top-20 -right-20 w-40 h-40
          rounded-full opacity-0
          group-hover:opacity-100
          transition-opacity duration-700
          pointer-events-none
        "
        style={{
          background: "radial-gradient(circle, rgba(0,245,255,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Tag */}
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Icon
          className="w-4 h-4 transition-colors duration-500 text-gray-600 group-hover:text-[#00F5FF]"
          strokeWidth={1.5}
        />
        <span
          className="
            text-[9px] sm:text-[10px] tracking-[3px] uppercase
            text-gray-500 group-hover:text-[#00F5FF]/60
            transition-colors duration-500
          "
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {card.tag}
        </span>
      </div>

      {/* Title */}
      <h3
        className="
          text-base sm:text-lg md:text-xl font-semibold
          text-white/90 mb-2 sm:mb-3 tracking-tight
        "
      >
        {card.title}
      </h3>

      {/* Body */}
      <p
        className="text-xs sm:text-sm leading-relaxed"
        style={{ color: "rgba(180,180,180,0.8)" }}
      >
        {card.body}
      </p>

      {/* Bottom accent line */}
      <div
        className="
          absolute bottom-0 left-6 right-6 h-px
          opacity-0 group-hover:opacity-100
          transition-opacity duration-700
        "
        style={{
          background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.25), transparent)",
        }}
      />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   BENTO GRID COMPONENT
   ═══════════════════════════════════════════════════ */
export default function BentoGrid() {
  return (
    <section
      id="conteudo"
      className="relative w-full px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="mb-6 sm:mb-8"
        >
          <p
            className="text-[10px] sm:text-xs tracking-[5px] uppercase mb-3"
            style={{
              fontFamily: "var(--font-mono)",
              color: "rgba(0,245,255,0.35)",
            }}
          >
            Enriquecimento Teórico
          </p>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white/90"
          >
            Por que o ábaco importa?
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
          {CARDS.map((card, i) => (
            <BentoCardItem key={card.id} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
