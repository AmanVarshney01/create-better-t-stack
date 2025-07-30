import { consola } from "consola";
import pc from "picocolors";
import type {
	Database,
	DatabaseSetup,
	ORM,
	ProjectConfig,
	Runtime,
} from "../../types";
import { getDockerStatus } from "../../utils/docker-utils";
import { getPackageExecutionCommand } from "../../utils/package-runner";

export async function displayPostInstallInstructions(
	config: ProjectConfig & { depsInstalled: boolean },
) {
	const {
		database,
		relativePath,
		packageManager,
		depsInstalled,
		orm,
		addons,
		runtime,
		frontend,
		backend,
		dbSetup,
		webDeploy,
	} = config;

	const isConvex = backend === "convex";
	const runCmd = packageManager === "npm" ? "npm run" : packageManager;
	const cdCmd = `cd ${relativePath}`;
	const hasHuskyOrBiome =
		addons?.includes("husky") || addons?.includes("biome");

	const databaseInstructions =
		!isConvex && database !== "none"
			? await getDatabaseInstructions(database, orm, runCmd, runtime, dbSetup)
			: "";

	const tauriInstructions = addons?.includes("tauri")
		? getTauriInstructions(runCmd)
		: "";
	const lintingInstructions = hasHuskyOrBiome
		? getLintingInstructions(runCmd)
		: "";
	const nativeInstructions =
		frontend?.includes("native-nativewind") ||
		frontend?.includes("native-unistyles")
			? getNativeInstructions(isConvex)
			: "";
	const pwaInstructions =
		addons?.includes("pwa") && frontend?.includes("react-router")
			? getPwaInstructions()
			: "";
	const starlightInstructions = addons?.includes("starlight")
		? getStarlightInstructions(runCmd)
		: "";
	const workersDeployInstructions =
		webDeploy === "workers" ? getWorkersDeployInstructions(runCmd) : "";

	const hasWeb = frontend?.some((f) =>
		[
			"tanstack-router",
			"react-router",
			"next",
			"tanstack-start",
			"nuxt",
			"svelte",
			"solid",
		].includes(f),
	);
	const hasNative =
		frontend?.includes("native-nativewind") ||
		frontend?.includes("native-unistyles");

	const bunWebNativeWarning =
		packageManager === "bun" && hasNative && hasWeb
			? getBunWebNativeWarning()
			: "";
	const noOrmWarning =
		!isConvex && database !== "none" && orm === "none" ? getNoOrmWarning() : "";

	const hasReactRouter = frontend?.includes("react-router");
	const hasSvelte = frontend?.includes("svelte");
	const webPort = hasReactRouter || hasSvelte ? "5173" : "3001";

	const tazeCommand = getPackageExecutionCommand(packageManager, "taze -r");

	let output = `${pc.bold("Next steps")}\n${pc.cyan("1.")} ${cdCmd}\n`;
	let stepCounter = 2;

	if (!depsInstalled) {
		output += `${pc.cyan(`${stepCounter++}.`)} ${packageManager} install\n`;
	}

	if (isConvex) {
		output += `${pc.cyan(`${stepCounter++}.`)} ${runCmd} dev:setup ${pc.dim(
			"(this will guide you through Convex project setup)",
		)}\n`;
		output += `${pc.cyan(
			`${stepCounter++}.`,
		)} Copy environment variables from ${pc.white(
			"packages/backend/.env.local",
		)} \nto ${pc.white("apps/*/.env")}\n`;
		output += `${pc.cyan(`${stepCounter++}.`)} ${runCmd} dev\n\n`;
	} else {
		if (runtime !== "workers") {
			output += `${pc.cyan(`${stepCounter++}.`)} ${runCmd} dev\n`;
		}

		if (runtime === "workers") {
			if (dbSetup === "d1") {
				output += `${pc.yellow(
					"IMPORTANT:",
				)} Complete D1 database setup first (see Database commands below)\n`;
			}
			output += `${pc.cyan(`${stepCounter++}.`)} ${runCmd} dev\n`;
			output += `${pc.cyan(
				`${stepCounter++}.`,
			)} cd apps/server && ${runCmd} run cf-typegen\n\n`;
		} else {
			output += "\n";
		}
	}

	output += `${pc.bold("Your project will be available at:")}\n`;

	if (hasWeb) {
		output += `${pc.cyan("•")} Frontend: http://localhost:${webPort}\n`;
	} else if (!hasNative && !addons?.includes("starlight")) {
		output += `${pc.yellow(
			"NOTE:",
		)} You are creating a backend-only app (no frontend selected)\n`;
	}

	if (!isConvex) {
		output += `${pc.cyan("•")} Backend API: http://localhost:3000\n`;
	}

	if (addons?.includes("starlight")) {
		output += `${pc.cyan("•")} Docs: http://localhost:4321\n`;
	}

	if (addons?.includes("fumadocs")) {
		output += `${pc.cyan("•")} Fumadocs: http://localhost:4000\n`;
	}

	if (nativeInstructions) output += `\n${nativeInstructions.trim()}\n`;
	if (databaseInstructions) output += `\n${databaseInstructions.trim()}\n`;
	if (tauriInstructions) output += `\n${tauriInstructions.trim()}\n`;
	if (lintingInstructions) output += `\n${lintingInstructions.trim()}\n`;
	if (pwaInstructions) output += `\n${pwaInstructions.trim()}\n`;
	if (workersDeployInstructions)
		output += `\n${workersDeployInstructions.trim()}\n`;
	if (starlightInstructions) output += `\n${starlightInstructions.trim()}\n`;

	if (noOrmWarning) output += `\n${noOrmWarning.trim()}\n`;
	if (bunWebNativeWarning) output += `\n${bunWebNativeWarning.trim()}\n`;

	output += `\n${pc.bold("Update all dependencies:\n")}${pc.cyan(
		tazeCommand,
	)}\n\n`;
	output += `${pc.bold(
		"Like Better-T Stack?",
	)} Please consider giving us a star on GitHub:\n`;
	output += pc.cyan("https://github.com/AmanVarshney01/create-better-t-stack");

	consola.box(output);
}

