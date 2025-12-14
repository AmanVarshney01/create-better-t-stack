import type { ProjectConfig } from "../types";
import { getLatestCLIVersion } from "./get-latest-cli-version";
import { isTelemetryEnabled } from "./telemetry";

const CONVEX_INGEST_URL = process.env.CONVEX_INGEST_URL;

async function sendConvexEvent(payload: Record<string, unknown>) {
  if (!CONVEX_INGEST_URL) return;

  try {
    await fetch(CONVEX_INGEST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {}
}

export async function trackProjectCreation(config: ProjectConfig, disableAnalytics = false) {
  if (!isTelemetryEnabled() || disableAnalytics) return;

  const {
    projectName: _projectName,
    projectDir: _projectDir,
    relativePath: _relativePath,
    ...safeConfig
  } = config;

  try {
    await sendConvexEvent({
      ...safeConfig,
      cli_version: getLatestCLIVersion(),
      node_version: typeof process !== "undefined" ? process.version : "",
      platform: typeof process !== "undefined" ? process.platform : "",
    });
  } catch {}
}
