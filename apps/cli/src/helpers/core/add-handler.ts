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
import z from "zod";

import { getAddonsToAdd } from "../../prompts/addons";
import type { AddInput, Addons, AddonOptions, ProjectConfig } from "../../types";
import { updateBtsConfig } from "../../utils/bts-config";
import { validateAddonsAgainstConfig } from "../../utils/compatibility-rules";
import { isSilent, runWithContextAsync } from "../../utils/context";
import { formatConfigValue } from "../../utils/display-config";
import { CLIError, UserCancelledError, displayError } from "../../utils/errors";
import { validateAgentSafePathInput } from "../../utils/input-hardening";
import { renderTitle } from "../../utils/render-title";
import { checkLocalRequirements } from "../../utils/requirements";
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
  addedPackage?: string;
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

const ADD_TEXT_FILE_PATHS = [".gitignore", "apps/web/vite.config.ts", "lefthook.yml"];

const HOOK_ADDONS = ["husky", "lefthook"] as const satisfies readonly Addons[];
const HOOK_LINTER_ADDONS = ["biome", "oxlint", "vite-plus"] as const satisfies readonly Addons[];
const TASK_RUNNER_ADDONS = ["turborepo", "nx", "vite-plus"] as const satisfies readonly Addons[];
const fileExistsErrorSchema = z.object({ code: z.literal("EEXIST") });
const configPackageScopeSchema = z
  .object({
    name: z.string().regex(/^@[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?\/config$/),
  })
  .transform(({ name }) => name.slice(0, -"/config".length));
const rootTypescriptVersionSchema = z
  .object({
    devDependencies: z.object({ typescript: z.string().min(1) }),
  })
  .transform(({ devDependencies }) => devDependencies.typescript);

function isFileExistsError(cause: unknown): boolean {
  return fileExistsErrorSchema.safeParse(cause).success;
}

async function reserveWorkspacePackage(
  projectDir: string,
  packageName: string,
): Promise<Result<string, CLIError>> {
  const packageDir = path.join(projectDir, "packages", packageName);

  return Result.tryPromise({
    try: async () => {
      await fs.mkdir(packageDir);
      return packageDir;
    },
    catch: (cause: unknown) =>
      new CLIError({
        message: isFileExistsError(cause)
          ? `Workspace package already exists: packages/${packageName}`
          : `Failed to reserve workspace package: packages/${packageName}`,
        cause,
      }),
  });
}

async function addWorkspacePackage(
  vfs: VirtualFileSystem,
  projectDir: string,
  packageName: string,
  packageManager: ProjectConfig["packageManager"],
): Promise<Result<void, CLIError>> {
  const packageDir = path.join(projectDir, "packages", packageName);
  if (await fs.pathExists(packageDir)) {
    return Result.err(
      new CLIError({
        message: `Workspace package already exists: packages/${packageName}`,
      }),
    );
  }

  const configPackagePath = path.join(projectDir, "packages", "config", "package.json");
  const packageScopeResult = await Result.tryPromise({
    try: async () => configPackageScopeSchema.parse(await fs.readJson(configPackagePath)),
    catch: (cause: unknown) =>
      new CLIError({
        message:
          "Cannot determine the workspace package scope. Expected packages/config/package.json to have a name like @my-app/config.",
        cause,
      }),
  });
  if (packageScopeResult.isErr()) {
    return Result.err(packageScopeResult.error);
  }

  const typescriptVersionResult = await Result.tryPromise({
    try: async () =>
      rootTypescriptVersionSchema.parse(await fs.readJson(path.join(projectDir, "package.json"))),
    catch: (cause: unknown) =>
      new CLIError({
        message:
          "Cannot determine the TypeScript version. Expected package.json to declare devDependencies.typescript.",
        cause,
      }),
  });
  if (typescriptVersionResult.isErr()) {
    return Result.err(typescriptVersionResult.error);
  }

  const packageScope = packageScopeResult.value;
  const fullPackageName = `${packageScope}/${packageName}`;
  if (fullPackageName.length > 214) {
    return Result.err(
      new CLIError({
        message: "Workspace package name must not exceed 214 characters including its scope.",
      }),
    );
  }

  const packagePath = `packages/${packageName}`;
  vfs.writeFile(
    `${packagePath}/package.json`,
    `${JSON.stringify(
      {
        name: fullPackageName,
        version: "0.0.0",
        private: true,
        type: "module",
        exports: { ".": "./src/index.ts" },
        scripts: { "check-types": "tsc --noEmit" },
        devDependencies: {
          [`${packageScope}/config`]: packageManager === "npm" ? "*" : "workspace:*",
          typescript: typescriptVersionResult.value,
        },
      },
      null,
      2,
    )}\n`,
  );
  vfs.writeFile(
    `${packagePath}/tsconfig.json`,
    `${JSON.stringify(
      {
        extends: `${packageScope}/config/tsconfig.base.json`,
        include: ["src/**/*.ts"],
      },
      null,
      2,
    )}\n`,
  );
  vfs.writeFile(`${packagePath}/src/index.ts`, "export {};\n");

  return Result.ok(undefined);
}

function mergeAddonOptions(
  existingAddonOptions?: AddonOptions,
  nextAddonOptions?: AddonOptions,
): AddonOptions | undefined {
  if (!existingAddonOptions && !nextAddonOptions) {
    return undefined;
  }

  const mergeOption = <T extends object>(existing: T | undefined, next: T | undefined) => {
    if (!existing) return next;
    if (!next) return existing;
    return { ...existing, ...next };
  };

  const mergedAddonOptions: AddonOptions = {
    wxt: mergeOption(existingAddonOptions?.wxt, nextAddonOptions?.wxt),
    fumadocs: mergeOption(existingAddonOptions?.fumadocs, nextAddonOptions?.fumadocs),
    opentui: mergeOption(existingAddonOptions?.opentui, nextAddonOptions?.opentui),
    mcp: mergeOption(existingAddonOptions?.mcp, nextAddonOptions?.mcp),
    skills: mergeOption(existingAddonOptions?.skills, nextAddonOptions?.skills),
    ultracite: mergeOption(existingAddonOptions?.ultracite, nextAddonOptions?.ultracite),
  };

  return Object.values(mergedAddonOptions).some(Boolean) ? mergedAddonOptions : undefined;
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
    intro(pc.magenta("Add to your project"));
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

    if (addonsToAdd.length === 0 && !input.package) {
      if (!isSilent()) {
        log.warn(pc.yellow("Nothing to add — those addons are already installed"));
        outro(pc.dim("Project unchanged"));
      }
      return Result.ok({
        success: true,
        addedAddons: [],
        projectDir,
      });
    }
  } else if (input.package) {
    addonsToAdd = [];
  } else if (isSilent()) {
    return Result.err(
      new CLIError({
        message: "Addons or a package are required in silent mode.",
      }),
    );
  } else {
    // Interactive mode - prompt user to select addons
    const promptResult = await Result.tryPromise({
      try: () => getAddonsToAdd(existingConfig),
      catch: (cause: unknown) => {
        if (UserCancelledError.is(cause)) return cause;
        return new CLIError({
          message: cause instanceof Error ? cause.message : String(cause),
          cause: cause,
        });
      },
    });

    if (promptResult.isErr()) {
      return Result.err(promptResult.error);
    }

    const selectedAddons = promptResult.value;

    if (selectedAddons.length === 0) {
      if (!isSilent()) {
        outro(pc.dim("Nothing selected · project unchanged"));
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
    const additions = [
      addonsToAdd.length > 0 ? formatConfigValue(addonsToAdd) : undefined,
      input.package ? `package ${input.package}` : undefined,
    ].filter(Boolean);
    log.info(`${pc.dim("Adding")} ${pc.cyan(additions.join(" and "))}`);
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

  if (addonsToAdd.length > 0) {
    const requirementsResult = await checkLocalRequirements(updatedConfig);
    if (requirementsResult.isErr()) {
      return Result.err(requirementsResult.error);
    }
    if (!isSilent()) {
      for (const warning of requirementsResult.value.warnings) {
        log.warn(pc.yellow(warning));
      }
    }
  }

  // Create VFS and process addon templates using template-generator's logic
  if (!isSilent()) {
    log.info(pc.dim("Preparing files…"));
  }

  const vfs = new VirtualFileSystem();

  if (input.package) {
    const packageResult = await addWorkspacePackage(
      vfs,
      projectDir,
      input.package,
      existingConfig.packageManager,
    );
    if (packageResult.isErr()) {
      return Result.err(packageResult.error);
    }
  }

  if (addonsToAdd.length > 0) {
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

    // Process addon templates and dependencies using template-generator's logic.
    await processAddonTemplates(vfs, EMBEDDED_TEMPLATES, config);
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
      log.success(pc.green("Dry run passed · no files written"));
      log.message(pc.dim(`${vfs.getFileCount()} files planned`));
      outro(pc.dim("Project unchanged"));
    }

    return Result.ok({
      success: true,
      addedAddons: addonsToAdd,
      projectDir,
      dryRun: true,
      plannedFileCount: vfs.getFileCount(),
      addedPackage: input.package,
    });
  }

  let reservedPackageDir: string | undefined;
  if (input.package) {
    const reservationResult = await reserveWorkspacePackage(projectDir, input.package);
    if (reservationResult.isErr()) {
      return Result.err(reservationResult.error);
    }
    reservedPackageDir = reservationResult.value;
  }

  const writeResult = await writeTree(tree, projectDir);

  if (writeResult.isErr()) {
    if (reservedPackageDir && input.package) {
      const cleanupResult = await Result.tryPromise({
        try: () => fs.remove(reservedPackageDir),
        catch: (cause: unknown) =>
          new CLIError({
            message: `Failed to clean up incomplete workspace package: packages/${input.package}`,
            cause,
          }),
      });
      if (cleanupResult.isErr()) {
        return Result.err(
          new CLIError({
            message: `Failed to write files: ${writeResult.error.message}. ${cleanupResult.error.message}`,
            cause: cleanupResult.error,
          }),
        );
      }
    }

    return Result.err(
      new CLIError({
        message: `Failed to write files: ${writeResult.error.message}`,
      }),
    );
  }

  if (vfs.getFileCount() > 0 && !isSilent()) {
    log.info(pc.dim(`Wrote ${vfs.getFileCount()} files`));
  }

  // Run addon setup (handles deps and interactive prompts)
  // Wrap with Result.tryPromise since setupAddons can throw UserCancelledError
  const setupResult = await Result.tryPromise({
    try: async () => {
      if (addonsToAdd.length > 0) {
        await setupAddons({
          ...config,
          addons: getSetupAddons(addonsToAdd, updatedAddons),
        });
      }
    },
    catch: (cause: unknown) => {
      if (UserCancelledError.is(cause)) return cause;
      return new CLIError({
        message: cause instanceof Error ? cause.message : String(cause),
        cause: cause,
      });
    },
  });

  if (setupResult.isErr()) {
    return Result.err(setupResult.error);
  }

  // Update bts.jsonc with new addons
  if (addonsToAdd.length > 0) {
    await updateBtsConfig(projectDir, {
      addons: updatedAddons,
      addonOptions: updatedConfig.addonOptions,
    });
  }

  // Install dependencies if requested
  if (input.install) {
    await installDependencies({ projectDir, packageManager: config.packageManager });
  }

  if (!isSilent()) {
    const additions = [
      addonsToAdd.length > 0 ? formatConfigValue(addonsToAdd) : undefined,
      input.package ? `package ${input.package}` : undefined,
    ].filter(Boolean);
    log.success(pc.green(`Added ${additions.join(" and ")}`));

    if (!input.install) {
      const installCommand =
        config.packageManager === "npm" ? "npm install" : `${config.packageManager} install`;
      log.message(`${pc.dim("Next step")}\n${pc.cyan(installCommand)}`);
    }

    outro(pc.magenta("Project updated"));
  }

  return Result.ok({
    success: true,
    addedAddons: addonsToAdd,
    projectDir,
    plannedFileCount: vfs.getFileCount(),
    addedPackage: input.package,
  });
}
