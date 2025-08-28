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

export default function StatsSection({
	analyticsData,
}: {
	analyticsData: {
		totalProjects: number;
		avgProjectsPerDay: string;
		lastUpdated: string | null;
	};
}) {
	const githubRepo = useQuery(api.stats.getGithubRepo, {
		name: "AmanVarshney01/create-better-t-stack",
	});
	const npmPackages = useQuery(api.stats.getNpmPackages, {
		names: ["create-better-t-stack"],
	});

	const liveNpmDownloadCount = useNpmDownloadCounter(npmPackages);

	return (
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
								value={analyticsData?.totalProjects || 0}
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
								{analyticsData?.avgProjectsPerDay || "—"}
							</span>
						</div>

						<div className="border-border/50 border-t pt-3">
							<div className="flex items-center justify-between text-xs">
								<span className="font-mono text-muted-foreground">
									Last Updated
								</span>
								<span className="font-mono text-accent">
									{analyticsData?.lastUpdated ||
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
											npmPackages.dayOfWeekAverages.reduce((a, b) => a + b, 0) /
												7,
										)
									: "—"}
							</span>
						</div>

						<div className="border-border/50 border-t pt-3">
							<div className="flex items-center justify-between text-xs">
								<span className="font-mono text-muted-foreground">Package</span>
								<span className="font-mono text-accent">
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
