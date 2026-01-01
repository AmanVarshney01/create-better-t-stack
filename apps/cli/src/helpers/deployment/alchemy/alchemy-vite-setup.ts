/**
 * Alchemy setup for Vite-based frontends (React Router, Solid, TanStack Router)
 * NOTE: Dependencies are handled by template-generator's deploy-deps.ts
 * These frontends don't need config modifications - templates already have correct setup
 */

import fs from "fs-extra";
import path from "node:path";

import type { PackageManager } from "../../../types";

export async function setupReactRouterAlchemyDeploy(
  projectDir: string,
  _packageManager: PackageManager,
  _options?: { skipAppScripts?: boolean },
) {
  const webAppDir = path.join(projectDir, "apps/web");
  if (!(await fs.pathExists(webAppDir))) return;
  // Dependencies are added by template-generator's deploy-deps.ts
  // No config modifications needed for React Router
}

export async function setupSolidAlchemyDeploy(
  projectDir: string,
  _packageManager: PackageManager,
  _options?: { skipAppScripts?: boolean },
) {
  const webAppDir = path.join(projectDir, "apps/web");
  if (!(await fs.pathExists(webAppDir))) return;
  // Dependencies are added by template-generator's deploy-deps.ts
  // No config modifications needed for Solid
}

export async function setupTanStackRouterAlchemyDeploy(
  projectDir: string,
  _packageManager: PackageManager,
  _options?: { skipAppScripts?: boolean },
) {
  const webAppDir = path.join(projectDir, "apps/web");
  if (!(await fs.pathExists(webAppDir))) return;
  // Dependencies are added by template-generator's deploy-deps.ts
  // No config modifications needed for TanStack Router
}
