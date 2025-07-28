import type { TechCategory } from "./types";

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
			icon: "/icon/trpc.svg",
			color: "from-blue-500 to-blue-700",
			default: true,
		},
		{
			id: "orpc",
			name: "oRPC",
			description: "Typesafe APIs Made Simple",
			icon: "/icon/orpc.svg",
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
			icon: "/icon/tanstack.svg",
			color: "from-blue-400 to-blue-600",
			default: true,
		},
		{
			id: "react-router",
			name: "React Router",
			description: "Declarative routing for React",
			icon: "/icon/react-router.svg",
			color: "from-cyan-400 to-cyan-600",
			default: false,
		},
		{
			id: "tanstack-start",
			name: "TanStack Start (vite)",
			description:
				"Full-stack React and Solid framework powered by TanStack Router",
			icon: "/icon/tanstack.svg",
			color: "from-purple-400 to-purple-600",
			default: false,
		},
		{
			id: "next",
			name: "Next.js",
			description: "React framework with hybrid rendering",
			icon: "/icon/nextjs.svg",
			color: "from-gray-700 to-black",
			default: false,
		},
		{
			id: "nuxt",
			name: "Nuxt",
			description: "Vue full-stack framework (SSR, SSG, hybrid)",
			icon: "/icon/nuxt.svg",
			color: "from-green-400 to-green-700",
			default: false,
		},
		{
			id: "svelte",
			name: "Svelte",
			description: "Cybernetically enhanced web apps",
			icon: "/icon/svelte.svg",
			color: "from-orange-500 to-orange-700",
			default: false,
		},
		{
			id: "solid",
			name: "Solid",
			description: "Simple and performant reactivity for building UIs",
			icon: "/icon/solid.svg",
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
			id: "native-nativewind",
			name: "React Native + NativeWind",
			description: "Expo with NativeWind (Tailwind)",
			icon: "/icon/expo.svg",
			color: "from-purple-400 to-purple-600",
			className: "invert-0 dark:invert",
			default: false,
		},
		{
			id: "native-unistyles",
			name: "React Native + Unistyles",
			description: "Expo with Unistyles",
			icon: "/icon/expo.svg",
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
			icon: "/icon/bun.svg",
			color: "from-amber-400 to-amber-600",
			default: true,
		},
		{
			id: "node",
			name: "Node.js",
			description: "JavaScript runtime environment",
			icon: "/icon/node.svg",
			color: "from-green-400 to-green-600",
		},
		{
			id: "workers",
			name: "Cloudflare Workers",
			description: "Serverless runtime for the edge",
			icon: "/icon/workers.svg",
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
			icon: "/icon/hono.svg",
			color: "from-blue-500 to-blue-700",
			default: true,
		},
		{
			id: "next",
			name: "Next.js",
			description: "App Router and API Routes",
			icon: "/icon/nextjs.svg",
			color: "from-gray-700 to-black",
		},
		{
			id: "elysia",
			name: "Elysia",
			description: "TypeScript web framework",
			icon: "/icon/elysia.svg",
			color: "from-purple-500 to-purple-700",
		},
		{
			id: "express",
			name: "Express",
			description: "Popular Node.js framework",
			icon: "/icon/express.svg",
			color: "from-gray-500 to-gray-700",
		},
		{
			id: "fastify",
			name: "Fastify",
			description: "Fast, low-overhead web framework for Node.js",
			icon: "/icon/fastify.svg",
			color: "from-gray-500 to-gray-700",
		},
		{
			id: "convex",
			name: "Convex",
			description: "Reactive backend-as-a-service",
			icon: "/icon/convex.svg",
			color: "from-pink-500 to-pink-700",
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
			icon: "/icon/sqlite.svg",
			color: "from-blue-400 to-cyan-500",
			default: true,
		},
		{
			id: "postgres",
			name: "PostgreSQL",
			description: "Advanced SQL database",
			icon: "/icon/postgres.svg",
			color: "from-indigo-400 to-indigo-600",
		},
		{
			id: "mysql",
			name: "MySQL",
			description: "Popular relational database",
			icon: "/icon/mysql.svg",
			color: "from-blue-500 to-blue-700",
		},
		{
			id: "mongodb",
			name: "MongoDB",
			description: "NoSQL document database",
			icon: "/icon/mongodb.svg",
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
			icon: "/icon/drizzle.svg",
			color: "from-cyan-400 to-cyan-600",
			default: true,
		},
		{
			id: "prisma",
			name: "Prisma",
			description: "Next-gen ORM",
			icon: "/icon/prisma.svg",
			color: "from-purple-400 to-purple-600",
		},
		{
			id: "mongoose",
			name: "Mongoose",
			description: "Elegant object modeling tool",
			icon: "/icon/mongoose.svg",
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
			description: "SQLite cloud database powered by libSQL",
			icon: "/icon/turso.svg",
			color: "from-pink-400 to-pink-600",
		},
		{
			id: "d1",
			name: "Cloudflare D1",
			description: "Serverless SQLite database on Cloudflare Workers",
			icon: "/icon/workers.svg",
			color: "from-orange-400 to-orange-600",
		},
		{
			id: "neon",
			name: "Neon Postgres",
			description: "Serverless PostgreSQL with Neon",
			icon: "/icon/neon.svg",
			color: "from-blue-400 to-blue-600",
		},
		{
			id: "prisma-postgres",
			name: "Prisma PostgreSQL",
			description: "Set up PostgreSQL with Prisma",
			icon: "/icon/prisma.svg",
			color: "from-indigo-400 to-indigo-600",
		},
		{
			id: "mongodb-atlas",
			name: "MongoDB Atlas",
			description: "Cloud MongoDB setup with Atlas",
			icon: "/icon/mongodb.svg",
			color: "from-green-400 to-green-600",
		},
		{
			id: "supabase",
			name: "Supabase",
			description: "Local Supabase stack (requires Docker)",
			icon: "/icon/supabase.svg",
			color: "from-emerald-400 to-emerald-600",
		},
		{
			id: "docker",
			name: "Docker",
			description: "Local database with Docker Compose",
			icon: "/icon/docker.svg",
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
			id: "workers",
			name: "Cloudflare Workers",
			description: "Deploy to Cloudflare Workers",
			icon: "/icon/workers.svg",
			color: "from-orange-400 to-orange-600",
		},
		{
			id: "none",
			name: "No Deployment",
			description: "Skip deployment configuration",
			icon: "",
			color: "from-gray-400 to-gray-600",
			default: true,
		},
	],
	auth: [
		{
			id: "true",
			name: "Better Auth",
			description: "Simple authentication",
			icon: "/icon/better-auth.svg",
			color: "from-green-400 to-green-600",
			default: true,
		},
		{
			id: "false",
			name: "No Auth",
			description: "Skip authentication",
			icon: "",
			color: "from-red-400 to-red-600",
		},
	],
	packageManager: [
		{
			id: "npm",
			name: "npm",
			description: "Default package manager",
			icon: "/icon/npm.svg",
			color: "from-red-500 to-red-700",
			className: "invert-0 dark:invert",
		},
		{
			id: "pnpm",
			name: "pnpm",
			description: "Fast, disk space efficient",
			icon: "/icon/pnpm.svg",
			color: "from-orange-500 to-orange-700",
		},
		{
			id: "bun",
			name: "bun",
			description: "All-in-one toolkit",
			icon: "/icon/bun.svg",
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
			icon: "/icon/tauri.svg",
			color: "from-amber-500 to-amber-700",
			default: false,
		},
		{
			id: "starlight",
			name: "Starlight",
			description: "Build stellar docs with astro",
			icon: "/icon/starlight.svg",
			color: "from-teal-500 to-teal-700",
			default: false,
		},
		{
			id: "biome",
			name: "Biome",
			description: "Format, lint, and more",
			icon: "/icon/biome.svg",
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
			icon: "/icon/ultracite.svg",
			color: "from-blue-500 to-blue-700",
			className: "invert-0 dark:invert",
			default: false,
		},
		{
			id: "fumadocs",
			name: "Fumadocs",
			description: "Build excellent documentation site",
			icon: "",
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
			id: "turborepo",
			name: "Turborepo",
			description: "High-performance build system",
			icon: "/icon/turborepo.svg",
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
			icon: "/icon/git.svg",
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
			auth: "true",
			packageManager: "bun",
			addons: ["turborepo"],
			examples: [],
			git: "true",
			install: "true",
			api: "trpc",
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
			auth: "false",
			packageManager: "bun",
			addons: ["turborepo"],
			examples: ["todo"],
			git: "true",
			install: "true",
			api: "none",
		},
	},
	{
		id: "native-app",
		name: "Mobile App",
		description: "React Native with Expo and SQLite database",
		stack: {
			projectName: "my-better-t-app",
			webFrontend: ["none"],
			nativeFrontend: ["native-nativewind"],
			runtime: "bun",
			backend: "hono",
			database: "sqlite",
			orm: "drizzle",
			dbSetup: "none",
			auth: "true",
			packageManager: "bun",
			addons: ["turborepo"],
			examples: [],
			git: "true",
			install: "true",
			api: "trpc",
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
			auth: "true",
			packageManager: "bun",
			addons: ["turborepo"],
			examples: [],
			git: "true",
			install: "true",
			api: "trpc",
		},
	},
	{
		id: "full-featured",
		name: "Full Featured",
		description: "Complete setup with web, native, Turso, and addons",
		stack: {
			projectName: "my-better-t-app",
			webFrontend: ["tanstack-router"],
			nativeFrontend: ["native-nativewind"],
			runtime: "bun",
			backend: "hono",
			database: "sqlite",
			orm: "drizzle",
			dbSetup: "turso",
			auth: "true",
			packageManager: "bun",
			addons: ["pwa", "biome", "husky", "tauri", "starlight", "turborepo"],
			examples: ["todo", "ai"],
			git: "true",
			install: "true",
			api: "trpc",
		},
	},
];

export type StackState = {
	projectName: string;
	webFrontend: string[];
	nativeFrontend: string[];
	runtime: string;
	backend: string;
	database: string;
	orm: string;
	dbSetup: string;
	auth: string;
	packageManager: string;
	addons: string[];
	examples: string[];
	git: string;
	install: string;
	api: string;
	webDeploy: string;
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
	auth: "true",
	packageManager: "bun",
	addons: ["turborepo"],
	examples: [],
	git: "true",
	install: "true",
	api: "trpc",
	webDeploy: "none",
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
		if (key === "auth" && value === "false") return true;
		if (key === "dbSetup" && value === "none") return true;
		if (
			key === "examples" &&
			Array.isArray(value) &&
			value.length === 1 &&
			value[0] === "todo"
		)
			return true;
	}

	if (key === "webFrontend" && stack.webFrontend) {
		if (key === "webFrontend") {
			const defaultWeb = (DEFAULT_STACK.webFrontend as string[]).sort();
			const valueWeb = (value as string[]).sort();
			return (
				defaultWeb.length === valueWeb.length &&
				defaultWeb.every((item, index) => item === valueWeb[index])
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
