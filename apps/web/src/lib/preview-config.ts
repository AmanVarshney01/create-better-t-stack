import { type ProjectConfig, ProjectConfigSchema } from "@better-fullstack/types";

import { analyzeStackCompatibility } from "@/components/stack-builder/utils";
import { DEFAULT_STACK, type StackState } from "@/lib/constant";

const SELF_BACKENDS = new Set([
  "self-next",
  "self-tanstack-start",
  "self-astro",
  "self-nuxt",
  "self-svelte",
  "self-solid-start",
]);

function withoutNone(values: string[]): string[] {
  return values.filter((value) => value !== "none");
}

function toBoolean(value: string): boolean {
  return value === "true";
}

function normalizeInputStack(input: Partial<StackState>): StackState {
  return {
    ...DEFAULT_STACK,
    ...input,
    webFrontend: input.webFrontend ?? DEFAULT_STACK.webFrontend,
    nativeFrontend: input.nativeFrontend ?? DEFAULT_STACK.nativeFrontend,
    codeQuality: input.codeQuality ?? DEFAULT_STACK.codeQuality,
    documentation: input.documentation ?? DEFAULT_STACK.documentation,
    appPlatforms: input.appPlatforms ?? DEFAULT_STACK.appPlatforms,
    examples: input.examples ?? DEFAULT_STACK.examples,
    aiDocs: input.aiDocs ?? DEFAULT_STACK.aiDocs,
  };
}

export function stackStateToProjectConfig(input: Partial<StackState>): ProjectConfig {
  const normalized = normalizeInputStack(input);
  const compatibility = analyzeStackCompatibility(normalized);
  const stack = compatibility.adjustedStack ?? normalized;

  const frontend = [
    ...withoutNone(stack.webFrontend),
    ...withoutNone(stack.nativeFrontend),
  ] as ProjectConfig["frontend"];

  const backend = (
    SELF_BACKENDS.has(stack.backend) ? "self" : stack.backend
  ) as ProjectConfig["backend"];

  const config: ProjectConfig = {
    projectName: stack.projectName?.trim() || DEFAULT_STACK.projectName || "my-app",
    projectDir: "/virtual",
    relativePath: "./virtual",
    ecosystem: stack.ecosystem as ProjectConfig["ecosystem"],
    database: stack.database as ProjectConfig["database"],
    orm: stack.orm as ProjectConfig["orm"],
    backend,
    runtime: stack.runtime as ProjectConfig["runtime"],
    frontend: frontend.length > 0 ? frontend : ["tanstack-router"],
    addons: [
      ...withoutNone(stack.codeQuality),
      ...withoutNone(stack.documentation),
      ...withoutNone(stack.appPlatforms),
    ] as ProjectConfig["addons"],
    examples: withoutNone(stack.examples) as ProjectConfig["examples"],
    auth: stack.auth as ProjectConfig["auth"],
    payments: stack.payments as ProjectConfig["payments"],
    email: stack.email as ProjectConfig["email"],
    fileUpload: stack.fileUpload as ProjectConfig["fileUpload"],
    effect: stack.backendLibraries as ProjectConfig["effect"],
    ai: stack.aiSdk as ProjectConfig["ai"],
    stateManagement: stack.stateManagement as ProjectConfig["stateManagement"],
    forms: stack.forms as ProjectConfig["forms"],
    testing: stack.testing as ProjectConfig["testing"],
    git: toBoolean(stack.git),
    packageManager: stack.packageManager as ProjectConfig["packageManager"],
    install: false,
    dbSetup: stack.dbSetup as ProjectConfig["dbSetup"],
    api: stack.api as ProjectConfig["api"],
    webDeploy: stack.webDeploy as ProjectConfig["webDeploy"],
    serverDeploy: stack.serverDeploy as ProjectConfig["serverDeploy"],
    astroIntegration: stack.astroIntegration as ProjectConfig["astroIntegration"],
    cssFramework: stack.cssFramework as ProjectConfig["cssFramework"],
    uiLibrary: stack.uiLibrary as ProjectConfig["uiLibrary"],
    validation: stack.validation as ProjectConfig["validation"],
    realtime: stack.realtime as ProjectConfig["realtime"],
    jobQueue: stack.jobQueue as ProjectConfig["jobQueue"],
    animation: stack.animation as ProjectConfig["animation"],
    logging: stack.logging as ProjectConfig["logging"],
    observability: stack.observability as ProjectConfig["observability"],
    featureFlags: stack.featureFlags as ProjectConfig["featureFlags"],
    analytics: stack.analytics as ProjectConfig["analytics"],
    cms: stack.cms as ProjectConfig["cms"],
    caching: stack.caching as ProjectConfig["caching"],
    search: stack.search as ProjectConfig["search"],
    fileStorage: stack.fileStorage as ProjectConfig["fileStorage"],
    rustWebFramework: stack.rustWebFramework as ProjectConfig["rustWebFramework"],
    rustFrontend: stack.rustFrontend as ProjectConfig["rustFrontend"],
    rustOrm: stack.rustOrm as ProjectConfig["rustOrm"],
    rustApi: stack.rustApi as ProjectConfig["rustApi"],
    rustCli: stack.rustCli as ProjectConfig["rustCli"],
    rustLibraries:
      stack.rustLibraries === "none"
        ? []
        : ([stack.rustLibraries] as ProjectConfig["rustLibraries"]),
    pythonWebFramework: stack.pythonWebFramework as ProjectConfig["pythonWebFramework"],
    pythonOrm: stack.pythonOrm as ProjectConfig["pythonOrm"],
    pythonValidation: stack.pythonValidation as ProjectConfig["pythonValidation"],
    pythonAi: stack.pythonAi === "none" ? [] : ([stack.pythonAi] as ProjectConfig["pythonAi"]),
    pythonTaskQueue: stack.pythonTaskQueue as ProjectConfig["pythonTaskQueue"],
    pythonQuality: stack.pythonQuality as ProjectConfig["pythonQuality"],
    goWebFramework: stack.goWebFramework as ProjectConfig["goWebFramework"],
    goOrm: stack.goOrm as ProjectConfig["goOrm"],
    goApi: stack.goApi as ProjectConfig["goApi"],
    goCli: stack.goCli as ProjectConfig["goCli"],
    goLogging: stack.goLogging as ProjectConfig["goLogging"],
    aiDocs: withoutNone(stack.aiDocs) as ProjectConfig["aiDocs"],
  };

  return ProjectConfigSchema.parse(config);
}
