import path from "node:path";

import type { CreateJSStackConfig } from "@create-js-stack/types";
import fs from "fs-extra";
import { applyEdits, modify, parse } from "jsonc-parser";

const CJS_CONFIG_FILE = "cjs.jsonc";

/**
 * Reads the Create JS Stack configuration file from the project directory.
 */
export async function readCjsConfig(projectDir: string): Promise<CreateJSStackConfig | null> {
  try {
    const configPath = path.join(projectDir, CJS_CONFIG_FILE);

    if (!(await fs.pathExists(configPath))) {
      return null;
    }

    const configContent = await fs.readFile(configPath, "utf-8");
    const config = parse(configContent) as CreateJSStackConfig;
    return config;
  } catch {
    return null;
  }
}

/**
 * Updates specific fields in the Create JS Stack configuration file.
 */
export async function updateCjsConfig(
  projectDir: string,
  updates: Partial<
    Pick<
      CreateJSStackConfig,
      "addons" | "addonOptions" | "dbSetupOptions" | "webDeploy" | "serverDeploy"
    >
  >,
): Promise<void> {
  try {
    const configPath = path.join(projectDir, CJS_CONFIG_FILE);

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
