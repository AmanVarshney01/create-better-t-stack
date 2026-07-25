import path from "node:path";

import { confirm, isCancel, log, select, spinner } from "@clack/prompts";
import { Result } from "better-result";
import fs from "fs-extra";
import pc from "picocolors";

import { getProjectName } from "../prompts/project-name";
import { isSilent } from "./context";
import { CLIError, UserCancelledError } from "./errors";

export type ProjectPathState =
  | "missing"
  | "empty-directory"
  | "non-empty-directory"
  | "symbolic-link"
  | "non-directory";

type DirectoryConflictAction = "increment" | "overwrite" | "merge" | "rename" | "cancel";

export async function handleDirectoryConflict(currentPathInput: string): Promise<{
  finalPathInput: string;
  shouldClearDirectory: boolean;
}> {
  while (true) {
    const resolvedPath = path.resolve(process.cwd(), currentPathInput);
    const pathStateResult = await inspectProjectPath(resolvedPath);
    if (pathStateResult.isErr()) throw pathStateResult.error;
    const pathState = pathStateResult.value;

    if (pathState === "missing" || pathState === "empty-directory") {
      return { finalPathInput: currentPathInput, shouldClearDirectory: false };
    }

    if (isSilent()) {
      throw new CLIError({
        message: `Project path "${currentPathInput}" is unavailable. In silent mode, provide a different project path or an explicit directoryConflict strategy.`,
      });
    }

    if (pathState === "symbolic-link") {
      log.warn(`Project path "${pc.yellow(currentPathInput)}" is a symbolic link.`);
    } else if (pathState === "non-directory") {
      log.warn(`Project path "${pc.yellow(currentPathInput)}" exists and is not a directory.`);
    } else {
      log.warn(`Directory "${pc.yellow(currentPathInput)}" already exists and is not empty.`);
    }

    let incrementedPath: string | undefined;
    if (currentPathInput !== ".") {
      const incrementResult = await findAvailableIncrementedPath(currentPathInput);
      if (incrementResult.isErr()) throw incrementResult.error;
      incrementedPath = incrementResult.value;
    }
    const options: Array<{
      value: DirectoryConflictAction;
      label: string;
      hint: string;
    }> = [];

    if (incrementedPath) {
      options.push({
        value: "increment",
        label: `Create as "${incrementedPath}"`,
        hint: "Keep the existing path untouched",
      });
    }

    options.push({
      value: "rename",
      label: "Choose another path",
      hint: "Enter a different project directory",
    });

    if (pathState === "non-empty-directory") {
      options.push(
        {
          value: "merge",
          label: "Merge into this directory",
          hint: "Keep unrelated files; replace conflicts",
        },
        {
          value: "overwrite",
          label: "Delete and overwrite",
          hint: "Permanently remove existing contents",
        },
      );
    }

    options.push({ value: "cancel", label: "Cancel", hint: "Leave everything unchanged" });

    const action = await select<DirectoryConflictAction>({
      message: "How should we continue?",
      options,
      initialValue: incrementedPath ? "increment" : "rename",
    });

    if (isCancel(action)) {
      throw new UserCancelledError({ message: "Operation cancelled." });
    }

    switch (action) {
      case "increment":
        return { finalPathInput: incrementedPath!, shouldClearDirectory: false };
      case "overwrite": {
        const confirmed = await confirm({
          message: `Permanently delete every file in "${currentPathInput}"?`,
          initialValue: false,
        });
        if (isCancel(confirmed)) {
          throw new UserCancelledError({ message: "Operation cancelled." });
        }
        if (!confirmed) {
          log.info("Nothing was deleted. Choose another option.");
          continue;
        }
        return { finalPathInput: currentPathInput, shouldClearDirectory: true };
      }
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
        currentPathInput = await getProjectName(undefined);
        continue;
      }
      case "cancel":
        throw new UserCancelledError({ message: "Operation cancelled." });
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

  const pathSafetyResult = await validateSafeProjectDirectoryPath(finalPathInput);
  if (pathSafetyResult.isErr()) throw pathSafetyResult.error;

  if (shouldClearDirectory) {
    const s = isSilent() ? undefined : spinner();
    s?.start(`Clearing directory "${finalResolvedPath}"...`);

    const clearResult = await Result.tryPromise({
      try: () => fs.emptyDir(finalResolvedPath),
      catch: (error) =>
        new CLIError({
          message: `Failed to clear directory "${finalResolvedPath}".`,
          cause: error,
        }),
    });

    if (clearResult.isErr()) {
      s?.stop(pc.red(`Failed to clear directory "${finalResolvedPath}".`));
      throw clearResult.error;
    }

    s?.stop(`Directory "${finalResolvedPath}" cleared.`);
  } else {
    await fs.ensureDir(finalResolvedPath);
  }

  return { finalResolvedPath, finalBaseName };
}

export async function validateSafeProjectDirectoryPath(
  finalPathInput: string,
): Promise<Result<void, CLIError>> {
  return Result.tryPromise({
    try: async () => {
      const cwd = path.resolve(process.cwd());
      const targetPath = finalPathInput === "." ? cwd : path.resolve(cwd, finalPathInput);
      const relativeTarget = path.relative(cwd, targetPath);
      if (
        relativeTarget === ".." ||
        relativeTarget.startsWith(`..${path.sep}`) ||
        path.isAbsolute(relativeTarget)
      ) {
        throw new CLIError({
          message: `Project path "${finalPathInput}" resolves outside the current working directory.`,
        });
      }
      const pathSegments = relativeTarget.split(path.sep).filter(Boolean);
      let nearestExistingPath = cwd;

      for (const segment of pathSegments) {
        const candidatePath = path.join(nearestExistingPath, segment);
        let stats;
        try {
          stats = await fs.lstat(candidatePath);
        } catch (error) {
          if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "ENOENT"
          ) {
            break;
          }
          throw error;
        }

        if (stats.isSymbolicLink()) {
          throw new CLIError({
            message: `Project path "${finalPathInput}" passes through symbolic link "${path.relative(cwd, candidatePath)}". Choose a real directory within the current working directory.`,
          });
        }
        if (!stats.isDirectory()) {
          throw new CLIError({
            message: `Project path "${finalPathInput}" passes through "${path.relative(cwd, candidatePath)}", which is not a directory.`,
          });
        }

        nearestExistingPath = candidatePath;
      }

      const [realCwd, realExistingPath] = await Promise.all([
        fs.realpath(cwd),
        fs.realpath(nearestExistingPath),
      ]);
      const relativeRealPath = path.relative(realCwd, realExistingPath);
      if (
        relativeRealPath === ".." ||
        relativeRealPath.startsWith(`..${path.sep}`) ||
        path.isAbsolute(relativeRealPath)
      ) {
        throw new CLIError({
          message: `Project path "${finalPathInput}" resolves outside the current working directory.`,
        });
      }
    },
    catch: (error) =>
      CLIError.is(error)
        ? error
        : new CLIError({
            message: `Unable to validate project path "${finalPathInput}".`,
            cause: error,
          }),
  });
}

