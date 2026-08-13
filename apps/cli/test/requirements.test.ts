import { describe, expect, it } from "bun:test";

import type { ProjectConfig } from "../src/types";
import {
  PACKAGE_MANAGER_VERSION_RANGES,
  RECOMMENDED_BUN_VERSION_RANGE,
  getLocalVersionRequirements,
  getLocalToolRecommendations,
  validateLocalToolVersions,
} from "../src/utils/requirements";

type RequirementConfig = Pick<
  ProjectConfig,
  | "addonOptions"
  | "addons"
  | "backend"
  | "examples"
  | "frontend"
  | "orm"
  | "packageManager"
  | "runtime"
  | "serverDeploy"
  | "webDeploy"
>;

function config(overrides: Partial<RequirementConfig> = {}): RequirementConfig {
  return {
    addonOptions: undefined,
    addons: [],
    backend: "none",
    examples: [],
    frontend: ["tanstack-router"],
    orm: "none",
    packageManager: "bun",
    runtime: "none",
    serverDeploy: "none",
    webDeploy: "none",
    ...overrides,
  };
}

describe("local tool requirements", () => {
  it("tracks the package-manager features emitted by generated projects", () => {
    expect(PACKAGE_MANAGER_VERSION_RANGES).toEqual({
      bun: ">=1.2.14",
      npm: ">=11.16.0",
      pnpm: ">=10.26.0",
    });
    expect(RECOMMENDED_BUN_VERSION_RANGE).toBe(">=1.3.0");
  });

  it("recommends Bun 1.3 without rejecting the catalog-compatible minimum", () => {
    const project = config();

    expect(getLocalToolRecommendations(project, { bun: "1.2.14" })).toEqual([
      "Bun 1.2.14 meets the minimum requirement, but Bun 1.3 or newer is recommended. Run `bun upgrade`.",
    ]);
    expect(getLocalToolRecommendations(project, { bun: "1.3.0" })).toEqual([]);
  });

  it.each([
    ["bun", "1.2.13", "1.2.14"],
    ["npm", "11.15.0", "11.16.0"],
    ["pnpm", "10.25.0", "10.26.0"],
  ] as const)("rejects an old %s and accepts the minimum", (packageManager, old, minimum) => {
    const project = config({ packageManager });
    const oldResult = validateLocalToolVersions(
      project,
      { [packageManager]: old, node: "24.11.0" },
      "bun",
    );
    const minimumResult = validateLocalToolVersions(
      project,
      { [packageManager]: minimum, node: "24.11.0" },
      "bun",
    );

    expect(oldResult.isErr()).toBe(true);
    expect(oldResult.isErr() ? oldResult.error.message : "").toContain(old);
    expect(minimumResult.isOk()).toBe(true);
  });

  it("requires Node 22 for the Node-hosted CLI", () => {
    const result = validateLocalToolVersions(config(), { bun: "1.2.14", node: "v21.7.3" }, "node");

    expect(result.isErr()).toBe(true);
    expect(result.isErr() ? result.error.message : "").toContain("create-better-t-stack");
  });

  it("does not require Node tooling when Bun owns the install and runtime", () => {
    const requirements = getLocalVersionRequirements(config({ frontend: ["solid"] }), "bun");

    expect(requirements).toEqual([
      {
        tool: "bun",
        range: ">=1.2.14",
        reason: "generated Bun workspaces use dependency catalogs",
      },
    ]);
  });

  it.each([
    ["astro", "22.11.0", "22.12.0", "Astro 7"],
    ["react-router", "22.21.0", "22.22.0", "React Router 8"],
    ["solid", "23.11.0", "24.0.0", "Solid"],
    ["native-bare", "22.12.0", "22.13.0", "React Native 0.86"],
  ] as const)(
    "checks the %s Node requirement",
    (frontend, unsupportedVersion, supportedVersion, reason) => {
      const project = config({ frontend: [frontend], packageManager: "npm" });
      const unsupported = validateLocalToolVersions(
        project,
        { npm: "11.16.0", node: unsupportedVersion },
        "node",
      );
      const supported = validateLocalToolVersions(
        project,
        { npm: "11.16.0", node: supportedVersion },
        "node",
      );

      expect(unsupported.isErr()).toBe(true);
      expect(unsupported.isErr() ? unsupported.error.message : "").toContain(reason);
      expect(supported.isOk()).toBe(true);
    },
  );

  it("honors Nuxt's supported Node release lines", () => {
    const project = config({ frontend: ["nuxt"], packageManager: "pnpm" });

    for (const version of ["22.19.0", "24.11.0", "26.0.0"]) {
      expect(
        validateLocalToolVersions(project, { pnpm: "10.26.0", node: version }, "node").isOk(),
      ).toBe(true);
    }

    for (const version of ["22.18.0", "23.11.0", "24.10.0", "25.1.0"]) {
      expect(
        validateLocalToolVersions(project, { pnpm: "10.26.0", node: version }, "node").isErr(),
      ).toBe(true);
    }
  });

  it("combines backend and addon requirements", () => {
    const project = config({
      addons: ["husky", "vite-plus"],
      backend: "hono",
      frontend: [],
      packageManager: "npm",
      runtime: "node",
    });
    const result = validateLocalToolVersions(project, { npm: "11.16.0", node: "22.22.0" }, "node");

    expect(result.isErr()).toBe(true);
    expect(result.isErr() ? result.error.message : "").toContain("lint-staged 17");
    expect(
      validateLocalToolVersions(project, { npm: "11.16.0", node: "24.11.0" }, "node").isOk(),
    ).toBe(true);
  });

  it.each([
    [{ examples: ["ai"] }, "21.7.0", "22.0.0", "AI SDK 7"],
    [{ orm: "mongoose" }, "20.18.0", "20.19.0", "Mongoose 9 and MongoDB 7"],
    [{ addons: ["oxlint"] }, "20.18.0", "20.19.0", "Oxlint and Oxfmt"],
    [
      { addons: ["ultracite"], addonOptions: { ultracite: { linter: "oxlint" } } },
      "20.18.0",
      "20.19.0",
      "Oxlint and Oxfmt",
    ],
  ] satisfies Array<[Partial<RequirementConfig>, string, string, string]>)(
    "checks dependency runtime requirements for %#",
    (overrides, old, minimum, reason) => {
      const project = config({ ...overrides, frontend: [], packageManager: "npm" });
      const unsupported = validateLocalToolVersions(project, { npm: "11.16.0", node: old }, "bun");
      const supported = validateLocalToolVersions(
        project,
        { npm: "11.16.0", node: minimum },
        "bun",
      );

      expect(unsupported.isErr()).toBe(true);
      expect(unsupported.isErr() ? unsupported.error.message : "").toContain(reason);
      expect(supported.isOk()).toBe(true);
    },
  );

  it("reports a missing selected package manager with upgrade guidance", () => {
    const result = validateLocalToolVersions(config({ packageManager: "pnpm" }), {}, "bun");

    expect(result.isErr()).toBe(true);
    expect(result.isErr() ? result.error.message : "").toContain("pnpm is not available");
    expect(result.isErr() ? result.error.message : "").toContain("pnpm self-update");
  });
});
