import { ADDON_COMPATIBILITY } from "../constants";
import type {
	Addons,
	API,
	Auth,
	Backend,
	CLIInput,
	Frontend,
	Payments,
	ProjectConfig,
	ServerDeploy,
	WebDeploy,
} from "../types";
import { WEB_FRAMEWORKS } from "./compatibility";
import { exitWithError } from "./errors";

export function isWebFrontend(value: Frontend) {
	return WEB_FRAMEWORKS.includes(value);
}

export function splitFrontends(values: Frontend[] = []): {
	web: Frontend[];
	native: Frontend[];
} {
	const web = values.filter((f) => isWebFrontend(f));
	const native = values.filter(
		(f) =>
			f === "native-bare" || f === "native-uniwind" || f === "native-unistyles",
	);
	return { web, native };
}

export function ensureSingleWebAndNative(frontends: Frontend[]) {
	const { web, native } = splitFrontends(frontends);
	if (web.length > 1) {
		exitWithError(
			"Cannot select multiple web frameworks. Choose only one of: tanstack-router, tanstack-start, react-router, next, nuxt, svelte, solid",
		);
	}
	if (native.length > 1) {
		exitWithError(
			"Cannot select multiple native frameworks. Choose only one of: native-bare, native-uniwind, native-unistyles",
		);
	}
}

// Temporarily restrict to Next.js and TanStack Start only for backend="self"
const FULLSTACK_FRONTENDS: readonly Frontend[] = [
	"next",
	"tanstack-start",
	// "nuxt",      // TODO: Add support in future update
	// "svelte",    // TODO: Add support in future update
] as const;

export function validateSelfBackendCompatibility(
	providedFlags: Set<string>,
	options: CLIInput,
	config: Partial<ProjectConfig>,
) {
	const backend = config.backend || options.backend;
	const frontends = config.frontend || options.frontend || [];

	if (backend === "self") {
		const { web, native } = splitFrontends(frontends);
		const hasSupportedWeb =
			web.length === 1 && FULLSTACK_FRONTENDS.includes(web[0]);

		if (!hasSupportedWeb) {
			exitWithError(
				"Backend 'self' (fullstack) currently only supports Next.js and TanStack Start frontends. Please use --frontend next or --frontend tanstack-start. Support for Nuxt and SvelteKit will be added in a future update.",
			);
		}

		if (native.length > 1) {
			exitWithError(
				"Cannot select multiple native frameworks. Choose only one of: native-bare, native-uniwind, native-unistyles",
			);
		}
	}

	const hasFullstackFrontend = frontends.some((f) =>
		FULLSTACK_FRONTENDS.includes(f),
	);
	if (
		providedFlags.has("backend") &&
		!hasFullstackFrontend &&
		backend === "self"
	) {
		exitWithError(
			"Backend 'self' (fullstack) currently only supports Next.js and TanStack Start frontends. Please use --frontend next or --frontend tanstack-start or choose a different backend. Support for Nuxt and SvelteKit will be added in a future update.",
		);
	}
}

export function validateWorkersCompatibility(
	providedFlags: Set<string>,
	options: CLIInput,
	config: Partial<ProjectConfig>,
) {
	if (
		providedFlags.has("runtime") &&
		options.runtime === "workers" &&
		config.backend &&
		config.backend !== "hono"
	) {
		exitWithError(
			`Cloudflare Workers runtime (--runtime workers) is only supported with Hono backend (--backend hono). Current backend: ${config.backend}. Please use '--backend hono' or choose a different runtime.`,
		);
	}

	if (
		providedFlags.has("backend") &&
		config.backend &&
		config.backend !== "hono" &&
		config.runtime === "workers"
	) {
		exitWithError(
			`Backend '${config.backend}' is not compatible with Cloudflare Workers runtime. Cloudflare Workers runtime is only supported with Hono backend. Please use '--backend hono' or choose a different runtime.`,
		);
	}

	if (
		providedFlags.has("runtime") &&
		options.runtime === "workers" &&
		config.database === "mongodb"
	) {
		exitWithError(
			"Cloudflare Workers runtime (--runtime workers) is not compatible with MongoDB database. MongoDB requires Prisma or Mongoose ORM, but Workers runtime only supports Drizzle or Prisma ORM. Please use a different database or runtime.",
		);
	}

	if (
		providedFlags.has("runtime") &&
		options.runtime === "workers" &&
		config.dbSetup === "docker"
	) {
		exitWithError(
			"Cloudflare Workers runtime (--runtime workers) is not compatible with Docker setup. Workers runtime uses serverless databases (D1) and doesn't support local Docker containers. Please use '--db-setup d1' for SQLite or choose a different runtime.",
		);
	}

	if (
		providedFlags.has("database") &&
		config.database === "mongodb" &&
		config.runtime === "workers"
	) {
		exitWithError(
			"MongoDB database is not compatible with Cloudflare Workers runtime. MongoDB requires Prisma or Mongoose ORM, but Workers runtime only supports Drizzle or Prisma ORM. Please use a different database or runtime.",
		);
	}
}

export function validateApiFrontendCompatibility(
	api: API | undefined,
	frontends: Frontend[] = [],
) {
	const includesNuxt = frontends.includes("nuxt");
	const includesSvelte = frontends.includes("svelte");
	const includesSolid = frontends.includes("solid");
	if ((includesNuxt || includesSvelte || includesSolid) && api === "trpc") {
		exitWithError(
			`tRPC API is not supported with '${includesNuxt ? "nuxt" : includesSvelte ? "svelte" : "solid"}' frontend. Please use --api orpc or --api none or remove '${includesNuxt ? "nuxt" : includesSvelte ? "svelte" : "solid"}' from --frontend.`,
		);
	}
}

