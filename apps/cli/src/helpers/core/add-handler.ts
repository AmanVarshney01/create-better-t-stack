import {
  EMBEDDED_TEMPLATES,
  processAddonTemplates,
  processAddonsDeps,
  VirtualFileSystem,
} from "@better-fullstack/template-generator";
import { writeTreeToFilesystem } from "@better-fullstack/template-generator/fs-writer";
import { intro, log, outro } from "@clack/prompts";
import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";

import type { AddInput, Addons, ProjectConfig } from "../../types";

import { getDefaultConfig } from "../../constants";
import { getAddonsToAdd } from "../../prompts/addons";
import { readBtsConfig, updateBtsConfig } from "../../utils/bts-config";
import { isSilent, runWithContextAsync } from "../../utils/context";
import { CLIError, UserCancelledError } from "../../utils/errors";
import { renderTitle } from "../../utils/render-title";
import { setupAddons } from "../addons/addons-setup";
import { installDependencies } from "./install-dependencies";

export interface AddHandlerOptions {
  silent?: boolean;
}

export interface AddResult {
  success: boolean;
  addedAddons: Addons[];
  projectDir: string;
  error?: string;
}

export async function addHandler(
  input: AddInput,
  options: AddHandlerOptions = {},
): Promise<AddResult | undefined> {
  const { silent = false } = options;

  return runWithContextAsync({ silent }, async () => {
    try {
      return await addHandlerInternal(input);
    } catch (error) {
      if (error instanceof UserCancelledError) {
        if (isSilent()) {
          return {
            success: false,
            addedAddons: [],
            projectDir: "",
            error: error.message,
          };
        }
        return;
      }

      if (error instanceof CLIError) {
        if (isSilent()) {
          return {
            success: false,
            addedAddons: [],
            projectDir: "",
            error: error.message,
          };
        }
        throw error;
      }

      if (isSilent()) {
        return {
          success: false,
          addedAddons: [],
          projectDir: "",
          error: error instanceof Error ? error.message : String(error),
        };
      }
      throw error;
    }
  });
}

async function addHandlerInternal(input: AddInput): Promise<AddResult> {
  const projectDir = path.resolve(input.projectDir || process.cwd());

  if (!isSilent()) {
    renderTitle();
    intro(pc.magenta("Add addons to your Better Fullstack project"));
  }

  const btsConfig = await readBtsConfig(projectDir);
  if (!btsConfig) {
    throw new CLIError(
      `No Better Fullstack project found in ${projectDir}. Make sure bts.jsonc exists.`,
    );
  }

  const projectName = path.basename(projectDir);
  if (!isSilent()) {
    log.info(pc.dim(`Detected project: ${projectName}`));
  }

  const existingAddons = btsConfig.addons || [];
  let addonsToAdd: Addons[] = [];

  if (input.addons && input.addons.length > 0) {
    addonsToAdd = input.addons.filter(
      (addon): addon is Addons => addon !== "none" && !existingAddons.includes(addon),
    );
  } else {
    const selectedAddons = await getAddonsToAdd(
      btsConfig.frontend || [],
      existingAddons,
      btsConfig.auth,
    );
    addonsToAdd = selectedAddons.filter((addon) => addon !== "none");
  }

  if (addonsToAdd.length === 0) {
    if (!isSilent()) {
      log.info(pc.dim("No new addons selected."));
      outro(pc.magenta("Nothing to add."));
    }
    return {
      success: true,
      addedAddons: [],
      projectDir,
    };
  }

  if (!isSilent()) {
    log.info(pc.cyan(`Adding addons: ${addonsToAdd.join(", ")}`));
  }

  const baseConfig = getDefaultConfig();
  const config: ProjectConfig = {
    ...baseConfig,
    ...btsConfig,
    projectName,
    projectDir,
    relativePath: ".",
    packageManager: input.packageManager || btsConfig.packageManager || baseConfig.packageManager,
    addons: addonsToAdd,
    frontend: btsConfig.frontend || baseConfig.frontend,
    examples: btsConfig.examples || [],
    rustLibraries: btsConfig.rustLibraries || [],
    pythonAi: btsConfig.pythonAi || [],
    aiDocs: btsConfig.aiDocs || [],
  };

  const vfs = new VirtualFileSystem();
  const packageJsonPaths = await collectPackageJsonPaths(projectDir);

  for (const pkgPath of packageJsonPaths) {
    const fullPath = path.join(projectDir, pkgPath);
    const content = await fs.readFile(fullPath, "utf-8");
    vfs.writeFile(pkgPath, content);
  }

  await processAddonTemplates(vfs, EMBEDDED_TEMPLATES, config);
  processAddonsDeps(vfs, config);

  const tree = {
    root: vfs.toTree(projectName),
    fileCount: vfs.getFileCount(),
    directoryCount: vfs.getDirectoryCount(),
    config,
  };

  await writeTreeToFilesystem(tree, projectDir);

  await setupAddons(config);

  const updatedAddons = [...new Set([...existingAddons, ...addonsToAdd])];
  const configUpdates: Partial<Pick<ProjectConfig, "webDeploy" | "serverDeploy">> & {
    addons: Addons[];
  } = {
    addons: updatedAddons,
  };

  if (input.webDeploy !== undefined) {
    configUpdates.webDeploy = input.webDeploy;
  }
  if (input.serverDeploy !== undefined) {
    configUpdates.serverDeploy = input.serverDeploy;
  }

  await updateBtsConfig(projectDir, configUpdates);

  if (input.install) {
    await installDependencies({
      projectDir,
      packageManager: config.packageManager,
    });
  }

  if (!isSilent()) {
    log.success(pc.green(`Successfully added: ${addonsToAdd.join(", ")}`));
    if (!input.install) {
      const installCmd =
        config.packageManager === "npm" ? "npm install" : `${config.packageManager} install`;
      log.info(pc.yellow(`Run '${installCmd}' to install new dependencies.`));
    }
    outro(pc.magenta("Addons added successfully!"));
  }

  return {
    success: true,
    addedAddons: addonsToAdd,
    projectDir,
  };
}

async function collectPackageJsonPaths(projectDir: string): Promise<string[]> {
  const results: string[] = [];

  async function walk(currentDir: string) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name === ".git" || entry.name === ".turbo") {
        continue;
      }

      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      if (entry.isFile() && entry.name === "package.json") {
        results.push(path.relative(projectDir, fullPath).replaceAll(path.sep, "/"));
      }
    }
  }

  await walk(projectDir);

  if (
    !results.includes("package.json") &&
    (await fs.pathExists(path.join(projectDir, "package.json")))
  ) {
    results.push("package.json");
  }

  return results;
}
