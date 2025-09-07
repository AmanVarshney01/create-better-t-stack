import path from "node:path";
import fs from "fs-extra";
import type { PackageManager } from "../../../types";
import { addPackageDependency } from "../../../utils/add-package-deps";

export async function setupNextAlchemyDeploy(
	projectDir: string,
	_packageManager: PackageManager,
	options?: { skipAppScripts?: boolean },
) {
	const webAppDir = path.join(projectDir, "apps/web");
	if (!(await fs.pathExists(webAppDir))) return;

	await addPackageDependency({
		dependencies: ["@opennextjs/cloudflare"],
		devDependencies: ["alchemy", "dotenv", "wrangler"],
		projectDir: webAppDir,
	});

	const pkgPath = path.join(webAppDir, "package.json");
	if (await fs.pathExists(pkgPath)) {
		const pkg = await fs.readJson(pkgPath);

		if (!options?.skipAppScripts) {
			pkg.scripts = {
				...pkg.scripts,
				deploy: "alchemy deploy",
				destroy: "alchemy destroy",
			};
		}
		await fs.writeJson(pkgPath, pkg, { spaces: 2 });
	}

	const openNextConfigPath = path.join(webAppDir, "open-next.config.ts");
	const openNextConfigContent = `import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
`;

	await fs.writeFile(openNextConfigPath, openNextConfigContent);

	const gitignorePath = path.join(webAppDir, ".gitignore");
	if (await fs.pathExists(gitignorePath)) {
		const gitignoreContent = await fs.readFile(gitignorePath, "utf-8");
		if (!gitignoreContent.includes("wrangler.jsonc")) {
			await fs.appendFile(gitignorePath, "\nwrangler.jsonc\n");
		}
	} else {
		await fs.writeFile(gitignorePath, "wrangler.jsonc\n");
	}
}
