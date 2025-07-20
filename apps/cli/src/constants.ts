import path from "node:path";
import { fileURLToPath } from "node:url";
import type {
	Addons,
	Backend,
	Database,
	Frontend,
	ProjectConfig,
	Runtime,
} from "./types";
import { getUserPkgManager } from "./utils/get-package-manager";

const __filename = fileURLToPath(import.meta.url);
const distPath = path.dirname(__filename);
export const PKG_ROOT = path.join(distPath, "../");

export const DEFAULT_CONFIG: ProjectConfig = {
	projectName: "my-better-t-app",
	projectDir: path.resolve(process.cwd(), "my-better-t-app"),
	relativePath: "my-better-t-app",
	frontend: ["tanstack-router"],
	database: "sqlite",
	orm: "drizzle",
	auth: true,
	addons: ["turborepo"],
	examples: [],
	git: true,
	packageManager: getUserPkgManager(),
	install: true,
	dbSetup: "none",
	backend: "hono",
	runtime: "bun",
	api: "trpc",
	webDeploy: "none",
};

export const dependencyVersionMap = {
	"better-auth": "^1.2.10",
	"@better-auth/expo": "^1.2.10",

	"drizzle-orm": "^0.44.2",
	"drizzle-kit": "^0.31.2",

	"@libsql/client": "^0.15.9",
	"@neondatabase/serverless": "^1.0.1",
	pg: "^8.14.1",
	"@types/pg": "^8.11.11",

	mysql2: "^3.14.0",

	"@prisma/client": "^6.9.0",
	prisma: "^6.9.0",

	mongoose: "^8.14.0",

	"vite-plugin-pwa": "^1.0.1",
	"@vite-pwa/assets-generator": "^1.0.0",

	"@tauri-apps/cli": "^2.4.0",

	"@biomejs/biome": "^2.0.0",

	husky: "^9.1.7",
	"lint-staged": "^15.5.0",

	tsx: "^4.19.2",
	"@types/node": "^22.13.11",

	"@types/bun": "^1.2.6",

	"@elysiajs/node": "^1.2.6",

	"@elysiajs/cors": "^1.2.0",
	"@elysiajs/trpc": "^1.1.0",
	elysia: "^1.2.25",

	"@hono/node-server": "^1.14.4",
	"@hono/trpc-server": "^0.4.0",
	hono: "^4.8.2",

	cors: "^2.8.5",
	express: "^5.1.0",
	"@types/express": "^5.0.1",
	"@types/cors": "^2.8.17",

	fastify: "^5.3.3",
	"@fastify/cors": "^11.0.1",

	turbo: "^2.5.4",

	ai: "^4.3.16",
	"@ai-sdk/google": "^1.2.3",
	"@ai-sdk/vue": "^1.2.8",
	"@ai-sdk/svelte": "^2.1.9",
	"@ai-sdk/react": "^1.2.12",

	"@prisma/extension-accelerate": "^1.3.0",

	"@orpc/server": "^1.5.0",
	"@orpc/client": "^1.5.0",
	"@orpc/tanstack-query": "^1.5.0",

	"@trpc/tanstack-react-query": "^11.4.2",
	"@trpc/server": "^11.4.2",
	"@trpc/client": "^11.4.2",

	convex: "^1.25.0",
	"@convex-dev/react-query": "^0.0.0-alpha.8",
	"convex-svelte": "^0.0.11",

	"@tanstack/svelte-query": "^5.74.4",
	"@tanstack/react-query-devtools": "^5.80.5",
	"@tanstack/react-query": "^5.80.5",

	"@tanstack/solid-query": "^5.75.0",
	"@tanstack/solid-query-devtools": "^5.75.0",

	wrangler: "^4.23.0",
	"@cloudflare/vite-plugin": "^1.9.0",
	"@opennextjs/cloudflare": "^1.3.0",
	"nitro-cloudflare-dev": "^0.2.2",
	"@sveltejs/adapter-cloudflare": "^7.0.4",
} as const;

export type AvailableDependencies = keyof typeof dependencyVersionMap;

export const ADDON_COMPATIBILITY: Record<Addons, Frontend[]> = {
	pwa: ["tanstack-router", "react-router", "solid", "next"],
	tauri: ["tanstack-router", "react-router", "nuxt", "svelte", "solid"],
	biome: [],
	husky: [],
	turborepo: [],
	starlight: [],
	none: [],
} as const;

