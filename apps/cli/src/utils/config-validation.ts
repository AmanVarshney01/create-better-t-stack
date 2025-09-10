import type {
	CLIInput,
	Database,
	DatabaseSetup,
	ProjectConfig,
	Runtime,
} from "../types";
import {
	ensureSingleWebAndNative,
	isWebFrontend,
	validateAddonsAgainstFrontends,
	validateApiFrontendCompatibility,
	validateExamplesCompatibility,
	validateServerDeployRequiresBackend,
	validateWebDeployRequiresWebFrontend,
	validateWorkersCompatibility,
} from "./compatibility-rules";
import { exitWithError } from "./errors";

export function validateDatabaseOrmAuth(
	cfg: Partial<ProjectConfig>,
	flags?: Set<string>,
) {
	const db = cfg.database;
	const orm = cfg.orm;
	const has = (k: string) => (flags ? flags.has(k) : true);

	if (has("orm") && has("database") && orm === "mongoose" && db !== "mongodb") {
		exitWithError(
			"Mongoose ORM requires MongoDB database. Please use '--database mongodb' or choose a different ORM.",
		);
	}

	if (has("orm") && has("database") && orm === "drizzle" && db === "mongodb") {
		exitWithError(
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
		exitWithError(
			"MongoDB database requires Mongoose or Prisma ORM. Please use '--orm mongoose' or '--orm prisma' or choose a different database.",
		);
	}

	if (has("database") && has("orm") && db && db !== "none" && orm === "none") {
		exitWithError(
			"Database selection requires an ORM. Please choose '--orm drizzle', '--orm prisma', or '--orm mongoose'.",
		);
	}

	if (has("orm") && has("database") && orm && orm !== "none" && db === "none") {
		exitWithError(
			"ORM selection requires a database. Please choose a database or set '--orm none'.",
		);
	}

	if (
		has("auth") &&
		has("database") &&
		cfg.auth !== "none" &&
		db === "none" &&
		cfg.backend !== "convex"
	) {
		exitWithError(
			"Authentication requires a database. Please choose a database or set '--auth none'.",
		);
	}

	if (cfg.auth !== "none" && db === "none" && cfg.backend !== "convex") {
		exitWithError(
			"Authentication requires a database. Please choose a database or set '--auth none'.",
		);
	}

	if (orm && orm !== "none" && db === "none") {
		exitWithError(
			"ORM selection requires a database. Please choose a database or set '--orm none'.",
		);
	}
}

export function validateDatabaseSetup(
	config: Partial<ProjectConfig>,
	providedFlags: Set<string>,
) {
	const { dbSetup, database, runtime } = config;

	if (
		providedFlags.has("dbSetup") &&
		providedFlags.has("database") &&
		dbSetup &&
		dbSetup !== "none" &&
		database === "none"
	) {
		exitWithError(
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
			errorMessage:
				"Cloudflare D1 setup requires SQLite database and Cloudflare Workers runtime.",
		},
		docker: {
			errorMessage:
				"Docker setup is not compatible with SQLite database or Cloudflare Workers runtime.",
		},
		none: { errorMessage: "" },
	};

	if (dbSetup && dbSetup !== "none") {
		const validation = setupValidations[dbSetup];

		// Special handling for PlanetScale - supports both postgres and mysql
		if (dbSetup === "planetscale") {
			if (database !== "postgres" && database !== "mysql") {
				exitWithError(validation.errorMessage);
			}
		} else {
			if (validation.database && database !== validation.database) {
				exitWithError(validation.errorMessage);
			}
		}

		if (validation.runtime && runtime !== validation.runtime) {
			exitWithError(validation.errorMessage);
		}

		if (dbSetup === "docker") {
			if (database === "sqlite") {
				exitWithError(
					"Docker setup is not compatible with SQLite database. SQLite is file-based and doesn't require Docker. Please use '--database postgres', '--database mysql', '--database mongodb', or choose a different setup.",
				);
			}
			if (runtime === "workers") {
				exitWithError(
					"Docker setup is not compatible with Cloudflare Workers runtime. Workers runtime uses serverless databases (D1) and doesn't support local Docker containers. Please use '--db-setup d1' for SQLite or choose a different runtime.",
				);
			}
		}
	}
}

export function validateConvexConstraints(
	config: Partial<ProjectConfig>,
	providedFlags: Set<string>,
) {
	const { backend } = config;

	if (backend !== "convex") {
		return;
	}

	const has = (k: string) => providedFlags.has(k);

	if (has("runtime") && config.runtime !== "none") {
		exitWithError(
			"Convex backend requires '--runtime none'. Please remove the --runtime flag or set it to 'none'.",
		);
	}

	if (has("database") && config.database !== "none") {
		exitWithError(
			"Convex backend requires '--database none'. Please remove the --database flag or set it to 'none'.",
		);
	}

	if (has("orm") && config.orm !== "none") {
		exitWithError(
			"Convex backend requires '--orm none'. Please remove the --orm flag or set it to 'none'.",
		);
	}

	if (has("api") && config.api !== "none") {
		exitWithError(
			"Convex backend requires '--api none'. Please remove the --api flag or set it to 'none'.",
		);
	}

	if (has("dbSetup") && config.dbSetup !== "none") {
		exitWithError(
			"Convex backend requires '--db-setup none'. Please remove the --db-setup flag or set it to 'none'.",
		);
	}

	if (has("serverDeploy") && config.serverDeploy !== "none") {
		exitWithError(
			"Convex backend requires '--server-deploy none'. Please remove the --server-deploy flag or set it to 'none'.",
		);
	}

	if (has("auth") && config.auth === "better-auth") {
		exitWithError(
			"Better-Auth is not compatible with Convex backend. Please use '--auth clerk' or '--auth none'.",
		);
	}
}

export function validateBackendNoneConstraints(
	config: Partial<ProjectConfig>,
	providedFlags: Set<string>,
) {
	const { backend } = config;

	if (backend !== "none") {
		return;
	}

	const has = (k: string) => providedFlags.has(k);

	if (has("runtime") && config.runtime !== "none") {
		exitWithError(
			"Backend 'none' requires '--runtime none'. Please remove the --runtime flag or set it to 'none'.",
		);
	}

	if (has("database") && config.database !== "none") {
		exitWithError(
			"Backend 'none' requires '--database none'. Please remove the --database flag or set it to 'none'.",
		);
	}

	if (has("orm") && config.orm !== "none") {
		exitWithError(
			"Backend 'none' requires '--orm none'. Please remove the --orm flag or set it to 'none'.",
		);
	}

	if (has("api") && config.api !== "none") {
		exitWithError(
			"Backend 'none' requires '--api none'. Please remove the --api flag or set it to 'none'.",
		);
	}

	if (has("auth") && config.auth !== "none") {
		exitWithError(
			"Backend 'none' requires '--auth none'. Please remove the --auth flag or set it to 'none'.",
		);
	}

	if (has("dbSetup") && config.dbSetup !== "none") {
		exitWithError(
			"Backend 'none' requires '--db-setup none'. Please remove the --db-setup flag or set it to 'none'.",
		);
	}

	if (has("serverDeploy") && config.serverDeploy !== "none") {
		exitWithError(
			"Backend 'none' requires '--server-deploy none'. Please remove the --server-deploy flag or set it to 'none'.",
		);
	}
}

export function validateBackendConstraints(
	config: Partial<ProjectConfig>,
	providedFlags: Set<string>,
	options: CLIInput,
) {
	const { backend } = config;

	if (config.auth === "clerk" && backend !== "convex") {
		exitWithError(
			"Clerk authentication is only supported with the Convex backend. Please use '--backend convex' or choose a different auth provider.",
		);
	}

	if (backend === "convex" && config.auth === "clerk" && config.frontend) {
		const incompatibleFrontends = config.frontend.filter((f) =>
			["nuxt", "svelte", "solid"].includes(f),
		);
		if (incompatibleFrontends.length > 0) {
			exitWithError(
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
		backend !== "none"
	) {
		if (providedFlags.has("runtime") && options.runtime === "none") {
			exitWithError(
				"'--runtime none' is only supported with '--backend convex' or '--backend none'. Please choose 'bun', 'node', or remove the --runtime flag.",
			);
		}
	}

	if (
		backend === "convex" &&
		providedFlags.has("frontend") &&
		options.frontend
	) {
		const incompatibleFrontends = options.frontend.filter((f) => f === "solid");
		if (incompatibleFrontends.length > 0) {
			exitWithError(
				`The following frontends are not compatible with '--backend convex': ${incompatibleFrontends.join(
					", ",
				)}. Please choose a different frontend or backend.`,
			);
		}
	}
}

export function validateFrontendConstraints(
	config: Partial<ProjectConfig>,
	providedFlags: Set<string>,
) {
	const { frontend } = config;

	if (frontend && frontend.length > 0) {
		ensureSingleWebAndNative(frontend);

		if (
			providedFlags.has("api") &&
			providedFlags.has("frontend") &&
			config.api
		) {
			validateApiFrontendCompatibility(config.api, frontend);
		}
	}

	const hasWebFrontendFlag = (frontend ?? []).some((f) => isWebFrontend(f));
	validateWebDeployRequiresWebFrontend(config.webDeploy, hasWebFrontendFlag);
}

export function validateApiConstraints(
	config: Partial<ProjectConfig>,
	options: CLIInput,
) {
	if (config.api === "none") {
		if (
			options.examples &&
			!(options.examples.length === 1 && options.examples[0] === "none") &&
			options.backend !== "convex"
		) {
			exitWithError(
				"Cannot use '--examples' when '--api' is set to 'none'. Please remove the --examples flag or choose an API type.",
			);
		}
	}
}

export function validateFullConfig(
	config: Partial<ProjectConfig>,
	providedFlags: Set<string>,
	options: CLIInput,
) {
	validateDatabaseOrmAuth(config, providedFlags);
	validateDatabaseSetup(config, providedFlags);

	validateConvexConstraints(config, providedFlags);
	validateBackendNoneConstraints(config, providedFlags);
	validateBackendConstraints(config, providedFlags, options);

	validateFrontendConstraints(config, providedFlags);

	validateApiConstraints(config, options);

	validateServerDeployRequiresBackend(config.serverDeploy, config.backend);

	validateWorkersCompatibility(providedFlags, options, config);

	if (config.runtime === "workers" && config.serverDeploy === "none") {
		exitWithError(
			"Cloudflare Workers runtime requires a server deployment. Please choose 'wrangler' or 'alchemy' for --server-deploy.",
		);
	}

	if (config.addons && config.addons.length > 0) {
		validateAddonsAgainstFrontends(config.addons, config.frontend);
		config.addons = [...new Set(config.addons)];
	}

	validateExamplesCompatibility(
		config.examples ?? [],
		config.backend,
		config.database,
		config.frontend ?? [],
	);
}

export function validateConfigForProgrammaticUse(
	config: Partial<ProjectConfig>,
) {
	try {
		validateDatabaseOrmAuth(config);

		if (config.frontend && config.frontend.length > 0) {
			ensureSingleWebAndNative(config.frontend);
		}

		validateApiFrontendCompatibility(config.api, config.frontend);

		if (config.addons && config.addons.length > 0) {
			validateAddonsAgainstFrontends(config.addons, config.frontend);
		}

		validateExamplesCompatibility(
			config.examples ?? [],
			config.backend,
			config.database,
			config.frontend ?? [],
		);
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error(String(error));
	}
}