function getNativeInstructions(isConvex: boolean): string {
	const envVar = isConvex ? "EXPO_PUBLIC_CONVEX_URL" : "EXPO_PUBLIC_SERVER_URL";
	const exampleUrl = isConvex
		? "https://<YOUR_CONVEX_URL>"
		: "http://<YOUR_LOCAL_IP>:3000";
	const envFileName = ".env";
	const ipNote = isConvex
		? "your Convex deployment URL (find after running 'dev:setup')"
		: "your local IP address";

	let instructions = `${pc.yellow(
		"NOTE:",
	)} For Expo connectivity issues, update apps/native/${envFileName} \nwith ${ipNote}:\n${`${envVar}=${exampleUrl}`}\n`;

	if (isConvex) {
		instructions += `\n${pc.yellow(
			"IMPORTANT:",
		)} When using local development with Convex and native apps, ensure you use your local IP address \ninstead of localhost or 127.0.0.1 for proper connectivity.\n`;
	}

	return instructions;
}

function getLintingInstructions(runCmd?: string): string {
	return `${pc.bold("Linting and formatting:")}\n${pc.cyan(
		"•",
	)} Format and lint fix: ${`${runCmd} check`}\n`;
}

async function getDatabaseInstructions(
	database: Database,
	orm?: ORM,
	runCmd?: string,
	runtime?: Runtime,
	dbSetup?: DatabaseSetup,
): Promise<string> {
	const instructions = [];

	if (dbSetup === "docker") {
		const dockerStatus = await getDockerStatus(database);

		if (dockerStatus.message) {
			instructions.push(dockerStatus.message);
			instructions.push("");
		}
	}

	if (runtime === "workers" && dbSetup === "d1") {
		const packageManager = runCmd === "npm run" ? "npm" : runCmd || "npm";

		instructions.push(
			`${pc.cyan("1.")} Login to Cloudflare: ${pc.white(
				`${packageManager} wrangler login`,
			)}`,
		);
		instructions.push(
			`${pc.cyan("2.")} Create D1 database: ${pc.white(
				`${packageManager} wrangler d1 create your-database-name`,
			)}`,
		);
		instructions.push(
			`${pc.cyan(
				"3.",
			)} Update apps/server/wrangler.jsonc with database_id and database_name`,
		);
		instructions.push(
			`${pc.cyan("4.")} Generate migrations: ${pc.white(
				"cd apps/server && bun db:generate",
			)}`,
		);
		instructions.push(
			`${pc.cyan("5.")} Apply migrations locally: ${pc.white(
				`${packageManager} wrangler d1 migrations apply YOUR_DB_NAME --local`,
			)}`,
		);
		instructions.push(
			`${pc.cyan("6.")} Apply migrations to production: ${pc.white(
				`${packageManager} wrangler d1 migrations apply YOUR_DB_NAME`,
			)}`,
		);
		instructions.push("");
	}

	if (orm === "prisma") {
		if (dbSetup === "turso") {
			instructions.push(
				`${pc.yellow(
					"NOTE:",
				)} Turso support with Prisma is in Early Access and requires additional setup.`,
				`${"Learn more at: https://www.prisma.io/docs/orm/overview/databases/turso"}`,
			);
		}

		if (database === "mongodb" && dbSetup === "docker") {
			instructions.push(
				`${pc.yellow(
					"WARNING:",
				)} Prisma + MongoDB + Docker combination may not work.`,
			);
		}
		if (dbSetup === "docker") {
			instructions.push(
				`${pc.cyan("•")} Start docker container: ${`${runCmd} db:start`}`,
			);
		}
		instructions.push(`${pc.cyan("•")} Apply schema: ${`${runCmd} db:push`}`);
		instructions.push(`${pc.cyan("•")} Database UI: ${`${runCmd} db:studio`}`);
	} else if (orm === "drizzle") {
		if (dbSetup === "docker") {
			instructions.push(
				`${pc.cyan("•")} Start docker container: ${`${runCmd} db:start`}`,
			);
		}
		instructions.push(`${pc.cyan("•")} Apply schema: ${`${runCmd} db:push`}`);
		instructions.push(`${pc.cyan("•")} Database UI: ${`${runCmd} db:studio`}`);
		if (database === "sqlite" && dbSetup !== "d1") {
			instructions.push(
				`${pc.cyan(
					"•",
				)} Start local DB (if needed): ${`cd apps/server && ${runCmd} db:local`}`,
			);
		}
	} else if (orm === "mongoose") {
		if (dbSetup === "docker") {
			instructions.push(
				`${pc.cyan("•")} Start docker container: ${`${runCmd} db:start`}`,
			);
		}
	} else if (orm === "none") {
		instructions.push(
			`${pc.yellow("NOTE:")} Manual database schema setup required.`,
		);
	}

	return instructions.length
		? `${pc.bold("Database commands:")}\n${instructions.join("\n")}`
		: "";
}

