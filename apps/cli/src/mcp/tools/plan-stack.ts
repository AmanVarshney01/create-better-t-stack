import type { AddonOptionsInput } from "../../helpers/addons/types";
import type { CreateInput } from "../../types";

import { resolveScaffoldPlan } from "../planning";

export type PlanStackInput = {
  projectName?: string;
  directory?: string;
  config?: Partial<CreateInput>;
  addonOptions?: AddonOptionsInput;
};

export type PlanStackResult = {
  success: boolean;
  normalizedConfig?: Record<string, unknown>;
  reproducibleCommand?: string;
  plannedExternalSteps?: Array<{
    addon: string;
    status: "planned";
    selectedOptions?: Record<string, unknown>;
  }>;
  warnings: string[];
  errors: string[];
};

export function planStack(input: PlanStackInput): PlanStackResult {
  const result = resolveScaffoldPlan({
    projectName: input.projectName,
    directory: input.directory,
    config: input.config,
    addonOptions: input.addonOptions,
  });

  if (result.isErr()) {
    return {
      success: false,
      warnings: [],
      errors: [result.error.message],
    };
  }

  const plan = result.value;
  return {
    success: true,
    normalizedConfig: plan.config,
    reproducibleCommand: plan.reproducibleCommand,
    plannedExternalSteps: plan.plannedExternalSteps,
    warnings: plan.warnings,
    errors: [],
  };
}
