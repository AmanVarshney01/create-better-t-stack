import type {
  Addons,
  API,
  AstroIntegration,
  Auth,
  Backend,
  Database,
  DatabaseSetup,
  Effect,
  Examples,
  Frontend,
  ORM,
  PackageManager,
  Payments,
  ProjectConfig,
  Runtime,
  ServerDeploy,
  WebDeploy,
} from "../types";

import { exitCancelled } from "../utils/errors";
import { getAddonsChoice } from "./addons";
import { getApiChoice } from "./api";
import { getAstroIntegrationChoice } from "./astro-integration";
import { getAuthChoice } from "./auth";
import { getBackendFrameworkChoice } from "./backend";
import { getDatabaseChoice } from "./database";
import { getDBSetupChoice } from "./database-setup";
import { getEffectChoice } from "./effect";
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
import { getDeploymentChoice } from "./web-deploy";

type PromptGroupResults = {
  frontend: Frontend[];
  astroIntegration: AstroIntegration | undefined;
  backend: Backend;
  runtime: Runtime;
  database: Database;
  orm: ORM;
  api: API;
  auth: Auth;
  payments: Payments;
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
    backend: result.backend,
    runtime: result.runtime,
    database: result.database,
    orm: result.orm,
    auth: result.auth,
    payments: result.payments,
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
  };
}
