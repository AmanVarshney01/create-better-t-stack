/**
 * create-better-t-stack
 *
 * A modern CLI tool for scaffolding end-to-end type-safe TypeScript projects.
 *
 * @example Programmatic usage
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

// Main programmatic API
export { create, type CreateOptions, type CreateResult } from "./api";

// Re-export types for type-safe usage
export type {
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
  DirectoryConflict,
  Template,
  BetterTStackConfig,
} from "./types";

// Legacy exports for backwards compatibility (deprecated)
export { create as init } from "./api";
