import { Result } from "better-result";
import fs from "fs-extra";
import path from "node:path";

import { readBtsConfig } from "../../utils/bts-config";

export async function detectProjectConfig(projectDir: string) {
  const result = await Result.tryPromise({
    try: async () => {
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
          payments: btsConfig.payments,
          packageManager: btsConfig.packageManager,
          dbSetup: btsConfig.dbSetup,
          api: btsConfig.api,
          webDeploy: btsConfig.webDeploy,
          serverDeploy: btsConfig.serverDeploy,
        };
      }

      return null;
    },
    catch: () => null,
  });

  return result.isOk() ? result.value : null;
}

export async function isBetterTStackProject(projectDir: string): Promise<boolean> {
  const result = await Result.tryPromise({
    try: () => fs.pathExists(path.join(projectDir, "bts.jsonc")),
    catch: () => false,
  });

  return result.isOk() ? result.value : false;
}
