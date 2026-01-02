import type { PackageManager } from "../types";

export const getUserPkgManager: () => PackageManager = () => {
  const userAgent = process.env.npm_config_user_agent;

  if (userAgent?.startsWith("pnpm")) {
    return "pnpm";
  }
  if (userAgent?.startsWith("bun")) {
    return "bun";
  }
  return "npm";
};
