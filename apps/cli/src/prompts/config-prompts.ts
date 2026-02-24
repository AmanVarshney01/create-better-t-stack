import type {
  Addons,
  AI,
  AiDocs,
  Analytics,
  Animation,
  API,
  AstroIntegration,
  Auth,
  Backend,
  Caching,
  CMS,
  CSSFramework,
  Database,
  DatabaseSetup,
  Ecosystem,
  Effect,
  Email,
  Examples,
  FeatureFlags,
  FileUpload,
  Forms,
  Frontend,
  GoApi,
  GoCli,
  GoLogging,
  GoOrm,
  GoWebFramework,
  JobQueue,
  Logging,
  Observability,
  ORM,
  PackageManager,
  Payments,
  ProjectConfig,
  PythonAi,
  PythonOrm,
  PythonQuality,
  PythonTaskQueue,
  PythonValidation,
  PythonWebFramework,
  Realtime,
  RustApi,
  RustCli,
  RustFrontend,
  RustLibraries,
  RustOrm,
  RustWebFramework,
  Runtime,
  Search,
  FileStorage,
  ServerDeploy,
  StateManagement,
  Testing,
  UILibrary,
  Validation,
  WebDeploy,
} from "../types";

import { hasWebStyling, requiresChatSdkVercelAI } from "../utils/compatibility-rules";
import { exitCancelled } from "../utils/errors";
import { getAddonsChoice } from "./addons";
import { getAIChoice } from "./ai";
import { getAiDocsChoice } from "./ai-docs";
import { getAnimationChoice } from "./animation";
import { getApiChoice } from "./api";
import { getAstroIntegrationChoice } from "./astro-integration";
import { getAuthChoice } from "./auth";
import { getBackendFrameworkChoice } from "./backend";
import { getCachingChoice } from "./caching";
import { getCMSChoice } from "./cms";
import { getCSSFrameworkChoice } from "./css-framework";
import { getDatabaseChoice } from "./database";
import { getDBSetupChoice } from "./database-setup";
import { getEcosystemChoice } from "./ecosystem";
import { getEffectChoice } from "./effect";
import { getEmailChoice } from "./email";
import { getExamplesChoice } from "./examples";
import { getFileStorageChoice } from "./file-storage";
import { getFileUploadChoice } from "./file-upload";
import { getFormsChoice } from "./forms";
import { getFrontendChoice } from "./frontend";
import { getGitChoice } from "./git";
import {
  getGoApiChoice,
  getGoCliChoice,
  getGoLoggingChoice,
  getGoOrmChoice,
  getGoWebFrameworkChoice,
} from "./go-ecosystem";
import { getinstallChoice } from "./install";
import { getJobQueueChoice } from "./job-queue";
import { getLoggingChoice } from "./logging";
import { navigableGroup } from "./navigable-group";
import { getObservabilityChoice } from "./observability";
import { getORMChoice } from "./orm";
import { getPackageManagerChoice } from "./package-manager";
import { getPaymentsChoice } from "./payments";
import {
  getPythonAiChoice,
  getPythonOrmChoice,
  getPythonQualityChoice,
  getPythonTaskQueueChoice,
  getPythonValidationChoice,
  getPythonWebFrameworkChoice,
} from "./python-ecosystem";
import { getRealtimeChoice } from "./realtime";
import { getRuntimeChoice } from "./runtime";
import {
  getRustApiChoice,
  getRustCliChoice,
  getRustFrontendChoice,
  getRustLibrariesChoice,
  getRustOrmChoice,
  getRustWebFrameworkChoice,
} from "./rust-ecosystem";
import { getSearchChoice } from "./search";
import { getServerDeploymentChoice } from "./server-deploy";
import { getStateManagementChoice } from "./state-management";
import { getTestingChoice } from "./testing";
import { getUILibraryChoice } from "./ui-library";
import { getValidationChoice } from "./validation";
import { getDeploymentChoice } from "./web-deploy";

