/**
 * Turbo.json Generator - Programmatically generates turbo.json configuration
 * Replaces the previous Handlebars template with type-safe TypeScript generation
 */

import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

interface TurboTask {
  dependsOn?: string[];
  inputs?: string[];
  outputs?: string[];
  cache?: boolean;
  persistent?: boolean;
}

interface TurboConfig {
  $schema: string;
  ui: string;
  tasks: Record<string, TurboTask>;
}

export function processTurboConfig(vfs: VirtualFileSystem, config: ProjectConfig): void {
  if (!config.addons.includes("turborepo")) return;

  const turboConfig = generateTurboConfig(config);
  vfs.writeFile("turbo.json", JSON.stringify(turboConfig, null, "\t"));
}

function generateTurboConfig(config: ProjectConfig): TurboConfig {
  const { backend, database, orm, dbSetup, webDeploy, serverDeploy, frontend } = config;

  const isConvex = backend === "convex";
  const hasDatabase = database !== "none" && orm !== "none";
  const isDocker = dbSetup === "docker";
  const isSqliteLocal = database === "sqlite" && dbSetup !== "d1";
  const hasCloudflare = webDeploy === "cloudflare" || serverDeploy === "cloudflare";

  const tasks: Record<string, TurboTask> = {
    ...getBaseTasks(frontend),
    ...(isConvex ? getConvexTasks() : {}),
    ...(!isConvex && hasDatabase ? getDatabaseTasks() : {}),
    ...(isDocker ? getDockerTasks() : {}),
    ...(isSqliteLocal ? getSqliteLocalTask() : {}),
    ...(hasCloudflare ? getDeployTasks() : {}),
  };

  return {
    $schema: "https://turbo.build/schema.json",
    ui: "tui",
    tasks,
  };
}

function getBaseTasks(frontend: string[]): Record<string, TurboTask> {
  // Build outputs per framework:
  // - Vite-based (tanstack-router, react-router, tanstack-start, solid, svelte): dist/**
  // - Next.js: .next/**
  // - Nuxt: .nuxt/**, .output/**
  const buildOutputs = ["dist/**"];

  if (frontend.includes("next")) {
    buildOutputs.push(".next/**");
  }

  if (frontend.includes("nuxt")) {
    buildOutputs.push(".nuxt/**", ".output/**");
  }

  // SvelteKit outputs to .svelte-kit/** in addition to build/
  if (frontend.includes("svelte")) {
    buildOutputs.push(".svelte-kit/**", "build/**");
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

function getConvexTasks(): Record<string, TurboTask> {
  return {
    "dev:setup": {
      cache: false,
      persistent: true,
    },
  };
}

function getDatabaseTasks(): Record<string, TurboTask> {
  return {
    "db:push": {
      cache: false,
    },
    "db:studio": {
      cache: false,
      persistent: true,
    },
    "db:migrate": {
      cache: false,
    },
    "db:generate": {
      cache: false,
    },
  };
}

function getDockerTasks(): Record<string, TurboTask> {
  return {
    "db:start": {
      cache: false,
      persistent: true,
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

function getSqliteLocalTask(): Record<string, TurboTask> {
  return {
    "db:local": {
      cache: false,
    },
  };
}

function getDeployTasks(): Record<string, TurboTask> {
  return {
    deploy: {
      cache: false,
    },
    destroy: {
      cache: false,
    },
  };
}
