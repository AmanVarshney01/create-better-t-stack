import path from "node:path";
import type { AvailableDependencies } from "../../constants";
import type { ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";

export async function setupBackendDependencies(config: ProjectConfig) {
	const { backend, runtime, api, auth, examples, projectDir } = config;

	if (backend === "convex") {
		return;
	}

	const framework = backend;
	const serverDir = path.join(projectDir, "apps/server");

	const dependencies: AvailableDependencies[] = [];
	const devDependencies: AvailableDependencies[] = [];

	// Framework-specific dependencies
	if (framework === "hono") {
		dependencies.push("hono");
		if (api === "trpc") {
			dependencies.push("@hono/trpc-server");
		}

		if (runtime === "node") {
			dependencies.push("@hono/node-server");
			devDependencies.push("tsx", "@types/node");
		}
	} else if (framework === "elysia") {
		dependencies.push("elysia", "@elysiajs/cors");
		if (api === "trpc") {
			dependencies.push("@elysiajs/trpc");
		}
		if (runtime === "node") {
			dependencies.push("@elysiajs/node");
			devDependencies.push("tsx", "@types/node");
		}
	} else if (framework === "express") {
		dependencies.push("express", "cors");
		devDependencies.push("@types/express", "@types/cors");

		if (runtime === "node") {
			devDependencies.push("tsx", "@types/node");
		}
	} else if (framework === "fastify") {
		dependencies.push("fastify", "@fastify/cors");

		if (runtime === "node") {
			devDependencies.push("tsx", "@types/node");
		}
	}

	// API-specific dependencies
	if (api === "trpc") {
		if (framework === "express") {
			dependencies.push("@trpc/server");
		} else if (framework === "fastify") {
			dependencies.push("@trpc/server");
		} else if (runtime === "workers") {
			dependencies.push("@trpc/server");
		}
	} else if (api === "orpc") {
		dependencies.push("@orpc/server", "@orpc/openapi", "@orpc/zod");
	}

	// Auth-specific dependencies
	if (auth === "better-auth") {
		dependencies.push("better-auth");
	}

	// AI example dependencies
	if (examples.includes("ai")) {
		dependencies.push("ai", "@ai-sdk/google");
	}

	// Runtime-specific dependencies
	if (runtime === "bun") {
		devDependencies.push("@types/bun");
	}

	if (dependencies.length > 0 || devDependencies.length > 0) {
		await addPackageDependency({
			dependencies,
			devDependencies,
			projectDir: serverDir,
		});
	}
}
