import { consola } from "consola";
import pc from "picocolors";
import type { ProjectDatabase, ProjectOrm, ProjectRuntime } from "../types";
import { getPackageExecutionCommand } from "../utils/get-package-execution-command";

import type { ProjectConfig } from "../types";

export function displayPostInstallInstructions(
	config: ProjectConfig & { depsInstalled: boolean },
) {
	const {
		database,
		projectName,
		packageManager,
		depsInstalled,
		orm,
		addons,
		runtime,
		frontend,
	} = config;
	const runCmd = packageManager === "npm" ? "npm run" : packageManager;
	const cdCmd = `cd ${projectName}`;
	const hasHuskyOrBiome =
		addons?.includes("husky") || addons?.includes("biome");

	const databaseInstructions =
		database !== "none"
			? getDatabaseInstructions(database, orm, runCmd, runtime)
			: "";
	const tauriInstructions = addons?.includes("tauri")
		? getTauriInstructions(runCmd)
		: "";
	const lintingInstructions = hasHuskyOrBiome
		? getLintingInstructions(runCmd)
		: "";
	const nativeInstructions = frontend?.includes("native")
		? getNativeInstructions()
		: "";
	const pwaInstructions =
		addons?.includes("pwa") &&
		(frontend?.includes("react-router") ||
			frontend?.includes("tanstack-router")) // Exclude Nuxt from PWA instructions
			? getPwaInstructions()
			: "";
	const starlightInstructions = addons?.includes("starlight")
		? getStarlightInstructions(runCmd)
		: "";
	const hasWeb = frontend?.some((f) =>
		[
			"tanstack-router",
			"react-router",
			"next",
			"tanstack-start",
			"nuxt", // Include Nuxt here
		].includes(f),
	);
	const hasNative = frontend?.includes("native");
	const bunWebNativeWarning =
		packageManager === "bun" && hasNative && hasWeb
			? getBunWebNativeWarning()
			: "";
	const noOrmWarning =
		database !== "none" && orm === "none" ? getNoOrmWarning() : "";

	const hasTanstackRouter = frontend?.includes("tanstack-router");
	const hasTanstackStart = frontend?.includes("tanstack-start");
	const hasReactRouter = frontend?.includes("react-router");
	const hasNuxt = frontend?.includes("nuxt"); // Add Nuxt check
	const hasWebFrontend =
		hasTanstackRouter || hasReactRouter || hasTanstackStart || hasNuxt; // Include Nuxt
	const hasNativeFrontend = frontend?.includes("native");
	const hasFrontend = hasWebFrontend || hasNativeFrontend;

	const webPort = hasReactRouter ? "5173" : "3001"; // Nuxt uses 3001, same as others
	const tazeCommand = getPackageExecutionCommand(packageManager, "taze -r");

	consola.box(
		`${pc.bold("Next steps")}\n${pc.cyan("1.")} ${cdCmd}
${
	!depsInstalled ? `${pc.cyan("2.")} ${packageManager} install\n` : ""
}${pc.cyan(depsInstalled ? "2." : "3.")} ${runCmd} dev

${pc.bold("Your project will be available at:")}
${
	hasFrontend
		? `${
				hasWebFrontend
					? `${pc.cyan("•")} Frontend: http://localhost:${webPort}\n`
					: ""
			}`
		: `${pc.yellow(
				"NOTE:",
			)} You are creating a backend-only app (no frontend selected)\n`
}${pc.cyan("•")} Backend: http://localhost:3000
${
	addons?.includes("starlight")
		? `${pc.cyan("•")} Docs: http://localhost:4321\n`
		: ""
}${nativeInstructions ? `\n${nativeInstructions.trim()}` : ""}${
	databaseInstructions ? `\n${databaseInstructions.trim()}` : ""
}${tauriInstructions ? `\n${tauriInstructions.trim()}` : ""}${
	lintingInstructions ? `\n${lintingInstructions.trim()}` : ""
}${pwaInstructions ? `\n${pwaInstructions.trim()}` : ""}${
	starlightInstructions ? `\n${starlightInstructions.trim()}` : ""
}${noOrmWarning ? `\n${noOrmWarning.trim()}` : ""}${
	bunWebNativeWarning ? `\n${bunWebNativeWarning.trim()}` : ""
}

${pc.bold("Update all dependencies:\n")}${pc.cyan(tazeCommand)}

${pc.bold("Like Better-T Stack?")} Please consider giving us a star on GitHub:
${pc.cyan("https://github.com/AmanVarshney01/create-better-t-stack")}`,
	);
}

function getNativeInstructions(): string {
	return `${pc.yellow(
		"NOTE:",
	)} For Expo connectivity issues, update apps/native/.env \nwith your local IP:\n${"EXPO_PUBLIC_SERVER_URL=http://192.168.0.103:3000"}\n`;
}

function getLintingInstructions(runCmd?: string): string {
	return `${pc.bold("Linting and formatting:")}\n${pc.cyan(
		"•",
	)} Format and lint fix: ${`${runCmd} check`}\n\n`;
}

function getDatabaseInstructions(
	database: ProjectDatabase,
	orm?: ProjectOrm,
	runCmd?: string,
	runtime?: ProjectRuntime,
): string {
	const instructions = [];

	if (orm === "prisma") {
		if (database === "sqlite") {
			instructions.push(
				`${pc.yellow(
					"NOTE:",
				)} Turso support with Prisma is in Early Access and requires additional setup.`,
				`${"Learn more at: https://www.prisma.io/docs/orm/overview/databases/turso"}`,
			);
		}

		if (runtime === "bun") {
			instructions.push(
				`${pc.yellow(
					"NOTE:",
				)} Prisma with Bun may require additional configuration. If you encounter errors,\nfollow the guidance provided in the error messages`,
			);
		}

		instructions.push(`${pc.cyan("•")} Apply schema: ${`${runCmd} db:push`}`);
		instructions.push(`${pc.cyan("•")} Database UI: ${`${runCmd} db:studio`}`);
	} else if (orm === "drizzle") {
		instructions.push(`${pc.cyan("•")} Apply schema: ${`${runCmd} db:push`}`);
		instructions.push(`${pc.cyan("•")} Database UI: ${`${runCmd} db:studio`}`);
	}

	return instructions.length
		? `${pc.bold("Database commands:")}\n${instructions.join("\n")}\n\n`
		: "";
}

function getTauriInstructions(runCmd?: string): string {
	return `\n${pc.bold("Desktop app with Tauri:")}\n${pc.cyan(
		"•",
	)} Start desktop app: ${`cd apps/web && ${runCmd} desktop:dev`}\n${pc.cyan(
		"•",
	)} Build desktop app: ${`cd apps/web && ${runCmd} desktop:build`}\n${pc.yellow(
		"NOTE:",
	)} Tauri requires Rust and platform-specific dependencies.\nSee: ${"https://v2.tauri.app/start/prerequisites/"}\n\n`;
}

function getPwaInstructions(): string {
	return `${pc.bold("PWA with React Router v7:")}\n${pc.yellow(
		"NOTE:",
	)} There is a known compatibility issue between VitePWA and React Router v7.\nSee: https://github.com/vite-pwa/vite-plugin-pwa/issues/809\n`;
}

function getStarlightInstructions(runCmd?: string): string {
	return `${pc.bold("Documentation with Starlight:")}\n${pc.cyan(
		"•",
	)} Start docs site: ${`cd apps/docs && ${runCmd} dev`}\n${pc.cyan(
		"•",
	)} Build docs site: ${`cd apps/docs && ${runCmd} build`}\n`;
}

function getNoOrmWarning(): string {
	return `\n${pc.yellow(
		"WARNING:",
	)} Database selected without an ORM. Features requiring database access (e.g., examples, auth) need manual setup.\n`;
}

function getBunWebNativeWarning(): string {
	return `\n${pc.yellow(
		"WARNING:",
	)} 'bun' might cause issues with web + native apps in a monorepo. Use 'pnpm' if problems arise.\n`;
}
