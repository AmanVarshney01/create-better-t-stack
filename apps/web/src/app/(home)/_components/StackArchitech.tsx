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
import { useEffect, useRef, useState } from "react";

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
	"runtime",
	"backendFramework",
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
		case "backendFramework":
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

const TechIcon = ({
	icon,
	name,
	className,
}: {
	icon: string;
	name: string;
	className?: string;
}) => {
	if (icon.startsWith("/icon/")) {
		return (
			<Image
				src={icon}
				alt={`${name} icon`}
				width={20}
				height={20}
				className={`inline-block ${className || ""}`}
				unoptimized
			/>
		);
	}

	return (
		<span className={`inline-flex items-center text-lg ${className || ""}`}>
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
}

const analyzeStackCompatibility = (stack: StackState): CompatibilityResult => {
	const nextStack = { ...stack };
	let changed = false;
	const notes: CompatibilityResult["notes"] = {};
	for (const cat of CATEGORY_ORDER) {
		notes[cat] = { notes: [], hasIssue: false };
	}

	const isWeb = hasWebFrontend(nextStack.frontend);
	const isPWACompat = hasPWACompatibleFrontend(nextStack.frontend);
	const isTauriCompat = hasTauriCompatibleFrontend(nextStack.frontend);
	const isNuxt = nextStack.frontend.includes("nuxt");
	const isSvelte = nextStack.frontend.includes("svelte");

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
		}
	} else if (nextStack.database === "mongodb") {
		if (nextStack.orm !== "prisma") {
			notes.database.notes.push(
				"MongoDB requires Prisma ORM. It will be selected.",
			);
			notes.orm.notes.push("MongoDB requires Prisma ORM. It will be selected.");
			notes.database.hasIssue = true;
			notes.orm.hasIssue = true;
			nextStack.orm = "prisma";
			changed = true;
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
		}
		if (nextStack.orm !== "prisma") {
			notes.dbSetup.notes.push("Requires Prisma ORM. It will be selected.");
			notes.orm.notes.push(
				"MongoDB Atlas setup requires Prisma ORM. It will be selected.",
			);
			notes.dbSetup.hasIssue = true;
			notes.orm.hasIssue = true;
			nextStack.orm = "prisma";
			changed = true;
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
		}
	}

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
	}

	const incompatibleAddons: string[] = [];
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
	}
	if (!isTauriCompat && nextStack.addons.includes("tauri")) {
		incompatibleAddons.push("tauri");
		notes.frontend.notes.push(
			"Tauri addon requires TanStack Router, React Router, or Nuxt. Addon will be removed.",
		);
		notes.addons.notes.push(
			"Tauri requires TanStack/React Router/Nuxt. It will be removed.",
		);
		notes.frontend.hasIssue = true;
		notes.addons.hasIssue = true;
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
			"Husky automatically enables Biome. It will be added.",
		);
		notes.addons.hasIssue = true;
		nextStack.addons.push("biome");
		nextStack.addons = [...new Set(nextStack.addons)];
		changed = true;
	}

	const incompatibleExamples: string[] = [];
	if (!isWeb) {
		if (nextStack.examples.includes("todo")) incompatibleExamples.push("todo");
		if (nextStack.examples.includes("ai")) incompatibleExamples.push("ai");
	}
	if (nextStack.database === "none" && nextStack.examples.includes("todo")) {
		incompatibleExamples.push("todo");
	}
	if (
		nextStack.backendFramework === "elysia" &&
		nextStack.examples.includes("ai")
	) {
		incompatibleExamples.push("ai");
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
			nextStack.backendFramework === "elysia" &&
			uniqueIncompatibleExamples.includes("ai")
		) {
			notes.backendFramework.notes.push(
				"AI example is not compatible with Elysia. It will be removed.",
			);
			notes.examples.notes.push(
				"AI example is not compatible with Elysia. It will be removed.",
			);
			notes.backendFramework.hasIssue = true;
			notes.examples.hasIssue = true;
		}

		const originalExamplesLength = nextStack.examples.length;
		nextStack.examples = nextStack.examples.filter(
			(ex) => !uniqueIncompatibleExamples.includes(ex),
		);
		if (nextStack.examples.length !== originalExamplesLength) changed = true;
	}

	return {
		adjustedStack: changed ? nextStack : null,
		notes,
	};
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

	const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
	const contentRef = useRef<HTMLDivElement>(null);

	const currentHasWebFrontend = hasWebFrontend(stack.frontend);
	const currentHasPWACompatibleFrontend = hasPWACompatibleFrontend(
		stack.frontend,
	);
	const currentHasTauriCompatibleFrontend = hasTauriCompatibleFrontend(
		stack.frontend,
	);

	const compatibilityAnalysis = analyzeStackCompatibility(stack);

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
			setStack(compatibilityAnalysis.adjustedStack);
		}
	}, [compatibilityAnalysis.adjustedStack, setStack]);

	const generateCommand = (stackState: StackState) => {
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
			const defaultValue = stackParsers[key]?.defaultValue;

			if (Array.isArray(defaultValue) && Array.isArray(value)) {
				return (
					defaultValue.length === value.length &&
					defaultValue.every((item) => value.includes(item)) &&
					value.every((item) => defaultValue.includes(item))
				);
			}
			return defaultValue === value;
		};

		if (!isDefault("frontend", stackState.frontend)) {
			if (
				stackState.frontend.length === 0 ||
				stackState.frontend[0] === "none"
			) {
				flags.push("--frontend none");
			} else {
				flags.push(`--frontend ${stackState.frontend.join(" ")}`);
			}
		}

		if (!isDefault("database", stackState.database)) {
			flags.push(`--database ${stackState.database}`);
		}

		if (stackState.orm !== stackParsers.orm.defaultValue) {
			flags.push(`--orm ${stackState.orm}`);
		}

		if (stackState.auth !== stackParsers.auth.defaultValue) {
			if (stackState.auth === "false") {
				flags.push("--no-auth");
			}
		}

		if (stackState.dbSetup !== stackParsers.dbSetup.defaultValue) {
			flags.push(`--db-setup ${stackState.dbSetup}`);
		}

		if (!isDefault("backendFramework", stackState.backendFramework)) {
			flags.push(`--backend ${stackState.backendFramework}`);
		}

		if (!isDefault("runtime", stackState.runtime)) {
			flags.push(`--runtime ${stackState.runtime}`);
		}

		if (stackState.api !== stackParsers.api.defaultValue) {
			flags.push(`--api ${stackState.api}`);
		}

		if (!isDefault("packageManager", stackState.packageManager)) {
			flags.push(`--package-manager ${stackState.packageManager}`);
		}

		if (!isDefault("git", stackState.git)) {
			if (stackState.git === "false") {
				flags.push("--no-git");
			}
		}

		if (!isDefault("install", stackState.install)) {
			if (stackState.install === "false") {
				flags.push("--no-install");
			}
		}

		if (!isDefault("addons", stackState.addons)) {
			if (stackState.addons.length > 0) {
				flags.push(`--addons ${stackState.addons.join(" ")}`);
			} else {
			}
		}

		if (!isDefault("examples", stackState.examples)) {
			if (stackState.examples.length > 0) {
				flags.push(`--examples ${stackState.examples.join(" ")}`);
			} else {
			}
		}

		return `${base} ${projectName}${
			flags.length > 0 ? ` ${flags.join(" ")}` : ""
		}`;
	};

	useEffect(() => {
		const cmd = generateCommand(stack);
		setCommand(cmd);
		// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	}, [stack, generateCommand]);

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
						if (currentArray.length > 1) {
							nextArray = nextArray.filter((id) => id !== techId);
						} else {
							return {};
						}
					} else {
						nextArray = nextArray.filter((id) => id !== "none");
						if (webTypes.includes(techId)) {
							nextArray = nextArray.filter((id) => !webTypes.includes(id));
						}
						nextArray.push(techId);
					}
				} else {
					if (isSelected) {
						nextArray = nextArray.filter((id) => id !== techId);
					} else {
						nextArray.push(techId);
					}
				}

				const uniqueNext = [...new Set(nextArray)].sort();
				if (
					JSON.stringify(uniqueNext) !==
					JSON.stringify([...new Set(currentArray)].sort())
				) {
					update[catKey] = uniqueNext;
				}
			} else {
				if (currentValue !== techId) {
					const techOption = TECH_OPTIONS[category]?.find(
						(opt) => opt.id === techId,
					);
					const isBooleanLike =
						category === "auth" || category === "git" || category === "install";
					if (
						currentValue === techId &&
						techId !== "none" &&
						!isBooleanLike &&
						techOption?.id !== "none"
					) {
						return {};
					}
					update[catKey] = techId;
				} else {
					if (
						(category === "git" ||
							category === "install" ||
							category === "auth") &&
						techId === "false"
					) {
						update[catKey] = "true";
					} else {
						return {};
					}
				}
			}

			return Object.keys(update).length > 0 ? update : {};
		});
	};

	const getDisabledReason = (
		category: keyof typeof TECH_OPTIONS,
		techId: string,
	): string | null => {
		const catKey = category as keyof StackState;

		if (catKey === "api") {
			if (
				techId === "trpc" &&
				(stack.frontend.includes("nuxt") || stack.frontend.includes("svelte"))
			) {
				return `tRPC is not supported with ${
					stack.frontend.includes("nuxt") ? "Nuxt" : "Svelte"
				}. Use oRPC instead.`;
			}
		}

		if (catKey === "orm") {
			if (stack.database === "none")
				return "Select a database to enable ORM options.";
			if (
				stack.database === "mongodb" &&
				techId !== "prisma" &&
				techId !== "none"
			)
				return "MongoDB requires the Prisma ORM.";
			if (
				stack.dbSetup === "turso" &&
				techId !== "drizzle" &&
				techId !== "none"
			)
				return "Turso DB setup requires the Drizzle ORM.";
			if (
				stack.dbSetup === "prisma-postgres" &&
				techId !== "prisma" &&
				techId !== "none"
			)
				return "Prisma PostgreSQL setup requires Prisma ORM.";
			if (
				stack.dbSetup === "mongodb-atlas" &&
				techId !== "prisma" &&
				techId !== "none"
			)
				return "MongoDB Atlas setup requires Prisma ORM.";

			if (techId === "none" && stack.database === "mongodb")
				return "MongoDB requires Prisma ORM.";
			if (techId === "none" && stack.dbSetup === "turso")
				return "Turso DB setup requires Drizzle ORM.";
			if (
				techId === "none" &&
				(stack.dbSetup === "prisma-postgres" ||
					stack.dbSetup === "mongodb-atlas")
			)
				return "This DB setup requires Prisma ORM.";
		}

		if (catKey === "dbSetup" && techId !== "none") {
			if (stack.database === "none")
				return "Select a database before choosing a cloud setup.";

			if (techId === "turso") {
				if (stack.database !== "sqlite" && stack.database !== "none")
					return "Turso requires SQLite database.";
				if (stack.orm !== "drizzle" && stack.orm !== "none")
					return "Turso requires Drizzle ORM.";
			} else if (techId === "prisma-postgres") {
				if (stack.database !== "postgres" && stack.database !== "none")
					return "Requires PostgreSQL database.";
				if (stack.orm !== "prisma" && stack.orm !== "none")
					return "Requires Prisma ORM.";
			} else if (techId === "mongodb-atlas") {
				if (stack.database !== "mongodb" && stack.database !== "none")
					return "Requires MongoDB database.";
				if (stack.orm !== "prisma" && stack.orm !== "none")
					return "Requires Prisma ORM.";
			} else if (techId === "neon") {
				if (stack.database !== "postgres" && stack.database !== "none")
					return "Requires PostgreSQL database.";
			}
		}

		if (catKey === "auth" && techId === "true" && stack.database === "none") {
			return "Authentication requires a database.";
		}

		if (catKey === "addons") {
			if (techId === "pwa" && !currentHasPWACompatibleFrontend) {
				return "Requires TanStack Router or React Router frontend.";
			}
			if (techId === "tauri" && !currentHasTauriCompatibleFrontend) {
				return "Requires TanStack Router, React Router, or Nuxt frontend.";
			}
		}

		if (catKey === "examples") {
			if ((techId === "todo" || techId === "ai") && !currentHasWebFrontend) {
				return "Requires a web frontend (TanStack Router, React Router, etc.).";
			}
			if (techId === "todo" && stack.database === "none") {
				return "Todo example requires a database.";
			}
			if (techId === "ai" && stack.backendFramework === "elysia") {
				return "AI example is not compatible with Elysia backend.";
			}
		}

		return null;
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
	};

	const loadSavedStack = () => {
		if (lastSavedStack) {
			setStack(lastSavedStack);
			setShowHelp(false);
			setShowPresets(false);
			setActiveCategory(CATEGORY_ORDER[0]);
			contentRef.current?.scrollTo(0, 0);
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
		}
	};

	const handleSidebarClick = (category: string) => {
		setActiveCategory(category);
		const element = sectionRefs.current[category];
		if (element && contentRef.current) {
			const containerTop = contentRef.current.getBoundingClientRect().top;
			const elementTop = element.getBoundingClientRect().top;
			const scrollTop = contentRef.current.scrollTop;
			const offset = 16;
			const targetScrollTop = scrollTop + elementTop - containerTop - offset;

			contentRef.current.scrollTo({
				top: targetScrollTop,
				behavior: "smooth",
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
							onClick={() => setShowHelp(!showHelp)}
							className={cn(
								"text-muted-foreground transition-colors hover:text-foreground",
							)}
							title="Help"
						>
							<HelpCircle className="h-4 w-4" />
						</button>
						<button
							type="button"
							onClick={() => setShowPresets(!showPresets)}
							className={cn(
								"text-muted-foreground transition-colors hover:text-foreground",
							)}
							title="Presets"
						>
							<Star className="h-4 w-4" />
						</button>
						<button
							type="button"
							className={cn(
								"text-muted-foreground transition-colors hover:text-foreground",
							)}
							title="GitHub Repository"
						>
							<Link
								href={"https://github.com/AmanVarshney01/create-better-t-stack"}
								target="_blank"
							>
								<Github className="h-4 w-4" />
							</Link>
						</button>
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
								options based on compatibility (check notes within each
								section!).
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
						<div className="flex flex-wrap gap-1.5">
							{CATEGORY_ORDER.flatMap((category) => {
								const categoryKey = category as keyof StackState;
								const options =
									TECH_OPTIONS[category as keyof typeof TECH_OPTIONS];
								const selectedValue = stack[categoryKey];

								if (!options) return [];

								if (Array.isArray(selectedValue)) {
									if (selectedValue.length === 0 || selectedValue[0] === "none")
										return [];

									return selectedValue
										.map((id) => options.find((opt) => opt.id === id))
										.filter((tech): tech is NonNullable<typeof tech> =>
											Boolean(tech),
										)
										.map((tech) => (
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
											</span>
										));
								}
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
									return [];
								}

								return (
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
											className="h-3 w-3"
										/>
										{tech.name}
									</span>
								);
							})}
						</div>
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
											{categoryOptions.map((tech) => {
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

												const disabledReason = getDisabledReason(
													categoryKey as keyof typeof TECH_OPTIONS,
													tech.id,
												);

												const isDisabled = !!disabledReason && !isSelected;

												return (
													<Tooltip key={tech.id} delayDuration={100}>
														<TooltipTrigger asChild>
															<motion.div
																className={cn(
																	"relative rounded border p-3 transition-all",
																	isDisabled
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
																			{isDisabled && (
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
