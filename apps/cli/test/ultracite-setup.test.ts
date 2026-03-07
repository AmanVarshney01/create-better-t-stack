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

  it("passes integrations as separate values and includes lint-staged with husky", () => {
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
    expect(args[integrationsIndex + 1]).toBe("husky");
    expect(args.slice(integrationsIndex + 1, integrationsIndex + 4)).toEqual([
      "husky",
      "lefthook",
      "lint-staged",
    ]);
    expect(args).not.toContain("husky lefthook");
  });
});
