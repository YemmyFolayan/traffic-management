import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { StatsSection } from "@/components/landing/stats-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { TechStackSection } from "@/components/landing/tech-stack-section";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <HowItWorks />
      <TechStackSection />
      <Footer />
    </main>
  );
}
