import type { ProjectConfig } from "../types";
import { getLatestCLIVersion } from "./get-latest-cli-version";
import { isTelemetryEnabled } from "./telemetry";

const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY || "";
const POSTHOG_HOST = process.env.POSTHOG_HOST;

export async function trackProjectCreation(config: ProjectConfig, disableAnalytics = false) {
	if (!isTelemetryEnabled() || disableAnalytics) return;

	const sessionId = `cli_${crypto.randomUUID().replace(/-/g, "")}`;
	// biome-ignore lint/correctness/noUnusedVariables: `projectName`, `projectDir`, and `relativePath` are not used in the event properties
	const { projectName, projectDir, relativePath, ...safeConfig } = config;

	const payload = {
		api_key: POSTHOG_API_KEY,
		event: "project_created",
		properties: {
			...safeConfig,
			cli_version: getLatestCLIVersion(),
			node_version: process.version,
			platform: process.platform,
			$ip: null,
		},
		distinct_id: sessionId,
	};

	try {
		await fetch(`${POSTHOG_HOST}/capture`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
	} catch (_error) {}
}
