import type { PackageManager } from "../types";

function splitCommandArgs(commandWithArgs: string): string[] {
  const args: string[] = [];
  let current = "";
  let quote: "'" | '"' | null = null;

  for (let i = 0; i < commandWithArgs.length; i += 1) {
    const char = commandWithArgs[i];

    if (quote) {
      if (char === quote) {
        quote = null;
        continue;
      }
      if (char === "\\" && i + 1 < commandWithArgs.length) {
        const nextChar = commandWithArgs[i + 1];
        if (nextChar === quote || nextChar === "\\") {
          current += nextChar;
          i += 1;
          continue;
        }
      }
      current += char;
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (/\s/.test(char)) {
      if (current.length > 0) {
        args.push(current);
        current = "";
      }
      continue;
    }

    current += char;
  }

  if (current.length > 0) {
    args.push(current);
  }

  return args;
}

/**
 * Returns the appropriate command for running a package without installing it globally,
 * based on the selected package manager.
 *
 * @param packageManager - The selected package manager (e.g., 'npm', 'yarn', 'pnpm', 'bun').
 * @param commandWithArgs - The command to run, including arguments (e.g., "prisma generate --schema=./prisma/schema.prisma").
 * @returns The full command string (e.g., "npx prisma generate --schema=./prisma/schema.prisma").
 */
export function getPackageExecutionCommand(
  packageManager: PackageManager | null | undefined,
  commandWithArgs: string,
) {
  switch (packageManager) {
    case "pnpm":
      return `pnpm dlx ${commandWithArgs}`;
    case "bun":
      return `bunx ${commandWithArgs}`;
    default:
      return `npx ${commandWithArgs}`;
  }
}

/**
 * Returns the command and arguments as an array for use with execa's $ template syntax.
 * This avoids the need for shell: true and provides better escaping.
 *
 * @param packageManager - The selected package manager (e.g., 'npm', 'yarn', 'pnpm', 'bun').
 * @param commandWithArgs - The command to run, including arguments (e.g., "prisma generate").
 * @returns An array of [command, ...args] (e.g., ["npx", "prisma", "generate"]).
 */
export function getPackageExecutionArgs(
  packageManager: PackageManager | null | undefined,
  commandWithArgs: string,
): string[] {
  const args = splitCommandArgs(commandWithArgs);
  switch (packageManager) {
    case "pnpm":
      return ["pnpm", "dlx", ...args];
    case "bun":
      return ["bunx", ...args];
    default:
      return ["npx", ...args];
  }
}

/**
 * Returns just the runner prefix as an array, for when you already have args built.
 * Use this when you have complex arguments that shouldn't be split by spaces.
 *
 * @param packageManager - The selected package manager.
 * @returns The runner prefix as an array (e.g., ["npx"] or ["pnpm", "dlx"]).
 *
 * @example
 * const prefix = getPackageRunnerPrefix("bun");
 * const args = ["@tauri-apps/cli@latest", "init", "--app-name=foo"];
 * await $`${[...prefix, ...args]}`;
 */
export function getPackageRunnerPrefix(
  packageManager: PackageManager | null | undefined,
): string[] {
  switch (packageManager) {
    case "pnpm":
      return ["pnpm", "dlx"];
    case "bun":
      return ["bunx"];
    default:
      return ["npx"];
  }
}
