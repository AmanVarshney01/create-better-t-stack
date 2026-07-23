import path from "node:path";

import { isCancel, text } from "@clack/prompts";
import fs from "fs-extra";
import pc from "picocolors";

import { DEFAULT_CONFIG } from "../constants";
import { ProjectNameSchema } from "../types";
import { UserCancelledError } from "../utils/errors";
import { cliConsola } from "../utils/terminal-output";

function isPathWithinCwd(targetPath: string) {
  const resolved = path.resolve(targetPath);
  const rel = path.relative(process.cwd(), resolved);
  return !rel.startsWith("..") && !path.isAbsolute(rel);
}

function validateDirectoryName(name: string) {
  if (name === ".") return undefined;

  const result = ProjectNameSchema.safeParse(name);
  if (!result.success) {
    return result.error.issues[0]?.message || "Invalid project name";
  }
  return undefined;
}

export async function getProjectName(initialName?: string): Promise<string> {
  if (initialName) {
    if (initialName === ".") {
      return initialName;
    }
    const finalDirName = path.basename(initialName);
    const validationError = validateDirectoryName(finalDirName);
    if (!validationError) {
      const projectDir = path.resolve(process.cwd(), initialName);
      if (isPathWithinCwd(projectDir)) {
        return initialName;
      }
      cliConsola.error(pc.red("Project path must be within current directory"));
    }
  }

  let isValid = false;
  let projectPath = "";
  let defaultName: string = DEFAULT_CONFIG.projectName;
  let counter = 1;

  while (true) {
    const defaultPath = path.resolve(process.cwd(), defaultName);
    let stats;
    try {
      stats = await fs.lstat(defaultPath);
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

    if (stats.isDirectory() && (await fs.readdir(defaultPath)).length === 0) break;
    defaultName = `${DEFAULT_CONFIG.projectName}-${counter}`;
    counter++;
  }

  while (!isValid) {
    const response = await text({
      message: "Where should we create your project?",
      placeholder: defaultName,
      initialValue: initialName,
      defaultValue: defaultName,
      validate: (value) => {
        const nameToUse = String(value ?? "").trim() || defaultName;

        const finalDirName = path.basename(nameToUse);
        const validationError = validateDirectoryName(finalDirName);
        if (validationError) return validationError;

        if (nameToUse !== ".") {
          const projectDir = path.resolve(process.cwd(), nameToUse);
          if (!isPathWithinCwd(projectDir)) {
            return "Project path must be within current directory";
          }
        }

        return undefined;
      },
    });

    if (isCancel(response)) {
      throw new UserCancelledError({ message: "Operation cancelled." });
    }

    projectPath = response || defaultName;
    isValid = true;
  }

  return projectPath;
}
