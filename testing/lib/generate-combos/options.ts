import * as path from "node:path";

import { getDefaultConfig } from "@cli/constants";
import { processFlags } from "@cli/utils/config-processing";
import { runWithContext } from "@cli/utils/context";
import { validateFullConfig } from "@cli/utils/config-validation";
import {
  ADDONS_VALUES,
  AI_VALUES,
  ANALYTICS_VALUES,
  ANIMATION_VALUES,
  API_VALUES,
  ASTRO_INTEGRATION_VALUES,
  AUTH_VALUES,
  BACKEND_VALUES,
  CACHING_VALUES,
  CMS_VALUES,
  CSS_FRAMEWORK_VALUES,
  DATABASE_SETUP_VALUES,
  DATABASE_VALUES,
  EFFECT_VALUES,
  EMAIL_VALUES,
  EXAMPLES_VALUES,
  FILE_STORAGE_VALUES,
  FILE_UPLOAD_VALUES,
  FORMS_VALUES,
  GO_API_VALUES,
  GO_CLI_VALUES,
  GO_LOGGING_VALUES,
  GO_ORM_VALUES,
  GO_WEB_FRAMEWORK_VALUES,
  JOB_QUEUE_VALUES,
  LOGGING_VALUES,
  OBSERVABILITY_VALUES,
  ORM_VALUES,
  PAYMENTS_VALUES,
  PYTHON_AI_VALUES,
  PYTHON_ORM_VALUES,
  PYTHON_QUALITY_VALUES,
  PYTHON_TASK_QUEUE_VALUES,
  PYTHON_VALIDATION_VALUES,
  PYTHON_WEB_FRAMEWORK_VALUES,
  REALTIME_VALUES,
  RUNTIME_VALUES,
  RUST_API_VALUES,
  RUST_CLI_VALUES,
  RUST_FRONTEND_VALUES,
  RUST_LIBRARIES_VALUES,
  RUST_ORM_VALUES,
  RUST_WEB_FRAMEWORK_VALUES,
  SEARCH_VALUES,
  SERVER_DEPLOY_VALUES,
  SHADCN_BASE_COLOR_VALUES,
  SHADCN_BASE_VALUES,
  SHADCN_COLOR_THEME_VALUES,
  SHADCN_FONT_VALUES,
  SHADCN_ICON_LIBRARY_VALUES,
  SHADCN_RADIUS_VALUES,
  SHADCN_STYLE_VALUES,
  STATE_MANAGEMENT_VALUES,
  TESTING_VALUES,
  UI_LIBRARY_VALUES,
  VALIDATION_VALUES,
  WEB_DEPLOY_VALUES,
  getCategoryOptionIds,
  type CLIInput,
  type Ecosystem,
  type ProjectConfig,
} from "@better-fullstack/types";

import { buildHistoryFingerprint, fingerprintToKey } from "./fingerprint";
import { formatNameFromFingerprint, buildCommand } from "./render";
import type {
  CandidateDraft,
  ComboCandidate,
  GeneratorArgs,
  HistoricalLedger,
} from "./types";
import { DEFAULT_ECOSYSTEM_WEIGHTS } from "./types";

let _rng: () => number = Math.random;

const SELF_COMPATIBLE_FRONTENDS = new Set([
  "next",
  "tanstack-start",
  "astro",
  "nuxt",
  "svelte",
  "solid-start",
]);

const WEB_FRONTENDS = getCategoryOptionIds("webFrontend");
const NATIVE_FRONTENDS = getCategoryOptionIds("nativeFrontend");

function sampleOne<T>(values: readonly T[]): T {
  return values[Math.floor(_rng() * values.length)];
}

function sampleScalar<T extends string>(values: readonly T[], noneWeight: number): T {
  const unique = Array.from(new Set(values));
  const nonNone = unique.filter((value) => value !== "none");
  if (nonNone.length === 0) return "none" as T;
  if (unique.includes("none" as T) && _rng() < noneWeight) return "none" as T;
  return sampleOne(nonNone);
}

function sampleArray<T extends string>(
  values: readonly T[],
  noneWeight: number,
  maxItems = 1,
): T[] {
  const unique = Array.from(new Set(values)).filter((value) => value !== "none");
  if (unique.length === 0 || _rng() < noneWeight) {
    return ["none" as T];
  }

  const picked = new Set<T>();
  const targetCount = Math.max(1, Math.min(maxItems, unique.length));
  while (picked.size < targetCount) {
    picked.add(sampleOne(unique));
    if (_rng() < 0.6) break;
  }

  return Array.from(picked);
}

function createCommonOptions(ecosystem: Ecosystem, args: GeneratorArgs): CLIInput {
  return {
    ecosystem,
    addons: ["none"],
    examples: ["none"],
    aiDocs: ["none"],
    packageManager: "bun",
    git: false,
    install: args.installMode === "install",
  };
}

