import { api } from "@better-t-stack/backend/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import type { Metadata } from "next";
import { AnalyticsClient } from "./analytics-client";

export const metadata: Metadata = {
	title: "Analytics - Better-T-Stack",
	description: "Project creation analytics for Better-T-Stack.",
	openGraph: {
		title: "Analytics - Better-T-Stack",
		description: "Project creation analytics for Better-T-Stack.",
		url: "https://better-t-stack.dev/analytics",
		images: [
			{
				url: "https://r2.better-t-stack.dev/og.png",
				width: 1200,
				height: 630,
				alt: "Better-T-Stack Analytics",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Analytics - Better-T-Stack",
		description: "Project creation analytics for Better-T-Stack.",
		images: ["https://r2.better-t-stack.dev/og.png"],
	},
};

export default async function Analytics() {
	const [preloadedStats, preloadedDailyStats] = await Promise.all([
		preloadQuery(api.analytics.getStats, {}),
		preloadQuery(api.analytics.getDailyStats, {}),
	]);
	return (
		<AnalyticsClient
			preloadedStats={preloadedStats}
			preloadedDailyStats={preloadedDailyStats}
		/>
	);
}
