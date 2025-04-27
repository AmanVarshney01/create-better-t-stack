import path from "node:path";
import consola from "consola";
import fs from "fs-extra";
import type {
	ProjectAddons,
	ProjectConfig,
	ProjectDatabase,
	ProjectFrontend,
	ProjectOrm,
	ProjectRuntime,
} from "../types";

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
	} = options;

	const hasReactRouter = frontend.includes("react-router");
	const hasTanstackRouter = frontend.includes("tanstack-router");
	const hasNative = frontend.includes("native");
	const hasNext = frontend.includes("next");
	const hasTanstackStart = frontend.includes("tanstack-start");
	const hasSvelte = frontend.includes("svelte");
	const hasNuxt = frontend.includes("nuxt");

	const packageManagerRunCmd =
		packageManager === "npm" ? "npm run" : packageManager;

	let webPort = "3001";
	if (hasReactRouter || hasSvelte) {
		webPort = "5173";
	}

	return `# ${projectName}

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines React, ${
		hasTanstackRouter
			? "TanStack Router"
			: hasReactRouter
				? "React Router"
				: hasNext
					? "Next.js"
					: hasTanstackStart
						? "TanStack Start"
						: hasSvelte
							? "SvelteKit"
							: hasNuxt
								? "Nuxt"
								: ""
	}, ${backend[0].toUpperCase() + backend.slice(1)}, tRPC, and more.

## Features

${generateFeaturesList(database, auth, addons, orm, runtime, frontend, backend)}

## Getting Started

First, install the dependencies:

\`\`\`bash
${packageManager} install
\`\`\`

${generateDatabaseSetup(database, auth, packageManagerRunCmd, orm)}

Then, run the development server:

\`\`\`bash
${packageManagerRunCmd} dev
\`\`\`

${
	hasTanstackRouter ||
	hasReactRouter ||
	hasNext ||
	hasTanstackStart ||
	hasSvelte ||
	hasNuxt
		? `Open [http://localhost:${webPort}](http://localhost:${webPort}) in your browser to see the web application.`
		: ""
}
${hasNative ? "Use the Expo Go app to run the mobile application.\n" : ""}
The API is running at [http://localhost:3000](http://localhost:3000).

${
	addons.includes("pwa") && hasReactRouter
		? "\n## PWA Support with React Router v7\n\nThere is a known compatibility issue between VitePWA and React Router v7.\nSee: https://github.com/vite-pwa/vite-plugin-pwa/issues/809\n"
		: ""
}

## Project Structure

\`\`\`
${projectName}/
├── apps/
${
	hasTanstackRouter ||
	hasReactRouter ||
	hasNext ||
	hasTanstackStart ||
	hasSvelte ||
	hasNuxt
		? `│   ├── web/         # Frontend application (${
				hasTanstackRouter
					? "React + TanStack Router"
					: hasReactRouter
						? "React + React Router"
						: hasNext
							? "Next.js"
							: hasTanstackStart
								? "React + TanStack Start"
								: hasSvelte
									? "SvelteKit"
									: hasNuxt
										? "Nuxt"
										: ""
			})\n`
		: ""
}${
	hasNative
		? "│   ├── native/      # Mobile application (React Native, Expo)\n"
		: ""
}${
	addons.includes("starlight")
		? "│   ├── docs/        # Documentation site (Astro Starlight)\n"
		: ""
}│   └── server/      # Backend API (${
		backend[0].toUpperCase() + backend.slice(1)
	}, tRPC)
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

function generateFeaturesList(
	database: ProjectDatabase,
	auth: boolean,
	addons: ProjectAddons[],
	orm: ProjectOrm,
	runtime: ProjectRuntime,
	frontend: ProjectFrontend[],
	backend: string,
): string {
	const hasTanstackRouter = frontend.includes("tanstack-router");
	const hasReactRouter = frontend.includes("react-router");
	const hasNative = frontend.includes("native");
	const hasNext = frontend.includes("next");
	const hasTanstackStart = frontend.includes("tanstack-start");
	const hasSvelte = frontend.includes("svelte");
	const hasNuxt = frontend.includes("nuxt");

	const addonsList = [
		"- **TypeScript** - For type safety and improved developer experience",
	];

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
		addonsList.push("- **SvelteKit** - Web framework for building Svelte apps");
	} else if (hasNuxt) {
		addonsList.push("- **Nuxt** - The Intuitive Vue Framework");
	}

	if (hasNative) {
		addonsList.push("- **React Native** - Build mobile apps using React");
		addonsList.push("- **Expo** - Tools for React Native development");
	}

	addonsList.push(
		"- **TailwindCSS** - Utility-first CSS for rapid UI development",
		"- **shadcn/ui** - Reusable UI components",
	);

	if (backend === "hono") {
		addonsList.push("- **Hono** - Lightweight, performant server framework");
	} else if (backend === "express") {
		addonsList.push("- **Express** - Fast, unopinionated web framework");
	} else if (backend === "elysia") {
		addonsList.push("- **Elysia** - Type-safe, high-performance framework");
	} else if (backend === "next") {
		addonsList.push("- **Next.js** - Full-stack React framework");
	}

	addonsList.push(
		"- **tRPC** - End-to-end type-safe APIs",
		`- **${runtime === "bun" ? "Bun" : "Node.js"}** - Runtime environment`,
	);

	if (database !== "none") {
		addonsList.push(
			`- **${
				orm === "drizzle" ? "Drizzle" : "Prisma"
			}** - TypeScript-first ORM`,
			`- **${
				database === "sqlite"
					? "SQLite/Turso"
					: database === "postgres"
						? "PostgreSQL"
						: database === "mysql"
							? "MySQL"
							: "MongoDB"
			}** - Database engine`,
		);
	}

	if (auth) {
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
		}
	}

	return addonsList.join("\n");
}

function generateDatabaseSetup(
	database: ProjectDatabase,
	auth: boolean,
	packageManagerRunCmd: string,
	orm: ProjectOrm,
): string {
	if (database === "none") {
		return "";
	}

	let setup = "## Database Setup\n\n";

	if (database === "sqlite") {
		setup += `This project uses SQLite${
			orm === "drizzle" ? " with Drizzle ORM" : " with Prisma"
		}.

