import { cancel, isCancel, log, select } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import type { ProjectBackend, ProjectDatabase } from "../types";

export async function getDatabaseChoice(
	database?: ProjectDatabase,
	backend?: ProjectBackend,
): Promise<ProjectDatabase> {
	if (backend === "convex") {
		return "none";
	}

	if (database !== undefined) return database;

	const response = await select<ProjectDatabase>({
		message: "Select database",
		options: [
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
			{
				value: "mysql",
				label: "MySQL",
				hint: "popular open-source relational database system",
			},
			{
				value: "mongodb",
				label: "MongoDB",
				hint: "open-source NoSQL database that stores data in JSON-like documents called BSON",
			},
		],
		initialValue: DEFAULT_CONFIG.database,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}
