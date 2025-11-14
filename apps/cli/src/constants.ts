import path from "node:path";
import { fileURLToPath } from "node:url";
import { getUserPkgManager } from "./utils/get-package-manager";

const __filename = fileURLToPath(import.meta.url);
const distPath = path.dirname(__filename);
export const PKG_ROOT = path.join(distPath, "../");

export const DEFAULT_CONFIG_BASE = {
	projectName: "my-better-t-app",
	relativePath: "my-better-t-app",
	frontend: ["tanstack-router"],
	database: "sqlite",
	orm: "drizzle",
	auth: "better-auth",
	payments: "none",
	addons: ["turborepo"],
	examples: [],
	git: true,
	install: true,
	dbSetup: "none",
	backend: "hono",
	runtime: "bun",
	api: "trpc",
	webDeploy: "none",
	serverDeploy: "none",
} as const;

export function getDefaultConfig() {
	return {
		...DEFAULT_CONFIG_BASE,
		projectDir: path.resolve(process.cwd(), DEFAULT_CONFIG_BASE.projectName),
		packageManager: getUserPkgManager(),
		frontend: [...DEFAULT_CONFIG_BASE.frontend],
		addons: [...DEFAULT_CONFIG_BASE.addons],
		examples: [...DEFAULT_CONFIG_BASE.examples],
	};
}

export const DEFAULT_CONFIG = getDefaultConfig();

export const dependencyVersionMap = {
	"better-auth": "^1.3.28",
	"@better-auth/expo": "^1.3.28",

	"@clerk/nextjs": "^6.31.5",
	"@clerk/clerk-react": "^5.45.0",
	"@clerk/tanstack-react-start": "^0.26.3",
	"@clerk/clerk-expo": "^2.14.25",

	"drizzle-orm": "^0.44.2",
	"drizzle-kit": "^0.31.2",
	"@planetscale/database": "^1.19.0",

	"@libsql/client": "^0.14.0",

	"@neondatabase/serverless": "^1.0.1",
	pg: "^8.14.1",
	"@types/pg": "^8.11.11",
	"@types/ws": "^8.18.1",
	ws: "^8.18.3",

	mysql2: "^3.14.0",

	"@prisma/client": "^6.15.0",
	prisma: "^6.15.0",
	"@prisma/adapter-d1": "^6.15.0",
	"@prisma/adapter-libsql": "^6.15.0",

	"@prisma/adapter-planetscale": "^6.15.0",

	mongoose: "^8.14.0",

	"vite-plugin-pwa": "^1.0.1",
	"@vite-pwa/assets-generator": "^1.0.0",

	"@tauri-apps/cli": "^2.4.0",

	"@biomejs/biome": "^2.2.0",
	oxlint: "^1.12.0",

	husky: "^9.1.7",
	"lint-staged": "^16.1.2",

	tsx: "^4.19.2",
	"@types/node": "^22.13.11",

	"@types/bun": "^1.2.6",

	"@elysiajs/node": "^1.3.1",

	"@elysiajs/cors": "^1.3.3",
	"@elysiajs/trpc": "^1.1.0",
	elysia: "^1.3.21",

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

	ai: "^5.0.49",
	"@ai-sdk/google": "^2.0.13",
	"@ai-sdk/vue": "^2.0.49",
	"@ai-sdk/svelte": "^3.0.39",
	"@ai-sdk/react": "^2.0.39",
	streamdown: "^1.3.0",
	shiki: "^3.12.2",

	"@orpc/server": "^1.10.0",
	"@orpc/client": "^1.10.0",
	"@orpc/openapi": "^1.10.0",
	"@orpc/zod": "^1.10.0",
	"@orpc/tanstack-query": "^1.10.0",

	"@trpc/tanstack-react-query": "^11.5.0",
	"@trpc/server": "^11.5.0",
	"@trpc/client": "^11.5.0",

	next: "15.5.4",

	convex: "^1.27.0",
	"@convex-dev/react-query": "^0.0.0-alpha.8",
	"convex-svelte": "^0.0.11",
	"convex-nuxt": "0.1.5",
	"convex-vue": "^0.1.5",
	"@convex-dev/better-auth": "^0.9.1",

	"@tanstack/svelte-query": "^5.85.3",
	"@tanstack/svelte-query-devtools": "^5.85.3",

	"@tanstack/vue-query-devtools": "^5.90.2",
	"@tanstack/vue-query": "^5.90.2",

	"@tanstack/react-query-devtools": "^5.85.5",
	"@tanstack/react-query": "^5.85.5",

	"@tanstack/solid-query": "^5.87.4",
	"@tanstack/solid-query-devtools": "^5.87.4",
	"@tanstack/solid-router-devtools": "^1.131.44",

	wrangler: "^4.40.3",
	"@cloudflare/vite-plugin": "^1.13.8",
	"@opennextjs/cloudflare": "^1.6.5",
	"nitro-cloudflare-dev": "^0.2.2",
	"@sveltejs/adapter-cloudflare": "^7.2.1",
	"@cloudflare/workers-types": "^4.20250822.0",

	alchemy: "^0.77.0",

	dotenv: "^17.2.2",
	tsdown: "^0.15.5",
	zod: "^4.1.11",
	srvx: "0.8.15",

	"@polar-sh/better-auth": "^1.1.3",
	"@polar-sh/sdk": "^0.34.16",
} as const;

export type AvailableDependencies = keyof typeof dependencyVersionMap;

export const ADDON_COMPATIBILITY = {
	pwa: ["tanstack-router", "react-router", "solid", "next"],
	tauri: ["tanstack-router", "react-router", "nuxt", "svelte", "solid", "next"],
	biome: [],
	husky: [],
	turborepo: [],
	starlight: [],
	ultracite: [],
	ruler: [],
	oxlint: [],
	fumadocs: [],
	none: [],
} as const;
