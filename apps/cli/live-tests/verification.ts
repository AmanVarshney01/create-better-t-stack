import type { ProjectConfig } from "@better-t-stack/types";

import { openBrowser, verifyBrowser } from "./browser";
import type { DatabaseAssertions } from "./database";
import type { Deployment } from "./providers";
import { verifyServer } from "./server";

export async function verifyRuntime(
  config: ProjectConfig,
  deployment: Deployment,
  directory: string,
  stage: string,
  getBrowser: typeof openBrowser,
  database?: DatabaseAssertions,
  previousStage?: string,
) {
  if (config.frontend.length)
    await verifyBrowser(
      await getBrowser(),
      config,
      deployment,
      directory,
      stage,
      database,
      previousStage,
    );
  else await verifyServer(config, deployment, stage, database, previousStage);
}
