import { describe, expect, test } from "bun:test";

import {
  buildDiagnosticPayload,
  diagnosticUserAgent,
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

  test("scrubs path segments with spaces and relative paths or package names", () => {
    expect(scrubReason("error at /Users/Jane Doe/project/file.ts while writing")).toBe(
      "error at <path> while writing",
    );
    expect(scrubReason("cannot read /Users/jane/report final.txt")).toBe("cannot read <path>");
    expect(scrubReason('Template "apps/web/src/index.ts" is missing')).toBe(
      "Template <name> is missing",
    );
    expect(scrubReason("Workspace package already exists: packages/customer-name")).toBe(
      "Workspace package already exists: <path>",
    );
    expect(
      scrubReason('No Better-T-Stack project found in "customer-app". Make sure bts.jsonc exists.'),
    ).toBe("No Better-T-Stack project found in <name>. Make sure bts.jsonc exists.");
  });

  test("keeps bullet lines under the headline, such as toolchain requirement failures", () => {
    const message = [
      "Your local toolchain does not meet this stack's requirements:",
      "- Node.js v20.11.0 does not satisfy >=22.0.0 required by the Next.js template.",
      "",
      "Upgrade Node.js from https://nodejs.org",
    ].join("\n");
    expect(scrubReason(new Error(message))).toBe(
      "Your local toolchain does not meet this stack's requirements: Node.js v20.11.0 does not satisfy >=22.0.0 required by the Next.js template.",
    );
  });

  test("does not treat apostrophes inside words as quotes", () => {
    const message = [
      "Your local toolchain does not meet this stack's requirements:",
      "- Node.js v20.11.0 does not satisfy >=22.0.0 required by Starlight's Astro toolchain.",
    ].join("\n");
    expect(scrubReason(new Error(message))).toBe(
      "Your local toolchain does not meet this stack's requirements: Node.js v20.11.0 does not satisfy >=22.0.0 required by Starlight's Astro toolchain.",
    );
    expect(scrubReason("Directory 'my app' already exists")).toBe(
      "Directory <name> already exists",
    );
    expect(scrubReason("Beyoncé's note 'draft' is missing")).toBe(
      "Beyoncé's note <name> is missing",
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

describe("buildDiagnosticPayload", () => {
  test("routes events by command and drops undefined properties", () => {
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

    const add = buildDiagnosticPayload("cli_failed", {
      command: "add",
      mode: "mcp",
      stage: "config",
      error: "CLIError",
      reason: "No Better-T-Stack project found in <name>",
    });
    expect(add.payload.url).toBe("/add");
    expect(add.payload.data.mode).toBe("mcp");
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
      await reportDiagnostic("cli_failed", {
        command: "create",
        mode: "flags",
        stage: "validate",
        error: "ValidationError",
        reason: "invalid",
      });
    } finally {
      globalThis.fetch = originalFetch;
    }

    expect(called).toBe(false);
  });
});
