import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { processAddonsDeps } from "./addons-deps";
import { processAlchemyPlugins } from "./alchemy-plugins";
import { processApiDeps } from "./api-deps";
import { processAuthDeps } from "./auth-deps";
import { processAuthPlugins } from "./auth-plugins";
import { processBackendDeps } from "./backend-deps";
import { processDatabaseDeps } from "./db-deps";
import { processDeployDeps } from "./deploy-deps";
import { processEnvDeps } from "./env-deps";
import { processEnvVariables } from "./env-vars";
import { processExamplesDeps } from "./examples-deps";
import { processInfraDeps } from "./infra-deps";
import { processPaymentsDeps } from "./payments-deps";
import { processPwaPlugins } from "./pwa-plugins";
import { processReadme } from "./readme-generator";
import { processRuntimeDeps } from "./runtime-deps";
import { processWorkspaceDeps } from "./workspace-deps";

export function processDependencies(vfs: VirtualFileSystem, config: ProjectConfig): void {
  processWorkspaceDeps(vfs, config);
  processEnvDeps(vfs, config);
  processInfraDeps(vfs, config);
  processDatabaseDeps(vfs, config);
  processBackendDeps(vfs, config);
  processRuntimeDeps(vfs, config);
  processApiDeps(vfs, config);
  processAuthDeps(vfs, config);
  processPaymentsDeps(vfs, config);
  processDeployDeps(vfs, config);
  processAddonsDeps(vfs, config);
  processExamplesDeps(vfs, config);
}

export {
  processAddonsDeps,
  processApiDeps,
  processAuthDeps,
  processBackendDeps,
  processDatabaseDeps,
  processDeployDeps,
  processEnvDeps,
  processExamplesDeps,
  processInfraDeps,
  processPaymentsDeps,
  processReadme,
  processRuntimeDeps,
  processWorkspaceDeps,
  processAuthPlugins,
  processAlchemyPlugins,
  processPwaPlugins,
  processEnvVariables,
};
