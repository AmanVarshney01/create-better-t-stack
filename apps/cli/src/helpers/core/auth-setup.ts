/**
 * Auth setup - CLI-only operations
 * Runs setupBetterAuthPlugins for file modifications
 * Dependencies are handled by the generator's auth-deps processor
 */

import consola from "consola";
import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";

import type { ProjectConfig } from "../../types";

import { setupBetterAuthPlugins } from "../../utils/better-auth-plugin-setup";

export async function setupAuth(config: ProjectConfig) {
  const { auth, backend, projectDir } = config;

  if (!auth || auth === "none" || backend === "convex") {
    return;
  }

  const authPackageDir = path.join(projectDir, "packages/auth");
  const authPackageDirExists = await fs.pathExists(authPackageDir);

  try {
    // Setup Better Auth plugins (file modifications - CLI only)
    if (authPackageDirExists && auth === "better-auth") {
      await setupBetterAuthPlugins(projectDir, config);
    }
  } catch (error) {
    consola.error(pc.red("Failed to configure authentication"));
    if (error instanceof Error) {
      consola.error(pc.red(error.message));
    }
  }
}

export function generateAuthSecret(length = 32) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
