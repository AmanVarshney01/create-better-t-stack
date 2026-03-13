import type { CLIInput, Ecosystem, ProjectConfig } from "@better-fullstack/types";

export type InstallMode = "install" | "no-install";

export type GeneratorArgs = {
  count: number;
  ecosystems: readonly Ecosystem[];
  installMode: InstallMode;
  rng?: () => number;
};

export const DEFAULT_ARGS: GeneratorArgs = {
  count: 10,
  ecosystems: ["typescript", "rust", "python", "go"],
  installMode: "install",
};

export const DEFAULT_ECOSYSTEM_WEIGHTS: Record<Ecosystem, number> = {
  typescript: 4,
  rust: 2,
  python: 2,
  go: 2,
};

export const TEMPLATE_FINGERPRINT_KEYS = [
  "ecosystem",
  "frontend",
  "backend",
  "runtime",
  "api",
  "database",
  "orm",
  "dbSetup",
  "auth",
  "payments",
  "email",
  "fileUpload",
  "logging",
  "observability",
  "featureFlags",
  "analytics",
  "effect",
  "stateManagement",
  "forms",
  "validation",
  "testing",
  "ai",
  "realtime",
  "jobQueue",
  "animation",
  "cssFramework",
  "uiLibrary",
  "shadcnBase",
  "shadcnStyle",
  "shadcnIconLibrary",
  "shadcnColorTheme",
  "shadcnBaseColor",
  "shadcnFont",
  "shadcnRadius",
  "cms",
  "caching",
  "search",
  "fileStorage",
  "addons",
  "examples",
  "aiDocs",
  "packageManager",
  "webDeploy",
  "serverDeploy",
  "astroIntegration",
  "rustWebFramework",
  "rustFrontend",
  "rustOrm",
  "rustApi",
  "rustCli",
  "rustLibraries",
  "pythonWebFramework",
  "pythonOrm",
  "pythonValidation",
  "pythonAi",
  "pythonTaskQueue",
  "pythonQuality",
  "goWebFramework",
  "goOrm",
  "goApi",
  "goCli",
  "goLogging",
] as const;

export type TemplateFingerprintKey = (typeof TEMPLATE_FINGERPRINT_KEYS)[number];
export type FingerprintValue = string | readonly string[];
export type TemplateFingerprint = Partial<Record<TemplateFingerprintKey, FingerprintValue>>;

export type HistoricalLedger = {
  fingerprintKeys: Set<string>;
  legacyNames: Set<string>;
  historyCount: number;
};

export type ComboCandidate = {
  ecosystem: Ecosystem;
  name: string;
  config: ProjectConfig;
  fingerprint: TemplateFingerprint;
  fingerprintKey: string;
  command: string;
};

export type LedgerRowDoc = {
  cb?: string;
  rows?: unknown[];
  schema?: {
    flagsOrder?: Record<string, string[]>;
  };
};

export type CandidateDraft = {
  ecosystem: Ecosystem;
  options: CLIInput;
};
