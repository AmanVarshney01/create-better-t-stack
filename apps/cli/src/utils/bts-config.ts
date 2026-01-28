import type { BetterTStackConfig } from "@better-t-stack/types";

import fs from "fs-extra";
import { applyEdits, modify, parse } from "jsonc-parser";
import path from "node:path";

const BTS_CONFIG_FILE = "bts.jsonc";

/**
 * Reads the BTS configuration file from the project directory.
 */
export async function readBtsConfig(projectDir: string): Promise<BetterTStackConfig | null> {
  try {
    const configPath = path.join(projectDir, BTS_CONFIG_FILE);

    if (!(await fs.pathExists(configPath))) {
      return null;
    }

    const configContent = await fs.readFile(configPath, "utf-8");
    const config = parse(configContent) as BetterTStackConfig;
    return config;
  } catch {
    return null;
  }
}

/**
 * Updates specific fields in the BTS configuration file.
 */
export async function updateBtsConfig(
  projectDir: string,
  updates: Partial<Pick<BetterTStackConfig, "addons" | "webDeploy" | "serverDeploy">>,
): Promise<void> {
  try {
    const configPath = path.join(projectDir, BTS_CONFIG_FILE);

    if (!(await fs.pathExists(configPath))) {
      return;
    }

    let content = await fs.readFile(configPath, "utf-8");

    // Apply each update using jsonc-parser's modify (preserves comments)
    for (const [key, value] of Object.entries(updates)) {
      const edits = modify(content, [key], value, { formattingOptions: { tabSize: 2 } });
      content = applyEdits(content, edits);
    }

    await fs.writeFile(configPath, content, "utf-8");
  } catch {
    // Silent failure
  }
}
