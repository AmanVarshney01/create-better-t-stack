import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Addons, Frontend, ProjectConfig } from "./types";
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

export function getDefaultConfig(): ProjectConfig {
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
	"better-auth": "^1.3.7",
	"@better-auth/expo": "^1.3.7",

	"@clerk/nextjs": "^6.31.5",
	"@clerk/clerk-react": "^5.45.0",
	"@clerk/tanstack-react-start": "^0.23.1",
	"@clerk/clerk-expo": "^2.14.25",

	"drizzle-orm": "^0.44.2",
	"drizzle-kit": "^0.31.2",
	"@planetscale/database": "^1.19.0",

	"@libsql/client": "^0.15.9",

	"@neondatabase/serverless": "^1.0.1",
	pg: "^8.14.1",
	"@types/pg": "^8.11.11",
	"@types/ws": "^8.18.1",
	ws: "^8.18.3",

	mysql2: "^3.14.0",

	"@prisma/client": "^6.15.0",
	prisma: "^6.15.0",
	"@prisma/adapter-d1": "^6.15.0",
	"@prisma/extension-accelerate": "^2.0.2",
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

	ai: "^5.0.39",
	"@ai-sdk/google": "^2.0.13",
	"@ai-sdk/vue": "^2.0.39",
	"@ai-sdk/svelte": "^3.0.39",
	"@ai-sdk/react": "^2.0.39",
	streamdown: "^1.2.0",

	"@orpc/server": "^1.8.6",
	"@orpc/client": "^1.8.6",
	"@orpc/openapi": "^1.8.6",
	"@orpc/zod": "^1.8.6",
	"@orpc/tanstack-query": "^1.8.6",

	"@trpc/tanstack-react-query": "^11.5.0",
	"@trpc/server": "^11.5.0",
	"@trpc/client": "^11.5.0",

	convex: "^1.25.4",
	"@convex-dev/react-query": "^0.0.0-alpha.8",
	"convex-svelte": "^0.0.11",
	"convex-nuxt": "0.1.5",
	"convex-vue": "^0.1.5",

	"@tanstack/svelte-query": "^5.85.3",
	"@tanstack/svelte-query-devtools": "^5.85.3",

	"@tanstack/vue-query-devtools": "^5.83.0",
	"@tanstack/vue-query": "^5.83.0",

	"@tanstack/react-query-devtools": "^5.85.5",
	"@tanstack/react-query": "^5.85.5",

	"@tanstack/solid-query": "^5.75.0",
	"@tanstack/solid-query-devtools": "^5.75.0",
	"@tanstack/solid-router-devtools": "^1.131.25",

	wrangler: "^4.23.0",
	"@cloudflare/vite-plugin": "^1.9.0",
	"@opennextjs/cloudflare": "^1.6.5",
	"nitro-cloudflare-dev": "^0.2.2",
	"@sveltejs/adapter-cloudflare": "^7.2.1",
	"@cloudflare/workers-types": "^4.20250822.0",

	alchemy: "^0.65.1",
	// temporary workaround for alchemy + tanstack start
	nitropack: "^2.12.4",

	dotenv: "^17.2.1",
} as const;

export type AvailableDependencies = keyof typeof dependencyVersionMap;

export const ADDON_COMPATIBILITY: Record<Addons, readonly Frontend[]> = {
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