type PromptGroupResults = {
  // Ecosystem choice first
  ecosystem: Ecosystem;
  // TypeScript ecosystem
  frontend: Frontend[];
  astroIntegration: AstroIntegration | undefined;
  uiLibrary: UILibrary;
  cssFramework: CSSFramework;
  backend: Backend;
  runtime: Runtime;
  database: Database;
  orm: ORM;
  api: API;
  auth: Auth;
  payments: Payments;
  email: Email;
  effect: Effect;
  addons: Addons[];
  examples: Examples[];
  dbSetup: DatabaseSetup;
  webDeploy: WebDeploy;
  serverDeploy: ServerDeploy;
  ai: AI;
  validation: Validation;
  forms: Forms;
  stateManagement: StateManagement;
  animation: Animation;
  testing: Testing;
  realtime: Realtime;
  jobQueue: JobQueue;
  fileUpload: FileUpload;
  logging: Logging;
  observability: Observability;
  featureFlags: FeatureFlags;
  analytics: Analytics;
  cms: CMS;
  caching: Caching;
  search: Search;
  fileStorage: FileStorage;
  // Rust ecosystem
  rustWebFramework: RustWebFramework;
  rustFrontend: RustFrontend;
  rustOrm: RustOrm;
  rustApi: RustApi;
  rustCli: RustCli;
  rustLibraries: RustLibraries[];
  // Python ecosystem
  pythonWebFramework: PythonWebFramework;
  pythonOrm: PythonOrm;
  pythonValidation: PythonValidation;
  pythonAi: PythonAi[];
  pythonTaskQueue: PythonTaskQueue;
  pythonQuality: PythonQuality;
  // Go ecosystem
  goWebFramework: GoWebFramework;
  goOrm: GoOrm;
  goApi: GoApi;
  goCli: GoCli;
  goLogging: GoLogging;
  // Keep at end
  aiDocs: AiDocs[];
  git: boolean;
  packageManager: PackageManager;
  install: boolean;
};

