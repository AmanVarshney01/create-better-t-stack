import path from "node:path";
import type { ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";
import { addEnvVariablesToFile, type EnvVariable } from "../core/env-setup";

export async function setupCloudflareD1(config: ProjectConfig) {
	const { projectDir, serverDeploy, orm } = config;

	if (serverDeploy === "wrangler") {
		const envPath = path.join(projectDir, "apps/server", ".env");

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
		const envPath = path.join(projectDir, "apps/server", ".env");
		const variables: EnvVariable[] = [
			{
				key: "DATABASE_URL",
				value: "file:./local.db",
				condition: true,
			},
		];

		try {
			await addEnvVariablesToFile(envPath, variables);
		} catch (_err) {}

		const serverDir = path.join(projectDir, "apps/server");
		await addPackageDependency({
			dependencies: ["@prisma/adapter-d1"],
			projectDir: serverDir,
		});
	}
}
