"use client";
import { api } from "@better-t-stack/backend/convex/_generated/api";
import { useNpmDownloadCounter } from "@erquhart/convex-oss-stats/react";
import NumberFlow, { continuous } from "@number-flow/react";
import { useQuery } from "convex/react";
import {
	BarChart3,
	Github,
	Package,
	Star,
	Terminal,
	TrendingUp,
	Users,
} from "lucide-react";
import Link from "next/link";

type EventRow = {
	_creationTime: number;
};

function computeStats(events: EventRow[] | undefined) {
	if (!events || events.length === 0) {
		return { totalProjects: 0, avgProjectsPerDay: "0", lastUpdated: null };
	}

	const byDay = new Set<string>();
	let maxTime = 0;

	for (const ev of events) {
		const day = new Date(ev._creationTime).toISOString().slice(0, 10);
		byDay.add(day);
		if (ev._creationTime > maxTime) maxTime = ev._creationTime;
	}

	const totalProjects = events.length;
	const avgProjectsPerDay =
		byDay.size === 0 ? "0" : (totalProjects / byDay.size).toFixed(2);
	const lastUpdated = new Date(maxTime).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});

	return { totalProjects, avgProjectsPerDay, lastUpdated };
}

export default function StatsSection() {
	const events = useQuery(api.analytics.getAllEvents, { range: "30d" });
	const githubRepo = useQuery(api.stats.getGithubRepo, {
		name: "AmanVarshney01/create-better-t-stack",
	});
	const npmPackages = useQuery(api.stats.getNpmPackages, {
		names: ["create-better-t-stack"],
	});

	const liveNpmDownloadCount = useNpmDownloadCounter(npmPackages);
	const analyticsData = computeStats(events as EventRow[] | undefined);

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<Link href="/analytics">
				<div className="cursor-pointer rounded border border-border p-4 transition-colors hover:bg-muted/10">
					<div className="mb-3 flex items-center gap-2">
						<Terminal className="h-4 w-4 text-primary" />
						<span className="font-semibold text-sm sm:text-base">
							CLI_ANALYTICS.JSON
						</span>
						<span className="rounded border border-border px-2 py-0.5 text-[10px] text-muted-foreground uppercase">
							Last 30 days
						</span>
					</div>

					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<span className="flex items-center gap-1 font-mono text-muted-foreground text-xs uppercase tracking-wide">
								<BarChart3 className="h-3 w-3" />
								Total Projects (30d)
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
							<div className="flex items-center justify-between gap-2 text-xs">
								<span className="font-mono text-muted-foreground">
									Last Updated
								</span>
								<span className="truncate font-mono text-accent">
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
							<NumberFlow
								value={githubRepo?.starCount || 0}
								className="font-bold font-mono text-lg text-primary tabular-nums"
								transformTiming={{
									duration: 800,
									easing: "ease-out",
								}}
								trend={1}
								willChange
								isolate
							/>
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
							<div className="flex items-center justify-between gap-2 text-xs">
								<span className="font-mono text-muted-foreground">
									Repository
								</span>
								<span className="truncate font-mono text-accent">
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
							<NumberFlow
								value={liveNpmDownloadCount?.count || 0}
								className="font-bold font-mono text-lg text-primary tabular-nums"
								transformTiming={{
									duration: liveNpmDownloadCount?.intervalMs || 1000,
									easing: "linear",
								}}
								trend={1}
								willChange
								plugins={[continuous]}
								isolate
							/>
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
												(a: number, b: number) => a + b,
												0,
											) / 7,
										)
									: "—"}
							</span>
						</div>

						<div className="border-border/50 border-t pt-3">
							<div className="flex items-center justify-between gap-2 text-xs">
								<span className="font-mono text-muted-foreground">Package</span>
								<span className="truncate font-mono text-accent">
									create-better-t-stack
								</span>
							</div>
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
}
