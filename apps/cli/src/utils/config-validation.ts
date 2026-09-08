import {
  supportsOrmDatabase,
  supportsDatabaseSetup,
  supportsDatabaseSetupRuntime,
  isFrontendAllowedWithBackend,
  supportsClerkBackend,
  supportsClerkFrontend,
  supportsRuntimeBackend,
  supportsServerDeployRuntime,
  getBackendDisabledOptions,
} from "@better-t-stack/types";
import { Result } from "better-result";

import {
  supportsAlchemyManagedDatabase,
  type CLIInput,
  type DatabaseSetup,
  type ProjectConfig,
} from "../types";
import {
  CONVEX_BETTER_AUTH_INCOMPATIBLE_FRONTENDS,
  CONVEX_BETTER_AUTH_SUPPORTED_FRONTENDS,
  ensureSingleWebAndNative,
  isWebFrontend,
  supportsConvexBetterAuth,
  validateAddonsAgainstFrontends,
  validateApiFrontendCompatibility,
  validateExamplesCompatibility,
  validatePaymentsCompatibility,
  validateSelfBackendCompatibility,
  validateDockerServerDeploy,
  validateDockerWebDeployDesktopAddons,
  validateServerDeployRequiresBackend,
  validateVercelServerDeploy,
  validatePrismaServerDeploy,
  validatePrismaWebDeploy,
  validatePrismaWebDeployDesktopAddons,
  validateCloudflareWebDeployKnownIssues,
  validateWebDeployRequiresWebFrontend,
  validateWorkersCompatibility,
} from "./compatibility-rules";
import { ValidationError } from "./errors";

type ValidationResult = Result<void, ValidationError>;

function validationErr(message: string): ValidationResult {
  return Result.err(new ValidationError({ message }));
}

function hasResolvedWorkersD1Target(config: Partial<ProjectConfig>) {
  return (
    config.backend === "hono" &&
    config.runtime === "workers" &&
    config.serverDeploy === "cloudflare"
  );
}

function hasResolvedSelfCloudflareD1Target(config: Partial<ProjectConfig>) {
  return (
    config.backend === "self" && config.runtime === "none" && config.webDeploy === "cloudflare"
  );
}

function canResolveWorkersD1Target(config: Partial<ProjectConfig>) {
  return (
    (config.backend === undefined || config.backend === "hono") &&
    (config.runtime === undefined || config.runtime === "workers") &&
    (config.serverDeploy === undefined || config.serverDeploy === "cloudflare")
  );
}

function canResolveSelfCloudflareD1Target(config: Partial<ProjectConfig>) {
  return (
    (config.backend === undefined || config.backend === "self") &&
    (config.runtime === undefined || config.runtime === "none") &&
    (config.webDeploy === undefined || config.webDeploy === "cloudflare")
  );
}

/**
 * Pure ORM + database compatibility check. Used by the flag-path
 * validator below and by the orm prompt directly (for flag+prompt
 * combos where one value came from a flag and the other from a
 * prompt).
 */
export function validateOrmDatabaseCompat(
  orm: ProjectConfig["orm"] | undefined,
  database: ProjectConfig["database"] | undefined,
): ValidationResult {
  if (!orm || !database || supportsOrmDatabase(orm, database)) return Result.ok(undefined);
  if (orm === "mongoose")
    return validationErr(
      "Mongoose ORM requires MongoDB database. Please use '--database mongodb' or choose a different ORM.",
    );
  if (orm === "drizzle" && database === "mongodb")
    return validationErr(
      "Drizzle ORM does not support MongoDB. Please use '--orm mongoose' or '--orm prisma' or choose a different database.",
    );
  if (orm === "none")
    return validationErr(
      "Database selection requires an ORM. Please choose '--orm drizzle', '--orm prisma', or '--orm mongoose'.",
    );
  return validationErr(
    "ORM selection requires a database. Please choose a database or set '--orm none'.",
  );
}

export function validateDatabaseOrmAuth(
  cfg: Partial<ProjectConfig>,
  flags?: Set<string>,
): ValidationResult {
  const has = (k: string) => (flags ? flags.has(k) : true);
  if (!has("orm") || !has("database")) return Result.ok(undefined);
  return validateOrmDatabaseCompat(cfg.orm, cfg.database);
}

