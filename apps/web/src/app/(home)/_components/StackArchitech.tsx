"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	DEFAULT_STACK,
	PRESET_TEMPLATES,
	type StackState,
	TECH_OPTIONS,
} from "@/lib/constant";
import { stackParsers, stackQueryStatesOptions } from "@/lib/stack-url-state";
import { cn } from "@/lib/utils";
import {
	Check,
	Circle,
	CircleCheck,
	ClipboardCopy,
	Github,
	HelpCircle,
	InfoIcon,
	RefreshCw,
	Settings,
	Star,
	Terminal,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useQueryStates } from "nuqs";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

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
	"frontend",
	"backend",
	"runtime",
	"api",
	"database",
	"orm",
	"dbSetup",
	"auth",
	"packageManager",
	"addons",
	"examples",
	"git",
	"install",
];

const hasWebFrontend = (frontend: string[]) =>
	frontend.some((f) =>
		[
			"tanstack-router",
			"react-router",
			"tanstack-start",
			"next",
			"nuxt",
			"svelte",
		].includes(f),
	);

const hasNativeFrontend = (frontend: string[]) => frontend.includes("native");

const hasPWACompatibleFrontend = (frontend: string[]) =>
	frontend.some((f) => ["tanstack-router", "react-router"].includes(f));

const hasTauriCompatibleFrontend = (frontend: string[]) =>
	frontend.some((f) =>
		["tanstack-router", "react-router", "nuxt", "svelte"].includes(f),
	);

const getBadgeColors = (category: string): string => {
	switch (category) {
		case "frontend":
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
		case "install":
			return "border-gray-300 bg-gray-100 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400";
		default:
			return "border-gray-300 bg-gray-100 text-gray-800 dark:border-gray-700/30 dark:bg-gray-900/30 dark:text-gray-300";
	}
};

