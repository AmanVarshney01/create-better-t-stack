import path from "node:path";
import fs from "fs-extra";
import type { ProjectConfig } from "../../types";
import { readBtsConfig } from "../../utils/bts-config";

export async function detectProjectConfig(
	projectDir: string,
): Promise<Partial<ProjectConfig> | null> {
	try {
		const btsConfig = await readBtsConfig(projectDir);
		if (btsConfig) {
			return {
				projectDir,
				projectName: path.basename(projectDir),
				database: btsConfig.database,
				orm: btsConfig.orm,
				backend: btsConfig.backend,
				runtime: btsConfig.runtime,
				frontend: btsConfig.frontend,
				addons: btsConfig.addons,
				examples: btsConfig.examples,
				auth: btsConfig.auth,
				packageManager: btsConfig.packageManager,
				dbSetup: btsConfig.dbSetup,
				api: btsConfig.api,
				webDeploy: btsConfig.webDeploy,
			};
		}

		return null;
	} catch (_error) {
		return null;
	}
}

export async function isBetterTStackProject(projectDir: string) {
	try {
		return await fs.pathExists(path.join(projectDir, "bts.jsonc"));
	} catch (_error) {
		return false;
	}
}
