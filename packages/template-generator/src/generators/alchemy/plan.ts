import {
  isAlchemyDeployTarget,
  usesAlchemyManagedDatabase,
  webFrontends,
  type Frontend,
  type ProjectConfig,
  type WebFrontend,
} from "@better-t-stack/types";

export type DeployedWebFramework = Exclude<WebFrontend, "none">;

export type ManagedDatabasePlan =
  | { kind: "none" }
  | { kind: "neon"; orm: "drizzle" | "prisma" }
  | {
      kind: "planetscale-postgres";
      orm: "drizzle" | "prisma";
    }
  | {
      kind: "planetscale-mysql";
      orm: "drizzle" | "prisma";
    }
  | {
      kind: "prisma-postgres";
      orm: "drizzle" | "prisma";
    };

export type AlchemyWebPlan =
  | { target: "none" }
  | {
      target: "cloudflare" | "prisma";
      framework: DeployedWebFramework;
      topology: "self" | "split";
    };

export type AlchemyServerPlan = { target: "none" } | { target: "cloudflare" | "prisma" };

export type AlchemyDeploymentPlan = {
  config: ProjectConfig;
  managedDatabase: ManagedDatabasePlan;
  web: AlchemyWebPlan;
  server: AlchemyServerPlan;
  hasCloudflare: boolean;
  hasPrismaDeploy: boolean;
  hasAlchemyManagedDatabase: boolean;
  hasD1Resource: boolean;
};

function isDeployedWebFramework(frontend: Frontend): frontend is DeployedWebFramework {
  return (webFrontends as readonly Frontend[]).includes(frontend);
}

function getDeployedWebFramework(config: ProjectConfig): DeployedWebFramework {
  const framework = config.frontend.find(isDeployedWebFramework);

  if (!framework) {
    throw new Error(
      `Alchemy web deployment requires a web framework, received: ${config.frontend}`,
    );
  }

  return framework;
}

function createManagedDatabasePlan(config: ProjectConfig): ManagedDatabasePlan {
  if (!usesAlchemyManagedDatabase(config)) return { kind: "none" };
  if (config.orm !== "drizzle" && config.orm !== "prisma") {
    throw new Error(`Alchemy managed databases require Drizzle or Prisma, received: ${config.orm}`);
  }

  if (config.dbSetup === "neon") {
    return { kind: "neon", orm: config.orm };
  }

  if (config.dbSetup === "prisma-postgres") {
    return { kind: "prisma-postgres", orm: config.orm };
  }

  if (config.dbSetup === "planetscale" && config.database === "postgres") {
    return { kind: "planetscale-postgres", orm: config.orm };
  }

  if (config.dbSetup === "planetscale" && config.database === "mysql") {
    return { kind: "planetscale-mysql", orm: config.orm };
  }

  throw new Error(
    `Unsupported Alchemy managed database combination: ${config.dbSetup}/${config.database}`,
  );
}

export function createAlchemyDeploymentPlan(config: ProjectConfig): AlchemyDeploymentPlan {
  const hasCloudflare = config.webDeploy === "cloudflare" || config.serverDeploy === "cloudflare";
  const hasPrismaDeploy = config.webDeploy === "prisma" || config.serverDeploy === "prisma";
  const hasAlchemyManagedDatabase = usesAlchemyManagedDatabase(config);

  const web: AlchemyWebPlan = isAlchemyDeployTarget(config.webDeploy)
    ? {
        target: config.webDeploy,
        framework: getDeployedWebFramework(config),
        topology: config.backend === "self" ? "self" : "split",
      }
    : { target: "none" };

  const server: AlchemyServerPlan = isAlchemyDeployTarget(config.serverDeploy)
    ? { target: config.serverDeploy }
    : { target: "none" };

  return {
    config,
    managedDatabase: createManagedDatabasePlan(config),
    web,
    server,
    hasCloudflare,
    hasPrismaDeploy,
    hasAlchemyManagedDatabase,
    hasD1Resource:
      config.dbSetup === "d1" &&
      (config.serverDeploy === "cloudflare" ||
        (config.backend === "self" && config.webDeploy === "cloudflare")),
  };
}

export function assertNever(value: never): never {
  throw new Error(`Unhandled Alchemy plan variant: ${JSON.stringify(value)}`);
}
