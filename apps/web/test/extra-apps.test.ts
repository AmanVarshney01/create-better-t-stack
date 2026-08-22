import { describe, expect, test } from "bun:test";

import { analyzeStackCompatibility } from "../src/app/(home)/new/_components/utils";
import { DEFAULT_STACK, type StackState } from "../src/lib/constant";
import {
  formatExtraApp,
  getExtraAppFrontendDisabledReason,
  getExtraAppsBlockedReason,
  parseExtraApp,
  sanitizeExtraApps,
  validateExtraAppName,
} from "../src/lib/extra-apps";
import { sanitizeStackState } from "../src/lib/sanitize-stack-addons";
import { generateStackCommand } from "../src/lib/stack-utils";

function createStack(overrides: Partial<StackState> = {}): StackState {
  return {
    ...DEFAULT_STACK,
    ...overrides,
  };
}

describe("extra app encoding", () => {
  test("round-trips name:frontend", () => {
    expect(parseExtraApp(formatExtraApp({ name: "admin", frontend: "next" }))).toEqual({
      name: "admin",
      frontend: "next",
    });
  });

  test("rejects malformed entries", () => {
    expect(parseExtraApp("admin")).toBeNull();
    expect(parseExtraApp(":next")).toBeNull();
    expect(parseExtraApp("admin:")).toBeNull();
  });
});

describe("validateExtraAppName", () => {
  const taken = new Set(["admin"]);

  test("accepts valid names", () => {
    expect(validateExtraAppName("landing", taken)).toBeNull();
    expect(validateExtraAppName("my-app-2", taken)).toBeNull();
  });

  test("names the specific problem", () => {
    expect(validateExtraAppName("", taken)).toContain("empty");
    expect(validateExtraAppName("Admin", taken)).toContain("lowercase");
    expect(validateExtraAppName("1app", taken)).toContain("lowercase");
    expect(validateExtraAppName("web", taken)).toContain("reserved");
    expect(validateExtraAppName("env", taken)).toContain("reserved");
    expect(validateExtraAppName("admin", taken)).toContain("already planned");
    expect(validateExtraAppName("a".repeat(31), taken)).toContain("30 characters");
  });
});

describe("getExtraAppFrontendDisabledReason", () => {
  test("trpc restricts to react-family", () => {
    const stack = createStack({ api: "trpc" });
    expect(getExtraAppFrontendDisabledReason(stack, "next")).toBeNull();
    expect(getExtraAppFrontendDisabledReason(stack, "tanstack-router")).toBeNull();
    expect(getExtraAppFrontendDisabledReason(stack, "astro")).toContain("tRPC");
    expect(getExtraAppFrontendDisabledReason(stack, "svelte")).toContain("tRPC");
  });

  test("orpc allows all frameworks", () => {
    const stack = createStack({ api: "orpc", auth: "none" });
    for (const frontend of ["next", "nuxt", "svelte", "solid", "astro"]) {
      expect(getExtraAppFrontendDisabledReason(stack, frontend)).toBeNull();
    }
  });

  test("clerk restricts to react-family", () => {
    const stack = createStack({ api: "orpc", auth: "clerk" });
    expect(getExtraAppFrontendDisabledReason(stack, "next")).toBeNull();
    expect(getExtraAppFrontendDisabledReason(stack, "nuxt")).toContain("Clerk");
  });

  test("convex excludes solid and astro", () => {
    const stack = createStack({ backend: "convex", api: "none", auth: "none" });
    expect(getExtraAppFrontendDisabledReason(stack, "solid")).toContain("Convex");
    expect(getExtraAppFrontendDisabledReason(stack, "astro")).toContain("Convex");
    expect(getExtraAppFrontendDisabledReason(stack, "svelte")).toBeNull();
  });

  test("self backends block extra apps entirely", () => {
    expect(getExtraAppsBlockedReason(createStack({ backend: "self-next" }))).toContain("Fullstack");
    expect(getExtraAppsBlockedReason(createStack({ backend: "hono" }))).toBeNull();
  });
});

describe("sanitizeExtraApps", () => {
  test("drops malformed, duplicate, reserved, and incompatible entries", () => {
    const stack = createStack({ api: "trpc" });
    expect(
      sanitizeExtraApps(
        ["admin:next", "broken", "admin:next", "web:next", "landing:astro", "staff:not-real"],
        stack,
      ),
    ).toEqual(["admin:next"]);
  });

  test("returns empty for self backends", () => {
    expect(sanitizeExtraApps(["admin:next"], createStack({ backend: "self-next" }))).toEqual([]);
  });

  test("runs as part of sanitizeStackState", () => {
    const sanitized = sanitizeStackState(
      createStack({ api: "trpc", apps: ["admin:next", "landing:astro"] }),
    );
    expect(sanitized.apps).toEqual(["admin:next"]);
  });
});

describe("analyzeStackCompatibility apps rule", () => {
  test("drops planned apps that become incompatible, with a change message", () => {
    const result = analyzeStackCompatibility(
      createStack({ api: "trpc", apps: ["admin:next", "landing:astro"] }),
    );
    expect(result.adjustedStack?.apps).toEqual(["admin:next"]);
    expect(
      result.changes.some(
        (change) => change.category === "apps" && change.message.includes("landing"),
      ),
    ).toBe(true);
  });

  test("keeps compatible apps untouched", () => {
    const result = analyzeStackCompatibility(createStack({ apps: ["admin:next"] }));
    expect(result.adjustedStack?.apps ?? ["admin:next"]).toEqual(["admin:next"]);
  });
});

describe("generateStackCommand with extra apps", () => {
  test("appends --apps to the create command", () => {
    const command = generateStackCommand(createStack({ apps: ["admin:next", "landing:astro"] }));
    expect(command).toContain("--apps admin:next landing:astro");
  });

  test("omits --apps when no apps are planned", () => {
    expect(generateStackCommand(createStack())).not.toContain("--apps");
  });

  test("planned apps defeat the all-defaults --yes shortcut", () => {
    const command = generateStackCommand(createStack({ apps: ["admin:next"] }));
    expect(command).not.toContain("--yes");
    expect(command).toContain("--apps admin:next");
  });
});
