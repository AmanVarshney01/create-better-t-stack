import type { PackageManager } from "../types";
import { getPackageExecutionCommand } from "./package-runner";

export function getCliSubcommandCommand(
  subcommand: string,
  fallbackPackageManager: PackageManager,
  userAgent = process.env.npm_config_user_agent,
): string {
  const normalizedUserAgent = userAgent?.toLowerCase();
  const packageManager = normalizedUserAgent?.startsWith("bun")
    ? "bun"
    : normalizedUserAgent?.startsWith("pnpm")
      ? "pnpm"
      : normalizedUserAgent?.startsWith("npm")
        ? "npm"
        : fallbackPackageManager;

  return getPackageExecutionCommand(packageManager, `create-better-t-stack@latest ${subcommand}`);
}
