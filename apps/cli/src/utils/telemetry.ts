/**
 * Returns true if telemetry/analytics should be enabled, false otherwise.
 *
 * - If CJS_TELEMETRY_DISABLED is present and "1", disables analytics.
 * - Otherwise, CJS_TELEMETRY: "0" disables, "1" enables (default: enabled).
 */
export function isTelemetryEnabled() {
  const CJS_TELEMETRY_DISABLED = process.env.CJS_TELEMETRY_DISABLED;
  const CJS_TELEMETRY = process.env.CJS_TELEMETRY;

  if (CJS_TELEMETRY_DISABLED !== undefined) {
    return CJS_TELEMETRY_DISABLED !== "1";
  }
  if (CJS_TELEMETRY !== undefined) {
    return CJS_TELEMETRY === "1";
  }
  // Default: enabled
  return true;
}
