import { describe, expect, test } from "bun:test";

import {
  buildDiagnosticPayload,
  diagnosticUserAgent,
  durationBucket,
  errorClass,
  reportDiagnostic,
  scrubReason,
} from "../src/utils/diagnostics";
import { CLIError } from "../src/utils/errors";

describe("scrubReason", () => {
  test("keeps the first line and replaces identifying fragments", () => {
    const error = new Error(
      `Directory "/Users/jane/work/acme-app" already exists (see https://example.com/docs?x=1)\nstack line 2`,
    );
    expect(scrubReason(error)).toBe("Directory <name> already exists (see <url>)");
  });

  test("scrubs unquoted paths, Windows paths, and emails", () => {
    expect(scrubReason("ENOENT: no such file, open /tmp/build/project/package.json")).toBe(
      "ENOENT: no such file, open <path>",
    );
    expect(scrubReason("cannot write C:\\Users\\jane\\app\\file.txt")).toBe("cannot write <path>");
    expect(scrubReason("git author jane@example.com is not configured")).toBe(
      "git author <email> is not configured",
    );
  });

  test("truncates very long reasons", () => {
    expect(scrubReason("x".repeat(400))).toHaveLength(160);
  });
});

describe("errorClass", () => {
  test("uses the error name and falls back for non-errors", () => {
    expect(errorClass(new CLIError({ message: "boom" }))).toBe("CLIError");
    expect(errorClass(new TypeError("bad"))).toBe("TypeError");
    expect(errorClass("string failure")).toBe("UnknownError");
  });
});

describe("durationBucket", () => {
  test("maps elapsed milliseconds to coarse buckets", () => {
    expect(durationBucket(120)).toBe("<1s");
    expect(durationBucket(4_000)).toBe("1-5s");
    expect(durationBucket(14_999)).toBe("5-15s");
    expect(durationBucket(59_000)).toBe("15-60s");
    expect(durationBucket(200_000)).toBe("1-5m");
    expect(durationBucket(900_000)).toBe(">5m");
  });
});

describe("buildDiagnosticPayload", () => {
  test("routes CLI events by command and MCP events under /mcp", () => {
    const failed = buildDiagnosticPayload("cli_failed", {
      command: "create",
      mode: "flags",
      stage: "install",
      error: "CLIError",
      reason: "install failed",
      packageManager: "bun",
      backend: undefined,
    });
    expect(failed.type).toBe("event");
    expect(failed.payload.url).toBe("/create");
    expect(failed.payload.name).toBe("cli_failed");
    expect(failed.payload.hostname).toBe("cli");
    expect(failed.payload.data).toEqual({
      command: "create",
      mode: "flags",
      stage: "install",
      error: "CLIError",
      reason: "install failed",
      packageManager: "bun",
    });

    const tool = buildDiagnosticPayload("mcp_tool", {
      tool: "bts_plan_project",
      ok: true,
      duration: "<1s",
    });
    expect(tool.payload.url).toBe("/mcp");
    expect(tool.payload.data.ok).toBe(true);
  });

  test("uses a browser-compatible user agent so Umami does not drop it as a bot", () => {
    expect(diagnosticUserAgent()).toMatch(/^Mozilla\/5\.0 \(compatible; create-better-t-stack\/\d/);
  });
});

describe("reportDiagnostic", () => {
  test("is a no-op when no CLI website id is configured", async () => {
    const originalFetch = globalThis.fetch;
    let called = false;
    globalThis.fetch = (() => {
      called = true;
      return Promise.resolve(new Response("ok"));
    }) as typeof fetch;

    try {
      await reportDiagnostic("cli_outdated", { installed: "3.40.5", latest: "3.41.0" });
    } finally {
      globalThis.fetch = originalFetch;
    }

    expect(called).toBe(false);
  });
});
