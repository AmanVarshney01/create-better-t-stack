import path from "node:path";
import type { ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";
import { addEnvVariablesToFile, type EnvVariable } from "../core/env-setup";

export async function setupCloudflareD1(config: ProjectConfig) {
	const { projectDir, serverDeploy, orm, backend } = config;

	if (serverDeploy === "wrangler") {
		const targetApp = backend === "self" ? "apps/web" : "apps/server";
		const envPath = path.join(projectDir, targetApp, ".env");

		const variables: EnvVariable[] = [
			{
				key: "CLOUDFLARE_ACCOUNT_ID",
				value: "",
				condition: true,
			},
			{
				key: "CLOUDFLARE_DATABASE_ID",
				value: "",
				condition: true,
			},
			{
				key: "CLOUDFLARE_D1_TOKEN",
				value: "",
				condition: true,
			},
		];

		try {
			await addEnvVariablesToFile(envPath, variables);
		} catch (_err) {}
	}

	if (
		(serverDeploy === "wrangler" || serverDeploy === "alchemy") &&
		orm === "prisma"
	) {
		const targetApp2 = backend === "self" ? "apps/web" : "apps/server";
		const envPath = path.join(projectDir, targetApp2, ".env");
		const variables: EnvVariable[] = [
			{
				key: "DATABASE_URL",
				value: `file:${path.join(projectDir, "apps/server", "local.db")}`,
				condition: true,
			},
		];

		try {
			await addEnvVariablesToFile(envPath, variables);
		} catch (_err) {}

		const serverDir = path.join(
			projectDir,
			backend === "self" ? "apps/web" : "apps/server",
		);
		await addPackageDependency({
			dependencies: ["@prisma/adapter-d1"],
			projectDir: serverDir,
		});
	}
}
