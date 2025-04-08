import { cancel, intro, log, outro, spinner } from "@clack/prompts";
import { Command } from "commander";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "./constants";
import { createProject } from "./helpers/create-project";
import { gatherConfig } from "./prompts/config-prompts";
import type {
	CLIOptions,
	ProjectAddons,
	ProjectBackend,
	ProjectConfig,
	ProjectDBSetup,
	ProjectDatabase,
	ProjectExamples,
	ProjectFrontend,
	ProjectOrm,
	ProjectPackageManager,
	ProjectRuntime,
} from "./types";
import { displayConfig } from "./utils/display-config";
import { generateReproducibleCommand } from "./utils/generate-reproducible-command";
import { getLatestCLIVersion } from "./utils/get-latest-cli-version";
import { renderTitle } from "./utils/render-title";

process.on("SIGINT", () => {
	log.error(pc.red("Operation cancelled"));
	process.exit(0);
});

const program = new Command();

async function main() {
	const startTime = Date.now();

	program
		.name("create-better-t-stack")
		.description("Create a new Better-T Stack project")
		.version(getLatestCLIVersion())
		.argument("[project-directory]", "Project name/directory")
		.option("-y, --yes", "Use default configuration")
		.option(
			"--database <type>",
			"Database type (none, sqlite, postgres, mongodb)",
		)
		.option("--orm <type>", "ORM type (drizzle, prisma)")
		.option("--auth", "Include authentication")
		.option("--no-auth", "Exclude authentication")
		.option(
			"--frontend <types...>",
			"Frontend types (tanstack-router, react-router, tanstack-start, native, none)",
		)
		.option(
			"--addons <types...>",
			"Additional addons (pwa, tauri, biome, husky, none)",
		)
		.option("--examples <types...>", "Examples to include (todo, ai)")
		.option("--no-examples", "Skip all examples")
		.option("--git", "Initialize git repository")
		.option("--no-git", "Skip git initialization")
		.option("--package-manager <pm>", "Package manager (npm, pnpm, bun)")
		.option("--install", "Install dependencies")
		.option("--no-install", "Skip installing dependencies")
		.option(
			"--db-setup <setup>",
			"Database setup (turso, prisma-postgres, mongodb-atlas, none)",
		)
		.option(
			"--backend <framework>",
			"Backend framework (hono, express, elysia)",
		)
		.option("--runtime <runtime>", "Runtime (bun, node)")
		.parse();

	const s = spinner();

	try {
		renderTitle();
		intro(pc.magenta("Creating a new Better-T-Stack project"));

		const options = program.opts() as CLIOptions;
		const projectDirectory = program.args[0];

		validateOptions(options);

		const flagConfig = processFlags(options, projectDirectory);

		if (!options.yes && Object.keys(flagConfig).length > 0) {
			log.info(pc.yellow("Using these pre-selected options:"));
			log.message(displayConfig(flagConfig));
			log.message("");
		}

		const config = options.yes
			? {
					...DEFAULT_CONFIG,
					projectName: projectDirectory ?? DEFAULT_CONFIG.projectName,
					...flagConfig,
				}
			: await gatherConfig(flagConfig);

		if (options.yes) {
			log.info(pc.yellow("Using these default options:"));
			log.message(displayConfig(config));
			log.message("");
		}

		await createProject(config);

		log.success(
			pc.blue(
				`You can reproduce this setup with the following command:\n${pc.white(
					generateReproducibleCommand(config),
				)}`,
			),
		);

		const elapsedTimeInSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
		outro(
			pc.magenta(
				`Project created successfully in ${pc.bold(elapsedTimeInSeconds)} seconds!`,
			),
		);
	} catch (error) {
		s.stop(pc.red("Failed"));
		if (error instanceof Error) {
			cancel(pc.red(`An unexpected error occurred: ${error.message}`));
			process.exit(1);
		}
	}
}

