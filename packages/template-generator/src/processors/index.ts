import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { processAddonsDeps } from "./addons-deps";
import { processAIDeps } from "./ai-deps";
import { processAlchemyPlugins } from "./alchemy-plugins";
import { processAnimationDeps } from "./animation-deps";
import { processApiDeps } from "./api-deps";
import { processAuthDeps } from "./auth-deps";
import { processAuthPlugins } from "./auth-plugins";
import { processBackendDeps } from "./backend-deps";
import { processCachingDeps } from "./caching-deps";
import { processCMSDeps } from "./cms-deps";
import { processCSSAndUILibraryDeps } from "./css-ui-deps";
import { processDatabaseDeps } from "./db-deps";
import { processDeployDeps } from "./deploy-deps";
import { processEffectDeps } from "./effect-deps";
import { processEmailDeps } from "./email-deps";
import { processEnvDeps } from "./env-deps";
import { processEnvVariables } from "./env-vars";
import { processExamplesDeps } from "./examples-deps";
import { processFileUploadDeps } from "./file-upload-deps";
import { processFormsDeps } from "./forms-deps";
import { processInfraDeps } from "./infra-deps";
import { processJobQueueDeps } from "./job-queue-deps";
import { processLoggingDeps } from "./logging-deps";
import { processObservabilityDeps } from "./observability-deps";
import { processPaymentsDeps } from "./payments-deps";
import { processPwaPlugins } from "./pwa-plugins";
import { processReadme } from "./readme-generator";
import { processRealtimeDeps } from "./realtime-deps";
import { processRuntimeDeps } from "./runtime-deps";
import { processStateManagementDeps } from "./state-management-deps";
import { processTestingDeps } from "./testing-deps";
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
  processFileUploadDeps(vfs, config);
  processDeployDeps(vfs, config);
  processAddonsDeps(vfs, config);
  processExamplesDeps(vfs, config);
  processAIDeps(vfs, config);
  processEffectDeps(vfs, config);
  processStateManagementDeps(vfs, config);
  processFormsDeps(vfs, config);
  processValidationDeps(vfs, config);
  processRealtimeDeps(vfs, config);
  processJobQueueDeps(vfs, config);
  processAnimationDeps(vfs, config);
  processTestingDeps(vfs, config);
  processLoggingDeps(vfs, config);
  processObservabilityDeps(vfs, config);
  processCSSAndUILibraryDeps(vfs, config);
  processCMSDeps(vfs, config);
  processCachingDeps(vfs, config);
  processTurboConfig(vfs, config);
}

export {
  processAddonsDeps,
  processAIDeps,
  processAnimationDeps,
  processApiDeps,
  processAuthDeps,
  processBackendDeps,
  processCachingDeps,
  processCMSDeps,
  processCSSAndUILibraryDeps,
  processDatabaseDeps,
  processDeployDeps,
  processEffectDeps,
  processEmailDeps,
  processEnvDeps,
  processFileUploadDeps,
  processExamplesDeps,
  processFormsDeps,
  processInfraDeps,
  processJobQueueDeps,
  processLoggingDeps,
  processObservabilityDeps,
  processPaymentsDeps,
  processReadme,
  processRealtimeDeps,
  processRuntimeDeps,
  processStateManagementDeps,
  processTestingDeps,
  processValidationDeps,
  processTurboConfig,
  processWorkspaceDeps,
  processAuthPlugins,
  processAlchemyPlugins,
  processPwaPlugins,
  processEnvVariables,
};
