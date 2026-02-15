import fs from "fs-extra";
import path from "node:path";

import type { ExternalAddonStepReport } from "./types";

export type ExternalAddonManifest = {
  generatedAt: string;
  reports: ExternalAddonStepReport[];
};

export async function writeExternalAddonManifest(
  projectDir: string,
  reports: ExternalAddonStepReport[],
): Promise<void> {
  if (reports.length === 0) {
    return;
  }

  const manifest: ExternalAddonManifest = {
    generatedAt: new Date().toISOString(),
    reports,
  };

  const btsDir = path.join(projectDir, ".bts");
  await fs.ensureDir(btsDir);
  await fs.writeJson(path.join(btsDir, "external-manifest.json"), manifest, { spaces: 2 });
}
