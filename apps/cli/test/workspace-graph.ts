import { expect } from "bun:test";
import { join } from "node:path";

import fs from "fs-extra";
import { parse } from "yaml";
import { z } from "zod";

const versions = z.record(z.string(), z.string());
const catalogsSchema = z.object({
  catalog: versions.optional(),
  catalogs: z.record(z.string(), versions).optional(),
});
const packageSchema = z.object({
  name: z.string().min(1),
  dependencies: versions.optional(),
  devDependencies: versions.optional(),
  optionalDependencies: versions.optional(),
  workspaces: z.union([z.array(z.string()), catalogsSchema]).optional(),
});

export async function assertWorkspaceGraph(projectDir: string) {
  const manifests = new Map<string, z.infer<typeof packageSchema>>();
  manifests.set(
    "package.json",
    packageSchema.parse(await fs.readJson(join(projectDir, "package.json"))),
  );
  for (const root of ["apps", "packages"]) {
    const directory = join(projectDir, root);
    if (!(await fs.pathExists(directory))) continue;
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const relativePath = `${root}/${entry.name}/package.json`;
      if (entry.isDirectory() && (await fs.pathExists(join(projectDir, relativePath)))) {
        manifests.set(
          relativePath,
          packageSchema.parse(await fs.readJson(join(projectDir, relativePath))),
        );
      }
    }
  }

  const names = new Set([...manifests.values()].map((pkg) => pkg.name));
  expect(names.size, "Generated workspace package names must be unique").toBe(manifests.size);
  const workspaces = manifests.get("package.json")!.workspaces;
  const pnpmPath = join(projectDir, "pnpm-workspace.yaml");
  const catalogs = catalogsSchema.parse(
    (await fs.pathExists(pnpmPath))
      ? parse(await fs.readFile(pnpmPath, "utf8"))
      : Array.isArray(workspaces)
        ? {}
        : (workspaces ?? {}),
  );

  for (const [file, pkg] of manifests) {
    for (const [name, version] of Object.entries({
      ...pkg.dependencies,
      ...pkg.devDependencies,
      ...pkg.optionalDependencies,
    })) {
      if (version.startsWith("workspace:")) {
        expect(names.has(name), `${file}: missing workspace dependency ${name}`).toBe(true);
      }
      if (version.startsWith("catalog:")) {
        const catalogName = version.slice("catalog:".length);
        const catalog = catalogName ? catalogs.catalogs?.[catalogName] : catalogs.catalog;
        expect(catalog?.[name], `${file}: missing catalog entry ${version}${name}`).toBeDefined();
      }
    }
  }
}
