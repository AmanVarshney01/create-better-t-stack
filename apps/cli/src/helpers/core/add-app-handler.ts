import path from "node:path";

import {
  collectTreeFiles,
  EMBEDDED_TEMPLATES,
  generate,
  getWorkspaceScriptCommand,
  VirtualFileSystem,
  type JsonObject,
  type VirtualFile,
} from "@better-t-stack/template-generator";
import { writeTree } from "@better-t-stack/template-generator/fs-writer";
import { intro, log, outro } from "@clack/prompts";
import { Result } from "better-result";
import fs from "fs-extra";
import pc from "picocolors";
import YAML from "yaml";

import { getAppFrontend, getAppName, validateAppName } from "../../prompts/add-app";
import type { AddAppInput, AddedApp, Addons, ProjectConfig } from "../../types";
import { updateBtsConfig } from "../../utils/bts-config";
import {
  isExampleAIAllowed,
  isExampleTodoAllowed,
  validateAddAppFrontendCompatibility,
} from "../../utils/compatibility-rules";
import { isSilent, runWithContextAsync } from "../../utils/context";
import { CLIError, displayError, UserCancelledError } from "../../utils/errors";
import { formatCode } from "../../utils/file-formatter";
import { getLatestCLIVersion } from "../../utils/get-latest-cli-version";
import { validateAgentSafePathInput } from "../../utils/input-hardening";
import { inspectProjectPath } from "../../utils/project-directory";
import { renderTitle } from "../../utils/render-title";
import { detectProjectConfig } from "./detect-project-config";
import { installDependencies } from "./install-dependencies";

export interface AddAppHandlerOptions {
  silent?: boolean;
}

export interface AddAppResult {
  success: boolean;
  appName?: string;
  frontend?: AddedApp["frontend"];
  port?: number;
  projectDir: string;
  dryRun?: boolean;
  plannedFileCount?: number;
  warning?: string;
  error?: string;
}

type ExistingProjectConfig = NonNullable<Awaited<ReturnType<typeof detectProjectConfig>>>;

const BINARY_MARKER = "[Binary file]";
const TASK_RUNNER_ADDONS = ["turborepo", "nx", "vite-plus"] as const satisfies readonly Addons[];
const REACT_FAMILY_FRONTENDS: readonly AddedApp["frontend"][] = [
  "tanstack-router",
  "react-router",
  "tanstack-start",
  "next",
];

interface WorkspacePackagesConfig extends JsonObject {
  packages?: string[];
  catalog?: Record<string, string>;
}

interface RootPackageJson extends JsonObject {
  scripts?: Record<string, string>;
  workspaces?: string[] | WorkspacePackagesConfig;
  allowScripts?: Record<string, boolean>;
  overrides?: Record<string, string>;
}

interface EnvPackageJson extends JsonObject {
  exports?: Record<string, string>;
  dependencies?: Record<string, string>;
}

interface PnpmWorkspaceConfig extends JsonObject {
  catalog?: Record<string, string>;
  allowBuilds?: Record<string, boolean>;
  minimumReleaseAgeExclude?: string[];
}

