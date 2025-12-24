import path from "node:path";
import { log } from "./logger";
import fs from "fs-extra";
import pc from "picocolors";
import { handleError } from "./errors";

export type DirectoryConflictAction = "overwrite" | "merge" | "rename" | "cancel";

export type DirectoryConflictOptions = {
  action?: DirectoryConflictAction;
  newPath?: string;
};

export async function handleDirectoryConflict(
  currentPathInput: string,
  silent = false,
  options: DirectoryConflictOptions = {},
) {
  const resolvedPath = path.resolve(process.cwd(), currentPathInput);
  const dirExists = await fs.pathExists(resolvedPath);
  const dirIsNotEmpty = dirExists && (await fs.readdir(resolvedPath)).length > 0;

  if (!dirIsNotEmpty) {
    return { finalPathInput: currentPathInput, shouldClearDirectory: false };
  }

  if (silent) {
    throw new Error(
      `Directory "${currentPathInput}" already exists and is not empty. In silent mode, please provide a different project name or clear the directory manually.`,
    );
  }

  // In TUI mode, the action should be passed as a parameter
  // Default to overwrite for auto mode
  const action = options.action ?? "overwrite";

  log.warn(`Directory "${pc.yellow(currentPathInput)}" already exists and is not empty.`);

  switch (action) {
    case "overwrite":
      log.info("Overwriting existing directory...");
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
      if (!options.newPath) {
        throw new Error("New path must be provided when action is 'rename'");
      }
      log.info(`Using alternative path: ${options.newPath}`);
      return await handleDirectoryConflict(options.newPath, silent);
    }
    case "cancel":
      throw new Error("Operation cancelled by user.");
  }
}

export async function setupProjectDirectory(finalPathInput: string, shouldClearDirectory: boolean) {
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
    log.step(`Clearing directory "${finalResolvedPath}"...`);
    try {
      await fs.emptyDir(finalResolvedPath);
      log.success(`Directory "${finalResolvedPath}" cleared.`);
    } catch (error) {
      log.error(`Failed to clear directory "${finalResolvedPath}".`);
      handleError(error);
    }
  } else {
    await fs.ensureDir(finalResolvedPath);
  }

  return { finalResolvedPath, finalBaseName };
}
