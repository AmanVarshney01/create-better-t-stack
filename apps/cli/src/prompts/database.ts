import { cancel, isCancel, select } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import type { Backend, Database, Runtime } from "../types";

export async function getDatabaseChoice(
	database?: Database,
	backend?: Backend,
	runtime?: Runtime,
): Promise<Database> {
	// Backends that don't use traditional databases
	if (backend === "convex" || backend === "none") {
		return "none";
	}

	if (database !== undefined) return database;

	const databaseOptions = getAvailableDatabases(backend, runtime);

	const response = await select<Database>({
		message: "Select database",
		options: databaseOptions,
		initialValue: DEFAULT_CONFIG.database,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}

const databaseLabelsAndHints: { value: Database, label: string; hint: string, runtimes: Runtime[], backends: Backend[] }[] = [
	{
		value: "none",
		label: "None",
		hint: "No database setup",
		runtimes: ["bun", "node", "workers"],
		backends: ["hono", "express", "fastify", "next", "elysia", "convex", "bknd", "none"],
	},
	{
		value: "sqlite",
		label: "SQLite",
		hint: "lightweight, server-less, embedded relational database",
		runtimes: ["bun", "node", "workers"],
		backends: ["hono", "express", "fastify", "next", "elysia", "bknd", "none"],
	},
	{
		value: "postgres",
		label: "PostgreSQL",
		hint: "powerful, open source object-relational database system",
		runtimes: ["bun", "node", "workers"],
		backends: ["hono", "express", "fastify", "next", "elysia", "bknd", "none"],
	},
	{
		value: "mysql",
		label: "MySQL",
		runtimes: ["bun", "node", "workers"],
		hint: "popular open-source relational database system",
		backends: ["hono", "express", "fastify", "next", "elysia", "none"],
	},
	{
		value: "mongodb",
		label: "MongoDB",
		runtimes: ["bun", "node"], // MongoDB is not supported on workers.
		hint: "open-source NoSQL database that stores data in JSON-like documents",
		backends: ["hono", "express", "fastify", "next", "elysia", "none"],
	},
];

function getAvailableDatabases(
	backend?: Backend,
	runtime?: Runtime,
): Array<{ value: Database; label: string; hint: string }> {
	// Filter databases based on backend and runtime
	const supportedDatabases = databaseLabelsAndHints
		.filter((db) => {
			if (backend && !db.backends.includes(backend)) {
				return false;
			}
			if (runtime && !db.runtimes.includes(runtime)) {
				return false;
			}
			return true;
		})
		.map((db) => {
			return {
				value: db.value,
				label: db.label,
				hint: db.hint,
			};
		});

	return supportedDatabases;
}
