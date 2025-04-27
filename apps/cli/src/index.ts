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
				choices: ["drizzle", "prisma", "none"],
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
				choices: ["hono", "express", "next", "elysia"],
			})
			.option("runtime", {
				type: "string",
				describe: "Runtime",
				choices: ["bun", "node"],
			})
			.option("api", {
				type: "string",
				describe: "API type",
				choices: ["trpc", "orpc"],
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

			if (config.database === "none") {
				config.orm = "none";
				config.auth = false;
				config.dbSetup = "none";
				config.examples = config.examples.filter((ex) => ex !== "todo");
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
				consola.error(error.stack);
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
	if (options.backend) {
		config.backend = options.backend as ProjectBackend;
	}
	if (options.runtime) {
		config.runtime = options.runtime as ProjectRuntime;
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
	if (options.api) {
		config.api = options.api as ProjectApi;
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
		}
	}
	if (options.packageManager) {
		config.packageManager = options.packageManager as ProjectPackageManager;
	}
	if (projectDirectory) {
		config.projectName = projectDirectory;
	}
	if (options.dbSetup) {
		config.dbSetup = options.dbSetup as ProjectDBSetup;
	}

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
		if (effectiveOrm && effectiveOrm !== "none") {
			consola.fatal(
				`Cannot use ORM '--orm ${effectiveOrm}' when database is 'none'.`,
			);
			process.exit(1);
		}
		config.orm = "none";

		if (effectiveAuth === true) {
			consola.fatal(
				"Authentication requires a database. Cannot use --auth when database is 'none'.",
			);
			process.exit(1);
		}
		config.auth = false;

		if (effectiveDbSetup && effectiveDbSetup !== "none") {
			consola.fatal(
				`Database setup '--db-setup ${effectiveDbSetup}' requires a database. Cannot use when database is 'none'.`,
			);
			process.exit(1);
		}
		config.dbSetup = "none";

		if (effectiveExamples?.includes("todo")) {
			consola.fatal(
				"The 'todo' example requires a database. Cannot use --examples todo when database is 'none'.",
			);
			process.exit(1);
		}
		if (config.examples) {
			config.examples = config.examples.filter((ex) => ex !== "todo");
		}
	}

	if (effectiveDatabase === "mongodb" && effectiveOrm === "drizzle") {
		consola.fatal(
			"MongoDB is only available with Prisma. Cannot use --database mongodb with --orm drizzle",
		);
		process.exit(1);
	}

	if (config.dbSetup && config.dbSetup !== "none") {
		const dbSetup = config.dbSetup;
		if (dbSetup === "turso") {
			if (effectiveDatabase && effectiveDatabase !== "sqlite") {
				consola.fatal(
					`Turso setup requires SQLite. Cannot use --db-setup turso with --database ${effectiveDatabase}`,
				);
				process.exit(1);
			}
			if (effectiveOrm === "prisma") {
				consola.fatal(
					"Turso setup is not compatible with Prisma. Cannot use --db-setup turso with --orm prisma",
				);
				process.exit(1);
			}
			config.database = "sqlite";
			config.orm = "drizzle";
		} else if (dbSetup === "prisma-postgres") {
			if (effectiveDatabase && effectiveDatabase !== "postgres") {
				consola.fatal(
					`Prisma PostgreSQL setup requires PostgreSQL. Cannot use --db-setup prisma-postgres with --database ${effectiveDatabase}.`,
				);
				process.exit(1);
			}
			if (
				effectiveOrm &&
				effectiveOrm !== "prisma" &&
				effectiveOrm !== "none"
			) {
				consola.fatal(
					`Prisma PostgreSQL setup requires Prisma ORM. Cannot use --db-setup prisma-postgres with --orm ${effectiveOrm}.`,
				);
				process.exit(1);
			}
			config.database = "postgres";
			config.orm = "prisma";
		} else if (dbSetup === "mongodb-atlas") {
			if (effectiveDatabase && effectiveDatabase !== "mongodb") {
				consola.fatal(
					`MongoDB Atlas setup requires MongoDB. Cannot use --db-setup mongodb-atlas with --database ${effectiveDatabase}.`,
				);
				process.exit(1);
			}
			if (
				effectiveOrm &&
				effectiveOrm !== "prisma" &&
				effectiveOrm !== "none"
			) {
				consola.fatal(
					`MongoDB Atlas setup requires Prisma ORM. Cannot use --db-setup mongodb-atlas with --orm ${effectiveOrm}.`,
				);
				process.exit(1);
			}
			config.database = "mongodb";
			config.orm = "prisma";
		} else if (dbSetup === "neon") {
			if (effectiveDatabase && effectiveDatabase !== "postgres") {
				consola.fatal(
					`Neon PostgreSQL setup requires PostgreSQL. Cannot use --db-setup neon with --database ${effectiveDatabase}.`,
				);
				process.exit(1);
			}
			config.database = "postgres";
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
		config.api = "orpc";
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

	if (config.examples && config.examples.length > 0) {
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

		if (config.examples.length > 0 && !hasWebFrontendForExamples) {
			consola.fatal(
				"Examples require a web frontend (tanstack-router, react-router, tanstack-start, next, nuxt, or svelte).",
			);
			process.exit(1);
		}
	}

	return config;
}

main().catch((err) => {
	consola.error("Aborting installation due to unexpected error...");
	if (err instanceof Error) {
		consola.error(err.message);
	} else {
		console.error(err);
	}
	process.exit(1);
});
