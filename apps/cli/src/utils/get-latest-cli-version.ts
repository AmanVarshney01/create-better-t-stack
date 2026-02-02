import fs from "fs-extra";
import path from "node:path";

import { PKG_ROOT } from "../constants";

export const getLatestCLIVersion = () => {
  const packageJsonPath = path.join(PKG_ROOT, "package.json");

  try {
    const packageJsonContent = fs.readJSONSync(packageJsonPath);
    return packageJsonContent.version ?? "1.0.0";
  } catch {
    return "1.0.0";
  }
};
