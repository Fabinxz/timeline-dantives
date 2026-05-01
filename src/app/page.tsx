import Hero from "@/components/Hero";
import BentoGrid from "@/components/BentoGrid";
import { TimelineSection, SimulatorSection } from "@/components/ComponentSections";
import Timeline from "@/components/Timeline";
import Footer from "@/components/Footer";

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
        <div className="flex items-center justify-center py-4 w-full">
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

      {/* ════════ FOOTER ════════ */}
      <Footer />
    </main>
  );
}
