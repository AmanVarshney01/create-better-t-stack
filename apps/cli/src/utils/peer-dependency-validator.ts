/**
 * Peer dependency conflict validator.
 *
 * Checks project configuration against known conflicts and provides
 * warnings or errors before project creation begins.
 */

import consola from "consola";
import pc from "picocolors";

import type { ProjectConfig } from "../types";

import { isSilent } from "./context";
import { exitWithError } from "./errors";
import {
  PEER_DEPENDENCY_CONFLICTS,
  type PeerDependencyConflict,
} from "./peer-dependency-conflicts";

export interface ConflictResult {
  errors: PeerDependencyConflict[];
  warnings: PeerDependencyConflict[];
}

/**
 * Checks if a config value matches any of the specified values.
 */
function matchesValue(configValue: unknown, values: string[]): boolean {
  if (configValue === undefined || configValue === null) {
    return false;
  }
  if (Array.isArray(configValue)) {
    return values.some((v) => (configValue as string[]).includes(v));
  }
  return values.includes(configValue as string);
}

/**
 * Checks the configuration against known peer dependency conflicts.
 */
export function checkPeerDependencyConflicts(config: Partial<ProjectConfig>): ConflictResult {
  const errors: PeerDependencyConflict[] = [];
  const warnings: PeerDependencyConflict[] = [];

  for (const conflict of PEER_DEPENDENCY_CONFLICTS) {
    // Check if triggering options are selected
    const triggered = conflict.triggeredBy.some((trigger) => {
      const configValue = config[trigger.optionKey as keyof ProjectConfig];
      return matchesValue(configValue, trigger.values);
    });

    if (!triggered) continue;

    // Check if conflicting options are also selected
    const hasConflict = conflict.conflictsWithOptions.some((opt) => {
      const configValue = config[opt.optionKey as keyof ProjectConfig];
      return matchesValue(configValue, opt.values);
    });

    if (hasConflict) {
      if (conflict.severity === "error") {
        errors.push(conflict);
      } else {
        warnings.push(conflict);
      }
    }
  }

  return { errors, warnings };
}

/**
 * Prints a warning message for a dependency conflict.
 */
function warnDependencyConflict(message: string, resolution: string): void {
  if (isSilent()) return;
  consola.warn(pc.yellow(`Peer Dependency Warning: ${message}`));
  consola.log(pc.dim(`   → ${resolution}`));
}

/**
 * Handles conflict results by printing warnings and exiting on errors.
 */
export function handleConflictResult(result: ConflictResult): void {
  // Print warnings first
  for (const warning of result.warnings) {
    warnDependencyConflict(warning.description, warning.resolution);
  }

  // Exit on errors
  if (result.errors.length > 0) {
    const errorMessages = result.errors
      .map((e) => `${e.description}\n   → ${e.resolution}`)
      .join("\n\n");
    exitWithError(`Peer Dependency Conflict:\n${errorMessages}`);
  }
}

/**
 * Validates peer dependencies for the given configuration.
 * Prints warnings and exits on errors.
 */
export function validatePeerDependencies(config: Partial<ProjectConfig>): void {
  const result = checkPeerDependencyConflicts(config);
  handleConflictResult(result);
}
