import path from "node:path";
import fs from "fs-extra";
import type { AvailableDependencies } from "../constants";
import type { ProjectConfig, ProjectFrontend } from "../types";
import { addPackageDependency } from "../utils/add-package-deps";

export async function setupApi(config: ProjectConfig): Promise<void> {
	const { api, projectName, frontend, backend, packageManager } = config;
	const projectDir = path.resolve(process.cwd(), projectName);
	const isConvex = backend === "convex";
	const webDir = path.join(projectDir, "apps/web");
	const nativeDir = path.join(projectDir, "apps/native");
	const webDirExists = await fs.pathExists(webDir);
	const nativeDirExists = await fs.pathExists(nativeDir);

	const hasReactWeb = frontend.some((f) =>
		["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
	);
	const hasNuxtWeb = frontend.includes("nuxt");
	const hasSvelteWeb = frontend.includes("svelte");

	if (!isConvex && api !== "none") {
		const serverDir = path.join(projectDir, "apps/server");
		const serverDirExists = await fs.pathExists(serverDir);

		if (serverDirExists) {
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
		} else {
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
						dependencies: [
							"@orpc/svelte-query",
							"@orpc/client",
							"@orpc/server",
							"@tanstack/svelte-query",
						],
						projectDir: webDir,
					});
				}
			}
		}

		if (nativeDirExists) {
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

	const reactBasedFrontends: ProjectFrontend[] = [
		"react-router",
		"tanstack-router",
		"tanstack-start",
		"next",
		"native",
	];
	const needsReactQuery = frontend.some((f) => reactBasedFrontends.includes(f));

	if (needsReactQuery && !isConvex) {
		const reactQueryDeps: AvailableDependencies[] = ["@tanstack/react-query"];
		const reactQueryDevDeps: AvailableDependencies[] = [
			"@tanstack/react-query-devtools",
		];

		const hasReactWeb = frontend.some(
			(f) => f !== "native" && reactBasedFrontends.includes(f),
		);
		const hasNative = frontend.includes("native");

		if (hasReactWeb && webDirExists) {
			const webPkgJsonPath = path.join(webDir, "package.json");
			if (await fs.pathExists(webPkgJsonPath)) {
				try {
					await addPackageDependency({
						dependencies: reactQueryDeps,
						devDependencies: reactQueryDevDeps,
						projectDir: webDir,
					});
				} catch (error) {}
			} else {
			}
		}

		if (hasNative && nativeDirExists) {
			const nativePkgJsonPath = path.join(nativeDir, "package.json");
			if (await fs.pathExists(nativePkgJsonPath)) {
				try {
					await addPackageDependency({
						dependencies: reactQueryDeps,
						projectDir: nativeDir,
					});
				} catch (error) {}
			} else {
			}
		}
	}

	if (isConvex) {
		if (webDirExists) {
			const webPkgJsonPath = path.join(webDir, "package.json");
			if (await fs.pathExists(webPkgJsonPath)) {
				try {
					const webDepsToAdd: AvailableDependencies[] = ["convex"];
					if (frontend.includes("tanstack-start")) {
						webDepsToAdd.push("@convex-dev/react-query");
					}
					if (hasSvelteWeb) {
						webDepsToAdd.push("convex-svelte");
					}

					await addPackageDependency({
						dependencies: webDepsToAdd,
						projectDir: webDir,
					});
				} catch (error) {}
			} else {
			}
		}

		if (nativeDirExists) {
			const nativePkgJsonPath = path.join(nativeDir, "package.json");
			if (await fs.pathExists(nativePkgJsonPath)) {
				try {
					await addPackageDependency({
						dependencies: ["convex"],
						projectDir: nativeDir,
					});
				} catch (error) {}
			} else {
			}
		}

		const backendPackageName = `@${projectName}/backend`;
		const backendWorkspaceVersion =
			packageManager === "npm" ? "*" : "workspace:*";
		const addWorkspaceDepManually = async (
			pkgJsonPath: string,
			depName: string,
			depVersion: string,
		) => {
			try {
				const pkgJson = await fs.readJson(pkgJsonPath);
				if (!pkgJson.dependencies) {
					pkgJson.dependencies = {};
				}
				if (pkgJson.dependencies[depName] !== depVersion) {
					pkgJson.dependencies[depName] = depVersion;
					await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 2 });
				} else {
				}
			} catch (error) {}
		};

		if (webDirExists) {
			const webPkgJsonPath = path.join(webDir, "package.json");
			if (await fs.pathExists(webPkgJsonPath)) {
				await addWorkspaceDepManually(
					webPkgJsonPath,
					backendPackageName,
					backendWorkspaceVersion,
				);
			} else {
			}
		}

		if (nativeDirExists) {
			const nativePkgJsonPath = path.join(nativeDir, "package.json");
			if (await fs.pathExists(nativePkgJsonPath)) {
				await addWorkspaceDepManually(
					nativePkgJsonPath,
					backendPackageName,
					backendWorkspaceVersion,
				);
			} else {
			}
		}
	}
}