function validateOptions(options: CLIOptions): void {
	if (
		options.database &&
		!["none", "sqlite", "postgres", "mongodb"].includes(options.database)
	) {
		cancel(
			pc.red(
				`Invalid database type: ${options.database}. Must be none, sqlite, postgres, or mongodb.`,
			),
		);
		process.exit(1);
	}

	if (options.orm && !["drizzle", "prisma"].includes(options.orm)) {
		cancel(
			pc.red(`Invalid ORM type: ${options.orm}. Must be drizzle or prisma.`),
		);
		process.exit(1);
	}

	if (
		options.dbSetup &&
		!["turso", "prisma-postgres", "mongodb-atlas", "none"].includes(
			options.dbSetup,
		)
	) {
		cancel(
			pc.red(
				`Invalid database setup: ${options.dbSetup}. Must be turso, prisma-postgres, mongodb-atlas, or none.`,
			),
		);
		process.exit(1);
	}

	if (options.database === "mongodb" && options.orm === "drizzle") {
		cancel(
			pc.red(
				"MongoDB is only available with Prisma. Cannot use --database mongodb with --orm drizzle",
			),
		);
		process.exit(1);
	}

	if (options.database === "none") {
		if (options.auth === true) {
			cancel(
				pc.red(
					"Authentication requires a database. Cannot use --auth with --database none.",
				),
			);
			process.exit(1);
		}

		if (options.orm && options.orm !== "none") {
			cancel(
				pc.red(
					`Cannot use ORM with no database. Cannot use --orm ${options.orm} with --database none.`,
				),
			);
			process.exit(1);
		}

		if (options.dbSetup && options.dbSetup !== "none") {
			cancel(
				pc.red(
					`Database setup requires a database. Cannot use --db-setup ${options.dbSetup} with --database none.`,
				),
			);
			process.exit(1);
		}
	}

	if (options.dbSetup === "turso") {
		if (options.database && options.database !== "sqlite") {
			cancel(
				pc.red(
					`Turso setup requires a SQLite database. Cannot use --db-setup turso with --database ${options.database}`,
				),
			);
			process.exit(1);
		}

		if (options.orm === "prisma") {
			cancel(
				pc.red(
					"Turso setup is not compatible with Prisma. Cannot use --db-setup turso with --orm prisma",
				),
			);
			process.exit(1);
		}
	}

	if (options.dbSetup === "prisma-postgres") {
		if (options.database && options.database !== "postgres") {
			cancel(
				pc.red(
					"Prisma PostgreSQL setup requires PostgreSQL database. Cannot use --db-setup prisma-postgres with a different database type.",
				),
			);
			process.exit(1);
		}

		if (options.orm && options.orm !== "prisma") {
			cancel(
				pc.red(
					"Prisma PostgreSQL setup requires Prisma ORM. Cannot use --db-setup prisma-postgres with a different ORM.",
				),
			);
			process.exit(1);
		}
	}

	if (options.dbSetup === "mongodb-atlas") {
		if (options.database && options.database !== "mongodb") {
			cancel(
				pc.red(
					"MongoDB Atlas setup requires MongoDB database. Cannot use --db-setup mongodb-atlas with a different database type.",
				),
			);
			process.exit(1);
		}
	}

	if (
		options.packageManager &&
		!["npm", "pnpm", "bun"].includes(options.packageManager)
	) {
		cancel(
			pc.red(
				`Invalid package manager: ${options.packageManager}. Must be npm, pnpm, or bun.`,
			),
		);
		process.exit(1);
	}

	if (
		options.backend &&
		!["hono", "elysia", "express"].includes(options.backend)
	) {
		cancel(
			pc.red(
				`Invalid backend framework: ${options.backend}. Must be hono, elysia, or express.`,
			),
		);
		process.exit(1);
	}

	if (options.runtime && !["bun", "node"].includes(options.runtime)) {
		cancel(pc.red(`Invalid runtime: ${options.runtime}. Must be bun or node.`));
		process.exit(1);
	}

	if (
		options.examples &&
		Array.isArray(options.examples) &&
		options.examples.length > 0
	) {
		const validExamples = ["todo", "ai"];
		const invalidExamples = options.examples.filter(
			(example: string) => !validExamples.includes(example),
		);

		if (invalidExamples.length > 0) {
			cancel(
				pc.red(
					`Invalid example(s): ${invalidExamples.join(", ")}. Valid options are: ${validExamples.join(", ")}.`,
				),
			);
			process.exit(1);
		}

		if (options.examples.includes("ai") && options.backend === "elysia") {
			cancel(
				pc.red(
					"AI example is only compatible with Hono backend. Cannot use --examples ai with --backend elysia",
				),
			);
			process.exit(1);
		}

		if (
			options.frontend &&
			!options.frontend.some((f) =>
				["tanstack-router", "react-router", "tanstack-start"].includes(f),
			) &&
			!options.frontend.includes("none")
		) {
			cancel(
				pc.red(
					"Examples require a web frontend. Cannot use --examples with --frontend native only",
				),
			);
			process.exit(1);
		}
	}

	if (options.frontend && options.frontend.length > 0) {
		const validFrontends = [
			"tanstack-router",
			"react-router",
			"tanstack-start",
			"native",
			"none",
		];
		const invalidFrontends = options.frontend.filter(
			(frontend: string) => !validFrontends.includes(frontend),
		);

		if (invalidFrontends.length > 0) {
			cancel(
				pc.red(
					`Invalid frontend(s): ${invalidFrontends.join(", ")}. Valid options are: ${validFrontends.join(", ")}.`,
				),
			);
			process.exit(1);
		}

		const webFrontends = options.frontend.filter(
			(f) =>
				f === "tanstack-router" ||
				f === "react-router" ||
				f === "tanstack-start",
		);

		if (webFrontends.length > 1) {
			cancel(
				pc.red(
					"Cannot select multiple web frameworks. Choose only one of: tanstack-router, tanstack-start, react-router",
				),
			);
			process.exit(1);
		}

		if (options.frontend.includes("none") && options.frontend.length > 1) {
			cancel(pc.red(`Cannot combine 'none' with other frontend options.`));
			process.exit(1);
		}
	}

	if (
		options.addons &&
		Array.isArray(options.addons) &&
		options.addons.length > 0
	) {
		const validAddons = ["pwa", "tauri", "biome", "husky", "none"];
		const invalidAddons = options.addons.filter(
			(addon: string) => !validAddons.includes(addon),
		);

		if (invalidAddons.length > 0) {
			cancel(
				pc.red(
					`Invalid addon(s): ${invalidAddons.join(", ")}. Valid options are: ${validAddons.join(", ")}.`,
				),
			);
			process.exit(1);
		}

		if (options.addons.includes("none") && options.addons.length > 1) {
			cancel(pc.red(`Cannot combine 'none' with other addons.`));
			process.exit(1);
		}

		const webSpecificAddons = ["pwa", "tauri"];
		const hasWebSpecificAddons = options.addons.some((addon) =>
			webSpecificAddons.includes(addon),
		);

		if (
			hasWebSpecificAddons &&
			options.frontend &&
			!options.frontend.some((f) =>
				["tanstack-router", "react-router"].includes(f),
			)
		) {
			cancel(
				pc.red(
					`PWA and Tauri addons require tanstack-router or react-router. Cannot use --addons ${options.addons
						.filter((a) => webSpecificAddons.includes(a))
						.join(", ")} with incompatible frontend options.`,
				),
			);
			process.exit(1);
		}
	}
}

