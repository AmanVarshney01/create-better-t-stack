import { describe, expect, it } from "bun:test";

import { buildUltraciteInitArgs } from "../src/helpers/addons/ultracite-setup";

describe("Ultracite setup", () => {
  it("omits optional flags when editors, agents, and hooks are empty", () => {
    const args = buildUltraciteInitArgs({
      packageManager: "bun",
      linter: "biome",
      frameworks: ["react"],
      editors: [],
      agents: [],
      hooks: [],
      gitHooks: [],
    });

    expect(args).toContain("--frameworks");
    expect(args).not.toContain("--editors");
    expect(args).not.toContain("--agents");
    expect(args).not.toContain("--hooks");
    expect(args).toContain("--skip-install");
    expect(args).toContain("--quiet");
  });

  it("passes integrations as a single value and keeps lint-staged separate for husky", () => {
    const args = buildUltraciteInitArgs({
      packageManager: "bun",
      linter: "biome",
      frameworks: ["react"],
      editors: [],
      agents: [],
      hooks: [],
      gitHooks: ["husky", "lefthook"],
    });

    const integrationsIndex = args.indexOf("--integrations");

    expect(integrationsIndex).toBeGreaterThan(-1);
    expect(args[integrationsIndex + 1]).toBe("husky lefthook");
    expect(args).toContain("lint-staged");
  });
});
