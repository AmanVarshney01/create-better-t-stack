import path from "node:path";
import { log } from "@clack/prompts";
import fs from "fs-extra";
import pc from "picocolors";
import type { Frontend, ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";
import { setupStarlight } from "./starlight-setup";
import { setupTauri } from "./tauri-setup";
import { addPwaToViteConfig } from "./vite-pwa-setup";

export async function setupAddons(config: ProjectConfig, isAddCommand = false) {
	const { addons, frontend, projectDir } = config;
	const hasReactWebFrontend =
		frontend.includes("react-router") ||
		frontend.includes("tanstack-router") ||
		frontend.includes("next");
	const hasNuxtFrontend = frontend.includes("nuxt");
	const hasSvelteFrontend = frontend.includes("svelte");
	const hasSolidFrontend = frontend.includes("solid");
	const hasNextFrontend = frontend.includes("next");

	if (addons.includes("turborepo")) {
		await addPackageDependency({
			devDependencies: ["turbo"],
			projectDir,
		});

		if (isAddCommand) {
			log.info(`${pc.yellow("Update your package.json scripts:")}

${pc.dim("Replace:")} ${pc.yellow('"pnpm -r dev"')} ${pc.dim("→")} ${pc.green(
				'"turbo dev"',
			)}
${pc.dim("Replace:")} ${pc.yellow('"pnpm --filter web dev"')} ${pc.dim(
				"→",
			)} ${pc.green('"turbo -F web dev"')}

${pc.cyan("Docs:")} ${pc.underline("https://turborepo.com/docs")}
		`);
		}
	}

	if (addons.includes("pwa") && (hasReactWebFrontend || hasSolidFrontend)) {
		await setupPwa(projectDir, frontend);
	}
	if (
		addons.includes("tauri") &&
		(hasReactWebFrontend ||
			hasNuxtFrontend ||
			hasSvelteFrontend ||
			hasSolidFrontend ||
			hasNextFrontend)
	) {
		await setupTauri(config);
	}
	if (addons.includes("biome")) {
		await setupBiome(projectDir);
	}
	if (addons.includes("husky")) {
		await setupHusky(projectDir);
	}
	if (addons.includes("starlight")) {
		await setupStarlight(config);
	}
	if (addons.includes("nuqs")) {
		await setupNuqs(config);
	}
}

function getWebAppDir(projectDir: string, frontends: Frontend[]): string {
	if (
		frontends.some((f) =>
			["react-router", "tanstack-router", "nuxt", "svelte", "solid"].includes(
				f,
			),
		)
	) {
		return path.join(projectDir, "apps/web");
	}
	return path.join(projectDir, "apps/web");
}

async function setupBiome(projectDir: string) {
	await addPackageDependency({
		devDependencies: ["@biomejs/biome"],
		projectDir,
	});

	const packageJsonPath = path.join(projectDir, "package.json");
	if (await fs.pathExists(packageJsonPath)) {
		const packageJson = await fs.readJson(packageJsonPath);

		packageJson.scripts = {
			...packageJson.scripts,
			check: "biome check --write .",
		};

		await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
	}
}

async function setupHusky(projectDir: string) {
	await addPackageDependency({
		devDependencies: ["husky", "lint-staged"],
		projectDir,
	});

	const packageJsonPath = path.join(projectDir, "package.json");
	if (await fs.pathExists(packageJsonPath)) {
		const packageJson = await fs.readJson(packageJsonPath);

		packageJson.scripts = {
			...packageJson.scripts,
			prepare: "husky",
		};

		packageJson["lint-staged"] = {
			"*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}": [
				"biome check --write .",
			],
		};

		await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
	}
}

async function setupPwa(projectDir: string, frontends: Frontend[]) {
	const isCompatibleFrontend = frontends.some((f) =>
		["react-router", "tanstack-router", "solid"].includes(f),
	);
	if (!isCompatibleFrontend) return;

	const clientPackageDir = getWebAppDir(projectDir, frontends);

	if (!(await fs.pathExists(clientPackageDir))) {
		return;
	}

	await addPackageDependency({
		dependencies: ["vite-plugin-pwa"],
		devDependencies: ["@vite-pwa/assets-generator"],
		projectDir: clientPackageDir,
	});

	const clientPackageJsonPath = path.join(clientPackageDir, "package.json");
	if (await fs.pathExists(clientPackageJsonPath)) {
		const packageJson = await fs.readJson(clientPackageJsonPath);

		packageJson.scripts = {
			...packageJson.scripts,
			"generate-pwa-assets": "pwa-assets-generator",
		};

		await fs.writeJson(clientPackageJsonPath, packageJson, { spaces: 2 });
	}

	const viteConfigTs = path.join(clientPackageDir, "vite.config.ts");

	if (await fs.pathExists(viteConfigTs)) {
		await addPwaToViteConfig(viteConfigTs, path.basename(projectDir));
	}
}

async function setupNuqs(config: ProjectConfig) {
	const { frontend, projectDir } = config;
	
	// Nuqs is compatible with web frameworks only
	const compatibleFrontends = frontend.filter(f => 
		["react-router", "tanstack-router", "tanstack-start", "next", "nuxt", "svelte", "solid"].includes(f)
	);
	
	if (compatibleFrontends.length === 0) return;

	const webAppDir = getWebAppDir(projectDir, frontend);

	if (!(await fs.pathExists(webAppDir))) {
		return;
	}

	// Add nuqs dependency to the web app
	await addPackageDependency({
		dependencies: ["nuqs"],
		projectDir: webAppDir,
	});

	// Setup nuqs for different frameworks
	for (const framework of compatibleFrontends) {
		await setupNuqsForFramework(framework, webAppDir);
	}

	// Copy example components
	await copyNuqsExamples(webAppDir);
}

async function setupNuqsForFramework(framework: Frontend, webAppDir: string) {
	if (framework === "next") {
		await setupNuqsForNext(webAppDir);
	} else if (framework === "tanstack-router") {
		await setupNuqsForTanstackRouter(webAppDir);
	} else if (framework === "react-router") {
		await setupNuqsForReactRouter(webAppDir);
	} else if (framework === "tanstack-start") {
		await setupNuqsForTanstackStart(webAppDir);
	}
	// TODO: Add support for other frameworks (nuxt, svelte, solid)
}

async function setupNuqsForNext(webAppDir: string) {
	// Modify the providers component to include NuqsAdapter
	const providersPath = path.join(webAppDir, "src/components/providers.tsx");
	
	if (await fs.pathExists(providersPath)) {
		let providersContent = await fs.readFile(providersPath, "utf-8");
		
		// Add import for NuqsAdapter
		if (!providersContent.includes("NuqsAdapter")) {
			providersContent = providersContent.replace(
				'"use client";',
				'"use client";\n\nimport { NuqsAdapter } from "nuqs/adapters/next/app";'
			);
			
			// Wrap children with NuqsAdapter
			providersContent = providersContent.replace(
				/{children}/g,
				"<NuqsAdapter>{children}</NuqsAdapter>"
			);
			
			await fs.writeFile(providersPath, providersContent);
		}
	}
}

async function setupNuqsForTanstackRouter(webAppDir: string) {
	// Modify main.tsx to wrap RouterProvider with NuqsAdapter
	const mainPath = path.join(webAppDir, "src/main.tsx");
	
	if (await fs.pathExists(mainPath)) {
		let mainContent = await fs.readFile(mainPath, "utf-8");
		
		// Add import for NuqsAdapter
		if (!mainContent.includes("NuqsAdapter")) {
			mainContent = mainContent.replace(
				'import ReactDOM from "react-dom/client";',
				'import ReactDOM from "react-dom/client";\nimport { NuqsAdapter } from "nuqs/adapters/react";'
			);
			
			// Wrap RouterProvider with NuqsAdapter
			mainContent = mainContent.replace(
				"root.render(<RouterProvider router={router} />);",
				"root.render(<NuqsAdapter><RouterProvider router={router} /></NuqsAdapter>);"
			);
			
			await fs.writeFile(mainPath, mainContent);
		}
	}
}

async function setupNuqsForReactRouter(webAppDir: string) {
	// Modify main.tsx to wrap RouterProvider with NuqsAdapter
	const mainPath = path.join(webAppDir, "src/main.tsx");
	
	if (await fs.pathExists(mainPath)) {
		let mainContent = await fs.readFile(mainPath, "utf-8");
		
		// Add import for NuqsAdapter
		if (!mainContent.includes("NuqsAdapter")) {
			mainContent = mainContent.replace(
				'import { createRoot } from "react-dom/client";',
				'import { createRoot } from "react-dom/client";\nimport { NuqsAdapter } from "nuqs/adapters/react-router/v6";'
			);
			
			// Wrap RouterProvider with NuqsAdapter
			mainContent = mainContent.replace(
				/<RouterProvider router={router} \/>/,
				"<NuqsAdapter><RouterProvider router={router} /></NuqsAdapter>"
			);
			
			await fs.writeFile(mainPath, mainContent);
		}
	}
}

async function setupNuqsForTanstackStart(webAppDir: string) {
	// TanStack Start setup - similar to TanStack Router but with different adapter
	const mainPath = path.join(webAppDir, "src/main.tsx");
	
	if (await fs.pathExists(mainPath)) {
		let mainContent = await fs.readFile(mainPath, "utf-8");
		
		// Add import for NuqsAdapter
		if (!mainContent.includes("NuqsAdapter")) {
			mainContent = mainContent.replace(
				'import ReactDOM from "react-dom/client";',
				'import ReactDOM from "react-dom/client";\nimport { NuqsAdapter } from "nuqs/adapters/react";'
			);
			
			// Wrap RouterProvider with NuqsAdapter
			mainContent = mainContent.replace(
				"root.render(<RouterProvider router={router} />);",
				"root.render(<NuqsAdapter><RouterProvider router={router} /></NuqsAdapter>);"
			);
			
			await fs.writeFile(mainPath, mainContent);
		}
	}
}

async function copyNuqsExamples(webAppDir: string) {
	const componentsDir = path.join(webAppDir, "src/components");
	const examplesDir = path.join(componentsDir, "nuqs-examples");
	
	// Ensure the examples directory exists
	await fs.ensureDir(examplesDir);
	
	// Copy example components (we'll create these as simple strings for now)
	const basicExample = `'use client'

import { useQueryState } from 'nuqs'

export function BasicNuqsExample() {
  const [name, setName] = useQueryState('name')
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">URL State Management with Nuqs</h2>
      <div className="space-y-2">
        <input
          value={name || ''}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name..."
          className="px-3 py-2 border rounded-md"
        />
        <button
          onClick={() => setName(null)}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Clear
        </button>
        <p className="text-gray-600">
          Hello, {name || 'anonymous visitor'}!
        </p>
      </div>
    </div>
  )
}`;

	const advancedExample = `'use client'

import { useQueryStates, parseAsInteger, parseAsString, parseAsBoolean } from 'nuqs'

export function AdvancedNuqsExample() {
  const [state, setState] = useQueryStates({
    search: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
    showArchived: parseAsBoolean.withDefault(false)
  })

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Advanced URL State with Nuqs</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Search</label>
          <input
            value={state.search}
            onChange={(e) => setState({ search: e.target.value })}
            placeholder="Search..."
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Page</label>
          <input
            type="number"
            value={state.page}
            onChange={(e) => setState({ page: parseInt(e.target.value) || 1 })}
            min="1"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={state.showArchived}
              onChange={(e) => setState({ showArchived: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm font-medium">Show Archived</span>
          </label>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-md">
        <h3 className="font-medium mb-2">Current State:</h3>
        <pre className="text-sm text-gray-600">
          {JSON.stringify(state, null, 2)}
        </pre>
      </div>
      
      <button
        onClick={() => setState(null)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Reset All
      </button>
    </div>
  )
}`;

	// Write the example files
	await fs.writeFile(path.join(examplesDir, "basic-example.tsx"), basicExample);
	await fs.writeFile(path.join(examplesDir, "advanced-example.tsx"), advancedExample);
}
