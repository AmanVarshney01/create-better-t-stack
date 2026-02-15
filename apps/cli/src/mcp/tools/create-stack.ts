import { generateReproducibleCommand } from "@better-t-stack/template-generator";
import { Result } from "better-result";
import fs from "fs-extra";
import path from "node:path";

import type { AddonOptionsInput, ExternalAddonStepReport } from "../../helpers/addons/types";
import type { DirectoryConflict } from "../../types";
import type { ResolveScaffoldPlanInput } from "../planning";

import { createProject } from "../../helpers/core/create-project";
import { runWithContextAsync } from "../../utils/context";
import { CLIError, DirectoryConflictError } from "../../utils/errors";
import { setupProjectDirectory } from "../../utils/project-directory";
import { computeExternalStatusFromReports, resolveScaffoldPlan } from "../planning";

export type CreateStackInput = ResolveScaffoldPlanInput & {
  directoryConflict?: DirectoryConflict;
};

export type CreateStackResult = {
  status: "success" | "partial_success" | "failed";
  projectDirectory?: string;
  relativePath?: string;
  reproducibleCommand?: string;
  externalStepReports: ExternalAddonStepReport[];
  warnings: string[];
  errors: string[];
};

type DirectoryConflictResolution = {
  finalPathInput: string;
  shouldClearDirectory: boolean;
};

function collectReportWarnings(reports: ExternalAddonStepReport[]): string[] {
  return reports.flatMap((report) => {
    if (report.warning) return [report.warning];
    if (report.error) return [report.error];
    return [];
  });
}

async function resolveDirectoryConflict(
  currentPathInput: string,
  strategy: DirectoryConflict,
): Promise<Result<DirectoryConflictResolution, CLIError | DirectoryConflictError>> {
  const currentPath = path.resolve(process.cwd(), currentPathInput);
  const exists = await fs.pathExists(currentPath);
  if (!exists) {
    return Result.ok({ finalPathInput: currentPathInput, shouldClearDirectory: false });
  }

  const dirContents = await fs.readdir(currentPath);
  const isNotEmpty = dirContents.length > 0;
  if (!isNotEmpty) {
    return Result.ok({ finalPathInput: currentPathInput, shouldClearDirectory: false });
  }

  switch (strategy) {
    case "overwrite":
      return Result.ok({ finalPathInput: currentPathInput, shouldClearDirectory: true });
    case "merge":
      return Result.ok({ finalPathInput: currentPathInput, shouldClearDirectory: false });
    case "increment": {
      let counter = 1;
      const baseName = currentPathInput;
      let finalPathInput = `${baseName}-${counter}`;
      while (
        (await fs.pathExists(path.resolve(process.cwd(), finalPathInput))) &&
        (await fs.readdir(path.resolve(process.cwd(), finalPathInput))).length > 0
      ) {
        counter += 1;
        finalPathInput = `${baseName}-${counter}`;
      }
      return Result.ok({ finalPathInput, shouldClearDirectory: false });
    }
    case "error":
      return Result.err(new DirectoryConflictError({ directory: currentPathInput }));
    default:
      return Result.err(
        new CLIError({ message: `Unknown directory conflict strategy: ${strategy}` }),
      );
  }
}

export async function createStack(input: CreateStackInput): Promise<CreateStackResult> {
  const planResult = resolveScaffoldPlan(input);
  if (planResult.isErr()) {
    return {
      status: "failed",
      externalStepReports: [],
      warnings: [],
      errors: [planResult.error.message],
    };
  }

  const strategy = input.directoryConflict ?? "error";
  const planned = planResult.value;
  const conflictResult = await resolveDirectoryConflict(planned.config.relativePath, strategy);
  if (conflictResult.isErr()) {
    return {
      status: "failed",
      externalStepReports: [],
      warnings: planned.warnings,
      errors: [conflictResult.error.message],
    };
  }

  const dirSetupResult = await Result.tryPromise({
    try: async () =>
      setupProjectDirectory(
        conflictResult.value.finalPathInput,
        conflictResult.value.shouldClearDirectory,
      ),
    catch: (e) =>
      new CLIError({
        message: e instanceof Error ? e.message : String(e),
        cause: e,
      }),
  });

  if (dirSetupResult.isErr()) {
    return {
      status: "failed",
      externalStepReports: [],
      warnings: planned.warnings,
      errors: [dirSetupResult.error.message],
    };
  }

  const { finalBaseName, finalResolvedPath } = dirSetupResult.value;
  const finalConfig = {
    ...planned.config,
    projectName: finalBaseName,
    projectDir: finalResolvedPath,
    relativePath: conflictResult.value.finalPathInput,
  };

  const reports: ExternalAddonStepReport[] = [];
  const addonOptions: AddonOptionsInput | undefined = input.addonOptions;
  const projectResult = await runWithContextAsync({ silent: true }, () =>
    createProject(finalConfig, {
      manualDb: input.config?.manualDb ?? false,
      addonSetupContext: {
        interactive: false,
        addonOptions,
      },
      onExternalAddonReports: (newReports) => reports.push(...newReports),
    }),
  );

  if (projectResult.isErr()) {
    return {
      status: "failed",
      externalStepReports: reports,
      warnings: [...planned.warnings, ...collectReportWarnings(reports)],
      errors: [projectResult.error.message],
    };
  }

  const reproducibleCommand = generateReproducibleCommand(finalConfig);
  const status = computeExternalStatusFromReports(reports);
  const warnings = [...planned.warnings, ...collectReportWarnings(reports)];

  return {
    status,
    projectDirectory: finalConfig.projectDir,
    relativePath: finalConfig.relativePath,
    reproducibleCommand,
    externalStepReports: reports,
    warnings,
    errors: [],
  };
}
