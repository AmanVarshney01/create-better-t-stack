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
		} else {
		}

		if (webDirExists) {
			if (hasReactWeb) {
				if (api === "orpc") {
					await addPackageDependency({
						dependencies: [
							"@orpc/tanstack-query",
							"@orpc/client",
							"@orpc/server",
						],
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
						dependencies: [
							"@orpc/tanstack-query",
							"@orpc/client",
							"@orpc/server",
						],
						projectDir: webDir,
					});
				}
			} else if (hasSvelteWeb) {
				if (api === "orpc") {
					await addPackageDependency({
						dependencies: [
							"@orpc/tanstack-query",
							"@orpc/client",
							"@orpc/server",
							"@tanstack/svelte-query",
						],
						projectDir: webDir,
					});
				}
			} else if (hasSolidWeb) {
				if (api === "orpc") {
					await addPackageDependency({
						dependencies: [
							"@orpc/tanstack-query",
							"@orpc/client",
							"@orpc/server",
							"@tanstack/solid-query",
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
					dependencies: [
						"@orpc/tanstack-query",
						"@orpc/client",
						"@orpc/server",
					],
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
		const reactQueryDeps: AvailableDependencies[] = ["@tanstack/react-query"];
		const reactQueryDevDeps: AvailableDependencies[] = [
			"@tanstack/react-query-devtools",
		];

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
			const webPkgJsonPath = path.join(webDir, "package.json");
			if (await fs.pathExists(webPkgJsonPath)) {
				try {
					await addPackageDependency({
						dependencies: reactQueryDeps,
						devDependencies: reactQueryDevDeps,
						projectDir: webDir,
					});
				} catch (_error) {}
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
				} catch (_error) {}
			} else {
			}
		}
	}

	if (needsSolidQuery && !isConvex) {
		const solidQueryDeps: AvailableDependencies[] = ["@tanstack/solid-query"];
		const solidQueryDevDeps: AvailableDependencies[] = [
			"@tanstack/solid-query-devtools",
		];

		if (webDirExists) {
			const webPkgJsonPath = path.join(webDir, "package.json");
			if (await fs.pathExists(webPkgJsonPath)) {
				try {
					await addPackageDependency({
						dependencies: solidQueryDeps,
						devDependencies: solidQueryDevDeps,
						projectDir: webDir,
					});
				} catch (_error) {}
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
				} catch (_error) {}
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
				} catch (_error) {}
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
			} catch (_error) {}
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
