"use client";
import { format, parseISO } from "date-fns";
import { Cpu, Download, Terminal, TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	XAxis,
	YAxis,
} from "recharts";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import discordLogo from "@/public/icon/discord.svg";
import Footer from "../_components/footer";

interface AggregatedAnalyticsData {
	lastUpdated: string | null;
	generatedAt: string;
	totalRecords: number;
	timeSeries: Array<{ date: string; displayDate: string; count: number }>;
	monthlyTimeSeries: Array<{
		month: string;
		displayMonth: string;
		count: number;
	}>;
	platformDistribution: Array<{ name: string; value: number }>;
	packageManagerDistribution: Array<{ name: string; value: number }>;
	backendDistribution: Array<{ name: string; value: number }>;
	databaseDistribution: Array<{ name: string; value: number }>;
	ormDistribution: Array<{ name: string; value: number }>;
	dbSetupDistribution: Array<{ name: string; value: number }>;
	apiDistribution: Array<{ name: string; value: number }>;
	frontendDistribution: Array<{ name: string; value: number }>;
	nodeVersionDistribution: Array<{ version: string; count: number }>;
	cliVersionDistribution: Array<{ version: string; count: number }>;
	authDistribution: Array<{ name: string; value: number }>;
	gitDistribution: Array<{ name: string; value: number }>;
	installDistribution: Array<{ name: string; value: number }>;
	examplesDistribution: Array<{ name: string; value: number }>;
	addonsDistribution: Array<{ name: string; value: number }>;
	runtimeDistribution: Array<{ name: string; value: number }>;
	projectTypeDistribution: Array<{ name: string; value: number }>;
	popularStackCombinations: Array<{ name: string; value: number }>;
	databaseORMCombinations: Array<{ name: string; value: number }>;
	hourlyDistribution: Array<{
		hour: string;
		displayHour: string;
		count: number;
	}>;
	summary: {
		totalProjects: number;
		avgProjectsPerDay: number;
		authEnabledPercent: number;
		mostPopularFrontend: string;
		mostPopularBackend: string;
		mostPopularORM: string;
		mostPopularAPI: string;
		mostPopularPackageManager: string;
	};
}

