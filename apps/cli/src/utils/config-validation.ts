import { Result } from "better-result";

import type { CLIInput, Database, DatabaseSetup, ProjectConfig, Runtime } from "../types";

import {
  ensureSingleWebAndNative,
  isWebFrontend,
  validateAddonsAgainstFrontends,
  validateApiFrontendCompatibility,
  validateExamplesCompatibility,
  validatePaymentsCompatibility,
  validateSelfBackendCompatibility,
  validateServerDeployRequiresBackend,
  validateWebDeployRequiresWebFrontend,
  validateWorkersCompatibility,
} from "./compatibility-rules";
import { ValidationError } from "./errors";

type ValidationResult = Result<void, ValidationError>;

function validationErr(message: string): ValidationResult {
  return Result.err(new ValidationError({ message }));
}

export function validateDatabaseOrmAuth(
  cfg: Partial<ProjectConfig>,
  flags?: Set<string>,
): ValidationResult {
  const db = cfg.database;
  const orm = cfg.orm;
  const has = (k: string) => (flags ? flags.has(k) : true);

  if (has("orm") && has("database") && orm === "mongoose" && db !== "mongodb") {
    return validationErr(
      "Mongoose ORM requires MongoDB database. Please use '--database mongodb' or choose a different ORM.",
    );
  }

  if (has("orm") && has("database") && orm === "drizzle" && db === "mongodb") {
    return validationErr(
      "Drizzle ORM does not support MongoDB. Please use '--orm mongoose' or '--orm prisma' or choose a different database.",
    );
  }

  if (
    has("database") &&
    has("orm") &&
    db === "mongodb" &&
    orm &&
    orm !== "mongoose" &&
    orm !== "prisma" &&
    orm !== "none"
  ) {
    return validationErr(
      "MongoDB database requires Mongoose or Prisma ORM. Please use '--orm mongoose' or '--orm prisma' or choose a different database.",
    );
  }

  if (has("database") && has("orm") && db && db !== "none" && orm === "none") {
    return validationErr(
      "Database selection requires an ORM. Please choose '--orm drizzle', '--orm prisma', or '--orm mongoose'.",
    );
  }

  if (has("orm") && has("database") && orm && orm !== "none" && db === "none") {
    return validationErr(
      "ORM selection requires a database. Please choose a database or set '--orm none'.",
    );
  }

  return Result.ok(undefined);
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

  const setupValidations: Record<
    DatabaseSetup,
    { database?: Database; runtime?: Runtime; errorMessage: string }
  > = {
    turso: {
      database: "sqlite",
      errorMessage:
        "Turso setup requires SQLite database. Please use '--database sqlite' or choose a different setup.",
    },
    neon: {
      database: "postgres",
      errorMessage:
        "Neon setup requires PostgreSQL database. Please use '--database postgres' or choose a different setup.",
    },
    "prisma-postgres": {
      database: "postgres",
      errorMessage:
        "Prisma PostgreSQL setup requires PostgreSQL database. Please use '--database postgres' or choose a different setup.",
    },
    planetscale: {
      errorMessage:
        "PlanetScale setup requires PostgreSQL or MySQL database. Please use '--database postgres' or '--database mysql' or choose a different setup.",
    },
    "mongodb-atlas": {
      database: "mongodb",
      errorMessage:
        "MongoDB Atlas setup requires MongoDB database. Please use '--database mongodb' or choose a different setup.",
    },
    supabase: {
      database: "postgres",
      errorMessage:
        "Supabase setup requires PostgreSQL database. Please use '--database postgres' or choose a different setup.",
    },
    d1: {
      database: "sqlite",
      runtime: "workers",
      errorMessage: "Cloudflare D1 setup requires SQLite database and Cloudflare Workers runtime.",
    },
    docker: {
      errorMessage:
        "Docker setup is not compatible with SQLite database or Cloudflare Workers runtime.",
    },
    none: { errorMessage: "" },
  };

  if (dbSetup && dbSetup !== "none") {
    const validation = setupValidations[dbSetup];

    if (dbSetup === "planetscale") {
      if (database !== "postgres" && database !== "mysql") {
        return validationErr(validation.errorMessage);
      }
    } else {
      if (validation.database && database !== validation.database) {
        return validationErr(validation.errorMessage);
      }
    }

    if (validation.runtime && runtime !== validation.runtime) {
      return validationErr(validation.errorMessage);
    }

    if (dbSetup === "docker") {
      if (database === "sqlite") {
        return validationErr(
          "Docker setup is not compatible with SQLite database. SQLite is file-based and doesn't require Docker. Please use '--database postgres', '--database mysql', '--database mongodb', or choose a different setup.",
        );
      }
      if (runtime === "workers") {
        return validationErr(
          "Docker setup is not compatible with Cloudflare Workers runtime. Workers runtime uses serverless databases (D1) and doesn't support local Docker containers. Please use '--db-setup d1' for SQLite or choose a different runtime.",
        );
      }
    }
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

  if (has("runtime") && config.runtime !== "none") {
    return validationErr(
      "Convex backend requires '--runtime none'. Please remove the --runtime flag or set it to 'none'.",
    );
  }

  if (has("database") && config.database !== "none") {
    return validationErr(
      "Convex backend requires '--database none'. Please remove the --database flag or set it to 'none'.",
    );
  }

  if (has("orm") && config.orm !== "none") {
    return validationErr(
      "Convex backend requires '--orm none'. Please remove the --orm flag or set it to 'none'.",
    );
  }

  if (has("api") && config.api !== "none") {
    return validationErr(
      "Convex backend requires '--api none'. Please remove the --api flag or set it to 'none'.",
    );
  }

  if (has("dbSetup") && config.dbSetup !== "none") {
    return validationErr(
      "Convex backend requires '--db-setup none'. Please remove the --db-setup flag or set it to 'none'.",
    );
  }

  if (has("serverDeploy") && config.serverDeploy !== "none") {
    return validationErr(
      "Convex backend requires '--server-deploy none'. Please remove the --server-deploy flag or set it to 'none'.",
    );
  }

  if (has("auth") && config.auth === "better-auth") {
    const supportedFrontends = [
      "tanstack-router",
      "tanstack-start",
      "next",
      "native-bare",
      "native-uniwind",
      "native-unistyles",
    ];
    const hasSupportedFrontend = config.frontend?.some((f) => supportedFrontends.includes(f));

    if (!hasSupportedFrontend) {
      return validationErr(
        "Better-Auth with Convex backend requires a supported frontend (TanStack Router, TanStack Start, Next.js, or Native).",
      );
    }
  }

  return Result.ok(undefined);
}

export function validateBackendNoneConstraints(
  config: Partial<ProjectConfig>,
  providedFlags: Set<string>,
): ValidationResult {
  const { backend } = config;

  if (backend !== "none") {
    return Result.ok(undefined);
  }

  const has = (k: string) => providedFlags.has(k);

  if (has("runtime") && config.runtime !== "none") {
    return validationErr(
      "Backend 'none' requires '--runtime none'. Please remove the --runtime flag or set it to 'none'.",
    );
  }

  if (has("database") && config.database !== "none") {
    return validationErr(
      "Backend 'none' requires '--database none'. Please remove the --database flag or set it to 'none'.",
    );
  }

  if (has("orm") && config.orm !== "none") {
    return validationErr(
      "Backend 'none' requires '--orm none'. Please remove the --orm flag or set it to 'none'.",
    );
  }

  if (has("api") && config.api !== "none") {
    return validationErr(
      "Backend 'none' requires '--api none'. Please remove the --api flag or set it to 'none'.",
    );
  }

  if (has("auth") && config.auth !== "none") {
    return validationErr(
      "Backend 'none' requires '--auth none'. Please remove the --auth flag or set it to 'none'.",
    );
  }

  if (has("payments") && config.payments !== "none") {
    return validationErr(
      "Backend 'none' requires '--payments none'. Please remove the --payments flag or set it to 'none'.",
    );
  }

  if (has("dbSetup") && config.dbSetup !== "none") {
    return validationErr(
      "Backend 'none' requires '--db-setup none'. Please remove the --db-setup flag or set it to 'none'.",
    );
  }

  if (has("serverDeploy") && config.serverDeploy !== "none") {
    return validationErr(
      "Backend 'none' requires '--server-deploy none'. Please remove the --server-deploy flag or set it to 'none'.",
    );
  }

  return Result.ok(undefined);
}

export function validateSelfBackendConstraints(
  config: Partial<ProjectConfig>,
  providedFlags: Set<string>,
): ValidationResult {
  const { backend } = config;

  if (backend !== "self") {
    return Result.ok(undefined);
  }

  const has = (k: string) => providedFlags.has(k);

  if (has("runtime") && config.runtime !== "none") {
    return validationErr(
      "Backend 'self' (fullstack) requires '--runtime none'. Please remove the --runtime flag or set it to 'none'.",
    );
  }

  return Result.ok(undefined);
}

export function validateBackendConstraints(
  config: Partial<ProjectConfig>,
  providedFlags: Set<string>,
  options: CLIInput,
): ValidationResult {
  const { backend } = config;

  if (config.auth === "clerk" && backend !== "convex") {
    return validationErr(
      "Clerk authentication is only supported with the Convex backend. Please use '--backend convex' or choose a different auth provider.",
    );
  }

  if (backend === "convex" && config.auth === "clerk" && config.frontend) {
    const incompatibleFrontends = config.frontend.filter((f) =>
      ["nuxt", "svelte", "solid"].includes(f),
    );
    if (incompatibleFrontends.length > 0) {
      return validationErr(
        `Clerk authentication is not compatible with the following frontends: ${incompatibleFrontends.join(
          ", ",
        )}. Please choose a different frontend or auth provider.`,
      );
    }
  }

  if (
    providedFlags.has("backend") &&
    backend &&
    backend !== "convex" &&
    backend !== "none" &&
    backend !== "self"
  ) {
    if (providedFlags.has("runtime") && options.runtime === "none") {
      return validationErr(
        "'--runtime none' is only supported with '--backend convex', '--backend none', or '--backend self'. Please choose 'bun', 'node', or remove the --runtime flag.",
      );
    }
  }

  if (backend === "convex" && providedFlags.has("frontend") && options.frontend) {
    const incompatibleFrontends = options.frontend.filter((f) => f === "solid" || f === "astro");
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

    yield* validateConvexConstraints(config, providedFlags);
    yield* validateBackendNoneConstraints(config, providedFlags);
    yield* validateSelfBackendConstraints(config, providedFlags);
    yield* validateBackendConstraints(config, providedFlags, options);

    yield* validateFrontendConstraints(config, providedFlags);

    yield* validateApiConstraints(config, options);

    yield* validateServerDeployRequiresBackend(config.serverDeploy, config.backend);

    yield* validateSelfBackendCompatibility(providedFlags, options, config);
    yield* validateWorkersCompatibility(providedFlags, options, config);

    if (config.runtime === "workers" && config.serverDeploy === "none") {
      yield* validationErr(
        "Cloudflare Workers runtime requires a server deployment. Please choose 'alchemy' for --server-deploy.",
      );
    }

    if (
      providedFlags.has("serverDeploy") &&
      config.serverDeploy === "cloudflare" &&
      config.runtime !== "workers"
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
