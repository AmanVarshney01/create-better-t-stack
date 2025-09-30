import path from "node:path";
import fs from "fs-extra";
import type { ProjectConfig } from "../../types";
import { addEnvVariablesToFile, type EnvVariable } from "../core/env-setup";

export async function setupPlanetScale(config: ProjectConfig) {
	const { projectDir, database, orm } = config;

	const envPath = path.join(projectDir, "apps/server", ".env");

	if (database === "mysql" && orm === "drizzle") {
		const variables: EnvVariable[] = [
			{
				key: "DATABASE_URL",
				value:
					'mysql://username:password@host/database?ssl={"rejectUnauthorized":true}',
				condition: true,
			},
			{
				key: "DATABASE_HOST",
				value: "",
				condition: true,
			},
			{
				key: "DATABASE_USERNAME",
				value: "",
				condition: true,
			},
			{
				key: "DATABASE_PASSWORD",
				value: "",
				condition: true,
			},
		];

		await fs.ensureDir(path.join(projectDir, "apps/server"));
		await addEnvVariablesToFile(envPath, variables);
	}

	if (database === "postgres" && orm === "prisma") {
		const variables: EnvVariable[] = [
			{
				key: "DATABASE_URL",
				value: "postgresql://username:password@host/database?sslaccept=strict",
				condition: true,
			},
		];

		await fs.ensureDir(path.join(projectDir, "apps/server"));
		await addEnvVariablesToFile(envPath, variables);
	}

	if (database === "postgres" && orm === "drizzle") {
		const variables: EnvVariable[] = [
			{
				key: "DATABASE_URL",
				value:
					"postgresql://username:password@host/database?sslmode=verify-full",
				condition: true,
			},
		];

		await fs.ensureDir(path.join(projectDir, "apps/server"));
		await addEnvVariablesToFile(envPath, variables);
	}

	if (database === "mysql" && orm === "prisma") {
		const variables: EnvVariable[] = [
			{
				key: "DATABASE_URL",
				value: "mysql://username:password@host/database?sslaccept=strict",
				condition: true,
			},
		];

		await fs.ensureDir(path.join(projectDir, "apps/server"));
		await addEnvVariablesToFile(envPath, variables);
	}
}
