"use client";

import { motion } from "framer-motion";
import { Clock, Calculator } from "lucide-react";

/* ═══════════════════════════════════════════════════
   COMPONENT SECTION — Placeholder container
   ═══════════════════════════════════════════════════ */
interface SectionProps {
  id: string;
  label: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  comment: string;
}

function ComponentSection({
  id,
  label,
  title,
  description,
  icon,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
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
          <div className="flex items-center gap-2 mb-3">
            {icon}
            <p
              className="text-[10px] sm:text-xs tracking-[5px] uppercase"
              style={{
                fontFamily: "var(--font-mono)",
                color: "rgba(0,245,255,0.35)",
              }}
            >
              {label}
            </p>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white/90 mb-3">
            {title}
          </h2>
          <p
            className="text-sm sm:text-base max-w-2xl leading-relaxed"
            style={{ color: "rgba(180,180,180,0.7)" }}
          >
            {description}
          </p>
        </motion.div>

        {/* Component container (Invisible) */}
        <div className="relative w-full">
          {children}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   EXPORTED SECTIONS
   ═══════════════════════════════════════════════════ */

export function TimelineSection({ children }: { children?: React.ReactNode }) {
  return (
    /* <!-- TIMELINE_COMPONENT --> */
    <ComponentSection
      id="timeline"
      label="Linha do Tempo"
      title="Evolução Histórica"
      description="Acompanhe a jornada do ábaco através de milênios — da Mesopotâmia ao Japão moderno."
      icon={<Clock className="w-4 h-4 text-[#00F5FF]/40" strokeWidth={1.5} />}
      comment="TIMELINE_COMPONENT"
    >
      {children}
    </ComponentSection>
  );
}

export function SimulatorSection({ children }: { children?: React.ReactNode }) {
  return (
    /* <!-- SOROBAN_SIMULATOR --> */
    <ComponentSection
      id="simulador"
      label="Simulador Interativo"
      title="Soroban Digital"
      description="Experimente calcular no ábaco japonês — toque nas contas e veja o resultado em tempo real."
      icon={<Calculator className="w-4 h-4 text-[#00F5FF]/40" strokeWidth={1.5} />}
      comment="SOROBAN_SIMULATOR"
    >
      {children}
    </ComponentSection>
  );
}
