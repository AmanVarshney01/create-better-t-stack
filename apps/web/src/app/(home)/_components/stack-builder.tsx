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
	const [mounted, setMounted] = useState(false);
	const { theme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (mounted && icon.startsWith("/icon/")) {
		if (
			theme === "light" &&
			(icon.includes("drizzle") ||
				icon.includes("prisma") ||
				icon.includes("express"))
		) {
			icon = icon.replace(".svg", "-light.svg");
		}

		return (
			<Image
				src={icon}
				alt={`${name} icon`}
				width={20}
				height={20}
				className={cn("inline-block", className)}
				unoptimized
			/>
		);
	}

	return (
		<span className={cn("inline-flex items-center text-lg", className)}>
			{icon}
		</span>
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
			auth: "false",
			dbSetup: "none",
			examples: ["todo"],
		};

		for (const [key, value] of Object.entries(convexOverrides)) {
			const catKey = key as keyof StackState;
			if (JSON.stringify(nextStack[catKey]) !== JSON.stringify(value)) {
				const displayName = getCategoryDisplayName(catKey);
				const valueDisplay = Array.isArray(value) ? value.join(", ") : value;
				const message = `${displayName} set to '${valueDisplay}'`;

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
		const incompatibleConvexFrontends = ["nuxt", "solid"];
		const originalWebFrontendLength = nextStack.webFrontend.length;
		nextStack.webFrontend = nextStack.webFrontend.filter(
			(f) => !incompatibleConvexFrontends.includes(f),
		);
		if (nextStack.webFrontend.length !== originalWebFrontendLength) {
			changed = true;
			notes.webFrontend.notes.push(
				"Nuxt and Solid are not compatible with Convex backend and have been removed.",
			);
			notes.backend.notes.push(
				"Convex backend is not compatible with Nuxt or Solid.",
			);
			notes.webFrontend.hasIssue = true;
			notes.backend.hasIssue = true;
			changes.push({
				category: "convex",
				message: "Removed incompatible web frontends (Nuxt, Solid)",
			});
		}
		if (nextStack.nativeFrontend[0] === "none") {
		} else {
		}
	} else if (isBackendNone) {
		const noneOverrides: Partial<StackState> = {
			auth: "false",
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
				const message = `${displayName} set to '${valueDisplay}'`;

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
				message: "Runtime set to 'Bun' (None is only for Convex)",
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
					message: "Examples removed (API 'None' does not support examples)",
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
					message: "ORM set to 'None' (requires a database)",
				});
			}
			if (nextStack.auth === "true") {
				notes.database.notes.push(
					"Database 'None' selected: Auth will be disabled.",
				);
				notes.auth.notes.push(
					"Authentication requires a database. It will be disabled.",
				);
				notes.database.hasIssue = true;
				notes.auth.hasIssue = true;
				nextStack.auth = "false";
				changed = true;
				changes.push({
					category: "database",
					message: "Authentication disabled (requires a database)",
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
					message: "DB Setup set to 'None' (requires a database)",
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
					message: "ORM set to 'Prisma' (MongoDB requires Prisma or Mongoose)",
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
					message: "ORM set to 'Drizzle' (Mongoose only works with MongoDB)",
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
						message: "Database set to 'SQLite' (required by Turso)",
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
						message: "ORM set to 'Drizzle' (required by Turso)",
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
							"ORM set to 'Prisma' (MongoDB Atlas requires Prisma or Mongoose)",
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
						message: "Database set to 'PostgreSQL' (required by Neon)",
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
							"Database set to 'PostgreSQL' (required by Supabase setup)",
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
						message: "Backend set to 'Hono' (required by Cloudflare Workers)",
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
						message: "ORM set to 'Drizzle' (required by Cloudflare Workers)",
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
							"Database set to 'SQLite' (MongoDB not compatible with Workers)",
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
							"DB Setup set to 'D1' (Docker not compatible with Workers)",
					});
				}
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

			const incompatibleAddons: string[] = [];
			const isPWACompat = hasPWACompatibleFrontend(nextStack.webFrontend);
			const isTauriCompat = hasTauriCompatibleFrontend(nextStack.webFrontend);

			if (!isPWACompat && nextStack.addons.includes("pwa")) {
				incompatibleAddons.push("pwa");
				notes.webFrontend.notes.push(
					"PWA addon requires TanStack/React Router or Solid. Addon will be removed.",
				);
				notes.addons.notes.push(
					"PWA requires TanStack/React Router/Solid. It will be removed.",
				);
				notes.webFrontend.hasIssue = true;
				notes.addons.hasIssue = true;
				changes.push({
					category: "addons",
					message: "PWA addon removed (requires compatible web frontend)",
				});
			}
			if (!isTauriCompat && nextStack.addons.includes("tauri")) {
				incompatibleAddons.push("tauri");
				notes.webFrontend.notes.push(
					"Tauri addon requires TanStack/React Router, Nuxt, Svelte, Solid, or Next.js. Addon will be removed.",
				);
				notes.addons.notes.push(
					"Tauri requires TanStack/React Router/Nuxt/Svelte/Solid/Next.js. It will be removed.",
				);
				notes.webFrontend.hasIssue = true;
				notes.addons.hasIssue = true;
				changes.push({
					category: "addons",
					message: "Tauri addon removed (requires compatible web frontend)",
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
						message: "Biome addon removed (included in Ultracite)",
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
					message: "Todo example removed (requires a database)",
				});
			}
			if (nextStack.backend === "elysia" && nextStack.examples.includes("ai")) {
				incompatibleExamples.push("ai");
				changes.push({
					category: "examples",
					message: "AI example removed (not compatible with Elysia)",
				});
			}
			if (isSolid && nextStack.examples.includes("ai")) {
				incompatibleExamples.push("ai");
				changes.push({
					category: "examples",
					message: "AI example removed (not compatible with Solid)",
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
			message: "Web deployment set to 'none' (requires web frontend)",
		});
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
	const flags: string[] = ["--yes"];

	const checkDefault = <K extends keyof StackState>(
		key: K,
		value: StackState[K],
	) => isStackDefault(stackState, key, value);

	const combinedFrontends = [
		...stackState.webFrontend,
		...stackState.nativeFrontend,
	].filter((v, _, arr) => v !== "none" || arr.length === 1);

	if (
		!checkDefault("webFrontend", stackState.webFrontend) ||
		!checkDefault("nativeFrontend", stackState.nativeFrontend)
	) {
		if (combinedFrontends.length === 0 || combinedFrontends[0] === "none") {
			flags.push("--frontend none");
		} else {
			flags.push(`--frontend ${combinedFrontends.join(" ")}`);
		}
	}

	if (!checkDefault("backend", stackState.backend)) {
		flags.push(`--backend ${stackState.backend}`);
	}

	if (stackState.backend !== "convex") {
		if (!checkDefault("runtime", stackState.runtime)) {
			flags.push(`--runtime ${stackState.runtime}`);
		}
		if (!checkDefault("api", stackState.api)) {
			flags.push(`--api ${stackState.api}`);
		}

		const requiresExplicitDatabase = [
			"d1",
			"turso",
			"neon",
			"supabase",
			"prisma-postgres",
			"mongodb-atlas",
			"docker",
		].includes(stackState.dbSetup);

		if (
			!checkDefault("database", stackState.database) ||
			requiresExplicitDatabase
		) {
			flags.push(`--database ${stackState.database}`);
		}
		if (!checkDefault("orm", stackState.orm)) {
			flags.push(`--orm ${stackState.orm}`);
		}
		if (!checkDefault("auth", stackState.auth)) {
			if (stackState.auth === "false" && DEFAULT_STACK.auth === "true") {
				flags.push("--no-auth");
			}
		}
		if (!checkDefault("dbSetup", stackState.dbSetup)) {
			flags.push(`--db-setup ${stackState.dbSetup}`);
		}
	} else {
	}

	if (!checkDefault("packageManager", stackState.packageManager)) {
		flags.push(`--package-manager ${stackState.packageManager}`);
	}

	if (!checkDefault("git", stackState.git)) {
		if (stackState.git === "false" && DEFAULT_STACK.git === "true") {
			flags.push("--no-git");
		}
	}

	if (
		stackState.webDeploy &&
		!checkDefault("webDeploy", stackState.webDeploy)
	) {
		flags.push(`--web-deploy ${stackState.webDeploy}`);
	}

	if (!checkDefault("install", stackState.install)) {
		if (stackState.install === "false" && DEFAULT_STACK.install === "true") {
			flags.push("--no-install");
		}
	}

	if (!checkDefault("addons", stackState.addons)) {
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
				].includes(addon),
			);
			if (validAddons.length > 0) {
				flags.push(`--addons ${validAddons.join(" ")}`);
			} else {
				if (DEFAULT_STACK.addons.length > 0) {
					flags.push("--addons none");
				}
			}
		} else {
			if (DEFAULT_STACK.addons.length > 0) {
				flags.push("--addons none");
			}
		}
	}

	if (!checkDefault("examples", stackState.examples)) {
		if (stackState.examples.length > 0) {
			flags.push(`--examples ${stackState.examples.join(" ")}`);
		} else {
			if (DEFAULT_STACK.examples.length > 0) {
				flags.push("--examples none");
			}
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
				const currentValues: string[] = [];
				randomStack[
					catKey as "webFrontend" | "nativeFrontend" | "addons" | "examples"
				] = currentValues;

				if (catKey === "webFrontend" || catKey === "nativeFrontend") {
					const randomIndex = Math.floor(Math.random() * options.length);
					const selectedOption = options[randomIndex].id;
					currentValues.push(selectedOption);
					if (selectedOption === "none" && currentValues.length > 1) {
						randomStack[catKey] = ["none"];
					} else if (selectedOption !== "none") {
						randomStack[catKey] = currentValues.filter((id) => id !== "none");
					}
				} else {
					const numToPick = Math.floor(
						Math.random() * Math.min(options.length + 1, 4),
					);
					const shuffledOptions = [...options].sort(() => 0.5 - Math.random());
					for (let i = 0; i < numToPick; i++) {
						currentValues.push(shuffledOptions[i].id);
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
										className={
											tech.icon.startsWith("/icon/")
												? "h-3 w-3"
												: "h-3 w-3 text-xs"
										}
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
						{tech.icon !== "" && (
							<TechIcon icon={tech.icon} name={tech.name} className="h-3 w-3" />
						)}
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
			setStack(compatibilityAnalysis.adjustedStack);
		}
	}, [
		compatibilityAnalysis.adjustedStack,
		setStack,
		compatibilityAnalysis.changes,
	]);

	useEffect(() => {
		const cmd = generateCommand(stack);
		setCommand(cmd);
	}, [stack]);

	useEffect(() => {
		setProjectNameError(validateProjectName(stack.projectName || ""));
	}, [stack.projectName]);

	const handleTechSelect = (
		category: keyof typeof TECH_OPTIONS,
		techId: string,
	) => {
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
						(category === "git" ||
							category === "install" ||
							category === "auth") &&
						techId === "false"
					) {
						update[catKey] = "true";
					} else if (
						(category === "git" ||
							category === "install" ||
							category === "auth") &&
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
						<div className="grid h-full grid-rows-[auto_1fr] justify-between p-3 sm:p-4 md:h-[calc(100vh-64px)]">
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

								const filteredOptions = categoryOptions.filter(() => {
									return true;
								});

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
