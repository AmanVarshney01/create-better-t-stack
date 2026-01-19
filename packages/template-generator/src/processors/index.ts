import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { processAddonsDeps } from "./addons-deps";
import { processAlchemyPlugins } from "./alchemy-plugins";
import { processApiDeps } from "./api-deps";
import { processAuthDeps } from "./auth-deps";
import { processAuthPlugins } from "./auth-plugins";
import { processBackendDeps } from "./backend-deps";
import { processCSSAndUILibraryDeps } from "./css-ui-deps";
import { processDatabaseDeps } from "./db-deps";
import { processDeployDeps } from "./deploy-deps";
import { processEffectDeps } from "./effect-deps";
import { processEmailDeps } from "./email-deps";
import { processEnvDeps } from "./env-deps";
import { processEnvVariables } from "./env-vars";
import { processExamplesDeps } from "./examples-deps";
import { processFormsDeps } from "./forms-deps";
import { processInfraDeps } from "./infra-deps";
import { processPaymentsDeps } from "./payments-deps";
import { processPwaPlugins } from "./pwa-plugins";
import { processReadme } from "./readme-generator";
import { processRealtimeDeps } from "./realtime-deps";
import { processRuntimeDeps } from "./runtime-deps";
import { processStateManagementDeps } from "./state-management-deps";
import { processTurboConfig } from "./turbo-generator";
import { processValidationDeps } from "./validation-deps";
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
  processEmailDeps(vfs, config);
  processDeployDeps(vfs, config);
  processAddonsDeps(vfs, config);
  processExamplesDeps(vfs, config);
  processEffectDeps(vfs, config);
  processStateManagementDeps(vfs, config);
  processFormsDeps(vfs, config);
  processValidationDeps(vfs, config);
  processRealtimeDeps(vfs, config);
  processCSSAndUILibraryDeps(vfs, config);
  processTurboConfig(vfs, config);
}

export {
  processAddonsDeps,
  processApiDeps,
  processAuthDeps,
  processBackendDeps,
  processCSSAndUILibraryDeps,
  processDatabaseDeps,
  processDeployDeps,
  processEffectDeps,
  processEmailDeps,
  processEnvDeps,
  processExamplesDeps,
  processFormsDeps,
  processInfraDeps,
  processPaymentsDeps,
  processReadme,
  processRealtimeDeps,
  processRuntimeDeps,
  processStateManagementDeps,
  processValidationDeps,
  processTurboConfig,
  processWorkspaceDeps,
  processAuthPlugins,
  processAlchemyPlugins,
  processPwaPlugins,
  processEnvVariables,
};
