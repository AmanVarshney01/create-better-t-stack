import { expect, it } from "bun:test";
import { link, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { formatProject } from "../src/utils/file-formatter";
import { SMOKE_DIR } from "./setup";

it("formats source without touching installed dependencies, linked caches, or build output", async () => {
  const projectDir = join(SMOKE_DIR, "format-existing-project");
  const dependency = "export const dependency={preserve:  true};\n";
  const cacheFile = join(SMOKE_DIR, "package-cache.js");
  await writeFile(cacheFile, dependency);
  await mkdir(join(projectDir, "apps/web/node_modules/example"), { recursive: true });
  const installed = join(projectDir, "apps/web/node_modules/example/index.js");
  await link(cacheFile, installed);
  const sourceFile = join(projectDir, "apps/web/source.ts");
  await writeFile(sourceFile, "export const value={answer:42};\n");
  const outputs = [".git", ".next", ".output", "dist", "build"].map((dir) =>
    join(projectDir, dir, "generated.js"),
  );
  for (const file of outputs) {
    await mkdir(join(file, ".."), { recursive: true });
    await writeFile(file, dependency);
  }

  expect((await formatProject(projectDir)).isOk()).toBe(true);
  expect(await readFile(sourceFile, "utf8")).toContain("{ answer: 42 }");
  for (const file of [installed, cacheFile, ...outputs]) {
    expect(await readFile(file, "utf8")).toBe(dependency);
  }
});