export async function inspectProjectPath(
  targetPath: string,
): Promise<Result<ProjectPathState, CLIError>> {
  return Result.tryPromise({
    try: async () => {
      let stats;
      try {
        stats = await fs.lstat(targetPath);
      } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "ENOENT"
        ) {
          return "missing" as const;
        }
        throw error;
      }

      if (stats.isSymbolicLink()) return "symbolic-link" as const;
      if (!stats.isDirectory()) return "non-directory" as const;

      const entries = await fs.readdir(targetPath);
      return entries.length === 0 ? ("empty-directory" as const) : ("non-empty-directory" as const);
    },
    catch: (error) =>
      new CLIError({
        message: `Unable to inspect project path "${targetPath}".`,
        cause: error,
      }),
  });
}

export async function findAvailableIncrementedPath(
  currentPathInput: string,
): Promise<Result<string, CLIError>> {
  let counter = 1;

  while (true) {
    const candidate = `${currentPathInput}-${counter}`;
    const candidateStateResult = await inspectProjectPath(path.resolve(process.cwd(), candidate));
    if (candidateStateResult.isErr()) return Result.err(candidateStateResult.error);
    if (
      candidateStateResult.value === "missing" ||
      candidateStateResult.value === "empty-directory"
    ) {
      return Result.ok(candidate);
    }
    counter++;
  }
}
