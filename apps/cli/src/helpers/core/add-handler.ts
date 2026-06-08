import path from "node:path";

import {
  EMBEDDED_TEMPLATES,
  processAddonTemplates,
  processAddonsDeps,
  processNxConfig,
  processPackageConfigs,
  processTurboConfig,
  processVitePlusConfig,
  processTemplateString,
  VirtualFileSystem,
} from "@better-t-stack/template-generator";
import { writeTree } from "@better-t-stack/template-generator/fs-writer";
import { intro, log, outro } from "@clack/prompts";
import { Result } from "better-result";
import fs from "fs-extra";
import pc from "picocolors";

import { getAddonsToAdd } from "../../prompts/addons";
import type { AddInput, Addons, AddonOptions, ProjectConfig } from "../../types";
import { updateBtsConfig } from "../../utils/bts-config";
import { validateAddonsAgainstConfig } from "../../utils/compatibility-rules";
import { isSilent, runWithContextAsync } from "../../utils/context";
import { CLIError, UserCancelledError, displayError } from "../../utils/errors";
import { validateAgentSafePathInput } from "../../utils/input-hardening";
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
  dryRun?: boolean;
  plannedFileCount?: number;
  error?: string;
}

const ADD_PACKAGE_JSON_PATHS = [
  "package.json",
  "apps/server/package.json",
  "apps/web/package.json",
  "apps/native/package.json",
  "apps/desktop/package.json",
  "apps/fumadocs/package.json",
  "apps/docs/package.json",
  "packages/api/package.json",
  "packages/db/package.json",
  "packages/auth/package.json",
  "packages/backend/package.json",
  "packages/config/package.json",
  "packages/env/package.json",
  "packages/infra/package.json",
  "packages/ui/package.json",
];

const ADD_TEXT_FILE_PATHS = ["apps/web/vite.config.ts", "lefthook.yml"];

const HOOK_ADDONS = ["husky", "lefthook"] as const satisfies readonly Addons[];
const HOOK_LINTER_ADDONS = ["biome", "oxlint", "vite-plus"] as const satisfies readonly Addons[];
const TASK_RUNNER_ADDONS = ["turborepo", "nx", "vite-plus"] as const satisfies readonly Addons[];

function mergeAddonOptions(
  existingAddonOptions?: AddonOptions,
  nextAddonOptions?: AddonOptions,
): AddonOptions | undefined {
  if (!existingAddonOptions && !nextAddonOptions) {
    return undefined;
  }

  const mergedAddonOptions: Partial<AddonOptions> = { ...existingAddonOptions };

  if (nextAddonOptions) {
    for (const addonKey of Object.keys(nextAddonOptions) as (keyof AddonOptions)[]) {
      const existingOptionsForAddon = existingAddonOptions?.[addonKey];
      const nextOptionsForAddon = nextAddonOptions[addonKey];
      const mergedOptionsForAddon =
        existingOptionsForAddon && nextOptionsForAddon
          ? { ...existingOptionsForAddon, ...nextOptionsForAddon }
          : nextOptionsForAddon;

      (
        mergedAddonOptions as Record<
          keyof AddonOptions,
          AddonOptions[keyof AddonOptions] | undefined
        >
      )[addonKey] = mergedOptionsForAddon as AddonOptions[keyof AddonOptions];
    }
  }

  return Object.keys(mergedAddonOptions).length > 0
    ? (mergedAddonOptions as AddonOptions)
    : undefined;
}

function getSetupAddons(addonsToAdd: Addons[], updatedAddons: Addons[]): Addons[] {
  const setupAddons = new Set(addonsToAdd);
  const changedHookStack = addonsToAdd.some(
    (addon) =>
      (HOOK_ADDONS as readonly Addons[]).includes(addon) ||
      (HOOK_LINTER_ADDONS as readonly Addons[]).includes(addon),
  );

  if (changedHookStack) {
    // Re-run the existing hook/linter stack so late additions rewrite hook commands together.
    for (const addon of [...HOOK_ADDONS, ...HOOK_LINTER_ADDONS]) {
      if (updatedAddons.includes(addon)) {
        setupAddons.add(addon);
      }
    }
  }

  return [...setupAddons];
}

function shouldRefreshLefthook(addonsToAdd: Addons[], updatedAddons: Addons[]): boolean {
  return (
    updatedAddons.includes("lefthook") &&
    addonsToAdd.some(
      (addon) => addon === "lefthook" || (HOOK_LINTER_ADDONS as readonly Addons[]).includes(addon),
    )
  );
}

function refreshLefthookTemplate(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const template = EMBEDDED_TEMPLATES.get("addons/lefthook/lefthook.yml.hbs");
  if (!template) return;

  vfs.writeFile("lefthook.yml", processTemplateString(template, config));
}

