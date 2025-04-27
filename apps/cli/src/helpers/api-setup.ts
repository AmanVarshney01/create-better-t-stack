import * as path from "node:path";
import fs from "fs-extra";
import type { ProjectConfig } from "../types";
import { addPackageDependency } from "../utils/add-package-deps";

export async function setupApi(config: ProjectConfig): Promise<void> {
	const { api, projectName, frontend } = config;
	const projectDir = path.resolve(process.cwd(), projectName);
	const webDir = path.join(projectDir, "apps/web");
	const serverDir = path.join(projectDir, "apps/server");
	const webDirExists = await fs.pathExists(webDir);
	const hasReactWeb = frontend.some((f) =>
		["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
	);
	const hasNuxtWeb = frontend.includes("nuxt");
	const hasSvelteWeb = frontend.includes("svelte");

	if (api === "orpc") {
		await addPackageDependency({
			dependencies: ["@orpc/server", "@orpc/client"],
			projectDir: serverDir,
		});
	} else if (api === "trpc") {
		await addPackageDependency({
			dependencies: ["@trpc/server", "@trpc/client"],
			projectDir: serverDir,
		});
		if (config.backend === "hono") {
			await addPackageDependency({
				dependencies: ["@hono/trpc-server"],
				projectDir: serverDir,
			});
		} else if (config.backend === "elysia") {
			await addPackageDependency({
				dependencies: ["@elysiajs/trpc"],
				projectDir: serverDir,
			});
		}
	}

	if (webDirExists) {
		if (hasReactWeb) {
			if (api === "orpc") {
				await addPackageDependency({
					dependencies: ["@orpc/react-query", "@orpc/client", "@orpc/server"],
					projectDir: webDir,
				});
			} else if (api === "trpc") {
				await addPackageDependency({
					dependencies: [
						"@trpc/tanstack-react-query",
						"@trpc/client",
						"@trpc/server",
					],
					projectDir: webDir,
				});
			}
		} else if (hasNuxtWeb) {
			if (api === "orpc") {
				await addPackageDependency({
					dependencies: ["@orpc/vue-query", "@orpc/client", "@orpc/server"],
					projectDir: webDir,
				});
			}
		} else if (hasSvelteWeb) {
			if (api === "orpc") {
				await addPackageDependency({
					dependencies: ["@orpc/svelte-query", "@orpc/client", "@orpc/server"],
					projectDir: webDir,
				});
			}
		}
	}

	if (frontend.includes("native")) {
		const nativeDir = path.join(projectDir, "apps/native");
		if (await fs.pathExists(nativeDir)) {
			if (api === "trpc") {
				await addPackageDependency({
					dependencies: [
						"@trpc/tanstack-react-query",
						"@trpc/client",
						"@trpc/server",
					],
					projectDir: nativeDir,
				});
			} else if (api === "orpc") {
				await addPackageDependency({
					dependencies: ["@orpc/react-query", "@orpc/client", "@orpc/server"],
					projectDir: nativeDir,
				});
			}
		}
	}
}
