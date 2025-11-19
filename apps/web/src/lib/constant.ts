import type { TechCategory } from "./types";

export const ICON_BASE_URL = "https://r2.better-t-stack.dev/icons";

export const TECH_OPTIONS: Record<
	TechCategory,
	{
		id: string;
		name: string;
		description: string;
		icon: string;
		color: string;
		default?: boolean;
		className?: string;
	}[]
> = {
	api: [
		{
			id: "trpc",
			name: "tRPC",
			description: "End-to-end typesafe APIs",
			icon: `${ICON_BASE_URL}/trpc.svg`,
			color: "from-blue-500 to-blue-700",
			default: true,
		},
		{
			id: "orpc",
			name: "oRPC",
			description: "Typesafe APIs Made Simple",
			icon: `${ICON_BASE_URL}/orpc.svg`,
			color: "from-indigo-400 to-indigo-600",
		},
		{
			id: "none",
			name: "No API",
			description: "No API layer (API routes disabled)",
			icon: "",
			color: "from-gray-400 to-gray-600",
		},
	],
	webFrontend: [
		{
			id: "tanstack-router",
			name: "TanStack Router",
			description: "Modern type-safe router for React",
			icon: `${ICON_BASE_URL}/tanstack.svg`,
			color: "from-blue-400 to-blue-600",
			default: true,
		},
		{
			id: "react-router",
			name: "React Router",
			description: "Declarative routing for React",
			icon: `${ICON_BASE_URL}/react-router.svg`,
			color: "from-cyan-400 to-cyan-600",
			default: false,
		},
		{
			id: "tanstack-start",
			name: "TanStack Start",
			description:
				"Full-stack React and Solid framework powered by TanStack Router",
			icon: `${ICON_BASE_URL}/tanstack.svg`,
			color: "from-purple-400 to-purple-600",
			default: false,
		},
		{
			id: "next",
			name: "Next.js",
			description: "React framework with hybrid rendering",
			icon: `${ICON_BASE_URL}/nextjs.svg`,
			color: "from-gray-700 to-black",
			default: false,
		},
		{
			id: "nuxt",
			name: "Nuxt",
			description: "Vue full-stack framework (SSR, SSG, hybrid)",
			icon: `${ICON_BASE_URL}/nuxt.svg`,
			color: "from-green-400 to-green-700",
			default: false,
		},
		{
			id: "svelte",
			name: "Svelte",
			description: "Cybernetically enhanced web apps",
			icon: `${ICON_BASE_URL}/svelte.svg`,
			color: "from-orange-500 to-orange-700",
			default: false,
		},
		{
			id: "solid",
			name: "Solid",
			description: "Simple and performant reactivity for building UIs",
			icon: `${ICON_BASE_URL}/solid.svg`,
			color: "from-blue-600 to-blue-800",
			default: false,
		},
		{
			id: "none",
			name: "No Web Frontend",
			description: "No web-based frontend",
			icon: "",
			color: "from-gray-400 to-gray-600",
			default: false,
		},
	],
	nativeFrontend: [
		{
			id: "native-bare",
			name: "Expo + Bare",
			description: "Expo with StyleSheet (no styling library)",
			icon: `${ICON_BASE_URL}/expo.svg`,
			color: "from-blue-400 to-blue-600",
			className: "invert-0 dark:invert",
			default: true,
		},
		{
			id: "native-uniwind",
			name: "Expo + Uniwind",
			description:
				"Fastest Tailwind bindings for React Native with HeroUI Native",
			icon: `${ICON_BASE_URL}/expo.svg`,
			color: "from-purple-400 to-purple-600",
			className: "invert-0 dark:invert",
			default: false,
		},
		{
			id: "native-unistyles",
			name: "Expo + Unistyles",
			description: "Expo with Unistyles (type-safe styling)",
			icon: `${ICON_BASE_URL}/expo.svg`,
			color: "from-pink-400 to-pink-600",
			className: "invert-0 dark:invert",
			default: false,
		},
		{
			id: "none",
			name: "No Native Frontend",
			description: "No native mobile frontend",
			icon: "",
			color: "from-gray-400 to-gray-600",
			default: false,
		},
	],
	runtime: [
		{
			id: "bun",
			name: "Bun",
			description: "Fast JavaScript runtime & toolkit",
			icon: `${ICON_BASE_URL}/bun.svg`,
			color: "from-amber-400 to-amber-600",
			default: true,
		},
		{
			id: "node",
			name: "Node.js",
			description: "JavaScript runtime environment",
			icon: `${ICON_BASE_URL}/node.svg`,
			color: "from-green-400 to-green-600",
		},
		{
			id: "workers",
			name: "Cloudflare Workers",
			description: "Serverless runtime for the edge",
			icon: `${ICON_BASE_URL}/workers.svg`,
			color: "from-orange-400 to-orange-600",
		},
		{
			id: "none",
			name: "No Runtime",
			description: "No specific runtime",
			icon: "",
			color: "from-gray-400 to-gray-600",
		},
	],
	backend: [
		{
			id: "hono",
			name: "Hono",
			description: "Ultrafast web framework",
			icon: `${ICON_BASE_URL}/hono.svg`,
			color: "from-blue-500 to-blue-700",
			default: true,
		},
		{
			id: "elysia",
			name: "Elysia",
			description: "TypeScript web framework",
			icon: `${ICON_BASE_URL}/elysia.svg`,
			color: "from-purple-500 to-purple-700",
		},
		{
			id: "express",
			name: "Express",
			description: "Popular Node.js framework",
			icon: `${ICON_BASE_URL}/express.svg`,
			color: "from-gray-500 to-gray-700",
		},
		{
			id: "fastify",
			name: "Fastify",
			description: "Fast, low-overhead web framework for Node.js",
			icon: `${ICON_BASE_URL}/fastify.svg`,
			color: "from-gray-500 to-gray-700",
		},
		{
			id: "convex",
			name: "Convex",
			description: "Reactive backend-as-a-service",
			icon: `${ICON_BASE_URL}/convex.svg`,
			color: "from-pink-500 to-pink-700",
		},
		{
			id: "self-next",
			name: "Fullstack Next.js",
			description: "Use Next.js built-in API routes",
			icon: `${ICON_BASE_URL}/nextjs.svg`,
			color: "from-gray-700 to-black",
		},
		{
			id: "self-tanstack-start",
			name: "Fullstack TanStack Start",
			description: "Use TanStack Start's built-in API routes",
			icon: `${ICON_BASE_URL}/tanstack.svg`,
			color: "from-purple-400 to-purple-600",
		},
		{
			id: "none",
			name: "No Backend",
			description: "Skip backend integration (frontend only)",
			icon: "",
			color: "from-gray-400 to-gray-600",
		},
	],
	database: [
		{
			id: "sqlite",
			name: "SQLite",
			description: "File-based SQL database",
			icon: `${ICON_BASE_URL}/sqlite.svg`,
			color: "from-blue-400 to-cyan-500",
			default: true,
		},
		{
			id: "postgres",
			name: "PostgreSQL",
			description: "Advanced SQL database",
			icon: `${ICON_BASE_URL}/postgres.svg`,
			color: "from-indigo-400 to-indigo-600",
		},
		{
			id: "mysql",
			name: "MySQL",
			description: "Popular relational database",
			icon: `${ICON_BASE_URL}/mysql.svg`,
			color: "from-blue-500 to-blue-700",
		},
		{
			id: "mongodb",
			name: "MongoDB",
			description: "NoSQL document database",
			icon: `${ICON_BASE_URL}/mongodb.svg`,
			color: "from-green-400 to-green-600",
		},
		{
			id: "none",
			name: "No Database",
			description: "Skip database integration",
			icon: "",
			color: "from-gray-400 to-gray-600",
		},
	],
	orm: [
		{
			id: "drizzle",
			name: "Drizzle",
			description: "TypeScript ORM",
			icon: `${ICON_BASE_URL}/drizzle.svg`,
			color: "from-cyan-400 to-cyan-600",
			default: true,
		},
		{
			id: "prisma",
			name: "Prisma",
			description: "Next-gen ORM",
			icon: `${ICON_BASE_URL}/prisma.svg`,
			color: "from-purple-400 to-purple-600",
		},
		{
			id: "mongoose",
			name: "Mongoose",
			description: "Elegant object modeling tool",
			icon: `${ICON_BASE_URL}/mongoose.svg`,
			color: "from-blue-400 to-blue-600",
		},
		{
			id: "none",
			name: "No ORM",
			description: "Skip ORM integration",
			icon: "",
			color: "from-gray-400 to-gray-600",
		},
	],
	dbSetup: [
		{
			id: "turso",
			name: "Turso",
			description: "Distributed SQLite with edge replicas (libSQL)",
			icon: `${ICON_BASE_URL}/turso.svg`,
			color: "from-pink-400 to-pink-600",
		},
		{
			id: "d1",
			name: "Cloudflare D1",
			description:
				"Serverless SQLite-compatible database for Cloudflare Workers",
			icon: `${ICON_BASE_URL}/workers.svg`,
			color: "from-orange-400 to-orange-600",
		},
		{
			id: "neon",
			name: "Neon Postgres",
			description: "Serverless Postgres with autoscaling and branching",
			icon: `${ICON_BASE_URL}/neon.svg`,
			color: "from-blue-400 to-blue-600",
		},
		{
			id: "prisma-postgres",
			name: "Prisma PostgreSQL",
			description: "Managed Postgres via Prisma Data Platform",
			icon: `${ICON_BASE_URL}/prisma.svg`,
			color: "from-indigo-400 to-indigo-600",
		},
		{
			id: "mongodb-atlas",
			name: "MongoDB Atlas",
			description: "Managed MongoDB clusters in the cloud",
			icon: `${ICON_BASE_URL}/mongodb.svg`,
			color: "from-green-400 to-green-600",
		},
		{
			id: "supabase",
			name: "Supabase",
			description: "Local Postgres stack via Supabase (Docker required)",
			icon: `${ICON_BASE_URL}/supabase.svg`,
			color: "from-emerald-400 to-emerald-600",
		},
		{
			id: "planetscale",
			name: "PlanetScale",
			description: "Postgres & Vitess (MySQL) on NVMe",
			icon: `${ICON_BASE_URL}/planetscale.svg`,
			color: "from-orange-400 to-orange-600",
		},
		{
			id: "docker",
			name: "Docker",
			description: "Run Postgres/MySQL/MongoDB locally via Docker Compose",
			icon: `${ICON_BASE_URL}/docker.svg`,
			color: "from-blue-500 to-blue-700",
		},
		{
			id: "none",
			name: "Basic Setup",
			description: "No cloud DB integration",
			icon: "",
			color: "from-gray-400 to-gray-600",
			default: true,
		},
	],
	webDeploy: [
		{
			id: "alchemy",
			name: "Alchemy",
			description: "Deploy to Cloudflare Workers using Alchemy",
			icon: `${ICON_BASE_URL}/alchemy.png`,
			color: "from-purple-400 to-purple-600",
			className: "scale-150",
		},
		{
			id: "none",
			name: "None",
			description: "Skip deployment setup",
			icon: "",
			color: "from-gray-400 to-gray-600",
			default: true,
		},
	],
	serverDeploy: [
		{
			id: "alchemy",
			name: "Alchemy",
			description: "Deploy to Cloudflare Workers using Alchemy",
			icon: `${ICON_BASE_URL}/alchemy.png`,
			color: "from-purple-400 to-purple-600",
			className: "scale-150",
		},
		{
			id: "none",
			name: "None",
			description: "Skip deployment setup",
			icon: "",
			color: "from-gray-400 to-gray-600",
			default: true,
		},
	],
	auth: [
		{
			id: "better-auth",
			name: "Better-Auth",
			description:
				"The most comprehensive authentication framework for TypeScript",
			icon: `${ICON_BASE_URL}/better-auth.svg`,
			color: "from-green-400 to-green-600",
			default: true,
		},
		{
			id: "clerk",
			name: "Clerk",
			description: "More than authentication, Complete User Management",
			icon: `${ICON_BASE_URL}/clerk.svg`,
			color: "from-blue-400 to-blue-600",
		},
		{
			id: "none",
			name: "No Auth",
			description: "Skip authentication",
			icon: "",
			color: "from-red-400 to-red-600",
		},
	],
	payments: [
		{
			id: "polar",
			name: "Polar",
			description: "Turn your software into a business. 6 lines of code.",
			icon: `${ICON_BASE_URL}/polar.svg`,
			color: "from-purple-400 to-purple-600",
			default: false,
		},
		{
			id: "none",
			name: "No Payments",
			description: "Skip payments integration",
			icon: "",
			color: "from-gray-400 to-gray-600",
			default: true,
		},
	],
	packageManager: [
		{
			id: "npm",
			name: "npm",
			description: "Default package manager",
			icon: `${ICON_BASE_URL}/npm.svg`,
			color: "from-red-500 to-red-700",
			className: "invert-0 dark:invert",
		},
		{
			id: "pnpm",
			name: "pnpm",
			description: "Fast, disk space efficient",
			icon: `${ICON_BASE_URL}/pnpm.svg`,
			color: "from-orange-500 to-orange-700",
		},
		{
			id: "bun",
			name: "bun",
			description: "All-in-one toolkit",
			icon: `${ICON_BASE_URL}/bun.svg`,
			color: "from-amber-500 to-amber-700",
			default: true,
		},
	],
	addons: [
		{
			id: "pwa",
			name: "PWA (Progressive Web App)",
			description: "Make your app installable and work offline",
			icon: "",
			color: "from-blue-500 to-blue-700",
			default: false,
		},
		{
			id: "tauri",
			name: "Tauri",
			description: "Build native desktop apps",
			icon: `${ICON_BASE_URL}/tauri.svg`,
			color: "from-amber-500 to-amber-700",
			default: false,
		},
		{
			id: "starlight",
			name: "Starlight",
			description: "Build stellar docs with astro",
			icon: `${ICON_BASE_URL}/starlight.svg`,
			color: "from-teal-500 to-teal-700",
			default: false,
		},
		{
			id: "biome",
			name: "Biome",
			description: "Format, lint, and more",
			icon: `${ICON_BASE_URL}/biome.svg`,
			color: "from-green-500 to-green-700",
			default: false,
		},
		{
			id: "husky",
			name: "Husky",
			description: "Modern native Git hooks made easy",
			icon: "",
			color: "from-purple-500 to-purple-700",
			default: false,
		},
		{
			id: "ultracite",
			name: "Ultracite",
			description: "Biome preset with AI integration",
			icon: `${ICON_BASE_URL}/ultracite.svg`,
			color: "from-blue-500 to-blue-700",
			className: "invert-0 dark:invert",
			default: false,
		},
		{
			id: "fumadocs",
			name: "Fumadocs",
			description: "Build excellent documentation site",
			icon: `${ICON_BASE_URL}/fumadocs.svg`,
			color: "from-indigo-500 to-indigo-700",
			default: false,
		},
		{
			id: "oxlint",
			name: "Oxlint",
			description: "Rust-powered linter",
			icon: "",
			color: "from-orange-500 to-orange-700",
			default: false,
		},
		{
			id: "ruler",
			name: "Ruler",
			description: "Centralize your AI rules",
			icon: "",
			color: "from-violet-500 to-violet-700",
			default: false,
		},
		{
			id: "turborepo",
			name: "Turborepo",
			description: "High-performance build system",
			icon: `${ICON_BASE_URL}/turborepo.svg`,
			color: "from-gray-400 to-gray-700",
			default: true,
		},
	],
	examples: [
		{
			id: "todo",
			name: "Todo Example",
			description: "Simple todo application",
			icon: "",
			color: "from-indigo-500 to-indigo-700",
			default: false,
		},
		{
			id: "ai",
			name: "AI Example",
			description: "AI integration example using AI SDK",
			icon: "",
			color: "from-purple-500 to-purple-700",
			default: false,
		},
	],
	git: [
		{
			id: "true",
			name: "Git",
			description: "Initialize Git repository",
			icon: `${ICON_BASE_URL}/git.svg`,
			color: "from-gray-500 to-gray-700",
			default: true,
		},
		{
			id: "false",
			name: "No Git",
			description: "Skip Git initialization",
			icon: "",
			color: "from-red-400 to-red-600",
		},
	],
	install: [
		{
			id: "true",
			name: "Install Dependencies",
			description: "Install packages automatically",
			icon: "",
			color: "from-green-400 to-green-600",
			default: true,
		},
		{
			id: "false",
			name: "Skip Install",
			description: "Skip dependency installation",
			icon: "",
			color: "from-yellow-400 to-yellow-600",
		},
	],
};