export type WebFrontend = Exclude<Frontend, "native-nativewind" | "native-unistyles">;

// Web-only frontend frameworks (excludes native frameworks)
export const WEB_FRONTENDS: WebFrontend[] = [
	"tanstack-router",
	"react-router",
	"tanstack-start",
	"next",
	"nuxt",
	"svelte",
	"solid",
	// @TODO - consider Hono with Hono JSX as a front-end framework
] as const;

export const DATABASE_COMPATIBILITY: Record<
	Database,
	{ runtimes: Runtime[]; backends: Backend[] }
> = {
	none: {
		runtimes: ["bun", "node", "workers"],
		backends: [
			"hono",
			"express",
			"fastify",
			"next",
			"elysia",
			"convex",
			"bknd",
			"none",
		],
	},
	sqlite: {
		runtimes: ["bun", "node", "workers"],
		backends: ["hono", "express", "fastify", "next", "elysia", "bknd", "none"],
	},
	postgres: {
		runtimes: ["bun", "node", "workers"],
		backends: ["hono", "express", "fastify", "next", "elysia", "bknd", "none"],
	},
	mysql: {
		runtimes: ["bun", "node", "workers"],
		backends: ["hono", "express", "fastify", "next", "elysia", "none"],
	},
	mongodb: {
		runtimes: ["bun", "node"],
		backends: ["hono", "express", "fastify", "next", "elysia", "none"],
	},
} as const;

// My assumption is that "native-nativewind" and "native-unistyles" are compatible with all
export const BACKEND_COMPATIBILITY: Record<Backend, { frontends: Frontend[] }> =
	{
		none: {
			frontends: [
				"next",
				"nuxt",
				"react-router",
				"solid",
				"svelte",
				"tanstack-router",
				"tanstack-start",
				"native-nativewind",
				"native-unistyles"
			],
		},
		bknd: {
			frontends: ["next", "react-router", "native-nativewind", "native-unistyles"],
		},
		convex: {
			frontends: [
				"next",
				"react-router",
				"svelte",
				"tanstack-router",
				"tanstack-start",
				"native-nativewind",
				"native-unistyles"
			],
		},
		elysia: {
			frontends: [
				"next",
				"nuxt",
				"react-router",
				"solid",
				"svelte",
				"tanstack-router",
				"tanstack-start",
				"native-nativewind",
				"native-unistyles"
			],
		},
		express: {
			frontends: [
				"next",
				"nuxt",
				"react-router",
				"solid",
				"svelte",
				"tanstack-router",
				"tanstack-start",
				"native-nativewind",
				"native-unistyles"
			],
		},
		fastify: {
			frontends: [
				"next",
				"nuxt",
				"react-router",
				"solid",
				"svelte",
				"tanstack-router",
				"tanstack-start",
				"native-nativewind",
				"native-unistyles"
			],
		},
		hono: {
			frontends: [
				"next",
				"nuxt",
				"react-router",
				"solid",
				"svelte",
				"tanstack-router",
				"tanstack-start",
				"native-nativewind",
				"native-unistyles"
			],
		},
		next: {
			frontends: [
				"next",
				"nuxt",
				"react-router",
				"solid",
				"svelte",
				"tanstack-router",
				"tanstack-start",
				"native-nativewind",
				"native-unistyles"
			],
		},
	};

export const BACKEND_DETAILS: Record<Backend, { label: string; hint: string }> =
	{
		hono: {
			label: "Hono",
			hint: "Lightweight, ultrafast web framework",
		},
		next: {
			label: "Next.js",
			hint: "separate api routes only backend",
		},
		express: {
			label: "Express",
			hint: "Fast, unopinionated, minimalist web framework for Node.js",
		},
		fastify: {
			label: "Fastify",
			hint: "Fast, low-overhead web framework for Node.js",
		},
		elysia: {
			label: "Elysia",
			hint: "Ergonomic web framework for building backend servers",
		},
		convex: {
			label: "Convex",
			hint: "Reactive backend-as-a-service platform",
		},
		bknd: {
			label: "bknd",
			hint: "Lightweight backend with instant APIs, auth, and admin UI",
		},
		none: {
			label: "None",
			hint: "No backend server",
		},
	} as const;
