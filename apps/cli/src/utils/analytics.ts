import { PostHog } from "posthog-node";
import type { ProjectConfig } from "../types";
import { getLatestCLIVersion } from "./get-latest-cli-version";
import { isTelemetryEnabled } from "./telemetry";

const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY || "";
const POSTHOG_HOST = process.env.POSTHOG_HOST;

export async function trackProjectCreation(config: ProjectConfig) {
	const posthog = new PostHog(POSTHOG_API_KEY, {
		host: POSTHOG_HOST,
		flushAt: 1,
		flushInterval: 0,
		privacyMode: true,
		disableGeoip: true,
		disabled: !isTelemetryEnabled(),
	});

	try {
		const sessionId = `cli_${crypto.randomUUID().replace(/-/g, "")}`;

		// biome-ignore lint/correctness/noUnusedVariables: `projectName`, `projectDir`, and `relativePath` are not used in the event properties
		const { projectName, projectDir, relativePath, ...safeConfig } = config;

		posthog.capture({
			distinctId: sessionId,
			event: "project_created",
			properties: {
				...safeConfig,
				cli_version: getLatestCLIVersion(),
				node_version: process.version,
				platform: process.platform,
				$ip: null,
			},
		});
	} catch (_error) {
		// consola.debug("Analytics tracking failed:", error);
	} finally {
		await posthog.shutdown();
	}
}