function updateViteConfigImportsForVitePlus(vfs: VirtualFileSystem): void {
  const viteConfigPaths = ["apps/web/vite.config.ts"];

  for (const viteConfigPath of viteConfigPaths) {
    const content = vfs.readFile(viteConfigPath);
    if (!content) continue;

    const updatedContent = content
      .replaceAll('from "vite";', 'from "vite-plus";')
      .replaceAll("from 'vite';", "from 'vite-plus';");

    if (updatedContent !== content) {
      vfs.writeFile(viteConfigPath, updatedContent);
    }
  }
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
  const hardeningResult = validateAgentSafePathInput(projectDir, "projectDir");
  if (hardeningResult.isErr()) {
    return Result.err(
      new CLIError({
        message: hardeningResult.error.message,
        cause: hardeningResult.error,
      }),
    );
  }

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
  } else if (isSilent()) {
    return Result.err(
      new CLIError({
        message: "Addons are required in silent mode. Provide them via add() or add-json.",
      }),
    );
  } else {
    // Interactive mode - prompt user to select addons
    const promptResult = await Result.tryPromise({
      try: () => getAddonsToAdd(existingConfig),
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

  // Build config for addon setup
  const updatedAddons = [...existingConfig.addons, ...addonsToAdd];
  const addonsValidationResult = validateAddonsAgainstConfig(updatedAddons, existingConfig);
  if (addonsValidationResult.isErr()) {
    return Result.err(new CLIError({ message: addonsValidationResult.error.message }));
  }

  if (!isSilent()) {
    log.info(pc.cyan(`Adding addons: ${addonsToAdd.join(", ")}`));
  }

  const mergedAddonOptions = mergeAddonOptions(existingConfig.addonOptions, input.addonOptions);
  const config: ProjectConfig = {
    projectName: existingConfig.projectName,
    projectDir,
    relativePath: ".",
    addonOptions: mergedAddonOptions,
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
  const updatedConfig: ProjectConfig = {
    ...config,
    addons: updatedAddons,
  };

  // Create VFS and process addon templates using template-generator's logic
  if (!isSilent()) {
    log.info(pc.dim("Installing addon files..."));
  }

  const vfs = new VirtualFileSystem();

  // Pre-load existing files into VFS so addon processors can modify them.
  for (const pkgPath of ADD_PACKAGE_JSON_PATHS) {
    const fullPath = path.join(projectDir, pkgPath);
    if (await fs.pathExists(fullPath)) {
      const content = await fs.readFile(fullPath, "utf-8");
      vfs.writeFile(pkgPath, content);
    }
  }
  for (const filePath of ADD_TEXT_FILE_PATHS) {
    const fullPath = path.join(projectDir, filePath);
    if (await fs.pathExists(fullPath)) {
      const content = await fs.readFile(fullPath, "utf-8");
      vfs.writeFile(filePath, content);
    }
  }

  // Process addon templates
  await processAddonTemplates(vfs, EMBEDDED_TEMPLATES, config);

  // Process addon dependencies (adds deps to package.json files in VFS)
  processAddonsDeps(vfs, config);

  if (addonsToAdd.includes("turborepo")) {
    processTurboConfig(vfs, updatedConfig);
  }

  if (addonsToAdd.includes("nx")) {
    processNxConfig(vfs, updatedConfig);
  }

  if (addonsToAdd.includes("vite-plus")) {
    processVitePlusConfig(vfs, updatedConfig);
  }

  const hasTaskRunner = updatedAddons.some((addon) =>
    (TASK_RUNNER_ADDONS as readonly Addons[]).includes(addon),
  );

  if (hasTaskRunner) {
    processPackageConfigs(vfs, updatedConfig);
  }

  if (updatedAddons.includes("vite-plus")) {
    updateViteConfigImportsForVitePlus(vfs);
  }

  if (shouldRefreshLefthook(addonsToAdd, updatedAddons)) {
    refreshLefthookTemplate(vfs, updatedConfig);
  }

  // Write VFS to disk
  const tree = {
    root: vfs.toTree(""),
    fileCount: vfs.getFileCount(),
    directoryCount: vfs.getDirectoryCount(),
    config: updatedConfig,
  };

  if (input.dryRun) {
    if (!isSilent()) {
      log.success(pc.green("Dry run validation passed. No addon files were written."));
      log.info(pc.dim(`Planned addon files: ${vfs.getFileCount()}`));
      outro(pc.magenta("Dry run complete."));
    }

    return Result.ok({
      success: true,
      addedAddons: addonsToAdd,
      projectDir,
      dryRun: true,
      plannedFileCount: vfs.getFileCount(),
    });
  }

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
    try: () =>
      setupAddons({
        ...config,
        addons: getSetupAddons(addonsToAdd, updatedAddons),
      }),
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
    addonOptions: updatedConfig.addonOptions,
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
    plannedFileCount: vfs.getFileCount(),
  });
}
