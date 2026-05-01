import Hero from "@/components/Hero";
import BentoGrid from "@/components/BentoGrid";
import { TimelineSection, SimulatorSection, VideoSection } from "@/components/ComponentSections";
import Timeline from "@/components/Timeline";
import SorobanSimulator from "@/components/SorobanSimulator";
import VideoExhibition from "@/components/VideoExhibition";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen pb-20">
      {/* HERO */}
      <Hero />

      {/* TIMELINE_COMPONENT */}
      <TimelineSection>
        <Timeline />
      </TimelineSection>

      {/* SOROBAN_SIMULATOR */}
      <SimulatorSection>
        <SorobanSimulator />
      </SimulatorSection>

      {/* VIDEO_EXHIBITION */}
      <VideoSection>
        <VideoExhibition />
      </VideoSection>

      {/* BENTO GRID */}
      <BentoGrid />

      {/* FOOTER */}
      <Footer />
    </main>
  );
}
