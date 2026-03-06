import { normalizeOptionId, type OptionCategory } from "@better-fullstack/types";

import type { StackState } from "@/lib/stack-defaults";

const STACK_OPTION_CATEGORY_BY_KEY: Partial<Record<keyof StackState, OptionCategory>> = {
  webFrontend: "webFrontend",
  nativeFrontend: "nativeFrontend",
  astroIntegration: "astroIntegration",
  runtime: "runtime",
  backend: "backend",
  database: "database",
  orm: "orm",
  dbSetup: "dbSetup",
  auth: "auth",
  payments: "payments",
  email: "email",
  fileUpload: "fileUpload",
  logging: "logging",
  observability: "observability",
  featureFlags: "featureFlags",
  analytics: "analytics",
  backendLibraries: "backendLibraries",
  stateManagement: "stateManagement",
  forms: "forms",
  validation: "validation",
  testing: "testing",
  realtime: "realtime",
  jobQueue: "jobQueue",
  caching: "caching",
  animation: "animation",
  cssFramework: "cssFramework",
  uiLibrary: "uiLibrary",
  shadcnBase: "shadcnBase",
  shadcnStyle: "shadcnStyle",
  shadcnIconLibrary: "shadcnIconLibrary",
  shadcnColorTheme: "shadcnColorTheme",
  shadcnBaseColor: "shadcnBaseColor",
  shadcnFont: "shadcnFont",
  shadcnRadius: "shadcnRadius",
  cms: "cms",
  search: "search",
  fileStorage: "fileStorage",
  codeQuality: "codeQuality",
  documentation: "documentation",
  appPlatforms: "appPlatforms",
  packageManager: "packageManager",
  examples: "examples",
  aiSdk: "ai",
  aiDocs: "aiDocs",
  git: "git",
  install: "install",
  api: "api",
  webDeploy: "webDeploy",
  serverDeploy: "serverDeploy",
  rustWebFramework: "rustWebFramework",
  rustFrontend: "rustFrontend",
  rustOrm: "rustOrm",
  rustApi: "rustApi",
  rustCli: "rustCli",
  rustLibraries: "rustLibraries",
  pythonWebFramework: "pythonWebFramework",
  pythonOrm: "pythonOrm",
  pythonValidation: "pythonValidation",
  pythonAi: "pythonAi",
  pythonTaskQueue: "pythonTaskQueue",
  pythonQuality: "pythonQuality",
  goWebFramework: "goWebFramework",
  goOrm: "goOrm",
  goApi: "goApi",
  goCli: "goCli",
  goLogging: "goLogging",
};

export function normalizeStackOptionValue<K extends keyof StackState>(
  key: K,
  value: StackState[K],
): StackState[K] {
  const category = STACK_OPTION_CATEGORY_BY_KEY[key];
  if (!category) return value;

  if (Array.isArray(value)) {
    return [...new Set(value.map((entry) => normalizeOptionId(category, entry)))] as StackState[K];
  }

  if (typeof value === "string") {
    return normalizeOptionId(category, value) as StackState[K];
  }

  return value;
}

export function normalizeStackStateSelections(stack: StackState): StackState {
  const normalized: Record<string, unknown> = { ...stack };

  for (const key of Object.keys(STACK_OPTION_CATEGORY_BY_KEY) as Array<keyof StackState>) {
    normalized[key] = normalizeStackOptionValue(
      key,
      normalized[key] as string | string[] | null,
    );
  }

  return normalized as StackState;
}
