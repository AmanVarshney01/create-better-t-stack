import path from "node:path";
import fs from "fs-extra";
import type { ProjectConfig } from "../../types";
import { generateAuthSecret } from "../setup/auth-setup";

export interface EnvVariable {
	key: string;
	value: string | null | undefined;
	condition: boolean;
}

export async function addEnvVariablesToFile(
	filePath: string,
	variables: EnvVariable[],
) {
	await fs.ensureDir(path.dirname(filePath));

	let envContent = "";
	if (await fs.pathExists(filePath)) {
		envContent = await fs.readFile(filePath, "utf8");
	}

	let modified = false;
	let contentToAdd = "";
	const exampleVariables: string[] = [];

	for (const { key, value, condition } of variables) {
		if (condition) {
			const regex = new RegExp(`^${key}=.*$`, "m");
			const valueToWrite = value ?? "";
			exampleVariables.push(`${key}=`);

			if (regex.test(envContent)) {
				const existingMatch = envContent.match(regex);
				if (existingMatch && existingMatch[0] !== `${key}=${valueToWrite}`) {
					envContent = envContent.replace(regex, `${key}=${valueToWrite}`);
					modified = true;
				}
			} else {
				contentToAdd += `${key}=${valueToWrite}\n`;
				modified = true;
			}
		}
	}

	if (contentToAdd) {
		if (envContent.length > 0 && !envContent.endsWith("\n")) {
			envContent += "\n";
		}
		envContent += contentToAdd;
	}

	if (modified) {
		await fs.writeFile(filePath, envContent.trimEnd());
	}

	const exampleFilePath = filePath.replace(/\.env$/, ".env.example");
	let exampleEnvContent = "";
	if (await fs.pathExists(exampleFilePath)) {
		exampleEnvContent = await fs.readFile(exampleFilePath, "utf8");
	}

	let exampleModified = false;
	let exampleContentToAdd = "";

	for (const exampleVar of exampleVariables) {
		const key = exampleVar.split("=")[0];
		const regex = new RegExp(`^${key}=.*$`, "m");
		if (!regex.test(exampleEnvContent)) {
			exampleContentToAdd += `${exampleVar}\n`;
			exampleModified = true;
		}
	}

	if (exampleContentToAdd) {
		if (exampleEnvContent.length > 0 && !exampleEnvContent.endsWith("\n")) {
			exampleEnvContent += "\n";
		}
		exampleEnvContent += exampleContentToAdd;
	}

	if (exampleModified || !(await fs.pathExists(exampleFilePath))) {
		await fs.writeFile(exampleFilePath, exampleEnvContent.trimEnd());
	}
}

export async function setupEnvironmentVariables(config: ProjectConfig) {
	const { backend, frontend, database, auth, examples, dbSetup, projectDir } =
		config;

	const hasReactRouter = frontend.includes("react-router");
	const hasTanStackRouter = frontend.includes("tanstack-router");
	const hasTanStackStart = frontend.includes("tanstack-start");
	const hasNextJs = frontend.includes("next");
	const hasNuxt = frontend.includes("nuxt");
	const hasSvelte = frontend.includes("svelte");
	const hasSolid = frontend.includes("solid");
	const hasWebFrontend =
		hasReactRouter ||
		hasTanStackRouter ||
		hasTanStackStart ||
		hasNextJs ||
		hasNuxt ||
		hasSolid ||
		hasSvelte;

	if (hasWebFrontend) {
		const clientDir = path.join(projectDir, "apps/web");
		if (await fs.pathExists(clientDir)) {
			let envVarName = "VITE_SERVER_URL";
			let serverUrl = "http://localhost:3000";

			if (hasNextJs) {
				envVarName = "NEXT_PUBLIC_SERVER_URL";
			} else if (hasNuxt) {
				envVarName = "NUXT_PUBLIC_SERVER_URL";
			} else if (hasSvelte) {
				envVarName = "PUBLIC_SERVER_URL";
			}

			if (backend === "convex") {
				if (hasNextJs) envVarName = "NEXT_PUBLIC_CONVEX_URL";
				else if (hasNuxt) envVarName = "NUXT_PUBLIC_CONVEX_URL";
				else if (hasSvelte) envVarName = "PUBLIC_CONVEX_URL";
				else envVarName = "VITE_CONVEX_URL";

				serverUrl = "https://<YOUR_CONVEX_URL>";
			}

			const clientVars: EnvVariable[] = [
				{
					key: envVarName,
					value: serverUrl,
					condition: true,
				},
			];
			await addEnvVariablesToFile(path.join(clientDir, ".env"), clientVars);
		}
	}

	if (
		frontend.includes("native-nativewind") ||
		frontend.includes("native-unistyles")
	) {
		const nativeDir = path.join(projectDir, "apps/native");
		if (await fs.pathExists(nativeDir)) {
			let envVarName = "EXPO_PUBLIC_SERVER_URL";
			let serverUrl = "http://localhost:3000";

			if (backend === "convex") {
				envVarName = "EXPO_PUBLIC_CONVEX_URL";
				serverUrl = "https://<YOUR_CONVEX_URL>";
			}

			const nativeVars: EnvVariable[] = [
				{
					key: envVarName,
					value: serverUrl,
					condition: true,
				},
			];
			await addEnvVariablesToFile(path.join(nativeDir, ".env"), nativeVars);
		}
	}

	if (backend === "convex") {
		return;
	}

	const serverDir = path.join(projectDir, "apps/server");
	if (!(await fs.pathExists(serverDir))) {
		return;
	}
	const envPath = path.join(serverDir, ".env");

	let corsOrigin = "http://localhost:3001";
	if (hasReactRouter || hasSvelte) {
		corsOrigin = "http://localhost:5173";
	}

	let databaseUrl: string | null = null;
	const specializedSetup =
		dbSetup === "turso" ||
		dbSetup === "prisma-postgres" ||
		dbSetup === "mongodb-atlas" ||
		dbSetup === "neon" ||
		dbSetup === "supabase" ||
		dbSetup === "d1" ||
		dbSetup === "docker";

	if (database !== "none" && !specializedSetup) {
		switch (database) {
			case "postgres":
				databaseUrl = "postgresql://postgres:password@localhost:5432/postgres";
				break;
			case "mysql":
				databaseUrl = "mysql://root:password@localhost:3306/mydb";
				break;
			case "mongodb":
				databaseUrl = "mongodb://localhost:27017/mydatabase";
				break;
			case "sqlite":
				if (config.runtime === "workers") {
					databaseUrl = "http://127.0.0.1:8080";
				} else {
					databaseUrl = "file:./local.db";
				}
				break;
		}
	}

	const serverVars: EnvVariable[] = [
		{
			key: "CORS_ORIGIN",
			value: corsOrigin,
			condition: true,
		},
		{
			key: "BETTER_AUTH_SECRET",
			value: generateAuthSecret(),
			condition: !!auth,
		},
		{
			key: "BETTER_AUTH_URL",
			value: "http://localhost:3000",
			condition: !!auth,
		},
		{
			key: "DATABASE_URL",
			value: databaseUrl,
			condition: database !== "none" && !specializedSetup,
		},
		{
			key: "GOOGLE_GENERATIVE_AI_API_KEY",
			value: "",
			condition: examples?.includes("ai") || false,
		},
	];

	await addEnvVariablesToFile(envPath, serverVars);

	if (config.runtime === "workers") {
		const devVarsPath = path.join(serverDir, ".dev.vars");
		try {
			await fs.copy(envPath, devVarsPath);
		} catch (_err) {}
	}
}
