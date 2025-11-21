import { intro, log } from "@clack/prompts";
import { createRouterClient, os } from "@orpc/server";
import pc from "picocolors";
import { createCli } from "trpc-cli";
import z from "zod";
import {
	addAddonsHandler,
	createProjectHandler,
} from "./helpers/core/command-handlers";
import {
	type AddInput,
	type Addons,
	AddonsSchema,
	type API,
	APISchema,
	AuthSchema,
	type Backend,
	BackendSchema,
	type BetterTStackConfig,
	type CreateInput,
	type Database,
	DatabaseSchema,
	type DatabaseSetup,
	DatabaseSetupSchema,
	type DirectoryConflict,
	DirectoryConflictSchema,
	type Examples,
	ExamplesSchema,
	type Frontend,
	FrontendSchema,
	type InitResult,
	type ORM,
	ORMSchema,
	type PackageManager,
	PackageManagerSchema,
	PaymentsSchema,
	type ProjectConfig,
	ProjectNameSchema,
	type Runtime,
	RuntimeSchema,
	type ServerDeploy,
	ServerDeploySchema,
	type Template,
	TemplateSchema,
	type WebDeploy,
	WebDeploySchema,
} from "./types";
import { handleError } from "./utils/errors";
import { getLatestCLIVersion } from "./utils/get-latest-cli-version";
import { openUrl } from "./utils/open-url";
import { renderTitle } from "./utils/render-title";
import { displaySponsors, fetchSponsors } from "./utils/sponsors";

export const router = os.router({
	init: os
		.meta({
			description: "Create a new Better-T-Stack project",
			default: true,
			negateBooleans: true,
		})
		.input(
			z.tuple([
				ProjectNameSchema.optional(),
				z.object({
					template: TemplateSchema.optional().describe(
						"Use a predefined template"
					),
					yes: z
						.boolean()
						.optional()
						.default(false)
						.describe("Use default configuration"),
					yolo: z
						.boolean()
						.optional()
						.default(false)
						.describe(
							"(WARNING - NOT RECOMMENDED) Bypass validations and compatibility checks",
						),
					verbose: z
						.boolean()
						.optional()
						.default(false)
						.describe("Show detailed result information"),
					database: DatabaseSchema.optional(),
					orm: ORMSchema.optional(),
					auth: AuthSchema.optional(),
					payments: PaymentsSchema.optional(),
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
					webDeploy: WebDeploySchema.optional(),
					serverDeploy: ServerDeploySchema.optional(),
					directoryConflict: DirectoryConflictSchema.optional(),
					renderTitle: z.boolean().optional(),
					disableAnalytics: z
						.boolean()
						.optional()
						.default(false)
						.describe("Disable analytics"),
					manualDb: z
						.boolean()
						.optional()
						.default(false)
						.describe(
							"Skip automatic/manual database setup prompt and use manual setup",
						),
				}),
			]),
		)
		.handler(async ({ input }) => {
			const [projectName, options] = input;
			const combinedInput = {
				projectName,
				...options,
			};
			const result = await createProjectHandler(combinedInput);

			if (options.verbose) {
				return result;
			}
		}),
	add: os
		.meta({
			description:
				"Add addons or deployment configurations to an existing Better-T-Stack project",
		})
		.input(
			z.tuple([
				z.object({
					addons: z.array(AddonsSchema).optional().default([]),
					webDeploy: WebDeploySchema.optional(),
					serverDeploy: ServerDeploySchema.optional(),
					projectDir: z.string().optional(),
					install: z
						.boolean()
						.optional()
						.default(false)
						.describe("Install dependencies after adding addons or deployment"),
					packageManager: PackageManagerSchema.optional(),
				}),
			]),
		)
		.handler(async ({ input }) => {
			const [options] = input;
			await addAddonsHandler(options);
		}),
	sponsors: os
		.meta({ description: "Show Better-T-Stack sponsors" })
		.handler(async () => {
			try {
				renderTitle();
				intro(pc.magenta("Better-T-Stack Sponsors"));
				const sponsors = await fetchSponsors();
				displaySponsors(sponsors);
			} catch (error) {
				handleError(error, "Failed to display sponsors");
			}
		}),
	docs: os
		.meta({ description: "Open Better-T-Stack documentation" })
		.handler(async () => {
			const DOCS_URL = "https://better-t-stack.dev/docs";
			try {
				await openUrl(DOCS_URL);
				log.success(pc.blue("Opened docs in your default browser."));
			} catch {
				log.message(`Please visit ${DOCS_URL}`);
			}
		}),
	builder: os
		.meta({ description: "Open the web-based stack builder" })
		.handler(async () => {
			const BUILDER_URL = "https://better-t-stack.dev/new";
			try {
				await openUrl(BUILDER_URL);
				log.success(pc.blue("Opened builder in your default browser."));
			} catch {
				log.message(`Please visit ${BUILDER_URL}`);
			}
		}),
});

const caller = createRouterClient(router, { context: {} });

export function createBtsCli() {
	return createCli({
		router,
		name: "create-better-t-stack",
		version: getLatestCLIVersion(),
	});
}

/**
 * Initialize a new Better-T-Stack project
 *
 * @example CLI usage:
 * ```bash
 * npx create-better-t-stack my-app --yes
 * ```
 *
 * @example Programmatic usage (always returns structured data):
 * ```typescript
 * import { init } from "create-better-t-stack";
 *
 * const result = await init("my-app", {
 *   yes: true,
 *   frontend: ["tanstack-router"],
 *   backend: "hono",
 *   database: "sqlite",
 *   orm: "drizzle",
 *   auth: "better-auth",
 *   addons: ["biome", "turborepo"],
 *   packageManager: "bun",
 *   install: false,
 *   directoryConflict: "increment", // auto-handle conflicts
 *   disableAnalytics: true, // disable analytics
 * });
 *
 * if (result.success) {
 *   console.log(`Project created at: ${result.projectDirectory}`);
 *   console.log(`Reproducible command: ${result.reproducibleCommand}`);
 *   console.log(`Time taken: ${result.elapsedTimeMs}ms`);
 * }
 * ```
 */
export async function init(projectName?: string, options?: CreateInput) {
	const opts = (options ?? {}) as CreateInput;
	const programmaticOpts = { ...opts, verbose: true };
	const prev = process.env.BTS_PROGRAMMATIC;
	process.env.BTS_PROGRAMMATIC = "1";
	const result = await caller.init([projectName, programmaticOpts]);
	if (prev === undefined) delete process.env.BTS_PROGRAMMATIC;
	else process.env.BTS_PROGRAMMATIC = prev;
	return result as InitResult;
}

export async function sponsors() {
	return caller.sponsors();
}

export async function docs() {
	return caller.docs();
}

export async function builder() {
	return caller.builder();
}

export type {
	Database,
	ORM,
	Backend,
	Runtime,
	Frontend,
	Addons,
	Examples,
	PackageManager,
	DatabaseSetup,
	API,
	WebDeploy,
	ServerDeploy,
	DirectoryConflict,
	Template,
	CreateInput,
	AddInput,
	ProjectConfig,
	BetterTStackConfig,
	InitResult,
};
