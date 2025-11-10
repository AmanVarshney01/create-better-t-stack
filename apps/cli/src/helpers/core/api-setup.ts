import path from "node:path";
import fs from "fs-extra";
import type { AvailableDependencies } from "../../constants";
import type { API, Backend, Frontend, ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";

async function addBackendWorkspaceDependency(
	projectDir: string,
	backendPackageName: string,
	workspaceVersion: string,
) {
	const pkgJsonPath = path.join(projectDir, "package.json");
	try {
		const pkgJson = await fs.readJson(pkgJsonPath);
		if (!pkgJson.dependencies) {
			pkgJson.dependencies = {};
		}
		pkgJson.dependencies[backendPackageName] = workspaceVersion;
		await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 2 });
	} catch (_error) {}
}

function getFrontendType(frontend: Frontend[]): {
	hasReactWeb: boolean;
	hasNuxtWeb: boolean;
	hasSvelteWeb: boolean;
	hasSolidWeb: boolean;
	hasNative: boolean;
} {
	const reactBasedFrontends = [
		"tanstack-router",
		"react-router",
		"tanstack-start",
		"next",
	];
	const nativeFrontends = ["native-bare", "native-uniwind", "native-unistyles"];

	return {
		hasReactWeb: frontend.some((f) => reactBasedFrontends.includes(f)),
		hasNuxtWeb: frontend.includes("nuxt"),
		hasSvelteWeb: frontend.includes("svelte"),
		hasSolidWeb: frontend.includes("solid"),
		hasNative: frontend.some((f) => nativeFrontends.includes(f)),
	};
}

function getApiDependencies(
	api: API,
	frontendType: ReturnType<typeof getFrontendType>,
	backend: Backend,
) {
	const deps: Record<
		string,
		{ dependencies: string[]; devDependencies?: string[] }
	> = {};

	if (api === "orpc") {
		deps.server = {
			dependencies: [
				"@orpc/server",
				"@orpc/client",
				"@orpc/openapi",
				"@orpc/zod",
			],
		};
	} else if (api === "trpc") {
		deps.server = { dependencies: ["@trpc/server", "@trpc/client"] };
	}

	if (backend !== "self" && backend !== "convex" && backend !== "none") {
		if (!deps.server) {
			deps.server = { dependencies: [] };
		}

		if (backend === "hono") {
			deps.server.dependencies.push("hono");
		} else if (backend === "elysia") {
			deps.server.dependencies.push("elysia");
		}
	}

	if (frontendType.hasReactWeb) {
		if (api === "orpc") {
			deps.web = {
				dependencies: ["@orpc/tanstack-query", "@orpc/client", "@orpc/server"],
			};
		} else if (api === "trpc") {
			deps.web = {
				dependencies: [
					"@trpc/tanstack-react-query",
					"@trpc/client",
					"@trpc/server",
				],
			};
		}
	} else if (frontendType.hasNuxtWeb && api === "orpc") {
		deps.web = {
			dependencies: [
				"@tanstack/vue-query",
				"@orpc/tanstack-query",
				"@orpc/client",
				"@orpc/server",
			],
			devDependencies: ["@tanstack/vue-query-devtools"],
		};
	} else if (frontendType.hasSvelteWeb && api === "orpc") {
		deps.web = {
			dependencies: [
				"@orpc/tanstack-query",
				"@orpc/client",
				"@orpc/server",
				"@tanstack/svelte-query",
			],
			devDependencies: ["@tanstack/svelte-query-devtools"],
		};
	} else if (frontendType.hasSolidWeb && api === "orpc") {
		deps.web = {
			dependencies: [
				"@orpc/tanstack-query",
				"@orpc/client",
				"@orpc/server",
				"@tanstack/solid-query",
			],
			devDependencies: [
				"@tanstack/solid-query-devtools",
				"@tanstack/solid-router-devtools",
			],
		};
	}

	if (api === "trpc") {
		deps.native = {
			dependencies: [
				"@trpc/tanstack-react-query",
				"@trpc/client",
				"@trpc/server",
			],
		};
	} else if (api === "orpc") {
		deps.native = { dependencies: ["@orpc/tanstack-query", "@orpc/client"] };
	}

	return deps;
}

function getQueryDependencies(frontend: Frontend[]) {
	const reactBasedFrontends: Frontend[] = [
		"react-router",
		"tanstack-router",
		"tanstack-start",
		"next",
		"native-bare",
		"native-uniwind",
		"native-unistyles",
	];

	const deps: Record<
		string,
		{ dependencies: string[]; devDependencies?: string[] }
	> = {};

	const needsReactQuery = frontend.some((f) => reactBasedFrontends.includes(f));
	if (needsReactQuery) {
		const hasReactWeb = frontend.some(
			(f) =>
				f !== "native-bare" &&
				f !== "native-uniwind" &&
				f !== "native-unistyles" &&
				reactBasedFrontends.includes(f),
		);
		const hasNative =
			frontend.includes("native-bare") ||
			frontend.includes("native-uniwind") ||
			frontend.includes("native-unistyles");

		if (hasReactWeb) {
			deps.web = {
				dependencies: ["@tanstack/react-query"],
				devDependencies: ["@tanstack/react-query-devtools"],
			};
		}
		if (hasNative) {
			deps.native = { dependencies: ["@tanstack/react-query"] };
		}
	}

	if (frontend.includes("solid")) {
		deps.web = {
			dependencies: ["@tanstack/solid-query"],
			devDependencies: [
				"@tanstack/solid-query-devtools",
				"@tanstack/solid-router-devtools",
			],
		};
	}

	return deps;
}

