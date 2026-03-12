import consola from "consola";

import { describe, expect, it } from "bun:test";

import type { CompatibilityInput, ProjectConfig } from "../src/types";

import {
  analyzeStackCompatibility,
  getCapabilityDefinitions,
  getCapabilityDisabledReason,
  getSupportedCapabilityOptions,
  normalizeCapabilitySelection,
} from "../src/types";
import { validateEcosystemAuthCompatibility } from "../src/utils/config-validation";

function createTypeScriptStack(
  overrides: Partial<CompatibilityInput> = {},
): CompatibilityInput {
  return {
    ecosystem: "typescript",
    projectName: "auth-matrix",
    webFrontend: ["tanstack-router"],
    nativeFrontend: ["none"],
    astroIntegration: "none",
    runtime: "bun",
    backend: "hono",
    database: "sqlite",
    orm: "drizzle",
    dbSetup: "none",
    auth: "better-auth",
    payments: "none",
    email: "none",
    fileUpload: "none",
    logging: "none",
    observability: "none",
    featureFlags: "none",
    analytics: "none",
    backendLibraries: "none",
    stateManagement: "none",
    forms: "react-hook-form",
    validation: "zod",
    testing: "vitest",
    realtime: "none",
    jobQueue: "none",
    caching: "none",
    animation: "none",
    cssFramework: "tailwind",
    uiLibrary: "none",
    cms: "none",
    search: "none",
    fileStorage: "none",
    codeQuality: [],
    documentation: [],
    appPlatforms: [],
    packageManager: "bun",
    examples: [],
    aiSdk: "none",
    aiDocs: [],
    git: "false",
    install: "false",
    api: "trpc",
    webDeploy: "none",
    serverDeploy: "none",
    yolo: "false",
    rustWebFramework: "none",
    rustFrontend: "none",
    rustOrm: "none",
    rustApi: "none",
    rustCli: "none",
    rustLibraries: "none",
    pythonWebFramework: "none",
    pythonOrm: "none",
    pythonValidation: "none",
    pythonAi: "none",
    pythonTaskQueue: "none",
    pythonQuality: "none",
    goWebFramework: "none",
    goOrm: "none",
    goApi: "none",
    goCli: "none",
    goLogging: "none",
    ...overrides,
  };
}

