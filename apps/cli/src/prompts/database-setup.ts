import { isCancel, select } from "@clack/prompts";
import type { Backend, DatabaseSetup, ORM, Runtime } from "../types";
import { exitCancelled } from "../utils/errors";

export async function getDBSetupChoice(
	databaseType: string,
	dbSetup: DatabaseSetup | undefined,
	_orm?: ORM,
	backend?: Backend,
	runtime?: Runtime,
): Promise<DatabaseSetup> {
	if (backend === "convex") {
		return "none";
	}

	if (dbSetup !== undefined) return dbSetup as DatabaseSetup;

	if (databaseType === "none") {
		return "none";
	}

	let options: Array<{ value: DatabaseSetup; label: string; hint: string }> =
		[];

	if (databaseType === "sqlite") {
		options = [
			{
				value: "turso" as const,
				label: "Turso",
				hint: "SQLite for Production. Powered by libSQL",
			},
			...(runtime === "workers"
				? [
						{
							value: "d1" as const,
							label: "Cloudflare D1",
							hint: "Cloudflare's managed, serverless database with SQLite's SQL semantics",
						},
					]
				: []),
			{ value: "none" as const, label: "None", hint: "Manual setup" },
		];
	} else if (databaseType === "postgres") {
		options = [
			{
				value: "neon" as const,
				label: "Neon Postgres",
				hint: "Serverless Postgres with branching capability",
			},
			{
				value: "planetscale" as const,
				label: "PlanetScale",
				hint: "Postgres & Vitess (MySQL) on NVMe",
			},
			{
				value: "supabase" as const,
				label: "Supabase",
				hint: "Local Supabase stack (requires Docker)",
			},
			{
				value: "prisma-postgres" as const,
				label: "Prisma Postgres",
				hint: "Instant Postgres for Global Applications",
			},
			{
				value: "docker" as const,
				label: "Docker",
				hint: "Run locally with docker compose",
			},
			{ value: "none" as const, label: "None", hint: "Manual setup" },
		];
	} else if (databaseType === "mysql") {
		options = [
			{
				value: "planetscale" as const,
				label: "PlanetScale",
				hint: "MySQL on Vitess (NVMe, HA)",
			},
			{
				value: "docker" as const,
				label: "Docker",
				hint: "Run locally with docker compose",
			},
			{ value: "none" as const, label: "None", hint: "Manual setup" },
		];
	} else if (databaseType === "mongodb") {
		options = [
			{
				value: "mongodb-atlas" as const,
				label: "MongoDB Atlas",
				hint: "The most effective way to deploy MongoDB",
			},
			{
				value: "docker" as const,
				label: "Docker",
				hint: "Run locally with docker compose",
			},
			{ value: "none" as const, label: "None", hint: "Manual setup" },
		];
	} else {
		return "none";
	}

	const response = await select<DatabaseSetup>({
		message: `Select ${databaseType} setup option`,
		options,
		initialValue: "none",
	});

	if (isCancel(response)) return exitCancelled("Operation cancelled");

	return response;
}
