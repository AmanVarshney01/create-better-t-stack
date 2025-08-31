"use client";

import {
	Check,
	ClipboardCopy,
	InfoIcon,
	RefreshCw,
	Settings,
	Share2,
	Shuffle,
	Star,
	Terminal,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useQueryStates } from "nuqs";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	DEFAULT_STACK,
	isStackDefault,
	PRESET_TEMPLATES,
	type StackState,
	TECH_OPTIONS,
} from "@/lib/constant";
import { stackParsers, stackQueryStatesOptions } from "@/lib/stack-url-state";
import { cn } from "@/lib/utils";

const validateProjectName = (name: string): string | undefined => {
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
};

const CATEGORY_ORDER: Array<keyof typeof TECH_OPTIONS> = [
	"webFrontend",
	"nativeFrontend",
	"backend",
	"runtime",
	"api",
	"database",
	"orm",
	"dbSetup",
	"webDeploy",
	"serverDeploy",
	"auth",
	"packageManager",
	"addons",
	"examples",
	"git",
	"install",
];

const hasPWACompatibleFrontend = (webFrontend: string[]) =>
	webFrontend.some((f) =>
		["tanstack-router", "react-router", "solid", "next"].includes(f),
	);

const hasTauriCompatibleFrontend = (webFrontend: string[]) =>
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

const getBadgeColors = (category: string): string => {
	switch (category) {
		case "webFrontend":
		case "nativeFrontend":
			return "border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-700/30 dark:bg-blue-900/30 dark:text-blue-300";
		case "runtime":
			return "border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-700/30 dark:bg-amber-900/30 dark:text-amber-300";
		case "backend":
			return "border-sky-300 bg-sky-100 text-sky-800 dark:border-sky-700/30 dark:bg-sky-900/30 dark:text-sky-300";
		case "api":
			return "border-indigo-300 bg-indigo-100 text-indigo-800 dark:border-indigo-700/30 dark:bg-indigo-900/30 dark:text-indigo-300";
		case "database":
			return "border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-700/30 dark:bg-emerald-900/30 dark:text-emerald-300";
		case "orm":
			return "border-cyan-300 bg-cyan-100 text-cyan-800 dark:border-cyan-700/30 dark:bg-cyan-900/30 dark:text-cyan-300";
		case "auth":
			return "border-green-300 bg-green-100 text-green-800 dark:border-green-700/30 dark:bg-green-900/30 dark:text-green-300";
		case "dbSetup":
			return "border-pink-300 bg-pink-100 text-pink-800 dark:border-pink-700/30 dark:bg-pink-900/30 dark:text-pink-300";
		case "addons":
			return "border-violet-300 bg-violet-100 text-violet-800 dark:border-violet-700/30 dark:bg-violet-900/30 dark:text-violet-300";
		case "examples":
			return "border-teal-300 bg-teal-100 text-teal-800 dark:border-teal-700/30 dark:bg-teal-900/30 dark:text-teal-300";
		case "packageManager":
			return "border-orange-300 bg-orange-100 text-orange-800 dark:border-orange-700/30 dark:bg-orange-900/30 dark:text-orange-300";
		case "git":
		case "webDeploy":
		case "serverDeploy":
		case "install":
			return "border-gray-300 bg-gray-100 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400";
		default:
			return "border-gray-300 bg-gray-100 text-gray-800 dark:border-gray-700/30 dark:bg-gray-900/30 dark:text-gray-300";
	}
};

function TechIcon({
	icon,
	name,
	className,
}: {
	icon: string;
	name: string;
	className?: string;
}) {
	const { theme } = useTheme();

	if (!icon) return null;

	if (!icon.startsWith("https://")) {
		return (
			<span className={cn("inline-flex items-center text-lg", className)}>
				{icon}
			</span>
		);
	}

	let iconSrc = icon;
	if (
		theme === "light" &&
		(icon.includes("drizzle") ||
			icon.includes("prisma") ||
			icon.includes("express") ||
			icon.includes("clerk"))
	) {
		iconSrc = icon.replace(".svg", "-light.svg");
	}

	return (
		<Image
			suppressHydrationWarning
			src={iconSrc}
			alt={`${name} icon`}
			width={20}
			height={20}
			className={cn("inline-block", className)}
			unoptimized
		/>
	);
}

const getCategoryDisplayName = (categoryKey: string): string => {
	const result = categoryKey.replace(/([A-Z])/g, " $1");
	return result.charAt(0).toUpperCase() + result.slice(1);
};

interface CompatibilityResult {
	adjustedStack: StackState | null;
	notes: Record<string, { notes: string[]; hasIssue: boolean }>;
	changes: Array<{ category: string; message: string }>;
}

