import { intro, log } from "@clack/prompts";
import pc from "picocolors";
import { createCli, trpcServer } from "trpc-cli";
import {
	addAddonsHandler,
	createProjectHandler,
} from "@/helpers/core/command-handlers";
import {
	type AddInput,
	AddInputSchema,
	type Addons,
	type API,
	type Backend,
	type BetterTStackConfig,
	type CreateInput,
	CreateInputSchema,
	type Database,
	type DatabaseSetup,
	type DirectoryConflict,
	type Examples,
	type Frontend,
	type InitResult,
	type ORM,
	type PackageManager,
	type ProjectConfig,
	type Runtime,
	type ServerDeploy,
	type WebDeploy,
} from "@/types";
import { handleError } from "@/utils/errors";
import { getLatestCLIVersion } from "@/utils/get-latest-cli-version";
import { openUrl } from "@/utils/open-url";
import { renderTitle } from "@/utils/render-title";
import { displaySponsors, fetchSponsors } from "@/utils/sponsors";

const t = trpcServer.initTRPC.create();

export const router = t.router({
	init: t.procedure
		.meta({
			description: "Create a new Better-T-Stack project",
			default: true,
			negateBooleans: true,
		})
		.input(CreateInputSchema)
		.mutation(async ({ input }) => {
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
	add: t.procedure
		.meta({
			description:
				"Add addons or deployment configurations to an existing Better-T-Stack project",
		})
		.input(AddInputSchema)
		.mutation(async ({ input }) => {
			const [options] = input;
			await addAddonsHandler(options);
		}),
	sponsors: t.procedure
		.meta({ description: "Show Better-T-Stack sponsors" })
		.mutation(async () => {
			try {
				renderTitle();
				intro(pc.magenta("Better-T-Stack Sponsors"));
				const sponsors = await fetchSponsors();
				displaySponsors(sponsors);
			} catch (error) {
				handleError(error, "Failed to display sponsors");
			}
		}),
	docs: t.procedure
		.meta({ description: "Open Better-T-Stack documentation" })
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

const caller = t.createCallerFactory(router)({});

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
export async function init(
	projectName?: string,
	options?: CreateInput,
): Promise<InitResult> {
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
	CreateInput,
	AddInput,
	ProjectConfig,
	BetterTStackConfig,
	InitResult,
};
