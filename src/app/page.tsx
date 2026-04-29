import Hero from "@/components/Hero";
import BentoGrid from "@/components/BentoGrid";
import { TimelineSection, SimulatorSection } from "@/components/ComponentSections";
import Timeline from "@/components/Timeline";

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
        {/* Soroban will be embedded here — currently served as standalone HTML */}
        <div className="flex items-center justify-center py-4">
          <iframe
            src="/soroban.html"
            title="Simulador de Soroban"
            className="w-full border-0 rounded-lg"
            style={{
              height: "min(80vh, 600px)",
              maxWidth: "960px",
              background: "transparent",
            }}
            loading="lazy"
          />
        </div>
      </SimulatorSection>

      {/* ════════ BENTO GRID — Enriquecimento Teórico ════════ */}
      <BentoGrid />
    </main>
  );
}
