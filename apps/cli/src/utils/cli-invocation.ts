import type { PackageManager } from "../types";
import { getPackageExecutionCommand } from "./package-runner";

/** The package manager that launched the CLI (`bun create`, `pnpm create`, `npx`), when known. */
export function detectInvokingPackageManager(
  userAgent = process.env.npm_config_user_agent,
): PackageManager | undefined {
  const normalizedUserAgent = userAgent?.toLowerCase();
  if (normalizedUserAgent?.startsWith("bun")) return "bun";
  if (normalizedUserAgent?.startsWith("pnpm")) return "pnpm";
  if (normalizedUserAgent?.startsWith("npm")) return "npm";
  return undefined;
}

export function getCliSubcommandCommand(
  subcommand: string,
  fallbackPackageManager: PackageManager,
  userAgent = process.env.npm_config_user_agent,
): string {
  const packageManager = detectInvokingPackageManager(userAgent) ?? fallbackPackageManager;
  return getPackageExecutionCommand(packageManager, `create-better-t-stack@latest ${subcommand}`);
}