function processFlags(
	options: CLIOptions,
	projectDirectory?: string,
): Partial<ProjectConfig> {
	let frontend: ProjectFrontend[] | undefined = undefined;

	if (options.frontend) {
		if (options.frontend.includes("none")) {
			frontend = [];
		} else {
			frontend = options.frontend.filter(
				(f): f is ProjectFrontend =>
					f === "tanstack-router" ||
					f === "react-router" ||
					f === "tanstack-start" ||
					f === "native",
			);

			const webFrontends = frontend.filter(
				(f) =>
					f === "tanstack-router" ||
					f === "react-router" ||
					f === "tanstack-start",
			);

			if (webFrontends.length > 1) {
				const firstWebFrontend = webFrontends[0];
				frontend = frontend.filter(
					(f) => f === "native" || f === firstWebFrontend,
				);
			}
		}
	}

	let examples: ProjectExamples[] | undefined;
	if ("examples" in options) {
		if (options.examples === false) {
			examples = [];
		} else if (Array.isArray(options.examples)) {
			examples = options.examples.filter(
				(ex): ex is ProjectExamples => ex === "todo" || ex === "ai",
			);

			if (
				frontend &&
				frontend.length > 0 &&
				!frontend.some((f) =>
					["tanstack-router", "react-router", "tanstack-start"].includes(f),
				)
			) {
				examples = [];
				log.warn(
					pc.yellow("Examples require web frontend - ignoring examples flag"),
				);
			}

			if (examples.includes("ai") && options.backend === "elysia") {
				examples = examples.filter((ex) => ex !== "ai");
				log.warn(
					pc.yellow(
						"AI example is not compatible with Elysia - removing AI example",
					),
				);
			}
		}
	}

	let addons: ProjectAddons[] | undefined;
	if (options.addons && Array.isArray(options.addons)) {
		if (options.addons.includes("none")) {
			addons = [];
		} else {
			addons = options.addons.filter(
				(addon): addon is ProjectAddons =>
					addon === "pwa" ||
					addon === "tauri" ||
					addon === "biome" ||
					addon === "husky",
			);

			const hasCompatibleWebFrontend = frontend?.some(
				(f) => f === "tanstack-router" || f === "react-router",
			);

			if (!hasCompatibleWebFrontend) {
				const webSpecificAddons = ["pwa", "tauri"];
				const filteredAddons = addons.filter(
					(addon) => !webSpecificAddons.includes(addon),
				);

				if (filteredAddons.length !== addons.length) {
					log.warn(
						pc.yellow(
							"PWA and Tauri addons require tanstack-router or react-router - removing these addons",
						),
					);
					addons = filteredAddons;
				}
			}

			if (addons.includes("husky") && !addons.includes("biome")) {
				addons.push("biome");
			}
		}
	}

	let database = options.database as ProjectDatabase | undefined;
	let orm = options.orm as ProjectOrm | undefined;
	const auth = "auth" in options ? options.auth : undefined;

	const backend = options.backend as ProjectBackend | undefined;
	const runtime = options.runtime as ProjectRuntime | undefined;
	const packageManager = options.packageManager as
		| ProjectPackageManager
		| undefined;

	let dbSetup: ProjectDBSetup | undefined = undefined;
	if (options.dbSetup) {
		if (options.dbSetup === "none") {
			dbSetup = "none";
		} else {
			dbSetup = options.dbSetup as ProjectDBSetup;

			if (dbSetup === "turso") {
				database = "sqlite";

				if (orm === "prisma") {
					log.warn(
						pc.yellow(
							"Turso is not compatible with Prisma - switching to Drizzle",
						),
					);
					orm = "drizzle";
				}
			} else if (dbSetup === "prisma-postgres") {
				database = "postgres";
				orm = "prisma";
			} else if (dbSetup === "mongodb-atlas") {
				database = "mongodb";
				orm = "prisma";
			}
		}
	}

	const config: Partial<ProjectConfig> = {};

	if (projectDirectory) config.projectName = projectDirectory;
	if (database !== undefined) config.database = database;
	if (orm !== undefined) config.orm = orm;
	if (auth !== undefined) config.auth = auth;
	if (packageManager) config.packageManager = packageManager;
	if ("git" in options) config.git = options.git;
	if ("install" in options) config.noInstall = !options.install;
	if (dbSetup !== undefined) config.dbSetup = dbSetup;
	if (backend) config.backend = backend;
	if (runtime) config.runtime = runtime;
	if (frontend !== undefined) config.frontend = frontend;
	if (addons !== undefined) config.addons = addons;
	if (examples !== undefined) config.examples = examples;

	return config;
}

main().catch((err) => {
	log.error("Aborting installation...");
	if (err instanceof Error) {
		log.error(err.message);
	} else {
		log.error(
			"An unknown error has occurred. Please open an issue on GitHub with the below:",
		);
		console.log(err);
	}
	process.exit(1);
});