function sampleTypeScriptFrontends(): CLIInput["frontend"] {
  const picked: string[] = [];
  const web = sampleScalar(WEB_FRONTENDS, 0.2);
  if (web !== "none") {
    picked.push(web);
  }

  const native = sampleScalar(NATIVE_FRONTENDS, picked.length === 0 ? 0.85 : 0.95);
  if (native !== "none") {
    picked.push(native);
  }

  if (picked.length === 0 && _rng() > 0.25) {
    picked.push(sampleOne(WEB_FRONTENDS.filter((value) => value !== "none")));
  }

  return picked.length === 0 ? ["none"] : Array.from(new Set(picked));
}

function makeTypeScriptDraft(args: GeneratorArgs): CandidateDraft {
  const frontend = sampleTypeScriptFrontends();
  const cssFramework = sampleScalar(CSS_FRAMEWORK_VALUES, 0.2);
  const backend =
    frontend.some((value) => SELF_COMPATIBLE_FRONTENDS.has(value))
      ? sampleScalar(BACKEND_VALUES, 0.18)
      : sampleScalar(
          BACKEND_VALUES.filter((value) => value !== "self"),
          0.18,
        );

  const runtime =
    backend === "self" || backend === "none" || backend === "convex"
      ? "none"
      : backend === "nestjs" || backend === "adonisjs" || backend === "nitro"
        ? "node"
        : sampleScalar(RUNTIME_VALUES, 0.2);

  const database =
    backend === "none" || backend === "convex"
      ? "none"
      : sampleScalar(DATABASE_VALUES, 0.2);

  const orm =
    database === "none" || database === "edgedb" || database === "redis"
      ? "none"
      : database === "mongodb"
        ? sampleScalar(["mongoose", "prisma", "none"] as const, 0.1)
        : sampleScalar(
            ORM_VALUES.filter((value) => value !== "mongoose"),
            0.1,
          );

  const api =
    backend === "none" || backend === "self" || backend === "convex"
      ? "none"
      : sampleScalar(API_VALUES, 0.2);

  const auth = backend === "none" ? "none" : sampleScalar(AUTH_VALUES, 0.3);
  const uiLibrary = cssFramework !== "tailwind" ? "none" : sampleScalar(UI_LIBRARY_VALUES, 0.25);
  const usesShadcn = uiLibrary === "shadcn-ui";

  return {
    ecosystem: "typescript",
    options: {
      ...createCommonOptions("typescript", args),
      frontend,
      backend,
      runtime,
      api,
      database,
      orm,
      dbSetup: database === "none" ? "none" : sampleScalar(DATABASE_SETUP_VALUES, 0.82),
      auth,
      payments: backend === "none" ? "none" : sampleScalar(PAYMENTS_VALUES, 0.75),
      email: backend === "none" ? "none" : sampleScalar(EMAIL_VALUES, 0.75),
      fileUpload: sampleScalar(FILE_UPLOAD_VALUES, 0.82),
      logging: backend === "none" ? "none" : sampleScalar(LOGGING_VALUES, 0.65),
      observability: sampleScalar(OBSERVABILITY_VALUES, 0.85),
      featureFlags: sampleScalar(["growthbook", "posthog", "none"] as const, 0.85),
      analytics: sampleScalar(ANALYTICS_VALUES, 0.9),
      effect: sampleScalar(EFFECT_VALUES, 0.82),
      stateManagement: sampleScalar(STATE_MANAGEMENT_VALUES, 0.7),
      forms: sampleScalar(FORMS_VALUES, 0.6),
      validation: sampleScalar(VALIDATION_VALUES, 0.35),
      testing: sampleScalar(TESTING_VALUES, 0.35),
      ai: sampleScalar(AI_VALUES, 0.78),
      realtime: backend === "none" ? "none" : sampleScalar(REALTIME_VALUES, 0.84),
      jobQueue: backend === "none" ? "none" : sampleScalar(JOB_QUEUE_VALUES, 0.88),
      animation: sampleScalar(ANIMATION_VALUES, 0.74),
      cssFramework,
      uiLibrary,
      cms: sampleScalar(CMS_VALUES, 0.88),
      caching: sampleScalar(CACHING_VALUES, 0.88),
      search: sampleScalar(SEARCH_VALUES, 0.9),
      fileStorage: sampleScalar(FILE_STORAGE_VALUES, 0.84),
      webDeploy: sampleScalar(WEB_DEPLOY_VALUES, 0.92),
      serverDeploy: sampleScalar(SERVER_DEPLOY_VALUES, 0.92),
      addons: sampleArray(ADDONS_VALUES, 0.82, 2),
      examples: sampleArray(EXAMPLES_VALUES, 0.9, 1),
      astroIntegration:
        frontend.includes("astro") ? sampleScalar(ASTRO_INTEGRATION_VALUES, 0.15) : undefined,
      shadcnBase: usesShadcn ? sampleScalar(SHADCN_BASE_VALUES, 0) : undefined,
      shadcnStyle: usesShadcn ? sampleScalar(SHADCN_STYLE_VALUES, 0) : undefined,
      shadcnIconLibrary: usesShadcn ? sampleScalar(SHADCN_ICON_LIBRARY_VALUES, 0) : undefined,
      shadcnColorTheme: usesShadcn ? sampleScalar(SHADCN_COLOR_THEME_VALUES, 0) : undefined,
      shadcnBaseColor: usesShadcn ? sampleScalar(SHADCN_BASE_COLOR_VALUES, 0) : undefined,
      shadcnFont: usesShadcn ? sampleScalar(SHADCN_FONT_VALUES, 0) : undefined,
      shadcnRadius: usesShadcn ? sampleScalar(SHADCN_RADIUS_VALUES, 0) : undefined,
    },
  };
}