export async function gatherConfig(
  flags: Partial<ProjectConfig>,
  projectName: string,
  projectDir: string,
  relativePath: string,
) {
  const result = await navigableGroup<PromptGroupResults>(
    {
      // Ecosystem choice first
      ecosystem: () => getEcosystemChoice(flags.ecosystem),
      // TypeScript ecosystem prompts (skip if Rust or Python)
      frontend: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve([] as Frontend[]);
        return getFrontendChoice(flags.frontend, flags.backend, flags.auth);
      },
      astroIntegration: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve(undefined);
        if (results.frontend?.includes("astro")) {
          return getAstroIntegrationChoice(flags.astroIntegration);
        }
        return Promise.resolve(undefined);
      },
      uiLibrary: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as UILibrary);
        if (hasWebStyling(results.frontend)) {
          return getUILibraryChoice(flags.uiLibrary, results.frontend, results.astroIntegration);
        }
        return Promise.resolve("none" as UILibrary);
      },
      cssFramework: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as CSSFramework);
        if (hasWebStyling(results.frontend)) {
          return getCSSFrameworkChoice(flags.cssFramework, results.uiLibrary);
        }
        return Promise.resolve("none" as CSSFramework);
      },
      backend: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as Backend);
        return getBackendFrameworkChoice(flags.backend, results.frontend);
      },
      runtime: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as Runtime);
        return getRuntimeChoice(flags.runtime, results.backend);
      },
      database: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as Database);
        return getDatabaseChoice(flags.database, results.backend, results.runtime);
      },
      orm: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as ORM);
        return getORMChoice(
          flags.orm,
          results.database !== "none",
          results.database,
          results.backend,
          results.runtime,
        );
      },
      api: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as API);
        return getApiChoice(
          flags.api,
          results.frontend,
          results.backend,
          results.astroIntegration,
        ) as Promise<API>;
      },
      auth: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as Auth);
        return getAuthChoice(flags.auth, results.backend, results.frontend);
      },
      payments: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as Payments);
        return getPaymentsChoice(flags.payments, results.auth, results.backend, results.frontend);
      },
      email: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as Email);
        return getEmailChoice(flags.email, results.backend);
      },
      effect: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as Effect);
        return getEffectChoice(flags.effect);
      },
      addons: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve([] as Addons[]);
        return getAddonsChoice(flags.addons, results.frontend, results.auth);
      },
      examples: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve([] as Examples[]);
        return getExamplesChoice(
          flags.examples,
          results.frontend,
          results.backend,
          results.runtime,
        ) as Promise<Examples[]>;
      },
      dbSetup: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as DatabaseSetup);
        return getDBSetupChoice(
          results.database ?? "none",
          flags.dbSetup,
          results.orm,
          results.backend,
          results.runtime,
        );
      },
      webDeploy: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as WebDeploy);
        return getDeploymentChoice(
          flags.webDeploy,
          results.runtime,
          results.backend,
          results.frontend,
        );
      },
      serverDeploy: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as ServerDeploy);
        return getServerDeploymentChoice(
          flags.serverDeploy,
          results.runtime,
          results.backend,
          results.webDeploy,
        );
      },
      // TypeScript-specific prompts
      ai: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as AI);
        if (
          flags.ai === undefined &&
          results.examples.includes("chat-sdk") &&
          requiresChatSdkVercelAI(results.backend, results.frontend, results.runtime)
        ) {
          return Promise.resolve("vercel-ai" as AI);
        }
        return getAIChoice(flags.ai);
      },
      validation: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as Validation);
        return getValidationChoice(flags.validation);
      },
      forms: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as Forms);
        return getFormsChoice(flags.forms, results.frontend);
      },
      stateManagement: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as StateManagement);
        return getStateManagementChoice(flags.stateManagement, results.frontend);
      },
      animation: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as Animation);
        return getAnimationChoice(flags.animation, results.frontend);
      },
      testing: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as Testing);
        return getTestingChoice(flags.testing);
      },
      realtime: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as Realtime);
        return getRealtimeChoice(flags.realtime, results.backend);
      },
      jobQueue: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as JobQueue);
        return getJobQueueChoice(flags.jobQueue, results.backend);
      },
      fileUpload: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as FileUpload);
        return getFileUploadChoice(flags.fileUpload, results.backend);
      },
      logging: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as Logging);
        return getLoggingChoice(flags.logging, results.backend);
      },
      observability: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as Observability);
        return getObservabilityChoice(flags.observability, results.backend);
      },
      featureFlags: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as FeatureFlags);
        return Promise.resolve(flags.featureFlags || "none") as Promise<FeatureFlags>;
      },
      analytics: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as Analytics);
        return Promise.resolve(flags.analytics || "none") as Promise<Analytics>;
      },
      cms: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as CMS);
        return getCMSChoice(flags.cms, results.backend);
      },
      caching: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as Caching);
        return getCachingChoice(flags.caching, results.backend);
      },
      search: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as Search);
        return getSearchChoice(flags.search, results.backend);
      },
      fileStorage: ({ results }) => {
        if (results.ecosystem !== "typescript") return Promise.resolve("none" as FileStorage);
        return getFileStorageChoice(flags.fileStorage, results.backend);
      },
      // Rust ecosystem prompts (skip if TypeScript or Python)
      rustWebFramework: ({ results }) => {
        if (results.ecosystem !== "rust") return Promise.resolve("none" as RustWebFramework);
        return getRustWebFrameworkChoice(flags.rustWebFramework);
      },
      rustFrontend: ({ results }) => {
        if (results.ecosystem !== "rust") return Promise.resolve("none" as RustFrontend);
        return getRustFrontendChoice(flags.rustFrontend);
      },
      rustOrm: ({ results }) => {
        if (results.ecosystem !== "rust") return Promise.resolve("none" as RustOrm);
        return getRustOrmChoice(flags.rustOrm);
      },
      rustApi: ({ results }) => {
        if (results.ecosystem !== "rust") return Promise.resolve("none" as RustApi);
        return getRustApiChoice(flags.rustApi);
      },
      rustCli: ({ results }) => {
        if (results.ecosystem !== "rust") return Promise.resolve("none" as RustCli);
        return getRustCliChoice(flags.rustCli);
      },
      rustLibraries: ({ results }) => {
        if (results.ecosystem !== "rust") return Promise.resolve([] as RustLibraries[]);
        return getRustLibrariesChoice(flags.rustLibraries);
      },
      // Python ecosystem prompts (skip if TypeScript or Rust)
      pythonWebFramework: ({ results }) => {
        if (results.ecosystem !== "python") return Promise.resolve("none" as PythonWebFramework);
        return getPythonWebFrameworkChoice(flags.pythonWebFramework);
      },
      pythonOrm: ({ results }) => {
        if (results.ecosystem !== "python") return Promise.resolve("none" as PythonOrm);
        return getPythonOrmChoice(flags.pythonOrm);
      },
      pythonValidation: ({ results }) => {
        if (results.ecosystem !== "python") return Promise.resolve("none" as PythonValidation);
        return getPythonValidationChoice(flags.pythonValidation);
      },
      pythonAi: ({ results }) => {
        if (results.ecosystem !== "python") return Promise.resolve([] as PythonAi[]);
        return getPythonAiChoice(flags.pythonAi);
      },
      pythonTaskQueue: ({ results }) => {
        if (results.ecosystem !== "python") return Promise.resolve("none" as PythonTaskQueue);
        return getPythonTaskQueueChoice(flags.pythonTaskQueue);
      },
      pythonQuality: ({ results }) => {
        if (results.ecosystem !== "python") return Promise.resolve("none" as PythonQuality);
        return getPythonQualityChoice(flags.pythonQuality);
      },
      // Go ecosystem prompts (skip if not Go)
      goWebFramework: ({ results }) => {
        if (results.ecosystem !== "go") return Promise.resolve("none" as GoWebFramework);
        return getGoWebFrameworkChoice(flags.goWebFramework);
      },
      goOrm: ({ results }) => {
        if (results.ecosystem !== "go") return Promise.resolve("none" as GoOrm);
        return getGoOrmChoice(flags.goOrm);
      },
      goApi: ({ results }) => {
        if (results.ecosystem !== "go") return Promise.resolve("none" as GoApi);
        return getGoApiChoice(flags.goApi);
      },
      goCli: ({ results }) => {
        if (results.ecosystem !== "go") return Promise.resolve("none" as GoCli);
        return getGoCliChoice(flags.goCli);
      },
      goLogging: ({ results }) => {
        if (results.ecosystem !== "go") return Promise.resolve("none" as GoLogging);
        return getGoLoggingChoice(flags.goLogging);
      },
      // Keep at end
      aiDocs: () => getAiDocsChoice(flags.aiDocs),
      git: () => getGitChoice(flags.git),
      packageManager: ({ results }) => {
        // Skip package manager prompt for Rust/Python/Go (they use cargo/uv/go mod, not npm/pnpm/bun)
        if (
          results.ecosystem === "rust" ||
          results.ecosystem === "python" ||
          results.ecosystem === "go"
        )
          return Promise.resolve("npm" as PackageManager);
        return getPackageManagerChoice(flags.packageManager);
      },
      install: ({ results }) => getinstallChoice(flags.install, results.ecosystem),
    },
    {
      onCancel: () => exitCancelled("Operation cancelled"),
    },
  );

  return {
    projectName: projectName,
    projectDir: projectDir,
    relativePath: relativePath,
    frontend: result.frontend,
    astroIntegration: result.astroIntegration,
    uiLibrary: result.uiLibrary,
    cssFramework: result.cssFramework,
    backend: result.backend,
    runtime: result.runtime,
    database: result.database,
    orm: result.orm,
    auth: result.auth,
    payments: result.payments,
    email: result.email,
    effect: result.effect,
    addons: result.addons,
    examples: result.examples,
    git: result.git,
    packageManager: result.packageManager,
    install: result.install,
    dbSetup: result.dbSetup,
    api: result.api,
    webDeploy: result.webDeploy,
    serverDeploy: result.serverDeploy,
    // New prompts
    ai: result.ai,
    stateManagement: result.stateManagement,
    validation: result.validation,
    forms: result.forms,
    testing: result.testing,
    realtime: result.realtime,
    jobQueue: result.jobQueue,
    animation: result.animation,
    fileUpload: result.fileUpload,
    logging: result.logging,
    observability: result.observability,
    featureFlags: result.featureFlags,
    analytics: result.analytics,
    cms: result.cms,
    caching: result.caching,
    search: result.search,
    fileStorage: result.fileStorage,
    // Ecosystem
    ecosystem: result.ecosystem,
    // Rust ecosystem options
    rustWebFramework: result.rustWebFramework,
    rustFrontend: result.rustFrontend,
    rustOrm: result.rustOrm,
    rustApi: result.rustApi,
    rustCli: result.rustCli,
    rustLibraries: result.rustLibraries,
    // Python ecosystem options
    pythonWebFramework: result.pythonWebFramework,
    pythonOrm: result.pythonOrm,
    pythonValidation: result.pythonValidation,
    pythonAi: result.pythonAi,
    pythonTaskQueue: result.pythonTaskQueue,
    pythonQuality: result.pythonQuality,
    // Go ecosystem options
    goWebFramework: result.goWebFramework,
    goOrm: result.goOrm,
    goApi: result.goApi,
    goCli: result.goCli,
    goLogging: result.goLogging,
    // AI documentation files
    aiDocs: result.aiDocs,
  };
}