export function validateDatabaseSetup(
  config: Partial<ProjectConfig>,
  providedFlags: Set<string>,
): ValidationResult {
  const { dbSetup, database, runtime } = config;

  if (
    providedFlags.has("dbSetup") &&
    providedFlags.has("database") &&
    dbSetup &&
    dbSetup !== "none" &&
    database === "none"
  ) {
    return validationErr(
      "Database setup requires a database. Please choose a database or set '--db-setup none'.",
    );
  }

  const setupValidations = {
    turso: {
      errorMessage:
        "Turso setup requires SQLite database. Please use '--database sqlite' or choose a different setup.",
    },
    neon: {
      errorMessage:
        "Neon setup requires PostgreSQL database. Please use '--database postgres' or choose a different setup.",
    },
    "prisma-postgres": {
      errorMessage:
        "Prisma PostgreSQL setup requires PostgreSQL database. Please use '--database postgres' or choose a different setup.",
    },
    planetscale: {
      errorMessage:
        "PlanetScale setup requires PostgreSQL or MySQL database. Please use '--database postgres' or '--database mysql' or choose a different setup.",
    },
    "mongodb-atlas": {
      errorMessage:
        "MongoDB Atlas setup requires MongoDB database. Please use '--database mongodb' or choose a different setup.",
    },
    supabase: {
      errorMessage:
        "Supabase setup requires PostgreSQL database. Please use '--database postgres' or choose a different setup.",
    },
    d1: {
      errorMessage: "Cloudflare D1 setup requires SQLite database.",
    },
    docker: {
      errorMessage:
        "Docker setup is not compatible with SQLite database or Cloudflare Workers runtime.",
    },
    none: { errorMessage: "" },
  } satisfies Record<DatabaseSetup, { errorMessage: string }>;

  if (dbSetup && dbSetup !== "none") {
    const validation = setupValidations[dbSetup];

    if (dbSetup !== "docker" && !supportsDatabaseSetup(dbSetup, database)) {
      return validationErr(validation.errorMessage);
    }

    if (dbSetup === "d1") {
      const isWorkersTarget = hasResolvedWorkersD1Target(config);
      const isSelfCloudflareTarget = hasResolvedSelfCloudflareD1Target(config);
      const canResolveWorkersTarget = canResolveWorkersD1Target(config);
      const canResolveSelfCloudflareTarget = canResolveSelfCloudflareD1Target(config);

      if (
        !isWorkersTarget &&
        !isSelfCloudflareTarget &&
        !canResolveWorkersTarget &&
        !canResolveSelfCloudflareTarget
      ) {
        return validationErr(
          "Cloudflare D1 setup requires SQLite database and either Cloudflare Workers runtime with server deployment or backend 'self' with Cloudflare web deployment.",
        );
      }
    }

    if (dbSetup === "docker") {
      if (database && !supportsDatabaseSetup(dbSetup, database)) {
        return validationErr(
          "Docker setup is not compatible with SQLite database. SQLite is file-based and doesn't require Docker. Please use '--database postgres', '--database mysql', '--database mongodb', or choose a different setup.",
        );
      }
      if (!supportsDatabaseSetupRuntime(dbSetup, runtime, config.backend)) {
        return validationErr(
          "Docker setup is not compatible with Cloudflare Workers runtime. Workers runtime uses serverless databases (D1) and doesn't support local Docker containers. Please use '--db-setup d1' for SQLite or choose a different runtime.",
        );
      }
    }
  }

  return Result.ok(undefined);
}

export function validateDatabaseProvisioningMode(config: Partial<ProjectConfig>): ValidationResult {
  if (config.dbSetup === "planetscale" && config.dbSetupOptions?.mode === "auto") {
    return validationErr(
      "PlanetScale does not support automatic database setup. Use dbSetupOptions.mode 'alchemy' or 'manual'.",
    );
  }

  if (config.dbSetupOptions?.mode !== "alchemy") return Result.ok(undefined);

  const { backend, dbSetup, webDeploy, serverDeploy } = config;
  if (!backend || !dbSetup || !webDeploy || !serverDeploy) return Result.ok(undefined);

  if (
    !supportsAlchemyManagedDatabase({
      backend,
      dbSetup,
      webDeploy,
      serverDeploy,
      dbSetupOptions: config.dbSetupOptions,
    })
  ) {
    return validationErr(
      "Alchemy database provisioning requires Neon, PlanetScale, or Prisma Postgres and an Alchemy deployment target for the app that consumes the database.",
    );
  }

  return Result.ok(undefined);
}

