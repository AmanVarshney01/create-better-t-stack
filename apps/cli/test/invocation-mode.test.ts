import { afterEach, describe, expect, test } from "bun:test";

import { DEFAULT_CONFIG } from "../src/constants";
import { buildAnalyticsEvent } from "../src/utils/analytics";
import {
  markPromptShown,
  resolveInvocationMode,
  runWithContext,
  setProcessMode,
} from "../src/utils/context";

afterEach(() => {
  setProcessMode(undefined);
});

describe("resolveInvocationMode", () => {
  test("uses the mode the host declared when there is one", () => {
    expect(runWithContext({ mode: "json" }, () => resolveInvocationMode(true))).toBe("json");
    expect(runWithContext({ mode: "api" }, () => resolveInvocationMode(false))).toBe("api");
  });

  test("falls back to the process mode set by the MCP server", () => {
    setProcessMode("mcp");
    expect(runWithContext({}, () => resolveInvocationMode(false))).toBe("mcp");
  });

  test("derives yes, interactive, and flags from the run itself", () => {
    expect(runWithContext({}, () => resolveInvocationMode(true))).toBe("yes");
    expect(runWithContext({}, () => resolveInvocationMode(false))).toBe("flags");
    expect(
      runWithContext({}, () => {
        markPromptShown();
        return resolveInvocationMode(false);
      }),
    ).toBe("interactive");
  });

  test("is carried on the project event", () => {
    const config = {
      ...DEFAULT_CONFIG,
      projectName: "probe",
      projectDir: "/probe",
      relativePath: "probe",
    };
    expect(buildAnalyticsEvent(config, "mcp").mode).toBe("mcp");
    expect(buildAnalyticsEvent(config).mode).toBeUndefined();
  });
});
