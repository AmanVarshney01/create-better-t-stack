/**
 * Dependencies processor - orchestrates all dependency processing
 */

import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { processAddonsDeps } from "./addons-deps";
import { processApiDeps } from "./api-deps";
import { processAuthDeps } from "./auth-deps";
import { processBackendDeps } from "./backend-deps";
import { processDatabaseDeps } from "./db-deps";
import { processEnvDeps } from "./env-deps";
import { processExamplesDeps } from "./examples-deps";
import { processInfraDeps } from "./infra-deps";
import { processPaymentsDeps } from "./payments-deps";
import { processReadme } from "./readme-generator";
import { processRuntimeDeps } from "./runtime-deps";
import { processWorkspaceDeps } from "./workspace-deps";

/**
 * Process all dependencies for the project
 * Adds correct deps/devDeps to all package.json files
 */
export function processDependencies(vfs: VirtualFileSystem, config: ProjectConfig): void {
  // Order matters: workspace deps first, then feature-specific deps
  processWorkspaceDeps(vfs, config);
  processEnvDeps(vfs, config);
  processInfraDeps(vfs, config);
  processDatabaseDeps(vfs, config);
  processBackendDeps(vfs, config);
  processRuntimeDeps(vfs, config);
  processApiDeps(vfs, config);
  processAuthDeps(vfs, config);
  processPaymentsDeps(vfs, config);
  // Addons and examples last (may depend on other packages)
  processAddonsDeps(vfs, config);
  processExamplesDeps(vfs, config);
}

export {
  processAddonsDeps,
  processApiDeps,
  processAuthDeps,
  processBackendDeps,
  processDatabaseDeps,
  processEnvDeps,
  processExamplesDeps,
  processInfraDeps,
  processPaymentsDeps,
  processReadme,
  processRuntimeDeps,
  processWorkspaceDeps,
};
