import path from "node:path";
import fs from "fs-extra";
import type { AvailableDependencies } from "../../constants";
import type { ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";

export async function setupWorkspaceDependencies(
	projectDir: string,
	options: ProjectConfig,
) {
	const projectName = options.projectName;
	const workspaceVersion =
		options.packageManager === "npm" ? "*" : "workspace:*";

	const commonDeps: AvailableDependencies[] = ["dotenv", "zod"];
	const commonDevDeps: AvailableDependencies[] = [];

	const configPackageDir = path.join(projectDir, "packages/config");
	const configDep: Record<string, string> = {};
	if (await fs.pathExists(configPackageDir)) {
		configDep[`@${projectName}/config`] = workspaceVersion;
	}

	const dbPackageDir = path.join(projectDir, "packages/db");
	if (await fs.pathExists(dbPackageDir)) {
		await addPackageDependency({
			dependencies: commonDeps,
			devDependencies: commonDevDeps,
			customDevDependencies: configDep,
			projectDir: dbPackageDir,
		});
	}

	const authPackageDir = path.join(projectDir, "packages/auth");
	if (await fs.pathExists(authPackageDir)) {
		const authDeps: Record<string, string> = {};
		if (options.database !== "none" && (await fs.pathExists(dbPackageDir))) {
			authDeps[`@${projectName}/db`] = workspaceVersion;
		}

		await addPackageDependency({
			dependencies: commonDeps,
			devDependencies: commonDevDeps,
			customDependencies: authDeps,
			customDevDependencies: configDep,
			projectDir: authPackageDir,
		});
	}

	const apiPackageDir = path.join(projectDir, "packages/api");
	if (await fs.pathExists(apiPackageDir)) {
		const apiDeps: Record<string, string> = {};
		if (options.auth !== "none" && (await fs.pathExists(authPackageDir))) {
			apiDeps[`@${projectName}/auth`] = workspaceVersion;
		}
		if (options.database !== "none" && (await fs.pathExists(dbPackageDir))) {
			apiDeps[`@${projectName}/db`] = workspaceVersion;
		}

		await addPackageDependency({
			dependencies: commonDeps,
			devDependencies: commonDevDeps,
			customDependencies: apiDeps,
			customDevDependencies: configDep,
			projectDir: apiPackageDir,
		});
	}

	const serverPackageDir = path.join(projectDir, "apps/server");
	if (await fs.pathExists(serverPackageDir)) {
		const serverDeps: Record<string, string> = {};
		if (options.api !== "none" && (await fs.pathExists(apiPackageDir))) {
			serverDeps[`@${projectName}/api`] = workspaceVersion;
		}
		if (options.auth !== "none" && (await fs.pathExists(authPackageDir))) {
			serverDeps[`@${projectName}/auth`] = workspaceVersion;
		}
		if (options.database !== "none" && (await fs.pathExists(dbPackageDir))) {
			serverDeps[`@${projectName}/db`] = workspaceVersion;
		}

		await addPackageDependency({
			dependencies: commonDeps,
			devDependencies: [...commonDevDeps, "tsdown"],
			customDependencies: serverDeps,
			customDevDependencies: configDep,
			projectDir: serverPackageDir,
		});
	}

	const webPackageDir = path.join(projectDir, "apps/web");

	if (await fs.pathExists(webPackageDir)) {
		const webDeps: Record<string, string> = {};
		if (options.api !== "none" && (await fs.pathExists(apiPackageDir))) {
			webDeps[`@${projectName}/api`] = workspaceVersion;
		}
		if (options.auth !== "none" && (await fs.pathExists(authPackageDir))) {
			webDeps[`@${projectName}/auth`] = workspaceVersion;
		}

		if (Object.keys(webDeps).length > 0) {
			await addPackageDependency({
				customDependencies: webDeps,
				customDevDependencies: configDep,
				projectDir: webPackageDir,
			});
		}
	}

	const nativePackageDir = path.join(projectDir, "apps/native");

	if (await fs.pathExists(nativePackageDir)) {
		const nativeDeps: Record<string, string> = {};
		if (options.api !== "none" && (await fs.pathExists(apiPackageDir))) {
			nativeDeps[`@${projectName}/api`] = workspaceVersion;
		}

		if (Object.keys(nativeDeps).length > 0) {
			await addPackageDependency({
				customDependencies: nativeDeps,
				customDevDependencies: configDep,
				projectDir: nativePackageDir,
			});
		}
	}

	const runtimeDevDeps = getRuntimeDevDeps(options);

	await addPackageDependency({
		dependencies: commonDeps,
		devDependencies: [...commonDevDeps, ...runtimeDevDeps],
		projectDir,
	});
}

function getRuntimeDevDeps(options: ProjectConfig): AvailableDependencies[] {
	const { runtime, backend } = options;

	if (runtime === "none" && backend === "self") {
		return ["@types/node"];
	}

	if (runtime === "node") {
		return ["@types/node"];
	}

	if (runtime === "bun") {
		return ["@types/bun"];
	}

	if (runtime === "workers") {
		return ["@types/node"];
	}

	return [];
}
