import { cancel, isCancel, select } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import type { Backend, Database, ORM, Runtime } from "../types";

const ormLabelsAndHints: { value: ORM, label: string; hint: string, runtimes: Runtime[], backends: Backend[], databases: Database[] }[] = [
	{
		value: "none",
		label: "None",
		hint: "No ORM setup",
		runtimes: ["bun", "node", "workers"],
		backends: ["hono", "express", "fastify", "next", "elysia", "convex", "bknd", "none"],
		databases: ["none"],
	},
	{
		value: "drizzle",
		label: "Drizzle",
		hint: "Lightweight and performant TypeScript ORM",
		runtimes: ["bun", "node", "workers"],
		backends: ["hono", "express", "fastify", "next", "elysia", "bknd", "none"],
		databases: ["sqlite", "postgres", "mysql"],
	},
	{
		value: "prisma",
		label: "Prisma",
		hint: "Powerful, feature-rich ORM",
		runtimes: ["bun", "node"],
		backends: ["hono", "express", "fastify", "next", "elysia", "bknd", "none"],
		databases: ["sqlite", "postgres", "mysql", "mongodb"],
	},
	{
		value: "mongoose",
		label: "Mongoose",
		hint: "Elegant object modeling tool",
		runtimes: ["bun", "node"],
		backends: ["hono", "express", "fastify", "next", "elysia", "none"],
		databases: ["mongodb"],
	},
];

export async function getORMChoice(
	orm: ORM | undefined,
	hasDatabase: boolean,
	database?: Database,
	backend?: Backend,
	runtime?: Runtime,
): Promise<ORM> {
	if (!hasDatabase) return "none";
	if (orm !== undefined) return orm;

	const ormOptions = getAvailableORMs(database, backend, runtime);

	if (!ormOptions.length) return "none";

	const response = await select<ORM>({
		message: "Select ORM",
		options: ormOptions,
		initialValue: database === "mongodb" ? "prisma" : DEFAULT_CONFIG.orm,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}

function getAvailableORMs(
	database?: Database,
	backend?: Backend,
	runtime?: Runtime,
): Array<{ value: ORM; label: string; hint: string }> {
	// Filter ORMs based on database, backend and runtime
	const supportedORMs = ormLabelsAndHints
		.filter((orm) => {
			if (database && !orm.databases.includes(database)) {
				return false;
			}
			if (backend && !orm.backends.includes(backend)) {
				return false;
			}
			if (runtime && !orm.runtimes.includes(runtime)) {
				return false;
			}
			return true;
		})
		.map((orm) => {
			return {
				value: orm.value,
				label: orm.label,
				hint: orm.hint,
			};
		});

	return supportedORMs;
}
