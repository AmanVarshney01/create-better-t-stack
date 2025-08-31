import {
	parseAsArrayOf,
	parseAsString,
	parseAsStringEnum,
	useQueryState,
	useQueryStates,
} from "nuqs";
import {
	DEFAULT_STACK,
	isStackDefault,
	type StackState,
	TECH_OPTIONS,
} from "@/lib/constant";
import {
	stackParsers,
	stackQueryStatesOptions,
	stackUrlKeys,
} from "@/lib/stack-url-state";

const getValidIds = (category: keyof typeof TECH_OPTIONS): string[] => {
	return TECH_OPTIONS[category]?.map((opt) => opt.id) ?? [];
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

function getStackKeyFromUrlKey(urlKey: string): keyof StackState | null {
	for (const [stackKey, urlKeyValue] of Object.entries(stackUrlKeys)) {
		if (urlKeyValue === urlKey) {
			return stackKey as keyof StackState;
		}
	}
	return null;
}

export function parseSearchParamsToStack(searchParams: {
	[key: string]: string | string[] | undefined;
}): StackState {
	const parsedStack: StackState = { ...DEFAULT_STACK };

	for (const [key, value] of Object.entries(searchParams)) {
		if (
			key === "utm_source" ||
			key === "utm_medium" ||
			key === "utm_campaign"
		) {
			continue;
		}

		const stackKey = getStackKeyFromUrlKey(key);
		if (stackKey && value !== undefined) {
			try {
				const parser = stackParsers[stackKey];
				if (parser) {
					const parsedValue = parser.parseServerSide(
						Array.isArray(value) ? value[0] : value,
					);
					(parsedStack as Record<string, unknown>)[stackKey] = parsedValue;
				}
			} catch (error) {
				console.warn(`Failed to parse ${key}:`, error);
			}
		}
	}

	for (const [key, defaultValue] of Object.entries(DEFAULT_STACK)) {
		if (parsedStack[key as keyof StackState] === undefined) {
			(parsedStack as Record<string, unknown>)[key] = defaultValue;
		}
	}

	return parsedStack;
}

/**
 * Generate a human-readable summary of the stack
 */
export function generateStackSummary(stack: StackState): string {
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

	return selectedTechs.length > 0 ? selectedTechs.join(" • ") : "Custom stack";
}

export function generateStackCommand(stack: StackState): string {
	let base: string;
	switch (stack.packageManager) {
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

	const projectName = stack.projectName || "my-better-t-app";
	const flags: string[] = [];

	const isDefaultStack = Object.keys(DEFAULT_STACK).every((key) => {
		if (key === "projectName") return true;
		const defaultKey = key as keyof StackState;
		return isStackDefault(stack, defaultKey, stack[defaultKey]);
	});

	if (isDefaultStack) {
		flags.push("--yes");
	} else {
		const combinedFrontends = [
			...stack.webFrontend,
			...stack.nativeFrontend,
		].filter((v, _, arr) => v !== "none" || arr.length === 1);

		if (combinedFrontends.length === 0 || combinedFrontends[0] === "none") {
			flags.push("--frontend none");
		} else {
			flags.push(`--frontend ${combinedFrontends.join(" ")}`);
		}

		flags.push(`--backend ${stack.backend}`);
		flags.push(`--runtime ${stack.runtime}`);
		flags.push(`--api ${stack.api}`);
		flags.push(`--auth ${stack.auth}`);
		flags.push(`--database ${stack.database}`);
		flags.push(`--orm ${stack.orm}`);
		flags.push(`--db-setup ${stack.dbSetup}`);
		flags.push(`--package-manager ${stack.packageManager}`);

		if (stack.git === "false") {
			flags.push("--no-git");
		} else {
			flags.push("--git");
		}

		flags.push(`--web-deploy ${stack.webDeploy}`);
		flags.push(`--server-deploy ${stack.serverDeploy}`);

		if (stack.install === "false") {
			flags.push("--no-install");
		} else {
			flags.push("--install");
		}

		if (stack.addons.length > 0) {
			const validAddons = stack.addons.filter((addon) =>
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

		if (stack.examples.length > 0) {
			flags.push(`--examples ${stack.examples.join(" ")}`);
		} else {
			flags.push("--examples none");
		}
	}

	return `${base} ${projectName}${
		flags.length > 0 ? ` ${flags.join(" ")}` : ""
	}`;
}

/**
 * Generate stack URL from pathname and search params
 */
export function generateStackUrl(
	pathname: string,
	searchParams: URLSearchParams,
): string {
	const searchString = searchParams.toString();
	const relativeUrl = `${pathname}${searchString ? `?${searchString}` : ""}`;
	return `https://better-t-stack.dev${relativeUrl}`;
}

export function generateStackUrlFromState(
	stack: StackState,
	baseUrl?: string,
): string {
	const origin =
		baseUrl ||
		(typeof window !== "undefined"
			? window.location.origin
			: "https://better-t-stack.dev");

	const isDefaultStack = Object.keys(DEFAULT_STACK).every((key) => {
		if (key === "projectName") return true;
		const defaultKey = key as keyof StackState;
		return isStackDefault(stack, defaultKey, stack[defaultKey]);
	});

	if (isDefaultStack) {
		return `${origin}/stack`;
	}

	const stackParams = new URLSearchParams();

	for (const [stackKey, urlKey] of Object.entries(stackUrlKeys)) {
		const value = stack[stackKey as keyof StackState];
		if (value !== undefined) {
			if (Array.isArray(value)) {
				stackParams.set(urlKey, value.join(","));
			} else {
				stackParams.set(urlKey, String(value));
			}
		}
	}

	return `${origin}/stack?${stackParams.toString()}`;
}

export function useStackStateWithAllParams() {
	const [stack, setStack] = useQueryStates(
		stackParsers,
		stackQueryStatesOptions,
	);

	const setStackWithAllParams = async (
		newStack: Partial<StackState> | ((prev: StackState) => Partial<StackState>),
	) => {
		const updatedStack =
			typeof newStack === "function" ? newStack(stack) : newStack;
		const finalStack = { ...stack, ...updatedStack };

		const isFinalStackDefault = Object.keys(DEFAULT_STACK).every((key) => {
			if (key === "projectName") return true;
			const defaultKey = key as keyof StackState;
			return isStackDefault(finalStack, defaultKey, finalStack[defaultKey]);
		});

		if (isFinalStackDefault) {
			await setStack(null);
		} else {
			await setStack(finalStack);
		}
	};

	return [stack, setStackWithAllParams] as const;
}

export function useIndividualStackStates() {
	const [projectName, setProjectName] = useQueryState(
		"name",
		parseAsString.withDefault(DEFAULT_STACK.projectName),
	);

	const [webFrontend, setWebFrontend] = useQueryState(
		"fe-w",
		parseAsArrayOf(parseAsString).withDefault(DEFAULT_STACK.webFrontend),
	);

	const [nativeFrontend, setNativeFrontend] = useQueryState(
		"fe-n",
		parseAsArrayOf(parseAsString).withDefault(DEFAULT_STACK.nativeFrontend),
	);

	const [runtime, setRuntime] = useQueryState(
		"rt",
		parseAsStringEnum(getValidIds("runtime")).withDefault(
			DEFAULT_STACK.runtime,
		),
	);

	const [backend, setBackend] = useQueryState(
		"be",
		parseAsStringEnum(getValidIds("backend")).withDefault(
			DEFAULT_STACK.backend,
		),
	);

	const [api, setApi] = useQueryState(
		"api",
		parseAsStringEnum(getValidIds("api")).withDefault(DEFAULT_STACK.api),
	);

	const [database, setDatabase] = useQueryState(
		"db",
		parseAsStringEnum(getValidIds("database")).withDefault(
			DEFAULT_STACK.database,
		),
	);

	const [orm, setOrm] = useQueryState(
		"orm",
		parseAsStringEnum(getValidIds("orm")).withDefault(DEFAULT_STACK.orm),
	);

	const [dbSetup, setDbSetup] = useQueryState(
		"dbs",
		parseAsStringEnum(getValidIds("dbSetup")).withDefault(
			DEFAULT_STACK.dbSetup,
		),
	);

	const [auth, setAuth] = useQueryState(
		"au",
		parseAsStringEnum(getValidIds("auth")).withDefault(DEFAULT_STACK.auth),
	);

	const [packageManager, setPackageManager] = useQueryState(
		"pm",
		parseAsStringEnum(getValidIds("packageManager")).withDefault(
			DEFAULT_STACK.packageManager,
		),
	);

	const [addons, setAddons] = useQueryState(
		"add",
		parseAsArrayOf(parseAsString).withDefault(DEFAULT_STACK.addons),
	);

	const [examples, setExamples] = useQueryState(
		"ex",
		parseAsArrayOf(parseAsString).withDefault(DEFAULT_STACK.examples),
	);

	const [git, setGit] = useQueryState(
		"git",
		parseAsStringEnum(["true", "false"] as const).withDefault(
			DEFAULT_STACK.git as "true" | "false",
		),
	);

	const [install, setInstall] = useQueryState(
		"i",
		parseAsStringEnum(["true", "false"] as const).withDefault(
			DEFAULT_STACK.install as "true" | "false",
		),
	);

	const [webDeploy, setWebDeploy] = useQueryState(
		"wd",
		parseAsStringEnum(getValidIds("webDeploy")).withDefault(
			DEFAULT_STACK.webDeploy,
		),
	);

	const [serverDeploy, setServerDeploy] = useQueryState(
		"sd",
		parseAsStringEnum(getValidIds("serverDeploy")).withDefault(
			DEFAULT_STACK.serverDeploy,
		),
	);

	const stack: StackState = {
		projectName,
		webFrontend,
		nativeFrontend,
		runtime,
		backend,
		api,
		database,
		orm,
		dbSetup,
		auth,
		packageManager,
		addons,
		examples,
		git,
		install,
		webDeploy,
		serverDeploy,
	};

	const setStack = async (updates: Partial<StackState>) => {
		const setters = {
			projectName: setProjectName,
			webFrontend: setWebFrontend,
			nativeFrontend: setNativeFrontend,
			runtime: setRuntime,
			backend: setBackend,
			api: setApi,
			database: setDatabase,
			orm: setOrm,
			dbSetup: setDbSetup,
			auth: setAuth,
			packageManager: setPackageManager,
			addons: setAddons,
			examples: setExamples,
			git: setGit,
			install: setInstall,
			webDeploy: setWebDeploy,
			serverDeploy: setServerDeploy,
		};

		const promises = Object.entries(updates).map(([key, value]) => {
			const setter = setters[key as keyof typeof setters];
			return setter(value as never);
		});

		await Promise.all(promises);
	};

	return [stack, setStack] as const;
}

export { CATEGORY_ORDER };
