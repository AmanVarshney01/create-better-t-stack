import path from "node:path";
import fs from "fs-extra";
import type { ProjectConfig } from "../../types";
import { generateAuthSecret } from "./auth-setup";

function getClientServerVar(
	frontend: string[],
	backend: ProjectConfig["backend"],
) {
	const hasNextJs = frontend.includes("next");
	const hasNuxt = frontend.includes("nuxt");
	const hasSvelte = frontend.includes("svelte");
	const hasTanstackStart = frontend.includes("tanstack-start");

	// For fullstack self, no base URL is needed (same-origin)
	if (backend === "self") {
		return { key: "", value: "", write: false } as const;
	}

	let key = "VITE_SERVER_URL";
	if (hasNextJs) key = "NEXT_PUBLIC_SERVER_URL";
	else if (hasNuxt) key = "NUXT_PUBLIC_SERVER_URL";
	else if (hasSvelte) key = "PUBLIC_SERVER_URL";
	else if (hasTanstackStart) key = "VITE_SERVER_URL";

	return { key, value: "http://localhost:3000", write: true } as const;
}

function getConvexVar(frontend: string[]) {
	const hasNextJs = frontend.includes("next");
	const hasNuxt = frontend.includes("nuxt");
	const hasSvelte = frontend.includes("svelte");
	const hasTanstackStart = frontend.includes("tanstack-start");
	if (hasNextJs) return "NEXT_PUBLIC_CONVEX_URL";
	if (hasNuxt) return "NUXT_PUBLIC_CONVEX_URL";
	if (hasSvelte) return "PUBLIC_CONVEX_URL";
	if (hasTanstackStart) return "VITE_CONVEX_URL";
	return "VITE_CONVEX_URL";
}

export interface EnvVariable {
	key: string;
	value: string | null | undefined;
	condition: boolean;
	comment?: string;
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

