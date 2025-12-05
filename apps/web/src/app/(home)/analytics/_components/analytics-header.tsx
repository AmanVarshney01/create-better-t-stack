import { format } from "date-fns";
import { Terminal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import discordIcon from "@/public/icon/discord.svg";

export function AnalyticsHeader({
	totalProjects,
	lastUpdated,
	legacy,
}: {
	totalProjects: number;
	lastUpdated: string | null;
	legacy: {
		total: number;
		avgPerDay: number;
		lastUpdatedIso: string;
		source: string;
	};
}) {
	const formattedDate = lastUpdated
		? format(new Date(lastUpdated), "MMM d, yyyy 'at' HH:mm")
		: null;
	const legacyDate = format(
		new Date(legacy.lastUpdatedIso),
		"MMM d, yyyy 'at' HH:mm 'UTC'",
	);

	return (
		<div className="mb-4">
			<div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
				<div className="flex items-center gap-2">
					<Terminal className="h-5 w-5 text-primary" />
					<span className="font-bold text-lg sm:text-xl">CLI_ANALYTICS</span>
				</div>
				<div className="hidden h-px flex-1 bg-border sm:block" />
				<span className="text-muted-foreground text-xs">
					[{totalProjects.toLocaleString()} projects]
				</span>
			</div>

			<div className="rounded rounded-b-none border border-border p-4 font-mono text-sm">
				<div className="flex items-center gap-2">
					<span className="text-primary">$</span>
					<span>Real-time analytics from Better-T-Stack CLI</span>
				</div>
				<div className="mt-2 flex items-center gap-2 text-muted-foreground">
					<span className="text-primary">$</span>
					<span>No personal data collected - anonymous usage stats only</span>
				</div>
				<div className="mt-2 flex items-center gap-2 text-muted-foreground">
					<span className="text-primary">$</span>
					<span>
						Source:{" "}
						<Link
							href="https://github.com/AmanVarshney01/create-better-t-stack/blob/main/apps/cli/src/utils/analytics.ts"
							target="_blank"
							rel="noopener noreferrer"
							className="text-accent underline hover:text-primary"
						>
							analytics.ts
						</Link>
					</span>
				</div>
				{formattedDate && (
					<div className="mt-2 flex items-center gap-2 text-muted-foreground">
						<span className="text-primary">$</span>
						<span>Last event: {formattedDate}</span>
					</div>
				)}
				<div className="mt-2 flex flex-col gap-1 rounded border border-border/60 bg-muted/30 p-3 text-muted-foreground text-xs">
					<div className="flex items-center gap-2">
						<span className="text-primary">$</span>
						<span className="font-semibold text-foreground">
							Legacy totals (pre-Convex)
						</span>
					</div>
					<div className="flex flex-wrap gap-3">
						<span className="font-mono text-foreground">
							{legacy.total.toLocaleString()} projects
						</span>
						<span className="font-mono">
							avg/day {legacy.avgPerDay.toFixed(1)}
						</span>
						<span className="font-mono">as of {legacyDate}</span>
						<span className="font-mono">source: {legacy.source}</span>
					</div>
					<span>
						Notes: Legacy stats are frozen at the last PostHog run; live Convex
						stats continue below.
					</span>
				</div>
			</div>

			<Link
				href="https://discord.gg/ZYsbjpDaM5"
				target="_blank"
				rel="noopener noreferrer"
				className="block rounded rounded-t-none border border-border border-t-0 transition-colors hover:bg-muted/5"
			>
				<div className="flex items-center justify-between p-3">
					<div className="flex items-center gap-3">
						<Image
							src={discordIcon}
							alt="Discord"
							className="h-4 w-4 invert-0 dark:invert"
						/>
						<div>
							<span className="font-semibold text-sm">Join Discord</span>
							<p className="text-muted-foreground text-xs">
								Get live project creation notifications
							</p>
						</div>
					</div>
					<div className="rounded border border-border bg-primary/10 px-2 py-1 font-semibold text-primary text-xs">
						JOIN
					</div>
				</div>
			</Link>
		</div>
	);
}
