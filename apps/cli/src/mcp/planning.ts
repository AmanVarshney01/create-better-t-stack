import { generateReproducibleCommand } from "@better-t-stack/template-generator";
import { Result } from "better-result";
import path from "node:path";

import type { AddonOptionsInput, ExternalAddonStepReport } from "../helpers/addons/types";
import type { CreateInput, ProjectConfig } from "../types";

import { getDefaultConfig } from "../constants";
import { CLIError } from "../utils/errors";
import { getTemplateConfig } from "../utils/templates";
import {
  getProvidedFlags,
  processAndValidateFlags,
  validateConfigCompatibility,
} from "../validation";

const EXTERNAL_ADDON_KEYS = new Set(["fumadocs", "starlight", "wxt", "tauri", "mcp", "skills"]);

export type PlannedExternalStep = {
  addon: string;
  status: "planned";
  selectedOptions?: Record<string, unknown>;
};

export type ResolvedScaffoldPlan = {
  config: ProjectConfig;
  reproducibleCommand: string;
  plannedExternalSteps: PlannedExternalStep[];
  warnings: string[];
};

export type ResolveScaffoldPlanInput = {
  projectName?: string;
  directory?: string;
  config?: Partial<CreateInput>;
  addonOptions?: AddonOptionsInput;
};

function getPreferredTemplate(
  options: AddonOptionsInput | undefined,
  addon: string,
): string | undefined {
  if (addon === "fumadocs") return options?.fumadocs?.template;
  if (addon === "wxt") return options?.wxt?.template;
  return undefined;
}

function toResultError(message: string): CLIError {
  return new CLIError({ message });
}

function isPathWithinCwd(candidatePath: string): boolean {
  const resolvedCwd = path.resolve(process.cwd());
  const resolvedPath = path.resolve(process.cwd(), candidatePath);
  const relative = path.relative(resolvedCwd, resolvedPath);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function buildPlannedExternalSteps(
  config: ProjectConfig,
  addonOptions?: AddonOptionsInput,
): PlannedExternalStep[] {
  return config.addons
    .filter((addon) => EXTERNAL_ADDON_KEYS.has(addon))
    .map((addon) => {
      const preferredTemplate = getPreferredTemplate(addonOptions, addon);
      return {
        addon,
        status: "planned" as const,
        selectedOptions: preferredTemplate ? { template: preferredTemplate } : undefined,
      };
    });
}

export function resolveScaffoldPlan(
  input: ResolveScaffoldPlanInput,
): Result<ResolvedScaffoldPlan, CLIError> {
  return Result.gen(function* () {
    const configInput = input.config ?? {};
    const defaultConfig = getDefaultConfig();
    const requestedTarget = input.directory ?? input.projectName ?? defaultConfig.relativePath;
    if (!isPathWithinCwd(requestedTarget)) {
      yield* Result.err(toResultError("Project path must be within current directory"));
    }

    const processedInput: CreateInput = {
      ...configInput,
      projectName: requestedTarget,
      template: configInput.template,
      yes: false,
      yolo: false,
      install: configInput.install ?? defaultConfig.install,
      git: configInput.git ?? defaultConfig.git,
      packageManager: configInput.packageManager ?? defaultConfig.packageManager,
    };

    let mergedInput = processedInput;
    if (configInput.template && configInput.template !== "none") {
      const templateConfig = getTemplateConfig(configInput.template);
      if (templateConfig) {
        mergedInput = {
          ...templateConfig,
          ...processedInput,
          template: configInput.template,
        };
      }
    }

    const providedFlags = getProvidedFlags(mergedInput);
    const projectNameBase = path.basename(path.resolve(process.cwd(), requestedTarget));
    const flagConfigResult = processAndValidateFlags(
      { ...mergedInput, projectDirectory: requestedTarget },
      providedFlags,
      projectNameBase,
    );
    const flagConfig = yield* flagConfigResult.mapError((error) => toResultError(error.message));

    const resolvedProjectDir = path.resolve(process.cwd(), requestedTarget);
    const normalizedConfig: ProjectConfig = {
      ...defaultConfig,
      ...flagConfig,
      projectName: projectNameBase,
      projectDir: resolvedProjectDir,
      relativePath: requestedTarget,
    };

    const compatibilityResult = validateConfigCompatibility(
      normalizedConfig,
      providedFlags,
      mergedInput,
    );
    yield* compatibilityResult.mapError((error) => toResultError(error.message));

    const warnings: string[] = [];
    const plannedExternalSteps = buildPlannedExternalSteps(normalizedConfig, input.addonOptions);
    if (plannedExternalSteps.length > 0) {
      warnings.push(
        "This configuration includes addons that execute external generators. The project can complete with partial_success if upstream generators fail.",
      );
    }

    return Result.ok({
      config: normalizedConfig,
      reproducibleCommand: generateReproducibleCommand(normalizedConfig),
      plannedExternalSteps,
      warnings,
    });
  });
}

export function computeExternalStatusFromReports(
  reports: ExternalAddonStepReport[],
): "success" | "partial_success" {
  const hasWarnings = reports.some(
    (report) => report.status === "warning" || report.status === "failed",
  );
  return hasWarnings ? "partial_success" : "success";
}
