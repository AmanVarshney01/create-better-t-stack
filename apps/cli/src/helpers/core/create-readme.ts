import path from "node:path";
import consola from "consola";
import fs from "fs-extra";
import type {
	Addons,
	API,
	Database,
	DatabaseSetup,
	Frontend,
	ORM,
	ProjectConfig,
	Runtime,
} from "../../types";

export async function createReadme(projectDir: string, options: ProjectConfig) {
	const readmePath = path.join(projectDir, "README.md");
	const content = generateReadmeContent(options);

	try {
		await fs.writeFile(readmePath, content);
	} catch (error) {
		consola.error("Failed to create README.md file:", error);
	}
}

function generateReadmeContent(options: ProjectConfig): string {
	const {
		projectName,
		packageManager,
		database,
		auth,
		addons = [],
		orm = "drizzle",
		runtime = "bun",
		frontend = ["tanstack-router"],
		backend = "hono",
		api = "trpc",
	} = options;

	const isConvex = backend === "convex";
	const hasReactRouter = frontend.includes("react-router");
	const hasNative =
		frontend.includes("native-nativewind") ||
		frontend.includes("native-unistyles");
	const hasSvelte = frontend.includes("svelte");

	const packageManagerRunCmd =
		packageManager === "npm" ? "npm run" : packageManager;

	let webPort = "3001";
	if (hasReactRouter || hasSvelte) {
		webPort = "5173";
	}

	const stackDescription = generateStackDescription(
		frontend,
		backend,
		api,
		isConvex,
	);

	return `# ${projectName}

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack${
		stackDescription ? ` that combines ${stackDescription}` : ""
	}.

## Features

${generateFeaturesList(
	database,
	auth,
	addons,
	orm,
	runtime,
	frontend,
	backend,
	api,
)}

## Getting Started

First, install the dependencies:

\`\`\`bash
${packageManager} install
\`\`\`
${
	isConvex
		? `
## Convex Setup

This project uses Convex as a backend. You'll need to set up Convex before running the app:

\`\`\`bash
${packageManagerRunCmd} dev:setup
\`\`\`

Follow the prompts to create a new Convex project and connect it to your application.`
		: generateDatabaseSetup(
				database,
				auth,
				packageManagerRunCmd,
				orm,
				options.dbSetup,
			)
}

Then, run the development server:

\`\`\`bash
${packageManagerRunCmd} dev
\`\`\`

${generateRunningInstructions(frontend, backend, webPort, hasNative, isConvex)}

${
	addons.includes("pwa") && hasReactRouter
		? "\n## PWA Support with React Router v7\n\nThere is a known compatibility issue between VitePWA and React Router v7.\nSee: https://github.com/vite-pwa/vite-plugin-pwa/issues/809\n"
		: ""
}

## Project Structure

\`\`\`
${generateProjectStructure(
	projectName,
	frontend,
	backend,
	addons,
	isConvex,
	api,
)}
\`\`\`

## Available Scripts

${generateScriptsList(
	packageManagerRunCmd,
	database,
	orm,
	auth,
	hasNative,
	addons,
	backend,
)}
`;
}

function generateStackDescription(
	frontend: Frontend[],
	backend: string,
	api: API,
	isConvex: boolean,
): string {
	const parts: string[] = [];

	const hasTanstackRouter = frontend.includes("tanstack-router");
	const hasReactRouter = frontend.includes("react-router");
	const hasNext = frontend.includes("next");
	const hasTanstackStart = frontend.includes("tanstack-start");
	const hasSvelte = frontend.includes("svelte");
	const hasNuxt = frontend.includes("nuxt");
	const hasSolid = frontend.includes("solid");
	const hasFrontendNone = frontend.length === 0 || frontend.includes("none");

	if (!hasFrontendNone) {
		if (hasTanstackRouter) {
			parts.push("React, TanStack Router");
		} else if (hasReactRouter) {
			parts.push("React, React Router");
		} else if (hasNext) {
			parts.push("Next.js");
		} else if (hasTanstackStart) {
			parts.push("React, TanStack Start");
		} else if (hasSvelte) {
			parts.push("SvelteKit");
		} else if (hasNuxt) {
			parts.push("Nuxt");
		} else if (hasSolid) {
			parts.push("SolidJS");
		}
	}

	if (backend !== "none") {
		parts.push(backend[0].toUpperCase() + backend.slice(1));
	}

	if (!isConvex && api !== "none") {
		parts.push(api.toUpperCase());
	}

	return parts.length > 0 ? `${parts.join(", ")}, and more` : "";
}

