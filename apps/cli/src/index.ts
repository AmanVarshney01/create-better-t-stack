import path from "node:path";
import {
	cancel,
	intro,
	isCancel,
	log,
	outro,
	select,
	spinner,
} from "@clack/prompts";
import { consola } from "consola";
import fs from "fs-extra";
import pc from "picocolors";
import { createCli, trpcServer, zod as z } from "trpc-cli";
import { DEFAULT_CONFIG } from "./constants";
import { createProject } from "./helpers/project-generation/create-project";
import { gatherConfig } from "./prompts/config-prompts";
import { getProjectName } from "./prompts/project-name";
import type { CreateInput, ProjectConfig } from "./types";
import {
	APISchema,
	AddonsSchema,
	BackendSchema,
	DatabaseSchema,
	DatabaseSetupSchema,
	ExamplesSchema,
	FrontendSchema,
	ORMSchema,
	PackageManagerSchema,
	ProjectNameSchema,
	RuntimeSchema,
} from "./types";
import { trackProjectCreation } from "./utils/analytics";
import { displayConfig } from "./utils/display-config";
import { generateReproducibleCommand } from "./utils/generate-reproducible-command";
import { getLatestCLIVersion } from "./utils/get-latest-cli-version";
import { openUrl } from "./utils/open-url";
import { renderTitle } from "./utils/render-title";
import { displaySponsors, fetchSponsors } from "./utils/sponsors";
import { getProvidedFlags, processAndValidateFlags } from "./validation";

const t = trpcServer.initTRPC.create();

async function handleDirectoryConflict(currentPathInput: string): Promise<{
	finalPathInput: string;
	shouldClearDirectory: boolean;
}> {
	while (true) {
		const resolvedPath = path.resolve(process.cwd(), currentPathInput);
		const dirExists = fs.pathExistsSync(resolvedPath);
		const dirIsNotEmpty = dirExists && fs.readdirSync(resolvedPath).length > 0;

		if (!dirIsNotEmpty) {
			return { finalPathInput: currentPathInput, shouldClearDirectory: false };
		}

		log.warn(
			`Directory "${pc.yellow(
				currentPathInput,
			)}" already exists and is not empty.`,
		);

		const action = await select<"overwrite" | "merge" | "rename" | "cancel">({
			message: "What would you like to do?",
			options: [
				{
					value: "overwrite",
					label: "Overwrite",
					hint: "Empty the directory and create the project",
				},
				{
					value: "merge",
					label: "Merge",
					hint: "Create project files inside, potentially overwriting conflicts",
				},
				{
					value: "rename",
					label: "Choose a different name/path",
					hint: "Keep the existing directory and create a new one",
				},
				{ value: "cancel", label: "Cancel", hint: "Abort the process" },
			],
			initialValue: "rename",
		});

		if (isCancel(action)) {
			cancel(pc.red("Operation cancelled."));
			process.exit(0);
		}

		switch (action) {
			case "overwrite":
				return { finalPathInput: currentPathInput, shouldClearDirectory: true };
			case "merge":
				log.info(
					`Proceeding into existing directory "${pc.yellow(
						currentPathInput,
					)}". Files may be overwritten.`,
				);
				return {
					finalPathInput: currentPathInput,
					shouldClearDirectory: false,
				};
			case "rename": {
				log.info("Please choose a different project name or path.");
				const newPathInput = await getProjectName(undefined);
				return await handleDirectoryConflict(newPathInput);
			}
			case "cancel":
				cancel(pc.red("Operation cancelled."));
				process.exit(0);
		}
	}
}

async function setupProjectDirectory(
	finalPathInput: string,
	shouldClearDirectory: boolean,
): Promise<{ finalResolvedPath: string; finalBaseName: string }> {
	let finalResolvedPath: string;
	let finalBaseName: string;

	if (finalPathInput === ".") {
		finalResolvedPath = process.cwd();
		finalBaseName = path.basename(finalResolvedPath);
	} else {
		finalResolvedPath = path.resolve(process.cwd(), finalPathInput);
		finalBaseName = path.basename(finalResolvedPath);
	}

	if (shouldClearDirectory) {
		const s = spinner();
		s.start(`Clearing directory "${finalResolvedPath}"...`);
		try {
			await fs.emptyDir(finalResolvedPath);
			s.stop(`Directory "${finalResolvedPath}" cleared.`);
		} catch (error) {
			s.stop(pc.red(`Failed to clear directory "${finalResolvedPath}".`));
			consola.error(error);
			process.exit(1);
		}
	} else {
		await fs.ensureDir(finalResolvedPath);
	}

	return { finalResolvedPath, finalBaseName };
}

