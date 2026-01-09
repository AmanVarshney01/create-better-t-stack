/**
 * Post-processor - Orchestrates post-generation processing
 * Modifies virtual files after template generation
 */

import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { processCatalogs } from "./catalogs";
import { processPackageConfigs } from "./package-configs";

/**
 * Run all post-processing steps on the virtual filesystem
 */
export function processPostGeneration(vfs: VirtualFileSystem, config: ProjectConfig) {
  processPackageConfigs(vfs, config);
  processCatalogs(vfs, config);
}

export { processCatalogs, processPackageConfigs };
