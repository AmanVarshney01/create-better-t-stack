import path from "node:path";
import { execa } from "execa";
import type { PackageManager } from "../../types";
import { getPackageExecutionCommand } from "../../utils/package-runner";

// having problems running this in convex + better-auth
export async function runConvexCodegen(
	projectDir: string,
	packageManager: PackageManager | null | undefined,
) {
	const backendDir = path.join(projectDir, "packages/backend");
	const cmd = getPackageExecutionCommand(packageManager, "convex codegen");
	await execa(cmd, { cwd: backendDir, shell: true });
}
