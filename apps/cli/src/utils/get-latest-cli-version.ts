import path from "node:path";

import { Result } from "better-result";
import fs from "fs-extra";

import { PKG_ROOT } from "../constants";
import { CLIError } from "./errors";

export function getLatestCLIVersionResult(): Result<string, CLIError> {
  const packageJsonPath = path.join(PKG_ROOT, "package.json");

  return Result.try({
    try: () => {
      const packageJsonContent = fs.readJSONSync(packageJsonPath);
      return String(packageJsonContent.version ?? "1.0.0");
    },
    catch: (e) =>
      new CLIError({
        message: `Failed to read CLI version from package.json: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });
}

export function getLatestCLIVersion(): string {
  return getLatestCLIVersionResult().unwrapOr("1.0.0");
}
