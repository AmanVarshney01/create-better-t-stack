import {
	DEFAULT_STACK,
	type StackState,
	type TECH_OPTIONS,
} from "@/lib/constant";
import { CATEGORY_ORDER } from "@/lib/stack-utils";

export function validateProjectName(name: string): string | undefined {
	const INVALID_CHARS = ["<", ">", ":", '"', "|", "?", "*"];
	const MAX_LENGTH = 255;

	if (name === ".") return undefined;

	if (!name) return "Project name cannot be empty";
	if (name.length > MAX_LENGTH) {
		return `Project name must be less than ${MAX_LENGTH} characters`;
	}
	if (INVALID_CHARS.some((char) => name.includes(char))) {
		return "Project name contains invalid characters";
	}
	if (name.startsWith(".") || name.startsWith("-")) {
		return "Project name cannot start with a dot or dash";
	}
	if (
		name.toLowerCase() === "node_modules" ||
		name.toLowerCase() === "favicon.ico"
	) {
		return "Project name is reserved";
	}
	return undefined;
}

export const hasPWACompatibleFrontend = (webFrontend: string[]) =>
	webFrontend.some((f) =>
		["tanstack-router", "react-router", "solid", "next"].includes(f),
	);

export const hasTauriCompatibleFrontend = (webFrontend: string[]) =>
	webFrontend.some((f) =>
		[
			"tanstack-router",
			"react-router",
			"nuxt",
			"svelte",
			"solid",
			"next",
		].includes(f),
	);

export const getCategoryDisplayName = (categoryKey: string): string => {
	const result = categoryKey.replace(/([A-Z])/g, " $1");
	return result.charAt(0).toUpperCase() + result.slice(1);
};

interface CompatibilityResult {
	adjustedStack: StackState | null;
	notes: Record<string, { notes: string[]; hasIssue: boolean }>;
	changes: Array<{ category: string; message: string }>;
}