const timeSeriesConfig = {
	projects: {
		label: "Projects Created",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig;

const platformConfig = {
	darwin: {
		label: "macOS",
		color: "hsl(var(--chart-1))",
	},
	linux: {
		label: "Linux",
		color: "hsl(var(--chart-2))",
	},
	win32: {
		label: "Windows",
		color: "hsl(var(--chart-3))",
	},
} satisfies ChartConfig;

const packageManagerConfig = {
	npm: {
		label: "npm",
		color: "hsl(var(--chart-1))",
	},
	pnpm: {
		label: "pnpm",
		color: "hsl(var(--chart-2))",
	},
	bun: {
		label: "bun",
		color: "hsl(var(--chart-3))",
	},
} satisfies ChartConfig;

const backendConfig = {
	hono: {
		label: "Hono",
		color: "hsl(var(--chart-1))",
	},
	express: {
		label: "Express",
		color: "hsl(var(--chart-2))",
	},
	fastify: {
		label: "Fastify",
		color: "hsl(var(--chart-3))",
	},
	next: {
		label: "Next.js",
		color: "hsl(var(--chart-4))",
	},
	elysia: {
		label: "Elysia",
		color: "hsl(var(--chart-5))",
	},
	convex: {
		label: "Convex",
		color: "hsl(var(--chart-6))",
	},
	none: {
		label: "None",
		color: "hsl(var(--chart-7))",
	},
} satisfies ChartConfig;

const databaseConfig = {
	sqlite: {
		label: "SQLite",
		color: "hsl(var(--chart-1))",
	},
	postgres: {
		label: "PostgreSQL",
		color: "hsl(var(--chart-2))",
	},
	mysql: {
		label: "MySQL",
		color: "hsl(var(--chart-3))",
	},
	mongodb: {
		label: "MongoDB",
		color: "hsl(var(--chart-4))",
	},
	none: {
		label: "None",
		color: "hsl(var(--chart-5))",
	},
} satisfies ChartConfig;

const ormConfig = {
	drizzle: {
		label: "Drizzle",
		color: "hsl(var(--chart-1))",
	},
	prisma: {
		label: "Prisma",
		color: "hsl(var(--chart-2))",
	},
	mongoose: {
		label: "Mongoose",
		color: "hsl(var(--chart-3))",
	},
	none: {
		label: "None",
		color: "hsl(var(--chart-4))",
	},
} satisfies ChartConfig;

const dbSetupConfig = {
	turso: {
		label: "Turso",
		color: "hsl(var(--chart-1))",
	},
	"prisma-postgres": {
		label: "Prisma Postgres",
		color: "hsl(var(--chart-2))",
	},
	"mongodb-atlas": {
		label: "MongoDB Atlas",
		color: "hsl(var(--chart-3))",
	},
	neon: {
		label: "Neon",
		color: "hsl(var(--chart-4))",
	},
	supabase: {
		label: "Supabase",
		color: "hsl(var(--chart-5))",
	},
	none: {
		label: "None",
		color: "hsl(var(--chart-6))",
	},
} satisfies ChartConfig;

const apiConfig = {
	trpc: {
		label: "tRPC",
		color: "hsl(var(--chart-1))",
	},
	orpc: {
		label: "oRPC",
		color: "hsl(var(--chart-2))",
	},
	none: {
		label: "None",
		color: "hsl(var(--chart-3))",
	},
} satisfies ChartConfig;

const frontendConfig = {
	"react-router": {
		label: "React Router",
		color: "hsl(var(--chart-1))",
	},
	"tanstack-router": {
		label: "TanStack Router",
		color: "hsl(var(--chart-2))",
	},
	"tanstack-start": {
		label: "TanStack Start",
		color: "hsl(var(--chart-3))",
	},
	next: {
		label: "Next",
		color: "hsl(var(--chart-4))",
	},
	nuxt: {
		label: "Nuxt",
		color: "hsl(var(--chart-5))",
	},
	"native-nativewind": {
		label: "Expo NativeWind",
		color: "hsl(var(--chart-6))",
	},
	"native-unistyles": {
		label: "Expo Unistyles",
		color: "hsl(var(--chart-7))",
	},
	svelte: {
		label: "Svelte",
		color: "hsl(var(--chart-3))",
	},
	solid: {
		label: "Solid",
		color: "hsl(var(--chart-4))",
	},
	none: {
		label: "None",
		color: "hsl(var(--chart-7))",
	},
} satisfies ChartConfig;

const nodeVersionConfig = {
	"18": {
		label: "Node.js 18",
		color: "hsl(var(--chart-1))",
	},
	"20": {
		label: "Node.js 20",
		color: "hsl(var(--chart-2))",
	},
	"22": {
		label: "Node.js 22",
		color: "hsl(var(--chart-3))",
	},
	"16": {
		label: "Node.js 16",
		color: "hsl(var(--chart-4))",
	},
	other: {
		label: "Other",
		color: "hsl(var(--chart-5))",
	},
} satisfies ChartConfig;

const cliVersionConfig = {
	latest: {
		label: "Latest",
		color: "hsl(var(--chart-1))",
	},
	outdated: {
		label: "Outdated",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

const authConfig = {
	enabled: {
		label: "Enabled",
		color: "hsl(var(--chart-1))",
	},
	disabled: {
		label: "Disabled",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

const gitConfig = {
	enabled: {
		label: "Git Init",
		color: "hsl(var(--chart-1))",
	},
	disabled: {
		label: "No Git",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

const installConfig = {
	enabled: {
		label: "Auto Install",
		color: "hsl(var(--chart-1))",
	},
	disabled: {
		label: "Skip Install",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

const examplesConfig = {
	todo: {
		label: "Todo App",
		color: "hsl(var(--chart-1))",
	},
	ai: {
		label: "AI Example",
		color: "hsl(var(--chart-2))",
	},
	none: {
		label: "No Examples",
		color: "hsl(var(--chart-3))",
	},
} satisfies ChartConfig;

const addonsConfig = {
	pwa: {
		label: "PWA",
		color: "hsl(var(--chart-1))",
	},
	biome: {
		label: "Biome",
		color: "hsl(var(--chart-2))",
	},
	tauri: {
		label: "Tauri",
		color: "hsl(var(--chart-3))",
	},
	husky: {
		label: "Husky",
		color: "hsl(var(--chart-4))",
	},
	starlight: {
		label: "Starlight",
		color: "hsl(var(--chart-5))",
	},
	turborepo: {
		label: "Turborepo",
		color: "hsl(var(--chart-6))",
	},
	none: {
		label: "No Addons",
		color: "hsl(var(--chart-7))",
	},
} satisfies ChartConfig;

const runtimeConfig = {
	node: {
		label: "Node.js",
		color: "hsl(var(--chart-1))",
	},
	bun: {
		label: "Bun",
		color: "hsl(var(--chart-2))",
	},
	workers: {
		label: "Cloudflare Workers",
		color: "hsl(var(--chart-3))",
	},
	none: {
		label: "None",
		color: "hsl(var(--chart-4))",
	},
} satisfies ChartConfig;

const projectTypeConfig = {
	fullstack: {
		label: "Full-stack",
		color: "hsl(var(--chart-1))",
	},
	"frontend-only": {
		label: "Frontend-only",
		color: "hsl(var(--chart-2))",
	},
	"backend-only": {
		label: "Backend-only",
		color: "hsl(var(--chart-3))",
	},
} satisfies ChartConfig;

const hourlyDistributionConfig = {
	count: {
		label: "Projects Created",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig;

export default function AnalyticsPage() {
	const [data, setData] = useState<AggregatedAnalyticsData | null>(null);
	const [loadingLastUpdated, setLoadingLastUpdated] = useState(true);

	const loadAnalyticsData = useCallback(async () => {
		try {
			const response = await fetch("https://r2.amanv.dev/analytics-data.json");
			const analyticsData = await response.json();

			setData(analyticsData);
			console.log("Loaded aggregated analytics data from R2 bucket");
			console.log(`Data generated at: ${analyticsData.generatedAt}`);
		} catch (error: unknown) {
			console.error("Error loading analytics data:", error);
		} finally {
			setLoadingLastUpdated(false);
		}
	}, []);

	useEffect(() => {
		loadAnalyticsData();
	}, [loadAnalyticsData]);

	const getPlatformData = () => {
		if (!data) return [];
		return data.platformDistribution || [];
	};

	const getPackageManagerData = () => {
		if (!data) return [];
		return data.packageManagerDistribution || [];
	};

	const getBackendData = () => {
		if (!data) return [];
		return data.backendDistribution || [];
	};

	const getDatabaseData = () => {
		if (!data) return [];
		return data.databaseDistribution || [];
	};

	const getORMData = () => {
		if (!data) return [];
		return data.ormDistribution || [];
	};

	const getDBSetupData = () => {
		if (!data) return [];
		return data.dbSetupDistribution || [];
	};

	const getAPIData = () => {
		if (!data) return [];
		return data.apiDistribution || [];
	};

	const getFrontendData = () => {
		if (!data) return [];
		return data.frontendDistribution || [];
	};

	const getTimeSeriesData = () => {
		if (!data) return [];
		return data.timeSeries || [];
	};

	const getNodeVersionData = () => {
		if (!data) return [];
		return data.nodeVersionDistribution || [];
	};

	const getCLIVersionData = () => {
		if (!data) return [];
		return data.cliVersionDistribution || [];
	};

	const getAuthData = () => {
		if (!data) return [];
		return data.authDistribution || [];
	};

	const getGitData = () => {
		if (!data) return [];
		return data.gitDistribution || [];
	};

	const getInstallData = () => {
		if (!data) return [];
		return data.installDistribution || [];
	};

	const getExamplesData = () => {
		if (!data) return [];
		return data.examplesDistribution || [];
	};

	const getAddonsData = () => {
		if (!data) return [];
		return data.addonsDistribution || [];
	};

	const getRuntimeData = () => {
		if (!data) return [];
		return data.runtimeDistribution || [];
	};

	const getProjectTypeData = () => {
		if (!data) return [];
		return data.projectTypeDistribution || [];
	};

	const getMonthlyTimeSeriesData = () => {
		if (!data) return [];
		return data.monthlyTimeSeries || [];
	};

	const getPopularStackCombinations = () => {
		if (!data) return [];
		return data.popularStackCombinations || [];
	};

	const getDatabaseORMCombinations = () => {
		if (!data) return [];
		return data.databaseORMCombinations || [];
	};

	const getHourlyDistributionData = () => {
		if (!data) return [];
		return data.hourlyDistribution || [];
	};

	const totalProjects = data?.summary?.totalProjects || 0;
	const getAvgProjectsPerDay = () => {
		if (!data) return 0;
		return data.summary?.avgProjectsPerDay || 0;
	};

	const avgProjectsPerDay = getAvgProjectsPerDay();
	const authEnabledPercent = data?.summary?.authEnabledPercent || 0;

	const runtimeData = getRuntimeData();
	const mostPopularFrontend = data?.summary?.mostPopularFrontend || "None";
	const mostPopularBackend = data?.summary?.mostPopularBackend || "None";

	const projectTypeData = getProjectTypeData();
	const monthlyTimeSeriesData = getMonthlyTimeSeriesData();
	const popularStackCombinations = getPopularStackCombinations();
	const databaseORMCombinations = getDatabaseORMCombinations();
	const hourlyDistributionData = getHourlyDistributionData();

	return (
		<div className="mx-auto min-h-svh max-w-[1280px]">
			<div className="container mx-auto space-y-8 px-4 py-8 pt-16">
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
							<span className=" text-foreground">
								Analytics from Better-T-Stack CLI usage data
							</span>
						</div>
						<div className="mt-2 flex items-center gap-2 text-sm">
							<span className="text-primary">$</span>
							<span className=" text-muted-foreground">
								Uses PostHog - no personal info tracked, runs on each project
								creation
							</span>
						</div>
						<div className="mt-2 flex items-center gap-2 text-sm">
							<span className="text-primary">$</span>
							<span className=" text-muted-foreground">
								Source:{" "}
								<Link
									href="https://github.com/amanvarshney01/create-better-t-stack/blob/main/apps/cli/src/utils/analytics.ts"
									target="_blank"
									rel="noopener noreferrer"
									className="text-accent underline hover:text-primary"
								>
									analytics.ts
								</Link>
								{" | "}
								<Link
									href="https://r2.amanv.dev/export.csv"
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
							<span className=" text-muted-foreground">
								Last updated:{" "}
								{loadingLastUpdated
									? "CHECKING..."
									: data?.lastUpdated
										? `${data.lastUpdated} UTC`
										: "UNKNOWN"}
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
									src={discordLogo}
									alt="discord"
									className="h-4 w-4 invert-0 dark:invert"
								/>
								<div>
									<span className=" font-semibold text-sm">
										DISCORD_NOTIFICATIONS.IRC
									</span>
									<p className=" text-muted-foreground text-xs">
										Join for LIVE project creation alerts
									</p>
								</div>
							</div>
							<div className="flex items-center gap-1 rounded border border-border bg-primary/10 px-2 py-1">
								<span className="text-primary text-xs">▶</span>
								<span className=" font-semibold text-primary text-xs">
									JOIN
								</span>
							</div>
						</div>
					</Link>
				</div>

				<div className="space-y-4">
					<div className="mb-4 flex items-center gap-2">
						<span className="font-bold text-lg">SYSTEM_METRICS.LOG</span>
						<div className="h-px flex-1 bg-border" />
					</div>

					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
						<div className="rounded border border-border">
							<div className="border-border border-b px-4 py-3">
								<div className="flex items-center justify-between">
									<span className=" font-semibold text-sm">TOTAL_PROJECTS</span>
									<Terminal className="h-4 w-4 text-primary" />
								</div>
							</div>
							<div className="p-4">
								<div className="font-bold text-2xl text-primary">
									{totalProjects.toLocaleString()}
								</div>
								<p className="mt-1 text-muted-foreground text-xs">
									$ ./create-better-t-stack executions
								</p>
							</div>
						</div>

						<div className="rounded border border-border">
							<div className="border-border border-b px-4 py-3">
								<div className="flex items-center justify-between">
									<span className=" font-semibold text-sm">TOP_FRONTEND</span>
									<Cpu className="h-4 w-4 text-primary" />
								</div>
							</div>
							<div className="p-4">
								<div className="truncate font-bold text-accent text-lg">
									{mostPopularFrontend}
								</div>
								<p className="mt-1 text-muted-foreground text-xs">
									$ most_selected_frontend.sh
								</p>
							</div>
						</div>

						<div className="rounded border border-border">
							<div className="border-border border-b px-4 py-3">
								<div className="flex items-center justify-between">
									<span className=" font-semibold text-sm">TOP_BACKEND</span>
									<Terminal className="h-4 w-4 text-primary" />
								</div>
							</div>
							<div className="p-4">
								<div className="truncate font-bold text-accent text-lg">
									{mostPopularBackend}
								</div>
								<p className="mt-1 text-muted-foreground text-xs">
									$ most_selected_backend.sh
								</p>
							</div>
						</div>

						<div className="rounded border border-border">
							<div className="border-border border-b px-4 py-3">
								<div className="flex items-center justify-between">
									<span className=" font-semibold text-sm">TOP_ORM</span>
									<Download className="h-4 w-4 text-primary" />
								</div>
							</div>
							<div className="p-4">
								<div className="truncate font-bold text-accent text-lg">
									{data?.summary?.mostPopularORM || "None"}
								</div>
								<p className="mt-1 text-muted-foreground text-xs">
									$ most_selected_orm.sh
								</p>
							</div>
						</div>

						<div className="rounded border border-border">
							<div className="border-border border-b px-4 py-3">
								<div className="flex items-center justify-between">
									<span className=" font-semibold text-sm">TOP_API</span>
									<TrendingUp className="h-4 w-4 text-primary" />
								</div>
							</div>
							<div className="p-4">
								<div className="truncate font-bold text-accent text-lg">
									{data?.summary?.mostPopularAPI || "None"}
								</div>
								<p className="mt-1 text-muted-foreground text-xs">
									$ most_selected_api.sh
								</p>
							</div>
						</div>

						<div className="rounded border border-border">
							<div className="border-border border-b px-4 py-3">
								<div className="flex items-center justify-between">
									<span className=" font-semibold text-sm">AUTH_ADOPTION</span>
									<Users className="h-4 w-4 text-primary" />
								</div>
							</div>
							<div className="p-4">
								<div className="font-bold text-2xl text-primary">
									{authEnabledPercent}%
								</div>
								<p className="mt-1 text-muted-foreground text-xs">
									$ auth_enabled_percentage.sh
								</p>
							</div>
						</div>

						<div className="rounded border border-border">
							<div className="border-border border-b px-4 py-3">
								<div className="flex items-center justify-between">
									<span className=" font-semibold text-sm">TOP_PKG_MGR</span>
									<Terminal className="h-4 w-4 text-primary" />
								</div>
							</div>
							<div className="p-4">
								<div className="truncate font-bold text-accent text-lg">
									{data?.summary?.mostPopularPackageManager || "npm"}
								</div>
								<p className="mt-1 text-muted-foreground text-xs">
									$ most_used_package_manager.sh
								</p>
							</div>
						</div>

						<div className="rounded border border-border">
							<div className="border-border border-b px-4 py-3">
								<div className="flex items-center justify-between">
									<span className=" font-semibold text-sm">AVG_DAILY</span>
									<TrendingUp className="h-4 w-4 text-primary" />
								</div>
							</div>
							<div className="p-4">
								<div className="font-bold text-2xl text-primary">
									{avgProjectsPerDay.toFixed(1)}
								</div>
								<p className="mt-1 text-muted-foreground text-xs">
									$ average_projects_per_day.sh
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="space-y-6">
					<div className="mb-4 flex items-center gap-2">
						<span className="font-bold text-lg">TIMELINE_ANALYSIS.CHARTS</span>
						<div className="h-px flex-1 bg-border" />
					</div>

					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div className="rounded border border-border">
							<div className="border-border border-b px-4 py-3">
								<div className="flex items-center gap-2">
									<span className="text-primary text-xs">▶</span>
									<span className=" font-semibold text-sm">
										PROJECT_TIMELINE.CHART
									</span>
								</div>
								<p className="mt-1 text-muted-foreground text-xs">
									Daily project creation timeline from actual data
								</p>
							</div>
							<div className="p-4">
								<ChartContainer
									config={timeSeriesConfig}
									className="h-[300px] w-full"
								>
									<AreaChart data={getTimeSeriesData()}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="displayDate" />
										<YAxis />
										<ChartTooltip
											content={<ChartTooltipContent />}
											labelFormatter={(value, payload) => {
												const date = payload?.[0]?.payload?.date;
												return date
													? format(parseISO(date), "MMM dd, yyyy")
													: value;
											}}
										/>
										<Area
											type="monotone"
											dataKey="count"
											stroke="hsl(var(--chart-1))"
											fill="hsl(var(--chart-1))"
											fillOpacity={0.2}
										/>
									</AreaChart>
								</ChartContainer>
							</div>
						</div>

						<div className="rounded border border-border">
							<div className="border-border border-b px-4 py-3">
								<div className="flex items-center gap-2">
									<span className="text-primary text-xs">▶</span>
									<span className=" font-semibold text-sm">
										MONTHLY_TRENDS.CHART
									</span>
								</div>
								<p className="mt-1 text-muted-foreground text-xs">
									Monthly project creation trends
								</p>
							</div>
							<div className="p-4">
								<ChartContainer
									config={timeSeriesConfig}
									className="h-[300px] w-full"
								>
									<BarChart data={monthlyTimeSeriesData}>
										<CartesianGrid vertical={false} />
										<XAxis
											dataKey="displayMonth"
											tickLine={false}
											tickMargin={10}
											axisLine={false}
											className=" text-xs"
										/>
										<YAxis hide />
										<ChartTooltip content={<ChartTooltipContent />} />
										<Bar
											dataKey="count"
											radius={4}
											fill="hsl(var(--chart-1))"
										/>
									</BarChart>
								</ChartContainer>
							</div>
						</div>

						<div className="rounded border border-border">
							<div className="border-border border-b px-4 py-3">
								<div className="flex items-center gap-2">
									<span className="text-primary text-xs">▶</span>
									<span className=" font-semibold text-sm">
										PLATFORM_DISTRIBUTION.PIE
									</span>
								</div>
								<p className="mt-1 text-muted-foreground text-xs">
									Operating system distribution
								</p>
							</div>
							<div className="p-4">
								<ChartContainer
									config={platformConfig}
									className="h-[300px] w-full"
								>
									<PieChart>
										<ChartTooltip
											content={<ChartTooltipContent nameKey="name" />}
										/>
										<Pie
											data={getPlatformData()}
											cx="50%"
											cy="50%"
											labelLine={false}
											label={({ name, percent }) =>
												`${name} ${(percent * 100).toFixed(0)}%`
											}
											outerRadius={80}
											fill="hsl(var(--chart-1))"
											dataKey="value"
										>
											{getPlatformData().map((entry) => (
												<Cell
													key={entry.name}
													fill={
														entry.name === "darwin"
															? "hsl(var(--chart-1))"
															: entry.name === "linux"
																? "hsl(var(--chart-2))"
																: "hsl(var(--chart-3))"
													}
												/>
											))}
										</Pie>
										<ChartLegend content={<ChartLegendContent />} />
									</PieChart>
								</ChartContainer>
							</div>
						</div>

						<div className="rounded border border-border">
							<div className="border-border border-b px-4 py-3">
								<div className="flex items-center gap-2">
									<span className="text-primary text-xs">▶</span>
									<span className=" font-semibold text-sm">
										HOURLY_DISTRIBUTION.BAR
									</span>
								</div>
								<p className="mt-1 text-muted-foreground text-xs">
									Projects created by hour of day (UTC)
								</p>
							</div>
							<div className="p-4">
								<ChartContainer
									config={hourlyDistributionConfig}
									className="h-[350px] w-full"
								>
									<BarChart data={hourlyDistributionData}>
										<CartesianGrid vertical={false} />
										<XAxis
											dataKey="displayHour"
											tickLine={false}
											tickMargin={10}
											axisLine={false}
											className=" text-xs"
										/>
										<YAxis hide />
										<ChartTooltip
											content={<ChartTooltipContent />}
											labelFormatter={(value, payload) => {
												const hour = payload?.[0]?.payload?.displayHour;
												return hour ? `${hour} UTC` : value;
											}}
										/>
										<Bar
											dataKey="count"
											radius={4}
											fill="hsl(var(--chart-1))"
										/>
									</BarChart>
								</ChartContainer>
							</div>
						</div>
					</div>
				</div>

				<div className="space-y-6">
					<div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
						<div className="flex items-center gap-2">
							<span className="font-bold text-lg sm:text-xl">
								STACK_CONFIGURATION.DB
							</span>
						</div>
						<div className="hidden h-px flex-1 bg-border sm:block" />
						<span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
							[CORE_COMPONENTS]
						</span>
					</div>

					<div className="rounded border border-border">
						<div className="border-border border-b px-4 py-3">
							<div className="flex items-center gap-2">
								<span className="text-primary text-xs">▶</span>
								<span className=" font-semibold text-sm">
									POPULAR_STACK_COMBINATIONS.BAR
								</span>
							</div>
							<p className="mt-1 text-muted-foreground text-xs">
								Most popular frontend + backend combinations
							</p>
						</div>
						<div className="p-4">
							<ChartContainer
								config={frontendConfig}
								className="h-[400px] w-full"
							>
								<BarChart data={popularStackCombinations}>
									<CartesianGrid vertical={false} />
									<XAxis
										dataKey="name"
										tickLine={false}
										tickMargin={10}
										axisLine={false}
										className=" text-xs"
									/>
									<YAxis hide />
									<ChartTooltip content={<ChartTooltipContent />} />
									<Bar dataKey="value" radius={4} fill="hsl(var(--chart-1))" />
								</BarChart>
							</ChartContainer>
						</div>
					</div>

					<div className="rounded border border-border">
						<div className="border-border border-b px-4 py-3">
							<div className="flex items-center gap-2">
								<span className="text-primary text-xs">▶</span>
								<span className=" font-semibold text-sm">
									FRONTEND_FRAMEWORKS.BAR
								</span>
							</div>
							<p className="mt-1 text-muted-foreground text-xs">
								Frontend framework and meta-framework usage
							</p>
						</div>
						<div className="p-4">
							<ChartContainer
								config={frontendConfig}
								className="h-[350px] w-full"
							>
								<BarChart data={getFrontendData()}>
									<CartesianGrid vertical={false} />
									<XAxis
										dataKey="name"
										tickLine={false}
										tickMargin={10}
										axisLine={false}
										className=" text-xs"
									/>
									<YAxis hide />
									<ChartTooltip content={<ChartTooltipContent />} />
									<Bar dataKey="value" radius={4}>
										{getFrontendData().map((entry) => (
											<Cell
												key={`frontend-${entry.name}`}
												fill={
													entry.name === "react-router"
														? "hsl(var(--chart-1))"
														: entry.name === "tanstack-router"
															? "hsl(var(--chart-2))"
															: entry.name === "tanstack-start"
																? "hsl(var(--chart-3))"
																: entry.name === "next"
																	? "hsl(var(--chart-4))"
																	: entry.name === "nuxt"
																		? "hsl(var(--chart-5))"
																		: entry.name === "native-nativewind"
																			? "hsl(var(--chart-6))"
																			: entry.name === "native-unistyles"
																				? "hsl(var(--chart-7))"
																				: entry.name === "svelte"
																					? "hsl(var(--chart-3))"
																					: entry.name === "solid"
																						? "hsl(var(--chart-4))"
																						: "hsl(var(--chart-7))"
												}
											/>
										))}
									</Bar>
								</BarChart>
							</ChartContainer>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div className="rounded border border-border">
							<div className="border-border border-b px-4 py-3">
								<div className="flex items-center gap-2">
									<span className="text-primary text-xs">▶</span>
									<span className=" font-semibold text-sm">
										BACKEND_FRAMEWORKS.BAR
									</span>
								</div>
								<p className="mt-1 text-muted-foreground text-xs">
									Backend framework distribution
								</p>
							</div>
							<div className="p-4">
								<ChartContainer
									config={backendConfig}
									className="h-[300px] w-full"
								>
									<BarChart data={getBackendData()}>
										<CartesianGrid vertical={false} />
										<XAxis
											dataKey="name"
											tickLine={false}
											tickMargin={10}
											axisLine={false}
										/>
										<YAxis hide />
										<ChartTooltip content={<ChartTooltipContent />} />
										<Bar dataKey="value" radius={4}>
											{getBackendData().map((entry) => (
												<Cell
													key={`backend-${entry.name}`}
													fill={
														entry.name === "hono"
															? "hsl(var(--chart-1))"
															: entry.name === "express"
																? "hsl(var(--chart-2))"
																: entry.name === "fastify"
																	? "hsl(var(--chart-3))"
																	: entry.name === "next"
																		? "hsl(var(--chart-4))"
																		: entry.name === "elysia"
																			? "hsl(var(--chart-5))"
																			: entry.name === "convex"
																				? "hsl(var(--chart-6))"
																				: "hsl(var(--chart-7))"
													}
												/>
											))}
										</Bar>
									</BarChart>
								</ChartContainer>
							</div>
						</div>

						<div className="rounded border border-border">
							<div className="border-border border-b px-4 py-3">
								<div className="flex items-center gap-2">
									<span className="text-primary text-xs">▶</span>
									<span className=" font-semibold text-sm">
										DATABASE_DISTRIBUTION.BAR
									</span>
								</div>
								<p className="mt-1 text-muted-foreground text-xs">
									Database technology distribution
								</p>
							</div>
							<div className="p-4">
								<ChartContainer
									config={databaseConfig}
									className="h-[300px] w-full"
								>
									<BarChart data={getDatabaseData()}>
										<CartesianGrid vertical={false} />
										<XAxis
											dataKey="name"
											tickLine={false}
											tickMargin={10}
											axisLine={false}
										/>
										<YAxis hide />
										<ChartTooltip content={<ChartTooltipContent />} />
										<Bar dataKey="value" radius={4}>
											{getDatabaseData().map((entry) => (
												<Cell
													key={`database-${entry.name}`}
													fill={
														entry.name === "sqlite"
															? "hsl(var(--chart-1))"
															: entry.name === "postgres"
																? "hsl(var(--chart-2))"
																: entry.name === "mysql"
																	? "hsl(var(--chart-3))"
																	: entry.name === "mongodb"
																		? "hsl(var(--chart-4))"
																		: "hsl(var(--chart-7))"
													}
												/>
											))}
										</Bar>
									</BarChart>
								</ChartContainer>
							</div>
						</div>

						<div className="rounded border border-border">
							<div className="border-border border-b px-4 py-3">
								<div className="flex items-center gap-2">
									<span className="text-primary text-xs">▶</span>
									<span className=" font-semibold text-sm">
										ORM_DISTRIBUTION.BAR
									</span>
								</div>
								<p className="mt-1 text-muted-foreground text-xs">
									ORM/Database layer distribution
								</p>
							</div>
							<div className="p-4">
								<ChartContainer config={ormConfig} className="h-[300px] w-full">
									<BarChart data={getORMData()}>
										<CartesianGrid vertical={false} />
										<XAxis
											dataKey="name"
											tickLine={false}
											tickMargin={10}
											axisLine={false}
										/>
										<YAxis hide />
										<ChartTooltip content={<ChartTooltipContent />} />
										<Bar dataKey="value" radius={4}>
											{getORMData().map((entry) => (
												<Cell
													key={`orm-${entry.name}`}
													fill={
														entry.name === "drizzle"
															? "hsl(var(--chart-1))"
															: entry.name === "prisma"
																? "hsl(var(--chart-2))"
																: entry.name === "mongoose"
																	? "hsl(var(--chart-3))"
																	: "hsl(var(--chart-7))"
													}
												/>
											))}
										</Bar>
									</BarChart>
								</ChartContainer>
							</div>
						</div>

						<div className="rounded border border-border">
							<div className="border-border border-b px-4 py-3">
								<div className="flex items-center gap-2">
									<span className="text-primary text-xs">▶</span>
									<span className=" font-semibold text-sm">
										DATABASE_HOSTING.BAR
									</span>
								</div>
								<p className="mt-1 text-muted-foreground text-xs">
									Database hosting service preferences
								</p>
							</div>
							<div className="p-4">
								<ChartContainer
									config={dbSetupConfig}
									className="h-[300px] w-full"
								>
									<BarChart data={getDBSetupData()}>
										<CartesianGrid vertical={false} />
										<XAxis
											dataKey="name"
											tickLine={false}
											tickMargin={10}
											axisLine={false}
										/>
										<YAxis hide />
										<ChartTooltip content={<ChartTooltipContent />} />
										<Bar dataKey="value" radius={4}>
											{getDBSetupData().map((entry) => (
												<Cell
													key={`dbsetup-${entry.name}`}
													fill={
														entry.name === "turso"
															? "hsl(var(--chart-1))"
															: entry.name === "prisma-postgres"
																? "hsl(var(--chart-2))"
																: entry.name === "mongodb-atlas"
																	? "hsl(var(--chart-3))"
																	: entry.name === "neon"
																		? "hsl(var(--chart-4))"
																		: entry.name === "supabase"
																			? "hsl(var(--chart-5))"
																			: "hsl(var(--chart-7))"
													}
												/>
											))}
										</Bar>
									</BarChart>
								</ChartContainer>
							</div>
						</div>

						<div className="rounded border border-border">
							<div className="border-border border-b px-4 py-3">
								<div className="flex items-center gap-2">
									<span className="text-primary text-xs">▶</span>
									<span className=" font-semibold text-sm">API_LAYER.PIE</span>
								</div>
								<p className="mt-1 text-muted-foreground text-xs">
									API layer technology distribution
								</p>
							</div>
							<div className="p-4">
								<ChartContainer config={apiConfig} className="h-[300px] w-full">
									<PieChart>
										<ChartTooltip
											content={<ChartTooltipContent nameKey="name" />}
										/>
										<Pie
											data={getAPIData()}
											dataKey="value"
											nameKey="name"
											cx="50%"
											cy="50%"
											outerRadius={80}
										>
											{getAPIData().map((entry) => (
												<Cell
													key={`api-${entry.name}`}
													fill={
														entry.name === "trpc"
															? "hsl(var(--chart-1))"
															: entry.name === "orpc"
																? "hsl(var(--chart-2))"
																: "hsl(var(--chart-7))"
													}
												/>
											))}
										</Pie>
										<ChartLegend content={<ChartLegendContent />} />
									</PieChart>
								</ChartContainer>
							</div>
						</div>

						<div className="rounded border border-border">
							<div className="border-border border-b px-4 py-3">
								<div className="flex items-center gap-2">
									<span className="text-primary text-xs">▶</span>
									<span className=" font-semibold text-sm">
										AUTH_ADOPTION.PIE
									</span>
								</div>
								<p className="mt-1 text-muted-foreground text-xs">
									Authentication implementation rate
								</p>
							</div>
							<div className="p-4">
								<ChartContainer
									config={authConfig}
									className="h-[300px] w-full"
								>
									<PieChart>
										<ChartTooltip
											content={<ChartTooltipContent nameKey="name" />}
										/>
										<Pie
											data={getAuthData()}
											dataKey="value"
											nameKey="name"
											cx="50%"
											cy="50%"
											outerRadius={80}
											label={({ name, percent }) =>
												`${name} ${(percent * 100).toFixed(0)}%`
											}
										>
											{getAuthData().map((entry) => (
												<Cell
													key={`auth-${entry.name}`}
													fill={
														entry.name === "enabled"
															? "hsl(var(--chart-1))"
															: "hsl(var(--chart-7))"
													}
												/>
											))}
										</Pie>
										<ChartLegend content={<ChartLegendContent />} />
									</PieChart>
								</ChartContainer>
							</div>
						</div>

						<div className="rounded border border-border">
							<div className="border-border border-b px-4 py-3">
								<div className="flex items-center gap-2">
									<span className="text-primary text-xs">▶</span>
									<span className=" font-semibold text-sm">
										RUNTIME_DISTRIBUTION.PIE
									</span>
								</div>
								<p className="mt-1 text-muted-foreground text-xs">
									JavaScript runtime preference distribution
								</p>
							</div>
							<div className="p-4">
								<ChartContainer
									config={runtimeConfig}
									className="h-[300px] w-full"
								>
									<PieChart>
										<ChartTooltip
											content={<ChartTooltipContent nameKey="name" />}
										/>
										<Pie
											data={runtimeData}
											dataKey="value"
											nameKey="name"
											cx="50%"
											cy="50%"
											outerRadius={80}
											label={({ name, percent }) =>
												`${name} ${(percent * 100).toFixed(0)}%`
											}
										>
											{runtimeData.map((entry) => (
												<Cell
													key={`runtime-${entry.name}`}
													fill={
														entry.name === "node"
															? "hsl(var(--chart-1))"
															: entry.name === "bun"
																? "hsl(var(--chart-2))"
																: entry.name === "workers"
																	? "hsl(var(--chart-3))"
																	: "hsl(var(--chart-7))"
													}
												/>
											))}
										</Pie>
										<ChartLegend content={<ChartLegendContent />} />
									</PieChart>
								</ChartContainer>
							</div>
						</div>

						<div className="rounded border border-border">
							<div className="border-border border-b px-4 py-3">
								<div className="flex items-center gap-2">
									<span className="text-primary text-xs">▶</span>
									<span className=" font-semibold text-sm">
										PROJECT_TYPES.PIE
									</span>
								</div>
								<p className="mt-1 text-muted-foreground text-xs">
									Full-stack vs Frontend-only vs Backend-only projects
								</p>
							</div>
							<div className="p-4">
								<ChartContainer
									config={projectTypeConfig}
									className="h-[300px] w-full"
								>
									<PieChart>
										<ChartTooltip
											content={<ChartTooltipContent nameKey="name" />}
										/>
										<Pie
											data={projectTypeData}
											dataKey="value"
											nameKey="name"
											cx="50%"
											cy="50%"
											outerRadius={80}
											label={({ name, percent }) =>
												`${name} ${(percent * 100).toFixed(0)}%`
											}
										>
											{projectTypeData.map((entry) => (
												<Cell
													key={`project-type-${entry.name}`}
													fill={
														entry.name === "fullstack"
															? "hsl(var(--chart-1))"
															: entry.name === "frontend-only"
																? "hsl(var(--chart-2))"
																: "hsl(var(--chart-3))"
													}
												/>
											))}
										</Pie>
										<ChartLegend content={<ChartLegendContent />} />
									</PieChart>
								</ChartContainer>
							</div>
						</div>
					</div>

					<div className="rounded border border-border">
						<div className="border-border border-b px-4 py-3">
							<div className="flex items-center gap-2">
								<span className="text-primary text-xs">▶</span>
								<span className=" font-semibold text-sm">
									DATABASE_ORM_COMBINATIONS.BAR
								</span>
							</div>
							<p className="mt-1 text-muted-foreground text-xs">
								Popular database + ORM combinations
							</p>
						</div>
						<div className="p-4">
							<ChartContainer
								config={databaseConfig}
								className="h-[350px] w-full"
							>
								<BarChart data={databaseORMCombinations}>
									<CartesianGrid vertical={false} />
									<XAxis
										dataKey="name"
										tickLine={false}
										tickMargin={10}
										axisLine={false}
										className=" text-xs"
									/>
									<YAxis hide />
									<ChartTooltip content={<ChartTooltipContent />} />
									<Bar dataKey="value" radius={4} fill="hsl(var(--chart-1))" />
								</BarChart>
							</ChartContainer>
						</div>
					</div>

					<div className="rounded border border-border">
						<div className="border-border border-b px-4 py-3">
							<div className="flex items-center gap-2">
								<span className="text-primary text-xs">▶</span>
								<span className=" font-semibold text-sm">ADDONS_USAGE.BAR</span>
							</div>
							<p className="mt-1 text-muted-foreground text-xs">
								Additional features and tooling adoption
							</p>
						</div>
						<div className="p-4">
							<ChartContainer
								config={addonsConfig}
								className="h-[350px] w-full"
							>
								<BarChart data={getAddonsData()}>
									<CartesianGrid vertical={false} />
									<XAxis
										dataKey="name"
										tickLine={false}
										tickMargin={10}
										axisLine={false}
										className=" text-xs"
									/>
									<YAxis hide />
									<ChartTooltip content={<ChartTooltipContent />} />
									<Bar dataKey="value" radius={4}>
										{getAddonsData().map((entry) => (
											<Cell
												key={`addons-${entry.name}`}
												fill={
													entry.name === "pwa"
														? "hsl(var(--chart-1))"
														: entry.name === "biome"
															? "hsl(var(--chart-2))"
															: entry.name === "tauri"
																? "hsl(var(--chart-3))"
																: entry.name === "husky"
																	? "hsl(var(--chart-4))"
																	: entry.name === "starlight"
																		? "hsl(var(--chart-5))"
																		: entry.name === "turborepo"
																			? "hsl(var(--chart-6))"
																			: "hsl(var(--chart-7))"
												}
											/>
										))}
									</Bar>
								</BarChart>
							</ChartContainer>
						</div>
					</div>

					<div className="rounded border border-border">
						<div className="border-border border-b px-4 py-3">
							<div className="flex items-center gap-2">
								<span className="text-primary text-xs">▶</span>
								<span className=" font-semibold text-sm">
									EXAMPLES_USAGE.BAR
								</span>
							</div>
							<p className="mt-1 text-muted-foreground text-xs">
								Example applications included in projects
							</p>
						</div>
						<div className="p-4">
							<ChartContainer
								config={examplesConfig}
								className="h-[300px] w-full"
							>
								<BarChart data={getExamplesData()}>
									<CartesianGrid vertical={false} />
									<XAxis
										dataKey="name"
										tickLine={false}
										tickMargin={10}
										axisLine={false}
										className=" text-xs"
									/>
									<YAxis hide />
									<ChartTooltip content={<ChartTooltipContent />} />
									<Bar dataKey="value" radius={4}>
										{getExamplesData().map((entry) => (
											<Cell
												key={`examples-${entry.name}`}
												fill={
													entry.name === "todo"
														? "hsl(var(--chart-1))"
														: entry.name === "ai"
															? "hsl(var(--chart-2))"
															: "hsl(var(--chart-7))"
												}
											/>
										))}
									</Bar>
								</BarChart>
							</ChartContainer>
						</div>
					</div>
				</div>

				<div className="space-y-6">
					<div className="mb-4 flex items-center gap-2">
						<span className="font-bold text-lg">DEV_ENVIRONMENT.CONFIG</span>
						<div className="h-px flex-1 bg-border" />
					</div>

					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div className="rounded border border-border">
							<div className="border-border border-b px-4 py-3">
								<div className="flex items-center gap-2">
									<span className="text-primary text-xs">▶</span>
									<span className=" font-semibold text-sm">
										GIT_INITIALIZATION.PIE
									</span>
								</div>
								<p className="mt-1 text-muted-foreground text-xs">
									Git repository initialization rate
								</p>
							</div>
							<div className="p-4">
								<ChartContainer config={gitConfig} className="h-[300px] w-full">
									<PieChart>
										<ChartTooltip
											content={<ChartTooltipContent nameKey="name" />}
										/>
										<Pie
											data={getGitData()}
											dataKey="value"
											nameKey="name"
											cx="50%"
											cy="50%"
											outerRadius={80}
											label={({ name, percent }) =>
												`${name} ${(percent * 100).toFixed(0)}%`
											}
										>
											{getGitData().map((entry) => (
												<Cell
													key={`git-${entry.name}`}
													fill={
														entry.name === "enabled"
															? "hsl(var(--chart-1))"
															: "hsl(var(--chart-7))"
													}
												/>
											))}
										</Pie>
										<ChartLegend content={<ChartLegendContent />} />
									</PieChart>
								</ChartContainer>
							</div>
						</div>

						<div className="rounded border border-border">
							<div className="border-border border-b px-4 py-3">
								<div className="flex items-center gap-2">
									<span className="text-primary text-xs">▶</span>
									<span className=" font-semibold text-sm">
										PACKAGE_MANAGER.BAR
									</span>
								</div>
								<p className="mt-1 text-muted-foreground text-xs">
									Package manager usage distribution
								</p>
							</div>
							<div className="p-4">
								<ChartContainer
									config={packageManagerConfig}
									className="h-[300px] w-full"
								>
									<BarChart data={getPackageManagerData()}>
										<CartesianGrid vertical={false} />
										<XAxis
											dataKey="name"
											tickLine={false}
											tickMargin={10}
											axisLine={false}
										/>
										<YAxis />
										<ChartTooltip content={<ChartTooltipContent />} />
										<Bar dataKey="value" radius={4}>
											{getPackageManagerData().map((entry) => (
												<Cell
													key={`package-${entry.name}`}
													fill={
														entry.name === "npm"
															? "hsl(var(--chart-1))"
															: entry.name === "pnpm"
																? "hsl(var(--chart-2))"
																: entry.name === "bun"
																	? "hsl(var(--chart-3))"
																	: entry.name === "yarn"
																		? "hsl(var(--chart-4))"
																		: "hsl(var(--chart-7))"
													}
												/>
											))}
										</Bar>
									</BarChart>
								</ChartContainer>
							</div>
						</div>

						<div className="rounded border border-border">
							<div className="border-border border-b px-4 py-3">
								<div className="flex items-center gap-2">
									<span className="text-primary text-xs">▶</span>
									<span className=" font-semibold text-sm">
										INSTALL_PREFERENCE.PIE
									</span>
								</div>
								<p className="mt-1 text-muted-foreground text-xs">
									Automatic dependency installation preference
								</p>
							</div>
							<div className="p-4">
								<ChartContainer
									config={installConfig}
									className="h-[300px] w-full"
								>
									<PieChart>
										<ChartTooltip
											content={<ChartTooltipContent nameKey="name" />}
										/>
										<Pie
											data={getInstallData()}
											dataKey="value"
											nameKey="name"
											cx="50%"
											cy="50%"
											outerRadius={80}
											label={({ name, percent }) =>
												`${name} ${(percent * 100).toFixed(0)}%`
											}
										>
											{getInstallData().map((entry) => (
												<Cell
													key={`install-${entry.name}`}
													fill={
														entry.name === "enabled"
															? "hsl(var(--chart-1))"
															: "hsl(var(--chart-7))"
													}
												/>
											))}
										</Pie>
										<ChartLegend content={<ChartLegendContent />} />
									</PieChart>
								</ChartContainer>
							</div>
						</div>

						<div className="rounded border border-border">
							<div className="border-border border-b px-4 py-3">
								<div className="flex items-center gap-2">
									<span className="text-primary text-xs">▶</span>
									<span className=" font-semibold text-sm">
										NODE_VERSIONS.BAR
									</span>
								</div>
								<p className="mt-1 text-muted-foreground text-xs">
									Node.js version distribution (major versions)
								</p>
							</div>
							<div className="p-4">
								<ChartContainer
									config={nodeVersionConfig}
									className="h-[300px] w-full"
								>
									<BarChart data={getNodeVersionData()}>
										<CartesianGrid vertical={false} />
										<XAxis
											dataKey="version"
											tickLine={false}
											tickMargin={10}
											axisLine={false}
											className=" text-xs"
										/>
										<YAxis hide />
										<ChartTooltip content={<ChartTooltipContent />} />
										<Bar
											dataKey="count"
											radius={4}
											fill="hsl(var(--chart-1))"
										/>
									</BarChart>
								</ChartContainer>
							</div>
						</div>
					</div>

					<div className="rounded border border-border">
						<div className="border-border border-b px-4 py-3">
							<div className="flex items-center gap-2">
								<span className="text-primary text-xs">▶</span>
								<span className=" font-semibold text-sm">CLI_VERSIONS.BAR</span>
							</div>
							<p className="mt-1 text-muted-foreground text-xs">
								CLI version distribution across project creations
							</p>
						</div>
						<div className="p-4">
							<ChartContainer
								config={cliVersionConfig}
								className="h-[350px] w-full"
							>
								<BarChart data={getCLIVersionData()}>
									<CartesianGrid vertical={false} />
									<XAxis
										dataKey="version"
										tickLine={false}
										tickMargin={10}
										axisLine={false}
										className=" text-xs"
									/>
									<YAxis hide />
									<ChartTooltip content={<ChartTooltipContent />} />
									<Bar dataKey="count" radius={4} fill="hsl(var(--chart-1))" />
								</BarChart>
							</ChartContainer>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}
