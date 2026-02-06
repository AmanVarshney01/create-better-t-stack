import type { ProjectConfig } from "@better-t-stack/types";

export type DbScriptSupport = {
  hasDbScripts: boolean;
  hasDbPush: boolean;
  hasDbGenerate: boolean;
  hasDbMigrate: boolean;
  hasDbStudio: boolean;
  isD1Alchemy: boolean;
};

export function getDbScriptSupport(config: ProjectConfig): DbScriptSupport {
  const isD1Alchemy = config.dbSetup === "d1" && config.serverDeploy === "cloudflare";
  const hasDbScripts =
    config.backend !== "convex" &&
    config.backend !== "none" &&
    config.database !== "none" &&
    config.orm !== "none" &&
    config.orm !== "mongoose";

  if (!hasDbScripts) {
    return {
      hasDbScripts: false,
      hasDbPush: false,
      hasDbGenerate: false,
      hasDbMigrate: false,
      hasDbStudio: false,
      isD1Alchemy,
    };
  }

  const hasDbMigrate = config.orm === "prisma" || (config.orm === "drizzle" && !isD1Alchemy);
  const hasDbStudio = !isD1Alchemy;

  return {
    hasDbScripts: true,
    hasDbPush: true,
    hasDbGenerate: true,
    hasDbMigrate,
    hasDbStudio,
    isD1Alchemy,
  };
}
