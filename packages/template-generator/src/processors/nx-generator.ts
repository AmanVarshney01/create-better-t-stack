/**
 * Nx config generator
 * Generates a minimal nx.json for workspace orchestration when the Nx addon is selected.
 */

import { getLocalD1Owner, isAlchemyDeployTarget, type ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { getDbScriptSupport, type DbScriptSupport } from "../utils/db-scripts";
import { getStackGeneratedIgnorePatterns } from "../utils/generated-ignore-patterns";

type NxTargetDefaults = {
  dependsOn?: string[];
  inputs?: string[];
  cache?: boolean;
  continuous?: boolean;
};

interface NxTargetMap extends Record<string, NxTargetDefaults> {}

type NxConfig = {
  $schema: string;
  namedInputs: Record<string, string[]>;
  targetDefaults: NxTargetMap;
};

export function processNxConfig(vfs: VirtualFileSystem, config: ProjectConfig): void {
  if (!config.addons.includes("nx")) return;

  const nxConfig = generateNxConfig(config);
  vfs.writeFile("nx.json", JSON.stringify(nxConfig, null, "\t"));
}

export function generateNxConfig(config: ProjectConfig): NxConfig {
  const { backend, database, dbSetup, webDeploy, serverDeploy } = config;
  const isConvex = backend === "convex";
  const dbSupport = getDbScriptSupport(config);
  const hasDatabase = dbSupport.hasDbScripts;
  const isDocker = dbSetup === "docker";
  const isSqliteLocal = database === "sqlite" && dbSetup !== "d1" && hasDatabase;
  const hasAlchemy = isAlchemyDeployTarget(webDeploy) || isAlchemyDeployTarget(serverDeploy);
  const hasLocalD1 = getLocalD1Owner(config) === "wrangler";

  const targetDefaults: NxTargetMap = {
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
      continuous: true,
    },
  };

  if (config.addons.includes("electrobun")) Object.assign(targetDefaults, getElectrobunTargets());
  if (isConvex) Object.assign(targetDefaults, getConvexTargets());
  if (!isConvex && hasDatabase) Object.assign(targetDefaults, getDatabaseTargets(dbSupport));
  if (isDocker) Object.assign(targetDefaults, getDockerTargets());
  if (isSqliteLocal) Object.assign(targetDefaults, getSqliteLocalTarget());
  if (hasLocalD1) Object.assign(targetDefaults, getLocalD1Target());
  if (hasAlchemy) Object.assign(targetDefaults, getDeployTargets());

  return {
    $schema: "./node_modules/nx/schemas/nx-schema.json",
    namedInputs: {
      default: ["{projectRoot}/**/*", "sharedGlobals"],
      production: [
        "default",
        ...getNxProductionInputExclusions(config),
        "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
        "!{projectRoot}/tsconfig.spec.json",
      ],
      sharedGlobals: [],
    },
    targetDefaults,
  };
}

function getElectrobunTargets(): NxTargetMap {
  return {
    "dev:hmr": {
      cache: false,
      continuous: true,
    },
  };
}

export function getNxProductionInputExclusions(config: ProjectConfig): string[] {
  return getStackGeneratedIgnorePatterns(config).map((pattern) => `!{workspaceRoot}/${pattern}`);
}

function getConvexTargets(): NxTargetMap {
  return {
    "dev:setup": {
      cache: false,
    },
  };
}

function getDatabaseTargets(dbSupport: DbScriptSupport): NxTargetMap {
  const targets: NxTargetMap = {};

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
    targets["db:studio"] = { cache: false, continuous: true };
  }

  return targets;
}

function getDockerTargets(): NxTargetMap {
  return {
    "db:start": { cache: false },
    "db:stop": { cache: false },
    "db:watch": { cache: false, continuous: true },
    "db:down": { cache: false },
  };
}

function getSqliteLocalTarget(): NxTargetMap {
  return {
    "db:local": { cache: false, continuous: true },
  };
}

function getLocalD1Target(): NxTargetMap {
  return {
    "db:migrate:local": { cache: false },
  };
}

function getDeployTargets(): NxTargetMap {
  return {
    deploy: { cache: false },
    destroy: { cache: false },
  };
}