const analyzeStackCompatibility = (stack: StackState): CompatibilityResult => {
	const nextStack = { ...stack };
	let changed = false;
	const notes: CompatibilityResult["notes"] = {};
	const changes: Array<{ category: string; message: string }> = [];

	for (const cat of CATEGORY_ORDER) {
		notes[cat] = { notes: [], hasIssue: false };
	}

	const isConvex = nextStack.backend === "convex";
	const isBackendNone = nextStack.backend === "none";

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
				["native-nativewind", "native-unistyles"].includes(f),
			);

		if (nextStack.auth !== "clerk" || !hasClerkCompatibleFrontend) {
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
				(nextStack[catKey] as string | string[]) = value;
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
				(nextStack[catKey] as string | string[]) = value;
				changed = true;
				changes.push({
					category: "backend-none",
					message,
				});
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
			if (nextStack.auth !== "none" && nextStack.backend !== "convex") {
				notes.database.notes.push(
					"Database 'None' selected: Auth will be disabled.",
				);
				notes.auth.notes.push(
					"Authentication requires a database. It will be set to 'None'.",
				);
				notes.database.hasIssue = true;
				notes.auth.hasIssue = true;
				nextStack.auth = "none";
				changed = true;
				changes.push({
					category: "database",
					message:
						"Authentication set to 'None' (auth requires a database but 'None' was selected)",
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
			if (nextStack.orm !== "prisma" && nextStack.orm !== "mongoose") {
				notes.database.notes.push(
					"MongoDB requires Prisma or Mongoose ORM. Prisma will be selected.",
				);
				notes.orm.notes.push(
					"MongoDB requires Prisma or Mongoose ORM. Prisma will be selected.",
				);
				notes.database.hasIssue = true;
				notes.orm.hasIssue = true;
				nextStack.orm = "prisma";
				changed = true;
				changes.push({
					category: "database",
					message:
						"ORM set to 'Prisma' (MongoDB database only works with Prisma or Mongoose ORM)",
				});
			}
		} else {
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
				if (nextStack.orm !== "drizzle") {
					notes.dbSetup.notes.push(
						"Turso requires Drizzle ORM. It will be selected.",
					);
					notes.orm.notes.push(
						"Turso DB setup requires Drizzle ORM. It will be selected.",
					);
					notes.dbSetup.hasIssue = true;
					notes.orm.hasIssue = true;
					nextStack.orm = "drizzle";
					changed = true;
					changes.push({
						category: "dbSetup",
						message:
							"ORM set to 'Drizzle' (Turso hosting requires Drizzle ORM)",
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
				if (nextStack.orm !== "drizzle") {
					notes.dbSetup.notes.push(
						"Cloudflare D1 requires Drizzle ORM. It will be selected.",
					);
					notes.orm.notes.push(
						"Cloudflare D1 DB setup requires Drizzle ORM. It will be selected.",
					);
					notes.dbSetup.hasIssue = true;
					notes.orm.hasIssue = true;
					nextStack.orm = "drizzle";
					changed = true;
					changes.push({
						category: "dbSetup",
						message: "ORM set to 'Drizzle' (required by Cloudflare D1)",
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

				if (nextStack.orm !== "drizzle" && nextStack.orm !== "none") {
					notes.runtime.notes.push(
						"Cloudflare Workers runtime requires Drizzle ORM or no ORM. Drizzle will be selected.",
					);
					notes.orm.notes.push(
						"Cloudflare Workers runtime requires Drizzle ORM or no ORM. Drizzle will be selected.",
					);
					notes.runtime.hasIssue = true;
					notes.orm.hasIssue = true;
					nextStack.orm = "drizzle";
					changed = true;
					changes.push({
						category: "runtime",
						message:
							"ORM set to 'Drizzle' (Cloudflare Workers runtime only supports Drizzle or no ORM)",
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
							["native-nativewind", "native-unistyles"].includes(f),
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
				notes.auth.notes.push(
					"Better-Auth is not compatible with Convex backend. Auth will be set to 'None'.",
				);
				notes.backend.notes.push(
					"Convex backend only supports Clerk auth or no auth. Auth will be disabled.",
				);
				notes.auth.hasIssue = true;
				notes.backend.hasIssue = true;
				nextStack.auth = "none";
				changed = true;
				changes.push({
					category: "auth",
					message:
						"Auth set to 'None' (Better-Auth not compatible with Convex backend - use Clerk instead)",
				});
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

			if (
				nextStack.addons.includes("husky") &&
				!nextStack.addons.includes("biome") &&
				!nextStack.addons.includes("oxlint")
			) {
				notes.addons.notes.push(
					"Husky addon is selected without a linter. Consider adding Biome or Oxlint for lint-staged integration.",
				);
			}

			if (nextStack.addons.includes("ultracite")) {
				if (nextStack.addons.includes("biome")) {
					notes.addons.notes.push(
						"Ultracite includes Biome setup. Biome addon will be removed.",
					);
					nextStack.addons = nextStack.addons.filter(
						(addon) => addon !== "biome",
					);
					changed = true;
					changes.push({
						category: "addons",
						message:
							"Biome addon removed (Ultracite already includes Biome configuration)",
					});
				}
			}

			if (
				nextStack.addons.includes("oxlint") &&
				nextStack.addons.includes("biome")
			) {
				notes.addons.notes.push(
					"Both Oxlint and Biome are selected. Consider using only one linter.",
				);
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
			if (nextStack.backend === "elysia" && nextStack.examples.includes("ai")) {
				incompatibleExamples.push("ai");
				changes.push({
					category: "examples",
					message: "AI example removed (not compatible with Elysia backend)",
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
				if (
					nextStack.backend === "elysia" &&
					uniqueIncompatibleExamples.includes("ai")
				) {
					notes.backend.notes.push(
						"AI example is not compatible with Elysia. It will be removed.",
					);
					notes.examples.notes.push(
						"AI example is not compatible with Elysia. It will be removed.",
					);
					notes.backend.hasIssue = true;
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
		(nextStack.backend === "none" || nextStack.backend === "convex")
	) {
		notes.serverDeploy.notes.push(
			"Server deployment requires a supported backend. It will be disabled.",
		);
		notes.backend.notes.push(
			"No compatible backend selected: Server deployment has been disabled.",
		);
		notes.serverDeploy.hasIssue = true;
		notes.backend.hasIssue = true;
		nextStack.serverDeploy = "none";
		changed = true;
		changes.push({
			category: "serverDeploy",
			message:
				"Server deployment set to 'None' (requires a backend but 'None' or 'Convex' was selected)",
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

	const isAlchemyWebDeploy = nextStack.webDeploy === "alchemy";
	const isAlchemyServerDeploy = nextStack.serverDeploy === "alchemy";

	if (isAlchemyWebDeploy || isAlchemyServerDeploy) {
		const incompatibleFrontends = nextStack.webFrontend.filter(
			(f) => f === "next",
		);

		if (incompatibleFrontends.length > 0) {
			const deployType =
				isAlchemyWebDeploy && isAlchemyServerDeploy
					? "web and server deployment"
					: isAlchemyWebDeploy
						? "web deployment"
						: "server deployment";

			notes.webFrontend.notes.push(
				`Alchemy ${deployType} is temporarily not compatible with ${incompatibleFrontends.join(" and ")}. These frontends will be removed.`,
			);
			notes.webDeploy.notes.push(
				`Alchemy ${deployType} is temporarily not compatible with ${incompatibleFrontends.join(" and ")}.`,
			);
			notes.serverDeploy.notes.push(
				`Alchemy ${deployType} is temporarily not compatible with ${incompatibleFrontends.join(" and ")}.`,
			);
			notes.webFrontend.hasIssue = true;
			notes.webDeploy.hasIssue = true;
			notes.serverDeploy.hasIssue = true;

			nextStack.webFrontend = nextStack.webFrontend.filter((f) => f !== "next");

			if (nextStack.webFrontend.length === 0) {
				nextStack.webFrontend = ["tanstack-router"];
			}

			changed = true;
			changes.push({
				category: "alchemy",
				message: `Removed ${incompatibleFrontends.join(" and ")} frontend (temporarily not compatible with Alchemy ${deployType} - support coming soon)`,
			});
		}
	}

	return {
		adjustedStack: changed ? nextStack : null,
		notes,
		changes,
	};
};

const generateCommand = (stackState: StackState): string => {
	let base: string;
	switch (stackState.packageManager) {
		case "npm":
			base = "npx create-better-t-stack@latest";
			break;
		case "pnpm":
			base = "pnpm create better-t-stack@latest";
			break;
		default:
			base = "bun create better-t-stack@latest";
			break;
	}

	const projectName = stackState.projectName || "my-better-t-app";
	const flags: string[] = [];

	const isDefaultStack = Object.keys(DEFAULT_STACK).every((key) => {
		if (key === "projectName") return true;
		const defaultKey = key as keyof StackState;
		return isStackDefault(stackState, defaultKey, stackState[defaultKey]);
	});

	if (isDefaultStack) {
		flags.push("--yes");
	} else {
		const combinedFrontends = [
			...stackState.webFrontend,
			...stackState.nativeFrontend,
		].filter((v, _, arr) => v !== "none" || arr.length === 1);

		if (combinedFrontends.length === 0 || combinedFrontends[0] === "none") {
			flags.push("--frontend none");
		} else {
			flags.push(`--frontend ${combinedFrontends.join(" ")}`);
		}

		flags.push(`--backend ${stackState.backend}`);

		flags.push(`--runtime ${stackState.runtime}`);

		flags.push(`--api ${stackState.api}`);

		flags.push(`--auth ${stackState.auth}`);

		flags.push(`--database ${stackState.database}`);

		flags.push(`--orm ${stackState.orm}`);

		flags.push(`--db-setup ${stackState.dbSetup}`);

		flags.push(`--package-manager ${stackState.packageManager}`);

		if (stackState.git === "false") {
			flags.push("--no-git");
		} else {
			flags.push("--git");
		}

		flags.push(`--web-deploy ${stackState.webDeploy}`);

		flags.push(`--server-deploy ${stackState.serverDeploy}`);

		if (stackState.install === "false") {
			flags.push("--no-install");
		} else {
			flags.push("--install");
		}

		if (stackState.addons.length > 0) {
			const validAddons = stackState.addons.filter((addon) =>
				[
					"pwa",
					"tauri",
					"starlight",
					"biome",
					"husky",
					"turborepo",
					"ultracite",
					"fumadocs",
					"oxlint",
					"ruler",
				].includes(addon),
			);
			if (validAddons.length > 0) {
				flags.push(`--addons ${validAddons.join(" ")}`);
			}
		} else {
			flags.push("--addons none");
		}

		if (stackState.examples.length > 0) {
			flags.push(`--examples ${stackState.examples.join(" ")}`);
		} else {
			flags.push("--examples none");
		}
	}

	return `${base} ${projectName}${
		flags.length > 0 ? ` ${flags.join(" ")}` : ""
	}`;
};

const StackBuilder = () => {
	const [stack, setStack] = useQueryStates(
		stackParsers,
		stackQueryStatesOptions,
	);

	const [command, setCommand] = useState("");
	const [copied, setCopied] = useState(false);
	const [projectNameError, setProjectNameError] = useState<string | undefined>(
		undefined,
	);
	const [lastSavedStack, setLastSavedStack] = useState<StackState | null>(null);
	const [, setLastChanges] = useState<
		Array<{ category: string; message: string }>
	>([]);

	const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
	const contentRef = useRef<HTMLDivElement>(null);

	const compatibilityAnalysis = useMemo(
		() => analyzeStackCompatibility(stack),
		[stack],
	);

	const getRandomStack = () => {
		const randomStack: Partial<StackState> = {};

		for (const category of CATEGORY_ORDER) {
			const options = TECH_OPTIONS[category as keyof typeof TECH_OPTIONS] || [];
			if (options.length === 0) continue;

			const catKey = category as keyof StackState;

			if (
				["webFrontend", "nativeFrontend", "addons", "examples"].includes(catKey)
			) {
				if (catKey === "webFrontend" || catKey === "nativeFrontend") {
					const randomIndex = Math.floor(Math.random() * options.length);
					const selectedOption = options[randomIndex].id;
					randomStack[catKey as "webFrontend" | "nativeFrontend"] = [
						selectedOption,
					];
				} else {
					const numToPick = Math.floor(
						Math.random() * Math.min(options.length, 4),
					);
					if (numToPick === 0) {
						randomStack[catKey as "addons" | "examples"] = ["none"];
					} else {
						const shuffledOptions = [...options]
							.filter((opt) => opt.id !== "none")
							.sort(() => 0.5 - Math.random())
							.slice(0, numToPick);
						randomStack[catKey as "addons" | "examples"] = shuffledOptions.map(
							(opt) => opt.id,
						);
					}
				}
			} else {
				const randomIndex = Math.floor(Math.random() * options.length);
				(randomStack[catKey] as string) = options[randomIndex].id;
			}
		}
		setStack(randomStack as StackState);
		contentRef.current?.scrollTo(0, 0);
		toast.success("Random stack generated!");
	};

	const shareToTwitter = () => {
		const getStackSummary = (): string => {
			const selectedTechs: string[] = [];

			for (const category of CATEGORY_ORDER) {
				const categoryKey = category as keyof StackState;
				const options = TECH_OPTIONS[category as keyof typeof TECH_OPTIONS];
				const selectedValue = stack[categoryKey];

				if (!options) continue;

				if (Array.isArray(selectedValue)) {
					if (
						selectedValue.length === 0 ||
						(selectedValue.length === 1 && selectedValue[0] === "none")
					) {
						continue;
					}

					for (const id of selectedValue) {
						if (id === "none") continue;
						const tech = options.find((opt) => opt.id === id);
						if (tech) {
							selectedTechs.push(tech.name);
						}
					}
				} else {
					const tech = options.find((opt) => opt.id === selectedValue);
					if (
						!tech ||
						tech.id === "none" ||
						tech.id === "false" ||
						((category === "git" ||
							category === "install" ||
							category === "auth") &&
							tech.id === "true")
					) {
						continue;
					}
					selectedTechs.push(tech.name);
				}
			}

			return selectedTechs.length > 0
				? selectedTechs.join(" • ")
				: "Custom stack";
		};

		const stackSummary = getStackSummary();
		const text = encodeURIComponent(
			`Check out this cool tech stack I configured with Create Better T Stack!\n\n🚀 ${stackSummary}\n\n`,
		);
		if (typeof window !== "undefined") {
			const url = encodeURIComponent(window.location.href);
			window.open(
				`https://twitter.com/intent/tweet?text=${text}&url=${url}`,
				"_blank",
			);
		} else {
			toast.error("Could not generate share link.");
		}
	};

	const selectedBadges = (() => {
		const badges: React.ReactNode[] = [];
		for (const category of CATEGORY_ORDER) {
			const categoryKey = category as keyof StackState;
			const options = TECH_OPTIONS[category as keyof typeof TECH_OPTIONS];
			const selectedValue = stack[categoryKey];

			if (!options) continue;

			if (Array.isArray(selectedValue)) {
				if (
					selectedValue.length === 0 ||
					(selectedValue.length === 1 && selectedValue[0] === "none")
				) {
					continue;
				}

				for (const id of selectedValue) {
					if (id === "none") continue;
					const tech = options.find((opt) => opt.id === id);
					if (tech) {
						badges.push(
							<span
								key={`${category}-${tech.id}`}
								className={cn(
									"inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs",
									getBadgeColors(category),
								)}
							>
								{tech.icon !== "" && (
									<TechIcon
										icon={tech.icon}
										name={tech.name}
										className={cn("h-3 w-3", tech.className)}
									/>
								)}
								{tech.name}
							</span>,
						);
					}
				}
			} else {
				const tech = options.find((opt) => opt.id === selectedValue);
				if (
					!tech ||
					tech.id === "none" ||
					tech.id === "false" ||
					((category === "git" ||
						category === "install" ||
						category === "auth") &&
						tech.id === "true")
				) {
					continue;
				}
				badges.push(
					<span
						key={`${category}-${tech.id}`}
						className={cn(
							"inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs",
							getBadgeColors(category),
						)}
					>
						<TechIcon icon={tech.icon} name={tech.name} className="h-3 w-3" />
						{tech.name}
					</span>,
				);
			}
		}
		return badges;
	})();

	useEffect(() => {
		const savedStack = localStorage.getItem("betterTStackPreference");
		if (savedStack) {
			try {
				const parsedStack = JSON.parse(savedStack) as StackState;
				setLastSavedStack(parsedStack);
			} catch (e) {
				console.error("Failed to parse saved stack", e);
				localStorage.removeItem("betterTStackPreference");
			}
		}
	}, []);

	useEffect(() => {
		if (compatibilityAnalysis.adjustedStack) {
			if (compatibilityAnalysis.changes.length > 0) {
				if (compatibilityAnalysis.changes.length === 1) {
					toast.info(compatibilityAnalysis.changes[0].message, {
						duration: 4000,
					});
				} else if (compatibilityAnalysis.changes.length > 1) {
					const message = `${
						compatibilityAnalysis.changes.length
					} compatibility adjustments made:\n${compatibilityAnalysis.changes
						.map((c) => `• ${c.message}`)
						.join("\n")}`;
					toast.info(message, {
						duration: 5000,
					});
				}
			}
			setLastChanges(compatibilityAnalysis.changes);

			const isStackDifferent =
				JSON.stringify(stack) !==
				JSON.stringify(compatibilityAnalysis.adjustedStack);
			if (isStackDifferent) {
				setStack(compatibilityAnalysis.adjustedStack);
			}
		}
	}, [
		compatibilityAnalysis.adjustedStack,
		setStack,
		compatibilityAnalysis.changes,
		stack,
	]);

	useEffect(() => {
		const stackToUse = compatibilityAnalysis.adjustedStack || stack;
		const cmd = generateCommand(stackToUse);
		setCommand(cmd);
	}, [stack, compatibilityAnalysis.adjustedStack]);

	useEffect(() => {
		setProjectNameError(validateProjectName(stack.projectName || ""));
	}, [stack.projectName]);

	const handleTechSelect = (
		category: keyof typeof TECH_OPTIONS,
		techId: string,
	) => {
		if (!isOptionCompatible(stack, category, techId)) {
			return;
		}

		setStack((currentStack) => {
			const catKey = category as keyof StackState;
			const update: Partial<StackState> = {};
			const currentValue = currentStack[catKey];

			if (
				catKey === "webFrontend" ||
				catKey === "nativeFrontend" ||
				catKey === "addons" ||
				catKey === "examples"
			) {
				const currentArray = Array.isArray(currentValue)
					? [...currentValue]
					: [];
				let nextArray = [...currentArray];
				const isSelected = currentArray.includes(techId);

				if (catKey === "webFrontend") {
					if (techId === "none") {
						nextArray = ["none"];
					} else if (isSelected) {
						if (currentArray.length > 1) {
							nextArray = nextArray.filter((id) => id !== techId);
						} else {
							nextArray = ["none"];
						}
					} else {
						nextArray = [techId];
					}
				} else if (catKey === "nativeFrontend") {
					if (techId === "none") {
						nextArray = ["none"];
					} else if (isSelected) {
						nextArray = ["none"];
					} else {
						nextArray = [techId];
					}
				} else {
					if (isSelected) {
						nextArray = nextArray.filter((id) => id !== techId);
					} else {
						nextArray.push(techId);
					}
					if (nextArray.length > 1) {
						nextArray = nextArray.filter((id) => id !== "none");
					}
					if (
						nextArray.length === 0 &&
						(catKey === "addons" || catKey === "examples")
					) {
					} else if (nextArray.length === 0) {
						nextArray = ["none"];
					}
				}

				const uniqueNext = [...new Set(nextArray)].sort();
				const uniqueCurrent = [...new Set(currentArray)].sort();

				if (JSON.stringify(uniqueNext) !== JSON.stringify(uniqueCurrent)) {
					update[catKey] = uniqueNext;
				}
			} else {
				if (currentValue !== techId) {
					update[catKey] = techId;
				} else {
					if (
						(category === "git" || category === "install") &&
						techId === "false"
					) {
						update[catKey] = "true";
					} else if (
						(category === "git" || category === "install") &&
						techId === "true"
					) {
						update[catKey] = "false";
					}
				}
			}

			return Object.keys(update).length > 0 ? update : {};
		});
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(command);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const resetStack = () => {
		setStack(DEFAULT_STACK);
		contentRef.current?.scrollTo(0, 0);
	};

	const saveCurrentStack = () => {
		localStorage.setItem("betterTStackPreference", JSON.stringify(stack));
		setLastSavedStack(stack);
		toast.success("Your stack configuration has been saved");
	};

	const loadSavedStack = () => {
		if (lastSavedStack) {
			setStack(lastSavedStack);
			contentRef.current?.scrollTo(0, 0);
			toast.success("Saved configuration loaded");
		}
	};

	const applyPreset = (presetId: string) => {
		const preset = PRESET_TEMPLATES.find(
			(template) => template.id === presetId,
		);
		if (preset) {
			setStack(preset.stack);
			contentRef.current?.scrollTo(0, 0);
			toast.success(`Applied preset: ${preset.name}`);
		}
	};

	const isOptionCompatible = (
		currentStack: StackState,
		category: keyof typeof TECH_OPTIONS,
		optionId: string,
	): boolean => {
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

		if (category === "webFrontend" && optionId === "next") {
			const isAlchemyWebDeploy = finalStack.webDeploy === "alchemy";
			const isAlchemyServerDeploy = finalStack.serverDeploy === "alchemy";

			if (isAlchemyWebDeploy || isAlchemyServerDeploy) {
				return false;
			}
		}

		if (category === "auth" && optionId === "clerk") {
			if (finalStack.backend !== "convex") {
				return false;
			}

			const hasClerkCompatibleFrontend =
				finalStack.webFrontend.some((f) =>
					[
						"tanstack-router",
						"react-router",
						"tanstack-start",
						"next",
					].includes(f),
				) ||
				finalStack.nativeFrontend.some((f) =>
					["native-nativewind", "native-unistyles"].includes(f),
				);

			if (!hasClerkCompatibleFrontend) {
				return false;
			}
		}

		if (
			category === "backend" &&
			finalStack.runtime === "workers" &&
			optionId !== "hono"
		) {
			return false;
		}

		if (
			category === "runtime" &&
			optionId === "workers" &&
			finalStack.backend !== "hono"
		) {
			return false;
		}

		if (
			category === "orm" &&
			finalStack.database === "none" &&
			optionId !== "none"
		) {
			return false;
		}

		if (
			category === "database" &&
			optionId !== "none" &&
			finalStack.orm === "none"
		) {
			return false;
		}

		if (
			category === "serverDeploy" &&
			finalStack.runtime === "workers" &&
			optionId === "none"
		) {
			return false;
		}

		if (
			category === "webFrontend" ||
			category === "nativeFrontend" ||
			category === "addons" ||
			category === "examples"
		) {
			return (finalStack[category] as string[]).includes(optionId);
		}
		return finalStack[category] === optionId;
	};

	return (
		<TooltipProvider>
			<div className="grid w-full grid-cols-1 overflow-hidden border-border text-foreground sm:grid-cols-[auto_1fr]">
				<div className="flex w-full flex-col border-border border-r sm:max-w-3xs md:max-w-xs lg:max-w-sm">
					<ScrollArea className="flex-1">
						<div className="grid h-full grid-rows-[auto_1fr] justify-between gap-2 p-3 sm:p-4 md:h-[calc(100vh-64px)]">
							<div className="flex flex-col space-y-3 sm:space-y-4">
								<label className="flex flex-col">
									<span className="mb-1 text-muted-foreground text-xs">
										Project Name:
									</span>
									<input
										type="text"
										value={stack.projectName || ""}
										onChange={(e) => {
											const newValue = e.target.value;
											setStack({ projectName: newValue });
										}}
										className={cn(
											"w-full rounded border px-2 py-1 text-sm focus:outline-none",
											projectNameError
												? "border-destructive bg-destructive/10 text-destructive-foreground"
												: "border-border focus:border-primary",
										)}
										placeholder="my-better-t-app"
									/>
									{projectNameError && (
										<p className="mt-1 text-destructive text-xs">
											{projectNameError}
										</p>
									)}
								</label>

								<div className="flex flex-wrap gap-1.5 sm:gap-2">
									<button
										type="button"
										onClick={resetStack}
										className="flex items-center gap-1 rounded border border-border px-2 py-1 text-muted-foreground text-xs transition-colors hover:bg-muted"
										title="Reset to defaults"
									>
										<RefreshCw className="h-3 w-3" />
										<span className="">Reset</span>
									</button>
									<button
										type="button"
										onClick={getRandomStack}
										className="flex items-center gap-1 rounded border border-border px-2 py-1 text-muted-foreground text-xs transition-colors hover:bg-muted"
										title="Generate a random stack"
									>
										<Shuffle className="h-3 w-3" />
										<span className="">Random</span>
									</button>
									{lastSavedStack && (
										<button
											type="button"
											onClick={loadSavedStack}
											className="flex items-center gap-1 rounded border border-border px-2 py-1 text-muted-foreground text-xs transition-colors hover:bg-muted"
											title="Load saved preferences"
										>
											<Settings className="h-3 w-3" />
											<span className="">Load</span>
										</button>
									)}
									<button
										type="button"
										onClick={saveCurrentStack}
										className="flex items-center gap-1 rounded border border-border px-2 py-1 text-muted-foreground text-xs transition-colors hover:bg-muted"
										title="Save current preferences"
									>
										<Star className="h-3 w-3" />
										<span className="">Save</span>
									</button>
									<button
										type="button"
										onClick={shareToTwitter}
										className="flex items-center gap-1 rounded border border-border px-2 py-1 text-muted-foreground text-xs transition-colors hover:bg-muted"
										title="Share to Twitter"
									>
										<Share2 className="h-3 w-3" />
										<span className="">Share</span>
									</button>
								</div>

								<div className="relative rounded border border-border p-2">
									<div className="flex">
										<span className="mr-2 select-none text-chart-4">$</span>
										<code className="block break-all text-muted-foreground text-xs sm:text-sm">
											{command}
										</code>
									</div>
									<div className="mt-2 flex justify-end">
										<button
											type="button"
											onClick={copyToClipboard}
											className={cn(
												"flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors",
												copied
													? "bg-muted text-chart-4"
													: "text-muted-foreground hover:bg-muted hover:text-foreground",
											)}
											title={copied ? "Copied!" : "Copy command"}
										>
											{copied ? (
												<>
													<Check className="h-3 w-3 flex-shrink-0" />
													<span className="">Copied</span>
												</>
											) : (
												<>
													<ClipboardCopy className="h-3 w-3 flex-shrink-0" />
													<span className="">Copy</span>
												</>
											)}
										</button>
									</div>
								</div>

								<div>
									<h3 className="mb-2 font-medium text-foreground text-sm">
										Selected Stack
									</h3>
									<div className="flex flex-wrap gap-1.5">{selectedBadges}</div>
								</div>
							</div>

							<div className="mt-auto hidden border-border border-t pt-4 lg:flex lg:flex-col">
								<h3 className="mb-2 font-medium text-foreground text-sm">
									Quick Presets
								</h3>
								<div className="grid grid-cols-2 gap-2">
									{PRESET_TEMPLATES.map((preset) => (
										<button
											type="button"
											key={preset.id}
											onClick={() => applyPreset(preset.id)}
											className="rounded border border-border p-2 text-left transition-colors hover:bg-muted"
											title={preset.description}
										>
											<div className="font-medium text-foreground text-sm">
												{preset.name}
											</div>
											<div className="text-muted-foreground text-xs">
												{preset.description}
											</div>
										</button>
									))}
								</div>
							</div>
						</div>
					</ScrollArea>
				</div>

				<div className="flex flex-1 flex-col overflow-hidden">
					<ScrollArea
						ref={contentRef}
						className="flex-1 overflow-hidden scroll-smooth"
					>
						<main className="p-3 sm:p-4">
							{CATEGORY_ORDER.map((categoryKey) => {
								const categoryOptions =
									TECH_OPTIONS[categoryKey as keyof typeof TECH_OPTIONS] || [];
								const categoryDisplayName = getCategoryDisplayName(categoryKey);

								const filteredOptions = categoryOptions;

								if (filteredOptions.length === 0) return null;

								return (
									<section
										ref={(el) => {
											sectionRefs.current[categoryKey] = el;
										}}
										key={categoryKey}
										id={`section-${categoryKey}`}
										className="mb-6 scroll-mt-4 sm:mb-8"
									>
										<div className="mb-3 flex items-center border-border border-b pb-2 text-muted-foreground">
											<Terminal className="mr-2 h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
											<h2 className="font-semibold text-foreground text-sm sm:text-base">
												{categoryDisplayName}
											</h2>
											{compatibilityAnalysis.notes[categoryKey]?.hasIssue && (
												<Tooltip delayDuration={100}>
													<TooltipTrigger asChild>
														<InfoIcon className="ml-2 h-4 w-4 flex-shrink-0 cursor-help text-muted-foreground" />
													</TooltipTrigger>
													<TooltipContent side="top" align="start">
														<ul className="list-disc space-y-1 pl-4 text-xs">
															{compatibilityAnalysis.notes[
																categoryKey
															].notes.map((note) => (
																<li key={note}>{note}</li>
															))}
														</ul>
													</TooltipContent>
												</Tooltip>
											)}
										</div>

										<div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
											{filteredOptions.map((tech) => {
												let isSelected = false;
												const category = categoryKey as keyof StackState;
												const currentValue = stack[category];

												if (
													category === "addons" ||
													category === "examples" ||
													category === "webFrontend" ||
													category === "nativeFrontend"
												) {
													isSelected = (
														(currentValue as string[]) || []
													).includes(tech.id);
												} else {
													isSelected = currentValue === tech.id;
												}

												const isDisabled = !isOptionCompatible(
													stack,
													categoryKey as keyof typeof TECH_OPTIONS,
													tech.id,
												);

												return (
													<Tooltip key={tech.id} delayDuration={100}>
														<TooltipTrigger asChild>
															<motion.div
																className={cn(
																	"relative cursor-pointer rounded border p-2 transition-all sm:p-3",
																	isSelected
																		? "border-primary bg-primary/10"
																		: isDisabled
																			? "border-destructive/30 bg-destructive/5 opacity-50 hover:opacity-75"
																			: "border-border hover:border-muted hover:bg-muted",
																)}
																whileHover={{ scale: 1.02 }}
																whileTap={{ scale: 0.98 }}
																onClick={() =>
																	handleTechSelect(
																		categoryKey as keyof typeof TECH_OPTIONS,
																		tech.id,
																	)
																}
															>
																<div className="flex items-start">
																	<div className="flex-grow">
																		<div className="flex items-center justify-between">
																			<div className="flex items-center">
																				{tech.icon !== "" && (
																					<TechIcon
																						icon={tech.icon}
																						name={tech.name}
																						className={cn(
																							"mr-1.5 h-3 w-3 sm:h-4 sm:w-4",
																							tech.className,
																						)}
																					/>
																				)}
																				<span
																					className={cn(
																						"font-medium text-xs sm:text-sm",
																						isSelected
																							? "text-primary"
																							: "text-foreground",
																					)}
																				>
																					{tech.name}
																				</span>
																			</div>
																		</div>
																		<p className="mt-0.5 text-muted-foreground text-xs">
																			{tech.description}
																		</p>
																	</div>
																</div>
																{tech.default && !isSelected && (
																	<span className="absolute top-1 right-1 ml-2 flex-shrink-0 rounded bg-muted px-1 py-0.5 text-[10px] text-muted-foreground">
																		Default
																	</span>
																)}
															</motion.div>
														</TooltipTrigger>
													</Tooltip>
												);
											})}
										</div>
									</section>
								);
							})}
							<div className="h-10" />
						</main>
					</ScrollArea>
				</div>
			</div>
		</TooltipProvider>
	);
};

export default StackBuilder;
