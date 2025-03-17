import path from "node:path";
import { log } from "@clack/prompts";
import fs from "fs-extra";
import pc from "picocolors";
import { PKG_ROOT } from "../constants";
import type { ProjectConfig } from "../types";

export async function configureAuth(
	projectDir: string,
	enableAuth: boolean,
	hasDatabase: boolean,
	options: ProjectConfig,
): Promise<void> {
	const serverDir = path.join(projectDir, "packages/server");
	const clientDir = path.join(projectDir, "packages/client");

	try {
		if (!enableAuth) {
			await fs.remove(path.join(clientDir, "src/components/sign-up-form.tsx"));
			await fs.remove(path.join(clientDir, "src/components/sign-in-form.tsx"));
			await fs.remove(path.join(clientDir, "src/components/auth-forms.tsx"));
			await fs.remove(path.join(clientDir, "src/components/user-menu.tsx"));
			await fs.remove(path.join(clientDir, "src/lib/auth-client.ts"));

			const indexRoutePath = path.join(clientDir, "src/routes/index.tsx");
			const indexRouteContent = await fs.readFile(indexRoutePath, "utf8");
			const updatedIndexRouteContent = indexRouteContent
				.replace(/import AuthForms from "@\/components\/auth-forms";\n/, "")
				.replace(/<AuthForms \/>/, "");
			await fs.writeFile(indexRoutePath, updatedIndexRouteContent, "utf8");

			await fs.remove(path.join(serverDir, "src/lib/auth.ts"));

			const indexFilePath = path.join(serverDir, "src/index.ts");
			const indexContent = await fs.readFile(indexFilePath, "utf8");
			const updatedIndexContent = indexContent
				.replace(/import { auth } from "\.\/lib\/auth";\n/, "")
				.replace(
					/app\.on\(\["POST", "GET"\], "\/api\/auth\/\*\*", \(c\) => auth\.handler\(c\.req\.raw\)\);\n\n/,
					"",
				);
			await fs.writeFile(indexFilePath, updatedIndexContent, "utf8");

			const contextFilePath = path.join(serverDir, "src/lib/context.ts");
			const contextContent = await fs.readFile(contextFilePath, "utf8");
			const updatedContextContent = contextContent
				.replace(/import { auth } from "\.\/auth";\n/, "")
				.replace(
					/const session = await auth\.api\.getSession\({\n\s+headers: hono\.req\.raw\.headers,\n\s+}\);/,
					"const session = null;",
				);
			await fs.writeFile(contextFilePath, updatedContextContent, "utf8");
		} else if (!hasDatabase) {
			log.warn(
				pc.yellow(
					"Authentication enabled but no database selected. Auth will not function properly.",
				),
			);
		} else {
			const envPath = path.join(serverDir, ".env");
			const templateEnvPath = path.join(
				PKG_ROOT,
				getOrmTemplatePath(
					options.orm,
					options.database,
					"packages/server/_env",
				),
			);

			if (!(await fs.pathExists(envPath))) {
				if (await fs.pathExists(templateEnvPath)) {
					await fs.copy(templateEnvPath, envPath);
				} else {
					const defaultEnv = `BETTER_AUTH_SECRET=${generateAuthSecret()}
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3001
${options.database === "sqlite" ? "TURSO_CONNECTION_URL=http://127.0.0.1:8080" : ""}
${options.orm === "prisma" ? 'DATABASE_URL="file:./dev.db"' : ""}
`;
					await fs.writeFile(envPath, defaultEnv);
				}
			} else {
				let envContent = await fs.readFile(envPath, "utf8");

				if (!envContent.includes("BETTER_AUTH_SECRET")) {
					envContent += `\nBETTER_AUTH_SECRET=${generateAuthSecret()}`;
				}

				if (!envContent.includes("BETTER_AUTH_URL")) {
					envContent += "\nBETTER_AUTH_URL=http://localhost:3000";
				}

				if (!envContent.includes("CORS_ORIGIN")) {
					envContent += "\nCORS_ORIGIN=http://localhost:3001";
				}

				if (
					options.database === "sqlite" &&
					!envContent.includes("TURSO_CONNECTION_URL")
				) {
					envContent += "\nTURSO_CONNECTION_URL=http://127.0.0.1:8080";
				}

				if (options.orm === "prisma" && !envContent.includes("DATABASE_URL")) {
					envContent += '\nDATABASE_URL="file:./dev.db"';
				}

				await fs.writeFile(envPath, envContent);
			}

			const clientEnvPath = path.join(clientDir, ".env");
			if (!(await fs.pathExists(clientEnvPath))) {
				const clientEnvContent = "VITE_SERVER_URL=http://localhost:3000\n";
				await fs.writeFile(clientEnvPath, clientEnvContent);
			}

			if (options.orm === "prisma") {
				const prismaAuthPath = path.join(serverDir, "src/lib/auth.ts");
				const defaultPrismaAuthPath = path.join(
					PKG_ROOT,
					getOrmTemplatePath(
						options.orm,
						options.database,
						"packages/server/src/lib/auth.ts",
					),
				);

				if (
					(await fs.pathExists(defaultPrismaAuthPath)) &&
					!(await fs.pathExists(prismaAuthPath))
				) {
					await fs.ensureDir(path.dirname(prismaAuthPath));
					await fs.copy(defaultPrismaAuthPath, prismaAuthPath);
				}

				let authContent = await fs.readFile(prismaAuthPath, "utf8");
				if (!authContent.includes("trustedOrigins")) {
					authContent = authContent.replace(
						"export const auth = betterAuth({",
						"export const auth = betterAuth({\n    trustedOrigins: [process.env.CORS_ORIGIN!],",
					);
					await fs.writeFile(prismaAuthPath, authContent);
				}

				const packageJsonPath = path.join(projectDir, "package.json");
				if (await fs.pathExists(packageJsonPath)) {
					const packageJson = await fs.readJson(packageJsonPath);

					packageJson.scripts["prisma:generate"] =
						"cd packages/server && npx prisma generate";
					packageJson.scripts["prisma:push"] =
						"cd packages/server && npx prisma db push";
					packageJson.scripts["prisma:studio"] =
						"cd packages/server && npx prisma studio";
					packageJson.scripts["db:setup"] =
						"npm run auth:generate && npm run prisma:generate && npm run prisma:push";

					await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
				}
			} else if (options.orm === "drizzle") {
				const drizzleAuthPath = path.join(serverDir, "src/lib/auth.ts");
				const defaultDrizzleAuthPath = path.join(
					PKG_ROOT,
					getOrmTemplatePath(
						options.orm,
						options.database,
						"packages/server/src/lib/auth.ts",
					),
				);

				if (
					(await fs.pathExists(defaultDrizzleAuthPath)) &&
					!(await fs.pathExists(drizzleAuthPath))
				) {
					await fs.ensureDir(path.dirname(drizzleAuthPath));
					await fs.copy(defaultDrizzleAuthPath, drizzleAuthPath);
				}

				const packageJsonPath = path.join(projectDir, "package.json");
				if (await fs.pathExists(packageJsonPath)) {
					const packageJson = await fs.readJson(packageJsonPath);

					packageJson.scripts["db:push"] =
						"cd packages/server && npx @better-auth/cli migrate";
					packageJson.scripts["db:setup"] =
						"npm run auth:generate && npm run db:push";

					await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
				}
			}
		}
	} catch (error) {
		log.error(pc.red("Failed to configure authentication"));
		if (error instanceof Error) {
			log.error(pc.red(error.message));
		}
		throw error;
	}
}

function getOrmTemplatePath(
	orm: string,
	database: string,
	relativePath: string,
): string {
	if (orm === "drizzle") {
		return database === "sqlite"
			? `template/with-drizzle-sqlite/${relativePath}`
			: `template/with-drizzle-postgres/${relativePath}`;
	}
	if (orm === "prisma") {
		return database === "sqlite"
			? `template/with-prisma-sqlite/${relativePath}`
			: `template/with-prisma-postgres/${relativePath}`;
	}
	return `template/base/${relativePath}`;
}

function generateAuthSecret(length = 32): string {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