const TechIcon: React.FC<{
	icon: string;
	name: string;
	className?: string;
}> = ({ icon, name, className }) => {
	if (icon.startsWith("/icon/")) {
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
};

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
		if (nextStack.api === "none") {
			notes.api.notes.push(
				"API 'None' is only for Convex. Defaulting to 'tRPC'.",
			);
			notes.api.hasIssue = true;
			nextStack.api = DEFAULT_STACK.api;
			changed = true;
			changes.push({
				category: "api",
				message: "API set to 'tRPC' (None is only for Convex)",
			});
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
					"Relational databases are not compatible with Mongoose ORM",
				);
				notes.orm.notes.push(
					"Relational databases are not compatible with Mongoose ORM",
				);
				notes.database.hasIssue = true;
				notes.orm.hasIssue = true;
				nextStack.orm = "prisma";
				changed = true;
				changes.push({
					category: "database",
					message: "ORM set to 'Prisma' (Mongoose only works with MongoDB)",
				});
			}
			if (nextStack.dbSetup === "mongodb-atlas") {
				notes.database.notes.push(
					"Relational databases are not compatible with MongoDB Atlas setup. DB Setup will be reset.",
				);
				notes.dbSetup.notes.push(
					"MongoDB Atlas setup requires MongoDB. It will be reset to 'Basic Setup'.",
				);
				notes.database.hasIssue = true;
				notes.dbSetup.hasIssue = true;
				nextStack.dbSetup = "none";
				changed = true;
				changes.push({
					category: "database",
					message: "DB Setup reset to 'None' (MongoDB Atlas requires MongoDB)",
				});
			}
		}

		if (nextStack.dbSetup === "turso") {
			if (nextStack.database !== "sqlite") {
				notes.dbSetup.notes.push("Turso requires SQLite. It will be selected.");
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
			if (nextStack.orm !== "prisma") {
				notes.dbSetup.notes.push("Requires Prisma ORM. It will be selected.");
				notes.orm.notes.push(
					"Prisma PostgreSQL setup requires Prisma ORM. It will be selected.",
				);
				notes.dbSetup.hasIssue = true;
				notes.orm.hasIssue = true;
				nextStack.orm = "prisma";
				changed = true;
				changes.push({
					category: "dbSetup",
					message: "ORM set to 'Prisma' (required by Prisma PostgreSQL setup)",
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
		}

		const isNuxt = nextStack.frontend.includes("nuxt");
		const isSvelte = nextStack.frontend.includes("svelte");
		if ((isNuxt || isSvelte) && nextStack.api === "trpc") {
			const frontendName = isNuxt ? "Nuxt" : "Svelte";
			notes.api.notes.push(
				`${frontendName} requires oRPC. It will be selected automatically.`,
			);
			notes.frontend.notes.push(
				`Selected ${frontendName}: API will be set to oRPC.`,
			);
			notes.api.hasIssue = true;
			notes.frontend.hasIssue = true;
			nextStack.api = "orpc";
			changed = true;
			changes.push({
				category: "api",
				message: `API set to 'oRPC' (required by ${frontendName})`,
			});
		}

		const incompatibleAddons: string[] = [];
		const isPWACompat = hasPWACompatibleFrontend(nextStack.frontend);
		const isTauriCompat = hasTauriCompatibleFrontend(nextStack.frontend);

		if (!isPWACompat && nextStack.addons.includes("pwa")) {
			incompatibleAddons.push("pwa");
			notes.frontend.notes.push(
				"PWA addon requires TanStack or React Router. Addon will be removed.",
			);
			notes.addons.notes.push(
				"PWA requires TanStack/React Router. It will be removed.",
			);
			notes.frontend.hasIssue = true;
			notes.addons.hasIssue = true;
			changes.push({
				category: "addons",
				message: "PWA addon removed (requires TanStack or React Router)",
			});
		}
		if (!isTauriCompat && nextStack.addons.includes("tauri")) {
			incompatibleAddons.push("tauri");
			notes.frontend.notes.push(
				"Tauri addon requires TanStack Router, React Router, Nuxt or Svelte. Addon will be removed.",
			);
			notes.addons.notes.push(
				"Tauri requires TanStack/React Router/Nuxt/Svelte. It will be removed.",
			);
			notes.frontend.hasIssue = true;
			notes.addons.hasIssue = true;
			changes.push({
				category: "addons",
				message: "Tauri addon removed (requires compatible frontend)",
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
			!nextStack.addons.includes("biome")
		) {
			notes.addons.notes.push(
				"Husky addon is selected without Biome. Consider adding Biome for lint-staged integration.",
			);
		}

		const incompatibleExamples: string[] = [];
		const isWeb = hasWebFrontend(nextStack.frontend);
		const isNativeOnly =
			hasNativeFrontend(nextStack.frontend) && !isWeb && !isConvex;

		if (isNativeOnly) {
			if (nextStack.examples.length > 0) {
				notes.frontend.notes.push(
					"Examples are not supported with Native-only frontend. Examples will be removed.",
				);
				notes.examples.notes.push(
					"Examples require a web frontend or Convex backend. They will be removed.",
				);
				notes.frontend.hasIssue = true;
				notes.examples.hasIssue = true;
				incompatibleExamples.push(...nextStack.examples);
				changes.push({
					category: "examples",
					message: "Examples removed (not supported with Native-only frontend)",
				});
			}
		} else {
			if (!isWeb) {
				if (nextStack.examples.includes("todo")) {
					incompatibleExamples.push("todo");
					changes.push({
						category: "examples",
						message: "Todo example removed (requires web frontend)",
					});
				}
				if (nextStack.examples.includes("ai")) {
					incompatibleExamples.push("ai");
					changes.push({
						category: "examples",
						message: "AI example removed (requires web frontend)",
					});
				}
			}
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
		}

		const uniqueIncompatibleExamples = [...new Set(incompatibleExamples)];
		if (uniqueIncompatibleExamples.length > 0) {
			if (
				!isWeb &&
				(uniqueIncompatibleExamples.includes("todo") ||
					uniqueIncompatibleExamples.includes("ai"))
			) {
				notes.frontend.notes.push(
					"Examples require a web frontend. Incompatible examples will be removed.",
				);
				notes.examples.notes.push(
					"Requires a web frontend. Incompatible examples will be removed.",
				);
				notes.frontend.hasIssue = true;
				notes.examples.hasIssue = true;
			}
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

			const originalExamplesLength = nextStack.examples.length;
			nextStack.examples = nextStack.examples.filter(
				(ex) => !uniqueIncompatibleExamples.includes(ex),
			);
			if (nextStack.examples.length !== originalExamplesLength) changed = true;
		}
	}

	return {
		adjustedStack: changed ? nextStack : null,
		notes,
		changes,
	};
};

const getCompatibilityRules = (stack: StackState) => {
	const isConvex = stack.backend === "convex";
	const hasWebFrontendSelected = hasWebFrontend(stack.frontend);
	const hasNativeOnly =
		hasNativeFrontend(stack.frontend) && !hasWebFrontendSelected;

	return {
		isConvex,
		hasWebFrontend: hasWebFrontendSelected,
		hasNativeFrontend: hasNativeFrontend(stack.frontend),
		hasNativeOnly,
		hasPWACompatible: hasPWACompatibleFrontend(stack.frontend),
		hasTauriCompatible: hasTauriCompatibleFrontend(stack.frontend),
		hasNuxtOrSvelte:
			stack.frontend.includes("nuxt") || stack.frontend.includes("svelte"),
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

	const isDefault = <K extends keyof StackState>(
		key: K,
		value: StackState[K],
	) => {
		const defaultValue = DEFAULT_STACK[key];

		if (stackState.backend === "convex") {
			if (key === "runtime" && value === "none") return true;
			if (key === "database" && value === "none") return true;
			if (key === "orm" && value === "none") return true;
			if (key === "api" && value === "none") return true;
			if (key === "auth" && value === "false") return true;
			if (key === "dbSetup" && value === "none") return true;
			if (
				key === "examples" &&
				Array.isArray(value) &&
				value.length === 1 &&
				value[0] === "todo"
			)
				return true;
		}

		if (Array.isArray(defaultValue) && Array.isArray(value)) {
			const sortedDefault = [...defaultValue].sort();
			const sortedValue = [...value].sort();
			return (
				sortedDefault.length === sortedValue.length &&
				sortedDefault.every((item, index) => item === sortedValue[index])
			);
		}
		return defaultValue === value;
	};

	if (!isDefault("frontend", stackState.frontend)) {
		if (stackState.frontend.length === 0 || stackState.frontend[0] === "none") {
			flags.push("--frontend none");
		} else {
			flags.push(`--frontend ${stackState.frontend.join(" ")}`);
		}
	}

	if (!isDefault("backend", stackState.backend)) {
		flags.push(`--backend ${stackState.backend}`);
	}

	if (stackState.backend !== "convex") {
		if (!isDefault("runtime", stackState.runtime)) {
			flags.push(`--runtime ${stackState.runtime}`);
		}
		if (!isDefault("api", stackState.api)) {
			flags.push(`--api ${stackState.api}`);
		}
		if (!isDefault("database", stackState.database)) {
			flags.push(`--database ${stackState.database}`);
		}
		if (!isDefault("orm", stackState.orm)) {
			flags.push(`--orm ${stackState.orm}`);
		}
		if (!isDefault("auth", stackState.auth)) {
			if (stackState.auth === "false" && DEFAULT_STACK.auth === "true") {
				flags.push("--no-auth");
			}
		}
		if (!isDefault("dbSetup", stackState.dbSetup)) {
			flags.push(`--db-setup ${stackState.dbSetup}`);
		}
	} else {
		if (stackState.auth === "false" && DEFAULT_STACK.auth === "true") {
			if (DEFAULT_STACK.auth === "true") {
			}
		}
	}

	if (!isDefault("packageManager", stackState.packageManager)) {
		flags.push(`--package-manager ${stackState.packageManager}`);
	}

	if (!isDefault("git", stackState.git)) {
		if (stackState.git === "false") flags.push("--no-git");
	}

	if (!isDefault("install", stackState.install)) {
		if (stackState.install === "false") flags.push("--no-install");
	}

	if (!isDefault("addons", stackState.addons)) {
		if (stackState.addons.length > 0) {
			flags.push(`--addons ${stackState.addons.join(" ")}`);
		} else {
			if (DEFAULT_STACK.addons.length > 0) {
				flags.push("--addons none");
			}
		}
	}

	if (!isDefault("examples", stackState.examples)) {
		if (stackState.examples.length > 0) {
			flags.push(`--examples ${stackState.examples.join(" ")}`);
		} else {
			if (DEFAULT_STACK.examples.length > 0) {
				flags.push("--examples none");
			}
		}
	}

	if (flags.length === 1 && flags[0] === "--yes") {
		flags.pop();
	}

	return `${base} ${projectName}${
		flags.length > 0 ? ` ${flags.join(" ")}` : ""
	}`;
};

const StackArchitect = () => {
	const [stack, setStack] = useQueryStates(
		stackParsers,
		stackQueryStatesOptions,
	);

	const [command, setCommand] = useState("");
	const [copied, setCopied] = useState(false);
	const [projectNameError, setProjectNameError] = useState<string | undefined>(
		undefined,
	);
	const [showPresets, setShowPresets] = useState(false);
	const [showHelp, setShowHelp] = useState(false);
	const [lastSavedStack, setLastSavedStack] = useState<StackState | null>(null);
	const [activeCategory, setActiveCategory] = useState<string | null>(
		CATEGORY_ORDER[0],
	);
	const [, setLastChanges] = useState<
		Array<{ category: string; message: string }>
	>([]);

	const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
	const contentRef = useRef<HTMLDivElement>(null);

	const compatibilityAnalysis = useMemo(
		() => analyzeStackCompatibility(stack),
		[stack],
	);

	const rules = useMemo(() => getCompatibilityRules(stack), [stack]);

	const disabledReasons = useMemo(() => {
		const reasons = new Map<string, string>();

		const addRule = (category: string, techId: string, reason: string) => {
			reasons.set(`${category}-${techId}`, reason);
		};

		for (const category of CATEGORY_ORDER) {
			const options = TECH_OPTIONS[category] || [];
			const catKey = category as keyof StackState;

			for (const tech of options) {
				const techId = tech.id;

				if (rules.isConvex) {
					if (
						["runtime", "database", "orm", "api", "auth", "dbSetup"].includes(
							catKey,
						)
					) {
						const convexDefaults: Record<string, string> = {
							runtime: "none",
							database: "none",
							orm: "none",
							api: "none",
							auth: "false",
							dbSetup: "none",
						};

						const requiredValue = convexDefaults[catKey as string];
						if (techId !== requiredValue && techId !== "none") {
							addRule(
								category,
								techId,
								`Convex backend requires ${getCategoryDisplayName(catKey)} to be '${requiredValue}'.`,
							);
						}
					}

					if (catKey === "examples" && techId !== "todo") {
						addRule(
							category,
							techId,
							"Convex backend only supports the 'Todo' example.",
						);
					}
					continue;
				}

				if (catKey === "runtime" && techId === "none") {
					addRule(
						category,
						techId,
						"Runtime 'None' is only available with the Convex backend.",
					);
				}

				if (catKey === "api") {
					if (techId === "none") {
						addRule(
							category,
							techId,
							"API 'None' is only available with the Convex backend.",
						);
					}

					if (techId === "trpc" && rules.hasNuxtOrSvelte) {
						const frontendName = stack.frontend.includes("nuxt")
							? "Nuxt"
							: "Svelte";
						addRule(
							category,
							techId,
							`tRPC is not supported with ${frontendName}. Use oRPC instead.`,
						);
					}
				}

				if (catKey === "orm") {
					if (stack.database === "none" && techId !== "none") {
						addRule(
							category,
							techId,
							"Select a database to enable ORM options.",
						);
					}

					if (
						stack.database === "mongodb" &&
						techId !== "prisma" &&
						techId !== "mongoose" &&
						techId !== "none"
					) {
						addRule(
							category,
							techId,
							"MongoDB requires the Prisma or Mongoose ORM.",
						);
					}

					if (
						stack.dbSetup === "turso" &&
						techId !== "drizzle" &&
						techId !== "none"
					) {
						addRule(
							category,
							techId,
							"Turso DB setup requires the Drizzle ORM.",
						);
					}

					if (
						stack.dbSetup === "prisma-postgres" &&
						techId !== "prisma" &&
						techId !== "none"
					) {
						addRule(
							category,
							techId,
							"Prisma PostgreSQL setup requires Prisma ORM.",
						);
					}

					if (
						stack.dbSetup === "mongodb-atlas" &&
						techId !== "prisma" &&
						techId !== "mongoose" &&
						techId !== "none"
					) {
						addRule(
							category,
							techId,
							"MongoDB Atlas setup requires Prisma or Mongoose ORM.",
						);
					}

					if (techId === "none") {
						if (stack.database === "mongodb") {
							addRule(
								category,
								techId,
								"MongoDB requires Prisma or Mongoose ORM.",
							);
						}
						if (stack.dbSetup === "turso") {
							addRule(category, techId, "Turso DB setup requires Drizzle ORM.");
						}
						if (stack.dbSetup === "prisma-postgres") {
							addRule(category, techId, "This DB setup requires Prisma ORM.");
						}
					}

					if (techId === "mongoose" && stack.database !== "mongodb") {
						addRule(
							category,
							techId,
							"Mongoose ORM is not compatible with relational databases.",
						);
					}
				}

				if (catKey === "dbSetup" && techId !== "none") {
					if (stack.database === "none") {
						addRule(
							category,
							techId,
							"Select a database before choosing a cloud setup.",
						);
					}

					if (techId === "turso") {
						if (stack.database !== "sqlite" && stack.database !== "none") {
							addRule(category, techId, "Turso requires SQLite database.");
						}
						if (stack.orm !== "drizzle" && stack.orm !== "none") {
							addRule(category, techId, "Turso requires Drizzle ORM.");
						}
					} else if (techId === "prisma-postgres") {
						if (stack.database !== "postgres" && stack.database !== "none") {
							addRule(category, techId, "Requires PostgreSQL database.");
						}
						if (stack.orm !== "prisma" && stack.orm !== "none") {
							addRule(category, techId, "Requires Prisma ORM.");
						}
					} else if (techId === "mongodb-atlas") {
						if (stack.database !== "mongodb" && stack.database !== "none") {
							addRule(category, techId, "Requires MongoDB database.");
						}
						if (
							stack.orm !== "prisma" &&
							stack.orm !== "mongoose" &&
							stack.orm !== "none"
						) {
							addRule(category, techId, "Requires Prisma or Mongoose ORM.");
						}
					} else if (techId === "neon") {
						if (stack.database !== "postgres" && stack.database !== "none") {
							addRule(category, techId, "Requires PostgreSQL database.");
						}
					}
				}

				if (
					catKey === "auth" &&
					techId === "true" &&
					stack.database === "none"
				) {
					addRule(category, techId, "Authentication requires a database.");
				}

				if (catKey === "addons") {
					if (techId === "pwa" && !rules.hasPWACompatible) {
						addRule(
							category,
							techId,
							"Requires TanStack Router or React Router frontend.",
						);
					}

					if (techId === "tauri" && !rules.hasTauriCompatible) {
						addRule(
							category,
							techId,
							"Requires TanStack Router, React Router, Nuxt or Svelte frontend.",
						);
					}
				}

				if (catKey === "examples") {
					if (rules.hasNativeOnly) {
						addRule(
							category,
							techId,
							"Examples are not supported with Native-only frontend.",
						);
					} else {
						if (
							(techId === "todo" || techId === "ai") &&
							!rules.hasWebFrontend
						) {
							addRule(
								category,
								techId,
								"Requires a web frontend (TanStack Router, React Router, etc.).",
							);
						}

						if (techId === "todo" && stack.database === "none") {
							addRule(category, techId, "Todo example requires a database.");
						}

						if (techId === "ai" && stack.backend === "elysia") {
							addRule(
								category,
								techId,
								"AI example is not compatible with Elysia backend.",
							);
						}
					}
				}
			}
		}

		return reasons;
	}, [stack, rules]);

	const selectedBadges = (() => {
		const badges: React.ReactNode[] = [];
		// biome-ignore lint/complexity/noForEach: <explanation>
		CATEGORY_ORDER.forEach((category) => {
			const categoryKey = category as keyof StackState;
			const options = TECH_OPTIONS[category as keyof typeof TECH_OPTIONS];
			const selectedValue = stack[categoryKey];

			if (!options) return;

			if (Array.isArray(selectedValue)) {
				if (selectedValue.length === 0 || selectedValue[0] === "none") return;

				// biome-ignore lint/complexity/noForEach: <explanation>
				selectedValue
					.map((id) => options.find((opt) => opt.id === id))
					.filter((tech): tech is NonNullable<typeof tech> => Boolean(tech))
					.forEach((tech) => {
						badges.push(
							<span
								key={`${category}-${tech.id}`}
								className={cn(
									"inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs",
									getBadgeColors(category),
								)}
							>
								<TechIcon
									icon={tech.icon}
									name={tech.name}
									className={
										tech.icon.startsWith("/icon/")
											? "h-3 w-3"
											: "h-3 w-3 text-xs"
									}
								/>
								{tech.name}
							</span>,
						);
					});
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
					return;
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
		});
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (compatibilityAnalysis.adjustedStack) {
			setLastChanges(compatibilityAnalysis.changes);
			setStack(compatibilityAnalysis.adjustedStack);
		}
	}, [compatibilityAnalysis.adjustedStack, setStack]);

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
				catKey === "frontend" ||
				catKey === "addons" ||
				catKey === "examples"
			) {
				const currentArray = [...(currentValue as string[])];
				let nextArray = [...currentArray];
				const isSelected = currentArray.includes(techId);

				if (catKey === "frontend") {
					const webTypes = [
						"tanstack-router",
						"react-router",
						"tanstack-start",
						"next",
						"nuxt",
						"svelte",
					];
					if (techId === "none") {
						nextArray = ["none"];
					} else if (isSelected) {
						if (currentArray.length > 1 || currentArray.includes("none")) {
							nextArray = nextArray.filter((id) => id !== techId);
							if (nextArray.length === 0 && !currentArray.includes("none")) {
								nextArray = ["none"];
							}
						}
					} else {
						nextArray = nextArray.filter((id) => id !== "none");
						if (webTypes.includes(techId)) {
							nextArray = nextArray.filter((id) => !webTypes.includes(id));
						}
						nextArray.push(techId);
					}
					if (nextArray.length > 1) {
						nextArray = nextArray.filter((id) => id !== "none");
					}
					if (nextArray.length === 0) {
						nextArray = ["none"];
					}
				} else {
					if (isSelected) {
						nextArray = nextArray.filter((id) => id !== techId);
					} else {
						nextArray.push(techId);
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
		setShowHelp(false);
		setShowPresets(false);
		setActiveCategory(CATEGORY_ORDER[0]);
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
			setShowHelp(false);
			setShowPresets(false);
			setActiveCategory(CATEGORY_ORDER[0]);
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
			setShowPresets(false);
			setShowHelp(false);
			setActiveCategory(CATEGORY_ORDER[0]);
			contentRef.current?.scrollTo(0, 0);
			toast.success(`Applied preset: ${preset.name}`);
		}
	};

	const handleSidebarClick = (category: string) => {
		setActiveCategory(category);
		const element = sectionRefs.current[category];
		if (element) {
			element.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}
	};

	return (
		<TooltipProvider>
			<div
				className={cn(
					"flex h-screen flex-col overflow-hidden border-border bg-background text-foreground",
				)}
			>
				<div
					className={cn(
						"grid w-full flex-shrink-0 grid-cols-2 items-center justify-center border-border border-b bg-background px-2 py-2 sm:grid-cols-3 sm:px-4",
					)}
				>
					<Link href={"/"}>
						<div className="mr-auto font-mono text-muted-foreground text-xs">
							Home
						</div>
					</Link>
					<div className="mx-auto hidden font-mono text-muted-foreground text-xs sm:block">
						Create Better T Stack
					</div>
					<div className="ml-auto flex space-x-2">
						<button
							type="button"
							onClick={() => setShowHelp((prev) => !prev)}
							className={cn(
								"text-muted-foreground transition-colors hover:text-foreground",
							)}
							title="Help"
						>
							<HelpCircle className="h-4 w-4" />
						</button>
						<button
							type="button"
							onClick={() => setShowPresets((prev) => !prev)}
							className={cn(
								"text-muted-foreground transition-colors hover:text-foreground",
							)}
							title="Presets"
						>
							<Star className="h-4 w-4" />
						</button>
						<Link
							href={"https://github.com/AmanVarshney01/create-better-t-stack"}
							target="_blank"
							rel="noopener noreferrer"
							className={cn(
								"text-muted-foreground transition-colors hover:text-foreground",
							)}
							title="GitHub Repository"
						>
							<Github className="h-4 w-4" />
						</Link>
						<ThemeToggle />
					</div>
				</div>

				{showHelp && (
					<div className="flex-shrink-0 border-border border-b bg-background p-3 text-foreground sm:p-4">
						<h3 className="mb-2 font-medium text-sm">
							How to Use Stack Architect
						</h3>
						<ul className="list-disc space-y-1 pl-5 text-xs">
							<li>
								Use the sidebar to navigate between configuration sections.
							</li>
							<li>Select your preferred technologies in the main area.</li>
							<li>
								Some selections may disable or automatically change other
								options based on compatibility (check notes{" "}
								<InfoIcon className="inline h-3 w-3" /> within each section!).
							</li>
							<li>
								The command below updates automatically based on your
								selections.
							</li>
							<li>
								Click the copy button (
								<ClipboardCopy className="inline h-3 w-3" />) next to the
								command to copy it.
							</li>
							<li>
								Use presets (<Star className="inline h-3 w-3" />) for quick
								setup or reset (<RefreshCw className="inline h-3 w-3" />) to
								defaults.
							</li>
							<li>
								Save (<Star className="inline h-3 w-3" />) your preferences to
								load (<Settings className="inline h-3 w-3" />) them later.
							</li>
						</ul>
					</div>
				)}

				{showPresets && (
					<div className="flex-shrink-0 border-border border-b bg-background p-3 sm:p-4">
						<h3 className="mb-2 font-medium text-foreground text-sm">
							Quick Start Presets
						</h3>
						<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
							{PRESET_TEMPLATES.map((preset) => (
								<button
									type="button"
									key={preset.id}
									onClick={() => applyPreset(preset.id)}
									className="rounded border border-border bg-background p-2 text-left transition-colors hover:bg-muted"
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
				)}

				<div className="flex-shrink-0 bg-background p-3 pb-0 font-mono sm:p-4 sm:pb-0">
					<div className="mb-3 flex flex-col justify-between gap-y-3 sm:flex-row sm:items-start">
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
									"w-full rounded border bg-background px-2 py-1 font-mono text-sm focus:outline-none sm:w-auto",
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
						<div className="flex flex-wrap gap-2">
							<button
								type="button"
								onClick={resetStack}
								className="flex items-center gap-1 rounded border border-border bg-background px-2 py-1 text-muted-foreground text-xs transition-colors hover:bg-muted"
								title="Reset to defaults"
							>
								<RefreshCw className="h-3 w-3" />
								Reset
							</button>
							{lastSavedStack && (
								<button
									type="button"
									onClick={loadSavedStack}
									className="flex items-center gap-1 rounded border border-border bg-background px-2 py-1 text-muted-foreground text-xs transition-colors hover:bg-muted"
									title="Load saved preferences"
								>
									<Settings className="h-3 w-3" />
									Load Saved
								</button>
							)}
							<button
								id="save-stack-button"
								type="button"
								onClick={saveCurrentStack}
								className="flex items-center gap-1 rounded border border-chart-4 bg-chart-4/10 px-2 py-1 text-chart-4 text-xs transition-colors hover:bg-chart-4/20"
								title="Save current preferences"
							>
								<Star className="h-3 w-3" />
								<span>Save</span>
							</button>
						</div>
					</div>

					<div className="relative mb-4 overflow-hidden rounded border border-border bg-background p-2 pr-16 sm:pr-20">
						<div className="flex overflow-x-auto">
							<span className="mr-2 select-none text-chart-4">$</span>
							<code className="no-scrollbar inline-flex items-center overflow-x-auto whitespace-pre break-words text-muted-foreground text-xs sm:text-sm">
								{command}
							</code>
						</div>
						<button
							type="button"
							onClick={copyToClipboard}
							className={cn(
								"-translate-y-1/2 absolute top-1/2 right-1 flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors",
								copied
									? "bg-muted text-chart-4"
									: "text-muted-foreground hover:bg-muted hover:text-foreground",
							)}
							title={copied ? "Copied!" : "Copy command"}
						>
							{copied ? (
								<>
									<Check className="h-3 w-3 flex-shrink-0" />
									<span>Copied</span>
								</>
							) : (
								<>
									<ClipboardCopy className="h-3 w-3 flex-shrink-0" />
									<span>Copy</span>
								</>
							)}
						</button>
					</div>

					<div className="mb-4">
						<div className="flex flex-wrap gap-1.5">{selectedBadges}</div>
					</div>
				</div>

				<div className="flex flex-grow overflow-hidden">
					<nav className="hidden w-48 flex-shrink-0 overflow-y-auto border-border border-r p-2 md:flex">
						<ul className="space-y-1">
							{CATEGORY_ORDER.map((category) => (
								<li key={category}>
									<button
										type="button"
										onClick={() => handleSidebarClick(category)}
										className={cn(
											"flex w-full items-center justify-between rounded px-2 py-1.5 text-left font-mono text-xs transition-colors",
											activeCategory === category
												? "bg-primary/10 text-primary"
												: "text-muted-foreground hover:bg-muted/50",
										)}
									>
										<span>{getCategoryDisplayName(category)}</span>
										{compatibilityAnalysis.notes[category]?.hasIssue && (
											<span title="Compatibility issue affects this section">
												<InfoIcon className="h-3 w-3 flex-shrink-0 text-chart-5" />{" "}
											</span>
										)}
									</button>
								</li>
							))}
						</ul>
					</nav>

					<ScrollArea ref={contentRef} className="flex-1 scroll-smooth">
						<main className="flex-grow p-4">
							{CATEGORY_ORDER.map((categoryKey) => {
								const categoryOptions =
									TECH_OPTIONS[categoryKey as keyof typeof TECH_OPTIONS] || [];
								const categoryDisplayName = getCategoryDisplayName(categoryKey);

								const filteredOptions = categoryOptions.filter((tech) => {
									if (
										rules.isConvex &&
										tech.id === "none" &&
										["runtime", "database", "orm", "api", "dbSetup"].includes(
											categoryKey,
										)
									) {
										return false;
									}
									if (
										rules.isConvex &&
										categoryKey === "auth" &&
										tech.id === "false"
									) {
										return false;
									}
									if (
										rules.isConvex &&
										categoryKey === "examples" &&
										tech.id !== "todo"
									) {
										return false;
									}
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
										className="mb-8 scroll-mt-4"
									>
										<div className="mb-3 flex items-center border-border border-b pb-2 text-muted-foreground">
											<Terminal className="mr-2 h-5 w-5 flex-shrink-0" />
											<h2 className="font-semibold text-base text-foreground">
												{categoryDisplayName}
											</h2>
											{compatibilityAnalysis.notes[categoryKey]?.notes.length >
												0 && (
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

										<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
											{filteredOptions.map((tech) => {
												let isSelected = false;
												const category = categoryKey as keyof StackState;

												if (
													category === "addons" ||
													category === "examples" ||
													category === "frontend"
												) {
													isSelected = (
														(stack[category] as string[]) || []
													).includes(tech.id);
												} else {
													isSelected = stack[category] === tech.id;
												}

												const disabledReason = disabledReasons.get(
													`${categoryKey}-${tech.id}`,
												);
												const isDisabled = !!disabledReason;

												return (
													<Tooltip key={tech.id} delayDuration={100}>
														<TooltipTrigger asChild>
															<motion.div
																className={cn(
																	"relative rounded border p-3 transition-all",
																	isDisabled && !isSelected
																		? "cursor-not-allowed opacity-60"
																		: "cursor-pointer",
																	isSelected
																		? "border-primary bg-primary/10 ring-1 ring-primary"
																		: `border-border ${
																				!isDisabled
																					? "hover:border-muted hover:bg-muted"
																					: ""
																			}`,
																)}
																whileHover={
																	!isDisabled ? { scale: 1.02 } : undefined
																}
																whileTap={
																	!isDisabled ? { scale: 0.98 } : undefined
																}
																onClick={() =>
																	!isDisabled &&
																	handleTechSelect(
																		categoryKey as keyof typeof TECH_OPTIONS,
																		tech.id,
																	)
																}
															>
																<div className="flex items-start">
																	<div className="mt-1 mr-3 flex-shrink-0">
																		{isSelected ? (
																			<CircleCheck className="h-5 w-5 text-primary" />
																		) : (
																			<Circle className="h-5 w-5 text-muted-foreground" />
																		)}
																	</div>
																	<div className="flex-grow">
																		<div className="flex items-center justify-between">
																			<div className="flex items-center">
																				<TechIcon
																					icon={tech.icon}
																					name={tech.name}
																					className="mr-2 h-5 w-5"
																				/>
																				<span
																					className={cn(
																						"font-medium text-sm",
																						isSelected
																							? "text-primary"
																							: "text-foreground",
																					)}
																				>
																					{tech.name}
																				</span>
																			</div>
																			{isDisabled && !isSelected && (
																				<InfoIcon className="ml-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
																			)}
																		</div>
																		<p className="mt-1 text-muted-foreground text-xs">
																			{tech.description}
																		</p>
																	</div>
																</div>
																{tech.default && !isSelected && !isDisabled && (
																	<span className="absolute top-1 right-1 ml-2 flex-shrink-0 rounded bg-muted px-1 py-0.5 text-[10px] text-muted-foreground">
																		Default
																	</span>
																)}
															</motion.div>
														</TooltipTrigger>
														{isDisabled && disabledReason && (
															<TooltipContent side="top" align="center">
																<p>{disabledReason}</p>
															</TooltipContent>
														)}
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

export default StackArchitect;