function makeRustDraft(args: GeneratorArgs): CandidateDraft {
  return {
    ecosystem: "rust",
    options: {
      ...createCommonOptions("rust", args),
      rustWebFramework: sampleScalar(RUST_WEB_FRAMEWORK_VALUES, 0.15),
      rustFrontend: sampleScalar(RUST_FRONTEND_VALUES, 0.2),
      rustOrm: sampleScalar(RUST_ORM_VALUES, 0.15),
      rustApi: sampleScalar(RUST_API_VALUES, 0.25),
      rustCli: sampleScalar(RUST_CLI_VALUES, 0.3),
      rustLibraries: sampleArray(RUST_LIBRARIES_VALUES, 0.35, 2),
    },
  };
}

function makePythonDraft(args: GeneratorArgs): CandidateDraft {
  return {
    ecosystem: "python",
    options: {
      ...createCommonOptions("python", args),
      pythonWebFramework: sampleScalar(PYTHON_WEB_FRAMEWORK_VALUES, 0.15),
      pythonOrm: sampleScalar(PYTHON_ORM_VALUES, 0.2),
      pythonValidation: sampleScalar(PYTHON_VALIDATION_VALUES, 0.35),
      pythonAi: sampleArray(PYTHON_AI_VALUES, 0.5, 1),
      pythonTaskQueue: sampleScalar(PYTHON_TASK_QUEUE_VALUES, 0.55),
      pythonQuality: sampleScalar(PYTHON_QUALITY_VALUES, 0.35),
    },
  };
}

function makeGoDraft(args: GeneratorArgs): CandidateDraft {
  return {
    ecosystem: "go",
    options: {
      ...createCommonOptions("go", args),
      goWebFramework: sampleScalar(GO_WEB_FRAMEWORK_VALUES, 0.18),
      goOrm: sampleScalar(GO_ORM_VALUES, 0.15),
      goApi: sampleScalar(GO_API_VALUES, 0.35),
      goCli: sampleScalar(GO_CLI_VALUES, 0.35),
      goLogging: sampleScalar(GO_LOGGING_VALUES, 0.35),
    },
  };
}

function buildProvidedFlags(options: CLIInput): Set<string> {
  const providedFlags = new Set<string>();

  for (const [key, value] of Object.entries(options)) {
    if (key === "projectDirectory" || key === "projectName") continue;
    if (value === undefined) continue;

    if (Array.isArray(value)) {
      if (value.length > 0) {
        providedFlags.add(key);
      }
      continue;
    }

    providedFlags.add(key);
  }

  return providedFlags;
}

function createValidationBase(projectName: string, draft: CandidateDraft): ProjectConfig {
  return {
    ...getDefaultConfig(),
    projectName,
    projectDir: path.resolve(process.cwd(), projectName),
    relativePath: projectName,
    ecosystem: draft.ecosystem,
    frontend: draft.ecosystem === "typescript" ? getDefaultConfig().frontend : [],
    backend: "none",
    runtime: "none",
    database: "none",
    orm: "none",
    auth: "none",
    payments: "none",
    email: "none",
    fileUpload: "none",
    effect: "none",
    stateManagement: "none",
    validation: "none",
    forms: "none",
    testing: "none",
    ai: "none",
    realtime: "none",
    jobQueue: "none",
    caching: "none",
    search: "none",
    fileStorage: "none",
    animation: "none",
    logging: "none",
    observability: "none",
    featureFlags: "none",
    analytics: "none",
    cms: "none",
    addons: [],
    examples: [],
    dbSetup: "none",
    api: "none",
    webDeploy: "none",
    serverDeploy: "none",
    cssFramework: draft.ecosystem === "typescript" ? getDefaultConfig().cssFramework : "none",
    uiLibrary: draft.ecosystem === "typescript" ? getDefaultConfig().uiLibrary : "none",
    shadcnBase: undefined,
    shadcnStyle: undefined,
    shadcnIconLibrary: undefined,
    shadcnColorTheme: undefined,
    shadcnBaseColor: undefined,
    shadcnFont: undefined,
    shadcnRadius: undefined,
    astroIntegration: undefined,
    rustWebFramework: "none",
    rustFrontend: "none",
    rustOrm: "none",
    rustApi: "none",
    rustCli: "none",
    rustLibraries: [],
    pythonWebFramework: "none",
    pythonOrm: "none",
    pythonValidation: "none",
    pythonAi: [],
    pythonTaskQueue: "none",
    pythonQuality: "none",
    goWebFramework: "none",
    goOrm: "none",
    goApi: "none",
    goCli: "none",
    goLogging: "none",
    aiDocs: [],
    packageManager: "bun",
    git: false,
    install: draft.options.install ?? true,
  };
}

