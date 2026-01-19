import type {
  Addons,
  API,
  AstroIntegration,
  Auth,
  Backend,
  CSSFramework,
  Database,
  DatabaseSetup,
  Effect,
  Email,
  Examples,
  Frontend,
  ORM,
  PackageManager,
  Payments,
  ProjectConfig,
  Runtime,
  ServerDeploy,
  UILibrary,
  WebDeploy,
} from "../types";

import { hasWebStyling } from "../utils/compatibility-rules";
import { exitCancelled } from "../utils/errors";
import { getAddonsChoice } from "./addons";
import { getApiChoice } from "./api";
import { getAstroIntegrationChoice } from "./astro-integration";
import { getAuthChoice } from "./auth";
import { getBackendFrameworkChoice } from "./backend";
import { getCSSFrameworkChoice } from "./css-framework";
import { getDatabaseChoice } from "./database";
import { getDBSetupChoice } from "./database-setup";
import { getEffectChoice } from "./effect";
import { getEmailChoice } from "./email";
import { getExamplesChoice } from "./examples";
import { getFrontendChoice } from "./frontend";
import { getGitChoice } from "./git";
import { getinstallChoice } from "./install";
import { navigableGroup } from "./navigable-group";
import { getORMChoice } from "./orm";
import { getPackageManagerChoice } from "./package-manager";
import { getPaymentsChoice } from "./payments";
import { getRuntimeChoice } from "./runtime";
import { getServerDeploymentChoice } from "./server-deploy";
import { getUILibraryChoice } from "./ui-library";
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
  git: boolean;
  packageManager: PackageManager;
  install: boolean;
  webDeploy: WebDeploy;
  serverDeploy: ServerDeploy;
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
    // These fields don't have prompts yet, use defaults
    ai: flags.ai ?? "none",
    stateManagement: flags.stateManagement ?? "none",
    validation: flags.validation ?? "zod",
    forms: flags.forms ?? "react-hook-form",
    testing: flags.testing ?? "vitest",
    realtime: flags.realtime ?? "none",
    animation: flags.animation ?? "none",
    fileUpload: flags.fileUpload ?? "none",
    logging: flags.logging ?? "none",
    observability: flags.observability ?? "none",
  };
}
