"use client";
import { api } from "@better-t-stack/backend/convex/_generated/api";
import { useNpmDownloadCounter } from "@erquhart/convex-oss-stats/react";
import NumberFlow, { continuous } from "@number-flow/react";
import { useQuery } from "convex/react";
import {
	BarChart3,
	Check,
	ChevronDown,
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import analyticsData from "@/public/analytics-minimal.json";
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
					<div className="flex h-full flex-col justify-between rounded border border-border p-4">
						<div className="mb-4 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Terminal className="h-4 w-4 text-primary" />
								<span className="font-semibold text-sm">CLI_COMMAND</span>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button
										type="button"
										className="flex items-center gap-2 rounded border border-border px-3 py-1.5 text-xs transition-colors hover:bg-muted/10"
									>
										<PackageIcon pm={selectedPM} className="h-3 w-3" />
										<span>{selectedPM.toUpperCase()}</span>
										<ChevronDown className="h-3 w-3" />
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									{(["bun", "pnpm", "npm"] as const).map((pm) => (
										<DropdownMenuItem
											key={pm}
											onClick={() => setSelectedPM(pm)}
											className={cn(
												"flex items-center gap-2",
												selectedPM === pm && "bg-accent text-background",
											)}
										>
											<PackageIcon pm={pm} className="h-3 w-3" />
											<span>{pm.toUpperCase()}</span>
											{selectedPM === pm && (
												<Check className="ml-auto h-3 w-3 text-background" />
											)}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
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
									className="flex items-center gap-1 rounded border border-border px-2 py-1 text-xs hover:bg-muted/10"
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
						<div className="group flex h-full cursor-pointer flex-col justify-between rounded border border-border p-4 transition-colors hover:bg-muted/10">
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
						<div className="cursor-pointer rounded border border-border p-4 transition-colors hover:bg-muted/10">
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
										value={analyticsData.totalProjects}
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
										{analyticsData.avgProjectsPerDay}
									</span>
								</div>

								<div className="border-border/50 border-t pt-3">
									<div className="flex items-center justify-between text-xs">
										<span className="font-mono text-muted-foreground">
											Last Updated
										</span>
										<span className="font-mono text-accent">
											{analyticsData.lastUpdated ||
												new Date().toLocaleDateString("en-US", {
													month: "short",
													day: "numeric",
													year: "numeric",
												})}
										</span>
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
						<div className="cursor-pointer rounded border border-border p-4 transition-colors hover:bg-muted/10">
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
						<div className="cursor-pointer rounded border border-border p-4 transition-colors hover:bg-muted/10">
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
