import { Result } from "better-result";
import fs from "fs-extra";
import * as JSONC from "jsonc-parser";
import path from "node:path";

import type { BetterTStackConfig, ProjectConfig } from "../types";

import { ProjectCreationError } from "./errors";
import { getLatestCLIVersion } from "./get-latest-cli-version";

const BTS_CONFIG_FILE = "bts.jsonc";

export async function writeBtsConfig(
  projectConfig: ProjectConfig,
): Promise<Result<void, ProjectCreationError>> {
  return Result.tryPromise({
    try: async () => {
      const btsConfig: BetterTStackConfig = {
        version: getLatestCLIVersion(),
        createdAt: new Date().toISOString(),
        database: projectConfig.database,
        orm: projectConfig.orm,
        backend: projectConfig.backend,
        runtime: projectConfig.runtime,
        frontend: projectConfig.frontend,
        addons: projectConfig.addons,
        examples: projectConfig.examples,
        auth: projectConfig.auth,
        payments: projectConfig.payments,
        packageManager: projectConfig.packageManager,
        dbSetup: projectConfig.dbSetup,
        api: projectConfig.api,
        webDeploy: projectConfig.webDeploy,
        serverDeploy: projectConfig.serverDeploy,
      };

      const baseContent = {
        $schema: "https://r2.better-t-stack.dev/schema.json",
        version: btsConfig.version,
        createdAt: btsConfig.createdAt,
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

      let configContent = JSON.stringify(baseContent);

      const formatResult = JSONC.format(configContent, undefined, {
        tabSize: 2,
        insertSpaces: true,
        eol: "\n",
      });

      configContent = JSONC.applyEdits(configContent, formatResult);

      const finalContent = `// Better-T-Stack configuration file
// safe to delete

${configContent}`;
      const configPath = path.join(projectConfig.projectDir, BTS_CONFIG_FILE);
      await fs.writeFile(configPath, finalContent, "utf-8");
    },
    catch: (e) =>
      new ProjectCreationError({
        phase: "config-writing",
        message: `Failed to write BTS config: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });
}

export async function readBtsConfig(projectDir: string): Promise<BetterTStackConfig | null> {
  const result = await Result.tryPromise({
    try: async () => {
      const configPath = path.join(projectDir, BTS_CONFIG_FILE);

      if (!(await fs.pathExists(configPath))) {
        return null;
      }

      const configContent = await fs.readFile(configPath, "utf-8");

      const errors: JSONC.ParseError[] = [];
      const config = JSONC.parse(configContent, errors, {
        allowTrailingComma: true,
        disallowComments: false,
      }) as BetterTStackConfig;

      if (errors.length > 0) {
        console.warn("Warning: Found errors parsing bts.jsonc:", errors);
        return null;
      }

      return config;
    },
    catch: () => null,
  });

  return result.isOk() ? result.value : null;
}

export async function updateBtsConfig(
  projectDir: string,
  updates: Partial<Pick<BetterTStackConfig, "addons" | "webDeploy" | "serverDeploy">>,
): Promise<void> {
  await Result.tryPromise({
    try: async () => {
      const configPath = path.join(projectDir, BTS_CONFIG_FILE);

      if (!(await fs.pathExists(configPath))) {
        return;
      }

      const configContent = await fs.readFile(configPath, "utf-8");

      let modifiedContent = configContent;

      for (const [key, value] of Object.entries(updates)) {
        const editResult = JSONC.modify(modifiedContent, [key], value, {
          formattingOptions: {
            tabSize: 2,
            insertSpaces: true,
            eol: "\n",
          },
        });
        modifiedContent = JSONC.applyEdits(modifiedContent, editResult);
      }

      await fs.writeFile(configPath, modifiedContent, "utf-8");
    },
    catch: () => undefined, // Silent failure
  });
}
