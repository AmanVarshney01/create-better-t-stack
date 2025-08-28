import { api } from "@better-t-stack/backend/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import CommandSection from "./_components/command-section";
import Footer from "./_components/footer";
import HeroSection from "./_components/hero-section";
import SponsorsSection from "./_components/sponsors-section";
import StatsSection from "./_components/stats-section";
import Testimonials from "./_components/testimonials";

export default async function HomePage() {
	const preloadedSponsors = await preloadQuery(api.sponsors.getSponsors);
	const preloadedTestimonialsTweet = await preloadQuery(
		api.testimonials.getTweets,
	);
	const preloadedTestimonialsVideos = await preloadQuery(
		api.testimonials.getVideos,
	);

	const minimalAnalytics = await fetch(
		"https://r2.better-t-stack.dev/analytics-minimal.json",
	);

	const minimalAnalyticsData = await minimalAnalytics.json();

	return (
		<div className="mx-auto min-h-svh max-w-[1280px]">
			<main className="mx-auto px-4 pt-12">
				<HeroSection />
				<CommandSection />
				<StatsSection analyticsData={minimalAnalyticsData} />
				<SponsorsSection preloadedSponsors={preloadedSponsors} />
				<Testimonials
					preloadedTestimonialsTweet={preloadedTestimonialsTweet}
					preloadedTestimonialsVideos={preloadedTestimonialsVideos}
				/>
			</main>
			<Footer />
		</div>
	);
}
