import { describe, expect, it } from "bun:test";
import { PassThrough } from "node:stream";
import { stripVTControlCharacters } from "node:util";

import { navigableGroupMultiselect, resolveExclusiveSelection } from "../src/prompts/navigable";
import { runWithContextAsync } from "../src/utils/context";

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

describe("navigableGroupMultiselect exclusive sets", () => {
  it("deselects the other task runner when space selects a new one", async () => {
    const input = new PassThrough();
    const output = Object.assign(new PassThrough(), { columns: 80, rows: 30 });
    let rendered = "";
    output.on("data", (chunk) => (rendered += chunk));

    const resultPromise = runWithContextAsync({}, () =>
      navigableGroupMultiselect<string>({
        message: "Pick addons",
        options: {
          "Monorepo & Tasks": [
            { value: "turborepo", label: "Turborepo" },
            { value: "nx", label: "Nx" },
            { value: "vite-plus", label: "Vite+" },
          ],
          "Code Quality": [{ value: "biome", label: "Biome" }],
        },
        initialValues: ["biome"],
        required: false,
        exclusive: [TASK_RUNNERS],
        input,
        output,
      }),
    );

    const press = async (key: string) => {
      input.write(key);
      await new Promise((resolve) => setTimeout(resolve, 20));
    };
    const down = "\x1b[B";
    await press(down);
    await press(" ");
    await press(down);
    await press(" ");
    await press("\r");

    expect(await resultPromise).toEqual(["biome", "nx"]);
    const plain = stripVTControlCharacters(rendered);
    expect(plain).toContain("Monorepo & Tasks (choose one)");
    expect(plain).toContain("● Nx");
  });
});
