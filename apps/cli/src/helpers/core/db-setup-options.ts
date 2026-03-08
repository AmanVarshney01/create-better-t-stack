import type { DatabaseSetup, DbSetupOptions } from "../../types";
import { isSilent } from "../../utils/context";

export interface DatabaseSetupCliOptions {
  manualDb?: boolean;
  dbSetupOptions?: DbSetupOptions;
}

export type DbSetupMode = NonNullable<DbSetupOptions["mode"]>;

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
    ...(resolvedMode ? { mode: resolvedMode } : {}),
  };
}