function validateDraft(draft: CandidateDraft, projectName: string): ProjectConfig {
  const providedFlags = buildProvidedFlags(draft.options);
  const processed = processFlags({ ...draft.options, projectName } as CLIInput, projectName);
  const config = {
    ...createValidationBase(projectName, draft),
    ...processed,
    projectName,
    relativePath: projectName,
    projectDir: path.resolve(process.cwd(), projectName),
  } as ProjectConfig;

  runWithContext({ silent: true }, () => {
    validateFullConfig(config, providedFlags, { ...draft.options, projectName } as CLIInput);
  });

  return config;
}

function weightedDistribution(count: number, ecosystems: readonly Ecosystem[]): Ecosystem[] {
  const selected = Array.from(new Set(ecosystems));
  const totalWeight = selected.reduce(
    (sum, ecosystem) => sum + DEFAULT_ECOSYSTEM_WEIGHTS[ecosystem],
    0,
  );

  const allocations = selected.map((ecosystem) => {
    const exact = (count * DEFAULT_ECOSYSTEM_WEIGHTS[ecosystem]) / totalWeight;
    return {
      ecosystem,
      count: Math.floor(exact),
      remainder: exact - Math.floor(exact),
    };
  });

  let assigned = allocations.reduce((sum, entry) => sum + entry.count, 0);
  const sorted = [...allocations].sort((left, right) => right.remainder - left.remainder);
  let cursor = 0;

  while (assigned < count) {
    sorted[cursor % sorted.length].count += 1;
    assigned += 1;
    cursor += 1;
  }

  return allocations.flatMap((entry) =>
    Array.from({ length: entry.count }, () => entry.ecosystem),
  );
}

function createDraft(ecosystem: Ecosystem, args: GeneratorArgs): CandidateDraft {
  switch (ecosystem) {
    case "typescript":
      return makeTypeScriptDraft(args);
    case "rust":
      return makeRustDraft(args);
    case "python":
      return makePythonDraft(args);
    case "go":
      return makeGoDraft(args);
  }
}

export function generateBatch(args: GeneratorArgs, history: HistoricalLedger): ComboCandidate[] {
  _rng = args.rng ?? Math.random;
  const requestedEcosystems = weightedDistribution(args.count, args.ecosystems);
  const combos: ComboCandidate[] = [];
  const currentBatchKeys = new Set<string>();
  let attempts = 0;
  const maxAttempts = Math.max(args.count * 600, 3000);

  while (combos.length < args.count && attempts < maxAttempts) {
    const ecosystem = requestedEcosystems[combos.length] ?? sampleOne(args.ecosystems);
    attempts += 1;

    try {
      const draft = createDraft(ecosystem, args);
      const provisionalConfig = validateDraft(draft, "candidate");
      const provisionalFingerprint = buildHistoryFingerprint(provisionalConfig);
      const provisionalKey = fingerprintToKey(provisionalFingerprint);

      if (history.fingerprintKeys.has(provisionalKey) || currentBatchKeys.has(provisionalKey)) {
        continue;
      }

      const name = formatNameFromFingerprint(provisionalFingerprint);
      if (history.legacyNames.has(name) || combos.some((combo) => combo.name === name)) {
        continue;
      }

      const config = validateDraft(draft, name);
      const fingerprint = buildHistoryFingerprint(config);
      const fingerprintKey = fingerprintToKey(fingerprint);

      if (history.fingerprintKeys.has(fingerprintKey) || currentBatchKeys.has(fingerprintKey)) {
        continue;
      }

      combos.push({
        ecosystem,
        name,
        config,
        fingerprint,
        fingerprintKey,
        command: buildCommand(name, config),
      });
      currentBatchKeys.add(fingerprintKey);
    } catch {
      continue;
    }
  }

  return combos;
}
