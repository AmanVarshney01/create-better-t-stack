import type { Backend, DatabaseSetup, ServerDeploy, WebDeploy } from "./types";

export const ALCHEMY_DEPLOY_TARGETS = ["cloudflare", "prisma"] as const;

export const ALCHEMY_DATABASE_SETUPS = ["neon", "planetscale", "prisma-postgres"] as const;

export function isAlchemyDeployTarget(
  target: WebDeploy | ServerDeploy | undefined,
): target is (typeof ALCHEMY_DEPLOY_TARGETS)[number] {
  return ALCHEMY_DEPLOY_TARGETS.some((value) => value === target);
}

export function isAlchemyDatabaseSetup(
  setup: DatabaseSetup | undefined,
): setup is (typeof ALCHEMY_DATABASE_SETUPS)[number] {
  return ALCHEMY_DATABASE_SETUPS.some((value) => value === setup);
}

export function usesAlchemyManagedDatabase(config: {
  backend: Backend;
  dbSetup: DatabaseSetup;
  webDeploy: WebDeploy;
  serverDeploy: ServerDeploy;
}): boolean {
  if (!isAlchemyDatabaseSetup(config.dbSetup)) return false;

  return config.backend === "self"
    ? isAlchemyDeployTarget(config.webDeploy)
    : isAlchemyDeployTarget(config.serverDeploy);
}
