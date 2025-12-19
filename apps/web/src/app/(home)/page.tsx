export const dynamic = "force-static";

import { api } from "@better-t-stack/backend/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { fetchSponsors } from "@/lib/sponsors";
import CommandSection from "./_components/command-section";
import Footer from "./_components/footer";
import HeroSection from "./_components/hero-section";
import SponsorsSection from "./_components/sponsors-section";
import StatsSection from "./_components/stats-section";
import Testimonials from "./_components/testimonials";

export default async function HomePage() {
  const sponsorsData = await fetchSponsors();
  const fetchedTweets = await fetchQuery(api.testimonials.getTweets);
  const fetchedVideos = await fetchQuery(api.testimonials.getVideos);
  const videos = fetchedVideos.map((v) => ({
    embedId: v.embedId,
    title: v.title,
  }));
  const tweets = fetchedTweets.map((t) => ({ tweetId: t.tweetId }));

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
