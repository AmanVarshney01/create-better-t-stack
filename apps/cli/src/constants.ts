import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Addons, Frontend, ProjectConfig } from "./types";
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
	"better-auth": "^1.3.4",
	"@better-auth/expo": "^1.3.4",

	"drizzle-orm": "^0.44.2",
	"drizzle-kit": "^0.31.2",

	"@libsql/client": "^0.15.9",

	"@neondatabase/serverless": "^1.0.1",
	pg: "^8.14.1",
	"@types/pg": "^8.11.11",
	"@types/ws": "^8.18.1",
	ws: "^8.18.3",

	mysql2: "^3.14.0",

	"@prisma/client": "^6.13.0",
	prisma: "^6.13.0",
	"@prisma/extension-accelerate": "^2.0.2",

	mongoose: "^8.14.0",

	"vite-plugin-pwa": "^1.0.1",
	"@vite-pwa/assets-generator": "^1.0.0",

	"@tauri-apps/cli": "^2.4.0",

	"@biomejs/biome": "^2.1.2",
	oxlint: "^1.8.0",
	ultracite: "5.1.1",

	husky: "^9.1.7",
	"lint-staged": "^16.1.2",

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

export const ADDON_COMPATIBILITY: Record<Addons, readonly Frontend[]> = {
	pwa: ["tanstack-router", "react-router", "solid", "next"],
	tauri: ["tanstack-router", "react-router", "nuxt", "svelte", "solid"],
	biome: [],
	husky: [],
	turborepo: [],
	starlight: [],
	ultracite: [],
	oxlint: [],
	fumadocs: [],
	none: [],
} as const;

// TODO: need to refactor this
export const WEB_FRAMEWORKS: readonly Frontend[] = [
	"tanstack-router",
	"react-router",
	"tanstack-start",
	"next",
	"nuxt",
	"svelte",
	"solid",
];