export const PRESET_TEMPLATES = [
	{
		id: "default",
		name: "Default Stack",
		description: "Standard web app with TanStack Router, Bun, Hono and SQLite",
		stack: {
			projectName: "my-better-t-app",
			webFrontend: ["tanstack-router"],
			nativeFrontend: ["none"],
			runtime: "bun",
			backend: "hono",
			database: "sqlite",
			orm: "drizzle",
			dbSetup: "none",
			auth: "better-auth",
			payments: "none",
			packageManager: "bun",
			addons: ["turborepo"],
			examples: [],
			git: "true",
			install: "true",
			api: "trpc",
			webDeploy: "none",
			serverDeploy: "none",
			yolo: "false",
		},
	},
	{
		id: "convex-react",
		name: "Convex + React",
		description: "Reactive full-stack app with Convex and TanStack Router",
		stack: {
			projectName: "my-better-t-app",
			webFrontend: ["tanstack-router"],
			nativeFrontend: ["none"],
			backend: "convex",
			runtime: "none",
			database: "none",
			orm: "none",
			dbSetup: "none",
			auth: "none",
			payments: "none",
			packageManager: "bun",
			addons: ["turborepo"],
			examples: ["todo"],
			git: "true",
			install: "true",
			api: "none",
			webDeploy: "none",
			serverDeploy: "none",
			yolo: "false",
		},
	},
	{
		id: "nextjs-fullstack",
		name: "Next.js Fullstack",
		description:
			"Full-stack Next.js app with built-in API routes and internal packages",
		stack: {
			projectName: "my-better-t-app",
			webFrontend: ["next"],
			nativeFrontend: ["none"],
			backend: "self-next",
			runtime: "none",
			database: "sqlite",
			orm: "drizzle",
			dbSetup: "none",
			auth: "better-auth",
			payments: "none",
			packageManager: "bun",
			addons: ["turborepo"],
			examples: ["todo"],
			git: "true",
			install: "true",
			api: "trpc",
			webDeploy: "none",
			serverDeploy: "none",
			yolo: "false",
		},
	},
	{
		id: "tanstack-start-fullstack",
		name: "TanStack Start Fullstack",
		description:
			"Full-stack TanStack Start app with built-in API routes and internal packages",
		stack: {
			projectName: "my-better-t-app",
			webFrontend: ["tanstack-start"],
			nativeFrontend: ["none"],
			backend: "self-tanstack-start",
			runtime: "none",
			database: "sqlite",
			orm: "drizzle",
			dbSetup: "none",
			auth: "better-auth",
			payments: "none",
			packageManager: "bun",
			addons: ["turborepo"],
			examples: ["todo"],
			git: "true",
			install: "true",
			api: "trpc",
			webDeploy: "none",
			serverDeploy: "none",
			yolo: "false",
		},
	},
	{
		id: "native-app",
		name: "Mobile App",
		description: "React Native with Expo and SQLite database",
		stack: {
			projectName: "my-better-t-app",
			webFrontend: ["none"],
			nativeFrontend: ["native-bare"],
			runtime: "bun",
			backend: "hono",
			database: "sqlite",
			orm: "drizzle",
			dbSetup: "none",
			auth: "better-auth",
			payments: "none",
			packageManager: "bun",
			addons: ["turborepo"],
			examples: [],
			git: "true",
			install: "true",
			api: "trpc",
			webDeploy: "none",
			serverDeploy: "none",
			yolo: "false",
		},
	},
	{
		id: "api-only",
		name: "API Only",
		description: "Backend API with Hono and Sqlite",
		stack: {
			projectName: "my-better-t-app",
			webFrontend: ["none"],
			nativeFrontend: ["none"],
			runtime: "bun",
			backend: "hono",
			database: "sqlite",
			orm: "drizzle",
			dbSetup: "none",
			auth: "better-auth",
			payments: "none",
			packageManager: "bun",
			addons: ["turborepo"],
			examples: [],
			git: "true",
			install: "true",
			api: "trpc",
			webDeploy: "none",
			serverDeploy: "none",
			yolo: "false",
		},
	},
	{
		id: "full-featured",
		name: "Full Featured",
		description: "Complete setup with web, native, Turso, and addons",
		stack: {
			projectName: "my-better-t-app",
			webFrontend: ["tanstack-router"],
			nativeFrontend: ["native-bare"],
			runtime: "bun",
			backend: "hono",
			database: "sqlite",
			orm: "drizzle",
			dbSetup: "turso",
			auth: "better-auth",
			payments: "polar",
			packageManager: "bun",
			addons: ["pwa", "biome", "husky", "tauri", "starlight", "turborepo"],
			examples: ["todo", "ai"],
			git: "true",
			install: "true",
			api: "trpc",
			webDeploy: "alchemy",
			serverDeploy: "alchemy",
			yolo: "false",
		},
	},
];