export const analyzeStackCompatibility = (
	stack: StackState,
): CompatibilityResult => {
	// Skip all validation if YOLO mode is enabled
	if (stack.yolo === "true") {
		return {
			adjustedStack: null,
			notes: {},
			changes: [],
		};
	}

	const nextStack = { ...stack };
	let changed = false;
	const notes: CompatibilityResult["notes"] = {};
	const changes: Array<{ category: string; message: string }> = [];

	for (const cat of CATEGORY_ORDER) {
		notes[cat] = { notes: [], hasIssue: false };
	}

	const isConvex = nextStack.backend === "convex";
	const isBackendNone = nextStack.backend === "none";
	const isBackendSelf =
		nextStack.backend === "self-next" ||
		nextStack.backend === "self-tanstack-start";
	const isBackendSelfNext = nextStack.backend === "self-next";
	const isBackendSelfTanstackStart =
		nextStack.backend === "self-tanstack-start";

	if (isConvex) {
		const convexOverrides: Partial<StackState> = {
			runtime: "none",
			database: "none",
			orm: "none",
			api: "none",
			dbSetup: "none",
			examples: ["todo"],
		};

		const hasClerkCompatibleFrontend =
			nextStack.webFrontend.some((f) =>
				["tanstack-router", "react-router", "tanstack-start", "next"].includes(
					f,
				),
			) ||
			nextStack.nativeFrontend.some((f) =>
				["native-bare", "native-uniwind", "native-unistyles"].includes(f),
			);

		const hasBetterAuthCompatibleFrontend =
			nextStack.webFrontend.some((f) =>
				["tanstack-router", "tanstack-start", "next"].includes(f),
			) ||
			nextStack.nativeFrontend.some((f) =>
				["native-bare", "native-uniwind", "native-unistyles"].includes(f),
			);

		if (nextStack.auth === "clerk" && !hasClerkCompatibleFrontend) {
			convexOverrides.auth = "none";
		} else if (
			nextStack.auth === "better-auth" &&
			!hasBetterAuthCompatibleFrontend
		) {
			convexOverrides.auth = "none";
		}

		for (const [key, value] of Object.entries(convexOverrides)) {
			const catKey = key as keyof StackState;
			if (JSON.stringify(nextStack[catKey]) !== JSON.stringify(value)) {
				const displayName = getCategoryDisplayName(catKey);
				const valueDisplay = Array.isArray(value) ? value.join(", ") : value;
				const message = `${displayName} set to '${valueDisplay}' (Convex backend requires this configuration)`;

				notes[catKey].notes.push(
					`Convex backend selected: ${displayName} will be set to '${valueDisplay}'.`,
				);
				notes.backend.notes.push(
					`Convex requires ${displayName} to be '${valueDisplay}'.`,
				);
				notes[catKey].hasIssue = true;
				notes.backend.hasIssue = true;
				(nextStack[catKey] as string | string[] | null) = value;
				changed = true;

				changes.push({
					category: "convex",
					message,
				});
			}
		}
		const incompatibleConvexFrontends = ["solid"];
		const originalWebFrontendLength = nextStack.webFrontend.length;
		nextStack.webFrontend = nextStack.webFrontend.filter(
			(f) => !incompatibleConvexFrontends.includes(f),
		);
		if (nextStack.webFrontend.length !== originalWebFrontendLength) {
			changed = true;
			notes.webFrontend.notes.push(
				"Solid is not compatible with Convex backend and has been removed.",
			);
			notes.backend.notes.push("Convex backend is not compatible with Solid.");
			notes.webFrontend.hasIssue = true;
			notes.backend.hasIssue = true;
			changes.push({
				category: "convex",
				message: "Removed Solid frontend (not compatible with Convex backend)",
			});
		}
		if (nextStack.nativeFrontend[0] === "none") {
		} else {
		}
	} else if (isBackendNone) {
		const noneOverrides: Partial<StackState> = {
			auth: "none",
			database: "none",
			orm: "none",
			api: "none",
			runtime: "none",
			dbSetup: "none",
			examples: [],
		};

		for (const [key, value] of Object.entries(noneOverrides)) {
			const catKey = key as keyof StackState;
			if (JSON.stringify(nextStack[catKey]) !== JSON.stringify(value)) {
				const displayName = getCategoryDisplayName(catKey);
				const valueDisplay = Array.isArray(value) ? "none" : value;
				const message = `${displayName} set to '${valueDisplay}' (no backend selected)`;

				notes[catKey].notes.push(
					`No backend selected: ${displayName} will be set to '${valueDisplay}'.`,
				);
				notes.backend.notes.push(
					`No backend requires ${displayName} to be '${valueDisplay}'.`,
				);
				notes[catKey].hasIssue = true;
				(nextStack[catKey] as string | string[] | null) = value;
				changed = true;
				changes.push({
					category: "backend-none",
					message,
				});
			}
		}
	} else if (isBackendSelf) {
		const hasSupportedFrontend =
			nextStack.webFrontend.includes("next") ||
			nextStack.webFrontend.includes("tanstack-start");

		if (!hasSupportedFrontend) {
			const originalWebFrontendLength = nextStack.webFrontend.length;
			nextStack.webFrontend = ["next"];

			if (
				originalWebFrontendLength !== 1 ||
				!nextStack.webFrontend.includes("next")
			) {
				changed = true;
				notes.webFrontend.notes.push(
					"Self backend (fullstack) currently only supports Next.js and TanStack Start frontends. Other frontends have been removed.",
				);
				notes.backend.notes.push(
					"Self backend (fullstack) requires Next.js or TanStack Start frontend.",
				);
				notes.webFrontend.hasIssue = true;
				notes.backend.hasIssue = true;
				changes.push({
					category: "backend",
					message:
						"Frontend set to 'Next.js' (Self backend currently only supports Next.js and TanStack Start)",
				});
			}
		}

		if (nextStack.runtime !== "none") {
			notes.runtime.notes.push(
				"Self backend (fullstack) uses frontend's built-in API routes. Runtime will be set to 'None'.",
			);
			notes.backend.notes.push(
				"Self backend (fullstack) doesn't need a separate runtime.",
			);
			notes.runtime.hasIssue = true;
			notes.backend.hasIssue = true;
			nextStack.runtime = "none";
			changed = true;
			changes.push({
				category: "backend",
				message:
					"Runtime set to 'None' (Self backend uses frontend's built-in API routes)",
			});
		}
		if (isBackendSelfNext) {
			const hasNextFrontend = nextStack.webFrontend.includes("next");
			if (!hasNextFrontend) {
				const originalWebFrontendLength = nextStack.webFrontend.length;
				nextStack.webFrontend = ["next"];

				if (
					originalWebFrontendLength !== 1 ||
					!nextStack.webFrontend.includes("next")
				) {
					changed = true;
					notes.webFrontend.notes.push(
						"Next.js fullstack backend requires Next.js frontend. Frontend has been set to Next.js.",
					);
					notes.backend.notes.push(
						"Next.js fullstack backend requires Next.js frontend.",
					);
					notes.webFrontend.hasIssue = true;
					notes.backend.hasIssue = true;
					changes.push({
						category: "backend",
						message:
							"Frontend set to 'Next.js' (Next.js fullstack backend requires Next.js frontend)",
					});
				}
			}
		}

		if (isBackendSelfTanstackStart) {
			const hasTanstackStartFrontend =
				nextStack.webFrontend.includes("tanstack-start");
			if (!hasTanstackStartFrontend) {
				const originalWebFrontendLength = nextStack.webFrontend.length;
				nextStack.webFrontend = ["tanstack-start"];

				if (
					originalWebFrontendLength !== 1 ||
					!nextStack.webFrontend.includes("tanstack-start")
				) {
					changed = true;
					notes.webFrontend.notes.push(
						"TanStack Start fullstack backend requires TanStack Start frontend. Frontend has been set to TanStack Start.",
					);
					notes.backend.notes.push(
						"TanStack Start fullstack backend requires TanStack Start frontend.",
					);
					notes.webFrontend.hasIssue = true;
					notes.backend.hasIssue = true;
					changes.push({
						category: "backend",
						message:
							"Frontend set to 'TanStack Start' (TanStack Start fullstack backend requires TanStack Start frontend)",
					});
				}
			}
		}
	} else {
		if (nextStack.runtime === "none") {
			notes.runtime.notes.push(
				"Runtime 'None' is only for Convex. Defaulting to 'Bun'.",
			);
			notes.runtime.hasIssue = true;
			nextStack.runtime = DEFAULT_STACK.runtime;
			changed = true;
			changes.push({
				category: "runtime",
				message:
					"Runtime set to 'Bun' (runtime 'None' is only available with Convex backend)",
			});
		}
		if (nextStack.api === "none" && (isConvex || isBackendNone)) {
		} else if (nextStack.api === "none" && !(isConvex || isBackendNone)) {
			if (nextStack.examples.length > 0) {
				notes.api.notes.push("API 'None' selected: Examples will be removed.");
				notes.examples.notes.push(
					"Examples require an API. They will be removed when API is 'None'.",
				);
				notes.api.hasIssue = true;
				notes.examples.hasIssue = true;
				nextStack.examples = [];
				changed = true;
				changes.push({
					category: "api",
					message:
						"Examples removed (examples require an API layer but 'None' was selected)",
				});
			}
		}

		if (nextStack.database === "none") {
			if (nextStack.orm !== "none") {
				notes.database.notes.push(
					"Database 'None' selected: ORM will be set to 'None'.",
				);
				notes.orm.notes.push(
					"ORM requires a database. It will be set to 'None'.",
				);
				notes.database.hasIssue = true;
				notes.orm.hasIssue = true;
				nextStack.orm = "none";
				changed = true;
				changes.push({
					category: "database",
					message:
						"ORM set to 'None' (ORM requires a database but 'None' was selected)",
				});
			}
			if (nextStack.dbSetup !== "none") {
				notes.database.notes.push(
					"Database 'None' selected: DB Setup will be set to 'Basic'.",
				);
				notes.dbSetup.notes.push(
					"DB Setup requires a database. It will be set to 'Basic Setup'.",
				);
				notes.database.hasIssue = true;
				notes.dbSetup.hasIssue = true;
				nextStack.dbSetup = "none";
				changed = true;
				changes.push({
					category: "database",
					message:
						"DB Setup set to 'None' (database setup requires a database but 'None' was selected)",
				});
			}
		} else if (nextStack.database === "mongodb") {
			if (
				nextStack.orm === "none" ||
				(nextStack.orm !== "prisma" && nextStack.orm !== "mongoose")
			) {
				const message =
					nextStack.orm === "none"
						? "MongoDB requires an ORM. Prisma will be selected."
						: "MongoDB requires Prisma or Mongoose ORM. Prisma will be selected.";
				notes.database.notes.push(message);
				notes.orm.notes.push(message);
				notes.database.hasIssue = true;
				notes.orm.hasIssue = true;
				nextStack.orm = "prisma";
				changed = true;
				changes.push({
					category: "database",
					message: `ORM set to 'Prisma' (${message})`,
				});
			}
			if (
				nextStack.dbSetup !== "mongodb-atlas" &&
				nextStack.dbSetup !== "none"
			) {
				notes.database.notes.push(
					"MongoDB requires MongoDB Atlas setup. MongoDB Atlas will be selected.",
				);
				notes.dbSetup.notes.push(
					"MongoDB database requires MongoDB Atlas setup. MongoDB Atlas will be selected.",
				);
				notes.database.hasIssue = true;
				notes.dbSetup.hasIssue = true;
				nextStack.dbSetup = "mongodb-atlas";
				changed = true;
				changes.push({
					category: "database",
					message:
						"DB Setup set to 'MongoDB Atlas' (MongoDB database only works with MongoDB Atlas setup)",
				});
			}
		} else {
			if (nextStack.orm === "none") {
				notes.database.notes.push(
					"Database requires an ORM. Drizzle will be selected.",
				);
				notes.orm.notes.push(
					"Database requires an ORM. Drizzle will be selected.",
				);
				notes.database.hasIssue = true;
				notes.orm.hasIssue = true;
				nextStack.orm = "drizzle";
				changed = true;
				changes.push({
					category: "database",
					message: "ORM set to 'Drizzle' (database requires an ORM)",
				});
			}
			if (nextStack.orm === "mongoose") {
				notes.database.notes.push(
					"Relational databases are not compatible with Mongoose ORM. Defaulting to Drizzle.",
				);
				notes.orm.notes.push(
					"Mongoose ORM only works with MongoDB. Defaulting to Drizzle.",
				);
				notes.database.hasIssue = true;
				notes.orm.hasIssue = true;
				nextStack.orm = "drizzle";
				changed = true;
				changes.push({
					category: "database",
					message:
						"ORM set to 'Drizzle' (Mongoose ORM only works with MongoDB database)",
				});
			}
			if (nextStack.dbSetup === "turso") {
				if (nextStack.database !== "sqlite") {
					notes.dbSetup.notes.push(
						"Turso requires SQLite. It will be selected.",
					);
					notes.database.notes.push(
						"Turso DB setup requires SQLite. It will be selected.",
					);
					notes.dbSetup.hasIssue = true;
					notes.database.hasIssue = true;
					nextStack.database = "sqlite";
					changed = true;
					changes.push({
						category: "dbSetup",
						message:
							"Database set to 'SQLite' (Turso hosting requires SQLite database)",
					});
				}
				if (nextStack.orm !== "drizzle" && nextStack.orm !== "prisma") {
					notes.dbSetup.notes.push(
						"Turso requires Drizzle or Prisma ORM. Drizzle will be selected.",
					);
					notes.orm.notes.push(
						"Turso DB setup requires Drizzle or Prisma ORM. Drizzle will be selected.",
					);
					notes.dbSetup.hasIssue = true;
					notes.orm.hasIssue = true;
					nextStack.orm = "drizzle";
					changed = true;
					changes.push({
						category: "dbSetup",
						message:
							"ORM set to 'Drizzle' (Turso hosting requires Drizzle or Prisma ORM)",
					});
				}
			} else if (nextStack.dbSetup === "prisma-postgres") {
				if (nextStack.database !== "postgres") {
					notes.dbSetup.notes.push("Requires PostgreSQL. It will be selected.");
					notes.database.notes.push(
						"Prisma PostgreSQL setup requires PostgreSQL. It will be selected.",
					);
					notes.dbSetup.hasIssue = true;
					notes.database.hasIssue = true;
					nextStack.database = "postgres";
					changed = true;
					changes.push({
						category: "dbSetup",
						message:
							"Database set to 'PostgreSQL' (required by Prisma PostgreSQL setup)",
					});
				}
			} else if (nextStack.dbSetup === "mongodb-atlas") {
				if (nextStack.database !== "mongodb") {
					notes.dbSetup.notes.push("Requires MongoDB. It will be selected.");
					notes.database.notes.push(
						"MongoDB Atlas setup requires MongoDB. It will be selected.",
					);
					notes.dbSetup.hasIssue = true;
					notes.database.hasIssue = true;
					nextStack.database = "mongodb";
					changed = true;
					changes.push({
						category: "dbSetup",
						message:
							"Database set to 'MongoDB' (required by MongoDB Atlas setup)",
					});
				}
				if (nextStack.orm !== "prisma" && nextStack.orm !== "mongoose") {
					notes.dbSetup.notes.push(
						"Requires Prisma or Mongoose ORM. Prisma will be selected.",
					);
					notes.orm.notes.push(
						"MongoDB Atlas setup requires Prisma or Mongoose ORM. Prisma will be selected.",
					);
					notes.dbSetup.hasIssue = true;
					notes.orm.hasIssue = true;
					nextStack.orm = "prisma";
					changed = true;
					changes.push({
						category: "dbSetup",
						message:
							"ORM set to 'Prisma' (MongoDB Atlas with current setup requires Prisma ORM)",
					});
				}
			} else if (nextStack.dbSetup === "neon") {
				if (nextStack.database !== "postgres") {
					notes.dbSetup.notes.push(
						"Neon requires PostgreSQL. It will be selected.",
					);
					notes.database.notes.push(
						"Neon DB setup requires PostgreSQL. It will be selected.",
					);
					notes.dbSetup.hasIssue = true;
					notes.database.hasIssue = true;
					nextStack.database = "postgres";
					changed = true;
					changes.push({
						category: "dbSetup",
						message:
							"Database set to 'PostgreSQL' (Neon hosting requires PostgreSQL database)",
					});
				}
			} else if (nextStack.dbSetup === "supabase") {
				if (nextStack.database !== "postgres") {
					notes.dbSetup.notes.push(
						"Supabase (local) requires PostgreSQL. It will be selected.",
					);
					notes.database.notes.push(
						"Supabase (local) DB setup requires PostgreSQL. It will be selected.",
					);
					notes.dbSetup.hasIssue = true;
					notes.database.hasIssue = true;
					nextStack.database = "postgres";
					changed = true;
					changes.push({
						category: "dbSetup",
						message:
							"Database set to 'PostgreSQL' (Supabase hosting requires PostgreSQL database)",
					});
				}
			} else if (nextStack.dbSetup === "planetscale") {
				if (
					nextStack.database !== "postgres" &&
					nextStack.database !== "mysql"
				) {
					notes.dbSetup.notes.push(
						"PlanetScale requires PostgreSQL or MySQL. PostgreSQL will be selected.",
					);
					notes.database.notes.push(
						"PlanetScale DB setup requires PostgreSQL or MySQL. PostgreSQL will be selected.",
					);
					notes.dbSetup.hasIssue = true;
					notes.database.hasIssue = true;
					nextStack.database = "postgres";
					changed = true;
					changes.push({
						category: "dbSetup",
						message:
							"Database set to 'PostgreSQL' (PlanetScale supports PostgreSQL and MySQL)",
					});
				}
			} else if (nextStack.dbSetup === "d1") {
				if (nextStack.database !== "sqlite") {
					notes.dbSetup.notes.push(
						"Cloudflare D1 requires SQLite. It will be selected.",
					);
					notes.database.notes.push(
						"Cloudflare D1 DB setup requires SQLite. It will be selected.",
					);
					notes.dbSetup.hasIssue = true;
					notes.database.hasIssue = true;
					nextStack.database = "sqlite";
					changed = true;
					changes.push({
						category: "dbSetup",
						message: "Database set to 'SQLite' (required by Cloudflare D1)",
					});
				}
				if (nextStack.orm !== "drizzle" && nextStack.orm !== "prisma") {
					notes.dbSetup.notes.push(
						"Cloudflare D1 requires Drizzle or Prisma ORM. Drizzle will be selected.",
					);
					notes.orm.notes.push(
						"Cloudflare D1 DB setup requires Drizzle or Prisma ORM. Drizzle will be selected.",
					);
					notes.dbSetup.hasIssue = true;
					notes.orm.hasIssue = true;
					nextStack.orm = "drizzle";
					changed = true;
					changes.push({
						category: "dbSetup",
						message:
							"ORM set to 'Drizzle' (Cloudflare D1 requires Drizzle or Prisma ORM)",
					});
				}
				if (nextStack.runtime !== "workers") {
					notes.dbSetup.notes.push(
						"Cloudflare D1 requires Cloudflare Workers runtime. It will be selected.",
					);
					notes.runtime.notes.push(
						"Cloudflare D1 DB setup requires Cloudflare Workers runtime. It will be selected.",
					);
					notes.dbSetup.hasIssue = true;
					notes.runtime.hasIssue = true;
					nextStack.runtime = "workers";
					changed = true;
					changes.push({
						category: "dbSetup",
						message: "Runtime set to 'Cloudflare Workers' (required by D1)",
					});
				}
				if (nextStack.backend !== "hono") {
					notes.dbSetup.notes.push(
						"Cloudflare D1 requires Hono backend. It will be selected.",
					);
					notes.backend.notes.push(
						"Cloudflare D1 DB setup requires Hono backend. It will be selected.",
					);
					notes.dbSetup.hasIssue = true;
					notes.backend.hasIssue = true;
					nextStack.backend = "hono";
					changed = true;
					changes.push({
						category: "dbSetup",
						message: "Backend set to 'Hono' (required by Cloudflare D1)",
					});
				}
			} else if (nextStack.dbSetup === "docker") {
				if (nextStack.database === "none") {
					notes.dbSetup.notes.push(
						"Docker setup requires a database. PostgreSQL will be selected.",
					);
					notes.database.notes.push(
						"Docker setup requires a database. PostgreSQL will be selected.",
					);
					notes.dbSetup.hasIssue = true;
					notes.database.hasIssue = true;
					nextStack.database = "postgres";
					changed = true;
					changes.push({
						category: "dbSetup",
						message:
							"Database set to 'PostgreSQL' (Docker setup requires a database)",
					});
				}
				if (nextStack.database === "sqlite") {
					notes.dbSetup.notes.push(
						"Docker setup is not needed for SQLite. It will be set to 'Basic Setup'.",
					);
					notes.dbSetup.hasIssue = true;
					notes.database.hasIssue = true;
					nextStack.dbSetup = "none";
					changed = true;
					changes.push({
						category: "dbSetup",
						message:
							"DB Setup set to 'Basic Setup' (SQLite doesn't need Docker)",
					});
				}

				if (nextStack.runtime === "workers") {
					notes.dbSetup.notes.push(
						"Docker setup is not compatible with Cloudflare Workers runtime. Bun runtime will be selected.",
					);
					notes.runtime.notes.push(
						"Cloudflare Workers runtime does not support Docker setup. Bun runtime will be selected.",
					);
					notes.dbSetup.hasIssue = true;
					notes.runtime.hasIssue = true;
					nextStack.runtime = "bun";
					changed = true;
					changes.push({
						category: "dbSetup",
						message:
							"Runtime set to 'Bun' (Workers not compatible with Docker)",
					});
				}
			}

			if (nextStack.dbSetup !== "none" && nextStack.database === "none") {
				let selectedDatabase = "postgres";
				let databaseName = "PostgreSQL";

				if (nextStack.dbSetup === "turso" || nextStack.dbSetup === "d1") {
					selectedDatabase = "sqlite";
					databaseName = "SQLite";
				} else if (nextStack.dbSetup === "mongodb-atlas") {
					selectedDatabase = "mongodb";
					databaseName = "MongoDB";
				} else if (nextStack.dbSetup === "planetscale") {
					selectedDatabase = "postgres";
					databaseName = "PostgreSQL";
				}

				notes.dbSetup.notes.push(
					`${nextStack.dbSetup} setup requires a database. ${databaseName} will be selected.`,
				);
				notes.database.notes.push(
					`${nextStack.dbSetup} setup requires a database. ${databaseName} will be selected.`,
				);
				notes.dbSetup.hasIssue = true;
				notes.database.hasIssue = true;
				nextStack.database = selectedDatabase;
				changed = true;
				changes.push({
					category: "dbSetup",
					message: `Database set to '${databaseName}' (${nextStack.dbSetup} setup requires a database)`,
				});
			}

			if (nextStack.runtime === "workers") {
				if (nextStack.backend !== "hono") {
					notes.runtime.notes.push(
						"Cloudflare Workers runtime requires Hono backend. Hono will be selected.",
					);
					notes.backend.notes.push(
						"Cloudflare Workers runtime requires Hono backend. It will be selected.",
					);
					notes.runtime.hasIssue = true;
					notes.backend.hasIssue = true;
					nextStack.backend = "hono";
					changed = true;
					changes.push({
						category: "runtime",
						message:
							"Backend set to 'Hono' (Cloudflare Workers runtime only works with Hono backend)",
					});
				}

				if (nextStack.database === "mongodb") {
					notes.runtime.notes.push(
						"Cloudflare Workers runtime is not compatible with MongoDB. SQLite will be selected.",
					);
					notes.database.notes.push(
						"MongoDB is not compatible with Cloudflare Workers runtime. SQLite will be selected.",
					);
					notes.runtime.hasIssue = true;
					notes.database.hasIssue = true;
					nextStack.database = "sqlite";
					changed = true;
					changes.push({
						category: "runtime",
						message:
							"Database set to 'SQLite' (MongoDB not compatible with Cloudflare Workers runtime)",
					});
				}

				if (nextStack.dbSetup === "docker") {
					notes.runtime.notes.push(
						"Cloudflare Workers runtime does not support Docker setup. D1 will be selected.",
					);
					notes.dbSetup.notes.push(
						"Docker setup is not compatible with Cloudflare Workers runtime. D1 will be selected.",
					);
					notes.runtime.hasIssue = true;
					notes.dbSetup.hasIssue = true;
					nextStack.dbSetup = "d1";
					changed = true;
					changes.push({
						category: "runtime",
						message:
							"DB Setup set to 'D1' (Docker setup not compatible with Cloudflare Workers runtime)",
					});
				}
			} else {
				if (nextStack.serverDeploy === "wrangler") {
					notes.runtime.notes.push(
						"Wrangler deployment requires Cloudflare Workers runtime. Server deployment disabled.",
					);
					notes.serverDeploy.notes.push(
						"Selected runtime is not compatible with Wrangler deployment. Server deployment disabled.",
					);
					notes.runtime.hasIssue = true;
					notes.serverDeploy.hasIssue = true;
					nextStack.serverDeploy = "none";
					changed = true;
					changes.push({
						category: "runtime",
						message:
							"Server deployment set to 'None' (Wrangler requires Cloudflare Workers runtime)",
					});
				}
			}

			if (
				nextStack.backend !== "hono" &&
				nextStack.serverDeploy === "wrangler"
			) {
				notes.backend.notes.push(
					"Wrangler deployment requires Hono backend (via Workers runtime). Server deployment disabled.",
				);
				notes.serverDeploy.notes.push(
					"Selected backend is not compatible with Wrangler deployment. Server deployment disabled.",
				);
				notes.backend.hasIssue = true;
				notes.serverDeploy.hasIssue = true;
				nextStack.serverDeploy = "none";
				changed = true;
				changes.push({
					category: "backend",
					message:
						"Server deployment set to 'None' (Wrangler requires Hono backend via Workers runtime)",
				});
			}

			const isNuxt = nextStack.webFrontend.includes("nuxt");
			const isSvelte = nextStack.webFrontend.includes("svelte");
			const isSolid = nextStack.webFrontend.includes("solid");
			if ((isNuxt || isSvelte || isSolid) && nextStack.api === "trpc") {
				const frontendName = isNuxt ? "Nuxt" : isSvelte ? "Svelte" : "Solid";
				notes.api.notes.push(
					`${frontendName} requires oRPC. It will be selected automatically.`,
				);
				notes.webFrontend.notes.push(
					`Selected ${frontendName}: API will be set to oRPC.`,
				);
				notes.api.hasIssue = true;
				notes.webFrontend.hasIssue = true;
				nextStack.api = "orpc";
				changed = true;
				changes.push({
					category: "api",
					message: `API set to 'oRPC' (required by ${frontendName})`,
				});
			}

			if (nextStack.auth === "clerk") {
				if (nextStack.backend !== "convex") {
					notes.auth.notes.push(
						"Clerk auth is only available with Convex backend. Auth will be set to 'None'.",
					);
					notes.backend.notes.push(
						"Clerk auth requires Convex backend. Auth will be disabled.",
					);
					notes.auth.hasIssue = true;
					notes.backend.hasIssue = true;
					nextStack.auth = "none";
					changed = true;
					changes.push({
						category: "auth",
						message:
							"Auth set to 'None' (Clerk authentication only works with Convex backend)",
					});
				} else {
					const hasClerkCompatibleFrontend =
						nextStack.webFrontend.some((f) =>
							[
								"tanstack-router",
								"react-router",
								"tanstack-start",
								"next",
							].includes(f),
						) ||
						nextStack.nativeFrontend.some((f) =>
							["native-bare", "native-uniwind", "native-unistyles"].includes(f),
						);

					if (!hasClerkCompatibleFrontend) {
						notes.auth.notes.push(
							"Clerk auth is not compatible with the selected frontends. Auth will be set to 'None'.",
						);
						notes.webFrontend.notes.push(
							"Selected frontends are not compatible with Clerk auth. Auth will be disabled.",
						);
						notes.auth.hasIssue = true;
						notes.webFrontend.hasIssue = true;
						nextStack.auth = "none";
						changed = true;
						changes.push({
							category: "auth",
							message:
								"Auth set to 'None' (Clerk not compatible with Svelte, Nuxt, or Solid frontends)",
						});
					}
				}
			}

			if (nextStack.backend === "convex" && nextStack.auth === "better-auth") {
				const hasBetterAuthCompatibleFrontend =
					nextStack.webFrontend.some((f) =>
						["tanstack-router", "tanstack-start", "next"].includes(f),
					) ||
					nextStack.nativeFrontend.some((f) =>
						["native-bare", "native-uniwind", "native-unistyles"].includes(f),
					);

				if (!hasBetterAuthCompatibleFrontend) {
					notes.auth.notes.push(
						"Better-Auth with Convex requires TanStack Router, TanStack Start, Next.js, or React Native (Bare/UniWind/Unistyles). Auth will be set to 'None'.",
					);
					notes.backend.notes.push(
						"Convex backend with Better-Auth requires compatible frontend. Auth will be disabled.",
					);
					notes.auth.hasIssue = true;
					notes.backend.hasIssue = true;
					nextStack.auth = "none";
					changed = true;
					changes.push({
						category: "auth",
						message:
							"Auth set to 'None' (Better-Auth with Convex requires TanStack Router, TanStack Start, or Next.js frontend)",
					});
				}
			}

			if (nextStack.payments === "polar") {
				if (nextStack.auth !== "better-auth") {
					notes.payments.notes.push(
						"Polar payments requires Better Auth. Payments will be set to 'None'.",
					);
					notes.auth.notes.push(
						"Polar payments requires Better Auth. Payments will be disabled.",
					);
					notes.payments.hasIssue = true;
					notes.auth.hasIssue = true;
					nextStack.payments = "none";
					changed = true;
					changes.push({
						category: "payments",
						message: "Payments set to 'None' (Polar requires Better Auth)",
					});
				}

				if (nextStack.backend === "convex") {
					notes.payments.notes.push(
						"Polar payments is not compatible with Convex backend. Payments will be set to 'None'.",
					);
					notes.backend.notes.push(
						"Polar payments is not compatible with Convex backend. Payments will be disabled.",
					);
					notes.payments.hasIssue = true;
					notes.backend.hasIssue = true;
					nextStack.payments = "none";
					changed = true;
					changes.push({
						category: "payments",
						message:
							"Payments set to 'None' (Polar not compatible with Convex backend)",
					});
				}

				const hasWebFrontend = nextStack.webFrontend.some((f) => f !== "none");
				if (
					!hasWebFrontend &&
					nextStack.nativeFrontend.some((f) => f !== "none")
				) {
					notes.payments.notes.push(
						"Polar payments requires a web frontend. Payments will be set to 'None'.",
					);
					notes.webFrontend.notes.push(
						"Polar payments requires a web frontend. Payments will be disabled.",
					);
					notes.payments.hasIssue = true;
					notes.webFrontend.hasIssue = true;
					nextStack.payments = "none";
					changed = true;
					changes.push({
						category: "payments",
						message: "Payments set to 'None' (Polar requires web frontend)",
					});
				}
			}

			const incompatibleAddons: string[] = [];
			const isPWACompat = hasPWACompatibleFrontend(nextStack.webFrontend);
			const isTauriCompat = hasTauriCompatibleFrontend(nextStack.webFrontend);

			if (!isPWACompat && nextStack.addons.includes("pwa")) {
				incompatibleAddons.push("pwa");
				notes.webFrontend.notes.push(
					"PWA addon requires TanStack Router, React Router, Solid, or Next.js. Addon will be removed.",
				);
				notes.addons.notes.push(
					"PWA requires TanStack Router, React Router, Solid, or Next.js. It will be removed.",
				);
				notes.webFrontend.hasIssue = true;
				notes.addons.hasIssue = true;
				changes.push({
					category: "addons",
					message:
						"PWA addon removed (only works with TanStack Router, React Router, Solid, or Next.js)",
				});
			}
			if (!isTauriCompat && nextStack.addons.includes("tauri")) {
				incompatibleAddons.push("tauri");
				notes.webFrontend.notes.push(
					"Tauri addon requires TanStack Router, React Router, Nuxt, Svelte, Solid, or Next.js. Addon will be removed.",
				);
				notes.addons.notes.push(
					"Tauri requires TanStack Router, React Router, Nuxt, Svelte, Solid, or Next.js. It will be removed.",
				);
				notes.webFrontend.hasIssue = true;
				notes.addons.hasIssue = true;
				changes.push({
					category: "addons",
					message:
						"Tauri addon removed (only works with TanStack Router, React Router, Nuxt, Svelte, Solid, or Next.js)",
				});
			}

			const originalAddonsLength = nextStack.addons.length;
			if (incompatibleAddons.length > 0) {
				nextStack.addons = nextStack.addons.filter(
					(addon) => !incompatibleAddons.includes(addon),
				);
				if (nextStack.addons.length !== originalAddonsLength) changed = true;
			}

			const incompatibleExamples: string[] = [];

			if (
				nextStack.database === "none" &&
				nextStack.examples.includes("todo")
			) {
				incompatibleExamples.push("todo");
				changes.push({
					category: "examples",
					message:
						"Todo example removed (requires a database but 'None' was selected)",
				});
			}
			if (isSolid && nextStack.examples.includes("ai")) {
				incompatibleExamples.push("ai");
				changes.push({
					category: "examples",
					message: "AI example removed (not compatible with Solid frontend)",
				});
			}

			const uniqueIncompatibleExamples = [...new Set(incompatibleExamples)];
			if (uniqueIncompatibleExamples.length > 0) {
				if (
					nextStack.database === "none" &&
					uniqueIncompatibleExamples.includes("todo")
				) {
					notes.database.notes.push(
						"Todo example requires a database. It will be removed.",
					);
					notes.examples.notes.push(
						"Todo example requires a database. It will be removed.",
					);
					notes.database.hasIssue = true;
					notes.examples.hasIssue = true;
				}
				if (isSolid && uniqueIncompatibleExamples.includes("ai")) {
					notes.webFrontend.notes.push(
						"AI example is not compatible with Solid. It will be removed.",
					);
					notes.examples.notes.push(
						"AI example is not compatible with Solid. It will be removed.",
					);
					notes.webFrontend.hasIssue = true;
					notes.examples.hasIssue = true;
				}

				const originalExamplesLength = nextStack.examples.length;
				nextStack.examples = nextStack.examples.filter(
					(ex) => !uniqueIncompatibleExamples.includes(ex),
				);
				if (nextStack.examples.length !== originalExamplesLength)
					changed = true;
			}
		}
	}

	if (nextStack.runtime === "workers" && nextStack.serverDeploy === "none") {
		notes.runtime.notes.push(
			"Cloudflare Workers runtime requires a server deployment. Wrangler will be selected.",
		);
		notes.serverDeploy.notes.push(
			"Cloudflare Workers runtime requires a server deployment. Wrangler will be selected.",
		);
		notes.runtime.hasIssue = true;
		notes.serverDeploy.hasIssue = true;
		nextStack.serverDeploy = "wrangler";
		changed = true;
		changes.push({
			category: "serverDeploy",
			message:
				"Server deployment set to 'Wrangler' (Cloudflare Workers runtime requires a server deployment)",
		});
	}

	const webFrontendsSelected = nextStack.webFrontend.some((f) => f !== "none");
	if (!webFrontendsSelected && nextStack.webDeploy !== "none") {
		notes.webDeploy.notes.push(
			"Web deployment requires a web frontend. It will be disabled.",
		);
		notes.webFrontend.notes.push(
			"No web frontend selected: Deployment has been disabled.",
		);
		notes.webDeploy.hasIssue = true;
		notes.webFrontend.hasIssue = true;
		nextStack.webDeploy = "none";
		changed = true;
		changes.push({
			category: "webDeploy",
			message:
				"Web deployment set to 'None' (requires a web frontend but only native frontend selected)",
		});
	}

	if (
		nextStack.serverDeploy !== "none" &&
		(nextStack.backend === "none" ||
			nextStack.backend === "convex" ||
			nextStack.backend === "self-next" ||
			nextStack.backend === "self-tanstack-start")
	) {
		const backendType =
			nextStack.backend === "self-next" ||
			nextStack.backend === "self-tanstack-start"
				? "Self backend (fullstack)"
				: nextStack.backend === "convex"
					? "Convex backend"
					: "No backend";

		notes.serverDeploy.notes.push(
			`Server deployment is not needed with ${backendType.toLowerCase()}. It will be disabled.`,
		);
		notes.backend.notes.push(
			`${backendType} doesn't need server deployment. Server deployment has been disabled.`,
		);
		notes.serverDeploy.hasIssue = true;
		notes.backend.hasIssue = true;
		nextStack.serverDeploy = "none";
		changed = true;
		changes.push({
			category: "serverDeploy",
			message: `Server deployment set to 'None' (${backendType.toLowerCase()} doesn't need server deployment)`,
		});
	}

	if (
		nextStack.serverDeploy === "wrangler" &&
		(nextStack.runtime !== "workers" || nextStack.backend !== "hono")
	) {
		notes.serverDeploy.notes.push(
			"Wrangler deployment requires Cloudflare Workers runtime and Hono backend. Server deployment disabled.",
		);
		notes.serverDeploy.notes.push(
			"To use Wrangler: Set Runtime to 'Cloudflare Workers' and Backend to 'Hono', then re-enable Wrangler deployment.",
		);
		if (nextStack.runtime !== "workers") {
			notes.runtime.notes.push(
				"Selected runtime is not compatible with Wrangler deployment. Switch to 'Cloudflare Workers' to use Wrangler.",
			);
		}
		if (nextStack.backend !== "hono") {
			notes.backend.notes.push(
				"Selected backend is not compatible with Wrangler deployment. Switch to 'Hono' to use Wrangler.",
			);
		}
		notes.serverDeploy.hasIssue = true;
		notes.runtime.hasIssue = true;
		notes.backend.hasIssue = true;
		nextStack.serverDeploy = "none";
		changed = true;
		changes.push({
			category: "serverDeploy",
			message:
				"Server deployment disabled (Tip: Use Cloudflare Workers runtime + Hono backend to enable Wrangler)",
		});
	}

	if (
		nextStack.serverDeploy === "alchemy" &&
		(nextStack.runtime !== "workers" || nextStack.backend !== "hono")
	) {
		notes.serverDeploy.notes.push(
			"Alchemy deployment requires Cloudflare Workers runtime and Hono backend. Server deployment disabled.",
		);
		notes.serverDeploy.notes.push(
			"To use Alchemy: Set Runtime to 'Cloudflare Workers' and Backend to 'Hono', then re-enable Alchemy deployment.",
		);
		if (nextStack.runtime !== "workers") {
			notes.runtime.notes.push(
				"Selected runtime is not compatible with Alchemy deployment. Switch to 'Cloudflare Workers' to use Alchemy.",
			);
		}
		if (nextStack.backend !== "hono") {
			notes.backend.notes.push(
				"Selected backend is not compatible with Alchemy deployment. Switch to 'Hono' to use Alchemy.",
			);
		}
		notes.serverDeploy.hasIssue = true;
		notes.runtime.hasIssue = true;
		notes.backend.hasIssue = true;
		nextStack.serverDeploy = "none";
		changed = true;
		changes.push({
			category: "serverDeploy",
			message:
				"Server deployment disabled (Tip: Use Cloudflare Workers runtime + Hono backend to enable Alchemy)",
		});
	}

	return {
		adjustedStack: changed ? nextStack : null,
		notes,
		changes,
	};
};

