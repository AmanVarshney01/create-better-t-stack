import { afterEach, describe, expect, test } from "bun:test";

import { isTelemetryEnabled } from "../src/utils/telemetry";

const KEYS = ["DO_NOT_TRACK", "BTS_TELEMETRY_DISABLED", "BTS_TELEMETRY"] as const;
const saved = Object.fromEntries(KEYS.map((key) => [key, process.env[key]]));

function setEnv(values: Partial<Record<(typeof KEYS)[number], string>>) {
  for (const key of KEYS) {
    const value = values[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

afterEach(() => {
  setEnv(saved);
});

describe("isTelemetryEnabled", () => {
  test("honors DO_NOT_TRACK regardless of the project switches", () => {
    setEnv({ DO_NOT_TRACK: "1", BTS_TELEMETRY: "1" });
    expect(isTelemetryEnabled()).toBe(false);
    setEnv({ DO_NOT_TRACK: "true", BTS_TELEMETRY_DISABLED: "0" });
    expect(isTelemetryEnabled()).toBe(false);
    setEnv({ DO_NOT_TRACK: "0", BTS_TELEMETRY: "1" });
    expect(isTelemetryEnabled()).toBe(true);
  });

  test("keeps the existing BTS switches", () => {
    setEnv({ BTS_TELEMETRY_DISABLED: "1" });
    expect(isTelemetryEnabled()).toBe(false);
    setEnv({ BTS_TELEMETRY: "0" });
    expect(isTelemetryEnabled()).toBe(false);
    setEnv({ BTS_TELEMETRY: "1" });
    expect(isTelemetryEnabled()).toBe(true);
    setEnv({});
    expect(isTelemetryEnabled()).toBe(true);
  });
});
