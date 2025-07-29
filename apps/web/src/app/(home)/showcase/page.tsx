"use client";

import { Terminal } from "lucide-react";
import Footer from "../_components/footer";
import ShowcaseItem from "./_components/ShowcaseItem";

const showcaseProjects = [
	{
		title: "DocSurf",
		description:
			"AI-powered writing platform with smart text suggestions, real-time autocomplete, and document management",
		imageUrl: "https://docsurf.ai/opengraph.jpg",
		liveUrl: "https://docsurf.ai/?ref=better-t-etter-t-stack",
		tags: [
			"TanStack Start",
			"Convex",
			"Better Auth",
			"Biome",
			"Husky",
			"Turborepo",
			"pnpm",
		],
	},
	{
		title: "Look Crafted",
		description: "✨ Transform Your Selfies into Stunning Headshots with AI",
		imageUrl: "https://www.lookcrafted.com/opengraph-image.png",
		liveUrl: "http://lookcrafted.com",
		tags: [
			"oRPC",
			"Next.js",
			"Hono",
			"Bun",
			"Neon",
			"Drizzle",
			"Better Auth",
			"Biome",
			"Husky",
			"Turborepo",
		],
	},
	{
		title: "Screenshothis",
		description: "Your All-in-One Screenshot Solution",
		imageUrl:
			"https://api.screenshothis.com/v1/screenshots/take?api_key=ss_live_NQJgRXqHcKPwnoMTuQmgiwLIGbVfihjpMyQhgsaMyNBHTyesvrxpYNXmdgcnxipc&url=https%3A%2F%2Fscreenshothis.com%2F&width=1200&height=630&device_scale_factor=0.75&block_ads=true&block_cookie_banners=true&block_trackers=true&prefers_color_scheme=light&prefers_reduced_motion=reduce&is_cached=true&cache_key=cfb06bf3616b1d03bdf455628a3830120e2080dd",
		liveUrl:
			"https://screenshothis.com?utm_source=better-t-stack&utm_medium=showcase&utm_campaign=referer",
		tags: [
			"oRPC",
			"TanStack Start (vite)",
			"Hono",
			"pnpm",
			"PostgreSQL",
			"Drizzle",
			"Better Auth",
			"Biome",
			"Husky",
			"Turborepo",
		],
	},
	{
		title: "gl1.chat",
		description:
			"An ai platform focused on speed, reliability and advanced workflows powered by trpc, drizzle, vite, elysia, tanstack router",
		imageUrl: "https://gl1.chat/social-share-image.png",
		liveUrl: "https://gl1.chat/?ref=better-t-stack",
		tags: ["tRPC", "Drizzle", "Elysia", "Vite", "TanStack Router"],
	},
	{
		title: "Transmogged",
		description:
			"Turn your video game characters into different styles worth showing off. Create profile pictures that impress you and your friends.",
		imageUrl: "https://images.transmogged.com/transmogged-home.png",
		liveUrl: "https://transmogged.com",
		tags: [
			"TanStack Router",
			"Better Auth",
			"Biome",
			"bun",
			"PostgreSQL",
			"Drizzle",
			"tRPC",
			"Hono",
		],
	},
];

export default function ShowcasePage() {
	return (
		<main className="mx-auto min-h-svh max-w-[1280px]">
			<div className="container mx-auto space-y-8 px-4 py-8 pt-16">
				<div className="mb-8">
					<div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
						<div className="flex items-center gap-2">
							<Terminal className="h-4 w-4 text-primary" />
							<span className="font-bold text-lg sm:text-xl">
								PROJECT_SHOWCASE.SH
							</span>
						</div>
						<div className="h-px flex-1 bg-border" />
						<span className=" text-muted-foreground text-xs">
							[{showcaseProjects.length} PROJECTS FOUND]
						</span>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
					{showcaseProjects.map((project, index) => (
						<ShowcaseItem key={project.title} {...project} index={index} />
					))}
				</div>

				<div className="mt-8">
					<div className="rounded border border-border p-4">
						<div className="flex items-center gap-2 text-sm">
							<span className="text-primary">$</span>
							<span className=" text-muted-foreground">
								Want to showcase your project? Submit via GitHub issues
							</span>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</main>
	);
}
