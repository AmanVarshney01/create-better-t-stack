"use client";

import { FolderOpen, Terminal } from "lucide-react";
import Navbar from "../_components/navbar";
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
];

export default function ShowcasePage() {
	return (
		<>
			<Navbar />
			<main className="flex min-h-svh flex-col items-center bg-background px-4 pt-24 pb-10 sm:px-6 md:px-8 md:pt-28 lg:pt-32">
				<div className="mx-auto w-full max-w-6xl">
					<div className="mb-8">
						<div className="mb-6 flex items-center gap-2">
							<Terminal className="h-4 w-4 text-primary" />
							<span className="font-bold font-mono text-lg">
								PROJECT_SHOWCASE.EXE
							</span>
							<div className="h-px flex-1 bg-border" />
							<span className="font-mono text-muted-foreground text-xs">
								[{showcaseProjects.length} PROJECTS FOUND]
							</span>
						</div>

						<div className="terminal-block-hover mb-8 rounded border border-border bg-muted/20 p-4">
							<div className="flex items-center gap-2 text-sm">
								<span className="text-primary">$</span>
								<span className="font-mono text-foreground">
									user@dev-machine:~/showcase$ ls -la
								</span>
							</div>
							<div className="mt-2 flex items-center gap-2 text-sm">
								<span className="text-primary">$</span>
								<span className="font-mono text-muted-foreground">
									# Discover amazing projects built with Better-T-Stack
								</span>
							</div>
							<div className="mt-2 flex items-center gap-2 text-sm">
								<span className="text-primary">$</span>
								<span className="font-mono text-muted-foreground">
									# Real-world implementations showcasing stack capabilities
								</span>
							</div>
						</div>

						<div className="terminal-block-hover rounded border border-border bg-background p-3">
							<div className="flex items-center gap-2 font-mono text-sm">
								<FolderOpen className="h-4 w-4 text-blue-400" />
								<span className="text-foreground">/showcase/projects/</span>
								<div className="ml-auto text-muted-foreground text-xs">
									drwxr-xr-x {showcaseProjects.length} items
								</div>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
						{showcaseProjects.map((project, index) => (
							<ShowcaseItem key={project.title} {...project} index={index} />
						))}
					</div>

					<div className="mt-8">
						<div className="terminal-block-hover rounded border border-border bg-muted/20 p-4">
							<div className="flex items-center gap-2 text-sm">
								<span className="text-primary">$</span>
								<span className="font-mono text-muted-foreground">
									# Want to showcase your project? Submit via GitHub issues
								</span>
							</div>
							<div className="mt-2 flex items-center gap-2 text-sm">
								<span className="text-primary">$</span>
								<span className="font-mono text-foreground">
									echo &quot;Built something amazing? We&apos;d love to feature
									it!&quot;
								</span>
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
