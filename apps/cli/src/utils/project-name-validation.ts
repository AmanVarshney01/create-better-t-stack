import path from "node:path";
import { ProjectNameSchema } from "../types";
import { exitWithError } from "./errors";

export function validateProjectName(name: string) {
	const result = ProjectNameSchema.safeParse(name);
	if (!result.success) {
		exitWithError(
			`Invalid project name: ${
				result.error.issues[0]?.message || "Invalid project name"
			}`,
		);
	}
}

export function validateProjectNameThrow(name: string) {
	const result = ProjectNameSchema.safeParse(name);
	if (!result.success) {
		throw new Error(`Invalid project name: ${result.error.issues[0]?.message}`);
	}
}

export function extractAndValidateProjectName(
	projectName?: string,
	projectDirectory?: string,
	throwOnError = false,
) {
	const derivedName =
		projectName ||
		(projectDirectory
			? path.basename(path.resolve(process.cwd(), projectDirectory))
			: "");

	if (!derivedName) {
		return "";
	}

	const nameToValidate = projectName ? path.basename(projectName) : derivedName;

	if (throwOnError) {
		validateProjectNameThrow(nameToValidate);
	} else {
		validateProjectName(nameToValidate);
	}

	return projectName || derivedName;
}
