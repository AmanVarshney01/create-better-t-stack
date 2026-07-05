/**
 * Post-processor - Orchestrates post-generation processing
 * Modifies virtual files after template generation
 */

import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { processCatalogs } from "./catalogs";
import { processJsonConfigs } from "./json-configs";
import { processPackageConfigs } from "./package-configs";
import { processVercelConfig } from "./vercel-config";

/**
 * Run all post-processing steps on the virtual filesystem
 */
export function processPostGeneration(vfs: VirtualFileSystem, config: ProjectConfig) {
  processPackageConfigs(vfs, config);
  processCatalogs(vfs, config);
  processJsonConfigs(vfs, config);
  processVercelConfig(vfs, config);
}

export { processCatalogs, processJsonConfigs, processPackageConfigs, processVercelConfig };