async function createProjectHandler(
	input: CreateInput & { projectName?: string },
) {
	const startTime = Date.now();

	try {
		renderTitle();
		intro(pc.magenta("Creating a new Better-T Stack project"));

		let currentPathInput: string;
		if (input.yes && input.projectName) {
			currentPathInput = input.projectName;
		} else if (input.yes) {
			let defaultName = DEFAULT_CONFIG.relativePath;
			let counter = 1;
			while (
				fs.pathExistsSync(path.resolve(process.cwd(), defaultName)) &&
				fs.readdirSync(path.resolve(process.cwd(), defaultName)).length > 0
			) {
				defaultName = `${DEFAULT_CONFIG.projectName}-${counter}`;
				counter++;
			}
			currentPathInput = defaultName;
		} else {
			currentPathInput = await getProjectName(input.projectName);
		}

		const { finalPathInput, shouldClearDirectory } =
			await handleDirectoryConflict(currentPathInput);

		const { finalResolvedPath, finalBaseName } = await setupProjectDirectory(
			finalPathInput,
			shouldClearDirectory,
		);

		const cliInput = {
			...input,
			projectDirectory: input.projectName,
		};

		const providedFlags = getProvidedFlags(cliInput);
		const flagConfig = processAndValidateFlags(
			cliInput,
			providedFlags,
			finalBaseName,
		);
		const { projectName: _projectNameFromFlags, ...otherFlags } = flagConfig;

		if (!input.yes && Object.keys(otherFlags).length > 0) {
			log.info(pc.yellow("Using these pre-selected options:"));
			log.message(displayConfig(otherFlags));
			log.message("");
		}

		let config: ProjectConfig;
		if (input.yes) {
			config = {
				...DEFAULT_CONFIG,
				...flagConfig,
				projectName: finalBaseName,
				projectDir: finalResolvedPath,
				relativePath: finalPathInput,
			};

			if (config.backend === "convex") {
				log.info(
					"Due to '--backend convex' flag, the following options have been automatically set: auth=false, database=none, orm=none, api=none, runtime=none, dbSetup=none, examples=todo",
				);
			} else if (config.backend === "none") {
				log.info(
					"Due to '--backend none', the following options have been automatically set: --auth=false, --database=none, --orm=none, --api=none, --runtime=none, --db-setup=none, --examples=none",
				);
			}

			log.info(
				pc.yellow("Using default/flag options (config prompts skipped):"),
			);
			log.message(displayConfig(config));
			log.message("");
		} else {
			config = await gatherConfig(
				flagConfig,
				finalBaseName,
				finalResolvedPath,
				finalPathInput,
			);
		}

		await createProject(config);

		const reproducibleCommand = generateReproducibleCommand(config);
		log.success(
			pc.blue(
				`You can reproduce this setup with the following command:\n${reproducibleCommand}`,
			),
		);

		await trackProjectCreation(config);

		const elapsedTimeInSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
		outro(
			pc.magenta(
				`Project created successfully in ${pc.bold(
					elapsedTimeInSeconds,
				)} seconds!`,
			),
		);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
}

const router = t.router({
	init: t.procedure
		.meta({
			description: "Create a new Better-T Stack project",
			default: true,
		})
		.input(
			z.tuple([
				ProjectNameSchema.optional(),
				z
					.object({
						yes: z
							.boolean()
							.optional()
							.default(false)
							.describe("Use default configuration"),
						database: DatabaseSchema.optional(),
						orm: ORMSchema.optional(),
						auth: z.boolean().optional(),
						frontend: z.array(FrontendSchema).optional(),
						addons: z.array(AddonsSchema).optional(),
						examples: z.array(ExamplesSchema).optional(),
						git: z.boolean().optional(),
						packageManager: PackageManagerSchema.optional(),
						install: z.boolean().optional(),
						dbSetup: DatabaseSetupSchema.optional(),
						backend: BackendSchema.optional(),
						runtime: RuntimeSchema.optional(),
						api: APISchema.optional(),
					})
					.optional()
					.default({}),
			]),
		)
		.mutation(async ({ input }) => {
			const [projectName, options] = input;
			const combinedInput = {
				projectName,
				...options,
			};
			await createProjectHandler(combinedInput);
		}),
	sponsors: t.procedure
		.meta({ description: "Show Better-T Stack sponsors" })
		.mutation(async () => {
			try {
				renderTitle();
				intro(pc.magenta("Better-T Stack Sponsors"));
				const sponsors = await fetchSponsors();
				displaySponsors(sponsors);
			} catch (error) {
				consola.error(error);
				process.exit(1);
			}
		}),
	docs: t.procedure
		.meta({ description: "Open Better-T Stack documentation" })
		.mutation(async () => {
			const DOCS_URL = "https://better-t-stack.dev/docs";
			try {
				await openUrl(DOCS_URL);
				log.success(pc.blue("Opened docs in your default browser."));
			} catch {
				log.message(`Please visit ${DOCS_URL}`);
			}
		}),
	builder: t.procedure
		.meta({ description: "Open the web-based stack builder" })
		.mutation(async () => {
			const BUILDER_URL = "https://better-t-stack.dev/new";
			try {
				await openUrl(BUILDER_URL);
				log.success(pc.blue("Opened builder in your default browser."));
			} catch {
				log.message(`Please visit ${BUILDER_URL}`);
			}
		}),
});

createCli({
	router,
	name: "create-better-t-stack",
	version: getLatestCLIVersion(),
}).run();
