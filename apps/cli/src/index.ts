import path from "node:path";
import { cancel, intro, log, outro } from "@clack/prompts";
import { consola } from "consola";
import fs from "fs-extra";
import pc from "picocolors";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { DEFAULT_CONFIG } from "./constants";
import { createProject } from "./helpers/create-project";
import { gatherConfig } from "./prompts/config-prompts";
import { getProjectName } from "./prompts/project-name";
import type {
 ProjectAddons,
 ProjectApi,
 ProjectBackend,
 ProjectConfig,
 ProjectDBSetup,
 ProjectDatabase,
 ProjectExamples,
 ProjectFrontend,
 ProjectOrm,
 ProjectPackageManager,
 ProjectRuntime,
 YargsArgv,
} from "./types";
import { displayConfig } from "./utils/display-config";
import { generateReproducibleCommand } from "./utils/generate-reproducible-command";
import { getLatestCLIVersion } from "./utils/get-latest-cli-version";
import { renderTitle } from "./utils/render-title";

const exit = () => process.exit(0);
process.on("SIGINT", exit);
process.on("SIGTERM", exit);

async function main() {
 const startTime = Date.now();

 try {
  const argv = await yargs(hideBin(process.argv))
   .scriptName("create-better-t-stack")
   .usage(
    "$0 [project-directory] [options]",
    "Create a new Better-T Stack project",
   )
   .positional("project-directory", {
    describe: "Project name/directory",
    type: "string",
   })
   .option("yes", {
    alias: "y",
    type: "boolean",
    describe: "Use default configuration and skip prompts",
    default: false,
   })
   .option("database", {
    type: "string",
    describe: "Database type",
    choices: ["none", "sqlite", "postgres", "mysql", "mongodb"],
   })
   .option("orm", {
    type: "string",
    describe: "ORM type",
    choices: ["drizzle", "prisma", "mongoose", "none"],
   })
   .option("auth", {
    type: "boolean",
    describe: "Include authentication (use --no-auth to exclude)",
   })
   .option("frontend", {
    type: "array",
    string: true,
    describe: "Frontend types",
    choices: [
     "tanstack-router",
     "react-router",
     "tanstack-start",
     "next",
     "nuxt",
     "native",
     "svelte",
     "none",
    ],
   })
   .option("addons", {
    type: "array",
    string: true,
    describe: "Additional addons",
    choices: [
     "pwa",
     "tauri",
     "starlight",
     "biome",
     "husky",
     "turborepo",
     "none",
    ],
   })
   .option("examples", {
    type: "array",
    string: true,
    describe: "Examples to include",
    choices: ["todo", "ai", "none"],
   })
   .option("git", {
    type: "boolean",
    describe: "Initialize git repository (use --no-git to skip)",
   })
   .option("package-manager", {
    alias: "pm",
    type: "string",
    describe: "Package manager",
    choices: ["npm", "pnpm", "bun"],
   })
   .option("install", {
    type: "boolean",
    describe: "Install dependencies (use --no-install to skip)",
   })
   .option("db-setup", {
    type: "string",
    describe: "Database setup",
    choices: ["turso", "neon", "prisma-postgres", "mongodb-atlas", "none"],
   })
   .option("backend", {
    type: "string",
    describe: "Backend framework",
    choices: ["hono", "express", "next", "elysia", "convex", "fastify"],
   })
   .option("runtime", {
    type: "string",
    describe: "Runtime",
    choices: ["bun", "node", "none"],
   })
   .option("api", {
    type: "string",
    describe: "API type",
    choices: ["trpc", "orpc", "none"],
   })
   .completion()
   .recommendCommands()
   .version(getLatestCLIVersion())
   .alias("version", "v")
   .help()
   .alias("help", "h")
   .strict()
   .wrap(null)
   .parse();

  const options = argv as YargsArgv;
  const projectDirectory = options.projectDirectory;

  renderTitle();

  const flagConfig = processAndValidateFlags(options, projectDirectory);

  intro(pc.magenta("Creating a new Better-T-Stack project"));

  if (!options.yes && Object.keys(flagConfig).length > 0) {
   log.info(pc.yellow("Using these pre-selected options:"));
   log.message(displayConfig(flagConfig));
   log.message("");
  }

  let config: ProjectConfig;
  if (options.yes) {
   config = {
    ...DEFAULT_CONFIG,
    projectName: projectDirectory ?? DEFAULT_CONFIG.projectName,
    ...flagConfig,
   };

			if (config.backend === "convex") {
				config.auth = false;
				config.database = "none";
				config.orm = "none";
				config.api = "none";
				config.runtime = "none";
				config.dbSetup = "none";
			} else if (config.database === "none") {
				config.orm = "none";
				config.auth = false;
				config.dbSetup = "none";
			}

   log.info(pc.yellow("Using these default/flag options:"));
   log.message(displayConfig(config));
   log.message("");
  } else {
   config = await gatherConfig(flagConfig);
  }

  const projectDir = path.resolve(process.cwd(), config.projectName);

  if (
   fs.pathExistsSync(projectDir) &&
   fs.readdirSync(projectDir).length > 0
  ) {
   const newProjectName = await getProjectName();
   config.projectName = newProjectName;
  }

  await createProject(config);

  log.success(
   pc.blue(
    `You can reproduce this setup with the following command:\n${generateReproducibleCommand(
     config,
    )}`,
   ),
  );

		const elapsedTimeInSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
		outro(
			pc.magenta(
				`Project created successfully in ${pc.bold(
					elapsedTimeInSeconds,
				)} seconds!`,
			),
		);
	} catch (error) {
		if (error instanceof Error) {
			if (error.name === "YError") {
				cancel(pc.red(`Invalid arguments: ${error.message}`));
			} else {
				consola.error(`An unexpected error occurred: ${error.message}`);
				if (!error.message.includes("is only supported with")) {
					consola.error(error.stack);
				}
			}
			process.exit(1);
		} else {
			consola.error("An unexpected error occurred.");
			console.error(error);
			process.exit(1);
		}
	}
}

