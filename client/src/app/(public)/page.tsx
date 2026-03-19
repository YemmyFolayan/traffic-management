import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { MotivationSection } from "@/components/landing/motivation-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { MethodologySection } from "@/components/landing/methodology-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { StatsSection } from "@/components/landing/stats-section";
import { ResearchersSection } from "@/components/landing/researchers-section";
import { TechStackSection } from "@/components/landing/tech-stack-section";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <MotivationSection />
      <FeaturesSection />
      <MethodologySection />
      <HowItWorks />
      <StatsSection />
      <ResearchersSection />
      <TechStackSection />
      <Footer />
    </main>
  );
}
