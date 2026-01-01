/**
 * Dependencies processor - orchestrates all dependency processing
 */

import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { processApiDeps } from "./api-deps";
import { processAuthDeps } from "./auth-deps";
import { processDatabaseDeps } from "./db-deps";
import { processWorkspaceDeps } from "./workspace-deps";

/**
 * Process all dependencies for the project
 * Adds correct deps/devDeps to all package.json files
 */
export function processDependencies(vfs: VirtualFileSystem, config: ProjectConfig): void {
  // Order matters: workspace deps first, then feature-specific deps
  processWorkspaceDeps(vfs, config);
  processDatabaseDeps(vfs, config);
  processApiDeps(vfs, config);
  processAuthDeps(vfs, config);
}

export { processDatabaseDeps, processApiDeps, processAuthDeps, processWorkspaceDeps };