function generateRunningInstructions(
	frontend: Frontend[],
	backend: string,
	webPort: string,
	hasNative: boolean,
	isConvex: boolean,
): string {
	const instructions: string[] = [];

	const hasFrontendNone = frontend.length === 0 || frontend.includes("none");
	const isBackendNone = backend === "none";

	if (!hasFrontendNone) {
		const hasTanstackRouter = frontend.includes("tanstack-router");
		const hasReactRouter = frontend.includes("react-router");
		const hasNext = frontend.includes("next");
		const hasTanstackStart = frontend.includes("tanstack-start");
		const hasSvelte = frontend.includes("svelte");
		const hasNuxt = frontend.includes("nuxt");
		const hasSolid = frontend.includes("solid");

		if (
			hasTanstackRouter ||
			hasReactRouter ||
			hasNext ||
			hasTanstackStart ||
			hasSvelte ||
			hasNuxt ||
			hasSolid
		) {
			instructions.push(
				`Open [http://localhost:${webPort}](http://localhost:${webPort}) in your browser to see the web application.`,
			);
		}
	}

	if (hasNative) {
		instructions.push("Use the Expo Go app to run the mobile application.");
	}

	if (isConvex) {
		instructions.push(
			"Your app will connect to the Convex cloud backend automatically.",
		);
	} else if (!isBackendNone) {
		instructions.push(
			"The API is running at [http://localhost:3000](http://localhost:3000).",
		);
	}

	return instructions.join("\n");
}

function generateProjectStructure(
	projectName: string,
	frontend: Frontend[],
	backend: string,
	addons: Addons[],
	isConvex: boolean,
	api: API,
): string {
	const structure: string[] = [`${projectName}/`, "├── apps/"];

	const hasFrontendNone = frontend.length === 0 || frontend.includes("none");
	const isBackendNone = backend === "none";

	if (!hasFrontendNone) {
		const hasTanstackRouter = frontend.includes("tanstack-router");
		const hasReactRouter = frontend.includes("react-router");
		const hasNext = frontend.includes("next");
		const hasTanstackStart = frontend.includes("tanstack-start");
		const hasSvelte = frontend.includes("svelte");
		const hasNuxt = frontend.includes("nuxt");
		const hasSolid = frontend.includes("solid");

		if (
			hasTanstackRouter ||
			hasReactRouter ||
			hasNext ||
			hasTanstackStart ||
			hasSvelte ||
			hasNuxt ||
			hasSolid
		) {
			let frontendType = "";
			if (hasTanstackRouter) frontendType = "React + TanStack Router";
			else if (hasReactRouter) frontendType = "React + React Router";
			else if (hasNext) frontendType = "Next.js";
			else if (hasTanstackStart) frontendType = "React + TanStack Start";
			else if (hasSvelte) frontendType = "SvelteKit";
			else if (hasNuxt) frontendType = "Nuxt";
			else if (hasSolid) frontendType = "SolidJS";

			structure.push(
				`│   ├── web/         # Frontend application (${frontendType})`,
			);
		}
	}

	const hasNative =
		frontend.includes("native-nativewind") ||
		frontend.includes("native-unistyles");
	if (hasNative) {
		structure.push(
			"│   ├── native/      # Mobile application (React Native, Expo)",
		);
	}

	if (addons.includes("starlight")) {
		structure.push(
			"│   ├── docs/        # Documentation site (Astro Starlight)",
		);
	}

	if (isConvex) {
		structure.push("├── packages/");
		structure.push(
			"│   └── backend/     # Convex backend functions and schema",
		);
	} else if (!isBackendNone) {
		const backendName = backend[0].toUpperCase() + backend.slice(1);
		const apiName = api !== "none" ? api.toUpperCase() : "";
		const backendDesc = apiName ? `${backendName}, ${apiName}` : backendName;
		structure.push(`│   └── server/      # Backend API (${backendDesc})`);
	}

	return structure.join("\n");
}