1. Start the local SQLite database:
\`\`\`bash
cd apps/server && ${packageManagerRunCmd} db:local
\`\`\`

2. Update your \`.env\` file in the \`apps/server\` directory with the appropriate connection details if needed.
`;
	} else if (database === "postgres") {
		setup += `This project uses PostgreSQL${
			orm === "drizzle" ? " with Drizzle ORM" : " with Prisma"
		}.

1. Make sure you have a PostgreSQL database set up.
2. Update your \`apps/server/.env\` file with your PostgreSQL connection details.
`;
	} else if (database === "mysql") {
		setup += `This project uses MySQL${
			orm === "drizzle" ? " with Drizzle ORM" : " with Prisma"
		}.

1. Make sure you have a MySQL database set up.
2. Update your \`apps/server/.env\` file with your MySQL connection details.
`;
	} else if (database === "mongodb") {
		setup += `This project uses MongoDB with Prisma ORM.

1. Make sure you have MongoDB set up.
2. Update your \`apps/server/.env\` file with your MongoDB connection URI.
`;
	}

	setup += `
${auth ? "3" : "3"}. ${
		orm === "prisma"
			? `Generate the Prisma client and push the schema:
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
	database: ProjectDatabase,
	orm: ProjectOrm,
	auth: boolean,
	hasNative: boolean,
	addons: ProjectAddons[],
	backend: string,
): string {
	let scripts = `- \`${packageManagerRunCmd} dev\`: Start all applications in development mode
- \`${packageManagerRunCmd} build\`: Build all applications
- \`${packageManagerRunCmd} dev:web\`: Start only the web application
- \`${packageManagerRunCmd} dev:server\`: Start only the server
- \`${packageManagerRunCmd} check-types\`: Check TypeScript types across all apps`;

	if (hasNative) {
		scripts += `
- \`${packageManagerRunCmd} dev:native\`: Start the React Native/Expo development server`;
	}

	if (database !== "none") {
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
