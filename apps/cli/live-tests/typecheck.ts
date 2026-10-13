import { readFile, readdir } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

import type { ProjectConfig } from "@better-t-stack/types";
import { z } from "zod";

import type { Commands } from "./command";

export async function checkDeployedProjectTypes(
  project: string,
  packageManager: ProjectConfig["packageManager"],
  commands: Commands,
) {
  for (const group of ["packages", "apps"]) {
    for (const entry of await readdir(path.join(project, group), { withFileTypes: true })) {
      if (!entry.isDirectory() || (group === "apps" && entry.name === "web")) continue;
      const workspace = path.join(project, group, entry.name);
      const pkg = z
        .object({ scripts: z.record(z.string(), z.string()).optional() })
        .parse(JSON.parse(await readFile(path.join(workspace, "package.json"), "utf8")));
      if (pkg.scripts?.["check-types"])
        await commands.run(`check-types-${group}-${entry.name}`, workspace, packageManager, [
          "run",
          "check-types",
        ]);
    }
  }
  // Alchemy's build already generated Start's routes using the provisioned environment.
  const webDirectory = path.join(project, "apps/web");
  const require = createRequire(path.join(webDirectory, "package.json"));
  await commands.run("check-types-web", webDirectory, "node", [
    require.resolve("typescript/bin/tsc"),
    "--noEmit",
  ]);
}
