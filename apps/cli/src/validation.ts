import path from "node:path";
import { consola } from "consola";
import { WEB_FRAMEWORKS } from "./constants";
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
				consola.fatal(
					"Cannot use '--examples' when '--api' is set to 'none'. Please remove the --examples flag or choose an API type.",
				);
				process.exit(1);
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
			consola.fatal(
				`'--runtime none' is only supported with '--backend convex' or '--backend none'. Please choose 'bun', 'node', or remove the --runtime flag.`,
			);
			process.exit(1);
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
			consola.fatal(
				`Invalid project name: ${
					result.error.issues[0]?.message || "Invalid project name"
				}`,
			);
			process.exit(1);
		}
		config.projectName = projectName;
	} else if (options.projectDirectory) {
		const baseName = path.basename(
			path.resolve(process.cwd(), options.projectDirectory),
		);
		const result = ProjectNameSchema.safeParse(baseName);
		if (!result.success) {
			consola.fatal(
				`Invalid project name: ${
					result.error.issues[0]?.message || "Invalid project name"
				}`,
			);
			process.exit(1);
		}
		config.projectName = baseName;
	}

	if (options.frontend && options.frontend.length > 0) {
		if (options.frontend.includes("none")) {
			if (options.frontend.length > 1) {
				consola.fatal(`Cannot combine 'none' with other frontend options.`);
				process.exit(1);
			}
			config.frontend = [];
		} else {
			const validOptions = options.frontend.filter(
				(f): f is Frontend => f !== "none",
			);
			const webFrontends = validOptions.filter((f) =>
				WEB_FRAMEWORKS.includes(f),
			);
			const nativeFrontends = validOptions.filter(
				(f) => f === "native-nativewind" || f === "native-unistyles",
			);

			if (webFrontends.length > 1) {
				consola.fatal(
					"Cannot select multiple web frameworks. Choose only one of: tanstack-router, tanstack-start, react-router, next, nuxt, svelte, solid",
				);
				process.exit(1);
			}
			if (nativeFrontends.length > 1) {
				consola.fatal(
					"Cannot select multiple native frameworks. Choose only one of: native-nativewind, native-unistyles",
				);
				process.exit(1);
			}
			config.frontend = validOptions;
		}
	}
	if (options.addons && options.addons.length > 0) {
		if (options.addons.includes("none")) {
			if (options.addons.length > 1) {
				consola.fatal(`Cannot combine 'none' with other addons.`);
				process.exit(1);
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
				consola.fatal("Cannot combine 'none' with other examples.");
				process.exit(1);
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

	if (config.backend === "convex") {
		const incompatibleFlags: string[] = [];

		if (providedFlags.has("auth") && options.auth === true)
			incompatibleFlags.push("--auth");
		if (providedFlags.has("database") && options.database !== "none")
			incompatibleFlags.push(`--database ${options.database}`);
		if (providedFlags.has("orm") && options.orm !== "none")
			incompatibleFlags.push(`--orm ${options.orm}`);
		if (providedFlags.has("api") && options.api !== "none")
			incompatibleFlags.push(`--api ${options.api}`);
		if (providedFlags.has("runtime") && options.runtime !== "none")
			incompatibleFlags.push(`--runtime ${options.runtime}`);
		if (providedFlags.has("dbSetup") && options.dbSetup !== "none")
			incompatibleFlags.push(`--db-setup ${options.dbSetup}`);

		if (incompatibleFlags.length > 0) {
			consola.fatal(
				`The following flags are incompatible with '--backend convex': ${incompatibleFlags.join(
					", ",
				)}. Please remove them.`,
			);
			process.exit(1);
		}

		if (providedFlags.has("frontend") && options.frontend) {
			const incompatibleFrontends = options.frontend.filter(
				(f) => f === "nuxt" || f === "solid",
			);
			if (incompatibleFrontends.length > 0) {
				consola.fatal(
					`The following frontends are not compatible with '--backend convex': ${incompatibleFrontends.join(
						", ",
					)}. Please choose a different frontend or backend.`,
				);
				process.exit(1);
			}
		}

		config.auth = false;
		config.database = "none";
		config.orm = "none";
		config.api = "none";
		config.runtime = "none";
		config.dbSetup = "none";
		config.examples = ["todo"];
	} else if (config.backend === "none") {
		const incompatibleFlags: string[] = [];

		if (providedFlags.has("auth") && options.auth === true)
			incompatibleFlags.push("--auth");
		if (providedFlags.has("database") && options.database !== "none")
			incompatibleFlags.push(`--database ${options.database}`);
		if (providedFlags.has("orm") && options.orm !== "none")
			incompatibleFlags.push(`--orm ${options.orm}`);
		if (providedFlags.has("api") && options.api !== "none")
			incompatibleFlags.push(`--api ${options.api}`);
		if (providedFlags.has("runtime") && options.runtime !== "none")
			incompatibleFlags.push(`--runtime ${options.runtime}`);
		if (providedFlags.has("dbSetup") && options.dbSetup !== "none")
			incompatibleFlags.push(`--db-setup ${options.dbSetup}`);
		if (providedFlags.has("examples") && options.examples) {
			const hasNonNoneExamples = options.examples.some((ex) => ex !== "none");
			if (hasNonNoneExamples) {
				incompatibleFlags.push("--examples");
			}
		}

		if (incompatibleFlags.length > 0) {
			consola.fatal(
				`The following flags are incompatible with '--backend none': ${incompatibleFlags.join(
					", ",
				)}. Please remove them.`,
			);
			process.exit(1);
		}

		config.auth = false;
		config.database = "none";
		config.orm = "none";
		config.api = "none";
		config.runtime = "none";
		config.dbSetup = "none";
		config.examples = [];
	}

	if (config.orm === "mongoose" && config.database !== "mongodb") {
		consola.fatal(
			"Mongoose ORM requires MongoDB database. Please use '--database mongodb' or choose a different ORM.",
		);
		process.exit(1);
	}

	if (
		config.database === "mongodb" &&
		config.orm &&
		config.orm !== "mongoose" &&
		config.orm !== "prisma"
	) {
		consola.fatal(
			"MongoDB database requires Mongoose or Prisma ORM. Please use '--orm mongoose' or '--orm prisma' or choose a different database.",
		);
		process.exit(1);
	}

	if (config.orm === "drizzle" && config.database === "mongodb") {
		consola.fatal(
			"Drizzle ORM does not support MongoDB. Please use '--orm mongoose' or '--orm prisma' or choose a different database.",
		);
		process.exit(1);
	}

	if (config.database && config.database !== "none" && config.orm === "none") {
		consola.fatal(
			"Database selection requires an ORM. Please choose '--orm drizzle', '--orm prisma', or '--orm mongoose'.",
		);
		process.exit(1);
	}

	if (config.orm && config.orm !== "none" && config.database === "none") {
		consola.fatal(
			"ORM selection requires a database. Please choose a database or set '--orm none'.",
		);
		process.exit(1);
	}

	if (config.auth && config.database === "none") {
		consola.fatal(
			"Authentication requires a database. Please choose a database or set '--no-auth'.",
		);
		process.exit(1);
	}

	if (
		config.dbSetup &&
		config.dbSetup !== "none" &&
		config.database === "none"
	) {
		consola.fatal(
			"Database setup requires a database. Please choose a database or set '--db-setup none'.",
		);
		process.exit(1);
	}

	if (config.dbSetup === "turso" && config.database !== "sqlite") {
		consola.fatal(
			"Turso setup requires SQLite database. Please use '--database sqlite' or choose a different setup.",
		);
		process.exit(1);
	}

	if (config.dbSetup === "neon" && config.database !== "postgres") {
		consola.fatal(
			"Neon setup requires PostgreSQL database. Please use '--database postgres' or choose a different setup.",
		);
		process.exit(1);
	}

	if (config.dbSetup === "prisma-postgres" && config.database !== "postgres") {
		consola.fatal(
			"Prisma PostgreSQL setup requires PostgreSQL database. Please use '--database postgres' or choose a different setup.",
		);
		process.exit(1);
	}

	if (config.dbSetup === "mongodb-atlas" && config.database !== "mongodb") {
		consola.fatal(
			"MongoDB Atlas setup requires MongoDB database. Please use '--database mongodb' or choose a different setup.",
		);
		process.exit(1);
	}

	if (config.dbSetup === "supabase" && config.database !== "postgres") {
		consola.fatal(
			"Supabase setup requires PostgreSQL database. Please use '--database postgres' or choose a different setup.",
		);
		process.exit(1);
	}

	if (config.dbSetup === "d1") {
		if (config.database !== "sqlite") {
			consola.fatal(
				"Cloudflare D1 setup requires SQLite database. Please use '--database sqlite' or choose a different setup.",
			);
			process.exit(1);
		}

		if (config.runtime !== "workers") {
			consola.fatal(
				"Cloudflare D1 setup requires the Cloudflare Workers runtime. Please use '--runtime workers' or choose a different setup.",
			);
			process.exit(1);
		}
	}

	if (config.dbSetup === "docker" && config.database === "sqlite") {
		consola.fatal(
			"Docker setup is not compatible with SQLite database. SQLite is file-based and doesn't require Docker. Please use '--database postgres', '--database mysql', '--database mongodb', or choose a different setup.",
		);
		process.exit(1);
	}

	if (config.dbSetup === "docker" && config.runtime === "workers") {
		consola.fatal(
			"Docker setup is not compatible with Cloudflare Workers runtime. Workers runtime uses serverless databases (D1) and doesn't support local Docker containers. Please use '--db-setup d1' for SQLite or choose a different runtime.",
		);
		process.exit(1);
	}

	if (
		providedFlags.has("runtime") &&
		options.runtime === "workers" &&
		config.backend &&
		config.backend !== "hono"
	) {
		consola.fatal(
			`Cloudflare Workers runtime (--runtime workers) is only supported with Hono backend (--backend hono). Current backend: ${config.backend}. Please use '--backend hono' or choose a different runtime.`,
		);
		process.exit(1);
	}

	if (
		providedFlags.has("backend") &&
		config.backend &&
		config.backend !== "hono" &&
		config.runtime === "workers"
	) {
		consola.fatal(
			`Backend '${config.backend}' is not compatible with Cloudflare Workers runtime. Cloudflare Workers runtime is only supported with Hono backend. Please use '--backend hono' or choose a different runtime.`,
		);
		process.exit(1);
	}

	if (
		providedFlags.has("runtime") &&
		options.runtime === "workers" &&
		config.orm &&
		config.orm !== "drizzle" &&
		config.orm !== "none"
	) {
		consola.fatal(
			`Cloudflare Workers runtime (--runtime workers) is only supported with Drizzle ORM (--orm drizzle) or no ORM (--orm none). Current ORM: ${config.orm}. Please use '--orm drizzle', '--orm none', or choose a different runtime.`,
		);
		process.exit(1);
	}

	if (
		providedFlags.has("orm") &&
		config.orm &&
		config.orm !== "drizzle" &&
		config.orm !== "none" &&
		config.runtime === "workers"
	) {
		consola.fatal(
			`ORM '${config.orm}' is not compatible with Cloudflare Workers runtime. Cloudflare Workers runtime is only supported with Drizzle ORM or no ORM. Please use '--orm drizzle', '--orm none', or choose a different runtime.`,
		);
		process.exit(1);
	}

	if (
		providedFlags.has("runtime") &&
		options.runtime === "workers" &&
		config.database === "mongodb"
	) {
		consola.fatal(
			"Cloudflare Workers runtime (--runtime workers) is not compatible with MongoDB database. MongoDB requires Prisma or Mongoose ORM, but Workers runtime only supports Drizzle ORM. Please use a different database or runtime.",
		);
		process.exit(1);
	}

	if (
		providedFlags.has("runtime") &&
		options.runtime === "workers" &&
		config.dbSetup === "docker"
	) {
		consola.fatal(
			"Cloudflare Workers runtime (--runtime workers) is not compatible with Docker setup. Workers runtime uses serverless databases (D1) and doesn't support local Docker containers. Please use '--db-setup d1' for SQLite or choose a different runtime.",
		);
		process.exit(1);
	}

	if (
		providedFlags.has("database") &&
		config.database === "mongodb" &&
		config.runtime === "workers"
	) {
		consola.fatal(
			"MongoDB database is not compatible with Cloudflare Workers runtime. MongoDB requires Prisma or Mongoose ORM, but Workers runtime only supports Drizzle ORM. Please use a different database or runtime.",
		);
		process.exit(1);
	}

	if (
		providedFlags.has("db-setup") &&
		options.dbSetup === "docker" &&
		config.runtime === "workers"
	) {
		consola.fatal(
			"Docker setup (--db-setup docker) is not compatible with Cloudflare Workers runtime. Workers runtime uses serverless databases (D1) and doesn't support local Docker containers. Please use '--db-setup d1' for SQLite or choose a different runtime.",
		);
		process.exit(1);
	}

	const hasWebFrontendFlag = (config.frontend ?? []).some((f) =>
		WEB_FRAMEWORKS.includes(f),
	);

	if (
		config.webDeploy &&
		config.webDeploy !== "none" &&
		!hasWebFrontendFlag &&
		providedFlags.has("frontend")
	) {
		consola.fatal(
			"'--web-deploy' requires a web frontend. Please select a web frontend or set '--web-deploy none'.",
		);
		process.exit(1);
	}

	return config;
}

export function validateConfigCompatibility(config: Partial<ProjectConfig>) {
	const effectiveDatabase = config.database;
	const effectiveBackend = config.backend;
	const effectiveFrontend = config.frontend;
	const effectiveApi = config.api;
	const effectiveRuntime = config.runtime;

	if (effectiveRuntime === "workers" && effectiveBackend !== "hono") {
		consola.fatal(
			`Cloudflare Workers runtime is only supported with Hono backend. Current backend: ${effectiveBackend}. Please use a different runtime or change to Hono backend.`,
		);
		process.exit(1);
	}

	const effectiveOrm = config.orm;
	if (
		effectiveRuntime === "workers" &&
		effectiveOrm !== "drizzle" &&
		effectiveOrm !== "none"
	) {
		consola.fatal(
			`Cloudflare Workers runtime is only supported with Drizzle ORM or no ORM. Current ORM: ${effectiveOrm}. Please use a different runtime or change to Drizzle ORM or no ORM.`,
		);
		process.exit(1);
	}

	if (effectiveRuntime === "workers" && effectiveDatabase === "mongodb") {
		consola.fatal(
			"Cloudflare Workers runtime is not compatible with MongoDB database. MongoDB requires Prisma or Mongoose ORM, but Workers runtime only supports Drizzle ORM. Please use a different database or runtime.",
		);
		process.exit(1);
	}

	if (effectiveRuntime === "workers" && config.dbSetup === "docker") {
		consola.fatal(
			"Cloudflare Workers runtime is not compatible with Docker setup. Workers runtime uses serverless databases (D1) and doesn't support local Docker containers. Please use a different runtime or change to D1 database setup.",
		);
		process.exit(1);
	}

	const includesNuxt = effectiveFrontend?.includes("nuxt");
	const includesSvelte = effectiveFrontend?.includes("svelte");
	const includesSolid = effectiveFrontend?.includes("solid");

	if (
		(includesNuxt || includesSvelte || includesSolid) &&
		effectiveApi === "trpc"
	) {
		consola.fatal(
			`tRPC API is not supported with '${
				includesNuxt ? "nuxt" : includesSvelte ? "svelte" : "solid"
			}' frontend. Please use --api orpc or --api none or remove '${
				includesNuxt ? "nuxt" : includesSvelte ? "svelte" : "solid"
			}' from --frontend.`,
		);
		process.exit(1);
	}

	if (config.addons && config.addons.length > 0) {
		const webSpecificAddons = ["pwa", "tauri"];
		const hasWebSpecificAddons = config.addons.some((addon) =>
			webSpecificAddons.includes(addon),
		);
		const hasCompatibleWebFrontend = effectiveFrontend?.some((f) => {
			const isPwaCompatible =
				f === "tanstack-router" ||
				f === "react-router" ||
				f === "solid" ||
				f === "next";
			const isTauriCompatible =
				f === "tanstack-router" ||
				f === "react-router" ||
				f === "nuxt" ||
				f === "svelte" ||
				f === "solid" ||
				f === "next";

			if (config.addons?.includes("pwa") && config.addons?.includes("tauri")) {
				return isPwaCompatible && isTauriCompatible;
			}
			if (config.addons?.includes("pwa")) {
				return isPwaCompatible;
			}
			if (config.addons?.includes("tauri")) {
				return isTauriCompatible;
			}
			return true;
		});

		if (hasWebSpecificAddons && !hasCompatibleWebFrontend) {
			let incompatibleReason = "Selected frontend is not compatible.";
			if (config.addons.includes("pwa")) {
				incompatibleReason =
					"PWA requires tanstack-router, react-router, next, or solid.";
			}
			if (config.addons.includes("tauri")) {
				incompatibleReason =
					"Tauri requires tanstack-router, react-router, nuxt, svelte, solid, or next.";
			}
			consola.fatal(
				`Incompatible addon/frontend combination: ${incompatibleReason}`,
			);
			process.exit(1);
		}

		config.addons = [...new Set(config.addons)];
	}

	if (
		config.examples &&
		config.examples.length > 0 &&
		!config.examples.includes("none")
	) {
		if (
			config.examples.includes("todo") &&
			effectiveBackend !== "convex" &&
			effectiveBackend !== "none" &&
			effectiveDatabase === "none"
		) {
			consola.fatal(
				"The 'todo' example requires a database if a backend (other than Convex) is present. Cannot use --examples todo when database is 'none' and a backend is selected.",
			);
			process.exit(1);
		}

		if (config.examples.includes("ai") && effectiveBackend === "elysia") {
			consola.fatal(
				"The 'ai' example is not compatible with the Elysia backend.",
			);
			process.exit(1);
		}

		if (config.examples.includes("ai") && includesSolid) {
			consola.fatal(
				"The 'ai' example is not compatible with the Solid frontend.",
			);
			process.exit(1);
		}
	}
}

export function getProvidedFlags(options: CLIInput): Set<string> {
	return new Set(
		Object.keys(options).filter(
			(key) => options[key as keyof CLIInput] !== undefined,
		),
	);
}
