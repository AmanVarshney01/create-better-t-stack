import { describe, expect, test } from "bun:test";

import {
  ADDONS_VALUES,
  SERVER_DEPLOY_VALUES,
  WEB_DEPLOY_VALUES,
} from "../../../packages/types/src/schemas";
import {
  applyStackUpdate,
  getSelectedTechRemovalUpdate,
  getTechSelectionUpdate,
  resolveStackCompatibility,
} from "../src/app/(home)/new/_components/stack-builder/use-stack-builder";
import {
  analyzeStackCompatibility,
  getDisabledReason,
} from "../src/app/(home)/new/_components/utils";
import { DEFAULT_STACK, type StackState, TECH_OPTIONS } from "../src/lib/constant";
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
  test("supports SolidStart as a self-hosted fullstack backend", () => {
    const stack = createStack({
      webFrontend: ["solid"],
      backend: "self-solid",
      runtime: "none",
      api: "orpc",
      serverDeploy: "none",
    });

    expect(getDisabledReason(stack, "backend", "self-solid")).toBeNull();
    expect(getDisabledReason(stack, "api", "trpc")).toBe(
      "tRPC is not compatible with SolidStart (use oRPC)",
    );
    expect(getDisabledReason(stack, "addons", "evlog")).toBe(
      "evlog requires Hono, Express, Fastify, Elysia, or a fullstack backend",
    );
    expect(analyzeStackCompatibility(stack).adjustedStack).toBeNull();

    const command = generateStackCommand(stack);
    expect(command).toContain("--frontend solid");
    expect(command).toContain("--backend self");
  });

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
    const initialRawD1Stack = createStack({
      backend: "self-next",
      webFrontend: ["next"],
      runtime: "none",
      database: "sqlite",
      dbSetup: "d1",
      webDeploy: "none",
      serverDeploy: "none",
    });

    const firstD1Selection = applyStackUpdate(initialRawD1Stack, {});
    const tursoSelection = applyStackUpdate(firstD1Selection.stack, {
      dbSetup: "turso",
      webDeploy: "none",
    });
    const secondD1Selection = applyStackUpdate(tursoSelection.stack, { dbSetup: "d1" });

    expect(firstD1Selection.stack.webDeploy).toBe("cloudflare");
    expect(tursoSelection.stack).toMatchObject({ dbSetup: "turso", webDeploy: "none" });
    expect(secondD1Selection.stack).toMatchObject({
      dbSetup: "d1",
      webDeploy: "cloudflare",
    });
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

  test("keeps Expo selected when Nuxt switches the API to oRPC", () => {
    const nuxtStack = applyStackUpdate(createStack(), (currentStack) =>
      getTechSelectionUpdate(currentStack, "webFrontend", "nuxt"),
    ).stack;
    const nuxtAndExpoStack = applyStackUpdate(nuxtStack, (currentStack) =>
      getTechSelectionUpdate(currentStack, "nativeFrontend", "native-bare"),
    ).stack;

    expect(nuxtAndExpoStack).toMatchObject({
      webFrontend: ["nuxt"],
      nativeFrontend: ["native-bare"],
      api: "orpc",
    });
    expect(getDisabledReason(nuxtAndExpoStack, "nativeFrontend", "native-bare")).toBeNull();
    expect(generateStackCommand(nuxtAndExpoStack)).toContain("--frontend nuxt native-bare");
  });

  test("removes a compatibility-adjusted badge against the effective stack", () => {
    const rawStack = createStack({
      webFrontend: ["nuxt"],
      nativeFrontend: ["native-bare"],
      api: "trpc",
    });

    expect(analyzeStackCompatibility(rawStack).adjustedStack?.api).toBe("orpc");
    expect(getSelectedTechRemovalUpdate(rawStack, "api", "orpc")).toEqual({ api: "none" });

    const adjustedStack = applyStackUpdate(rawStack, (currentStack) =>
      getSelectedTechRemovalUpdate(currentStack, "api", "orpc"),
    ).stack;

    expect(adjustedStack).toMatchObject({
      webFrontend: ["nuxt"],
      nativeFrontend: ["native-bare"],
      api: "none",
    });
  });

  test("matches the CLI by disabling every ORM when no database is selected", () => {
    const stack = resolveStackCompatibility(
      createStack({ database: "none", orm: "none", dbSetup: "none" }),
    ).stack;

    expect(getDisabledReason(stack, "orm", "drizzle")).toBe("Select a database first");
    expect(getDisabledReason(stack, "orm", "prisma")).toBe("Select a database first");
    expect(getDisabledReason(stack, "orm", "mongoose")).toBe("Select a database first");
    expect(getDisabledReason(stack, "orm", "none")).toBeNull();
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

  test("does not let a native frontend hide Clerk-incompatible web frontends", () => {
    const stack = createStack({
      webFrontend: ["nuxt"],
      nativeFrontend: ["native-bare"],
      auth: "none",
      api: "orpc",
    });

    expect(getDisabledReason(stack, "auth", "clerk")).toBe(
      "Clerk requires React Router, TanStack Router, TanStack Start, Next.js, or React Native",
    );
    expect(resolveStackCompatibility({ ...stack, auth: "clerk" }).stack.auth).toBe("none");
  });

  test("does not let a native frontend hide Convex Better Auth incompatibilities", () => {
    const stack = createStack({
      webFrontend: ["nuxt"],
      nativeFrontend: ["native-uniwind"],
      backend: "convex",
      runtime: "none",
      database: "none",
      orm: "none",
      dbSetup: "none",
      api: "none",
      auth: "none",
    });

    expect(getDisabledReason(stack, "auth", "better-auth")).toBe(
      "Better-Auth with Convex requires React Router, TanStack Router, TanStack Start, Next.js, or React Native",
    );
    expect(resolveStackCompatibility({ ...stack, auth: "better-auth" }).stack.auth).toBe("none");
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

  test("blocks Docker web deploy when desktop addons require static server output", () => {
    const stack = createStack({
      webFrontend: ["next"],
      addons: ["electrobun"],
      webDeploy: "none",
    });

    expect(getDisabledReason(stack, "webDeploy", "docker")).toBe(
      "Docker cannot serve the static output required by electrobun on next",
    );
    expect(resolveStackCompatibility({ ...stack, webDeploy: "docker" }).stack.webDeploy).toBe(
      "none",
    );
  });

  test("keeps the CLI exception for Convex Better Auth with Next.js and Electrobun", () => {
    const stack = createStack({
      webFrontend: ["next"],
      backend: "convex",
      runtime: "none",
      database: "none",
      orm: "none",
      dbSetup: "none",
      api: "none",
      auth: "better-auth",
      addons: ["electrobun"],
      webDeploy: "docker",
    });

    expect(getDisabledReason(stack, "webDeploy", "docker")).toBeNull();
    expect(resolveStackCompatibility(stack).stack.webDeploy).toBe("docker");
  });
});

describe("stack builder Vercel deployment compatibility", () => {
  test("allows Vercel web deploy with a web frontend", () => {
    const stack = createStack({
      webFrontend: ["tanstack-router"],
      backend: "hono",
      runtime: "bun",
    });

    expect(getDisabledReason(stack, "webDeploy", "vercel")).toBeNull();

    const command = generateStackCommand({
      ...stack,
      webDeploy: "vercel",
    });
    expect(command).toContain("--web-deploy vercel");
  });

  test("allows Vercel server deploy on bun/node runtimes only", () => {
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

    expect(getDisabledReason(bunStack, "serverDeploy", "vercel")).toBeNull();
    expect(getDisabledReason(workersStack, "serverDeploy", "vercel")).toBe(
      "Vercel server deployment requires the Bun or Node runtime",
    );
  });

  test("switches Vercel server deploy to Cloudflare when runtime becomes workers", () => {
    const stack = createStack({
      backend: "hono",
      runtime: "workers",
      serverDeploy: "vercel",
      database: "sqlite",
      orm: "drizzle",
      dbSetup: "d1",
    });

    const result = analyzeStackCompatibility(stack);

    expect(result.adjustedStack).toMatchObject({
      serverDeploy: "cloudflare",
    });
  });

  test("clears Vercel server deploy for backends without a server app", () => {
    const stack = createStack({
      webFrontend: ["next"],
      backend: "self-next",
      runtime: "none",
      serverDeploy: "vercel",
    });

    const result = analyzeStackCompatibility(stack);

    expect(result.adjustedStack).toMatchObject({
      serverDeploy: "none",
    });
  });
});

describe("stack builder option parity", () => {
  test("exposes every CLI addon and deployment option", () => {
    expect(TECH_OPTIONS.addons.map((option) => option.id).sort()).toEqual(
      ADDONS_VALUES.filter((value) => value !== "none").sort(),
    );
    expect(TECH_OPTIONS.webDeploy.map((option) => option.id).sort()).toEqual(
      [...WEB_DEPLOY_VALUES].sort(),
    );
    expect(TECH_OPTIONS.serverDeploy.map((option) => option.id).sort()).toEqual(
      [...SERVER_DEPLOY_VALUES].sort(),
    );
  });
});

describe("stack builder Prisma deployment compatibility", () => {
  test("allows Prisma web deployment only for supported SSR frontends", () => {
    for (const frontend of [
      "next",
      "nuxt",
      "astro",
      "react-router",
      "tanstack-start",
      "svelte",
      "solid",
    ]) {
      expect(
        getDisabledReason(createStack({ webFrontend: [frontend] }), "webDeploy", "prisma"),
      ).toBeNull();
    }

    for (const frontend of ["tanstack-router"]) {
      expect(
        getDisabledReason(createStack({ webFrontend: [frontend] }), "webDeploy", "prisma"),
      ).toBe(
        "Prisma requires Next.js, Nuxt, Astro, React Router, TanStack Start, SvelteKit, or SolidStart",
      );
    }
  });

  test("blocks Prisma web deploy when desktop addons replace its server artifact", () => {
    const stack = createStack({
      webFrontend: ["react-router"],
      addons: ["tauri"],
      webDeploy: "none",
    });

    expect(getDisabledReason(stack, "webDeploy", "prisma")).toBe(
      "Prisma cannot deploy the static output required by tauri on react-router",
    );
    expect(resolveStackCompatibility({ ...stack, webDeploy: "prisma" }).stack.webDeploy).toBe(
      "none",
    );
  });

  test("generates Prisma web and server deployment flags", () => {
    const command = generateStackCommand(
      createStack({
        webFrontend: ["next"],
        backend: "hono",
        runtime: "bun",
        webDeploy: "prisma",
        serverDeploy: "prisma",
      }),
    );

    expect(command).toContain("--web-deploy prisma");
    expect(command).toContain("--server-deploy prisma");
  });

  test("requires Bun or Node for Prisma server deployment", () => {
    expect(
      getDisabledReason(createStack({ backend: "hono", runtime: "bun" }), "serverDeploy", "prisma"),
    ).toBeNull();
    expect(
      getDisabledReason(
        createStack({ backend: "hono", runtime: "workers" }),
        "serverDeploy",
        "prisma",
      ),
    ).toBe("Prisma server deployment requires the Bun or Node runtime");
  });

  test("repairs invalid Prisma deployment state", () => {
    expect(
      resolveStackCompatibility(
        createStack({ webFrontend: ["tanstack-router"], webDeploy: "prisma" }),
      ).stack.webDeploy,
    ).toBe("none");
    expect(
      resolveStackCompatibility(
        createStack({
          backend: "hono",
          runtime: "workers",
          serverDeploy: "prisma",
          database: "sqlite",
          orm: "drizzle",
          dbSetup: "d1",
        }),
      ).stack.serverDeploy,
    ).toBe("cloudflare");
  });

  test("blocks the known Next.js Cloudflare PostgreSQL conflict", () => {
    const postgresStack = createStack({
      webFrontend: ["next"],
      backend: "self-next",
      runtime: "none",
      database: "postgres",
      orm: "prisma",
      dbSetup: "none",
    });

    expect(getDisabledReason(postgresStack, "webDeploy", "cloudflare")).toBe(
      "This Prisma PostgreSQL setup with Next.js is temporarily unavailable on Cloudflare",
    );
  });
});
