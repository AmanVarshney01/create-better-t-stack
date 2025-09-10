import type { PackageManager } from "../types";

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
