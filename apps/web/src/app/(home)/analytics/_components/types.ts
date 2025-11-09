import type { ChartConfig } from "@/components/ui/chart";

export interface AggregatedAnalyticsData {
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
	webDeployDistribution: Array<{ name: string; value: number }>;
	serverDeployDistribution: Array<{ name: string; value: number }>;
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
		mostPopularAuth: string;
		mostPopularFrontend: string;
		mostPopularBackend: string;
		mostPopularORM: string;
		mostPopularAPI: string;
		mostPopularPackageManager: string;
		mostPopularWebDeploy: string;
		mostPopularServerDeploy: string;
	};
}

export const timeSeriesConfig = {
	projects: {
		label: "Projects Created",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig;

export const platformConfig = {
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
	android: {
		label: "Android",
		color: "hsl(var(--chart-4))",
	},
} satisfies ChartConfig;

export const packageManagerConfig = {
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

export const backendConfig = {
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

export const databaseConfig = {
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

export const ormConfig = {
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

export const dbSetupConfig = {
	turso: {
		label: "Turso",
		color: "hsl(var(--chart-1))",
	},
	planetscale: {
		label: "PlanetScale",
		color: "hsl(var(--chart-2))",
	},
	"prisma-postgres": {
		label: "Prisma Postgres",
		color: "hsl(var(--chart-3))",
	},
	"mongodb-atlas": {
		label: "MongoDB Atlas",
		color: "hsl(var(--chart-4))",
	},
	neon: {
		label: "Neon",
		color: "hsl(var(--chart-5))",
	},
	supabase: {
		label: "Supabase",
		color: "hsl(var(--chart-6))",
	},
	d1: {
		label: "Cloudflare D1",
		color: "hsl(var(--chart-7))",
	},
	docker: {
		label: "Docker",
		color: "hsl(var(--chart-1))",
	},
	none: {
		label: "None",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

export const apiConfig = {
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

export const frontendConfig = {
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
	"native-bare": {
		label: "Expo Bare",
		color: "hsl(var(--chart-6))",
	},
	"native-uniwind": {
		label: "Expo Uniwind",
		color: "hsl(var(--chart-7))",
	},
	"native-unistyles": {
		label: "Expo Unistyles",
		color: "hsl(var(--chart-1))",
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

export const nodeVersionConfig = {
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

export const cliVersionConfig = {
	latest: {
		label: "Latest",
		color: "hsl(var(--chart-1))",
	},
	outdated: {
		label: "Outdated",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

export const authConfig = {
	"better-auth": {
		label: "Better Auth",
		color: "hsl(var(--chart-1))",
	},
	clerk: {
		label: "Clerk",
		color: "hsl(var(--chart-2))",
	},
	none: {
		label: "No Auth",
		color: "hsl(var(--chart-3))",
	},
} satisfies ChartConfig;

export const gitConfig = {
	enabled: {
		label: "Git Init",
		color: "hsl(var(--chart-1))",
	},
	disabled: {
		label: "No Git",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

export const installConfig = {
	enabled: {
		label: "Auto Install",
		color: "hsl(var(--chart-1))",
	},
	disabled: {
		label: "Skip Install",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

export const examplesConfig = {
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

export const addonsConfig = {
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

export const runtimeConfig = {
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

export const projectTypeConfig = {
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
	none: {
		label: "None",
		color: "hsl(var(--chart-4))",
	},
} satisfies ChartConfig;

export const webDeployConfig = {
	wrangler: {
		label: "Cloudflare Wrangler",
		color: "hsl(var(--chart-1))",
	},
	alchemy: {
		label: "Alchemy",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

export const serverDeployConfig = {
	wrangler: {
		label: "Cloudflare Wrangler",
		color: "hsl(var(--chart-1))",
	},
	alchemy: {
		label: "Alchemy",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

export const hourlyDistributionConfig = {
	count: {
		label: "Projects Created",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig;
