import path from "node:path";
import consola from "consola";
import fs from "fs-extra";
import type {
	Addons,
	API,
	Auth,
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

function generateReadmeContent(options: ProjectConfig) {
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
		webDeploy,
		serverDeploy,
	} = options;

	const isConvex = backend === "convex";
	const hasReactRouter = frontend.includes("react-router");
	const hasNative =
		frontend.includes("native-bare") ||
		frontend.includes("native-uniwind") ||
		frontend.includes("native-unistyles");
	const hasSvelte = frontend.includes("svelte");

	const packageManagerRunCmd = `${packageManager} run`;

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

Follow the prompts to create a new Convex project and connect it to your application.${
				auth === "clerk"
					? " See [Convex + Clerk guide](https://docs.convex.dev/auth/clerk) for auth setup."
					: ""
			}`
		: generateDatabaseSetup(
				database,
				auth,
				packageManagerRunCmd,
				orm,
				options.dbSetup,
				options.serverDeploy,
				options.backend,
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

${generateWorkersRuntimeNotes(runtime)}

${generateDeploymentCommands(packageManagerRunCmd, webDeploy, serverDeploy)}

## Project Structure

\`\`\`
${generateProjectStructure(
	projectName,
	frontend,
	backend,
	addons,
	isConvex,
	api,
	auth,
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
) {
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
) {
	const instructions: string[] = [];

	const hasFrontendNone = frontend.length === 0 || frontend.includes("none");
	const isBackendNone = backend === "none";
	const isBackendSelf = backend === "self";

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
			if (isBackendSelf) {
				instructions.push(
					`Open [http://localhost:${webPort}](http://localhost:${webPort}) in your browser to see your fullstack application.`,
				);
			} else {
				instructions.push(
					`Open [http://localhost:${webPort}](http://localhost:${webPort}) in your browser to see the web application.`,
				);
			}
		}
	}

	if (hasNative) {
		instructions.push("Use the Expo Go app to run the mobile application.");
	}

	if (isConvex) {
		instructions.push(
			"Your app will connect to the Convex cloud backend automatically.",
		);
	} else if (!isBackendNone && !isBackendSelf) {
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
	auth: Auth,
) {
	const structure: string[] = [`${projectName}/`, "├── apps/"];

	const hasFrontendNone = frontend.length === 0 || frontend.includes("none");
	const isBackendNone = backend === "none";
	const isBackendSelf = backend === "self";

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

			if (isBackendSelf) {
				structure.push(
					`│   └── web/         # Fullstack application (${frontendType})`,
				);
			} else {
				structure.push(
					`│   ├── web/         # Frontend application (${frontendType})`,
				);
			}
		}
	}

	const hasNative =
		frontend.includes("native-bare") ||
		frontend.includes("native-uniwind") ||
		frontend.includes("native-unistyles");
	if (hasNative) {
		if (isBackendSelf) {
			structure.push(
				"│   ├── native/      # Mobile application (React Native, Expo)",
			);
		} else {
			structure.push(
				"│   ├── native/      # Mobile application (React Native, Expo)",
			);
		}
	}

	if (addons.includes("starlight")) {
		if (isBackendSelf) {
			structure.push(
				"│   ├── docs/        # Documentation site (Astro Starlight)",
			);
		} else {
			structure.push(
				"│   ├── docs/        # Documentation site (Astro Starlight)",
			);
		}
	}

	if (!isBackendSelf && !isBackendNone && !isConvex) {
		const backendName = backend[0].toUpperCase() + backend.slice(1);
		const apiName = api !== "none" ? api.toUpperCase() : "";
		const backendDesc = apiName ? `${backendName}, ${apiName}` : backendName;
		structure.push(`│   └── server/      # Backend API (${backendDesc})`);
	}

	if (isConvex || !isBackendNone) {
		structure.push("├── packages/");

		if (isConvex) {
			structure.push(
				"│   ├── backend/     # Convex backend functions and schema",
			);
			if (auth === "clerk") {
				structure.push(
					"│   │   ├── convex/    # Convex functions and schema",
					"│   │   └── .env.local # Convex environment variables",
				);
			}
		}

		if (!isConvex) {
			structure.push("│   ├── api/         # API layer / business logic");

			if (auth !== "none") {
				structure.push(
					"│   ├── auth/        # Authentication configuration & logic",
				);
			}

			if (api !== "none" || auth !== "none") {
				structure.push("│   └── db/          # Database schema & queries");
			}
		}
	}

	return structure.join("\n");
}

