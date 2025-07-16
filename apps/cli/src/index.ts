import { intro, log } from "@clack/prompts";
import { consola } from "consola";
import pc from "picocolors";
import { createCli, trpcServer } from "trpc-cli";
import z from "zod";
import {
	addAddonsHandler,
	createProjectHandler,
} from "./helpers/project-generation/command-handlers";
import {
	AddonsSchema,
	APISchema,
	BackendSchema,
	DatabaseSchema,
	DatabaseSetupSchema,
	ExamplesSchema,
	FrontendSchema,
	ORMSchema,
	PackageManagerSchema,
	ProjectNameSchema,
	RuntimeSchema,
	WebDeploySchema,
} from "./types";
import { getLatestCLIVersion } from "./utils/get-latest-cli-version";
import { openUrl } from "./utils/open-url";
import { renderTitle } from "./utils/render-title";
import { displaySponsors, fetchSponsors } from "./utils/sponsors";

const t = trpcServer.initTRPC.create();

const router = t.router({
	init: t.procedure
		.meta({
			description: "Create a new Better-T Stack project",
			default: true,
			negateBooleans: true,
		})
		.input(
			z.tuple([
				ProjectNameSchema.optional(),
				z.object({
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
					webDeploy: WebDeploySchema.optional(),
				}),
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
	add: t.procedure
		.meta({
			description:
				"Add addons or deployment configurations to an existing Better-T Stack project",
		})
		.input(
			z.tuple([
				z.object({
					addons: z.array(AddonsSchema).optional().default([]),
					webDeploy: WebDeploySchema.optional(),
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
		.mutation(async ({ input }) => {
			const [options] = input;
			await addAddonsHandler(options);
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
