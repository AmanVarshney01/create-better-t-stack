import { cancel, isCancel, select } from "@clack/prompts";
import pc from "picocolors";
import { DATABASE_COMPATIBILITY, DEFAULT_CONFIG } from "../constants";
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

const DATABASE_DETAILS: Record<Database, { label: string; hint: string }> = {
	none: {
		label: "None",
		hint: "No database setup",
	},
	sqlite: {
		label: "SQLite",
		hint: "lightweight, server-less, embedded relational database",
	},
	postgres: {
		label: "PostgreSQL",
		hint: "powerful, open source object-relational database system",
	},
	mysql: {
		label: "MySQL",
		hint: "popular open-source relational database system",
	},
	mongodb: {
		label: "MongoDB",
		hint: "open-source NoSQL database that stores data in JSON-like documents",
	},
};

function getAvailableDatabases(
	backend?: Backend,
	runtime?: Runtime,
): Array<{ value: Database; label: string; hint: string }> {
	// Filter databases based on backend and runtime
	const supportedDatabases = Object.entries(DATABASE_COMPATIBILITY)
		.filter(
			([
				_database,
				{ runtimes: dbSupportedRuntimes, backends: dbSupportedBackends },
			]) => {
				if (backend && !dbSupportedBackends.includes(backend)) {
					return false;
				}
				if (runtime && !dbSupportedRuntimes.includes(runtime)) {
					return false;
				}
				return true;
			},
		)
		.map(([database, _values]) => {
			const { label, hint } = DATABASE_DETAILS[database as Database];
			return {
				value: database as Database,
				label,
				hint,
			};
		});

	return supportedDatabases;
}
