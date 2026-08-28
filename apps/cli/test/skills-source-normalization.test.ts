import { describe, expect, it } from "bun:test";

import { normalizeSkillsOptions } from "../src/helpers/addons/skills-setup";
import { runWithContextAsync } from "../src/utils/context";

describe("normalizeSkillsOptions", () => {
  it("maps the renamed Next.js source and drops unknown sources", async () => {
    await runWithContextAsync({ silent: true }, async () => {
      const normalized = normalizeSkillsOptions({
        scope: "project",
        // Older bts.jsonc files bypass schema validation and can still carry retired sources.
        selections: [
          { source: "vercel-labs/next-skills" as never, skills: ["next-dev-loop"] },
          { source: "vercel/ai", skills: ["ai-sdk"] },
          { source: "gone/repo" as never, skills: ["x"] },
        ],
      });

      expect(normalized?.selections).toEqual([
        { source: "vercel/next.js", skills: ["next-dev-loop"] },
        { source: "vercel/ai", skills: ["ai-sdk"] },
      ]);
    });
  });

  it("passes options without selections through unchanged", () => {
    expect(normalizeSkillsOptions(undefined)).toBeUndefined();
    expect(normalizeSkillsOptions({ scope: "global" })).toEqual({ scope: "global" });
  });
});
