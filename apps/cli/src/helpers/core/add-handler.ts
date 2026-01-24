import {
  EMBEDDED_TEMPLATES,
  processAddonTemplates,
  processAddonsDeps,
  VirtualFileSystem,
} from "@better-t-stack/template-generator";
import { writeTree } from "@better-t-stack/template-generator/fs-writer";
import { intro, log, outro } from "@clack/prompts";
import { Result } from "better-result";
import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";

import type { AddInput, Addons, ProjectConfig } from "../../types";

import { getAddonsToAdd } from "../../prompts/addons";
import { updateBtsConfig } from "../../utils/bts-config";
import { isSilent, runWithContextAsync } from "../../utils/context";
import { CLIError, UserCancelledError, displayError } from "../../utils/errors";
import { renderTitle } from "../../utils/render-title";
import { setupAddons } from "../addons/addons-setup";
import { detectProjectConfig } from "./detect-project-config";
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
    const result = await addHandlerInternal(input);

    if (result.isOk()) {
      return result.value;
    }

    const error = result.error;

    if (UserCancelledError.is(error)) {
      if (isSilent()) {
        return {
          success: false,
          addedAddons: [],
          projectDir: "",
          error: error.message,
        };
      }
      return undefined;
    }

    if (isSilent()) {
      return {
        success: false,
        addedAddons: [],
        projectDir: "",
        error: error.message,
      };
    }

    displayError(error);
    process.exit(1);
  });
}

async function addHandlerInternal(
  input: AddInput,
): Promise<Result<AddResult, UserCancelledError | CLIError>> {
  const projectDir = input.projectDir || process.cwd();

  if (!isSilent()) {
    renderTitle();
    intro(pc.magenta("Add addons to your Better-T-Stack project"));
  }

  // Detect existing project configuration
  const existingConfig = await detectProjectConfig(projectDir);

  if (!existingConfig) {
    return Result.err(
      new CLIError({
        message: `No Better-T-Stack project found in ${projectDir}. Make sure bts.jsonc exists.`,
      }),
    );
  }

  if (!isSilent()) {
    log.info(pc.dim(`Detected project: ${existingConfig.projectName}`));
  }

  // Determine which addons to add
  let addonsToAdd: Addons[];

  if (input.addons && input.addons.length > 0) {
    // Filter out 'none' and already installed addons
    addonsToAdd = input.addons.filter(
      (addon) => addon !== "none" && !existingConfig.addons.includes(addon),
    );

    if (addonsToAdd.length === 0) {
      if (!isSilent()) {
        log.warn(pc.yellow("All specified addons are already installed or invalid."));
      }
      return Result.ok({
        success: true,
        addedAddons: [],
        projectDir,
      });
    }
  } else {
    // Interactive mode - prompt user to select addons
    const promptResult = await Result.tryPromise({
      try: () =>
        getAddonsToAdd(existingConfig.frontend, existingConfig.addons, existingConfig.auth),
      catch: (e: unknown) => {
        if (UserCancelledError.is(e)) return e;
        return new CLIError({
          message: e instanceof Error ? e.message : String(e),
          cause: e,
        });
      },
    });

    if (promptResult.isErr()) {
      return Result.err(promptResult.error);
    }

    const selectedAddons = promptResult.value;

    if (selectedAddons.length === 0) {
      if (!isSilent()) {
        log.info(pc.dim("No addons selected."));
        outro(pc.magenta("Nothing to add."));
      }
      return Result.ok({
        success: true,
        addedAddons: [],
        projectDir,
      });
    }

    addonsToAdd = selectedAddons;
  }

  if (!isSilent()) {
    log.info(pc.cyan(`Adding addons: ${addonsToAdd.join(", ")}`));
  }

  // Build config for addon setup
  const updatedAddons = [...existingConfig.addons, ...addonsToAdd];
  const config: ProjectConfig = {
    projectName: existingConfig.projectName,
    projectDir,
    relativePath: ".",
    database: existingConfig.database,
    orm: existingConfig.orm,
    backend: existingConfig.backend,
    runtime: existingConfig.runtime,
    frontend: existingConfig.frontend,
    addons: addonsToAdd, // Only the new addons for template processing
    examples: existingConfig.examples,
    auth: existingConfig.auth,
    payments: existingConfig.payments,
    git: false,
    packageManager: input.packageManager || existingConfig.packageManager,
    install: input.install ?? false,
    dbSetup: existingConfig.dbSetup,
    api: existingConfig.api,
    webDeploy: existingConfig.webDeploy,
    serverDeploy: existingConfig.serverDeploy,
  };

  // Create VFS and process addon templates using template-generator's logic
  if (!isSilent()) {
    log.info(pc.dim("Installing addon files..."));
  }

  const vfs = new VirtualFileSystem();

  // Pre-load existing package.json files into VFS so processAddonsDeps can modify them
  const packageJsonPaths = ["package.json", "apps/web/package.json"];
  for (const pkgPath of packageJsonPaths) {
    const fullPath = path.join(projectDir, pkgPath);
    if (await fs.pathExists(fullPath)) {
      const content = await fs.readFile(fullPath, "utf-8");
      vfs.writeFile(pkgPath, content);
    }
  }

  // Process addon templates
  await processAddonTemplates(vfs, EMBEDDED_TEMPLATES, config);

  // Process addon dependencies (adds deps to package.json files in VFS)
  processAddonsDeps(vfs, config);

  // Write VFS to disk
  const tree = {
    root: vfs.toTree(""),
    fileCount: vfs.getFileCount(),
    directoryCount: vfs.getDirectoryCount(),
    config,
  };

  const writeResult = await writeTree(tree, projectDir);

  if (writeResult.isErr()) {
    return Result.err(
      new CLIError({
        message: `Failed to write addon files: ${writeResult.error.message}`,
      }),
    );
  }

  if (vfs.getFileCount() > 0 && !isSilent()) {
    log.info(pc.dim(`Wrote ${vfs.getFileCount()} addon files`));
  }

  // Run addon setup (handles deps and interactive prompts)
  // Wrap with Result.tryPromise since setupAddons can throw UserCancelledError
  const setupResult = await Result.tryPromise({
    try: () => setupAddons(config),
    catch: (e: unknown) => {
      if (UserCancelledError.is(e)) return e;
      return new CLIError({
        message: e instanceof Error ? e.message : String(e),
        cause: e,
      });
    },
  });

  if (setupResult.isErr()) {
    return Result.err(setupResult.error);
  }

  // Update bts.jsonc with new addons
  await updateBtsConfig(projectDir, {
    addons: updatedAddons,
  });

  // Install dependencies if requested
  if (input.install) {
    if (!isSilent()) {
      log.info(pc.dim("Installing dependencies..."));
    }
    await installDependencies({ projectDir, packageManager: config.packageManager });
  }

  if (!isSilent()) {
    log.success(pc.green(`Successfully added: ${addonsToAdd.join(", ")}`));

    if (!input.install) {
      log.info(
        pc.yellow(
          `Run '${config.packageManager === "npm" ? "npm install" : `${config.packageManager} install`}' to install new dependencies.`,
        ),
      );
    }

    outro(pc.magenta("Addons added successfully!"));
  }

  return Result.ok({
    success: true,
    addedAddons: addonsToAdd,
    projectDir,
  });
}
