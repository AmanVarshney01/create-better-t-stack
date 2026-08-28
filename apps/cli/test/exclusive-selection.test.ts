import { describe, expect, it } from "bun:test";

import { resolveExclusiveSelection } from "../src/prompts/navigable";

const TASK_RUNNERS = ["turborepo", "nx", "vite-plus"] as const;

describe("resolveExclusiveSelection", () => {
  it("drops the other members of a set when a new one is selected", () => {
    expect(
      resolveExclusiveSelection(
        ["turborepo", "biome"],
        ["turborepo", "biome", "nx"],
        [TASK_RUNNERS],
      ),
    ).toEqual(["biome", "nx"]);
  });

  it("keeps a single member when a whole exclusive group is toggled on", () => {
    expect(
      resolveExclusiveSelection(
        ["biome"],
        ["biome", "turborepo", "nx", "vite-plus"],
        [TASK_RUNNERS],
      ),
    ).toEqual(["biome", "turborepo"]);
  });

  it("leaves deselection and unrelated values untouched", () => {
    expect(resolveExclusiveSelection(["nx", "biome"], ["biome"], [TASK_RUNNERS])).toEqual([
      "biome",
    ]);
    expect(resolveExclusiveSelection(["nx"], ["nx", "husky"], [TASK_RUNNERS])).toEqual([
      "nx",
      "husky",
    ]);
  });
});
