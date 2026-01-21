import { createFileRoute } from "@tanstack/react-router";

import ContributorsSection from "@/components/home/contributors-section";
import FeaturesSection from "@/components/home/features-section";
import Footer from "@/components/home/footer";
import HeroSection from "@/components/home/hero-section";
import SponsorsSection from "@/components/home/sponsors-section";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="min-h-svh">
      {/* Bordered layout container like OpenCode */}
      <div className="mx-auto max-w-5xl border-x border-border">
        <HeroSection />
        <FeaturesSection />
        <SponsorsSection />
        <ContributorsSection />
        <Footer />
      </div>
    </main>
  );
}
