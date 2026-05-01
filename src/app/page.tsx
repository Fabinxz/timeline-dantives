import Hero from "@/components/Hero";
import BentoGrid from "@/components/BentoGrid";
import { TimelineSection, SimulatorSection } from "@/components/ComponentSections";
import Timeline from "@/components/Timeline";
import SorobanSimulator from "@/components/SorobanSimulator";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* ════════ HERO ════════ */}
      <Hero />

      {/* ════════ TIMELINE_COMPONENT ════════ */}
      <TimelineSection>
        <Timeline />
      </TimelineSection>

      {/* ════════ SOROBAN_SIMULATOR ════════ */}
      <SimulatorSection>
        <div className="flex items-center justify-center py-4 px-2 w-full">
          <SorobanSimulator />
        </div>
      </SimulatorSection>

      {/* ════════ BENTO GRID — Enriquecimento Teórico ════════ */}
      <BentoGrid />
    </main>
  );
}