function getConvexDependencies(frontend: Frontend[]) {
	const deps: Record<string, { dependencies: string[] }> = {
		web: { dependencies: ["convex"] },
		native: { dependencies: ["convex"] },
	};

	if (frontend.includes("tanstack-start")) {
		deps.web.dependencies.push("@convex-dev/react-query");
	}
	if (frontend.includes("svelte")) {
		deps.web.dependencies.push("convex-svelte");
	}
	if (frontend.includes("nuxt")) {
		deps.web.dependencies.push("convex-nuxt", "convex-vue");
	}

	return deps;
}

export async function setupApi(config: ProjectConfig) {
	const { api, projectName, frontend, backend, packageManager, projectDir } =
		config;
	const isConvex = backend === "convex";

	const webDir = path.join(projectDir, "apps/web");
	const nativeDir = path.join(projectDir, "apps/native");
	const serverDir = path.join(projectDir, "apps/server");

	const webDirExists = await fs.pathExists(webDir);
	const nativeDirExists = await fs.pathExists(nativeDir);
	const _serverDirExists = await fs.pathExists(serverDir);

	const frontendType = getFrontendType(frontend);

	if (!isConvex && api !== "none") {
		const apiDeps = getApiDependencies(api, frontendType, backend);
		const apiPackageDir = path.join(projectDir, "packages/api");

		if (apiDeps.server) {
			await addPackageDependency({
				dependencies: apiDeps.server.dependencies as AvailableDependencies[],
				projectDir: apiPackageDir,
			});

			if (backend === "self" && webDirExists) {
				await addPackageDependency({
					dependencies: apiDeps.server.dependencies as AvailableDependencies[],
					projectDir: webDir,
				});
			}

			if (backend === "self") {
				const frameworkDeps: AvailableDependencies[] = [];
				if (frontend.includes("next")) {
					frameworkDeps.push("next");
				}

				if (frameworkDeps.length > 0) {
					await addPackageDependency({
						dependencies: frameworkDeps,
						projectDir: apiPackageDir,
					});
				}
			}
		}

		if (
			config.auth === "better-auth" &&
			(backend === "express" || backend === "fastify")
		) {
			await addPackageDependency({
				dependencies: ["better-auth"],
				projectDir: apiPackageDir,
			});
		}

		if (backend === "express") {
			await addPackageDependency({
				devDependencies: ["@types/express"],
				projectDir: apiPackageDir,
			});
		}

		if (webDirExists && apiDeps.web) {
			await addPackageDependency({
				dependencies: apiDeps.web.dependencies as AvailableDependencies[],
				devDependencies: apiDeps.web.devDependencies as AvailableDependencies[],
				projectDir: webDir,
			});
		}

		if (nativeDirExists && apiDeps.native) {
			await addPackageDependency({
				dependencies: apiDeps.native.dependencies as AvailableDependencies[],
				projectDir: nativeDir,
			});
		}
	}

	if (!isConvex) {
		const queryDeps = getQueryDependencies(frontend);

		if (webDirExists && queryDeps.web) {
			await addPackageDependency({
				dependencies: queryDeps.web.dependencies as AvailableDependencies[],
				devDependencies: queryDeps.web
					.devDependencies as AvailableDependencies[],
				projectDir: webDir,
			});
		}

		if (nativeDirExists && queryDeps.native) {
			await addPackageDependency({
				dependencies: queryDeps.native.dependencies as AvailableDependencies[],
				projectDir: nativeDir,
			});
		}
	}

	if (isConvex) {
		const convexDeps = getConvexDependencies(frontend);

		if (webDirExists) {
			await addPackageDependency({
				dependencies: convexDeps.web.dependencies as AvailableDependencies[],
				projectDir: webDir,
			});
		}

		if (nativeDirExists) {
			await addPackageDependency({
				dependencies: convexDeps.native.dependencies as AvailableDependencies[],
				projectDir: nativeDir,
			});
		}

		const backendPackageName = `@${projectName}/backend`;
		const backendWorkspaceVersion =
			packageManager === "npm" ? "*" : "workspace:*";

		if (webDirExists) {
			await addBackendWorkspaceDependency(
				webDir,
				backendPackageName,
				backendWorkspaceVersion,
			);
		}

		if (nativeDirExists) {
			await addBackendWorkspaceDependency(
				nativeDir,
				backendPackageName,
				backendWorkspaceVersion,
			);
		}
	}
}