	for (const { key, value, condition, comment } of variables) {
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
				if (comment) {
					contentToAdd += `# ${comment}\n`;
				}
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
	const {
		backend,
		frontend,
		database,
		auth,
		examples,
		dbSetup,
		projectDir,
		webDeploy,
		serverDeploy,
	} = config;

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
			const baseVar = getClientServerVar(frontend, backend);
			const envVarName =
				backend === "convex" ? getConvexVar(frontend) : baseVar.key;
			const serverUrl =
				backend === "convex" ? "https://<YOUR_CONVEX_URL>" : baseVar.value;

			const clientVars: EnvVariable[] = [
				{
					key: envVarName,
					value: serverUrl,
					condition: backend === "convex" ? true : baseVar.write,
				},
			];

			if (backend === "convex" && auth === "clerk") {
				if (hasNextJs) {
					clientVars.push(
						{
							key: "NEXT_PUBLIC_CLERK_FRONTEND_API_URL",
							value: "",
							condition: true,
						},
						{
							key: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
							value: "",
							condition: true,
						},
						{
							key: "CLERK_SECRET_KEY",
							value: "",
							condition: true,
						},
					);
				} else if (hasReactRouter || hasTanStackRouter || hasTanStackStart) {
					clientVars.push({
						key: "VITE_CLERK_PUBLISHABLE_KEY",
						value: "",
						condition: true,
					});
					if (hasTanStackStart) {
						clientVars.push({
							key: "CLERK_SECRET_KEY",
							value: "",
							condition: true,
						});
					}
				}
			}

			if (backend === "convex" && auth === "better-auth") {
				if (hasNextJs) {
					clientVars.push({
						key: "NEXT_PUBLIC_CONVEX_SITE_URL",
						value: "https://<YOUR_CONVEX_URL>",
						condition: true,
					});
				} else if (hasReactRouter || hasTanStackRouter || hasTanStackStart) {
					clientVars.push({
						key: "VITE_CONVEX_SITE_URL",
						value: "https://<YOUR_CONVEX_URL>",
						condition: true,
					});
				}
			}

			await addEnvVariablesToFile(path.join(clientDir, ".env"), clientVars);
		}
	}

	if (
		frontend.includes("native-bare") ||
		frontend.includes("native-uniwind") ||
		frontend.includes("native-unistyles")
	) {
		const nativeDir = path.join(projectDir, "apps/native");
		if (await fs.pathExists(nativeDir)) {
			let envVarName = "EXPO_PUBLIC_SERVER_URL";
			let serverUrl = "http://localhost:3000";

			if (backend === "self") {
				// Both TanStack Start and Next.js use port 3001 for fullstack
				serverUrl = "http://localhost:3001";
			}

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

			if (backend === "convex" && auth === "clerk") {
				nativeVars.push({
					key: "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY",
					value: "",
					condition: true,
				});
			}

			if (backend === "convex" && auth === "better-auth") {
				nativeVars.push({
					key: "EXPO_PUBLIC_CONVEX_SITE_URL",
					value: "https://<YOUR_CONVEX_URL>",
					condition: true,
				});
			}
			await addEnvVariablesToFile(path.join(nativeDir, ".env"), nativeVars);
		}
	}

	if (backend === "convex") {
		if (auth === "better-auth") {
			const convexBackendDir = path.join(projectDir, "packages/backend");
			if (await fs.pathExists(convexBackendDir)) {
				const envLocalPath = path.join(convexBackendDir, ".env.local");

				const hasNative =
					frontend.includes("native-bare") ||
					frontend.includes("native-uniwind") ||
					frontend.includes("native-unistyles");
				const hasWeb = hasWebFrontend;

				if (
					!(await fs.pathExists(envLocalPath)) ||
					!(await fs.readFile(envLocalPath, "utf8")).includes(
						"npx convex env set",
					)
				) {
					const convexCommands = `# Set Convex environment variables
# npx convex env set BETTER_AUTH_SECRET=$(openssl rand -base64 32)
${hasWeb ? "# npx convex env set SITE_URL http://localhost:3001\n" : ""}
`;
					await fs.appendFile(envLocalPath, convexCommands);
				}

				const convexBackendVars: EnvVariable[] = [];

				if (hasNative) {
					convexBackendVars.push({
						key: "EXPO_PUBLIC_CONVEX_SITE_URL",
						value: "",
						condition: true,
						comment: "Same as CONVEX_URL but ends in .site",
					});
				}

				if (hasWeb) {
					convexBackendVars.push(
						{
							key: hasNextJs
								? "NEXT_PUBLIC_CONVEX_SITE_URL"
								: "VITE_CONVEX_SITE_URL",
							value: "",
							condition: true,
							comment: "Same as CONVEX_URL but ends in .site",
						},
						{
							key: "SITE_URL",
							value: "http://localhost:3001",
							condition: true,
						},
					);
				}

				await addEnvVariablesToFile(envLocalPath, convexBackendVars);
			}
		}
		return;
	}

	const serverDir = path.join(projectDir, "apps/server");

	let corsOrigin = "http://localhost:3001";
	if (backend === "self") {
		corsOrigin = "http://localhost:3001";
	} else if (hasReactRouter || hasSvelte) {
		corsOrigin = "http://localhost:5173";
	}

	let databaseUrl: string | null = null;

	if (database !== "none" && dbSetup === "none") {
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
				if (
					config.runtime === "workers" ||
					webDeploy === "wrangler" ||
					serverDeploy === "wrangler" ||
					webDeploy === "alchemy" ||
					serverDeploy === "alchemy"
				) {
					databaseUrl = "http://127.0.0.1:8080";
				} else {
					const dbAppDir = backend === "self" ? "apps/web" : "apps/server";
					databaseUrl = `file:${path.join(config.projectDir, dbAppDir, "local.db")}`;
				}
				break;
		}
	}

	const serverVars: EnvVariable[] = [
		{
			key: "BETTER_AUTH_SECRET",
			value: generateAuthSecret(),
			condition: !!auth,
		},
		{
			key: "BETTER_AUTH_URL",
			value:
				backend === "self" ? "http://localhost:3001" : "http://localhost:3000",
			condition: !!auth,
		},
		{
			key: "POLAR_ACCESS_TOKEN",
			value: "",
			condition: config.payments === "polar",
		},
		{
			key: "POLAR_SUCCESS_URL",
			value: `${corsOrigin}/success?checkout_id={CHECKOUT_ID}`,
			condition: config.payments === "polar",
		},
		{
			key: "CORS_ORIGIN",
			value: corsOrigin,
			condition: true,
		},
		{
			key: "GOOGLE_GENERATIVE_AI_API_KEY",
			value: "",
			condition: examples?.includes("ai") || false,
		},
		{
			key: "DATABASE_URL",
			value: databaseUrl,
			condition: database !== "none" && dbSetup === "none",
		},
	];

	if (backend === "self") {
		const webDir = path.join(projectDir, "apps/web");
		if (await fs.pathExists(webDir)) {
			await addEnvVariablesToFile(path.join(webDir, ".env"), serverVars);
		}
	} else if (await fs.pathExists(serverDir)) {
		await addEnvVariablesToFile(path.join(serverDir, ".env"), serverVars);
	}

	const isUnifiedAlchemy =
		webDeploy === "alchemy" && serverDeploy === "alchemy";
	const isIndividualAlchemy =
		webDeploy === "alchemy" || serverDeploy === "alchemy";

	if (isUnifiedAlchemy) {
		const rootEnvPath = path.join(projectDir, ".env");
		const rootAlchemyVars: EnvVariable[] = [
			{
				key: "ALCHEMY_PASSWORD",
				value: "please-change-this",
				condition: true,
			},
		];
		await addEnvVariablesToFile(rootEnvPath, rootAlchemyVars);
	} else if (isIndividualAlchemy) {
		if (webDeploy === "alchemy") {
			const webDir = path.join(projectDir, "apps/web");
			if (await fs.pathExists(webDir)) {
				const webAlchemyVars: EnvVariable[] = [
					{
						key: "ALCHEMY_PASSWORD",
						value: "please-change-this",
						condition: true,
					},
				];
				await addEnvVariablesToFile(path.join(webDir, ".env"), webAlchemyVars);
			}
		}

		if (serverDeploy === "alchemy") {
			const serverAlchemyVars: EnvVariable[] = [
				{
					key: "ALCHEMY_PASSWORD",
					value: "please-change-this",
					condition: true,
				},
			];

			if (backend === "self") {
				const webDir = path.join(projectDir, "apps/web");
				if (await fs.pathExists(webDir)) {
					await addEnvVariablesToFile(
						path.join(webDir, ".env"),
						serverAlchemyVars,
					);
				}
			} else {
				await addEnvVariablesToFile(
					path.join(serverDir, ".env"),
					serverAlchemyVars,
				);
			}
		}
	}
}
