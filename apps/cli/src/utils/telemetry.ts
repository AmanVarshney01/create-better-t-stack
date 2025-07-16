/**
 * Returns true if telemetry/analytics should be enabled, false otherwise.
 *
 * - If BTS_TELEMETRY_DISABLED is present and "1", disables analytics.
 * - Otherwise, BTS_TELEMETRY: "0" disables, "1" enables (default: enabled).
 */
export function isTelemetryEnabled(): boolean {
	const BTS_TELEMETRY_DISABLED = process.env.BTS_TELEMETRY_DISABLED;
	const BTS_TELEMETRY = process.env.BTS_TELEMETRY;

	if (BTS_TELEMETRY_DISABLED !== undefined) {
		return BTS_TELEMETRY_DISABLED !== "1";
	}
	if (BTS_TELEMETRY !== undefined) {
		return BTS_TELEMETRY === "1";
	}
	// Default: enabled
	return true;
}
