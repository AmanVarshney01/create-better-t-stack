import path from "node:path";
import type { AvailableDependencies } from "../../constants";
import type { ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";

export async function setupBackendDependencies(config: ProjectConfig) {
	const { backend, runtime, api, auth, examples, projectDir } = config;

	if (backend === "convex") {
		const convexBackendDir = path.join(projectDir, "packages/backend");
		await addPackageDependency({
			dependencies: ["convex"],
			projectDir: convexBackendDir,
		});
		return;
	}

	const framework = backend;
	const serverDir = path.join(projectDir, "apps/server");

	const dependencies: AvailableDependencies[] = [];
	const devDependencies: AvailableDependencies[] = [];

	if (framework === "hono") {
		dependencies.push("hono");
		if (runtime === "node") {
			dependencies.push("@hono/node-server");
		}
	} else if (framework === "elysia") {
		dependencies.push("elysia", "@elysiajs/cors");
		if (runtime === "node") {
			dependencies.push("@elysiajs/node");
		}
	} else if (framework === "express") {
		dependencies.push("express", "cors");
		devDependencies.push("@types/express", "@types/cors");
	} else if (framework === "fastify") {
		dependencies.push("fastify", "@fastify/cors");
	}

	if (api === "trpc") {
		dependencies.push("@trpc/server");
		if (framework === "hono") {
			dependencies.push("@hono/trpc-server");
		} else if (framework === "elysia") {
			dependencies.push("@elysiajs/trpc");
		}
	} else if (api === "orpc") {
		dependencies.push("@orpc/server", "@orpc/openapi", "@orpc/zod");
	}

	if (auth === "better-auth") {
		dependencies.push("better-auth");
	}

	if (examples.includes("ai")) {
		dependencies.push("ai", "@ai-sdk/google");
	}

	if (runtime === "node") {
		devDependencies.push("tsx", "@types/node");
	} else if (runtime === "bun") {
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
