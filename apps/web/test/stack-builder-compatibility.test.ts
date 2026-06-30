import { describe, expect, test } from "bun:test";

import {
  getCompatibilityAdjustmentKey,
  getCompatibilityAdjustmentState,
} from "../src/app/(home)/new/_components/stack-builder/use-stack-builder";
import {
  analyzeStackCompatibility,
  getDisabledReason,
} from "../src/app/(home)/new/_components/utils";
import { DEFAULT_STACK, type StackState } from "../src/lib/constant";
import { sanitizeAddons } from "../src/lib/sanitize-stack-addons";
import { formatStackCommandForDisplay, generateStackCommand } from "../src/lib/stack-utils";

function createStack(overrides: Partial<StackState> = {}): StackState {
  return {
    ...DEFAULT_STACK,
    ...overrides,
    webFrontend: [...(overrides.webFrontend ?? DEFAULT_STACK.webFrontend)],
    nativeFrontend: [...(overrides.nativeFrontend ?? DEFAULT_STACK.nativeFrontend)],
    addons: [...(overrides.addons ?? DEFAULT_STACK.addons)],
    examples: [...(overrides.examples ?? DEFAULT_STACK.examples)],
  };
}

describe("stack builder D1 compatibility", () => {
  test("keeps self fullstack backends on the D1 + Cloudflare path", () => {
    const stack = createStack({
      backend: "self-next",
      webFrontend: ["next"],
      runtime: "none",
      database: "sqlite",
      orm: "drizzle",
      dbSetup: "d1",
      webDeploy: "none",
      serverDeploy: "none",
    });

    const result = analyzeStackCompatibility(stack);

    expect(result.adjustedStack).toMatchObject({
      backend: "self-next",
      runtime: "none",
      database: "sqlite",
      dbSetup: "d1",
      webDeploy: "cloudflare",
      serverDeploy: "none",
    });
  });

  test("still routes non-self D1 stacks through workers + cloudflare", () => {
    const stack = createStack({
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      dbSetup: "d1",
      serverDeploy: "none",
    });

    const result = analyzeStackCompatibility(stack);

    expect(result.adjustedStack).toMatchObject({
      backend: "hono",
      runtime: "workers",
      database: "sqlite",
      dbSetup: "d1",
      serverDeploy: "cloudflare",
    });
  });

  test("allows selecting D1 for self fullstack backends", () => {
    const stack = createStack({
      backend: "self-next",
      webFrontend: ["next"],
      runtime: "none",
      database: "sqlite",
    });

    expect(getDisabledReason(stack, "dbSetup", "d1")).toBeNull();
  });

  test("blocks non-cloudflare web deployment for self fullstack D1 stacks", () => {
    const stack = createStack({
      backend: "self-next",
      webFrontend: ["next"],
      runtime: "none",
      database: "sqlite",
      dbSetup: "d1",
      webDeploy: "cloudflare",
    });

    expect(getDisabledReason(stack, "webDeploy", "none")).toBe(
      "D1 with a self fullstack backend requires Cloudflare web deployment",
    );
  });

  test("keeps only the latest selected task-runner addon", () => {
    expect(sanitizeAddons(["turborepo", "vite-plus"])).toEqual(["vite-plus"]);
    expect(sanitizeAddons(["vite-plus", "nx"])).toEqual(["nx"]);
    expect(sanitizeAddons(["nx", "turborepo"])).toEqual(["turborepo"]);

    const sanitizedAddons = sanitizeAddons(["turborepo", "vite-plus"]);
    const command = generateStackCommand(createStack({ addons: sanitizedAddons }));

    expect(command).toContain("--addons vite-plus");
    expect(command).not.toContain("turborepo");

    expect(
      getDisabledReason(createStack({ addons: ["turborepo"] }), "addons", "vite-plus"),
    ).toBeNull();
    expect(getDisabledReason(createStack({ addons: ["vite-plus"] }), "addons", "nx")).toBeNull();
  });

  test("renders long CLI commands with visible flag separators", () => {
    const command = generateStackCommand(
      createStack({ addons: ["vite-plus"], examples: ["none"] }),
    );
    const displayCommand = formatStackCommandForDisplay(command);

    expect(command).toContain("my-better-t-app --frontend");
    expect(displayCommand).toContain(`my-better-t-app ${"\\"}\n  --frontend`);
    expect(displayCommand).toContain(`tanstack-router ${"\\"}\n  --backend`);
  });

  test("reapplies the same D1 adjustment after leaving and returning to it", () => {
    const adjustedD1Stack = createStack({
      backend: "self-next",
      webFrontend: ["next"],
      runtime: "none",
      database: "sqlite",
      dbSetup: "d1",
      webDeploy: "cloudflare",
      serverDeploy: "none",
    });
    const initialRawD1Stack = createStack({
      ...adjustedD1Stack,
      webDeploy: "none",
    });
    const tursoStack = createStack({
      backend: "self-next",
      webFrontend: ["next"],
      runtime: "none",
      database: "sqlite",
      dbSetup: "turso",
      webDeploy: "none",
      serverDeploy: "none",
    });

    const firstAdjustment = getCompatibilityAdjustmentState("", initialRawD1Stack, adjustedD1Stack);
    const settledState = getCompatibilityAdjustmentState(
      firstAdjustment.adjustmentKey,
      tursoStack,
      null,
    );
    const secondAdjustment = getCompatibilityAdjustmentState(
      settledState.adjustmentKey,
      initialRawD1Stack,
      adjustedD1Stack,
    );

    expect(firstAdjustment.adjustmentKey).toBe(
      getCompatibilityAdjustmentKey(initialRawD1Stack, adjustedD1Stack),
    );
    expect(firstAdjustment.shouldApply).toBe(true);
    expect(settledState.adjustmentKey).toBe("");
    expect(settledState.shouldApply).toBe(false);
    expect(secondAdjustment.adjustmentKey).toBe(
      getCompatibilityAdjustmentKey(initialRawD1Stack, adjustedD1Stack),
    );
    expect(secondAdjustment.shouldApply).toBe(true);
  });

  test("allows Polar when there is no frontend at all", () => {
    const stack = createStack({
      webFrontend: ["none"],
      nativeFrontend: ["none"],
      backend: "hono",
      auth: "better-auth",
    });

    expect(getDisabledReason(stack, "payments", "polar")).toBeNull();
  });

  test("allows Polar for native-only stacks", () => {
    const stack = createStack({
      webFrontend: ["none"],
      nativeFrontend: ["native-bare"],
      backend: "hono",
      auth: "better-auth",
    });

    expect(getDisabledReason(stack, "payments", "polar")).toBeNull();
  });

  test("allows Polar for mixed web and native stacks", () => {
    const stack = createStack({
      webFrontend: ["tanstack-router"],
      nativeFrontend: ["native-bare"],
      backend: "hono",
      runtime: "bun",
      auth: "better-auth",
      payments: "polar",
    });

    expect(getDisabledReason(stack, "payments", "polar")).toBeNull();
    expect(analyzeStackCompatibility(stack).adjustedStack).toBeNull();

    const command = generateStackCommand(stack);
    expect(command).toContain("--frontend tanstack-router native-bare");
    expect(command).toContain("--payments polar");
  });

  test("allows Polar for mixed Convex Better Auth web and native stacks", () => {
    const stack = createStack({
      webFrontend: ["next"],
      nativeFrontend: ["native-bare"],
      backend: "convex",
      runtime: "none",
      database: "none",
      orm: "none",
      api: "none",
      dbSetup: "none",
      auth: "better-auth",
      payments: "polar",
    });

    expect(getDisabledReason(stack, "auth", "better-auth")).toBeNull();
    expect(getDisabledReason(stack, "payments", "polar")).toBeNull();
    expect(analyzeStackCompatibility(stack).adjustedStack).toBeNull();

    const command = generateStackCommand(stack);
    expect(command).toContain("--frontend next native-bare");
    expect(command).toContain("--backend convex");
    expect(command).toContain("--payments polar");
  });

  test("blocks the AI example for Astro frontends", () => {
    const stack = createStack({
      webFrontend: ["astro"],
      backend: "self-astro",
      api: "orpc",
    });

    expect(getDisabledReason(stack, "examples", "ai")).toBe(
      "AI example not compatible with Solid or Astro frontend",
    );

    const result = analyzeStackCompatibility({
      ...stack,
      examples: ["ai"],
    });

    expect(result.adjustedStack?.examples).toEqual(["none"]);
  });

  test("blocks Evlog for Convex stacks", () => {
    const stack = createStack({
      webFrontend: ["tanstack-start"],
      nativeFrontend: ["native-uniwind"],
      backend: "convex",
      runtime: "none",
      addons: ["turborepo"],
    });

    expect(getDisabledReason(stack, "addons", "evlog")).toBe(
      "evlog requires Hono, Express, Fastify, Elysia, or a fullstack backend",
    );
  });

  test("removes Evlog when a selected stack switches to Convex", () => {
    const stack = createStack({
      webFrontend: ["tanstack-start"],
      nativeFrontend: ["native-uniwind"],
      backend: "convex",
      runtime: "none",
      addons: ["turborepo", "evlog"],
    });

    const result = analyzeStackCompatibility(stack);

    expect(result.adjustedStack?.addons).toEqual(["turborepo"]);
    expect(result.changes).toContainEqual({
      category: "addons",
      message: "evlog removed (requires a server or fullstack backend)",
    });
  });

  test("allows Evlog for server and fullstack stacks", () => {
    const serverStack = createStack({
      backend: "hono",
      runtime: "bun",
    });
    const fullstackStack = createStack({
      webFrontend: ["tanstack-start"],
      backend: "self-tanstack-start",
      runtime: "none",
    });

    expect(getDisabledReason(serverStack, "addons", "evlog")).toBeNull();
    expect(getDisabledReason(fullstackStack, "addons", "evlog")).toBeNull();
  });
});

