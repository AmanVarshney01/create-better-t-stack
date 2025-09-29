import path from "node:path";
import fs from "fs-extra";
import type { ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";

export async function setupWorkspaceDependencies(
	projectDir: string,
	options: ProjectConfig,
) {
	const projectName = options.projectName;
	const workspaceVersion =
		options.packageManager === "npm" ? "*" : "workspace:*";

	const authPackageDir = path.join(projectDir, "packages/auth");
	if (await fs.pathExists(authPackageDir)) {
		await addPackageDependency({
			customDependencies: {
				[`@${projectName}/db`]: workspaceVersion,
			},
			projectDir: authPackageDir,
		});
	}

	const apiPackageDir = path.join(projectDir, "packages/api");
	if (await fs.pathExists(apiPackageDir)) {
		await addPackageDependency({
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
			customDependencies: {
				[`@${projectName}/api`]: workspaceVersion,
				[`@${projectName}/auth`]: workspaceVersion,
				[`@${projectName}/db`]: workspaceVersion,
			},
			projectDir: serverPackageDir,
		});
	}

	const needsApiDependency = options.api && options.api !== "none";
	if (needsApiDependency) {
		const webPackageDir = path.join(projectDir, "apps/web");
		if (await fs.pathExists(webPackageDir)) {
			await addPackageDependency({
				customDependencies: {
					[`@${projectName}/api`]: workspaceVersion,
				},
				projectDir: webPackageDir,
			});
		}
	}
}