function processAndValidateFlags(
 options: YargsArgv,
 projectDirectory?: string,
): Partial<ProjectConfig> {
	const config: Partial<ProjectConfig> = {};
	const providedFlags: Set<string> = new Set(
		Object.keys(options).filter((key) => key !== "_" && key !== "$0"),
	);

	if (options.api) {
		config.api = options.api as ProjectApi;
		if (options.api === "none") {
			if (options.backend && options.backend !== "convex") {
				consola.fatal(
					`'--api none' is only supported with '--backend convex'. Please choose a different API setting or use '--backend convex'.`,
				);
				process.exit(1);
			}
			config.backend = "convex";
		}
	}

	if (options.backend) {
		config.backend = options.backend as ProjectBackend;
	}

	if (
		providedFlags.has("backend") &&
		config.backend &&
		config.backend !== "convex"
	) {
		if (providedFlags.has("api") && options.api === "none") {
			consola.fatal(
				`'--api none' is only supported with '--backend convex'. Please choose 'trpc', 'orpc', or remove the --api flag.`,
			);
			process.exit(1);
		}
		if (providedFlags.has("runtime") && options.runtime === "none") {
			consola.fatal(
				`'--runtime none' is only supported with '--backend convex'. Please choose 'bun', 'node', or remove the --runtime flag.`,
			);
			process.exit(1);
		}
	}

	if (options.database) {
		config.database = options.database as ProjectDatabase;
	}
	if (options.orm) {
		config.orm = options.orm as ProjectOrm;
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
		config.runtime = options.runtime as ProjectRuntime;
	}
	if (options.dbSetup) {
		config.dbSetup = options.dbSetup as ProjectDBSetup;
	}
	if (options.packageManager) {
		config.packageManager = options.packageManager as ProjectPackageManager;
	}
	if (projectDirectory) {
		config.projectName = projectDirectory;
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
				(f): f is ProjectFrontend => f !== "none",
			);
			const webFrontends = validOptions.filter(
				(f) =>
					f === "tanstack-router" ||
					f === "react-router" ||
					f === "tanstack-start" ||
					f === "next" ||
					f === "nuxt" ||
					f === "svelte",
			);
			if (webFrontends.length > 1) {
				consola.fatal(
					"Cannot select multiple web frameworks. Choose only one of: tanstack-router, tanstack-start, react-router, next, nuxt, svelte",
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
				(addon): addon is ProjectAddons => addon !== "none",
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
				(ex): ex is ProjectExamples => ex !== "none",
			);
			if (config.backend !== "convex" && options.examples.includes("none")) {
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
		if (providedFlags.has("examples")) {
			incompatibleFlags.push("--examples");
		}

		if (incompatibleFlags.length > 0) {
			consola.fatal(
				`The following flags are incompatible with '--backend convex': ${incompatibleFlags.join(
					", ",
				)}. Please remove them. The 'todo' example is included automatically with Convex.`,
			);
			process.exit(1);
		}

		config.auth = false;
		config.database = "none";
		config.orm = "none";
		config.api = "none";
		config.runtime = "none";
		config.dbSetup = "none";
		config.examples = ["todo"];
	} else {
		const effectiveDatabase =
			config.database ?? (options.yes ? DEFAULT_CONFIG.database : undefined);
		const effectiveOrm =
			config.orm ?? (options.yes ? DEFAULT_CONFIG.orm : undefined);
		const effectiveAuth =
			config.auth ?? (options.yes ? DEFAULT_CONFIG.auth : undefined);
		const effectiveDbSetup =
			config.dbSetup ?? (options.yes ? DEFAULT_CONFIG.dbSetup : undefined);
		const effectiveExamples =
			config.examples ?? (options.yes ? DEFAULT_CONFIG.examples : undefined);
		const effectiveFrontend =
			config.frontend ?? (options.yes ? DEFAULT_CONFIG.frontend : undefined);
		const effectiveApi =
			config.api ?? (options.yes ? DEFAULT_CONFIG.api : undefined);
		const effectiveBackend =
			config.backend ?? (options.yes ? DEFAULT_CONFIG.backend : undefined);

		if (effectiveDatabase === "none") {
			if (providedFlags.has("orm") && options.orm !== "none") {
				consola.fatal(
					`Cannot use ORM '--orm ${options.orm}' when database is 'none'.`,
				);
				process.exit(1);
			}
			config.orm = "none";

			if (providedFlags.has("auth") && options.auth === true) {
				consola.fatal(
					"Authentication requires a database. Cannot use --auth when database is 'none'.",
				);
				process.exit(1);
			}
			config.auth = false;

			if (providedFlags.has("dbSetup") && options.dbSetup !== "none") {
				consola.fatal(
					`Database setup '--db-setup ${options.dbSetup}' requires a database. Cannot use when database is 'none'.`,
				);
				process.exit(1);
			}
			config.dbSetup = "none";
		}

		if (config.orm === "mongoose" && !providedFlags.has("database")) {
			config.database = "mongodb";
		}

		if (effectiveDatabase === "mongodb" && effectiveOrm === "drizzle") {
			consola.fatal(
				"Drizzle ORM is not compatible with MongoDB. Please use --orm prisma or --orm mongoose.",
			);
			process.exit(1);
		}

		if (
			effectiveOrm === "mongoose" &&
			effectiveDatabase &&
			effectiveDatabase !== "mongodb"
		) {
			consola.fatal(
				`Mongoose ORM requires MongoDB. Cannot use --orm mongoose with --database ${effectiveDatabase}.`,
			);
			process.exit(1);
		}

		if (config.dbSetup && config.dbSetup !== "none") {
			const dbSetup = config.dbSetup;

			if (!effectiveDatabase || effectiveDatabase === "none") {
				consola.fatal(
					`Database setup '--db-setup ${dbSetup}' requires a database. Cannot use when database is 'none'.`,
				);
				process.exit(1);
			}

			if (dbSetup === "turso") {
				if (effectiveDatabase && effectiveDatabase !== "sqlite") {
					consola.fatal(
						`Turso setup requires SQLite. Cannot use --db-setup turso with --database ${effectiveDatabase}`,
					);
					process.exit(1);
				}
				if (effectiveOrm !== "drizzle") {
					consola.fatal(
						`Turso setup requires Drizzle ORM. Cannot use --db-setup turso with --orm ${effectiveOrm ?? "none"}.`,
					);
					process.exit(1);
				}
			} else if (dbSetup === "prisma-postgres") {
				if (effectiveDatabase !== "postgres") {
					consola.fatal(
						`Prisma PostgreSQL setup requires PostgreSQL. Cannot use --db-setup prisma-postgres with --database ${effectiveDatabase}.`,
					);
					process.exit(1);
				}
				if (effectiveOrm !== "prisma") {
					consola.fatal(
						`Prisma PostgreSQL setup requires Prisma ORM. Cannot use --db-setup prisma-postgres with --orm ${effectiveOrm}.`,
					);
					process.exit(1);
				}
			} else if (dbSetup === "mongodb-atlas") {
				if (effectiveDatabase !== "mongodb") {
					consola.fatal(
						`MongoDB Atlas setup requires MongoDB. Cannot use --db-setup mongodb-atlas with --database ${effectiveDatabase}.`,
					);
					process.exit(1);
				}
				if (effectiveOrm !== "prisma" && effectiveOrm !== "mongoose") {
					consola.fatal(
						`MongoDB Atlas setup requires Prisma or Mongoose ORM. Cannot use --db-setup mongodb-atlas with --orm ${effectiveOrm}.`,
					);
					process.exit(1);
				}
			} else if (dbSetup === "neon") {
				if (effectiveDatabase !== "postgres") {
					consola.fatal(
						`Neon PostgreSQL setup requires PostgreSQL. Cannot use --db-setup neon with --database ${effectiveDatabase}.`,
					);
					process.exit(1);
				}
			}
		}

		const includesNuxt = effectiveFrontend?.includes("nuxt");
		const includesSvelte = effectiveFrontend?.includes("svelte");

		if ((includesNuxt || includesSvelte) && effectiveApi === "trpc") {
			consola.fatal(
				`tRPC API is not supported with '${
					includesNuxt ? "nuxt" : "svelte"
				}' frontend. Please use --api orpc or remove '${
					includesNuxt ? "nuxt" : "svelte"
				}' from --frontend.`,
			);
			process.exit(1);
		}
		if (
			(includesNuxt || includesSvelte) &&
			effectiveApi !== "orpc" &&
			(!options.api || (options.yes && options.api !== "trpc"))
		) {
			if (config.api !== "none") {
				config.api = "orpc";
			}
		}

		if (config.addons && config.addons.length > 0) {
			const webSpecificAddons = ["pwa", "tauri"];
			const hasWebSpecificAddons = config.addons.some((addon) =>
				webSpecificAddons.includes(addon),
			);
			const hasCompatibleWebFrontend = effectiveFrontend?.some(
				(f) =>
					f === "tanstack-router" ||
					f === "react-router" ||
					(f === "nuxt" &&
						config.addons?.includes("tauri") &&
						!config.addons?.includes("pwa")) ||
					(f === "svelte" &&
						config.addons?.includes("tauri") &&
						!config.addons?.includes("pwa")),
			);

			if (hasWebSpecificAddons && !hasCompatibleWebFrontend) {
				let incompatibleAddon = "";
				if (config.addons.includes("pwa") && includesNuxt) {
					incompatibleAddon = "PWA addon is not compatible with Nuxt.";
				} else if (
					config.addons.includes("pwa") ||
					config.addons.includes("tauri")
				) {
					incompatibleAddon =
						"PWA and Tauri addons require tanstack-router, react-router, or Nuxt/Svelte (Tauri only).";
				}
				consola.fatal(
					`${incompatibleAddon} Cannot use these addons with your frontend selection.`,
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

		const onlyNativeFrontend =
			effectiveFrontend &&
			effectiveFrontend.length === 1 &&
			effectiveFrontend[0] === "native";

		if (
			onlyNativeFrontend &&
			config.examples &&
			config.examples.length > 0 &&
			!config.examples.includes("none")
		) {
			consola.fatal(
				"Examples are not supported when only the 'native' frontend is selected.",
			);
			process.exit(1);
		}

		if (
			config.examples &&
			config.examples.length > 0 &&
			!config.examples.includes("none")
		) {
			if (
				config.examples.includes("todo") &&
				effectiveBackend !== "convex" &&
				effectiveDatabase === "none"
			) {
				consola.fatal(
					"The 'todo' example requires a database (unless using Convex). Cannot use --examples todo when database is 'none'.",
				);
				process.exit(1);
			}

			if (config.examples.includes("ai") && effectiveBackend === "elysia") {
				consola.fatal(
					"The 'ai' example is not compatible with the Elysia backend.",
				);
				process.exit(1);
			}

			const hasWebFrontendForExamples = effectiveFrontend?.some((f) =>
				[
					"tanstack-router",
					"react-router",
					"tanstack-start",
					"next",
					"nuxt",
					"svelte",
				].includes(f),
			);
			const noFrontendSelected =
				!effectiveFrontend || effectiveFrontend.length === 0;
		}
	}

 return config;
}

main().catch((err) => {
	consola.error("Aborting installation due to unexpected error...");
	if (err instanceof Error) {
		if (
			!err.message.includes("is only supported with") &&
			!err.message.includes("incompatible with")
		) {
			consola.error(err.message);
			consola.error(err.stack);
		} else {
		}
	} else {
		console.error(err);
	}
	process.exit(1);
});
