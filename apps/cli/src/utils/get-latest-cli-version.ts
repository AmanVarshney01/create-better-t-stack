/**
 * Get CLI version
 * For compiled binaries, version is embedded at build time via CLI_VERSION define.
 * For npm distribution, it falls back to reading package.json.
 */
import path from "node:path";
import fs from "fs-extra";
import { PKG_ROOT } from "../constants";

// This is replaced at compile time by bun build --define
declare const CLI_VERSION: string | undefined;

export const getLatestCLIVersion = (): string => {
  // Check if version was embedded at compile time
  if (typeof CLI_VERSION !== "undefined") {
    return CLI_VERSION;
  }

  // Fallback to reading package.json (for npm distribution)
  try {
    const packageJsonPath = path.join(PKG_ROOT, "package.json");
    const packageJsonContent = fs.readJSONSync(packageJsonPath);
    return packageJsonContent.version ?? "1.0.0";
  } catch {
    return "1.0.0";
  }
};