function generateFeaturesList(
	database: Database,
	auth: boolean,
	addons: Addons[],
	orm: ORM,
	runtime: Runtime,
	frontend: Frontend[],
	backend: string,
	api: API,
): string {
	const isConvex = backend === "convex";
	const isBackendNone = backend === "none";
	const hasTanstackRouter = frontend.includes("tanstack-router");
	const hasReactRouter = frontend.includes("react-router");
	const hasNative =
		frontend.includes("native-nativewind") ||
		frontend.includes("native-unistyles");
	const hasNext = frontend.includes("next");
	const hasTanstackStart = frontend.includes("tanstack-start");
	const hasSvelte = frontend.includes("svelte");
	const hasNuxt = frontend.includes("nuxt");
	const hasSolid = frontend.includes("solid");
	const hasFrontendNone = frontend.length === 0 || frontend.includes("none");

	const addonsList = [
		"- **TypeScript** - For type safety and improved developer experience",
	];

	if (!hasFrontendNone) {
		if (hasTanstackRouter) {
			addonsList.push(
				"- **TanStack Router** - File-based routing with full type safety",
			);
		} else if (hasReactRouter) {
			addonsList.push("- **React Router** - Declarative routing for React");
		} else if (hasNext) {
			addonsList.push("- **Next.js** - Full-stack React framework");
		} else if (hasTanstackStart) {
			addonsList.push(
				"- **TanStack Start** - SSR framework with TanStack Router",
			);
		} else if (hasSvelte) {
			addonsList.push(
				"- **SvelteKit** - Web framework for building Svelte apps",
			);
		} else if (hasNuxt) {
			addonsList.push("- **Nuxt** - The Intuitive Vue Framework");
		} else if (hasSolid) {
			addonsList.push("- **SolidJS** - Simple and performant reactivity");
		}
	}

	if (hasNative) {
		addonsList.push("- **React Native** - Build mobile apps using React");
		addonsList.push("- **Expo** - Tools for React Native development");
	}

	if (!hasFrontendNone) {
		addonsList.push(
			"- **TailwindCSS** - Utility-first CSS for rapid UI development",
			"- **shadcn/ui** - Reusable UI components",
		);
	}

	if (isConvex) {
		addonsList.push("- **Convex** - Reactive backend-as-a-service platform");
	} else if (!isBackendNone) {
		if (backend === "hono") {
			addonsList.push("- **Hono** - Lightweight, performant server framework");
		} else if (backend === "express") {
			addonsList.push("- **Express** - Fast, unopinionated web framework");
		} else if (backend === "fastify") {
			addonsList.push("- **Fastify** - Fast, low-overhead web framework");
		} else if (backend === "elysia") {
			addonsList.push("- **Elysia** - Type-safe, high-performance framework");
		} else if (backend === "next") {
			addonsList.push("- **Next.js** - Full-stack React framework");
		}

		if (api === "trpc") {
			addonsList.push("- **tRPC** - End-to-end type-safe APIs");
		} else if (api === "orpc") {
			addonsList.push(
				"- **oRPC** - End-to-end type-safe APIs with OpenAPI integration",
			);
		}

		if (runtime !== "none") {
			addonsList.push(
				`- **${
					runtime === "bun" ? "Bun" : runtime === "node" ? "Node.js" : runtime
				}** - Runtime environment`,
			);
		}
	}

	if (database !== "none" && !isConvex) {
		const ormName =
			orm === "drizzle"
				? "Drizzle"
				: orm === "prisma"
					? "Prisma"
					: orm === "mongoose"
						? "Mongoose"
						: "ORM";
		const dbName =
			database === "sqlite"
				? "SQLite/Turso"
				: database === "postgres"
					? "PostgreSQL"
					: database === "mysql"
						? "MySQL"
						: database === "mongodb"
							? "MongoDB"
							: "Database";

		addonsList.push(
			`- **${ormName}** - TypeScript-first ORM`,
			`- **${dbName}** - Database engine`,
		);
	}

	if (auth && !isConvex) {
		addonsList.push(
			"- **Authentication** - Email & password authentication with Better Auth",
		);
	}

	for (const addon of addons) {
		if (addon === "pwa") {
			addonsList.push("- **PWA** - Progressive Web App support");
		} else if (addon === "tauri") {
			addonsList.push("- **Tauri** - Build native desktop applications");
		} else if (addon === "biome") {
			addonsList.push("- **Biome** - Linting and formatting");
		} else if (addon === "husky") {
			addonsList.push("- **Husky** - Git hooks for code quality");
		} else if (addon === "starlight") {
			addonsList.push("- **Starlight** - Documentation site with Astro");
		} else if (addon === "turborepo") {
			addonsList.push("- **Turborepo** - Optimized monorepo build system");
		}
	}

	return addonsList.join("\n");
}

