"use client";

import { FolderOpen, Terminal } from "lucide-react";
import { motion } from "motion/react";
import Navbar from "../_components/navbar";
import ShowcaseItem from "./_components/ShowcaseItem";

const showcaseProjects = [
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
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				ease: "easeOut",
			},
		},
	};

	return (
		<>
			<Navbar />
			<main className="flex min-h-svh flex-col items-center bg-background px-4 pt-24 pb-10 sm:px-6 md:px-8 md:pt-28 lg:pt-32">
				<motion.div
					className="mx-auto w-full max-w-6xl"
					initial="hidden"
					animate="visible"
					variants={containerVariants}
				>
					<motion.div className="mb-8" variants={itemVariants}>
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
					</motion.div>

					<motion.div
						className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
						variants={containerVariants}
					>
						{showcaseProjects.map((project, index) => (
							<ShowcaseItem key={project.title} {...project} index={index} />
						))}
					</motion.div>

					<motion.div className="mt-8" variants={itemVariants}>
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
					</motion.div>
				</motion.div>
			</main>
		</>
	);
}
