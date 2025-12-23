/**
 * Programmatic API for create-better-t-stack
 *
 * This module provides a clean, programmatic interface for creating Better-T-Stack projects.
 * It returns JSON results and never calls process.exit().
 */

import path from "node:path";
import fs from "fs-extra";
import { getDefaultConfig } from "./constants";
import { createProject } from "./helpers/core/create-project";
import { generateReproducibleCommand } from "./utils/generate-reproducible-command";
import type {
  Addons,
  API,
  Auth,
  Backend,
  Database,
  DatabaseSetup,
  Examples,
  Frontend,
  ORM,
  PackageManager,
  Payments,
  ProjectConfig,
  Runtime,
  ServerDeploy,
  WebDeploy,
} from "./types";

export interface CreateOptions {
  /** Project name or path */
  projectName?: string;
  /** Use defaults for unspecified options */
  defaults?: boolean;
  /** Frontend frameworks to use */
  frontend?: Frontend[];
  /** Backend framework */
  backend?: Backend;
  /** Runtime (bun or node) */
  runtime?: Runtime;
  /** Database type */
  database?: Database;
  /** ORM to use */
  orm?: ORM;
  /** Authentication provider */
  auth?: Auth;
  /** Payments provider */
  payments?: Payments;
  /** API type (trpc, orpc, etc.) */
  api?: API;
  /** Addons to include */
  addons?: Addons[];
  /** Examples to include */
  examples?: Examples[];
  /** Database setup method */
  dbSetup?: DatabaseSetup;
  /** Web deployment target */
  webDeploy?: WebDeploy;
  /** Server deployment target */
  serverDeploy?: ServerDeploy;
  /** Initialize git repository */
  git?: boolean;
  /** Package manager to use */
  packageManager?: PackageManager;
  /** Install dependencies after creation */
  install?: boolean;
}

export interface CreateResult {
  /** Whether the project was created successfully */
  success: boolean;
  /** Absolute path to the created project directory */
  projectDirectory?: string;
  /** Relative path from current working directory */
  relativePath?: string;
  /** The final project configuration */
  config?: ProjectConfig;
  /** Command to reproduce this configuration */
  reproducibleCommand?: string;
  /** Time taken in milliseconds */
  elapsedTimeMs: number;
  /** Error message if creation failed */
  error?: string;
}

/**
 * Create a new Better-T-Stack project programmatically.
 *
 * @example
 * ```typescript
 * import { create } from "create-better-t-stack";
 *
 * const result = await create({
 *   projectName: "my-app",
 *   frontend: ["tanstack-router"],
 *   backend: "hono",
 *   database: "sqlite",
 *   orm: "drizzle",
 *   defaults: true,
 * });
 *
 * if (result.success) {
 *   console.log(`Created at: ${result.projectDirectory}`);
 * }
 * ```
 */
export async function create(options: CreateOptions = {}): Promise<CreateResult> {
  const startTime = Date.now();

  try {
    const defaultConfig = getDefaultConfig();
    const projectName = options.projectName ?? defaultConfig.projectName;
    const projectDir = path.resolve(process.cwd(), projectName);
    const relativePath = projectName;

    // Ensure directory doesn't exist or is empty
    if (await fs.pathExists(projectDir)) {
      const contents = await fs.readdir(projectDir);
      if (contents.length > 0) {
        return {
          success: false,
          elapsedTimeMs: Date.now() - startTime,
          error: `Directory "${projectName}" already exists and is not empty`,
        };
      }
    }

    // Build final configuration
    const config: ProjectConfig = {
      projectName,
      projectDir,
      relativePath,
      frontend:
        options.frontend ?? (options.defaults ? defaultConfig.frontend : defaultConfig.frontend),
      backend:
        options.backend ?? (options.defaults ? defaultConfig.backend : defaultConfig.backend),
      runtime:
        options.runtime ?? (options.defaults ? defaultConfig.runtime : defaultConfig.runtime),
      database:
        options.database ?? (options.defaults ? defaultConfig.database : defaultConfig.database),
      orm: options.orm ?? (options.defaults ? defaultConfig.orm : defaultConfig.orm),
      auth: options.auth ?? (options.defaults ? defaultConfig.auth : defaultConfig.auth),
      payments:
        options.payments ?? (options.defaults ? defaultConfig.payments : defaultConfig.payments),
      api: options.api ?? (options.defaults ? defaultConfig.api : defaultConfig.api),
      addons: options.addons ?? (options.defaults ? defaultConfig.addons : defaultConfig.addons),
      examples:
        options.examples ?? (options.defaults ? defaultConfig.examples : defaultConfig.examples),
      dbSetup:
        options.dbSetup ?? (options.defaults ? defaultConfig.dbSetup : defaultConfig.dbSetup),
      webDeploy:
        options.webDeploy ?? (options.defaults ? defaultConfig.webDeploy : defaultConfig.webDeploy),
      serverDeploy:
        options.serverDeploy ??
        (options.defaults ? defaultConfig.serverDeploy : defaultConfig.serverDeploy),
      git: options.git ?? (options.defaults ? defaultConfig.git : defaultConfig.git),
      packageManager:
        options.packageManager ??
        (options.defaults ? defaultConfig.packageManager : defaultConfig.packageManager),
      install: options.install ?? false,
    };

    // Create project directory
    await fs.ensureDir(projectDir);

    // Create the project (suppress console output)
    const originalLog = console.log;
    const originalInfo = console.info;
    const originalWarn = console.warn;
    console.log = () => {};
    console.info = () => {};
    console.warn = () => {};

    try {
      await createProject(config, { manualDb: true });
    } finally {
      console.log = originalLog;
      console.info = originalInfo;
      console.warn = originalWarn;
    }

    const reproducibleCommand = generateReproducibleCommand(config);
    const elapsedTimeMs = Date.now() - startTime;

    return {
      success: true,
      projectDirectory: projectDir,
      relativePath,
      config,
      reproducibleCommand,
      elapsedTimeMs,
    };
  } catch (error) {
    return {
      success: false,
      elapsedTimeMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// Types are exported above via the main export
