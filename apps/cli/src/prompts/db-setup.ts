import { cancel, isCancel, log, select } from "@clack/prompts";
import pc from "picocolors";
import type { ProjectBackend, ProjectDBSetup, ProjectOrm } from "../types";

export async function getDBSetupChoice(
	databaseType: string,
	dbSetup: ProjectDBSetup | undefined,
	orm?: ProjectOrm,
	backend?: ProjectBackend,
): Promise<ProjectDBSetup> {
	if (backend === "convex") {
		return "none";
	}

	if (dbSetup !== undefined) return dbSetup as ProjectDBSetup;

	if (databaseType === "none") {
		return "none";
	}

	if (databaseType === "sqlite" && orm === "prisma") {
		return "none";
	}

	let options: Array<{ value: ProjectDBSetup; label: string; hint: string }> =
		[];

	if (databaseType === "sqlite") {
		options = [
			{
				value: "turso" as const,
				label: "Turso",
				hint: "SQLite for Production. Powered by libSQL",
			},
			{ value: "none" as const, label: "None", hint: "Manual setup" },
		];
	} else if (databaseType === "postgres") {
		options = [
			{
				value: "neon" as const,
				label: "Neon Postgres",
				hint: "Serverless Postgres with branching capability",
			},
			...(orm === "prisma"
				? [
						{
							value: "prisma-postgres" as const,
							label: "Prisma Postgres",
							hint: "Instant Postgres for Global Applications",
						},
					]
				: []),
			{ value: "none" as const, label: "None", hint: "Manual setup" },
		];
	} else if (databaseType === "mongodb") {
		options = [
			{
				value: "mongodb-atlas" as const,
				label: "MongoDB Atlas",
				hint: "The most effective way to deploy MongoDB",
			},
			{ value: "none" as const, label: "None", hint: "Manual setup" },
		];
	} else {
		return "none";
	}

	const response = await select<ProjectDBSetup>({
		message: `Select ${databaseType} setup option`,
		options,
		initialValue: "none",
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}
