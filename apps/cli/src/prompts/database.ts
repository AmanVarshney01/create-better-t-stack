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

function getAvailableDatabases(
	backend?: Backend,
	runtime?: Runtime,
): Array<{ value: Database; label: string; hint: string }> {
	const options: Array<{ value: Database; label: string; hint: string }> = [
		{
			value: "none",
			label: "None",
			hint: "No database setup",
		},
		{
			value: "sqlite",
			label: "SQLite",
			hint: "lightweight, server-less, embedded relational database",
		},
		{
			value: "postgres",
			label: "PostgreSQL",
			hint: "powerful, open source object-relational database system",
		},
	];

	// Add MySQL for all backends except bknd
	if (backend !== "bknd") {
		options.push({
			value: "mysql",
			label: "MySQL",
			hint: "popular open-source relational database system",
		});
	}

	// Add MongoDB for all runtimes except workers
	if (runtime !== "workers") {
		options.push({
			value: "mongodb",
			label: "MongoDB",
			hint: "open-source NoSQL database that stores data in JSON-like documents",
		});
	}

	return options;
}
