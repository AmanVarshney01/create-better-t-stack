/**
 * Turbo.json Generator - Programmatically generates turbo.json configuration
 * Replaces the previous Handlebars template with type-safe TypeScript generation
 */

import { getLocalD1Owner, isAlchemyDeployTarget, type ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { getDbScriptSupport, type DbScriptSupport } from "../utils/db-scripts";

interface TurboTask {
  dependsOn?: string[];
  inputs?: string[];
  outputs?: string[];
  cache?: boolean;
  persistent?: boolean;
  interactive?: boolean;
}

interface TurboTasks extends Record<string, TurboTask> {}

interface TurboConfig {
  $schema: string;
  ui: string;
  tasks: TurboTasks;
}

export function processTurboConfig(vfs: VirtualFileSystem, config: ProjectConfig): void {
  if (!config.addons.includes("turborepo")) return;

  const turboConfig = generateTurboConfig(config);
  vfs.writeFile("turbo.json", JSON.stringify(turboConfig, null, "\t"));
}

export function generateTurboConfig(config: ProjectConfig): TurboConfig {
  const { backend, database, dbSetup, webDeploy, serverDeploy, frontend } = config;

  const isConvex = backend === "convex";
  const dbSupport = getDbScriptSupport(config);
  const hasDatabase = dbSupport.hasDbScripts;
  const isDocker = dbSetup === "docker";
  const isSqliteLocal = database === "sqlite" && dbSetup !== "d1" && hasDatabase;
  const hasAlchemy = isAlchemyDeployTarget(webDeploy) || isAlchemyDeployTarget(serverDeploy);
  const hasLocalD1 = getLocalD1Owner(config) === "wrangler";

  const tasks: TurboTasks = getBaseTasks(frontend, config.addons);

  if (config.addons.includes("electrobun")) Object.assign(tasks, getElectrobunTasks());
  if (isConvex) Object.assign(tasks, getConvexTasks());
  if (!isConvex && hasDatabase) Object.assign(tasks, getDatabaseTasks(dbSupport));
  if (isDocker) Object.assign(tasks, getDockerTasks());
  if (isSqliteLocal) Object.assign(tasks, getSqliteLocalTask());
  if (hasLocalD1) Object.assign(tasks, getLocalD1Task());
  if (hasAlchemy) Object.assign(tasks, getDeployTasks());

  return {
    $schema: "https://turbo.build/schema.json",
    ui: "tui",
    tasks,
  };
}

function getBaseTasks(frontend: string[], addons: string[]): TurboTasks {
  // Build outputs per framework:
  // - Vite-based client apps: dist/**
  // - Next.js: .next/** excluding .next/cache/**
  // - Nuxt: .nuxt/**, .output/**
  const buildOutputs = ["dist/**"];

  if (frontend.includes("next")) {
    buildOutputs.push(".next/**", "!.next/cache/**");
  }

  if (frontend.includes("nuxt")) {
    buildOutputs.push(".nuxt/**", ".output/**");
  }

  if (frontend.includes("solid")) {
    buildOutputs.push(".output/**");
  }

  // SvelteKit outputs to .svelte-kit/** in addition to build/
  if (frontend.includes("svelte")) {
    buildOutputs.push(".svelte-kit/**", "build/**");
  }

  // Astro outputs to dist/**
  if (frontend.includes("astro")) {
    buildOutputs.push(".astro/**");
  }

  if (addons.includes("electrobun")) {
    buildOutputs.push("artifacts/**");
  }

  return {
    build: {
      dependsOn: ["^build"],
      inputs: ["$TURBO_DEFAULT$", ".env*"],
      outputs: buildOutputs,
    },
    lint: {
      dependsOn: ["^lint"],
    },
    "check-types": {
      dependsOn: ["^check-types"],
    },
    dev: {
      cache: false,
      persistent: true,
    },
  };
}

function getElectrobunTasks(): TurboTasks {
  return {
    "dev:hmr": {
      cache: false,
      persistent: true,
    },
    "build:stable": {
      dependsOn: ["^build"],
      inputs: ["$TURBO_DEFAULT$", ".env*"],
      outputs: ["artifacts/**", "build/**"],
    },
    "build:canary": {
      dependsOn: ["^build"],
      inputs: ["$TURBO_DEFAULT$", ".env*"],
      outputs: ["artifacts/**", "build/**"],
    },
  };
}

function getConvexTasks(): TurboTasks {
  return {
    "dev:setup": {
      cache: false,
      interactive: true,
    },
  };
}

function getDatabaseTasks(dbSupport: DbScriptSupport): TurboTasks {
  const tasks: TurboTasks = {};

  if (dbSupport.hasDbPush) {
    tasks["db:push"] = { cache: false, interactive: true };
  }

  if (dbSupport.hasDbGenerate) {
    tasks["db:generate"] = { cache: false, interactive: true };
  }

  if (dbSupport.hasDbMigrate) {
    tasks["db:migrate"] = { cache: false, interactive: true };
  }

  if (dbSupport.hasDbStudio) {
    tasks["db:studio"] = { cache: false, persistent: true };
  }

  return tasks;
}

function getDockerTasks(): TurboTasks {
  return {
    "db:start": {
      cache: false,
    },
    "db:stop": {
      cache: false,
    },
    "db:watch": {
      cache: false,
      persistent: true,
    },
    "db:down": {
      cache: false,
    },
  };
}

function getSqliteLocalTask(): TurboTasks {
  return {
    "db:local": {
      cache: false,
      persistent: true,
    },
  };
}

function getLocalD1Task(): TurboTasks {
  return {
    "db:migrate:local": {
      cache: false,
      interactive: true,
    },
  };
}

function getDeployTasks(): TurboTasks {
  return {
    deploy: {
      cache: false,
      interactive: true,
    },
    destroy: {
      cache: false,
      interactive: true,
    },
  };
}