describe("stack builder Docker deployment compatibility", () => {
  test("allows Docker web deploy with a web frontend", () => {
    const stack = createStack({
      webFrontend: ["tanstack-router"],
      backend: "hono",
      runtime: "bun",
    });

    expect(getDisabledReason(stack, "webDeploy", "docker")).toBeNull();

    const command = generateStackCommand({
      ...stack,
      webDeploy: "docker",
    });
    expect(command).toContain("--web-deploy docker");
  });

  test("allows Docker server deploy on bun/node runtimes only", () => {
    const bunStack = createStack({
      backend: "hono",
      runtime: "bun",
    });
    const workersStack = createStack({
      backend: "hono",
      runtime: "workers",
      serverDeploy: "cloudflare",
      database: "sqlite",
      orm: "drizzle",
      dbSetup: "d1",
    });

    expect(getDisabledReason(bunStack, "serverDeploy", "docker")).toBeNull();
    expect(getDisabledReason(workersStack, "serverDeploy", "docker")).toBe(
      "Docker server deployment requires the Bun or Node runtime",
    );
  });

  test("switches Docker server deploy to Cloudflare when runtime becomes workers", () => {
    const stack = createStack({
      backend: "hono",
      runtime: "workers",
      serverDeploy: "docker",
      database: "sqlite",
      orm: "drizzle",
      dbSetup: "d1",
    });

    const result = analyzeStackCompatibility(stack);

    expect(result.adjustedStack).toMatchObject({
      serverDeploy: "cloudflare",
    });
  });

  test("clears Docker server deploy for backends without a server app", () => {
    const stack = createStack({
      webFrontend: ["next"],
      backend: "self-next",
      runtime: "none",
      serverDeploy: "docker",
    });

    const result = analyzeStackCompatibility(stack);

    expect(result.adjustedStack).toMatchObject({
      serverDeploy: "none",
    });
  });
});
