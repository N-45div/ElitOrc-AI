import { Hero } from "@/components/ui/animated-hero";
import { FeaturesSection } from "@/components/ui/features-section";
import { StatsSection } from "@/components/ui/stats-section";
import { Footer } from "@/components/ui/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main>
        <Hero />
        <FeaturesSection />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
}