export function isFrontendAllowedWithBackend(
	frontend: Frontend,
	backend?: ProjectConfig["backend"],
	auth?: string,
) {
	if (backend === "convex" && frontend === "solid") return false;

	if (auth === "clerk" && backend === "convex") {
		const incompatibleFrontends = ["nuxt", "svelte", "solid"];
		if (incompatibleFrontends.includes(frontend)) return false;
	}

	return true;
}

export function allowedApisForFrontends(frontends: Frontend[] = []) {
	const includesNuxt = frontends.includes("nuxt");
	const includesSvelte = frontends.includes("svelte");
	const includesSolid = frontends.includes("solid");
	const base: API[] = ["trpc", "orpc", "none"];
	if (includesNuxt || includesSvelte || includesSolid) {
		return ["orpc", "none"];
	}
	return base;
}

export function isExampleTodoAllowed(
	backend?: ProjectConfig["backend"],
	database?: ProjectConfig["database"],
) {
	return !(backend !== "convex" && backend !== "none" && database === "none");
}

export function isExampleAIAllowed(
	_backend?: ProjectConfig["backend"],
	frontends: Frontend[] = [],
) {
	const includesSolid = frontends.includes("solid");
	if (includesSolid) return false;
	return true;
}

export function validateWebDeployRequiresWebFrontend(
	webDeploy: WebDeploy | undefined,
	hasWebFrontendFlag: boolean,
) {
	if (webDeploy && webDeploy !== "none" && !hasWebFrontendFlag) {
		exitWithError(
			"'--web-deploy' requires a web frontend. Please select a web frontend or set '--web-deploy none'.",
		);
	}
}

export function validateServerDeployRequiresBackend(
	serverDeploy: ServerDeploy | undefined,
	backend: Backend | undefined,
) {
	if (
		serverDeploy &&
		serverDeploy !== "none" &&
		(!backend || backend === "none")
	) {
		exitWithError(
			"'--server-deploy' requires a backend. Please select a backend or set '--server-deploy none'.",
		);
	}
}

export function validateAddonCompatibility(
	addon: Addons,
	frontend: Frontend[],
	_auth?: Auth,
): { isCompatible: boolean; reason?: string } {
	const compatibleFrontends = ADDON_COMPATIBILITY[addon];

	if (compatibleFrontends.length > 0) {
		const hasCompatibleFrontend = frontend.some((f) =>
			(compatibleFrontends as readonly string[]).includes(f),
		);

		if (!hasCompatibleFrontend) {
			const frontendList = compatibleFrontends.join(", ");
			return {
				isCompatible: false,
				reason: `${addon} addon requires one of these frontends: ${frontendList}`,
			};
		}
	}

	return { isCompatible: true };
}

export function getCompatibleAddons(
	allAddons: Addons[],
	frontend: Frontend[],
	existingAddons: Addons[] = [],
	auth?: Auth,
) {
	return allAddons.filter((addon) => {
		if (existingAddons.includes(addon)) return false;

		if (addon === "none") return false;

		const { isCompatible } = validateAddonCompatibility(addon, frontend, auth);
		return isCompatible;
	});
}

export function validateAddonsAgainstFrontends(
	addons: Addons[] = [],
	frontends: Frontend[] = [],
	auth?: Auth,
) {
	for (const addon of addons) {
		if (addon === "none") continue;
		const { isCompatible, reason } = validateAddonCompatibility(
			addon,
			frontends,
			auth,
		);
		if (!isCompatible) {
			exitWithError(`Incompatible addon/frontend combination: ${reason}`);
		}
	}
}

export function validatePaymentsCompatibility(
	payments: Payments | undefined,
	auth: Auth | undefined,
	_backend: Backend | undefined,
	frontends: Frontend[] = [],
) {
	if (!payments || payments === "none") return;

	if (payments === "polar") {
		if (!auth || auth === "none" || auth !== "better-auth") {
			exitWithError(
				"Polar payments requires Better Auth. Please use '--auth better-auth' or choose a different payments provider.",
			);
		}

		const { web } = splitFrontends(frontends);
		if (web.length === 0 && frontends.length > 0) {
			exitWithError(
				"Polar payments requires a web frontend or no frontend. Please select a web frontend or choose a different payments provider.",
			);
		}
	}
}

export function validateExamplesCompatibility(
	examples: string[] | undefined,
	backend: ProjectConfig["backend"] | undefined,
	database: ProjectConfig["database"] | undefined,
	frontend?: Frontend[],
) {
	const examplesArr = examples ?? [];
	if (examplesArr.length === 0 || examplesArr.includes("none")) return;
	if (
		examplesArr.includes("todo") &&
		backend !== "convex" &&
		backend !== "none" &&
		database === "none"
	) {
		exitWithError(
			"The 'todo' example requires a database if a backend (other than Convex) is present. Cannot use --examples todo when database is 'none' and a backend is selected.",
		);
	}
	if (examplesArr.includes("ai") && (frontend ?? []).includes("solid")) {
		exitWithError(
			"The 'ai' example is not compatible with the Solid frontend.",
		);
	}
}
