import Hero from "@/components/Hero";
import BentoGrid from "@/components/BentoGrid";
import { TimelineSection, SimulatorSection } from "@/components/ComponentSections";
import Timeline from "@/components/Timeline";
import SorobanSimulator from "@/components/SorobanSimulator";

export default function Home() {
  return (
    <main className="min-h-screen pb-20">
      {/* ════════ HERO ════════ */}
      <Hero />

      {/* ════════ TIMELINE_COMPONENT ════════ */}
      <TimelineSection>
        <Timeline />
      </TimelineSection>

      {/* ════════ SOROBAN_SIMULATOR ════════ */}
      <SimulatorSection>
        <SorobanSimulator />
      </SimulatorSection>

      {/* ════════ BENTO GRID — Enriquecimento Teórico ════════ */}
      <BentoGrid />
    </main>
  );
}
