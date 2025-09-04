import { group } from "@clack/prompts";
import type {
	Addons,
	API,
	Auth,
	Backend,
	Database,
	DatabaseSetup,
	Docker,
	Examples,
	Frontend,
	ORM,
	PackageManager,
	ProjectConfig,
	Runtime,
	ServerDeploy,
	WebDeploy,
} from "@/types";
import { exitCancelled } from "@/utils/errors";
import { getAddonsChoice } from "@/prompts/addons";
import { getApiChoice } from "@/prompts/api";
import { getAuthChoice } from "@/prompts/auth";
import { getBackendFrameworkChoice } from "@/prompts/backend";
import { getDatabaseChoice } from "@/prompts/database";
import { getDBSetupChoice } from "@/prompts/database-setup";
import { getExamplesChoice } from "@/prompts/examples";
import { getFrontendChoice } from "@/prompts/frontend";
import { getGitChoice } from "@/prompts/git";
import { getinstallChoice } from "@/prompts/install";
import { getORMChoice } from "@/prompts/orm";
import { getPackageManagerChoice } from "@/prompts/package-manager";
import { getRuntimeChoice } from "@/prompts/runtime";
import { getServerDeploymentChoice } from "@/prompts/server-deploy";
import { getDeploymentChoice } from "@/prompts/web-deploy";
import { getDockerChoice } from "@/prompts/docker";

type PromptGroupResults = {
	frontend: Frontend[];
	backend: Backend;
	runtime: Runtime;
	database: Database;
	orm: ORM;
	api: API;
	auth: Auth;
	addons: Addons[];
	docker: Docker[];
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
): Promise<ProjectConfig> {
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
				getApiChoice(flags.api, results.frontend, results.backend),
			auth: ({ results }) =>
				getAuthChoice(
					flags.auth as import("@/types").Auth | undefined,
					results.database !== "none",
					results.backend,
					results.frontend,
				),
			addons: ({ results }) => getAddonsChoice(flags.addons, results.frontend),
			docker: ({ results }) => getDockerChoice(flags.docker, results.frontend),
			examples: ({ results }) =>
				getExamplesChoice(
					flags.examples,
					results.database,
					results.frontend,
					results.backend,
					results.api,
				),
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
		docker: result.docker,
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
