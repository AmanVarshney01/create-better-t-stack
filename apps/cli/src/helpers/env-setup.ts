import path from "node:path";
import fs from "fs-extra";
import type { ProjectConfig } from "../types";
import { generateAuthSecret } from "./auth-setup";

interface EnvVariable {
	key: string;
	value: string;
	condition: boolean;
}

async function addEnvVariablesToFile(
	filePath: string,
	variables: EnvVariable[],
): Promise<void> {
	await fs.ensureDir(path.dirname(filePath));

	let envContent = "";
	if (await fs.pathExists(filePath)) {
		envContent = await fs.readFile(filePath, "utf8");
	}

	let modified = false;
	for (const { key, value, condition } of variables) {
		if (condition) {
			const regex = new RegExp(`^${key}=.*$`, "m");
			if (regex.test(envContent)) {
				if (value) {
					envContent = envContent.replace(regex, `${key}=${value}`);
					modified = true;
				}
			} else {
				envContent += `\n${key}=${value}`;
				modified = true;
			}
		}
	}

	if (modified) {
		await fs.writeFile(filePath, envContent.trim());
	}
}

export async function setupEnvironmentVariables(
	config: ProjectConfig,
): Promise<void> {
	const { projectName } = config;
	const projectDir = path.resolve(process.cwd(), projectName);
	const options = config;
	const serverDir = path.join(projectDir, "apps/server");
	const envPath = path.join(serverDir, ".env");

	const hasReactRouter = options.frontend.includes("react-router");
	const hasTanStackRouter = options.frontend.includes("tanstack-router");
	const hasTanStackStart = options.frontend.includes("tanstack-start");
	const hasNextJs = options.frontend.includes("next");
	const hasNuxt = options.frontend.includes("nuxt");
	const hasSvelte = options.frontend.includes("svelte");
	const hasWebFrontend =
		hasReactRouter ||
		hasTanStackRouter ||
		hasTanStackStart ||
		hasNextJs ||
		hasNuxt ||
		hasSvelte;

	let corsOrigin = "http://localhost:3001";
	if (hasReactRouter || hasSvelte) {
		corsOrigin = "http://localhost:5173";
	} else if (hasTanStackRouter || hasTanStackStart || hasNextJs || hasNuxt) {
		corsOrigin = "http://localhost:3001";
	}

	let databaseUrl = "";
	const specializedSetup =
		options.dbSetup === "turso" ||
		options.dbSetup === "prisma-postgres" ||
		options.dbSetup === "mongodb-atlas" ||
		options.dbSetup === "neon";

	if (!specializedSetup) {
		if (options.database === "postgres") {
			databaseUrl =
				"postgresql://postgres:postgres@localhost:5432/mydb?schema=public";
		} else if (options.database === "mysql") {
			databaseUrl = "mysql://root:password@localhost:3306/mydb";
		} else if (options.database === "mongodb") {
			databaseUrl = "mongodb://localhost:27017/mydatabase";
		} else if (options.database === "sqlite") {
			databaseUrl = "file:./local.db";
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
			condition: !!options.auth,
		},
		{
			key: "BETTER_AUTH_URL",
			value: "http://localhost:3000",
			condition: !!options.auth,
		},
		{
			key: "DATABASE_URL",
			value: databaseUrl,
			condition:
				options.database !== "none" && databaseUrl !== "" && !specializedSetup,
		},
		{
			key: "GOOGLE_GENERATIVE_AI_API_KEY",
			value: "",
			condition: options.examples?.includes("ai") || false,
		},
	];

	await addEnvVariablesToFile(envPath, serverVars);

	if (hasWebFrontend) {
		const clientDir = path.join(projectDir, "apps/web");
		let envVarName = "VITE_SERVER_URL";

		if (hasNextJs) {
			envVarName = "NEXT_PUBLIC_SERVER_URL";
		} else if (hasNuxt) {
			envVarName = "NUXT_PUBLIC_SERVER_URL";
		} else if (hasSvelte) {
			envVarName = "PUBLIC_SERVER_URL";
		}

		const clientVars: EnvVariable[] = [
			{
				key: envVarName,
				value: "http://localhost:3000",
				condition: true,
			},
		];
		await addEnvVariablesToFile(path.join(clientDir, ".env"), clientVars);
	}

	if (options.frontend.includes("native")) {
		const nativeDir = path.join(projectDir, "apps/native");
		const nativeVars: EnvVariable[] = [
			{
				key: "EXPO_PUBLIC_SERVER_URL",
				value: "http://localhost:3000",
				condition: true,
			},
		];
		await addEnvVariablesToFile(path.join(nativeDir, ".env"), nativeVars);
	}
}