export const getDisabledReason = (
	currentStack: StackState,
	category: keyof typeof TECH_OPTIONS,
	optionId: string,
): string | null => {
	if (currentStack.backend === "convex") {
		if (category === "runtime" && optionId !== "none") {
			return "Convex backend requires runtime to be 'None'. Convex handles its own runtime.";
		}
		if (category === "database" && optionId !== "none") {
			return "Convex backend requires database to be 'None'. Convex provides its own database.";
		}
		if (category === "orm" && optionId !== "none") {
			return "Convex backend requires ORM to be 'None'. Convex has built-in data access.";
		}
		if (category === "api" && optionId !== "none") {
			return "Convex backend requires API to be 'None'. Convex provides its own API layer.";
		}
		if (category === "dbSetup" && optionId !== "none") {
			return "Convex backend requires DB Setup to be 'None'. Convex handles database setup automatically.";
		}
		if (category === "auth" && optionId === "better-auth") {
			const hasBetterAuthCompatibleFrontend =
				currentStack.webFrontend.some((f) =>
					["tanstack-router", "tanstack-start", "next"].includes(f),
				) ||
				currentStack.nativeFrontend.some((f) =>
					["native-bare", "native-uniwind", "native-unistyles"].includes(f),
				);

			if (!hasBetterAuthCompatibleFrontend) {
				return "Better-Auth with Convex requires TanStack Router, TanStack Start, Next.js, or React Native (Bare/UniWind/Unistyles).";
			}
		}
	}

	if (currentStack.backend === "none") {
		if (category === "runtime" && optionId !== "none") {
			return "No backend selected: Runtime must be 'None' for frontend-only projects.";
		}
		if (category === "database" && optionId !== "none") {
			return "No backend selected: Database must be 'None' for frontend-only projects.";
		}
		if (category === "orm" && optionId !== "none") {
			return "No backend selected: ORM must be 'None' for frontend-only projects.";
		}
		if (category === "api" && optionId !== "none") {
			return "No backend selected: API must be 'None' for frontend-only projects.";
		}
		if (category === "auth" && optionId !== "none") {
			return "No backend selected: Authentication must be 'None' for frontend-only projects.";
		}
		if (category === "dbSetup" && optionId !== "none") {
			return "No backend selected: DB Setup must be 'None' for frontend-only projects.";
		}
		if (category === "serverDeploy" && optionId !== "none") {
			return "No backend selected: Server deployment must be 'None' for frontend-only projects.";
		}
	}

	const simulatedStack: StackState = JSON.parse(JSON.stringify(currentStack));

	const updateArrayCategory = (arr: string[], cat: string): string[] => {
		const isAlreadySelected = arr.includes(optionId);

		if (cat === "webFrontend" || cat === "nativeFrontend") {
			if (isAlreadySelected) {
				return optionId === "none" ? arr : ["none"];
			}
			if (optionId === "none") return ["none"];
			return [optionId];
		}

		const next: string[] = isAlreadySelected
			? arr.filter((id) => id !== optionId)
			: [...arr.filter((id) => id !== "none"), optionId];

		if (next.length === 0) return ["none"];
		return [...new Set(next)];
	};

	if (
		category === "webFrontend" ||
		category === "nativeFrontend" ||
		category === "addons" ||
		category === "examples"
	) {
		const currentArr = Array.isArray(simulatedStack[category])
			? [...(simulatedStack[category] as string[])]
			: [];
		(simulatedStack[category] as string[]) = updateArrayCategory(
			currentArr,
			category,
		);
	} else {
		(simulatedStack[category] as string) = optionId;
	}

	const { adjustedStack } = analyzeStackCompatibility(simulatedStack);
	const finalStack = adjustedStack ?? simulatedStack;

	if (category === "webFrontend" && optionId === "solid") {
		if (finalStack.backend === "convex") {
			return "Solid is not compatible with Convex backend. Try TanStack Router, React Router, or Next.js instead.";
		}
	}

	if (category === "auth" && optionId === "clerk") {
		if (finalStack.backend !== "convex") {
			return "Clerk authentication only works with Convex backend. Switch to Convex backend to use Clerk.";
		}

		const hasClerkCompatibleFrontend =
			finalStack.webFrontend.some((f) =>
				["tanstack-router", "react-router", "tanstack-start", "next"].includes(
					f,
				),
			) ||
			finalStack.nativeFrontend.some((f) =>
				["native-bare", "native-uniwind", "native-unistyles"].includes(f),
			);

		if (!hasClerkCompatibleFrontend) {
			return "Clerk requires TanStack Router, React Router, TanStack Start, Next.js, or React Native (Bare/UniWind/Unistyles) frontend.";
		}
	}

	if (category === "auth" && optionId === "better-auth") {
		if (finalStack.backend === "convex") {
			const hasBetterAuthCompatibleFrontend =
				finalStack.webFrontend.some((f) =>
					["tanstack-router", "tanstack-start", "next"].includes(f),
				) ||
				finalStack.nativeFrontend.some((f) =>
					["native-bare", "native-uniwind", "native-unistyles"].includes(f),
				);

			if (!hasBetterAuthCompatibleFrontend) {
				return "Better-Auth with Convex requires TanStack Router, TanStack Start, Next.js, or React Native (Bare/UniWind/Unistyles).";
			}
		}
	}

	if (
		category === "backend" &&
		finalStack.runtime === "workers" &&
		optionId !== "hono"
	) {
		return "Cloudflare Workers runtime only supports Hono backend. Switch to Hono to use Workers runtime.";
	}

	if (category === "backend" && optionId === "self-next") {
		const hasNextFrontend = finalStack.webFrontend.includes("next");
		if (!hasNextFrontend) {
			return "Next.js fullstack backend requires Next.js frontend. Select Next.js frontend first.";
		}
	}

	if (category === "backend" && optionId === "self-tanstack-start") {
		const hasTanstackStartFrontend =
			finalStack.webFrontend.includes("tanstack-start");
		if (!hasTanstackStartFrontend) {
			return "TanStack Start fullstack backend requires TanStack Start frontend. Select TanStack Start frontend first.";
		}
	}

	if (
		category === "webFrontend" &&
		optionId !== "next" &&
		finalStack.backend === "self-next"
	) {
		return "Next.js fullstack backend only supports Next.js frontend. Select Next.js frontend first.";
	}

	if (
		category === "webFrontend" &&
		optionId !== "tanstack-start" &&
		finalStack.backend === "self-tanstack-start"
	) {
		return "TanStack Start fullstack backend only supports TanStack Start frontend. Select TanStack Start frontend first.";
	}

	if (
		category === "runtime" &&
		optionId === "workers" &&
		finalStack.backend !== "hono"
	) {
		return "Cloudflare Workers runtime requires Hono backend. Switch to Hono backend first.";
	}

	if (
		category === "runtime" &&
		optionId === "none" &&
		finalStack.backend !== "convex" &&
		finalStack.backend !== "self-next" &&
		finalStack.backend !== "self-tanstack-start"
	) {
		return "Runtime 'None' is only available with Convex backend, Next.js fullstack, or TanStack Start fullstack. Switch to one of these backends to use this option.";
	}

	if (
		category === "runtime" &&
		optionId !== "none" &&
		(finalStack.backend === "self-next" ||
			finalStack.backend === "self-tanstack-start")
	) {
		return "Fullstack backends use frontend's built-in API routes and require runtime to be 'None'. Fullstack backends don't need a separate runtime.";
	}

	if (
		category === "orm" &&
		finalStack.database === "none" &&
		optionId !== "none" &&
		finalStack.backend !== "self-next" &&
		finalStack.backend !== "self-tanstack-start"
	) {
		return "ORM requires a database. Select a database first (SQLite, PostgreSQL, or MongoDB).";
	}

	if (
		category === "database" &&
		optionId !== "none" &&
		finalStack.orm === "none" &&
		finalStack.backend !== "self-next" &&
		finalStack.backend !== "self-tanstack-start"
	) {
		return "Database requires an ORM. Select an ORM first (Drizzle, Prisma, or Mongoose).";
	}

	if (category === "database" && optionId === "mongodb") {
		if (
			finalStack.orm === "none" &&
			finalStack.backend !== "self-next" &&
			finalStack.backend !== "self-tanstack-start"
		) {
			return "MongoDB requires an ORM. Select Prisma or Mongoose ORM first.";
		}
		if (finalStack.orm !== "prisma" && finalStack.orm !== "mongoose") {
			return "MongoDB requires Prisma or Mongoose ORM. Select one of these ORMs first.";
		}
		if (
			finalStack.dbSetup !== "mongodb-atlas" &&
			finalStack.dbSetup !== "none"
		) {
			return "MongoDB requires MongoDB Atlas setup. Select MongoDB Atlas first or set DB Setup to 'None'.";
		}
	}

	if (category === "database" && optionId === "sqlite") {
		if (
			finalStack.orm === "none" &&
			finalStack.backend !== "self-next" &&
			finalStack.backend !== "self-tanstack-start"
		) {
			return "SQLite requires an ORM. Select Drizzle or Prisma ORM first.";
		}
		if (finalStack.dbSetup === "mongodb-atlas") {
			return "MongoDB Atlas setup requires MongoDB database. Select MongoDB first.";
		}
		if (finalStack.orm === "mongoose") {
			return "SQLite database is not compatible with Mongoose ORM. Mongoose only works with MongoDB. Use Drizzle or Prisma ORM instead.";
		}
	}

	if (category === "database" && optionId === "postgres") {
		if (finalStack.orm === "none") {
			return "PostgreSQL requires an ORM. Select Drizzle or Prisma ORM first.";
		}
		if (finalStack.dbSetup === "mongodb-atlas") {
			return "MongoDB Atlas setup requires MongoDB database. Select MongoDB first.";
		}
		if (finalStack.orm === "mongoose") {
			return "PostgreSQL database is not compatible with Mongoose ORM. Mongoose only works with MongoDB. Use Drizzle or Prisma ORM instead.";
		}
	}

	if (category === "database" && optionId === "mysql") {
		if (finalStack.orm === "none") {
			return "MySQL requires an ORM. Select Drizzle or Prisma ORM first.";
		}
		if (finalStack.dbSetup === "mongodb-atlas") {
			return "MongoDB Atlas setup requires MongoDB database. Select MongoDB first.";
		}
		if (finalStack.orm === "mongoose") {
			return "MySQL database is not compatible with Mongoose ORM. Mongoose only works with MongoDB. Use Drizzle or Prisma ORM instead.";
		}
	}

	if (category === "orm" && optionId === "mongoose") {
		if (finalStack.database === "none") {
			return "Mongoose ORM requires MongoDB database. Select MongoDB first.";
		}
		if (finalStack.database !== "mongodb") {
			return "Mongoose ORM only works with MongoDB database. Select MongoDB first.";
		}
	}

	if (category === "orm" && optionId === "none") {
		if (finalStack.database !== "none") {
			return "Cannot set ORM to 'None' when a database is selected. Select an appropriate ORM (Drizzle, Prisma, or Mongoose) or set database to 'None'.";
		}
	}

	if (category === "orm" && optionId === "drizzle") {
		if (finalStack.database === "mongodb") {
			return "Drizzle ORM does not support MongoDB. Use Prisma or Mongoose ORM instead.";
		}
		if (
			finalStack.database === "none" &&
			finalStack.backend !== "self-next" &&
			finalStack.backend !== "self-tanstack-start"
		) {
			return "Drizzle ORM requires a database. Select a database first (SQLite, PostgreSQL, or MySQL).";
		}
	}

	if (category === "orm" && optionId === "prisma") {
		if (
			finalStack.database === "none" &&
			finalStack.backend !== "self-next" &&
			finalStack.backend !== "self-tanstack-start"
		) {
			return "Prisma ORM requires a database. Select a database first (SQLite, PostgreSQL, MySQL, or MongoDB).";
		}
		if (finalStack.dbSetup === "turso" && finalStack.database !== "sqlite") {
			return "Turso setup requires SQLite database. Select SQLite first.";
		}
		if (finalStack.dbSetup === "d1" && finalStack.database !== "sqlite") {
			return "Cloudflare D1 setup requires SQLite database. Select SQLite first.";
		}
	}

	if (category === "dbSetup" && optionId === "turso") {
		if (finalStack.orm !== "drizzle" && finalStack.orm !== "prisma") {
			return "Turso requires Drizzle or Prisma ORM. Select Drizzle or Prisma first.";
		}
	}

	if (category === "dbSetup" && optionId === "docker") {
		if (finalStack.database === "mongodb") {
			return "Docker setup is not compatible with MongoDB. Use MongoDB Atlas instead.";
		}
	}

	if (category === "dbSetup" && optionId === "d1") {
		if (finalStack.orm !== "drizzle" && finalStack.orm !== "prisma") {
			return "Cloudflare D1 requires Drizzle or Prisma ORM. Select Drizzle or Prisma first.";
		}
		if (finalStack.runtime !== "workers") {
			return "Cloudflare D1 requires Cloudflare Workers runtime. Select Workers runtime first.";
		}
		if (finalStack.backend !== "hono") {
			return "Cloudflare D1 requires Hono backend. Select Hono backend first.";
		}
	}

	if (category === "dbSetup" && optionId === "mongodb-atlas") {
		if (finalStack.orm !== "prisma" && finalStack.orm !== "mongoose") {
			return "MongoDB Atlas requires Prisma or Mongoose ORM. Select one of these ORMs first.";
		}
	}

	if (category === "dbSetup" && optionId === "turso") {
		if (finalStack.database !== "sqlite") {
			return "Turso requires SQLite database. Select SQLite first.";
		}
	}

	if (category === "dbSetup" && optionId === "d1") {
		if (finalStack.database !== "sqlite") {
			return "Cloudflare D1 requires SQLite database. Select SQLite first.";
		}
	}

	if (category === "dbSetup" && optionId === "neon") {
		if (finalStack.database !== "postgres") {
			return "Neon requires PostgreSQL database. Select PostgreSQL first.";
		}
	}

	if (category === "dbSetup" && optionId === "prisma-postgres") {
		if (finalStack.database !== "postgres") {
			return "Prisma PostgreSQL setup requires PostgreSQL database. Select PostgreSQL first.";
		}
	}

	if (category === "dbSetup" && optionId === "mongodb-atlas") {
		if (finalStack.database !== "mongodb") {
			return "MongoDB Atlas requires MongoDB database. Select MongoDB first.";
		}
	}

	if (category === "database" && optionId === "sqlite") {
		if (
			finalStack.dbSetup !== "none" &&
			finalStack.dbSetup !== "turso" &&
			finalStack.dbSetup !== "d1"
		) {
			return "SQLite database only works with Turso, Cloudflare D1, or Basic Setup. Select one of these options or change database.";
		}
	}

	if (category === "database" && optionId === "postgres") {
		if (
			finalStack.dbSetup !== "none" &&
			finalStack.dbSetup !== "docker" &&
			finalStack.dbSetup !== "prisma-postgres" &&
			finalStack.dbSetup !== "neon" &&
			finalStack.dbSetup !== "supabase" &&
			finalStack.dbSetup !== "planetscale"
		) {
			return "PostgreSQL database only works with Docker, Prisma PostgreSQL, Neon, Supabase, PlanetScale, or Basic Setup. Select one of these options or change database.";
		}
	}

	if (category === "database" && optionId === "mysql") {
		if (
			finalStack.dbSetup !== "none" &&
			finalStack.dbSetup !== "docker" &&
			finalStack.dbSetup !== "planetscale"
		) {
			return "MySQL database only works with Docker, PlanetScale, or Basic Setup. Select one of these options or change database.";
		}
	}

	if (category === "database" && optionId === "mongodb") {
		if (
			finalStack.dbSetup !== "none" &&
			finalStack.dbSetup !== "mongodb-atlas"
		) {
			return "MongoDB database only works with MongoDB Atlas or Basic Setup. Select one of these options or change database.";
		}
	}

	if (category === "dbSetup" && optionId !== "none") {
		if (finalStack.database === "none") {
			return "Database setup requires a database. Select a database first or set DB Setup to 'None'.";
		}
	}

	if (category === "dbSetup" && optionId === "docker") {
		if (finalStack.database === "none") {
			return "Docker setup requires a database. Select a database first (PostgreSQL, MySQL, or MongoDB).";
		}
		if (finalStack.database === "sqlite") {
			return "Docker setup is not needed for SQLite. SQLite works without Docker.";
		}
		if (finalStack.runtime === "workers") {
			return "Docker setup is not compatible with Cloudflare Workers runtime. Use D1 instead.";
		}
	}

	if (
		category === "serverDeploy" &&
		finalStack.runtime === "workers" &&
		optionId === "none"
	) {
		return "Cloudflare Workers runtime requires a server deployment. Select Wrangler or Alchemy.";
	}

	if (
		category === "serverDeploy" &&
		(optionId === "alchemy" || optionId === "wrangler") &&
		finalStack.runtime !== "workers"
	) {
		return `${optionId === "alchemy" ? "Alchemy" : "Wrangler"} deployment requires Cloudflare Workers runtime. Select Workers runtime first.`;
	}

	if (
		category === "serverDeploy" &&
		(optionId === "alchemy" || optionId === "wrangler") &&
		finalStack.backend !== "hono"
	) {
		return `${optionId === "alchemy" ? "Alchemy" : "Wrangler"} deployment requires Hono backend. Select Hono backend first.`;
	}

	if (
		category === "serverDeploy" &&
		optionId !== "none" &&
		(finalStack.backend === "none" ||
			finalStack.backend === "convex" ||
			finalStack.backend === "self-next" ||
			finalStack.backend === "self-tanstack-start")
	) {
		if (
			finalStack.backend === "self-next" ||
			finalStack.backend === "self-tanstack-start"
		) {
			return "Self backend (fullstack) uses frontend's built-in API routes and doesn't need server deployment.";
		}
		return "Server deployment requires a supported backend (Hono, Express, Fastify, or Elysia). Convex has its own deployment.";
	}

	if (category === "webDeploy" && optionId !== "none") {
		const hasWebFrontend = finalStack.webFrontend.some((f) => f !== "none");
		if (!hasWebFrontend) {
			return "Web deployment requires a web frontend. Select a web frontend first.";
		}
	}

	if (category === "api" && optionId === "trpc") {
		const isNuxt = finalStack.webFrontend.includes("nuxt");
		const isSvelte = finalStack.webFrontend.includes("svelte");
		const isSolid = finalStack.webFrontend.includes("solid");
		if (isNuxt || isSvelte || isSolid) {
			const frontendName = isNuxt ? "Nuxt" : isSvelte ? "Svelte" : "Solid";
			return `${frontendName} requires oRPC API. tRPC is not compatible with ${frontendName}.`;
		}
	}

	if (category === "addons" && optionId === "pwa") {
		const hasPWACompat = hasPWACompatibleFrontend(finalStack.webFrontend);
		if (!hasPWACompat) {
			return "PWA addon requires TanStack Router, React Router, Solid, or Next.js frontend.";
		}
	}

	if (category === "addons" && optionId === "tauri") {
		const hasTauriCompat = hasTauriCompatibleFrontend(finalStack.webFrontend);
		if (!hasTauriCompat) {
			return "Tauri addon requires TanStack Router, React Router, Nuxt, Svelte, Solid, or Next.js frontend.";
		}
	}

	if (category === "examples" && optionId === "todo") {
		if (finalStack.database === "none") {
			return "Todo example requires a database. Select a database first.";
		}
	}

	if (category === "examples" && optionId === "ai") {
		if (finalStack.webFrontend.includes("solid")) {
			return "AI example is not compatible with Solid frontend. Try React-based frontends.";
		}
	}

	if (category === "payments" && optionId === "polar") {
		if (finalStack.auth !== "better-auth") {
			return "Polar payments requires Better Auth. Select Better Auth first.";
		}
		if (finalStack.backend === "convex") {
			return "Polar payments is not compatible with Convex backend. Try Hono, Express, Fastify, or Elysia.";
		}
		const hasWebFrontend = finalStack.webFrontend.some((f) => f !== "none");
		if (
			!hasWebFrontend &&
			finalStack.nativeFrontend.some((f) => f !== "none")
		) {
			return "Polar payments requires a web frontend. Select a web frontend first.";
		}
	}

	if (category === "dbSetup" && optionId === "planetscale") {
		if (finalStack.database !== "postgres" && finalStack.database !== "mysql") {
			return "PlanetScale requires PostgreSQL or MySQL database. Select PostgreSQL or MySQL first.";
		}
	}

	if (category === "dbSetup" && optionId === "supabase") {
		if ((finalStack.database as string) !== "postgres") {
			return "Supabase requires PostgreSQL database. Select PostgreSQL first.";
		}
	}

	if (
		category === "database" &&
		(finalStack.dbSetup as string) === "planetscale"
	) {
		if (optionId !== "postgres" && optionId !== "mysql") {
			return "Selected DB Setup 'PlanetScale' requires PostgreSQL or MySQL. Select PostgreSQL or MySQL, or change DB Setup.";
		}
	}

	if (
		category === "database" &&
		(finalStack.dbSetup as string) === "supabase"
	) {
		if (optionId !== "postgres") {
			return "Selected DB Setup 'Supabase' requires PostgreSQL. Select PostgreSQL or change DB Setup.";
		}
	}

	return null;
};

export const isOptionCompatible = (
	currentStack: StackState,
	category: keyof typeof TECH_OPTIONS,
	optionId: string,
): boolean => {
	if (currentStack.yolo === "true") {
		return true;
	}
	return getDisabledReason(currentStack, category, optionId) === null;
};