export function validateConvexConstraints(
  config: Partial<ProjectConfig>,
  providedFlags: Set<string>,
): ValidationResult {
  const { backend } = config;

  if (backend !== "convex") {
    return Result.ok(undefined);
  }

  const has = (k: string) => providedFlags.has(k);
  const disabled = validateBackendDisabledOptions(config, providedFlags);
  if (disabled.isErr()) return disabled;

  if (has("auth") && config.auth === "better-auth") {
    const incompatibleFrontends =
      config.frontend?.filter((f) =>
        CONVEX_BETTER_AUTH_INCOMPATIBLE_FRONTENDS.includes(
          f as (typeof CONVEX_BETTER_AUTH_INCOMPATIBLE_FRONTENDS)[number],
        ),
      ) ?? [];
    const hasSupportedFrontend = supportsConvexBetterAuth(config.frontend);

    if (incompatibleFrontends.length > 0) {
      return validationErr(
        `Better Auth with '--backend convex' is not compatible with the following frontends: ${incompatibleFrontends.join(
          ", ",
        )}. Please use a React-based web frontend (next, tanstack-start, tanstack-router, react-router), a supported native frontend, or choose a different auth provider.`,
      );
    }

    if (!hasSupportedFrontend) {
      return validationErr(
        `Better Auth with '--backend convex' requires a supported frontend (${CONVEX_BETTER_AUTH_SUPPORTED_FRONTENDS.join(
          ", ",
        )}).`,
      );
    }
  }

  return Result.ok(undefined);
}

function validateBackendDisabledOptions(
  config: Partial<ProjectConfig>,
  providedFlags: Set<string>,
): ValidationResult {
  if (!config.backend) return Result.ok(undefined);
  for (const key of getBackendDisabledOptions(config.backend)) {
    if (!providedFlags.has(key) || config[key] === "none") continue;
    const flag = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
    const label =
      config.backend === "convex"
        ? "Convex backend"
        : `Backend '${config.backend}'${config.backend === "self" ? " (fullstack)" : ""}`;
    return validationErr(
      `${label} requires '--${flag} none'. Please remove the --${flag} flag or set it to 'none'.`,
    );
  }
  return Result.ok(undefined);
}

export function validateBackendNoneConstraints(
  config: Partial<ProjectConfig>,
  providedFlags: Set<string>,
): ValidationResult {
  return config.backend === "none"
    ? validateBackendDisabledOptions(config, providedFlags)
    : Result.ok(undefined);
}

export function validateSelfBackendConstraints(
  config: Partial<ProjectConfig>,
  providedFlags: Set<string>,
): ValidationResult {
  return config.backend === "self"
    ? validateBackendDisabledOptions(config, providedFlags)
    : Result.ok(undefined);
}

export function validateBackendConstraints(
  config: Partial<ProjectConfig>,
  providedFlags: Set<string>,
  options: CLIInput,
): ValidationResult {
  const { backend } = config;

  if (config.auth === "clerk" && config.frontend) {
    const incompatibleFrontends = config.frontend.filter(
      (f) => !isFrontendAllowedWithBackend(f, undefined, "clerk"),
    );
    if (incompatibleFrontends.length > 0) {
      return validationErr(
        `Clerk authentication is not compatible with the following frontends: ${incompatibleFrontends.join(
          ", ",
        )}. Please choose a different frontend or auth provider.`,
      );
    }
  }

  if (config.auth === "clerk") {
    if (!supportsClerkBackend(backend, config.frontend))
      return validationErr(
        "Clerk requires Convex, a separate server, or backend self with Next.js or TanStack Start.",
      );
    if (config.frontend && !supportsClerkFrontend(config.frontend))
      return validationErr("Clerk requires a React web or native frontend.");
  }

  if (providedFlags.has("backend") && backend && !supportsRuntimeBackend("none", backend)) {
    if (providedFlags.has("runtime") && options.runtime === "none") {
      return validationErr(
        "'--runtime none' is only supported with '--backend convex', '--backend none', or '--backend self'. Please choose 'bun', 'node', or remove the --runtime flag.",
      );
    }
  }

  if (backend === "convex" && providedFlags.has("frontend") && options.frontend) {
    const incompatibleFrontends = options.frontend.filter(
      (frontend) => !isFrontendAllowedWithBackend(frontend, "convex"),
    );
    if (incompatibleFrontends.length > 0) {
      return validationErr(
        `The following frontends are not compatible with '--backend convex': ${incompatibleFrontends.join(
          ", ",
        )}. Please choose a different frontend or backend.`,
      );
    }
  }

  return Result.ok(undefined);
}

export function validateFrontendConstraints(
  config: Partial<ProjectConfig>,
  providedFlags: Set<string>,
): ValidationResult {
  const { frontend } = config;

  if (frontend && frontend.length > 0) {
    const singleWebNativeResult = ensureSingleWebAndNative(frontend);
    if (singleWebNativeResult.isErr()) {
      return singleWebNativeResult;
    }

    if (providedFlags.has("api") && providedFlags.has("frontend") && config.api) {
      const apiResult = validateApiFrontendCompatibility(config.api, frontend);
      if (apiResult.isErr()) {
        return apiResult;
      }
    }
  }

  const hasWebFrontendFlag = (frontend ?? []).some((f) => isWebFrontend(f));
  const webDeployResult = validateWebDeployRequiresWebFrontend(
    config.webDeploy,
    hasWebFrontendFlag,
  );
  if (webDeployResult.isErr()) {
    return webDeployResult;
  }

  return Result.ok(undefined);
}

