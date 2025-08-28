import { Terminal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import discordIcon from "@/public/icon/discord.svg";

export function AnalyticsHeader({
	totalProjects,
	lastUpdated,
}: {
	totalProjects: number;
	lastUpdated: string | null;
}) {
	return (
		<div className="mb-8">
			<div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
				<div className="flex items-center gap-2">
					<Terminal className="h-5 w-5 text-primary" />
					<span className="font-bold text-lg sm:text-xl">
						ANALYTICS_DASHBOARD.SH
					</span>
				</div>
				<div className="hidden h-px flex-1 bg-border sm:block" />
				<span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
					[{totalProjects} PROJECTS_ANALYZED]
				</span>
			</div>

			<div className="rounded rounded-b-none border border-border p-4">
				<div className="flex items-center gap-2 text-sm">
					<span className="text-primary">$</span>
					<span className="text-foreground">
						Analytics from Better-T-Stack CLI usage data
					</span>
				</div>
				<div className="mt-2 flex items-center gap-2 text-sm">
					<span className="text-primary">$</span>
					<span className="text-muted-foreground">
						Uses PostHog - no personal info tracked, runs on each project
						creation
					</span>
				</div>
				<div className="mt-2 flex items-center gap-2 text-sm">
					<span className="text-primary">$</span>
					<span className="text-muted-foreground">
						Source:{" "}
						<Link
							href="https://github.com/AmanVarshney01/create-better-t-stack/blob/main/apps/cli/src/utils/analytics.ts"
							target="_blank"
							rel="noopener noreferrer"
							className="text-accent underline hover:text-primary"
						>
							analytics.ts
						</Link>
						{" | "}
						<Link
							href="https://r2.better-t-stack.dev/export.csv"
							target="_blank"
							rel="noopener noreferrer"
							className="text-accent underline hover:text-primary"
						>
							export.csv
						</Link>
					</span>
				</div>
				<div className="mt-2 flex items-center gap-2 text-sm">
					<span className="text-primary">$</span>
					<span className="text-muted-foreground">
						Last updated: {lastUpdated ? `${lastUpdated} UTC` : "UNKNOWN"}
					</span>
				</div>
			</div>

			<Link
				href="https://discord.gg/ZYsbjpDaM5"
				target="_blank"
				rel="noopener noreferrer"
				className="block rounded rounded-t-none border border-border border-t-0"
			>
				<div className="flex items-center justify-between p-3">
					<div className="flex items-center gap-3">
						<Image
							src={discordIcon}
							alt="discord"
							className="h-4 w-4 invert-0 dark:invert"
						/>
						<div>
							<span className="font-semibold text-sm">
								DISCORD_NOTIFICATIONS.IRC
							</span>
							<p className="text-muted-foreground text-xs">
								Join for LIVE project creation alerts
							</p>
						</div>
					</div>
					<div className="flex items-center gap-1 rounded border border-border bg-primary/10 px-2 py-1">
						<span className="text-primary text-xs">▶</span>
						<span className="font-semibold text-primary text-xs">JOIN</span>
					</div>
				</div>
			</Link>
		</div>
	);
}
