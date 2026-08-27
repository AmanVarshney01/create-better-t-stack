/**
 * Returns true if telemetry/analytics should be enabled, false otherwise.
 *
 * - DO_NOT_TRACK=1 (the cross-tool convention from consoledonottrack.com) disables analytics.
 * - If BTS_TELEMETRY_DISABLED is present and "1", disables analytics.
 * - Otherwise, BTS_TELEMETRY: "0" disables, "1" enables (default: enabled).
 */
export function isTelemetryEnabled() {
  const DO_NOT_TRACK = process.env.DO_NOT_TRACK;
  const BTS_TELEMETRY_DISABLED = process.env.BTS_TELEMETRY_DISABLED;
  const BTS_TELEMETRY = process.env.BTS_TELEMETRY;

  if (DO_NOT_TRACK === "1" || DO_NOT_TRACK?.toLowerCase() === "true") {
    return false;
  }
  if (BTS_TELEMETRY_DISABLED !== undefined) {
    return BTS_TELEMETRY_DISABLED !== "1";
  }
  if (BTS_TELEMETRY !== undefined) {
    return BTS_TELEMETRY === "1";
  }
  // Default: enabled
  return true;
}
