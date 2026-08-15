import type { DatabaseSetup, Frontend, ProjectConfig, ServerDeploy, WebDeploy } from "./types";

export const ALCHEMY_DEPLOY_TARGETS = ["cloudflare", "prisma"] as const;

export const ALCHEMY_DATABASE_SETUPS = ["neon", "planetscale", "prisma-postgres"] as const;

export type LocalD1Owner = "wrangler" | "alchemy-provider" | "none";

const WRANGLER_LOCAL_D1_FRONTENDS = [
  "next",
  "svelte",
  "solid",
] as const satisfies readonly Frontend[];
const ALCHEMY_PROVIDER_LOCAL_D1_FRONTENDS = [
  "nuxt",
  "astro",
] as const satisfies readonly Frontend[];

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

type AlchemyDatabaseConfig = Pick<
  ProjectConfig,
  "backend" | "dbSetup" | "dbSetupOptions" | "webDeploy" | "serverDeploy"
>;

export function supportsAlchemyManagedDatabase(config: AlchemyDatabaseConfig): boolean {
  if (!isAlchemyDatabaseSetup(config.dbSetup)) return false;

  return config.backend === "self"
    ? isAlchemyDeployTarget(config.webDeploy)
    : isAlchemyDeployTarget(config.serverDeploy);
}

export function usesAlchemyManagedDatabase(config: AlchemyDatabaseConfig): boolean {
  if (!supportsAlchemyManagedDatabase(config)) return false;

  const mode = config.dbSetupOptions?.mode;
  return mode === undefined || mode === "alchemy";
}

export function getLocalD1Owner(
  config: Pick<ProjectConfig, "backend" | "dbSetup" | "frontend" | "webDeploy">,
): LocalD1Owner {
  if (config.backend !== "self" || config.dbSetup !== "d1" || config.webDeploy !== "cloudflare") {
    return "none";
  }

  if (WRANGLER_LOCAL_D1_FRONTENDS.some((framework) => config.frontend.includes(framework))) {
    return "wrangler";
  }

  if (
    ALCHEMY_PROVIDER_LOCAL_D1_FRONTENDS.some((framework) => config.frontend.includes(framework))
  ) {
    return "alchemy-provider";
  }

  return "none";
}