export function validateApiConstraints(
  config: Partial<ProjectConfig>,
  options: CLIInput,
): ValidationResult {
  if (config.api === "none") {
    if (
      options.examples?.includes("todo") &&
      options.backend !== "convex" &&
      options.backend !== "none"
    ) {
      return validationErr(
        "Cannot use '--examples todo' when '--api' is set to 'none'. The todo example requires an API layer. Please remove 'todo' from --examples or choose an API type.",
      );
    }
  }

  return Result.ok(undefined);
}

export function validateFullConfig(
  config: Partial<ProjectConfig>,
  providedFlags: Set<string>,
  options: CLIInput,
): ValidationResult {
  return Result.gen(function* () {
    yield* validateDatabaseOrmAuth(config, providedFlags);
    yield* validateDatabaseSetup(config, providedFlags);
    yield* validateDatabaseProvisioningMode(config);

    yield* validateConvexConstraints(config, providedFlags);
    yield* validateBackendNoneConstraints(config, providedFlags);
    yield* validateSelfBackendConstraints(config, providedFlags);
    yield* validateBackendConstraints(config, providedFlags, options);

    yield* validateFrontendConstraints(config, providedFlags);

    yield* validateApiConstraints(config, options);

    yield* validateServerDeployRequiresBackend(config.serverDeploy, config.backend);
    yield* validateDockerServerDeploy(config.serverDeploy, config.backend, config.runtime);
    yield* validateVercelServerDeploy(config.serverDeploy, config.backend, config.runtime);
    yield* validatePrismaServerDeploy(config.serverDeploy, config.backend, config.runtime);
    yield* validatePrismaWebDeploy(config.webDeploy, config.frontend);
    yield* validateCloudflareWebDeployKnownIssues(config);
    yield* validateDockerWebDeployDesktopAddons(
      config.webDeploy,
      config.addons,
      config.frontend,
      config.backend,
      config.auth,
    );
    yield* validatePrismaWebDeployDesktopAddons(config.webDeploy, config.addons, config.frontend);

    yield* validateSelfBackendCompatibility(providedFlags, options, config);
    yield* validateWorkersCompatibility(providedFlags, options, config);

    if (config.runtime === "workers" && config.serverDeploy === "none") {
      yield* validationErr(
        "Cloudflare Workers runtime requires a server deployment. Please choose 'cloudflare' for --server-deploy.",
      );
    }

    if (
      providedFlags.has("serverDeploy") &&
      config.serverDeploy === "cloudflare" &&
      !supportsServerDeployRuntime(config.serverDeploy, config.runtime)
    ) {
      yield* validationErr(
        `Server deployment '${config.serverDeploy}' requires '--runtime workers'. Please use '--runtime workers' or choose a different server deployment.`,
      );
    }

    if (config.addons && config.addons.length > 0) {
      yield* validateAddonsAgainstFrontends(
        config.addons,
        config.frontend,
        config.auth,
        config.backend,
        config.runtime,
      );
      config.addons = [...new Set(config.addons)];
    }

    yield* validateExamplesCompatibility(
      config.examples ?? [],
      config.backend,
      config.database,
      config.frontend ?? [],
      config.api,
    );

    yield* validatePaymentsCompatibility(
      config.payments,
      config.auth,
      config.backend,
      config.frontend ?? [],
    );

    return Result.ok(undefined);
  });
}

export function validateConfigForProgrammaticUse(config: Partial<ProjectConfig>): ValidationResult {
  return Result.gen(function* () {
    yield* validateDatabaseOrmAuth(config);

    if (config.frontend && config.frontend.length > 0) {
      yield* ensureSingleWebAndNative(config.frontend);
    }

    yield* validateApiFrontendCompatibility(config.api, config.frontend);

    yield* validatePaymentsCompatibility(
      config.payments,
      config.auth,
      config.backend,
      config.frontend,
    );

    if (config.addons && config.addons.length > 0) {
      yield* validateAddonsAgainstFrontends(
        config.addons,
        config.frontend,
        config.auth,
        config.backend,
        config.runtime,
      );
    }

    yield* validateExamplesCompatibility(
      config.examples ?? [],
      config.backend,
      config.database,
      config.frontend ?? [],
      config.api,
    );

    return Result.ok(undefined);
  });
}
