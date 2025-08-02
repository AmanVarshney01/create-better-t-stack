"use client";
import { api } from "@better-t-stack/backend/convex/_generated/api";
import { useNpmDownloadCounter } from "@erquhart/convex-oss-stats/react";
import NumberFlow, { continuous } from "@number-flow/react";
import { useQuery } from "convex/react";
import {
	BarChart3,
	Check,
	ChevronRight,
	Copy,
	Github,
	Package,
	Star,
	Terminal,
	TrendingUp,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Footer from "./_components/footer";
import PackageIcon from "./_components/icons";
import NpmPackage from "./_components/npm-package";
import SponsorsSection from "./_components/sponsors-section";
import Testimonials from "./_components/testimonials";

export default function HomePage() {
	const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
	const [selectedPM, setSelectedPM] = useState<"npm" | "pnpm" | "bun">("bun");

	const commands = {
		npm: "npx create-better-t-stack@latest",
		pnpm: "pnpm create better-t-stack@latest",
		bun: "bun create better-t-stack@latest",
	};

	const copyCommand = (command: string, packageManager: string) => {
		navigator.clipboard.writeText(command);
		setCopiedCommand(packageManager);
		setTimeout(() => setCopiedCommand(null), 2000);
	};

	const githubRepo = useQuery(api.stats.getGithubRepo, {
		name: "AmanVarshney01/create-better-t-stack",
	});
	const npmPackages = useQuery(api.stats.getNpmPackages, {
		names: ["create-better-t-stack"],
	});

	const liveNpmDownloadCount = useNpmDownloadCounter(npmPackages);

	return (
		<div className="mx-auto min-h-svh max-w-[1280px]">
			<main className="mx-auto px-4 pt-12">
				<div className="mb-8 flex items-center justify-center">
					<div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6">
						<pre className="ascii-art text-primary text-xs leading-tight sm:text-sm">
							{`
██████╗  ██████╗ ██╗     ██╗
██╔══██╗██╔═══██╗██║     ██║
██████╔╝██║   ██║██║     ██║
██╔══██╗██║   ██║██║     ██║
██║  ██║╚██████╔╝███████╗███████╗
╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝`}
						</pre>

						<pre className="ascii-art text-primary text-xs leading-tight sm:text-sm">
							{`
██╗   ██╗ ██████╗ ██╗   ██╗██████╗
╚██╗ ██╔╝██╔═══██╗██║   ██║██╔══██╗
 ╚████╔╝ ██║   ██║██║   ██║██████╔╝
  ╚██╔╝  ██║   ██║██║   ██║██╔══██╗
   ██║   ╚██████╔╝╚██████╔╝██║  ██║
   ╚═╝    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝`}
						</pre>

						<pre className="ascii-art text-primary text-xs leading-tight sm:text-sm">
							{`
 ██████╗ ██╗    ██╗███╗   ██╗
██╔═══██╗██║    ██║████╗  ██║
██║   ██║██║ █╗ ██║██╔██╗ ██║
██║   ██║██║███╗██║██║╚██╗██║
╚██████╔╝╚███╔███╔╝██║ ╚████║
 ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝`}
						</pre>

						<pre className="ascii-art text-primary text-xs leading-tight sm:text-sm">
							{`
███████╗████████╗ █████╗  ██████╗██╗  ██╗
██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
███████╗   ██║   ███████║██║     █████╔╝
╚════██║   ██║   ██╔══██║██║     ██╔═██╗
███████║   ██║   ██║  ██║╚██████╗██║  ██╗
╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝`}
						</pre>
					</div>
				</div>

				<div className="mb-6 text-center">
					<p className="mx-auto text-lg text-muted-foreground">
						Modern CLI for scaffolding end-to-end type-safe TypeScript projects
					</p>
					<p className="mx-auto mt-2 max-w-2xl text-muted-foreground text-sm">
						Production-ready • Customizable • Best practices included
					</p>
					<NpmPackage />
				</div>

				<div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
					{/* CLI Command Option */}
					<div className="h-full rounded border border-border p-4">
						<div className="mb-4 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Terminal className="h-4 w-4 text-primary" />
								<span className="font-semibold text-sm">CLI_COMMAND</span>
							</div>
							<div className="flex items-center rounded border border-border p-0.5">
								{(["bun", "pnpm", "npm"] as const).map((pm) => (
									<button
										type="button"
										key={pm}
										onClick={() => setSelectedPM(pm)}
										className={cn(
											"flex items-center gap-1.5 rounded px-2 py-1 text-xs transition-colors duration-150",
											selectedPM === pm
												? "bg-primary/20 text-primary"
												: "text-muted-foreground hover:text-foreground",
										)}
									>
										<PackageIcon pm={pm} className="h-3 w-3" />
										{pm.toUpperCase()}
									</button>
								))}
							</div>
						</div>

						<div className="space-y-3">
							<div className="flex items-center justify-between rounded border border-border p-3">
								<div className="flex items-center gap-2 font-mono text-sm">
									<span className="text-primary">$</span>
									<span className="text-foreground">
										{commands[selectedPM]}
									</span>
								</div>
								<button
									type="button"
									onClick={() => copyCommand(commands[selectedPM], selectedPM)}
									className="flex items-center gap-1 rounded border border-border px-2 py-1 text-xs hover:bg-muted/50"
								>
									{copiedCommand === selectedPM ? (
										<Check className="h-3 w-3 text-primary" />
									) : (
										<Copy className="h-3 w-3" />
									)}
									{copiedCommand === selectedPM ? "COPIED!" : "COPY"}
								</button>
							</div>
						</div>
					</div>

					<Link href="/new">
						<div className="group h-full cursor-pointer rounded border border-border p-4 transition-colors hover:bg-muted/50">
							<div className="mb-4 flex items-center justify-between">
								<div className="flex items-center gap-2">
									<ChevronRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
									<span className="font-semibold text-sm">STACK_BUILDER</span>
								</div>
								<div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
									INTERACTIVE
								</div>
							</div>

							<div className="space-y-3">
								<div className="flex items-center justify-between rounded border border-border p-3">
									<div className="flex items-center gap-2 text-sm">
										<span className="text-primary">⚡</span>
										<span className="text-foreground">
											Interactive configuration wizard
										</span>
									</div>
									<div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
										START
									</div>
								</div>
							</div>
						</div>
					</Link>
				</div>

				<div className="mb-8 grid grid-cols-1 gap-4 sm:mb-12 sm:grid-cols-2 lg:grid-cols-3">
					<Link href="/analytics">
						<div className="cursor-pointer rounded border border-border p-4 transition-colors hover:bg-muted/50">
							<div className="mb-3 flex items-center gap-2">
								<Terminal className="h-4 w-4 text-primary" />
								<span className="font-semibold text-sm sm:text-base">
									CLI_ANALYTICS.JSON
								</span>
							</div>

							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="flex items-center gap-1 font-mono text-muted-foreground text-xs uppercase tracking-wide">
										<BarChart3 className="h-3 w-3" />
										Total Projects
									</span>
									<NumberFlow
										value={14175}
										className="font-bold font-mono text-lg text-primary tabular-nums"
										transformTiming={{
											duration: 1000,
											easing: "ease-out",
										}}
										trend={1}
										willChange
										isolate
									/>
								</div>

								<div className="flex items-center justify-between">
									<span className="flex items-center gap-1 font-mono text-muted-foreground text-xs uppercase tracking-wide">
										<TrendingUp className="h-3 w-3" />
										Avg/Day
									</span>
									<span className="font-mono text-foreground text-sm">
										211.6
									</span>
								</div>

								<div className="border-border/50 border-t pt-3">
									<div className="flex items-center justify-between text-xs">
										<span className="font-mono text-muted-foreground">
											Last Updated
										</span>
										<span className="font-mono text-accent">Aug 1, 2025</span>
									</div>
								</div>
							</div>
						</div>
					</Link>

					<Link
						href="https://github.com/AmanVarshney01/create-better-t-stack"
						target="_blank"
						rel="noopener noreferrer"
					>
						<div className="cursor-pointer rounded border border-border p-4 transition-colors hover:bg-muted/50">
							<div className="mb-3 flex items-center gap-2">
								<Github className="h-4 w-4 text-primary" />
								<span className="font-semibold text-sm sm:text-base">
									GITHUB_REPO.GIT
								</span>
							</div>

							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="flex items-center gap-1 font-mono text-muted-foreground text-xs uppercase tracking-wide">
										<Star className="h-3 w-3" />
										Stars
									</span>
									{githubRepo?.starCount !== undefined ? (
										<NumberFlow
											value={githubRepo.starCount}
											className="font-bold font-mono text-lg text-primary tabular-nums"
											transformTiming={{
												duration: 800,
												easing: "ease-out",
											}}
											trend={1}
											willChange
											isolate
										/>
									) : (
										<div className="h-6 w-16 animate-pulse rounded bg-muted/50 font-bold font-mono text-lg text-primary tabular-nums" />
									)}
								</div>

								<div className="flex items-center justify-between">
									<span className="flex items-center gap-1 font-mono text-muted-foreground text-xs uppercase tracking-wide">
										<Users className="h-3 w-3" />
										Contributors
									</span>
									<span className="font-mono text-foreground text-sm">
										{githubRepo?.contributorCount || "—"}
									</span>
								</div>

								<div className="border-border/50 border-t pt-3">
									<div className="flex items-center justify-between text-xs">
										<span className="font-mono text-muted-foreground">
											Repository
										</span>
										<span className="font-mono text-accent">
											AmanVarshney01/create-better-t-stack
										</span>
									</div>
								</div>
							</div>
						</div>
					</Link>

					<Link
						href="https://www.npmjs.com/package/create-better-t-stack"
						target="_blank"
						rel="noopener noreferrer"
					>
						<div className="cursor-pointer rounded border border-border p-4 transition-colors hover:bg-muted/50">
							<div className="mb-3 flex items-center gap-2">
								<Terminal className="h-4 w-4 text-primary" />
								<span className="font-semibold text-sm sm:text-base">
									NPM_PACKAGE.JS
								</span>
							</div>

							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="flex items-center gap-1 font-mono text-muted-foreground text-xs uppercase tracking-wide">
										<Package className="h-3 w-3" />
										Downloads
									</span>
									{liveNpmDownloadCount?.count !== undefined ? (
										<NumberFlow
											value={liveNpmDownloadCount.count}
											className="font-bold font-mono text-lg text-primary tabular-nums"
											transformTiming={{
												duration: liveNpmDownloadCount.intervalMs || 1000,
												easing: "linear",
											}}
											trend={1}
											willChange
											plugins={[continuous]}
											isolate
										/>
									) : (
										<div className="h-6 w-20 animate-pulse rounded bg-muted/50 font-bold font-mono text-lg text-primary tabular-nums" />
									)}
								</div>

								<div className="flex items-center justify-between">
									<span className="flex items-center gap-1 font-mono text-muted-foreground text-xs uppercase tracking-wide">
										<TrendingUp className="h-3 w-3" />
										Avg/Day
									</span>
									<span className="font-mono text-foreground text-sm">
										{npmPackages?.dayOfWeekAverages
											? Math.round(
													npmPackages.dayOfWeekAverages.reduce(
														(a, b) => a + b,
														0,
													) / 7,
												)
											: "—"}
									</span>
								</div>

								<div className="border-border/50 border-t pt-3">
									<div className="flex items-center justify-between text-xs">
										<span className="font-mono text-muted-foreground">
											Package
										</span>
										<span className="font-mono text-accent">
											create-better-t-stack
										</span>
									</div>
								</div>
							</div>
						</div>
					</Link>
				</div>

				<SponsorsSection />
				<Testimonials />
			</main>
			<Footer />
		</div>
	);
}
