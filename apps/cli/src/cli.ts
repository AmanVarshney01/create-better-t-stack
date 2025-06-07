import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import type { YargsArgv } from "./types";
import { getLatestCLIVersion } from "./utils/get-latest-cli-version";

export async function parseCliArguments(): Promise<YargsArgv> {
	const argv = await yargs(hideBin(process.argv))
		.scriptName("create-better-t-stack")
		.usage(
			"$0 [project-directory] [options]",
			"Create a new Better-T Stack project",
		)
		.positional("project-directory", {
			describe: "Project name/directory",
			type: "string",
		})
		.option("yes", {
			alias: "y",
			type: "boolean",
			describe: "Use default configuration and skip prompts",
			default: false,
		})
		.option("database", {
			type: "string",
			describe: "Database type",
			choices: ["none", "sqlite", "postgres", "mysql", "mongodb"],
		})
		.option("orm", {
			type: "string",
			describe: "ORM type",
			choices: ["drizzle", "prisma", "mongoose", "none"],
		})
		.option("auth", {
			type: "boolean",
			describe: "Include authentication (use --no-auth to exclude)",
		})
		.option("frontend", {
			type: "array",
			string: true,
			describe: "Frontend types",
			choices: [
				"tanstack-router",
				"react-router",
				"tanstack-start",
				"next",
				"nuxt",
				"native-nativewind",
				"native-unistyles",
				"svelte",
				"angular",
				"solid",
				"none",
			],
		})
		.option("addons", {
			type: "array",
			string: true,
			describe: "Additional addons",
			choices: [
				"pwa",
				"tauri",
				"starlight",
				"biome",
				"husky",
				"turborepo",
				"none",
			],
		})
		.option("examples", {
			type: "array",
			string: true,
			describe: "Examples to include",
			choices: ["todo", "ai", "none"],
		})
		.option("git", {
			type: "boolean",
			describe: "Initialize git repository (use --no-git to skip)",
		})
		.option("package-manager", {
			alias: "pm",
			type: "string",
			describe: "Package manager",
			choices: ["npm", "pnpm", "bun"],
		})
		.option("install", {
			type: "boolean",
			describe: "Install dependencies (use --no-install to skip)",
		})
		.option("db-setup", {
			type: "string",
			describe: "Database setup",
			choices: [
				"turso",
				"neon",
				"prisma-postgres",
				"mongodb-atlas",
				"supabase",
				"none",
			],
		})
		.option("backend", {
			type: "string",
			describe: "Backend framework",
			choices: [
				"hono",
				"express",
				"fastify",
				"next",
				"elysia",
				"convex",
				"none",
			],
		})
		.option("runtime", {
			type: "string",
			describe: "Runtime",
			choices: ["bun", "node", "none"],
		})
		.option("api", {
			type: "string",
			describe: "API type",
			choices: ["trpc", "orpc", "none"],
		})
		.completion()
		.recommendCommands()
		.version(getLatestCLIVersion())
		.alias("version", "v")
		.help()
		.alias("help", "h")
		.strict()
		.wrap(null)
		.parse();

	return argv as YargsArgv;
}
