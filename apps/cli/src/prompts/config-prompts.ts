import { group } from "@clack/prompts";
import type {
	Addons,
	API,
	Auth,
	Backend,
	Database,
	DatabaseSetup,
	Examples,
	Frontend,
	ORM,
	PackageManager,
	ProjectConfig,
	Runtime,
	ServerDeploy,
	WebDeploy,
} from "../types";
import { exitCancelled } from "../utils/errors";
import { getAddonsChoice } from "./addons";
import { getApiChoice } from "./api";
import { getAuthChoice } from "./auth";
import { getBackendFrameworkChoice } from "./backend";
import { getDatabaseChoice } from "./database";
import { getDBSetupChoice } from "./database-setup";
import { getExamplesChoice } from "./examples";
import { getFrontendChoice } from "./frontend";
import { getGitChoice } from "./git";
import { getinstallChoice } from "./install";
import { getORMChoice } from "./orm";
import { getPackageManagerChoice } from "./package-manager";
import { getRuntimeChoice } from "./runtime";
import { getServerDeploymentChoice } from "./server-deploy";
import { getDeploymentChoice } from "./web-deploy";

type PromptGroupResults = {
	frontend: Frontend[];
	backend: Backend;
	runtime: Runtime;
	database: Database;
	orm: ORM;
	api: API;
	auth: Auth;
	addons: Addons[];
	examples: Examples[];
	dbSetup: DatabaseSetup;
	git: boolean;
	packageManager: PackageManager;
	install: boolean;
	webDeploy: WebDeploy;
	serverDeploy: ServerDeploy;
};

export async function gatherConfig(
	flags: Partial<ProjectConfig>,
	projectName: string,
	projectDir: string,
	relativePath: string,
) {
	const result = await group<PromptGroupResults>(
		{
			frontend: () =>
				getFrontendChoice(flags.frontend, flags.backend, flags.auth),
			backend: ({ results }) =>
				getBackendFrameworkChoice(flags.backend, results.frontend),
			runtime: ({ results }) =>
				getRuntimeChoice(flags.runtime, results.backend),
			database: ({ results }) =>
				getDatabaseChoice(flags.database, results.backend, results.runtime),
			orm: ({ results }) =>
				getORMChoice(
					flags.orm,
					results.database !== "none",
					results.database,
					results.backend,
					results.runtime,
				),
			api: ({ results }) =>
				getApiChoice(
					flags.api,
					results.frontend,
					results.backend,
				) as Promise<API>,
			auth: ({ results }) =>
				getAuthChoice(
					flags.auth,
					results.database !== "none",
					results.backend,
					results.frontend,
				),
			addons: ({ results }) => getAddonsChoice(flags.addons, results.frontend),
			examples: ({ results }) =>
				getExamplesChoice(
					flags.examples,
					results.database,
					results.frontend,
					results.backend,
					results.api,
				) as Promise<Examples[]>,
			dbSetup: ({ results }) =>
				getDBSetupChoice(
					results.database ?? "none",
					flags.dbSetup,
					results.orm,
					results.backend,
					results.runtime,
				),
			webDeploy: ({ results }) =>
				getDeploymentChoice(
					flags.webDeploy,
					results.runtime,
					results.backend,
					results.frontend,
				),
			serverDeploy: ({ results }) =>
				getServerDeploymentChoice(
					flags.serverDeploy,
					results.runtime,
					results.backend,
					results.webDeploy,
				),
			git: () => getGitChoice(flags.git),
			packageManager: () => getPackageManagerChoice(flags.packageManager),
			install: () => getinstallChoice(flags.install),
		},
		{
			onCancel: () => exitCancelled("Operation cancelled"),
		},
	);

	return {
		projectName: projectName,
		projectDir: projectDir,
		relativePath: relativePath,
		frontend: result.frontend,
		backend: result.backend,
		runtime: result.runtime,
		database: result.database,
		orm: result.orm,
		auth: result.auth,
		addons: result.addons,
		examples: result.examples,
		git: result.git,
		packageManager: result.packageManager,
		install: result.install,
		dbSetup: result.dbSetup,
		api: result.api,
		webDeploy: result.webDeploy,
		serverDeploy: result.serverDeploy,
	};
}
