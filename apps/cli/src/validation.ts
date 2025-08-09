import path from "node:path";
import {
	type Addons,
	type API,
	type Backend,
	type CLIInput,
	type Database,
	type DatabaseSetup,
	type Examples,
	type Frontend,
	type ORM,
	type PackageManager,
	type ProjectConfig,
	ProjectNameSchema,
	type Runtime,
	type WebDeploy,
} from "./types";
import {
	coerceBackendPresets,
	ensureSingleWebAndNative,
	incompatibleFlagsForBackend,
	isWebFrontend,
	validateAddonsAgainstFrontends,
	validateApiFrontendCompatibility,
	validateClerkFrontendCompatibility,
	validateExamplesCompatibility,
	validateWebDeployRequiresWebFrontend,
	validateWorkersCompatibility,
} from "./utils/compatibility-rules";
import { exitWithError } from "./utils/errors";

export function processAndValidateFlags(
	options: CLIInput,
	providedFlags: Set<string>,
	projectName?: string,
): Partial<ProjectConfig> {
	const config: Partial<ProjectConfig> = {};

	if (options.api) {
		config.api = options.api as API;
		if (options.api === "none") {
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

	if (options.backend) {
		config.backend = options.backend as Backend;
	}

	if (
		providedFlags.has("backend") &&
		config.backend &&
		config.backend !== "convex" &&
		config.backend !== "none"
	) {
		if (providedFlags.has("runtime") && options.runtime === "none") {
			exitWithError(
				`'--runtime none' is only supported with '--backend convex' or '--backend none'. Please choose 'bun', 'node', or remove the --runtime flag.`,
			);
		}
	}

	if (options.database) {
		config.database = options.database as Database;
	}
	if (options.orm) {
		config.orm = options.orm as ORM;
	}
	if (options.auth !== undefined) {
		config.auth = options.auth;
	}
	if (options.git !== undefined) {
		config.git = options.git;
	}
	if (options.install !== undefined) {
		config.install = options.install;
	}
	if (options.runtime) {
		config.runtime = options.runtime as Runtime;
	}
	if (options.dbSetup) {
		config.dbSetup = options.dbSetup as DatabaseSetup;
	}
	if (options.packageManager) {
		config.packageManager = options.packageManager as PackageManager;
	}

	if (options.webDeploy) {
		config.webDeploy = options.webDeploy as WebDeploy;
	}

	if (projectName) {
		const result = ProjectNameSchema.safeParse(path.basename(projectName));
		if (!result.success) {
			exitWithError(
				`Invalid project name: ${
					result.error.issues[0]?.message || "Invalid project name"
				}`,
			);
		}
		config.projectName = projectName;
	} else if (options.projectDirectory) {
		const baseName = path.basename(
			path.resolve(process.cwd(), options.projectDirectory),
		);
		const result = ProjectNameSchema.safeParse(baseName);
		if (!result.success) {
			exitWithError(
				`Invalid project name: ${
					result.error.issues[0]?.message || "Invalid project name"
				}`,
			);
		}
		config.projectName = baseName;
	}

	if (options.frontend && options.frontend.length > 0) {
		if (options.frontend.includes("none")) {
			if (options.frontend.length > 1) {
				exitWithError(`Cannot combine 'none' with other frontend options.`);
			}
			config.frontend = [];
		} else {
			const validOptions = options.frontend.filter(
				(f): f is Frontend => f !== "none",
			);
			ensureSingleWebAndNative(validOptions);
			config.frontend = validOptions;
		}
	}

	if (
		providedFlags.has("api") &&
		providedFlags.has("frontend") &&
		config.api &&
		config.frontend &&
		config.frontend.length > 0
	) {
		validateApiFrontendCompatibility(config.api, config.frontend);
	}

	// Validate Clerk authentication compatibility with frontend frameworks
	if (config.auth && config.frontend && config.frontend.length > 0) {
		validateClerkFrontendCompatibility(config.auth, config.frontend);
	}
	if (options.addons && options.addons.length > 0) {
		if (options.addons.includes("none")) {
			if (options.addons.length > 1) {
				exitWithError(`Cannot combine 'none' with other addons.`);
			}
			config.addons = [];
		} else {
			config.addons = options.addons.filter(
				(addon): addon is Addons => addon !== "none",
			);
		}
	}
	if (options.examples && options.examples.length > 0) {
		if (options.examples.includes("none")) {
			if (options.examples.length > 1) {
				exitWithError("Cannot combine 'none' with other examples.");
			}
			config.examples = [];
		} else {
			config.examples = options.examples.filter(
				(ex): ex is Examples => ex !== "none",
			);
			if (options.examples.includes("none") && config.backend !== "convex") {
				config.examples = [];
			}
		}
	}

	if (config.backend === "convex" || config.backend === "none") {
		const incompatibleFlags = incompatibleFlagsForBackend(
			config.backend,
			providedFlags,
			options,
		);
		if (incompatibleFlags.length > 0) {
			exitWithError(
				`The following flags are incompatible with '--backend ${config.backend}': ${incompatibleFlags.join(
					", ",
				)}. Please remove them.`,
			);
		}

		if (
			config.backend === "convex" &&
			providedFlags.has("frontend") &&
			options.frontend
		) {
			const incompatibleFrontends = options.frontend.filter(
				(f) => f === "solid",
			);
			if (incompatibleFrontends.length > 0) {
				exitWithError(
					`The following frontends are not compatible with '--backend convex': ${incompatibleFrontends.join(
						", ",
					)}. Please choose a different frontend or backend.`,
				);
			}
		}

		coerceBackendPresets(config);
	}

	if (
		providedFlags.has("orm") &&
		providedFlags.has("database") &&
		config.orm === "mongoose" &&
		config.database !== "mongodb"
	) {
		exitWithError(
			"Mongoose ORM requires MongoDB database. Please use '--database mongodb' or choose a different ORM.",
		);
	}

	if (
		providedFlags.has("database") &&
		providedFlags.has("orm") &&
		config.database === "mongodb" &&
		config.orm &&
		config.orm !== "mongoose" &&
		config.orm !== "prisma"
	) {
		exitWithError(
			"MongoDB database requires Mongoose or Prisma ORM. Please use '--orm mongoose' or '--orm prisma' or choose a different database.",
		);
	}

	if (
		providedFlags.has("orm") &&
		providedFlags.has("database") &&
		config.orm === "drizzle" &&
		config.database === "mongodb"
	) {
		exitWithError(
			"Drizzle ORM does not support MongoDB. Please use '--orm mongoose' or '--orm prisma' or choose a different database.",
		);
	}

	if (
		providedFlags.has("database") &&
		providedFlags.has("orm") &&
		config.database &&
		config.database !== "none" &&
		config.orm === "none"
	) {
		exitWithError(
			"Database selection requires an ORM. Please choose '--orm drizzle', '--orm prisma', or '--orm mongoose'.",
		);
	}

	if (
		providedFlags.has("orm") &&
		providedFlags.has("database") &&
		config.orm &&
		config.orm !== "none" &&
		config.database === "none"
	) {
		exitWithError(
			"ORM selection requires a database. Please choose a database or set '--orm none'.",
		);
	}

	if (
		providedFlags.has("auth") &&
		providedFlags.has("database") &&
		config.auth &&
		config.database === "none"
	) {
		exitWithError(
			"Authentication requires a database. Please choose a database or set '--no-auth'.",
		);
	}

	if (
		providedFlags.has("dbSetup") &&
		providedFlags.has("database") &&
		config.dbSetup &&
		config.dbSetup !== "none" &&
		config.database === "none"
	) {
		exitWithError(
			"Database setup requires a database. Please choose a database or set '--db-setup none'.",
		);
	}

	if (
		providedFlags.has("dbSetup") &&
		(config.database ? providedFlags.has("database") : true) &&
		config.dbSetup === "turso" &&
		config.database !== "sqlite"
	) {
		exitWithError(
			"Turso setup requires SQLite database. Please use '--database sqlite' or choose a different setup.",
		);
	}

	if (
		providedFlags.has("dbSetup") &&
		(config.database ? providedFlags.has("database") : true) &&
		config.dbSetup === "neon" &&
		config.database !== "postgres"
	) {
		exitWithError(
			"Neon setup requires PostgreSQL database. Please use '--database postgres' or choose a different setup.",
		);
	}

	if (
		providedFlags.has("dbSetup") &&
		(config.database ? providedFlags.has("database") : true) &&
		config.dbSetup === "prisma-postgres" &&
		config.database !== "postgres"
	) {
		exitWithError(
			"Prisma PostgreSQL setup requires PostgreSQL database. Please use '--database postgres' or choose a different setup.",
		);
	}

	if (
		providedFlags.has("dbSetup") &&
		(config.database ? providedFlags.has("database") : true) &&
		config.dbSetup === "mongodb-atlas" &&
		config.database !== "mongodb"
	) {
		exitWithError(
			"MongoDB Atlas setup requires MongoDB database. Please use '--database mongodb' or choose a different setup.",
		);
	}

	if (
		providedFlags.has("dbSetup") &&
		(config.database ? providedFlags.has("database") : true) &&
		config.dbSetup === "supabase" &&
		config.database !== "postgres"
	) {
		exitWithError(
			"Supabase setup requires PostgreSQL database. Please use '--database postgres' or choose a different setup.",
		);
	}

	if (config.dbSetup === "d1") {
		if (
			(providedFlags.has("dbSetup") && providedFlags.has("database")) ||
			(providedFlags.has("dbSetup") && !config.database)
		) {
			if (config.database !== "sqlite") {
				exitWithError(
					"Cloudflare D1 setup requires SQLite database. Please use '--database sqlite' or choose a different setup.",
				);
			}
		}

		if (
			(providedFlags.has("dbSetup") && providedFlags.has("runtime")) ||
			(providedFlags.has("dbSetup") && !config.runtime)
		) {
			if (config.runtime !== "workers") {
				exitWithError(
					"Cloudflare D1 setup requires the Cloudflare Workers runtime. Please use '--runtime workers' or choose a different setup.",
				);
			}
		}
	}

	if (
		providedFlags.has("dbSetup") &&
		providedFlags.has("database") &&
		config.dbSetup === "docker" &&
		config.database === "sqlite"
	) {
		exitWithError(
			"Docker setup is not compatible with SQLite database. SQLite is file-based and doesn't require Docker. Please use '--database postgres', '--database mysql', '--database mongodb', or choose a different setup.",
		);
	}

	if (
		providedFlags.has("dbSetup") &&
		providedFlags.has("runtime") &&
		config.dbSetup === "docker" &&
		config.runtime === "workers"
	) {
		exitWithError(
			"Docker setup is not compatible with Cloudflare Workers runtime. Workers runtime uses serverless databases (D1) and doesn't support local Docker containers. Please use '--db-setup d1' for SQLite or choose a different runtime.",
		);
	}

	validateWorkersCompatibility(providedFlags, options, config);

	const hasWebFrontendFlag = (config.frontend ?? []).some((f) =>
		isWebFrontend(f),
	);
	validateWebDeployRequiresWebFrontend(config.webDeploy, hasWebFrontendFlag);

	return config;
}

export function validateConfigCompatibility(config: Partial<ProjectConfig>) {
	const effectiveDatabase = config.database;
	const effectiveBackend = config.backend;
	const effectiveFrontend = config.frontend;
	const effectiveApi = config.api;

	validateApiFrontendCompatibility(effectiveApi, effectiveFrontend);

	if (config.addons && config.addons.length > 0) {
		validateAddonsAgainstFrontends(config.addons, effectiveFrontend);
		config.addons = [...new Set(config.addons)];
	}

	validateExamplesCompatibility(
		config.examples ?? [],
		effectiveBackend,
		effectiveDatabase,
		effectiveFrontend ?? [],
	);
}

export function getProvidedFlags(options: CLIInput): Set<string> {
	return new Set(
		Object.keys(options).filter(
			(key) => options[key as keyof CLIInput] !== undefined,
		),
	);
}
