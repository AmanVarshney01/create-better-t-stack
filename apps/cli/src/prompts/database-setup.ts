import {
  supportsAlchemyManagedDatabase,
  type Backend,
  type DatabaseSetup,
  type DbSetupOptions,
  type ORM,
  type Runtime,
  type ServerDeploy,
  type WebDeploy,
} from "../types";
import { UserCancelledError } from "../utils/errors";
import { isCancel, navigableSelect, preferValidInitial } from "./navigable";

export async function getDBSetupChoice(
  databaseType: string,
  dbSetup: DatabaseSetup | undefined,
  _orm?: ORM,
  backend?: Backend,
  runtime?: Runtime,
  previousValue?: DatabaseSetup,
) {
  if (backend === "convex") {
    return "none";
  }

  if (dbSetup !== undefined) return dbSetup as DatabaseSetup;

  if (databaseType === "none") {
    return "none";
  }

  let options: Array<{ value: DatabaseSetup; label: string; hint: string }> = [];

  if (databaseType === "sqlite") {
    options = [
      {
        value: "turso" as const,
        label: "Turso",
        hint: "SQLite for Production. Powered by libSQL",
      },
      ...(runtime === "workers" || backend === "self"
        ? [
            {
              value: "d1" as const,
              label: "Cloudflare D1",
              hint: "Cloudflare's managed, serverless database with SQLite's SQL semantics",
            },
          ]
        : []),
      { value: "none" as const, label: "None", hint: "Manual setup" },
    ];
  } else if (databaseType === "postgres") {
    options = [
      {
        value: "neon" as const,
        label: "Neon Postgres",
        hint: "Serverless Postgres with branching capability",
      },
      {
        value: "planetscale" as const,
        label: "PlanetScale",
        hint: "Postgres & Vitess (MySQL) on NVMe",
      },
      {
        value: "supabase" as const,
        label: "Supabase",
        hint: "Local Supabase stack (requires Docker)",
      },
      {
        value: "prisma-postgres" as const,
        label: "Prisma Postgres",
        hint: "Instant Postgres for Global Applications",
      },
      {
        value: "docker" as const,
        label: "Docker",
        hint: "Run locally with docker compose",
      },
      { value: "none" as const, label: "None", hint: "Manual setup" },
    ];
  } else if (databaseType === "mysql") {
    options = [
      {
        value: "planetscale" as const,
        label: "PlanetScale",
        hint: "MySQL on Vitess (NVMe, HA)",
      },
      {
        value: "docker" as const,
        label: "Docker",
        hint: "Run locally with docker compose",
      },
      { value: "none" as const, label: "None", hint: "Manual setup" },
    ];
  } else if (databaseType === "mongodb") {
    options = [
      {
        value: "mongodb-atlas" as const,
        label: "MongoDB Atlas",
        hint: "The most effective way to deploy MongoDB",
      },
      {
        value: "docker" as const,
        label: "Docker",
        hint: "Run locally with docker compose",
      },
      { value: "none" as const, label: "None", hint: "Manual setup" },
    ];
  } else {
    return "none";
  }

  const response = await navigableSelect<DatabaseSetup>({
    message: `Choose a ${databaseType} setup`,
    options,
    initialValue: preferValidInitial(options, previousValue, "none"),
  });

  if (isCancel(response)) throw new UserCancelledError({ message: "Operation cancelled" });

  return response;
}

type DbSetupMode = NonNullable<DbSetupOptions["mode"]>;

const providerLabels = {
  neon: "Neon",
  planetscale: "PlanetScale",
  "prisma-postgres": "Prisma Postgres",
} as const satisfies Partial<Record<DatabaseSetup, string>>;

export async function getDbProvisioningChoice(
  mode: DbSetupMode | undefined,
  dbSetup: DatabaseSetup | undefined,
  backend: Backend | undefined,
  webDeploy: WebDeploy | undefined,
  serverDeploy: ServerDeploy | undefined,
  previousValue?: DbSetupMode,
): Promise<DbSetupMode | undefined | symbol> {
  if (!dbSetup || !backend || !webDeploy || !serverDeploy) return mode;

  const supportsAlchemy = supportsAlchemyManagedDatabase({
    backend,
    dbSetup,
    webDeploy,
    serverDeploy,
  });

  if (!supportsAlchemy) {
    return mode === "alchemy" ? undefined : mode;
  }

  if (mode !== undefined) return mode;

  const provider = providerLabels[dbSetup];
  if (!provider) return undefined;

  const options: Array<{ value: DbSetupMode; label: string; hint: string }> = [
    {
      value: "alchemy",
      label: "Alchemy",
      hint: `Provision ${provider} during deploy and inject its credentials`,
    },
    ...(dbSetup === "neon" || dbSetup === "prisma-postgres"
      ? [
          {
            value: "auto" as const,
            label: "Automatic",
            hint: `Set up ${provider} now and write its connection credentials`,
          },
        ]
      : []),
    {
      value: "manual",
      label: "Manual",
      hint: `Use an existing ${provider} database and configure credentials yourself`,
    },
  ];

  const response = await navigableSelect<DbSetupMode>({
    message: `How should ${provider} be provisioned?`,
    options,
    initialValue: preferValidInitial(options, previousValue, "alchemy"),
  });

  if (isCancel(response)) throw new UserCancelledError({ message: "Operation cancelled" });

  return response;
}
