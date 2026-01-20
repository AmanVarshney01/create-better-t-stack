import { createFileRoute } from "@tanstack/react-router";

import Footer from "@/components/home/footer";
import HeroSection from "@/components/home/hero-section";
import SponsorSection from "@/components/home/sponsor-section";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="container mx-auto min-h-svh px-6">
      <HeroSection />
      <SponsorSection />
      <Footer />
    </main>
  );
}