function generateFeaturesList(
	database: Database,
	auth: Auth,
	addons: Addons[],
	orm: ORM,
	runtime: Runtime,
	frontend: Frontend[],
	backend: string,
	api: API,
) {
	const isConvex = backend === "convex";
	const isBackendNone = backend === "none";
	const hasTanstackRouter = frontend.includes("tanstack-router");
	const hasReactRouter = frontend.includes("react-router");
	const hasNative =
		frontend.includes("native-bare") ||
		frontend.includes("native-uniwind") ||
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

	if (auth !== "none") {
		const authLabel = auth === "clerk" ? "Clerk" : "Better-Auth";
		addonsList.push(`- **Authentication** - ${authLabel}`);
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
	_auth: Auth,
	packageManagerRunCmd: string,
	orm: ORM,
	dbSetup: DatabaseSetup,
	_serverDeploy?: string,
	backend?: string,
) {
	if (database === "none") {
		return "";
	}

	const isBackendSelf = backend === "self";
	const envPath = isBackendSelf ? "apps/web/.env" : "apps/server/.env";
	const dbLocalPath = "packages/db";

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
		? "D1 local development and migrations are handled automatically by Alchemy during dev and deploy."
		: `\`\`\`bash
cd ${dbLocalPath} && ${packageManagerRunCmd} db:local
\`\`\`
`
}

2. Update your \`.env\` file in the \`${isBackendSelf ? "apps/web" : "apps/server"}\` directory with the appropriate connection details if needed.
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
2. Update your \`${envPath}\` file with your PostgreSQL connection details.
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
2. Update your \`${envPath}\` file with your MySQL connection details.
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
2. Update your \`${envPath}\` file with your MongoDB connection URI.
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
	_auth: Auth,
	hasNative: boolean,
	addons: Addons[],
	backend: string,
) {
	const isConvex = backend === "convex";
	const isBackendNone = backend === "none";
	const isBackendSelf = backend === "self";

	let scripts = `- \`${packageManagerRunCmd} dev\`: Start all applications in development mode
- \`${packageManagerRunCmd} build\`: Build all applications`;

	if (!isBackendSelf) {
		scripts += `
- \`${packageManagerRunCmd} dev:web\`: Start only the web application`;
	}

	if (isConvex) {
		scripts += `
- \`${packageManagerRunCmd} dev:setup\`: Setup and configure your Convex project`;
	} else if (!isBackendNone && !isBackendSelf) {
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
- \`cd packages/db && ${packageManagerRunCmd} db:local\`: Start the local SQLite database`;
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

function generateWorkersRuntimeNotes(runtime: Runtime) {
	if (runtime !== "workers") {
		return "";
	}

	return `
## Before Deploying to Cloudflare

When you are ready to deploy your app to Cloudflare Workers, you'll have to make a couple changes.
- Change your url environment variables to match your \`*.workers.dev\` domains generated by Cloudflare:

\`\`\`bash
# apps/web/.env
SERVER_URL={your-production-server-domain}

# apps/server/.env
CORS_ORIGIN={your-production-web-domain}
BETTER_AUTH_URL={your-production-server-domain}
\`\`\`
- In \`apps/server/src/lib/auth.ts\`, uncomment the \`session.cookieCache\` and \`advanced.crossSubDomainCookies\` sections and replace \`<your-workers-subdomain>\` with your actual workers subdomain. These settings are required to ensure cookies are transferred properly between your web and server domains.
`;
}

function generateDeploymentCommands(
	packageManagerRunCmd: string,
	webDeploy?: string,
	serverDeploy?: string,
) {
	const lines: string[] = [];

	if (webDeploy === "alchemy" || serverDeploy === "alchemy") {
		lines.push("## Deployment (Alchemy)");
		if (webDeploy === "alchemy" && serverDeploy !== "alchemy") {
			lines.push(
				`- Web dev: cd apps/web && ${packageManagerRunCmd} dev`,
				`- Web deploy: cd apps/web && ${packageManagerRunCmd} deploy`,
				`- Web destroy: cd apps/web && ${packageManagerRunCmd} destroy`,
			);
		}
		if (serverDeploy === "alchemy" && webDeploy !== "alchemy") {
			lines.push(
				`- Server dev: cd apps/server && ${packageManagerRunCmd} dev`,
				`- Server deploy: cd apps/server && ${packageManagerRunCmd} deploy`,
				`- Server destroy: cd apps/server && ${packageManagerRunCmd} destroy`,
			);
		}
		if (webDeploy === "alchemy" && serverDeploy === "alchemy") {
			lines.push(
				`- Dev: ${packageManagerRunCmd} dev`,
				`- Deploy: ${packageManagerRunCmd} deploy`,
				`- Destroy: ${packageManagerRunCmd} destroy`,
			);
		}
	}

	return lines.length ? `\n${lines.join("\n")}\n` : "";
}
