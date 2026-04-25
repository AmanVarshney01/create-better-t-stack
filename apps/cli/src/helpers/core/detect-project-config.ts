import path from "node:path";

import { Result } from "better-result";
import fs from "fs-extra";

import { readCjsConfig } from "../../utils/cjs-config";

export async function detectProjectConfig(projectDir: string) {
  const result = await Result.tryPromise({
    try: async () => {
      const cjsConfig = await readCjsConfig(projectDir);
      if (cjsConfig) {
        return {
          projectDir,
          projectName: path.basename(projectDir),
          addonOptions: cjsConfig.addonOptions,
          dbSetupOptions: cjsConfig.dbSetupOptions,
          database: cjsConfig.database,
          orm: cjsConfig.orm,
          backend: cjsConfig.backend,
          runtime: cjsConfig.runtime,
          frontend: cjsConfig.frontend,
          addons: cjsConfig.addons,
          examples: cjsConfig.examples,
          auth: cjsConfig.auth,
          payments: cjsConfig.payments,
          packageManager: cjsConfig.packageManager,
          dbSetup: cjsConfig.dbSetup,
          api: cjsConfig.api,
          webDeploy: cjsConfig.webDeploy,
          serverDeploy: cjsConfig.serverDeploy,
        };
      }

      return null;
    },
    catch: () => null,
  });

  return result.isOk() ? result.value : null;
}

export async function isCreateJSStackProject(projectDir: string): Promise<boolean> {
  const result = await Result.tryPromise({
    try: () => fs.pathExists(path.join(projectDir, "cjs.jsonc")),
    catch: () => false,
  });

  return result.isOk() ? result.value : false;
}
