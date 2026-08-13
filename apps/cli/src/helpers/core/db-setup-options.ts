import {
  supportsAlchemyManagedDatabase,
  type DatabaseSetup,
  type DbSetupOptions,
  type ProjectConfig,
} from "../../types";
import { isSilent } from "../../utils/context";

export interface DatabaseSetupCliOptions {
  manualDb?: boolean;
  dbSetupOptions?: DbSetupOptions;
}

export type DbSetupMode = NonNullable<DbSetupOptions["mode"]>;

export function withDbSetupMode(
  dbSetupOptions: DbSetupOptions | undefined,
  mode: DbSetupMode | undefined,
): DbSetupOptions | undefined {
  const resolved = { ...dbSetupOptions };
  if (mode === undefined) {
    delete resolved.mode;
  } else {
    resolved.mode = mode;
  }

  return Object.keys(resolved).length === 0 ? undefined : resolved;
}

const REMOTE_PROVISIONING_DB_SETUPS: DatabaseSetup[] = [
  "turso",
  "neon",
  "prisma-postgres",
  "supabase",
  "mongodb-atlas",
];

export function requiresProvisioningGuardrails(dbSetup: DatabaseSetup): boolean {
  return REMOTE_PROVISIONING_DB_SETUPS.includes(dbSetup);
}

export function resolveDbSetupMode(
  dbSetup: DatabaseSetup,
  cliOptions: DatabaseSetupCliOptions = {},
): DbSetupMode | undefined {
  if (dbSetup === "none") {
    return undefined;
  }

  const explicitMode = cliOptions.dbSetupOptions?.mode;
  if (explicitMode) {
    return explicitMode;
  }

  if (cliOptions.manualDb === true) {
    return "manual";
  }

  if (isSilent() && requiresProvisioningGuardrails(dbSetup)) {
    return "manual";
  }

  return undefined;
}

export function mergeResolvedDbSetupOptions(
  dbSetup: DatabaseSetup,
  dbSetupOptions: DbSetupOptions | undefined,
  cliOptions: DatabaseSetupCliOptions = {},
): DbSetupOptions | undefined {
  if (dbSetup === "none") {
    return undefined;
  }

  const resolvedMode = resolveDbSetupMode(dbSetup, {
    ...cliOptions,
    dbSetupOptions: dbSetupOptions ?? cliOptions.dbSetupOptions,
  });

  if (!dbSetupOptions && !resolvedMode) {
    return undefined;
  }

  return {
    ...dbSetupOptions,
    mode: resolvedMode,
  };
}

export function resolveProjectDbSetupOptions(
  config: Pick<
    ProjectConfig,
    "backend" | "dbSetup" | "dbSetupOptions" | "webDeploy" | "serverDeploy"
  >,
  cliOptions: DatabaseSetupCliOptions = {},
): DbSetupOptions | undefined {
  const dbSetupOptions = config.dbSetupOptions ?? cliOptions.dbSetupOptions;
  const explicitMode =
    dbSetupOptions?.mode ?? (cliOptions.manualDb === true ? "manual" : undefined);

  if (!explicitMode && supportsAlchemyManagedDatabase(config)) {
    return { ...dbSetupOptions, mode: "alchemy" };
  }

  const resolved = mergeResolvedDbSetupOptions(config.dbSetup, dbSetupOptions, {
    ...cliOptions,
    dbSetupOptions,
  });
  return resolved;
}
