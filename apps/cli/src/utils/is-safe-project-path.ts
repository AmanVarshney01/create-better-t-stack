import path from "node:path";
import consola from "consola";
import pc from "picocolors";

function isPathWithinCwd(targetPath: string): boolean {
	const resolved = path.resolve(targetPath);
	const rel = path.relative(process.cwd(), resolved);
	return !rel.startsWith("..") && !path.isAbsolute(rel);
}

export function isSafeProjectPath(targetPath?: string): boolean {
	if (targetPath === ".") {
		return true;
	}

	if (targetPath) {
		const projectDir = path.resolve(process.cwd(), targetPath);
		if (isPathWithinCwd(projectDir)) {
			return true;
		}
		consola.error(pc.red("Project path must be within current directory"));
	}

	return false;
}