describe("Auth capability matrix", () => {
  it("shares auth metadata including GoBetterAuth", () => {
    const definitions = getCapabilityDefinitions("auth");

    expect(definitions.map((definition) => definition.id)).toContain("go-better-auth");
    expect(definitions.find((definition) => definition.id === "go-better-auth")).toMatchObject({
      label: "GoBetterAuth",
      description: "Embedded auth routes for Go applications",
    });
  });

  it("returns only GoBetterAuth and none for Go stacks", () => {
    const options = getSupportedCapabilityOptions("auth", {
      ecosystem: "go",
    });

    expect(options.map((option) => option.id)).toEqual(["go-better-auth", "none"]);
  });

  it("normalizes unsupported auth providers on Go stacks", () => {
    const result = normalizeCapabilitySelection(
      "auth",
      {
        ecosystem: "go",
      },
      "better-auth",
    );

    expect(result.normalized).toBe(true);
    expect(result.value).toBe("none");
    expect(result.reason).toBe("Go stacks currently support GoBetterAuth only");
  });

  it("normalizes auth providers to none for Rust and Python stacks", () => {
    for (const ecosystem of ["rust", "python"] as const) {
      const result = normalizeCapabilitySelection(
        "auth",
        {
          ecosystem,
        },
        "better-auth",
      );

      expect(result.normalized).toBe(true);
      expect(result.value).toBe("none");
      expect(result.reason).toContain(
        ecosystem === "rust" ? "Rust stacks do not support auth integrations yet" : "Python stacks do not support auth integrations yet",
      );
    }
  });

  it("keeps Next.js-only auth providers gated by backend and frontend", () => {
    expect(
      getCapabilityDisabledReason(
        "auth",
        {
          ecosystem: "typescript",
          backend: "self",
          frontend: ["next"],
        },
        "nextauth",
      ),
    ).toBeNull();

    expect(
      getCapabilityDisabledReason(
        "auth",
        {
          ecosystem: "typescript",
          backend: "self",
          frontend: ["tanstack-start"],
        },
        "nextauth",
      ),
    ).toBe("In Better-Fullstack, Auth.js (NextAuth) currently requires the Next.js frontend");
  });

  it("normalizes unsupported auth selections during shared compatibility analysis", () => {
    const result = analyzeStackCompatibility(
      createTypeScriptStack({
        backend: "self-tanstack-start",
        webFrontend: ["tanstack-start"],
        runtime: "none",
        auth: "nextauth",
      }),
    );

    expect(result.adjustedStack?.auth).toBe("none");
    expect(result.changes.some((adjustment) => adjustment.category === "auth")).toBe(true);
  });

  it("rejects go-better-auth on TypeScript stacks", () => {
    expect(
      getCapabilityDisabledReason(
        "auth",
        { ecosystem: "typescript", backend: "hono", frontend: ["tanstack-router"] },
        "go-better-auth",
      ),
    ).toBe("GoBetterAuth is available only for Go stacks");
  });

  it("rejects go-better-auth on Rust and Python stacks", () => {
    for (const ecosystem of ["rust", "python"] as const) {
      expect(
        getCapabilityDisabledReason(
          "auth",
          { ecosystem },
          "go-better-auth",
        ),
      ).toBe("GoBetterAuth is available only for Go stacks");
    }
  });

  it("normalizes go-better-auth to none on TypeScript stacks", () => {
    const result = normalizeCapabilitySelection(
      "auth",
      { ecosystem: "typescript", backend: "hono", frontend: ["tanstack-router"] },
      "go-better-auth",
    );

    expect(result.normalized).toBe(true);
    expect(result.value).toBe("none");
    expect(result.reason).toBe("GoBetterAuth is available only for Go stacks");
  });

  it("passes through valid auth selections unchanged", () => {
    const result = normalizeCapabilitySelection(
      "auth",
      { ecosystem: "typescript", backend: "hono", frontend: ["tanstack-router"] },
      "better-auth",
    );

    expect(result.normalized).toBe(false);
    expect(result.value).toBe("better-auth");
    expect(result.reason).toBeNull();
  });

  it("passes through undefined and none inputs without normalization", () => {
    const noneResult = normalizeCapabilitySelection(
      "auth",
      { ecosystem: "typescript", backend: "hono" },
      "none",
    );
    expect(noneResult.normalized).toBe(false);
    expect(noneResult.value).toBe("none");

    const undefinedResult = normalizeCapabilitySelection(
      "auth",
      { ecosystem: "typescript", backend: "hono" },
      undefined,
    );
    expect(undefinedResult.normalized).toBe(false);
    expect(undefinedResult.value).toBe("none");
  });

  it("returns 'No backend selected' when backend is none", () => {
    expect(
      getCapabilityDisabledReason(
        "auth",
        { ecosystem: "typescript", backend: "none", frontend: ["tanstack-router"] },
        "better-auth",
      ),
    ).toBe("No backend selected");
  });

  it("disables better-auth on Convex with incompatible frontend", () => {
    expect(
      getCapabilityDisabledReason(
        "auth",
        { ecosystem: "typescript", backend: "convex", frontend: ["svelte"] },
        "better-auth",
      ),
    ).toBe(
      "Better-Auth with Convex requires React + Vite, TanStack Router, TanStack Start, Next.js, or React Native",
    );
  });

  it("disables Clerk on self backend with unsupported frameworks", () => {
    const selfCases = [
      { backend: "self-astro", frontend: ["astro"], match: "Astro" },
      { backend: "self-nuxt", frontend: ["nuxt"], match: "Nuxt" },
      { backend: "self-svelte", frontend: ["svelte"], match: "SvelteKit" },
      { backend: "self-solid-start", frontend: ["solid-start"], match: "SolidStart" },
    ] as const;

    for (const { backend, frontend, match } of selfCases) {
      const reason = getCapabilityDisabledReason(
        "auth",
        { ecosystem: "typescript", backend, frontend },
        "clerk",
      );
      expect(reason).toContain(match);
      expect(reason).toContain("not yet supported");
    }
  });

  it("warns and normalizes explicit unsupported auth flags in CLI validation", () => {
    const config: Partial<ProjectConfig> = {
      ecosystem: "typescript",
      backend: "self",
      frontend: ["tanstack-start"],
      auth: "nextauth",
    };
    const warnings: string[] = [];
    const mutableConsola = consola as typeof consola & {
      warn: (...args: unknown[]) => void;
    };
    const originalWarn = mutableConsola.warn;

    mutableConsola.warn = (...args: unknown[]) => {
      warnings.push(args.map((arg) => String(arg)).join(" "));
    };

    try {
      validateEcosystemAuthCompatibility(config, new Set(["auth"]));
    } finally {
      mutableConsola.warn = originalWarn;
    }

    expect(config.auth).toBe("none");
    expect(warnings.some((warning) => warning.includes("Unsupported auth selection 'nextauth'"))).toBe(
      true,
    );
  });
});