function generateDatabaseSetup(
	database: Database,
	_auth: boolean,
	packageManagerRunCmd: string,
	orm: ORM,
	dbSetup: DatabaseSetup,
): string {
	if (database === "none") {
		return "";
	}

	let setup = "## Database Setup\n\n";

	if (database === "sqlite") {
		setup += `This project uses SQLite${
			orm === "drizzle"
				? " with Drizzle ORM"
				: orm === "prisma"
					? " with Prisma"
					: ` with ${orm}`
		}.

1. Start the local SQLite database:
${
	dbSetup === "d1"
		? "Local development for a Cloudflare D1 database will already be running as part of the `wrangler dev` command."
		: `\`\`\`bash
cd apps/server && ${packageManagerRunCmd} db:local
\`\`\`
`
}

2. Update your \`.env\` file in the \`apps/server\` directory with the appropriate connection details if needed.
`;
	} else if (database === "postgres") {
		setup += `This project uses PostgreSQL${
			orm === "drizzle"
				? " with Drizzle ORM"
				: orm === "prisma"
					? " with Prisma"
					: ` with ${orm}`
		}.

1. Make sure you have a PostgreSQL database set up.
2. Update your \`apps/server/.env\` file with your PostgreSQL connection details.
`;
	} else if (database === "mysql") {
		setup += `This project uses MySQL${
			orm === "drizzle"
				? " with Drizzle ORM"
				: orm === "prisma"
					? " with Prisma"
					: ` with ${orm}`
		}.

1. Make sure you have a MySQL database set up.
2. Update your \`apps/server/.env\` file with your MySQL connection details.
`;
	} else if (database === "mongodb") {
		setup += `This project uses MongoDB ${
			orm === "mongoose"
				? "with Mongoose"
				: orm === "prisma"
					? "with Prisma ORM"
					: `with ${orm}`
		}.

1. Make sure you have MongoDB set up.
2. Update your \`apps/server/.env\` file with your MongoDB connection URI.
`;
	}

	setup += `
3. ${
		orm === "prisma"
			? `Generate the Prisma client and push the schema:
\`\`\`bash
${packageManagerRunCmd} db:push
\`\`\``
			: orm === "drizzle"
				? `Apply the schema to your database:
\`\`\`bash
${packageManagerRunCmd} db:push
\`\`\``
				: `Apply the schema to your database:
\`\`\`bash
${packageManagerRunCmd} db:push
\`\`\``
	}
`;

	return setup;
}

function generateScriptsList(
	packageManagerRunCmd: string,
	database: Database,
	orm: ORM,
	_auth: boolean,
	hasNative: boolean,
	addons: Addons[],
	backend: string,
): string {
	const isConvex = backend === "convex";
	const isBackendNone = backend === "none";

	let scripts = `- \`${packageManagerRunCmd} dev\`: Start all applications in development mode
- \`${packageManagerRunCmd} build\`: Build all applications`;

	scripts += `
- \`${packageManagerRunCmd} dev:web\`: Start only the web application`;

	if (isConvex) {
		scripts += `
- \`${packageManagerRunCmd} dev:setup\`: Setup and configure your Convex project`;
	} else if (!isBackendNone) {
		scripts += `
- \`${packageManagerRunCmd} dev:server\`: Start only the server`;
	}

	scripts += `
- \`${packageManagerRunCmd} check-types\`: Check TypeScript types across all apps`;

	if (hasNative) {
		scripts += `
- \`${packageManagerRunCmd} dev:native\`: Start the React Native/Expo development server`;
	}

	if (database !== "none" && !isConvex) {
		scripts += `
- \`${packageManagerRunCmd} db:push\`: Push schema changes to database
- \`${packageManagerRunCmd} db:studio\`: Open database studio UI`;

		if (database === "sqlite" && orm === "drizzle") {
			scripts += `
- \`cd apps/server && ${packageManagerRunCmd} db:local\`: Start the local SQLite database`;
		}
	}

	if (addons.includes("biome")) {
		scripts += `
- \`${packageManagerRunCmd} check\`: Run Biome formatting and linting`;
	}

	if (addons.includes("pwa")) {
		scripts += `
- \`cd apps/web && ${packageManagerRunCmd} generate-pwa-assets\`: Generate PWA assets`;
	}

	if (addons.includes("tauri")) {
		scripts += `
- \`cd apps/web && ${packageManagerRunCmd} desktop:dev\`: Start Tauri desktop app in development
- \`cd apps/web && ${packageManagerRunCmd} desktop:build\`: Build Tauri desktop app`;
	}

	if (addons.includes("starlight")) {
		scripts += `
- \`cd apps/docs && ${packageManagerRunCmd} dev\`: Start documentation site
- \`cd apps/docs && ${packageManagerRunCmd} build\`: Build documentation site`;
	}

	return scripts;
}
