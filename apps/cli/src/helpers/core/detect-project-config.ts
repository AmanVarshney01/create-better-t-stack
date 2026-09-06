import path from "node:path";

import { Result } from "better-result";
import fs from "fs-extra";
import z from "zod";

import { readBtsConfig } from "../../utils/bts-config";

const packageIdentitySchema = z.object({ name: z.string().optional() });

export async function detectProjectConfig(projectDir: string) {
  projectDir = path.resolve(projectDir);
  const result = await Result.tryPromise({
    try: async () => {
      const btsConfig = await readBtsConfig(projectDir);
      if (btsConfig) {
        // Workspace imports keep their original scope even if the folder is renamed.
        const configPackagePath = path.join(projectDir, "packages/config/package.json");
        const configPackage = (await fs.pathExists(configPackagePath))
          ? packageIdentitySchema.parse(await fs.readJson(configPackagePath))
          : undefined;
        const rootPackagePath = path.join(projectDir, "package.json");
        const rootPackage = (await fs.pathExists(rootPackagePath))
          ? packageIdentitySchema.parse(await fs.readJson(rootPackagePath))
          : undefined;
        const scope = configPackage?.name
          ? /^@([^/]+)\/config$/.exec(configPackage.name)?.[1]
          : undefined;
        return {
          projectDir,
          projectName: scope || rootPackage?.name || path.basename(projectDir),
          addonOptions: btsConfig.addonOptions,
          dbSetupOptions: btsConfig.dbSetupOptions,
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
