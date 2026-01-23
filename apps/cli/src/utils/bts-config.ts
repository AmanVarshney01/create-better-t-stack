import fs from "fs-extra";
import * as JSONC from "jsonc-parser";
import path from "node:path";

import type { BetterTStackConfig, ProjectConfig } from "../types";

import { getLatestCLIVersion } from "./get-latest-cli-version";

const BTS_CONFIG_FILE = "bts.jsonc";

export async function writeBtsConfig(projectConfig: ProjectConfig) {
  const btsConfig: BetterTStackConfig = {
    version: getLatestCLIVersion(),
    createdAt: new Date().toISOString(),
    ecosystem: projectConfig.ecosystem,
    database: projectConfig.database,
    orm: projectConfig.orm,
    backend: projectConfig.backend,
    runtime: projectConfig.runtime,
    frontend: projectConfig.frontend,
    addons: projectConfig.addons,
    examples: projectConfig.examples,
    auth: projectConfig.auth,
    payments: projectConfig.payments,
    email: projectConfig.email,
    fileUpload: projectConfig.fileUpload,
    effect: projectConfig.effect,
    ai: projectConfig.ai,
    stateManagement: projectConfig.stateManagement,
    validation: projectConfig.validation,
    forms: projectConfig.forms,
    testing: projectConfig.testing,
    packageManager: projectConfig.packageManager,
    dbSetup: projectConfig.dbSetup,
    api: projectConfig.api,
    webDeploy: projectConfig.webDeploy,
    serverDeploy: projectConfig.serverDeploy,
    cssFramework: projectConfig.cssFramework,
    uiLibrary: projectConfig.uiLibrary,
    realtime: projectConfig.realtime,
    jobQueue: projectConfig.jobQueue,
    animation: projectConfig.animation,
    logging: projectConfig.logging,
    observability: projectConfig.observability,
    featureFlags: projectConfig.featureFlags,
    analytics: projectConfig.analytics,
    cms: projectConfig.cms,
    caching: projectConfig.caching,
    rustWebFramework: projectConfig.rustWebFramework,
    rustFrontend: projectConfig.rustFrontend,
    rustOrm: projectConfig.rustOrm,
    rustApi: projectConfig.rustApi,
    rustCli: projectConfig.rustCli,
    rustLibraries: projectConfig.rustLibraries,
    pythonWebFramework: projectConfig.pythonWebFramework,
    pythonOrm: projectConfig.pythonOrm,
    pythonValidation: projectConfig.pythonValidation,
    pythonAi: projectConfig.pythonAi,
    pythonTaskQueue: projectConfig.pythonTaskQueue,
    pythonQuality: projectConfig.pythonQuality,
  };

  const baseContent = {
    $schema: "https://better-fullstack-web.vercel.app/schema.json",
    version: btsConfig.version,
    createdAt: btsConfig.createdAt,
    ecosystem: btsConfig.ecosystem,
    database: btsConfig.database,
    orm: btsConfig.orm,
    backend: btsConfig.backend,
    runtime: btsConfig.runtime,
    frontend: btsConfig.frontend,
    addons: btsConfig.addons,
    examples: btsConfig.examples,
    auth: btsConfig.auth,
    payments: btsConfig.payments,
    email: btsConfig.email,
    fileUpload: btsConfig.fileUpload,
    effect: btsConfig.effect,
    ai: btsConfig.ai,
    stateManagement: btsConfig.stateManagement,
    validation: btsConfig.validation,
    forms: btsConfig.forms,
    testing: btsConfig.testing,
    packageManager: btsConfig.packageManager,
    dbSetup: btsConfig.dbSetup,
    api: btsConfig.api,
    webDeploy: btsConfig.webDeploy,
    serverDeploy: btsConfig.serverDeploy,
    cssFramework: btsConfig.cssFramework,
    uiLibrary: btsConfig.uiLibrary,
    realtime: btsConfig.realtime,
    jobQueue: btsConfig.jobQueue,
    animation: btsConfig.animation,
    logging: btsConfig.logging,
    observability: btsConfig.observability,
    featureFlags: btsConfig.featureFlags,
    analytics: btsConfig.analytics,
    cms: btsConfig.cms,
    caching: btsConfig.caching,
    rustWebFramework: btsConfig.rustWebFramework,
    rustFrontend: btsConfig.rustFrontend,
    rustOrm: btsConfig.rustOrm,
    rustApi: btsConfig.rustApi,
    rustCli: btsConfig.rustCli,
    rustLibraries: btsConfig.rustLibraries,
    pythonWebFramework: btsConfig.pythonWebFramework,
    pythonOrm: btsConfig.pythonOrm,
    pythonValidation: btsConfig.pythonValidation,
    pythonAi: btsConfig.pythonAi,
    pythonTaskQueue: btsConfig.pythonTaskQueue,
    pythonQuality: btsConfig.pythonQuality,
  };

  let configContent = JSON.stringify(baseContent);

  const formatResult = JSONC.format(configContent, undefined, {
    tabSize: 2,
    insertSpaces: true,
    eol: "\n",
  });

  configContent = JSONC.applyEdits(configContent, formatResult);

  const finalContent = `// Better Fullstack configuration file
// safe to delete

${configContent}`;
  const configPath = path.join(projectConfig.projectDir, BTS_CONFIG_FILE);
  await fs.writeFile(configPath, finalContent, "utf-8");
}

export async function readBtsConfig(projectDir: string) {
  try {
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
  } catch {
    return null;
  }
}

export async function updateBtsConfig(
  projectDir: string,
  updates: Partial<Pick<BetterTStackConfig, "addons" | "webDeploy" | "serverDeploy">>,
) {
  try {
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
  } catch {}
}
