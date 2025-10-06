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
	const commonDevDeps: AvailableDependencies[] = ["tsdown"];

	const dbPackageDir = path.join(projectDir, "packages/db");
	if (await fs.pathExists(dbPackageDir)) {
		await addPackageDependency({
			dependencies: commonDeps,
			devDependencies: commonDevDeps,
			projectDir: dbPackageDir,
		});
	}

	const authPackageDir = path.join(projectDir, "packages/auth");
	if (await fs.pathExists(authPackageDir)) {
		await addPackageDependency({
			dependencies: commonDeps,
			devDependencies: commonDevDeps,
			customDependencies: {
				[`@${projectName}/db`]: workspaceVersion,
			},
			projectDir: authPackageDir,
		});
	}

	const apiPackageDir = path.join(projectDir, "packages/api");
	if (await fs.pathExists(apiPackageDir)) {
		await addPackageDependency({
			dependencies: commonDeps,
			devDependencies: commonDevDeps,
			customDependencies: {
				[`@${projectName}/auth`]: workspaceVersion,
				[`@${projectName}/db`]: workspaceVersion,
			},
			projectDir: apiPackageDir,
		});
	}

	const serverPackageDir = path.join(projectDir, "apps/server");
	if (await fs.pathExists(serverPackageDir)) {
		await addPackageDependency({
			dependencies: commonDeps,
			devDependencies: commonDevDeps,
			customDependencies: {
				[`@${projectName}/api`]: workspaceVersion,
				[`@${projectName}/auth`]: workspaceVersion,
				[`@${projectName}/db`]: workspaceVersion,
			},
			projectDir: serverPackageDir,
		});
	}

	const webPackageDir = path.join(projectDir, "apps/web");

	if (await fs.pathExists(webPackageDir)) {
		const webDeps: Record<string, string> = {};

		webDeps[`@${projectName}/api`] = workspaceVersion;
		webDeps[`@${projectName}/auth`] = workspaceVersion;
		webDeps[`@${projectName}/db`] = workspaceVersion;

		if (Object.keys(webDeps).length > 0) {
			await addPackageDependency({
				customDependencies: webDeps,
				projectDir: webPackageDir,
			});
		}
	}

	const nativePackageDir = path.join(projectDir, "apps/native");

	if (await fs.pathExists(nativePackageDir)) {
		const nativeDeps: Record<string, string> = {};

		nativeDeps[`@${projectName}/api`] = workspaceVersion;

		if (Object.keys(nativeDeps).length > 0) {
			await addPackageDependency({
				customDependencies: nativeDeps,
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
