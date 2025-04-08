import path from "node:path";
import fs from "fs-extra";
import type { ProjectConfig } from "../types";
import { generateAuthSecret } from "./auth-setup";

export async function setupEnvironmentVariables(
	projectDir: string,
	options: ProjectConfig,
): Promise<void> {
	const serverDir = path.join(projectDir, "apps/server");

	const envPath = path.join(serverDir, ".env");
	let envContent = "";

	if (await fs.pathExists(envPath)) {
		envContent = await fs.readFile(envPath, "utf8");
	}

	if (!envContent.includes("CORS_ORIGIN")) {
		const hasReactRouter = options.frontend.includes("react-router");
		const hasTanStackRouter = options.frontend.includes("tanstack-router");
		const hasTanStackStart = options.frontend.includes("tanstack-start");

		let corsOrigin = "http://localhost:3000";

		if (hasReactRouter) {
			corsOrigin = "http://localhost:5173";
		} else if (hasTanStackRouter || hasTanStackStart) {
			corsOrigin = "http://localhost:3001";
		}

		envContent += `\nCORS_ORIGIN=${corsOrigin}`;
	}

	if (options.auth) {
		if (!envContent.includes("BETTER_AUTH_SECRET")) {
			envContent += `\nBETTER_AUTH_SECRET=${generateAuthSecret()}`;
		}

		if (!envContent.includes("BETTER_AUTH_URL")) {
			envContent += "\nBETTER_AUTH_URL=http://localhost:3000";
		}
	}

	if (options.database !== "none") {
		if (options.orm === "prisma" && !envContent.includes("DATABASE_URL")) {
			let databaseUrlLine = "";
			if (options.database === "sqlite") {
				databaseUrlLine = "";
			} else if (options.database === "postgres") {
				databaseUrlLine = `\nDATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=public"`;
			} else if (options.database === "mongodb") {
				databaseUrlLine = `\nDATABASE_URL="mongodb://localhost:27017/mydatabase"`;
			}
			envContent += databaseUrlLine;
		}

		if (options.database === "sqlite" && options.dbSetup !== "turso") {
			if (!envContent.includes("TURSO_CONNECTION_URL")) {
				envContent += "\nTURSO_CONNECTION_URL=file:./local.db";
			}
		}
	}

	if (
		options.examples?.includes("ai") &&
		!envContent.includes("GOOGLE_GENERATIVE_AI_API_KEY")
	) {
		envContent += "\nGOOGLE_GENERATIVE_AI_API_KEY=";
	}

	await fs.writeFile(envPath, envContent.trim());

	const hasReactRouter = options.frontend.includes("react-router");
	const hasTanStackRouter = options.frontend.includes("tanstack-router");
	const hasTanStackStart = options.frontend.includes("tanstack-start");
	const hasWebFrontend =
		hasReactRouter || hasTanStackRouter || hasTanStackStart;

	if (hasWebFrontend) {
		const clientDir = path.join(projectDir, "apps/web");
		await setupClientEnvFile(clientDir);
	}

	if (options.frontend.includes("native")) {
		const nativeDir = path.join(projectDir, "apps/native");
		const nativeEnvPath = path.join(nativeDir, ".env");
		let nativeEnvContent = "";

		if (await fs.pathExists(nativeEnvPath)) {
			nativeEnvContent = await fs.readFile(nativeEnvPath, "utf8");
		}

		if (!nativeEnvContent.includes("EXPO_PUBLIC_SERVER_URL")) {
			nativeEnvContent += "EXPO_PUBLIC_SERVER_URL=http://localhost:3000\n";
		}

		await fs.writeFile(nativeEnvPath, nativeEnvContent.trim());
	}
}

async function setupClientEnvFile(clientDir: string) {
	const clientEnvPath = path.join(clientDir, ".env");
	let clientEnvContent = "";

	if (await fs.pathExists(clientEnvPath)) {
		clientEnvContent = await fs.readFile(clientEnvPath, "utf8");
	}

	if (!clientEnvContent.includes("VITE_SERVER_URL")) {
		clientEnvContent += "VITE_SERVER_URL=http://localhost:3000\n";
	}

	await fs.writeFile(clientEnvPath, clientEnvContent.trim());
}
