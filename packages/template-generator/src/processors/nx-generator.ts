/**
 * Nx config generator
 * Generates a minimal nx.json for workspace orchestration when the Nx addon is selected.
 */

import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { getDbScriptSupport, type DbScriptSupport } from "../utils/db-scripts";

type NxTargetDefaults = {
  dependsOn?: string[];
  inputs?: string[];
  cache?: boolean;
};

type NxConfig = {
  $schema: string;
  namedInputs: Record<string, string[]>;
  targetDefaults: Record<string, NxTargetDefaults>;
};

export function processNxConfig(vfs: VirtualFileSystem, config: ProjectConfig): void {
  if (!config.addons.includes("nx")) return;

  const nxConfig = generateNxConfig(config);
  vfs.writeFile("nx.json", JSON.stringify(nxConfig, null, "\t"));
}

function generateNxConfig(config: ProjectConfig): NxConfig {
  const { backend, database, dbSetup, webDeploy, serverDeploy } = config;
  const isConvex = backend === "convex";
  const dbSupport = getDbScriptSupport(config);
  const hasDatabase = dbSupport.hasDbScripts;
  const isDocker = dbSetup === "docker";
  const isSqliteLocal = database === "sqlite" && dbSetup !== "d1" && hasDatabase;
  const hasCloudflare = webDeploy === "cloudflare" || serverDeploy === "cloudflare";

  const targetDefaults: Record<string, NxTargetDefaults> = {
    build: {
      dependsOn: ["^build"],
      inputs: ["production", "^production"],
    },
    "check-types": {
      dependsOn: ["^check-types"],
      inputs: ["default", "^default"],
    },
    dev: {
      cache: false,
    },
    ...(isConvex ? getConvexTargets() : {}),
    ...(!isConvex && hasDatabase ? getDatabaseTargets(dbSupport) : {}),
    ...(isDocker ? getDockerTargets() : {}),
    ...(isSqliteLocal ? getSqliteLocalTarget() : {}),
    ...(hasCloudflare ? getDeployTargets() : {}),
  };

  return {
    $schema: "./node_modules/nx/schemas/nx-schema.json",
    namedInputs: {
      default: ["{projectRoot}/**/*", "sharedGlobals"],
      production: [
        "default",
        "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
        "!{projectRoot}/tsconfig.spec.json",
      ],
      sharedGlobals: [],
    },
    targetDefaults,
  };
}

function getConvexTargets(): Record<string, NxTargetDefaults> {
  return {
    "dev:setup": {
      cache: false,
    },
  };
}

function getDatabaseTargets(dbSupport: DbScriptSupport): Record<string, NxTargetDefaults> {
  const targets: Record<string, NxTargetDefaults> = {};

  if (dbSupport.hasDbPush) {
    targets["db:push"] = { cache: false };
  }

  if (dbSupport.hasDbGenerate) {
    targets["db:generate"] = { cache: false };
  }

  if (dbSupport.hasDbMigrate) {
    targets["db:migrate"] = { cache: false };
  }

  if (dbSupport.hasDbStudio) {
    targets["db:studio"] = { cache: false };
  }

  return targets;
}

function getDockerTargets(): Record<string, NxTargetDefaults> {
  return {
    "db:start": { cache: false },
    "db:stop": { cache: false },
    "db:watch": { cache: false },
    "db:down": { cache: false },
  };
}

function getSqliteLocalTarget(): Record<string, NxTargetDefaults> {
  return {
    "db:local": { cache: false },
  };
}

function getDeployTargets(): Record<string, NxTargetDefaults> {
  return {
    deploy: { cache: false },
    destroy: { cache: false },
  };
}