function getTauriInstructions(runCmd?: string): string {
	return `\n${pc.bold("Desktop app with Tauri:")}\n${pc.cyan(
		"•",
	)} Start desktop app: ${`cd apps/web && ${runCmd} desktop:dev`}\n${pc.cyan(
		"•",
	)} Build desktop app: ${`cd apps/web && ${runCmd} desktop:build`}\n${pc.yellow(
		"NOTE:",
	)} Tauri requires Rust and platform-specific dependencies.\nSee: ${"https://v2.tauri.app/start/prerequisites/"}`;
}

function getPwaInstructions(): string {
	return `\n${pc.bold("PWA with React Router v7:")}\n${pc.yellow(
		"NOTE:",
	)} There is a known compatibility issue between VitePWA \nand React Router v7.See: https://github.com/vite-pwa/vite-plugin-pwa/issues/809`;
}

function getStarlightInstructions(runCmd?: string): string {
	return `\n${pc.bold("Documentation with Starlight:")}\n${pc.cyan(
		"•",
	)} Start docs site: ${`cd apps/docs && ${runCmd} dev`}\n${pc.cyan(
		"•",
	)} Build docs site: ${`cd apps/docs && ${runCmd} build`}`;
}

function getNoOrmWarning(): string {
	return `\n${pc.yellow(
		"WARNING:",
	)} Database selected without an ORM. Features requiring database access (e.g., examples, auth) need manual setup.`;
}

function getBunWebNativeWarning(): string {
	return `\n${pc.yellow(
		"WARNING:",
	)} 'bun' might cause issues with web + native apps in a monorepo. Use 'pnpm' if problems arise.`;
}

function getWorkersDeployInstructions(runCmd?: string): string {
	return `\n${pc.bold("Deploy frontend to Cloudflare Workers:")}\n${pc.cyan("•")} Deploy: ${`cd apps/web && ${runCmd || "bun run"} deploy`}`;
}
