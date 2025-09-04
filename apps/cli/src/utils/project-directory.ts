import path from "node:path";
import { isCancel, log, select, spinner } from "@clack/prompts";
import fs from "fs-extra";
import pc from "picocolors";
import { getProjectName } from "../prompts/project-name";
import { exitCancelled, handleError } from "./errors";
import type { DirectoryConflict } from "@/types";

export async function handleDirectoryConflictProgrammatically(
	currentPathInput: string,
	strategy: DirectoryConflict,
): Promise<{ finalPathInput: string; shouldClearDirectory: boolean }> {
	const currentPath = path.resolve(process.cwd(), currentPathInput);

	if (!(await fs.pathExists(currentPath))) {
		return { finalPathInput: currentPathInput, shouldClearDirectory: false };
	}

	const dirExists = await fs.readdir(currentPath);
	const isDirEmpty = dirExists.length === 0;

	if (isDirEmpty) {
		return { finalPathInput: currentPathInput, shouldClearDirectory: false };
	}

	switch (strategy) {
		case "overwrite":
			return { finalPathInput: currentPathInput, shouldClearDirectory: true };

		case "merge":
			return { finalPathInput: currentPathInput, shouldClearDirectory: false };

		case "increment": {
			let counter = 1;
			const baseName = currentPathInput;
			let finalPathInput = `${baseName}-${counter}`;

			while (
				(await fs.pathExists(path.resolve(process.cwd(), finalPathInput))) &&
				(await fs.readdir(path.resolve(process.cwd(), finalPathInput))).length >
					0
			) {
				counter++;
				finalPathInput = `${baseName}-${counter}`;
			}

			return { finalPathInput, shouldClearDirectory: false };
		}

		case "error":
			throw new Error(
				`Directory "${currentPathInput}" already exists and is not empty. Use directoryConflict: "overwrite", "merge", or "increment" to handle this.`,
			);

		default:
			throw new Error(`Unknown directory conflict strategy: ${strategy}`);
	}
}

export async function handleDirectoryConflict(
	currentPathInput: string,
	silent = false,
): Promise<{
	finalPathInput: string;
	shouldClearDirectory: boolean;
}> {
	while (true) {
		const resolvedPath = path.resolve(process.cwd(), currentPathInput);
		const dirExists = await fs.pathExists(resolvedPath);
		const isDirEmpty =
			dirExists && (await fs.readdir(resolvedPath)).length === 0;

		if (isDirEmpty) {
			return { finalPathInput: currentPathInput, shouldClearDirectory: false };
		}

		if (silent) {
			throw new Error(
				`Directory "${currentPathInput}" already exists and is not empty. In silent mode, please provide a different project name or clear the directory manually.`,
			);
		}

		log.warn(
			`Directory "${pc.yellow(
				currentPathInput,
			)}" already exists and is not empty.`,
		);

		const action = await select<"overwrite" | "merge" | "rename" | "cancel">({
			message: "What would you like to do?",
			options: [
				{
					value: "overwrite",
					label: "Overwrite",
					hint: "Empty the directory and create the project",
				},
				{
					value: "merge",
					label: "Merge",
					hint: "Create project files inside, potentially overwriting conflicts",
				},
				{
					value: "rename",
					label: "Choose a different name/path",
					hint: "Keep the existing directory and create a new one",
				},
				{ value: "cancel", label: "Cancel", hint: "Abort the process" },
			],
			initialValue: "rename",
		});

		if (isCancel(action)) return exitCancelled("Operation cancelled.");

		switch (action) {
			case "overwrite":
				return { finalPathInput: currentPathInput, shouldClearDirectory: true };
			case "merge":
				log.info(
					`Proceeding into existing directory "${pc.yellow(
						currentPathInput,
					)}". Files may be overwritten.`,
				);
				return {
					finalPathInput: currentPathInput,
					shouldClearDirectory: false,
				};
			case "rename": {
				log.info("Please choose a different project name or path.");
				const newPathInput = await getProjectName(undefined);
				return await handleDirectoryConflict(newPathInput);
			}
			case "cancel":
				return exitCancelled("Operation cancelled.");
		}
	}
}

export async function setupProjectDirectory(
	finalPathInput: string,
	shouldClearDirectory: boolean,
): Promise<{ finalResolvedPath: string; finalBaseName: string }> {
	let finalResolvedPath: string;
	let finalBaseName: string;

	if (finalPathInput === ".") {
		finalResolvedPath = process.cwd();
		finalBaseName = path.basename(finalResolvedPath);
	} else {
		finalResolvedPath = path.resolve(process.cwd(), finalPathInput);
		finalBaseName = path.basename(finalResolvedPath);
	}

	if (shouldClearDirectory) {
		const s = spinner();
		s.start(`Clearing directory "${finalResolvedPath}"...`);
		try {
			await fs.emptyDir(finalResolvedPath);
			s.stop(`Directory "${finalResolvedPath}" cleared.`);
		} catch (error) {
			s.stop(pc.red(`Failed to clear directory "${finalResolvedPath}".`));
			handleError(error);
		}
	} else {
		await fs.ensureDir(finalResolvedPath);
	}

	return { finalResolvedPath, finalBaseName };
}
