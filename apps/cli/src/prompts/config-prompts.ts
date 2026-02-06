import type {
  Addons,
  API,
  Auth,
  Backend,
  Database,
  DatabaseSetup,
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

import { DEFAULT_CONFIG } from "../constants";
import { isSilent } from "../utils/context";
import { UserCancelledError } from "../utils/errors";
import { getAddonsChoice } from "./addons";
import { getApiChoice } from "./api";
import { getAuthChoice } from "./auth";
import { getBackendFrameworkChoice } from "./backend";
import { getDatabaseChoice } from "./database";
import { getDBSetupChoice } from "./database-setup";
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
  backend: Backend;
  runtime: Runtime;
  database: Database;
  orm: ORM;
  api: API;
  auth: Auth;
  payments: Payments;
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
  if (isSilent()) {
    return {
      projectName,
      projectDir,
      relativePath,
      frontend: flags.frontend ?? [...DEFAULT_CONFIG.frontend],
      backend: flags.backend ?? DEFAULT_CONFIG.backend,
      runtime: flags.runtime ?? DEFAULT_CONFIG.runtime,
      database: flags.database ?? DEFAULT_CONFIG.database,
      orm: flags.orm ?? DEFAULT_CONFIG.orm,
      auth: flags.auth ?? DEFAULT_CONFIG.auth,
      payments: flags.payments ?? DEFAULT_CONFIG.payments,
      addons: flags.addons ?? [...DEFAULT_CONFIG.addons],
      examples: flags.examples ?? [...DEFAULT_CONFIG.examples],
      git: flags.git ?? DEFAULT_CONFIG.git,
      packageManager: flags.packageManager ?? DEFAULT_CONFIG.packageManager,
      install: flags.install ?? DEFAULT_CONFIG.install,
      dbSetup: flags.dbSetup ?? DEFAULT_CONFIG.dbSetup,
      api: flags.api ?? DEFAULT_CONFIG.api,
      webDeploy: flags.webDeploy ?? DEFAULT_CONFIG.webDeploy,
      serverDeploy: flags.serverDeploy ?? DEFAULT_CONFIG.serverDeploy,
    };
  }

  const result = await navigableGroup<PromptGroupResults>(
    {
      frontend: () => getFrontendChoice(flags.frontend, flags.backend, flags.auth),
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
        getApiChoice(flags.api, results.frontend, results.backend) as Promise<API>,
      auth: ({ results }) => getAuthChoice(flags.auth, results.backend, results.frontend),
      payments: ({ results }) =>
        getPaymentsChoice(flags.payments, results.auth, results.backend, results.frontend),
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
      onCancel: () => {
        throw new UserCancelledError({ message: "Operation cancelled" });
      },
    },
  );

  return {
    projectName: projectName,
    projectDir: projectDir,
    relativePath: relativePath,
    frontend: result.frontend,
    backend: result.backend,
    runtime: result.runtime,
    database: result.database,
    orm: result.orm,
    auth: result.auth,
    payments: result.payments,
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
