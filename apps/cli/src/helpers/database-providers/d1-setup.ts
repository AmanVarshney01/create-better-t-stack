import path from "node:path";
import type { ProjectConfig } from "../../types";
import {
	addEnvVariablesToFile,
	type EnvVariable,
} from "../project-generation/env-setup";

export async function setupCloudflareD1(config: ProjectConfig) {
	const { projectDir } = config;

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