interface AppPackageJson extends JsonObject {
  name?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

/**
 * Adds another frontend app to an existing Better-T-Stack project.
 * In silent mode returns a structured failure instead of exiting; interactive
 * cancellation returns undefined.
 */
export async function addAppHandler(
  input: AddAppInput,
  options: AddAppHandlerOptions = {},
): Promise<AddAppResult | undefined> {
  return runWithContextAsync({ silent: options.silent ?? false }, async () => {
    const result = await addAppHandlerInternal(input);

    if (result.isOk()) {
      return result.value;
    }

    const error = result.error;

    if (UserCancelledError.is(error)) {
      if (isSilent()) {
        return {
          success: false,
          projectDir: input.projectDir ?? process.cwd(),
          error: error.message,
        };
      }
      return undefined;
    }

    if (isSilent()) {
      return {
        success: false,
        projectDir: input.projectDir ?? process.cwd(),
        error: error.message,
      };
    }

    displayError(error);
    process.exit(1);
  });
}

/**
 * The full add-app flow: detect the project, resolve name/frontend/port,
 * scratch-generate a single-frontend project in memory, relocate its web app
 * into apps/<name>, patch workspace files, and write the result.
 */
async function addAppHandlerInternal(
  input: AddAppInput,
): Promise<Result<AddAppResult, UserCancelledError | CLIError>> {
  const projectDir = input.projectDir || process.cwd();

  const pathValidation = validateAgentSafePathInput(projectDir, "projectDir");
  if (pathValidation.isErr()) {
    return Result.err(new CLIError({ message: pathValidation.error.message }));
  }

  if (!isSilent()) {
    renderTitle();
    intro(pc.magenta("Add an app to your project"));
  }

  const existingConfig = await detectProjectConfig(projectDir);
  if (!existingConfig) {
    return Result.err(
      new CLIError({
        message: `No Better-T-Stack project found in ${projectDir}. Make sure bts.jsonc exists.`,
      }),
    );
  }

  const cliVersion = getLatestCLIVersion();
  if (!isSilent() && existingConfig.version && existingConfig.version !== cliVersion) {
    log.warn(
      pc.yellow(
        `This project was created with CLI ${existingConfig.version}; you are running ${cliVersion}. Generated app files may not match older shared packages.`,
      ),
    );
  }

  // Guard before any prompt: a fullstack (self) backend rejects every
  // framework, so the interactive selector would otherwise open with no options.
  if (existingConfig.backend === "self") {
    const selfResult = validateAddAppFrontendCompatibility("next", existingConfig);
    if (selfResult.isErr()) {
      return Result.err(new CLIError({ message: selfResult.error.message }));
    }
  }

  const existingApps = existingConfig.apps ?? [];
  const takenNames = new Set(existingApps.map((app) => app.name));

  // Resolve app name
  let appName: string;
  if (input.name !== undefined) {
    const nameError = validateAppName(input.name, takenNames);
    if (nameError) {
      return Result.err(new CLIError({ message: `Invalid app name: ${nameError}` }));
    }
    appName = input.name;
  } else if (isSilent()) {
    return Result.err(
      new CLIError({
        message:
          "App name and frontend are required in silent mode. Provide 'name' and 'frontend'.",
      }),
    );
  } else {
    const nameResult = await Result.tryPromise({
      try: () => getAppName(takenNames),
      catch: (e) =>
        UserCancelledError.is(e)
          ? e
          : new CLIError({
              message: `Failed to get app name: ${e instanceof Error ? e.message : String(e)}`,
              cause: e,
            }),
    });
    if (nameResult.isErr()) return Result.err(nameResult.error);
    appName = nameResult.value;
  }

  // Resolve frontend
  let frontend: AddedApp["frontend"];
  if (input.frontend !== undefined) {
    frontend = input.frontend;
  } else if (isSilent()) {
    return Result.err(
      new CLIError({
        message:
          "App name and frontend are required in silent mode. Provide 'name' and 'frontend'.",
      }),
    );
  } else {
    const frontendResult = await Result.tryPromise({
      try: () => getAppFrontend(existingConfig),
      catch: (e) =>
        UserCancelledError.is(e)
          ? e
          : new CLIError({
              message: `Failed to select a framework: ${e instanceof Error ? e.message : String(e)}`,
              cause: e,
            }),
    });
    if (frontendResult.isErr()) return Result.err(frontendResult.error);
    frontend = frontendResult.value;
  }

  const compatResult = validateAddAppFrontendCompatibility(frontend, existingConfig);
  if (compatResult.isErr()) {
    return Result.err(new CLIError({ message: compatResult.error.message }));
  }

  // Directory conflict check
  const appDir = `apps/${appName}`;
  const pathStateResult = await inspectProjectPath(path.join(projectDir, "apps", appName));
  if (pathStateResult.isErr()) {
    return Result.err(pathStateResult.error);
  }
  if (pathStateResult.value !== "missing" && pathStateResult.value !== "empty-directory") {
    return Result.err(
      new CLIError({
        message: `Cannot add app '${appName}': ${appDir} already exists in this project.`,
      }),
    );
  }

  // Port allocation
  const usedPorts = new Set([3000, 3001, ...existingApps.map((app) => app.port)]);
  let port: number;
  if (input.port !== undefined) {
    if (usedPorts.has(input.port)) {
      return Result.err(
        new CLIError({
          message: `Port ${input.port} is already used in this project. Choose a different --port.`,
        }),
      );
    }
    port = input.port;
  } else {
    port = 3002;
    while (usedPorts.has(port)) port++;
  }

  // Examples that remain compatible with the new app's framework
  const keptExamples = (existingConfig.examples ?? []).filter((example) => {
    if (example === "todo") {
      return isExampleTodoAllowed(
        existingConfig.backend,
        existingConfig.database,
        existingConfig.api,
      );
    }
    if (example === "ai") {
      return isExampleAIAllowed(existingConfig.backend, [frontend]);
    }
    return false;
  });
  const droppedExamples = (existingConfig.examples ?? []).filter(
    (example) => example !== "none" && !keptExamples.includes(example),
  );
  if (!isSilent() && droppedExamples.length > 0) {
    log.info(
      pc.dim(
        `Skipping example${droppedExamples.length > 1 ? "s" : ""} not supported by this stack: ${droppedExamples.join(", ")}`,
      ),
    );
  }

  const packageManager = input.packageManager || existingConfig.packageManager;
  const projectAddons = existingConfig.addons ?? [];

  // Synthetic config: render the new app exactly like a fresh single-frontend
  // project, minus deploy wiring and app-targeting addons.
  const syntheticConfig: ProjectConfig = {
    projectName: existingConfig.projectName,
    projectDir,
    relativePath: ".",
    addonOptions: undefined,
    dbSetupOptions: existingConfig.dbSetupOptions,
    database: existingConfig.database,
    orm: existingConfig.orm,
    backend: existingConfig.backend,
    runtime: existingConfig.runtime,
    frontend: [frontend],
    addons: projectAddons.filter((addon) =>
      (TASK_RUNNER_ADDONS as readonly string[]).includes(addon),
    ),
    examples: keptExamples,
    auth: existingConfig.auth,
    payments: existingConfig.payments,
    git: false,
    packageManager,
    install: false,
    dbSetup: existingConfig.dbSetup,
    api: existingConfig.api,
    webDeploy: "none",
    serverDeploy: "none",
  };

  if (!isSilent()) {
    log.info(pc.dim(`Preparing ${appDir} (${frontend}, port ${port})…`));
  }

  const generateResult = await generate({
    config: syntheticConfig,
    templates: EMBEDDED_TEMPLATES,
  });
  if (generateResult.isErr()) {
    return Result.err(
      new CLIError({
        message: `Failed to generate app files: ${generateResult.error.message}`,
        cause: generateResult.error,
      }),
    );
  }

  const scratchFiles = collectTreeFiles(generateResult.value.root);
  const scratchCatalog = readScratchCatalog(scratchFiles, packageManager);

  const vfs = new VirtualFileSystem();
  const projectName = existingConfig.projectName;

  // Relocate apps/web/** -> apps/<name>/**
  const scratchWebPrefix = "apps/web/";
  for (const [filePath, file] of scratchFiles) {
    if (!filePath.startsWith(scratchWebPrefix)) continue;
    const destPath = `${appDir}/${filePath.slice(scratchWebPrefix.length)}`;
    let content = file.content;
    if (content !== BINARY_MARKER) {
      content = content.replaceAll(`@${projectName}/env/web`, `@${projectName}/env/${appName}`);
    }
    vfs.writeFile(destPath, content, file.sourcePath);
  }

  if (vfs.getFileCount() === 0) {
    return Result.err(
      new CLIError({ message: `No app files were generated for frontend '${frontend}'.` }),
    );
  }

  // Per-app env module
  const scratchEnvWeb = scratchFiles.get("packages/env/src/web.ts");
  const envModuleWritten = scratchEnvWeb !== undefined;
  if (scratchEnvWeb) {
    vfs.writeFile(`packages/env/src/${appName}.ts`, scratchEnvWeb.content);
  }

  // packages/ui for a react app added to a non-react project
  const isReactFamily = REACT_FAMILY_FRONTENDS.includes(frontend);
  const uiExistsOnDisk = await fs.pathExists(path.join(projectDir, "packages/ui/package.json"));
  if (isReactFamily && !uiExistsOnDisk) {
    for (const [filePath, file] of scratchFiles) {
      if (filePath.startsWith("packages/ui/")) {
        vfs.writeFile(filePath, file.content, file.sourcePath);
      }
    }
  }

  // App identity: package name, catalog resolution, dev port
  patchAppPackageJson(vfs, appDir, appName, frontend, port, scratchCatalog);
  pinDevPortInConfigFiles(vfs, appDir, frontend, port);
  resolveCatalogVersions(vfs, `packages/ui/package.json`, scratchCatalog);

  if (frontend === "tanstack-router" || frontend === "tanstack-start") {
    appendAppGitignore(vfs, appDir, "src/routeTree.gen.ts");
  }

  // Patch root package.json (dev:<name> script, npm allowScripts/overrides, workspaces)
  const rootPatchResult = await patchRootPackageJson(
    vfs,
    projectDir,
    scratchFiles,
    appName,
    packageManager,
    projectAddons,
  );
  if (rootPatchResult.isErr()) return Result.err(rootPatchResult.error);

  // Patch packages/env/package.json exports — only when the per-app env module
  // was actually written, so the exports map never points at a missing file.
  if (envModuleWritten) {
    const envPatchResult = await patchEnvPackageJson(
      vfs,
      projectDir,
      scratchFiles,
      appName,
      scratchCatalog,
    );
    if (envPatchResult.isErr()) return Result.err(envPatchResult.error);
  }

  // pnpm: union framework-conditional allowBuilds / minimumReleaseAgeExclude entries
  if (packageManager === "pnpm") {
    await mergePnpmWorkspaceEntries(vfs, projectDir, scratchFiles);
  }

  await formatVfsFiles(vfs);

  const tree = {
    root: vfs.toTree(""),
    fileCount: vfs.getFileCount(),
    directoryCount: vfs.getDirectoryCount(),
    config: syntheticConfig,
  };

  if (input.dryRun) {
    if (!isSilent()) {
      log.info(
        `Dry run passed · ${pc.bold(String(tree.fileCount))} file(s) would be written for ${appDir}`,
      );
      outro(pc.green("Dry run complete. No files were written."));
    }
    return Result.ok({
      success: true,
      appName,
      frontend,
      port,
      projectDir,
      dryRun: true,
      plannedFileCount: tree.fileCount,
    });
  }

  const writeResult = await writeTree(tree, projectDir);
  if (writeResult.isErr()) {
    return Result.err(
      new CLIError({
        message: `Failed to write app files: ${writeResult.error.message}`,
        cause: writeResult.error,
      }),
    );
  }

  const warnings: string[] = [];

  const configUpdated = await updateBtsConfig(projectDir, {
    apps: [...existingApps, { name: appName, frontend, port }],
  });
  if (!configUpdated) {
    warnings.push(
      `Could not update bts.jsonc. Add { "name": "${appName}", "frontend": "${frontend}", "port": ${port} } to its 'apps' array manually so future commands see it.`,
    );
  }

  if (input.install) {
    const installResult = await installDependencies({ projectDir, packageManager });
    if (installResult.isErr()) {
      warnings.push(
        `App files were written, but dependency installation failed: ${installResult.error.message}`,
      );
    }
  }

  if (!isSilent()) {
    for (const warning of warnings) {
      log.warn(pc.yellow(warning));
    }
  }

  if (!isSilent()) {
    log.success(pc.green(`Added ${appDir} (${frontend}, port ${port})`));
    log.message(
      buildAddAppNextSteps({
        appName,
        port,
        packageManager,
        install: input.install ?? false,
        existingConfig,
      }),
    );
    outro(pc.green("App added successfully!"));
  }

  return Result.ok({
    success: true,
    appName,
    frontend,
    port,
    projectDir,
    plannedFileCount: tree.fileCount,
    warning: warnings.length > 0 ? warnings.join(" ") : undefined,
  });
}

/**
 * Reads the dependency catalog the scratch generation produced (bun root
 * package.json or pnpm-workspace.yaml), used to resolve "catalog:" versions.
 */
function readScratchCatalog(
  scratchFiles: Map<string, VirtualFile>,
  packageManager: ProjectConfig["packageManager"],
): Map<string, string> {
  const catalog = new Map<string, string>();

  if (packageManager === "bun") {
    const rootPkg = scratchFiles.get("package.json");
    if (!rootPkg) return catalog;
    const parsed = Result.try({
      try: () => JSON.parse(rootPkg.content) as RootPackageJson,
      catch: () => null,
    });
    if (parsed.isErr() || !parsed.value) return catalog;
    const workspaces = parsed.value.workspaces;
    if (workspaces && !Array.isArray(workspaces)) {
      for (const [dep, version] of Object.entries(workspaces.catalog ?? {})) {
        catalog.set(dep, version);
      }
    }
    return catalog;
  }

  if (packageManager === "pnpm") {
    const workspaceYaml = scratchFiles.get("pnpm-workspace.yaml");
    if (!workspaceYaml) return catalog;
    const parsed = Result.try({
      try: () => YAML.parse(workspaceYaml.content) as PnpmWorkspaceConfig,
      catch: () => null,
    });
    if (parsed.isErr() || !parsed.value) return catalog;
    for (const [dep, version] of Object.entries(parsed.value.catalog ?? {})) {
      catalog.set(dep, version);
    }
  }

  return catalog;
}

/**
 * Rewrites "catalog:" dependency versions back to concrete versions — the
 * project's real catalog does not know the new app's dependencies.
 */
function resolveCatalogVersions(
  vfs: VirtualFileSystem,
  packageJsonPath: string,
  catalog: Map<string, string>,
): void {
  const pkgJson = vfs.readJson<AppPackageJson>(packageJsonPath);
  if (!pkgJson) return;

  for (const section of [pkgJson.dependencies, pkgJson.devDependencies]) {
    if (!section) continue;
    for (const [dep, version] of Object.entries(section)) {
      const resolved = catalog.get(dep);
      if (version === "catalog:" && resolved) {
        section[dep] = resolved;
      }
    }
  }

  vfs.writeJson(packageJsonPath, pkgJson);
}

/**
 * Sets the app's package name, pins its dev port in the dev script, and
 * resolves catalog versions in its package.json.
 */
function patchAppPackageJson(
  vfs: VirtualFileSystem,
  appDir: string,
  appName: string,
  frontend: AddedApp["frontend"],
  port: number,
  catalog: Map<string, string>,
): void {
  const pkgPath = `${appDir}/package.json`;
  const pkgJson = vfs.readJson<AppPackageJson>(pkgPath);
  if (!pkgJson) return;

  pkgJson.name = appName;

  if (pkgJson.scripts?.dev) {
    if (frontend === "next") {
      // Replace the template's port when present; append otherwise so the
      // pin never silently no-ops if the template's dev script changes.
      pkgJson.scripts.dev = /--port \d+/.test(pkgJson.scripts.dev)
        ? pkgJson.scripts.dev.replace(/--port \d+/, `--port ${port}`)
        : `${pkgJson.scripts.dev} --port ${port}`;
    } else if (frontend === "react-router" || frontend === "svelte" || frontend === "astro") {
      // These frameworks rely on default ports (5173/4321); pin explicitly so the
      // new app never collides with the primary web app.
      pkgJson.scripts.dev = `${pkgJson.scripts.dev} --port ${port}`;
    }
  }

  vfs.writeJson(pkgPath, pkgJson);
  resolveCatalogVersions(vfs, pkgPath, catalog);
}

/** Config file that carries the dev port for frameworks that pin it there. */
function getPortConfigPath(appDir: string, frontend: AddedApp["frontend"]): string | undefined {
  switch (frontend) {
    case "tanstack-router":
    case "tanstack-start":
    case "solid":
      return `${appDir}/vite.config.ts`;
    case "nuxt":
      return `${appDir}/nuxt.config.ts`;
    default:
      return undefined;
  }
}

/** Pins the allocated dev port in the app's vite/nuxt config, warning on a no-op. */
function pinDevPortInConfigFiles(
  vfs: VirtualFileSystem,
  appDir: string,
  frontend: AddedApp["frontend"],
  port: number,
): void {
  const configPath = getPortConfigPath(appDir, frontend);
  if (!configPath) return;

  const content = vfs.readFile(configPath);
  if (!content) return;

  const updated = content.replaceAll("port: 3001", `port: ${port}`);
  if (updated === content) {
    // The template no longer matches the expected literal — don't record a
    // port that was never applied without telling the user.
    if (!isSilent()) {
      log.warn(
        pc.yellow(`Could not pin the dev port in ${configPath}. Set port ${port} manually.`),
      );
    }
    return;
  }

  vfs.writeFile(configPath, updated);
}

/** Appends a generated-file entry to the app's .gitignore, creating it if needed. */
function appendAppGitignore(vfs: VirtualFileSystem, appDir: string, entry: string): void {
  const gitignorePath = `${appDir}/.gitignore`;
  const existing = vfs.readFile(gitignorePath);
  if (existing) {
    if (!existing.split("\n").includes(entry)) {
      vfs.writeFile(gitignorePath, `${existing.trimEnd()}\n${entry}\n`);
    }
  } else {
    vfs.writeFile(gitignorePath, `${entry}\n`);
  }
}

/**
 * Adds the root dev:<name> script (task-runner aware), ensures the apps/*
 * workspace glob, and on npm unions framework-conditional allowScripts/overrides.
 */
async function patchRootPackageJson(
  vfs: VirtualFileSystem,
  projectDir: string,
  scratchFiles: Map<string, VirtualFile>,
  appName: string,
  packageManager: ProjectConfig["packageManager"],
  projectAddons: Addons[],
): Promise<Result<void, CLIError>> {
  const rootPkgDiskPath = path.join(projectDir, "package.json");

  return Result.tryPromise({
    try: async () => {
      const content = await fs.readFile(rootPkgDiskPath, "utf-8");
      const pkgJson = JSON.parse(content) as RootPackageJson;

      pkgJson.scripts = pkgJson.scripts ?? {};
      pkgJson.scripts[`dev:${appName}`] = getWorkspaceScriptCommand(
        packageManager,
        projectAddons,
        appName,
        "dev",
      );

      // Make sure the new app is covered by the workspace globs.
      if (Array.isArray(pkgJson.workspaces)) {
        if (!pkgJson.workspaces.includes("apps/*")) pkgJson.workspaces.push("apps/*");
      } else if (pkgJson.workspaces?.packages) {
        if (!pkgJson.workspaces.packages.includes("apps/*")) {
          pkgJson.workspaces.packages.push("apps/*");
        }
      }

      // npm: framework-conditional install-script allowances and overrides.
      if (packageManager === "npm") {
        const scratchRootPkg = scratchFiles.get("package.json");
        if (scratchRootPkg) {
          const scratchJson = JSON.parse(scratchRootPkg.content) as RootPackageJson;
          if (scratchJson.allowScripts) {
            pkgJson.allowScripts = { ...scratchJson.allowScripts, ...pkgJson.allowScripts };
          }
          if (scratchJson.overrides) {
            pkgJson.overrides = { ...scratchJson.overrides, ...pkgJson.overrides };
          }
        }
      }

      vfs.writeJson("package.json", pkgJson);
    },
    catch: (e) =>
      new CLIError({
        message: `Failed to update root package.json: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });
}

/**
 * Registers the per-app env module in packages/env exports and adds any
 * framework-specific env dependencies the project does not have yet.
 */
async function patchEnvPackageJson(
  vfs: VirtualFileSystem,
  projectDir: string,
  scratchFiles: Map<string, VirtualFile>,
  appName: string,
  scratchCatalog: Map<string, string>,
): Promise<Result<void, CLIError>> {
  const envPkgRelPath = "packages/env/package.json";
  const envPkgDiskPath = path.join(projectDir, envPkgRelPath);

  return Result.tryPromise({
    try: async () => {
      let pkgJson: EnvPackageJson;

      if (await fs.pathExists(envPkgDiskPath)) {
        pkgJson = JSON.parse(await fs.readFile(envPkgDiskPath, "utf-8")) as EnvPackageJson;

        // A different-framework app may need env deps the project doesn't have
        // yet (e.g. @t3-oss/env-nextjs); add missing ones from the scratch run.
        const scratchEnvPkg = scratchFiles.get(envPkgRelPath);
        if (scratchEnvPkg) {
          const scratchJson = JSON.parse(scratchEnvPkg.content) as EnvPackageJson;
          for (const [dep, version] of Object.entries(scratchJson.dependencies ?? {})) {
            const resolved = version === "catalog:" ? scratchCatalog.get(dep) : version;
            if (!resolved) continue;
            pkgJson.dependencies = pkgJson.dependencies ?? {};
            if (!pkgJson.dependencies[dep]) {
              pkgJson.dependencies[dep] = resolved;
            }
          }
        }
      } else {
        // Project without an env package (e.g. created without a web frontend):
        // bring in the scratch-generated one, exposing only the new app's module.
        const scratchEnvPkg = scratchFiles.get(envPkgRelPath);
        if (!scratchEnvPkg) return;
        pkgJson = JSON.parse(scratchEnvPkg.content) as EnvPackageJson;
        pkgJson.exports = {};
      }

      const exports = { ...pkgJson.exports };
      exports[`./${appName}`] = `./src/${appName}.ts`;
      pkgJson.exports = exports;

      vfs.writeJson(envPkgRelPath, pkgJson);
    },
    catch: (e) =>
      new CLIError({
        message: `Failed to update packages/env/package.json: ${e instanceof Error ? e.message : String(e)}. Add "./${appName}": "./src/${appName}.ts" to its exports manually.`,
        cause: e,
      }),
  });
}

/**
 * Unions framework-conditional pnpm-workspace.yaml entries (allowBuilds map,
 * minimumReleaseAgeExclude list) from the scratch run into the real file.
 */
async function mergePnpmWorkspaceEntries(
  vfs: VirtualFileSystem,
  projectDir: string,
  scratchFiles: Map<string, VirtualFile>,
): Promise<void> {
  const workspaceRelPath = "pnpm-workspace.yaml";
  const workspaceDiskPath = path.join(projectDir, workspaceRelPath);
  const scratchWorkspace = scratchFiles.get(workspaceRelPath);
  if (!scratchWorkspace) return;
  if (!(await fs.pathExists(workspaceDiskPath))) return;

  const merged = Result.try({
    try: () => {
      const scratchParsed = YAML.parse(scratchWorkspace.content) as PnpmWorkspaceConfig;
      const realContent = fs.readFileSync(workspaceDiskPath, "utf-8");
      const doc = YAML.parseDocument(realContent);

      let changed = false;

      // allowBuilds is a map of "package: true" entries; setIn creates the
      // map when the key is absent.
      for (const [pkg, allowed] of Object.entries(scratchParsed.allowBuilds ?? {})) {
        if (doc.getIn(["allowBuilds", pkg]) === undefined) {
          doc.setIn(["allowBuilds", pkg], allowed);
          changed = true;
        }
      }

      // minimumReleaseAgeExclude is a sequence of strings. Rebuild it as a
      // proper node — doc.set with a plain array does not create a sequence
      // node, so appending entry-by-entry would silently no-op.
      const scratchExcludes = scratchParsed.minimumReleaseAgeExclude;
      if (Array.isArray(scratchExcludes) && scratchExcludes.length > 0) {
        const realList = doc.get("minimumReleaseAgeExclude");
        const existing = YAML.isSeq(realList) ? realList.items.map((item) => String(item)) : [];
        const additions = scratchExcludes.filter((entry) => !existing.includes(String(entry)));
        if (additions.length > 0) {
          doc.set("minimumReleaseAgeExclude", doc.createNode([...existing, ...additions]));
          changed = true;
        }
      }

      return changed ? doc.toString() : null;
    },
    catch: () => null,
  });

  if (merged.isOk() && merged.value) {
    vfs.writeFile(workspaceRelPath, merged.value);
  }
}

/** Formats every text file in the VFS with oxfmt before it is written to disk. */
async function formatVfsFiles(vfs: VirtualFileSystem): Promise<void> {
  for (const filePath of vfs.getAllFiles()) {
    const content = vfs.readFile(filePath);
    if (!content || content === BINARY_MARKER) continue;
    const formatted = await formatCode(filePath, content);
    if (formatted && formatted !== content) {
      vfs.writeFile(filePath, formatted);
    }
  }
}

/**
 * Condensed summary + manual wiring steps for extra apps scaffolded during
 * `create --apps`. Single-app interactive runs use buildAddAppNextSteps.
 */
export function buildExtraAppsWiringNote(options: {
  apps: AddedApp[];
  backend: ProjectConfig["backend"];
  auth: ProjectConfig["auth"];
  webDeploy: ProjectConfig["webDeploy"];
  serverDeploy: ProjectConfig["serverDeploy"];
  packageManager: ProjectConfig["packageManager"];
}): string {
  const { apps, backend, auth, webDeploy, serverDeploy, packageManager } = options;
  const lines: string[] = [];

  lines.push(pc.bold("Extra apps:"));
  for (const app of apps) {
    lines.push(
      `  apps/${app.name} — ${app.frontend}, port ${app.port} (${packageManager} run dev:${app.name})`,
    );
  }

  const origins = apps.map((app) => `http://localhost:${app.port}`).join(",");
  const isConvex = backend === "convex";
  const hasServer = backend !== "none" && !isConvex;
  const manualSteps: string[] = [];

  if (hasServer) {
    manualSteps.push(
      `Allow the new origin${apps.length > 1 ? "s" : ""} in CORS: append ${origins} to CORS_ORIGIN in apps/server/.env, and split it in apps/server/src/index.ts (e.g. origin: env.CORS_ORIGIN.split(",")).`,
    );
  }
  if (auth === "better-auth" && !isConvex) {
    manualSteps.push(
      `Add the new origin${apps.length > 1 ? "s" : ""} to the trustedOrigins array in packages/auth/src/index.ts.`,
    );
  }
  if (auth === "clerk") {
    manualSteps.push("Add the new origins to the allowed origins in your Clerk dashboard.");
  }
  if (isConvex) {
    manualSteps.push(
      `Copy the *_CONVEX_URL value from apps/web/.env into each new app's .env file.`,
    );
  }

  if (manualSteps.length > 0) {
    lines.push("");
    lines.push(pc.bold("Manual wiring (your server code is never edited):"));
    for (const [index, step] of manualSteps.entries()) {
      lines.push(`  ${index + 1}. ${step}`);
    }
  }

  if (webDeploy !== "none" || serverDeploy !== "none") {
    lines.push("");
    lines.push(
      `  Note: extra apps are scaffolded without deploy wiring; deploying them is manual for now.`,
    );
  }

  return lines.join("\n");
}

/** Next steps + manual CORS/auth wiring instructions for a single added app. */
function buildAddAppNextSteps(options: {
  appName: string;
  port: number;
  packageManager: ProjectConfig["packageManager"];
  install: boolean;
  existingConfig: ExistingProjectConfig;
}): string {
  const { appName, port, packageManager, install, existingConfig } = options;
  const origin = `http://localhost:${port}`;
  const lines: string[] = [];

  lines.push(pc.bold("Next steps:"));
  if (!install) {
    lines.push(`  ${packageManager} install`);
  }
  lines.push(`  ${packageManager} run dev:${appName}`);

  const manualSteps: string[] = [];
  const isConvex = existingConfig.backend === "convex";
  const hasServer = existingConfig.backend !== "none" && !isConvex;

  if (hasServer) {
    manualSteps.push(
      `Allow the new origin in CORS: append ${origin} to CORS_ORIGIN in apps/server/.env, and split it in apps/server/src/index.ts (e.g. origin: env.CORS_ORIGIN.split(",")).`,
    );
  }
  if (existingConfig.auth === "better-auth" && !isConvex) {
    manualSteps.push(`Add "${origin}" to the trustedOrigins array in packages/auth/src/index.ts.`);
  }
  if (existingConfig.auth === "clerk") {
    manualSteps.push(`Add ${origin} to the allowed origins in your Clerk dashboard.`);
  }
  if (isConvex) {
    manualSteps.push(`Copy the *_CONVEX_URL value from apps/web/.env into apps/${appName}/.env.`);
  }

  if (manualSteps.length > 0) {
    lines.push("");
    lines.push(pc.bold("Manual wiring (your server code is never edited):"));
    for (const [index, step] of manualSteps.entries()) {
      lines.push(`  ${index + 1}. ${step}`);
    }
  }

  const notes: string[] = [];
  if (existingConfig.webDeploy !== "none" || existingConfig.serverDeploy !== "none") {
    notes.push(
      `apps/${appName} was scaffolded without deploy wiring; deploying extra apps is manual for now.`,
    );
  }
  if (existingConfig.addons?.some((addon) => addon === "vite-plus" || addon === "nx")) {
    notes.push(
      `Add apps/${appName} build-output globs to your root vite.config ignorePatterns / nx namedInputs if you want them excluded from lint and cache inputs.`,
    );
  }
  notes.push("The project README was not updated.");

  if (notes.length > 0) {
    lines.push("");
    lines.push(pc.bold("Notes:"));
    for (const note of notes) {
      lines.push(`  - ${note}`);
    }
  }

  return lines.join("\n");
}
