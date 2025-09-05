import path from "node:path";
import { isCancel, text } from "@clack/prompts";
import fs from "fs-extra";
import { DEFAULT_CONFIG } from "@/constants/default-configurations";
import { ProjectNameSchema } from "@/types";
import { exitCancelled } from "@/utils/errors";
import { isSafeProjectPath } from "@/utils/is-safe-project-path";

function validateDirectoryName(name: string): string | undefined {
	if (name === ".") return undefined;

	const result = ProjectNameSchema.safeParse(name);
	if (!result.success) {
		return result.error.issues[0]?.message || "Invalid project name";
	}
	return undefined;
}

export async function getProjectName(initialName?: string): Promise<string> {
	if (initialName && isSafeProjectPath(initialName)) {
		return initialName;
	}

	const defaultName = await getDefaultName();

	const response = await text({
		message: "Enter your project name or path (relative to current directory)",
		placeholder: defaultName,
		initialValue: initialName,
		defaultValue: defaultName,
		validate: (value) => {
			const nameToUse = String(value ?? "").trim() || defaultName;

			const finalDirName = path.basename(nameToUse);
			const validationError = validateDirectoryName(finalDirName);
			if (validationError) return validationError;

			if (!isSafeProjectPath(nameToUse)) {
				return "Project path must be within current directory";
			}

			return undefined;
		},
	});

	if (isCancel(response)) return exitCancelled("Operation cancelled.");

	return response || defaultName;
}

export async function getDefaultName(): Promise<string> {
	let defaultName = DEFAULT_CONFIG.projectName;
	let counter = 1;

	while (
		(await fs.pathExists(path.resolve(process.cwd(), defaultName))) &&
		(await fs.readdir(path.resolve(process.cwd(), defaultName))).length > 0
	) {
		defaultName = `${DEFAULT_CONFIG.projectName}-${counter}`;
		counter++;
	}

	return defaultName;
}

// TODO: Write all docker files
// TODO: Write docker-compose file
// TODO: Check all command-programmatic-api is running
// TODO: Update the docs and builder
