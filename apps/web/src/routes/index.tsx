import { api } from "@better-t-stack/backend/convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";

import CommandSection from "@/components/home/command-section";
import Footer from "@/components/home/footer";
import HeroSection from "@/components/home/hero-section";
import SponsorsSection from "@/components/home/sponsors-section";
import StatsSection from "@/components/home/stats-section";
import Testimonials from "@/components/home/testimonials";
import { isConvexConfigured } from "@/lib/convex";
import { fetchSponsors } from "@/lib/sponsors";

export const Route = createFileRoute("/")({
  loader: async () => {
    const sponsorsData = await fetchSponsors();
    return { sponsorsData };
  },
  component: HomePage,
});

function HomePageContent() {
  const { sponsorsData } = Route.useLoaderData();

  // Use Convex React hooks for real-time data
  const fetchedTweets = useQuery(api.testimonials.getTweets);
  const fetchedVideos = useQuery(api.testimonials.getVideos);

  const videos = (fetchedVideos ?? []).map((v) => ({
    embedId: v.embedId,
    title: v.title,
  }));
  const tweets = (fetchedTweets ?? []).map((t) => ({ tweetId: t.tweetId }));

  return (
    <main className="container mx-auto min-h-svh">
      <div className="mx-auto flex flex-col gap-8 px-4 pt-12">
        <HeroSection />
        <CommandSection />
        <StatsSection />
        <SponsorsSection sponsorsData={sponsorsData} />
        <Testimonials tweets={tweets} videos={videos} />
      </div>
      <Footer />
    </main>
  );
}

function HomePageWithoutConvex() {
  const { sponsorsData } = Route.useLoaderData();

  return (
    <main className="container mx-auto min-h-svh">
      <div className="mx-auto flex flex-col gap-8 px-4 pt-12">
        <HeroSection />
        <CommandSection />
        <SponsorsSection sponsorsData={sponsorsData} />
        <Testimonials tweets={[]} videos={[]} />
      </div>
      <Footer />
    </main>
  );
}

function HomePage() {
  if (!isConvexConfigured) {
    return <HomePageWithoutConvex />;
  }
  return <HomePageContent />;
}
