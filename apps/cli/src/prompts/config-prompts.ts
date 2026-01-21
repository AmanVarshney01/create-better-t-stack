import type {
  Addons,
  AI,
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
  Effect,
  Email,
  Examples,
  FileUpload,
  Forms,
  Frontend,
  JobQueue,
  Logging,
  Observability,
  ORM,
  PackageManager,
  Payments,
  ProjectConfig,
  Realtime,
  Runtime,
  ServerDeploy,
  StateManagement,
  Testing,
  UILibrary,
  Validation,
  WebDeploy,
} from "../types";

import { hasWebStyling } from "../utils/compatibility-rules";
import { exitCancelled } from "../utils/errors";
import { getAddonsChoice } from "./addons";
import { getAIChoice } from "./ai";
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
import { getEffectChoice } from "./effect";
import { getEmailChoice } from "./email";
import { getExamplesChoice } from "./examples";
import { getFileUploadChoice } from "./file-upload";
import { getFormsChoice } from "./forms";
import { getFrontendChoice } from "./frontend";
import { getGitChoice } from "./git";
import { getinstallChoice } from "./install";
import { getJobQueueChoice } from "./job-queue";
import { getLoggingChoice } from "./logging";
import { navigableGroup } from "./navigable-group";
import { getObservabilityChoice } from "./observability";
import { getORMChoice } from "./orm";
import { getPackageManagerChoice } from "./package-manager";
import { getPaymentsChoice } from "./payments";
import { getRealtimeChoice } from "./realtime";
import { getRuntimeChoice } from "./runtime";
import { getServerDeploymentChoice } from "./server-deploy";
import { getStateManagementChoice } from "./state-management";
import { getTestingChoice } from "./testing";
import { getUILibraryChoice } from "./ui-library";
import { getValidationChoice } from "./validation";
import { getDeploymentChoice } from "./web-deploy";

type PromptGroupResults = {
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
  // New prompts
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
  cms: CMS;
  caching: Caching;
  // Keep at end
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
      frontend: () => getFrontendChoice(flags.frontend, flags.backend, flags.auth),
      astroIntegration: ({ results }) => {
        if (results.frontend?.includes("astro")) {
          return getAstroIntegrationChoice(flags.astroIntegration);
        }
        return Promise.resolve(undefined);
      },
      uiLibrary: ({ results }) => {
        if (hasWebStyling(results.frontend)) {
          return getUILibraryChoice(flags.uiLibrary, results.frontend);
        }
        return Promise.resolve("none" as UILibrary);
      },
      cssFramework: ({ results }) => {
        if (hasWebStyling(results.frontend)) {
          return getCSSFrameworkChoice(flags.cssFramework, results.uiLibrary);
        }
        return Promise.resolve("none" as CSSFramework);
      },
      backend: ({ results }) => getBackendFrameworkChoice(flags.backend, results.frontend),
      runtime: ({ results }) => getRuntimeChoice(flags.runtime, results.backend),
      database: ({ results }) =>
        getDatabaseChoice(flags.database, results.backend, results.runtime),
      orm: ({ results }) =>
        getORMChoice(
          flags.orm,
          results.database !== "none",
          results.database,
          results.backend,
          results.runtime,
        ),
      api: ({ results }) =>
        getApiChoice(
          flags.api,
          results.frontend,
          results.backend,
          results.astroIntegration,
        ) as Promise<API>,
      auth: ({ results }) => getAuthChoice(flags.auth, results.backend, results.frontend),
      payments: ({ results }) =>
        getPaymentsChoice(flags.payments, results.auth, results.backend, results.frontend),
      email: ({ results }) => getEmailChoice(flags.email, results.backend),
      effect: () => getEffectChoice(flags.effect),
      addons: ({ results }) => getAddonsChoice(flags.addons, results.frontend, results.auth),
      examples: ({ results }) =>
        getExamplesChoice(
          flags.examples,
          results.database,
          results.frontend,
          results.backend,
          results.api,
        ) as Promise<Examples[]>,
      dbSetup: ({ results }) =>
        getDBSetupChoice(
          results.database ?? "none",
          flags.dbSetup,
          results.orm,
          results.backend,
          results.runtime,
        ),
      webDeploy: ({ results }) =>
        getDeploymentChoice(flags.webDeploy, results.runtime, results.backend, results.frontend),
      serverDeploy: ({ results }) =>
        getServerDeploymentChoice(
          flags.serverDeploy,
          results.runtime,
          results.backend,
          results.webDeploy,
        ),
      // New prompts
      ai: () => getAIChoice(flags.ai),
      validation: () => getValidationChoice(flags.validation),
      forms: ({ results }) => getFormsChoice(flags.forms, results.frontend),
      stateManagement: ({ results }) =>
        getStateManagementChoice(flags.stateManagement, results.frontend),
      animation: ({ results }) => getAnimationChoice(flags.animation, results.frontend),
      testing: () => getTestingChoice(flags.testing),
      realtime: ({ results }) => getRealtimeChoice(flags.realtime, results.backend),
      jobQueue: ({ results }) => getJobQueueChoice(flags.jobQueue, results.backend),
      fileUpload: ({ results }) => getFileUploadChoice(flags.fileUpload, results.backend),
      logging: ({ results }) => getLoggingChoice(flags.logging, results.backend),
      observability: ({ results }) => getObservabilityChoice(flags.observability, results.backend),
      cms: ({ results }) => getCMSChoice(flags.cms, results.backend),
      caching: ({ results }) => getCachingChoice(flags.caching, results.backend),
      // Keep at end
      git: () => getGitChoice(flags.git),
      packageManager: () => getPackageManagerChoice(flags.packageManager),
      install: () => getinstallChoice(flags.install),
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
    cms: result.cms,
    caching: result.caching,
    // Ecosystem - defaults to TypeScript for the CLI prompts flow
    ecosystem: flags.ecosystem ?? "typescript",
    // Rust ecosystem options - use defaults (none) since prompts are for TypeScript
    rustWebFramework: flags.rustWebFramework ?? "none",
    rustFrontend: flags.rustFrontend ?? "none",
    rustOrm: flags.rustOrm ?? "none",
    rustApi: flags.rustApi ?? "none",
    rustCli: flags.rustCli ?? "none",
    rustLibraries: flags.rustLibraries ?? [],
  };
}
