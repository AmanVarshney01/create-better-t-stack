import type { ProjectConfig } from "../types";
import { getLatestCLIVersion } from "./get-latest-cli-version";
import { isTelemetryEnabled } from "./telemetry";

const CONVEX_INGEST_URL =
	"https://striped-seahorse-863.convex.site/api/analytics/ingest";

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
	} catch (_error) {}
}

export async function trackProjectCreation(
	config: ProjectConfig,
	disableAnalytics = false,
) {
	if (!isTelemetryEnabled() || disableAnalytics) return;

	// biome-ignore lint/correctness/noUnusedVariables: `projectName`, `projectDir`, and `relativePath` are not used in the event properties
	const { projectName, projectDir, relativePath, ...safeConfig } = config;

	try {
		await sendConvexEvent({
			event: "project_created",
			...safeConfig,
			cli_version: getLatestCLIVersion(),
			node_version: typeof process !== "undefined" ? process.version : "",
			platform: typeof process !== "undefined" ? process.platform : "",
		});
	} catch (_error) {}
}
