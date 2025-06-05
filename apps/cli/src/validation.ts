import path from "node:path";
import { log } from "@clack/prompts";
import { consola } from "consola";
import type {
	API,
	Addons,
	Backend,
	Database,
	DatabaseSetup,
	Examples,
	Frontend,
	ORM,
	PackageManager,
	ProjectConfig,
	Runtime,
	YargsArgv,
} from "./types";

export function processAndValidateFlags(
	options: YargsArgv,
	projectName?: string,
): Partial<ProjectConfig> {
	const config: Partial<ProjectConfig> = {};
	const providedFlags: Set<string> = new Set(
		Object.keys(options).filter((key) => key !== "_" && key !== "$0"),
	);

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

	if (projectName) {
		config.projectName = projectName;
	} else if (options.projectDirectory) {
		config.projectName = path.basename(
			path.resolve(process.cwd(), options.projectDirectory),
		);
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
			const webFrontends = validOptions.filter(
				(f) =>
					f === "tanstack-router" ||
					f === "react-router" ||
					f === "tanstack-start" ||
					f === "next" ||
					f === "nuxt" ||
					f === "svelte" ||
					f === "solid" ||
					f === "angular",
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
				(f) => f === "nuxt" || f === "solid" || f === "angular",
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
	} else {
		if (config.database === "none") {
			if (providedFlags.has("orm") && options.orm !== "none") {
				consola.fatal(
					`'--orm ${options.orm}' is incompatible with '--database none'. Please use '--orm none' or choose a database.`,
				);
				process.exit(1);
			}
			if (providedFlags.has("auth") && options.auth === true) {
				consola.fatal(
					`'--auth' requires a database. Cannot use '--auth' with '--database none'.`,
				);
				process.exit(1);
			}
			if (providedFlags.has("dbSetup") && options.dbSetup !== "none") {
				consola.fatal(
					`'--db-setup ${options.dbSetup}' requires a database. Cannot use with '--database none'.`,
				);
				process.exit(1);
			}

			config.orm = "none";
			config.auth = false;
			config.dbSetup = "none";

			log.info(
				"Due to '--database none', '--orm' has been automatically set to 'none'.",
			);
			log.info(
				"Due to '--database none', '--auth' has been automatically set to 'false'.",
			);
			log.info(
				"Due to '--database none', '--db-setup' has been automatically set to 'none'.",
			);
		}

		if (config.orm === "mongoose") {
			if (!providedFlags.has("database")) {
				config.database = "mongodb";
				log.info(
					"Due to '--orm mongoose', '--database' has been automatically set to 'mongodb'.",
				);
			} else if (config.database !== "mongodb") {
				consola.fatal(
					`'--orm mongoose' requires '--database mongodb'. Cannot use '--orm mongoose' with '--database ${config.database}'.`,
				);
				process.exit(1);
			}
		}

		if (config.dbSetup) {
			if (config.dbSetup === "turso") {
				if (!providedFlags.has("database")) {
					config.database = "sqlite";
					log.info(
						"Due to '--db-setup turso', '--database' has been automatically set to 'sqlite'.",
					);
				} else if (config.database !== "sqlite") {
					consola.fatal(
						`'--db-setup turso' requires '--database sqlite'. Cannot use with '--database ${config.database}'.`,
					);
					process.exit(1);
				}
				if (!providedFlags.has("orm")) {
					config.orm = "drizzle";
					log.info(
						"Due to '--db-setup turso', '--orm' has been automatically set to 'drizzle'.",
					);
				} else if (config.orm !== "drizzle") {
					consola.fatal(
						`'--db-setup turso' requires '--orm drizzle'. Cannot use with '--orm ${config.orm}'.`,
					);
					process.exit(1);
				}
			} else if (config.dbSetup === "prisma-postgres") {
				if (!providedFlags.has("database")) {
					config.database = "postgres";
					log.info(
						"Due to '--db-setup prisma-postgres', '--database' has been automatically set to 'postgres'.",
					);
				} else if (config.database !== "postgres") {
					consola.fatal(
						`'--db-setup prisma-postgres' requires '--database postgres'. Cannot use with '--database ${config.database}'.`,
					);
					process.exit(1);
				}
				if (!providedFlags.has("orm")) {
					config.orm = "prisma";
					log.info(
						"Due to '--db-setup prisma-postgres', '--orm' has been automatically set to 'prisma'.",
					);
				} else if (config.orm !== "prisma") {
					consola.fatal(
						`'--db-setup prisma-postgres' requires '--orm prisma'. Cannot use with '--orm ${config.orm}'.`,
					);
					process.exit(1);
				}
			} else if (config.dbSetup === "supabase") {
				if (!providedFlags.has("database")) {
					config.database = "postgres";
					log.info(
						"Due to '--db-setup supabase', '--database' has been automatically set to 'postgres'.",
					);
				} else if (config.database !== "postgres") {
					consola.fatal(
						`'--db-setup supabase' requires '--database postgres'. Cannot use with '--database ${config.database}'.`,
					);
					process.exit(1);
				}
			} else if (config.dbSetup === "neon") {
				if (!providedFlags.has("database")) {
					config.database = "postgres";
					log.info(
						"Due to '--db-setup neon', '--database' has been automatically set to 'postgres'.",
					);
				} else if (config.database !== "postgres") {
					consola.fatal(
						`'--db-setup neon' requires '--database postgres'. Cannot use with '--database ${config.database}'.`,
					);
					process.exit(1);
				}
			} else if (config.dbSetup === "mongodb-atlas") {
				if (!providedFlags.has("database")) {
					config.database = "mongodb";
					log.info(
						"Due to '--db-setup mongodb-atlas', '--database' has been automatically set to 'mongodb'.",
					);
				} else if (config.database !== "mongodb") {
					consola.fatal(
						`'--db-setup mongodb-atlas' requires '--database mongodb'. Cannot use with '--database ${config.database}'.`,
					);
					process.exit(1);
				}
			}
		}

		if (config.database === "mongodb" && config.orm === "drizzle") {
			consola.fatal(
				`'--database mongodb' is incompatible with '--orm drizzle'. Use '--orm mongoose' or '--orm prisma' with MongoDB.`,
			);
			process.exit(1);
		}
	}

	return config;
}

export function validateConfigCompatibility(
	config: Partial<ProjectConfig>,
): void {
	const effectiveDatabase = config.database;
	const effectiveBackend = config.backend;
	const effectiveFrontend = config.frontend;
	const effectiveApi = config.api;

	const includesNuxt = effectiveFrontend?.includes("nuxt");
	const includesSvelte = effectiveFrontend?.includes("svelte");
	const includesSolid = effectiveFrontend?.includes("solid");
	const includesAngular = effectiveFrontend?.includes("angular");
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
				f === "next"
			const isTauriCompatible =
				f === "tanstack-router" ||
				f === "react-router" ||
				f === "nuxt" ||
				f === "svelte" ||
				f === "solid" ||
				f === "next" ||
				f === "angular";

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

		if (config.addons.includes("husky") && !config.addons.includes("biome")) {
			consola.warn(
				"Husky addon is recommended to be used with Biome for lint-staged configuration.",
			);
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
		if (config.examples.includes("ai") && includesAngular) {
			consola.fatal(
				"The 'ai' example is not compatible with the Angular frontend.",
			);
			process.exit(1);
		}
	}
}
