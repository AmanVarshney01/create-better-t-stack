import path from "node:path";
import fs from "fs-extra";
import type { PackageManager } from "../../../types";
import { addPackageDependency } from "../../../utils/add-package-deps";

export async function setupCombinedAlchemyDeploy(
	projectDir: string,
	_packageManager: PackageManager,
) {
	await addPackageDependency({
		devDependencies: ["alchemy"],
		projectDir,
	});

	const rootPkgPath = path.join(projectDir, "package.json");
	if (await fs.pathExists(rootPkgPath)) {
		const pkg = await fs.readJson(rootPkgPath);

		pkg.scripts = {
			...pkg.scripts,
			deploy: "alchemy deploy",
			destroy: "alchemy destroy",
			"alchemy:dev": "alchemy dev",
		};
		await fs.writeJson(rootPkgPath, pkg, { spaces: 2 });
	}
}
