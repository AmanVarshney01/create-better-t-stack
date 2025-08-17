import path from "node:path";
import fs from "fs-extra";
import type { AvailableDependencies } from "../../constants";
import type { Frontend, ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";

export async function setupApi(config: ProjectConfig) {
	const { api, projectName, frontend, backend, packageManager, projectDir } =
		config;
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
	const hasSolidWeb = frontend.includes("solid");

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
		}

		if (webDirExists) {
			if (hasReactWeb) {
				if (api === "orpc") {
					await addPackageDependency({
						dependencies: ["@orpc/tanstack-query", "@orpc/client"],
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
			} else if (hasNuxtWeb && api === "orpc") {
				await addPackageDependency({
					dependencies: [
						"@tanstack/vue-query",
						"@orpc/tanstack-query",
						"@orpc/client",
					],
					devDependencies: ["@tanstack/vue-query-devtools"],
					projectDir: webDir,
				});
			} else if (hasSvelteWeb && api === "orpc") {
				await addPackageDependency({
					dependencies: [
						"@orpc/tanstack-query",
						"@orpc/client",
						"@tanstack/svelte-query",
					],
					devDependencies: ["@tanstack/svelte-query-devtools"],
					projectDir: webDir,
				});
			} else if (hasSolidWeb && api === "orpc") {
				await addPackageDependency({
					dependencies: [
						"@orpc/tanstack-query",
						"@orpc/client",
						"@tanstack/solid-query",
					],
					devDependencies: ["@tanstack/solid-query-devtools"],
					projectDir: webDir,
				});
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
					dependencies: ["@orpc/tanstack-query", "@orpc/client"],
					projectDir: nativeDir,
				});
			}
		}
	}

	const reactBasedFrontends: Frontend[] = [
		"react-router",
		"tanstack-router",
		"tanstack-start",
		"next",
		"native-nativewind",
		"native-unistyles",
	];
	const needsSolidQuery = frontend.includes("solid");
	const needsReactQuery = frontend.some((f) => reactBasedFrontends.includes(f));

	if (needsReactQuery && !isConvex) {
		const hasReactWeb = frontend.some(
			(f) =>
				f !== "native-nativewind" &&
				f !== "native-unistyles" &&
				reactBasedFrontends.includes(f),
		);
		const hasNative =
			frontend.includes("native-nativewind") ||
			frontend.includes("native-unistyles");

		if (hasReactWeb && webDirExists) {
			await addPackageDependency({
				dependencies: ["@tanstack/react-query"],
				devDependencies: ["@tanstack/react-query-devtools"],
				projectDir: webDir,
			});
		}

		if (hasNative && nativeDirExists) {
			await addPackageDependency({
				dependencies: ["@tanstack/react-query"],
				projectDir: nativeDir,
			});
		}
	}

	if (needsSolidQuery && !isConvex && webDirExists) {
		await addPackageDependency({
			dependencies: ["@tanstack/solid-query"],
			devDependencies: ["@tanstack/solid-query-devtools"],
			projectDir: webDir,
		});
	}

	if (isConvex) {
		if (webDirExists) {
			const webDepsToAdd: AvailableDependencies[] = ["convex"];
			if (frontend.includes("tanstack-start")) {
				webDepsToAdd.push("@convex-dev/react-query");
			}
			if (hasSvelteWeb) {
				webDepsToAdd.push("convex-svelte");
			}
			if (hasNuxtWeb) {
				webDepsToAdd.push("convex-nuxt", "convex-vue");
			}
			await addPackageDependency({
				dependencies: webDepsToAdd,
				projectDir: webDir,
			});
		}

		if (nativeDirExists) {
			await addPackageDependency({
				dependencies: ["convex"],
				projectDir: nativeDir,
			});
		}

		const backendPackageName = `@${projectName}/backend`;
		const backendWorkspaceVersion =
			packageManager === "npm" ? "*" : "workspace:*";

		if (webDirExists) {
			const webPkgJsonPath = path.join(webDir, "package.json");
			try {
				const pkgJson = await fs.readJson(webPkgJsonPath);
				if (!pkgJson.dependencies) {
					pkgJson.dependencies = {};
				}
				pkgJson.dependencies[backendPackageName] = backendWorkspaceVersion;
				await fs.writeJson(webPkgJsonPath, pkgJson, { spaces: 2 });
			} catch (_error) {}
		}

		if (nativeDirExists) {
			const nativePkgJsonPath = path.join(nativeDir, "package.json");
			try {
				const pkgJson = await fs.readJson(nativePkgJsonPath);
				if (!pkgJson.dependencies) {
					pkgJson.dependencies = {};
				}
				pkgJson.dependencies[backendPackageName] = backendWorkspaceVersion;
				await fs.writeJson(nativePkgJsonPath, pkgJson, { spaces: 2 });
			} catch (_error) {}
		}
	}
}