export type StackState = {
	projectName: string | null;
	webFrontend: string[];
	nativeFrontend: string[];
	runtime: string;
	backend: string;
	database: string;
	orm: string;
	dbSetup: string;
	auth: string;
	payments: string;
	packageManager: string;
	addons: string[];
	examples: string[];
	git: string;
	install: string;
	api: string;
	webDeploy: string;
	serverDeploy: string;
	yolo: string;
};

export const DEFAULT_STACK: StackState = {
	projectName: "my-better-t-app",
	webFrontend: ["tanstack-router"],
	nativeFrontend: ["none"],
	runtime: "bun",
	backend: "hono",
	database: "sqlite",
	orm: "drizzle",
	dbSetup: "none",
	auth: "better-auth",
	payments: "none",
	packageManager: "bun",
	addons: ["turborepo"],
	examples: [],
	git: "true",
	install: "true",
	api: "trpc",
	webDeploy: "none",
	serverDeploy: "none",
	yolo: "false",
};

export const isStackDefault = <K extends keyof StackState>(
	stack: StackState,
	key: K,
	value: StackState[K],
): boolean => {
	const defaultValue = DEFAULT_STACK[key];

	if (stack.backend === "convex") {
		if (key === "runtime" && value === "none") return true;
		if (key === "database" && value === "none") return true;
		if (key === "orm" && value === "none") return true;
		if (key === "api" && value === "none") return true;
		if (key === "auth" && value === "none") return true;
		if (key === "dbSetup" && value === "none") return true;
		if (
			key === "examples" &&
			Array.isArray(value) &&
			value.length === 1 &&
			value[0] === "todo"
		)
			return true;
	}

	if (
		key === "webFrontend" ||
		key === "nativeFrontend" ||
		key === "addons" ||
		key === "examples"
	) {
		if (Array.isArray(defaultValue) && Array.isArray(value)) {
			const sortedDefault = [...defaultValue].sort();
			const sortedValue = [...value].sort();
			return (
				sortedDefault.length === sortedValue.length &&
				sortedDefault.every((item, index) => item === sortedValue[index])
			);
		}
	}

	if (Array.isArray(defaultValue) && Array.isArray(value)) {
		const sortedDefault = [...defaultValue].sort();
		const sortedValue = [...value].sort();
		return (
			sortedDefault.length === sortedValue.length &&
			sortedDefault.every((item, index) => item === sortedValue[index])
		);
	}

	return defaultValue === value;
};
