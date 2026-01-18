import { Result } from "better-result";

import type { ProjectConfig } from "../types";

import { getLatestCLIVersion } from "./get-latest-cli-version";
import { isTelemetryEnabled } from "./telemetry";

const CONVEX_INGEST_URL = process.env.CONVEX_INGEST_URL;

async function sendConvexEvent(payload: Record<string, unknown>): Promise<void> {
  if (!CONVEX_INGEST_URL) return;

  await Result.tryPromise({
    try: () =>
      fetch(CONVEX_INGEST_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }),
    catch: () => undefined, // Silent failure
  });
}

export async function trackProjectCreation(
  config: ProjectConfig,
  disableAnalytics = false,
): Promise<void> {
  if (!isTelemetryEnabled() || disableAnalytics) return;

  const {
    projectName: _projectName,
    projectDir: _projectDir,
    relativePath: _relativePath,
    ...safeConfig
  } = config;

  await Result.tryPromise({
    try: () =>
      sendConvexEvent({
        ...safeConfig,
        cli_version: getLatestCLIVersion(),
        node_version: typeof process !== "undefined" ? process.version : "",
        platform: typeof process !== "undefined" ? process.platform : "",
      }),
    catch: () => undefined, // Silent failure
  });
}
