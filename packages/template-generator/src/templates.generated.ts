// Auto-generated - DO NOT EDIT
// Run 'bun run generate-templates' to regenerate

export const EMBEDDED_TEMPLATES: Map<string, string> = new Map([
  ["extras/_npmrc.hbs", `node-linker=isolated
{{#if (includes frontend "nuxt")}}
shamefully-hoist=true
strict-peer-dependencies=false
{{/if}}`],
  ["extras/env.d.ts.hbs", `import { type server } from "@{{projectName}}/infra/alchemy.run";

// This file infers types for the cloudflare:workers environment from your Alchemy Worker.
// @see https://alchemy.run/concepts/bindings/#type-safe-bindings

export type CloudflareEnv = typeof server.Env;

declare global {
  type Env = CloudflareEnv;
}

declare module "cloudflare:workers" {
  namespace Cloudflare {
    export interface Env extends CloudflareEnv {}
  }
}
`],
  ["extras/bunfig.toml.hbs", `[install]
{{#if (or (includes frontend "nuxt"))}}
linker = "hoisted" # having issues with Nuxt when linker is isolated
{{else}}
linker = "isolated"
{{/if}}`],
  ["extras/pnpm-workspace.yaml", `packages:
  - "apps/*"
  - "packages/*"
`],
  ["frontend/svelte/_gitignore", `node_modules

# Output
.output
.vercel
.netlify
.wrangler
.alchemy
/.svelte-kit
/build

# OS
.DS_Store
Thumbs.db

# Env
.env
.env.*
!.env.example
!.env.test

# Vite
vite.config.js.timestamp-*
vite.config.ts.timestamp-*
`],
  ["frontend/svelte/svelte.config.js.hbs", `import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter()
	}
};

export default config;
`],
  ["frontend/svelte/vite.config.ts.hbs", `import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
});
`],
  ["frontend/svelte/package.json.hbs", `{
	"name": "web",
	"private": true,
	"version": "0.0.1",
	"type": "module",
	"scripts": {
		"dev": "vite dev",
		"build": "vite build",
		"preview": "vite preview",
		"prepare": "svelte-kit sync || echo ''",
		"check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
		"check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"
	},
	"devDependencies": {
		"@sveltejs/adapter-auto": "^6.1.0",
		"@sveltejs/kit": "^2.31.1",
		"@sveltejs/vite-plugin-svelte": "^6.1.2",
		"@tailwindcss/vite": "^4.1.12",
		"svelte": "^5.38.1",
		"svelte-check": "^4.3.1",
		"tailwindcss": "^4.1.12",
		"vite": "^7.1.2"
	},
	"dependencies": {
		"@tanstack/svelte-form": "^1.19.2"
	}
}
`],
  ["frontend/svelte/tsconfig.json.hbs", `{
	"extends": "./.svelte-kit/tsconfig.json",
	"compilerOptions": {
		"allowJs": true,
		"checkJs": true,
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"resolveJsonModule": true,
		"skipLibCheck": true,
		"sourceMap": true,
		"strict": true,
		"moduleResolution": "bundler"
	}
	// Path aliases are handled by https://svelte.dev/docs/kit/configuration#alias
	// except $lib which is handled by https://svelte.dev/docs/kit/configuration#files
	//
	// If you want to overwrite includes/excludes, make sure to copy over the relevant includes/excludes
	// from the referenced tsconfig.json - TypeScript does not merge them in
}
`],
  ["frontend/svelte/_npmrc", `engine-strict=true
`],
  ["frontend/nuxt/_gitignore", `# Nuxt dev/build outputs
.output
.data
.nuxt
.nitro
.cache
dist
.wrangler
.alchemy

# Node dependencies
node_modules

# Logs
logs
*.log

# Misc
.DS_Store
.fleet
.idea

# Local env files
.env
.env.*
!.env.example

`],
  ["frontend/nuxt/package.json.hbs", `{
  "name": "web",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare"
  },
  "dependencies": {
    "@nuxt/ui": "4.2.1",
    "@nuxt/content": "^3.7.1",
    "@nuxtjs/mdc": "^0.17.4",
    "nuxt": "^4.1.2",
    "vue": "^3.5.21",
    "vue-router": "^4.5.1",
    "@vue/devtools-api": "^8.0.5"
  },
  "devDependencies": {
    "tailwindcss": "^4.1.13",
    "@iconify-json/lucide": "^1.2.57"
  }
}
`],
  ["frontend/nuxt/tsconfig.json.hbs", `{
  // https://nuxt.com/docs/guide/concepts/typescript
  "files": [],
  "references": [
    {
      "path": "./.nuxt/tsconfig.app.json"
    },
    {
      "path": "./.nuxt/tsconfig.server.json"
    },
    {
      "path": "./.nuxt/tsconfig.shared.json"
    },
    {
      "path": "./.nuxt/tsconfig.node.json"
    }
  ]
}
`],
  ["frontend/nuxt/nuxt.config.ts.hbs", `import "@{{projectName}}/env/web";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: 'latest',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui'
    {{#if (eq backend "convex")}},
    'convex-nuxt'
    {{/if}}
  ],
  css: ['~/assets/css/main.css'],
  devServer: {
    port: 3001
  },
  {{#if (eq backend "convex")}}
  convex: {
    url: process.env.NUXT_PUBLIC_CONVEX_URL,
  },
  {{else if (ne backend "self")}}
  runtimeConfig: {
    public: {
      serverUrl: process.env.NUXT_PUBLIC_SERVER_URL,
    }
  },
  {{/if}}
})
`],
  ["frontend/solid/_gitignore", `node_modules
.DS_Store
dist
dist-ssr
*.local
.env
.env.*

.wrangler
.alchemy
.dev.vars*`],
  ["frontend/solid/index.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="theme-color" content="#000000" />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`],
  ["frontend/solid/vite.config.ts.hbs", `import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import solidPlugin from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [
    tanstackRouter({ target: "solid", autoCodeSplitting: true }),
    solidPlugin(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3001,
  },
});`],
  ["frontend/solid/package.json.hbs", `{
  "name": "web",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "serve": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.1.13",
    "@tanstack/router-plugin": "^1.131.44",
    "@tanstack/solid-form": "^1.20.0",
    "@tanstack/solid-router": "^1.131.44",
    "lucide-solid": "^0.544.0",
    "solid-js": "^1.9.9",
    "tailwindcss": "^4.1.13"
  },
  "devDependencies": {
    "vite": "^7.1.5",
    "vite-plugin-solid": "^2.11.8"
  }
}
`],
  ["frontend/solid/tsconfig.json.hbs", `{
  "include": ["**/*.ts", "**/*.tsx"],
  "compilerOptions": {
    "target": "ES2022",
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vite/client"],

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,

    "skipLibCheck": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,

    "rootDirs": ["."],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
`],
  ["base/_gitignore", `# Dependencies
node_modules
.pnp
.pnp.js

# Build outputs
dist
build
*.tsbuildinfo

# Environment variables
.env
.env*.local

# IDEs and editors
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.idea
*.swp
*.swo
*~
.DS_Store

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*

# Turbo
.turbo

# Better-T-Stack
.alchemy

# Testing
coverage
.nyc_output

# Misc
*.tgz
.cache
tmp
temp`],
  ["base/package.json.hbs", `{
  "name": "better-t-stack",
  "private": true,
  "type": "module",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {}
}
`],
  ["base/tsconfig.json.hbs", `{
  "extends": "@{{projectName}}/config/tsconfig.base.json",
}
`],
  ["frontend/nuxt/app/app.vue.hbs", `<script setup lang="ts">
{{#if (eq api "orpc")}}
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
{{/if}}
</script>

<template>
    <NuxtLoadingIndicator />
    <UApp>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
    {{#if (eq api "orpc")}}
    <VueQueryDevtools />
    {{/if}}
</template>
`],
  ["frontend/nuxt/app/app.config.ts.hbs", `export default defineAppConfig({
  // https://ui.nuxt.com/getting-started/theme#design-system
  ui: {
    colors: {
      primary: 'emerald',
      neutral: 'neutral',
    },
    button: {
      defaultVariants: {
        // Set default button color to neutral
        // color: 'neutral'
      }
    }
  }
})
`],
  ["frontend/svelte/static/favicon.png", `[Binary file]`],
  ["frontend/nuxt/server/tsconfig.json", `{
  "extends": "../.nuxt/tsconfig.server.json"
}
`],
  ["frontend/svelte/src/app.d.ts", `// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
`],
  ["frontend/svelte/src/app.css", `@import "tailwindcss";

body {
  @apply bg-neutral-950 text-neutral-100;
}
`],
  ["frontend/svelte/src/app.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
`],
  ["addons/lefthook/lefthook.yml.hbs", `# Lefthook configuration
# https://github.com/evilmartians/lefthook

pre-commit:
  parallel: true
  jobs:
{{#if (includes addons "biome")}}
    - name: biome
      glob: "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}"
      run: {{packageManager}} biome check --write --no-errors-on-unmatched --files-ignore-unknown=true {staged_files}
      stage_fixed: true
{{else if (includes addons "oxlint")}}
    - name: oxlint
      run: {{packageManager}} oxlint --fix {staged_files}
      stage_fixed: true
    - name: oxfmt
      run: {{packageManager}} oxfmt --write {staged_files}
      stage_fixed: true
{{else}}
    # Add your pre-commit commands here
    # Example:
    # - name: lint
    #   run: {{packageManagerRunCmd}} lint
{{/if}}
`],
  ["frontend/nuxt/public/favicon.ico", `[Binary file]`],
  ["frontend/nuxt/public/robots.txt", `User-Agent: *
Disallow:
`],
  ["addons/biome/biome.json.hbs", `{
    "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
	"vcs": {
		"enabled": false,
		"clientKind": "git",
		"useIgnoreFile": false
	},
	"files": {
		"ignoreUnknown": false,
		"includes": [
			"**",
			"!**/.next",
			"!**/dist",
			"!**/.turbo",
			"!**/dev-dist",
			"!**/.zed",
			"!**/.vscode",
			"!**/routeTree.gen.ts",
			"!**/src-tauri",
			"!**/.nuxt",
			"!bts.jsonc",
			"!**/.expo",
			"!**/.wrangler",
			"!**/.alchemy",
			"!**/.svelte-kit",
			"!**/wrangler.jsonc",
			"!**/.source",
			"!**/convex/_generated"
		]
	},
	"formatter": {
		"enabled": true,
		"indentStyle": "tab"
	},
	"assist": { "actions": { "source": { "organizeImports": "on" } } },
	"linter": {
		"enabled": true,
		"rules": {
			"recommended": true,
			"correctness": {
				"useExhaustiveDependencies": "info"
			},
			"nursery": {
				"useSortedClasses": {
					"level": "warn",
					"fix": "safe",
					"options": {
						"functions": ["clsx", "cva", "cn"]
					}
				}
			},
			"style": {
				"noParameterAssign": "error",
				"useAsConstAssertion": "error",
				"useDefaultParameterLast": "error",
				"useEnumInitializers": "error",
				"useSelfClosingElements": "error",
				"useSingleVarDeclarator": "error",
				"noUnusedTemplateLiteral": "error",
				"useNumberNamespace": "error",
				"noInferrableTypes": "error",
				"noUselessElse": "error"
			}
		}
	},
	"javascript": {
		"formatter": {
			"quoteStyle": "double"
		}
	},
	"css": {
		"parser": {
			"tailwindDirectives": true
		}
	}
	{{#if (or (includes frontend "svelte") (includes frontend "nuxt"))}}
	,
	"overrides": [
		{
			"includes": ["**/*.svelte", "**/*.vue"],
			"linter": {
				"rules": {
					"style": {
						"useConst": "off",
						"useImportType": "off"
					},
					"correctness": {
						"noUnusedVariables": "off",
						"noUnusedImports": "off"
					}
				}
			}
		}
	]
	{{/if}}
}
`],
  ["frontend/solid/public/robots.txt", `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Disallow:
`],
  ["frontend/react/tanstack-start/vite.config.ts.hbs", `import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  server: {
    port: 3001,
  },
{{#if (and (eq backend "convex") (eq auth "better-auth"))}}
  ssr: {
    noExternal: ["@convex-dev/better-auth"],
  },
{{/if}}
});
`],
  ["frontend/react/tanstack-start/package.json.hbs", `{
  "name": "web",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "vite build",
    "serve": "vite preview",
    "dev": "vite dev"
  },
  "dependencies": {
    "@base-ui/react": "^1.0.0",
    "shadcn": "^3.6.2",
    "@tanstack/react-form": "^1.23.5",
    "@tailwindcss/vite": "^4.1.8",
    "@tanstack/react-query": "^5.80.6",
    "@tanstack/react-router": "^1.141.1",
    "@tanstack/react-router-with-query": "^1.130.17",
    "@tanstack/react-start": "^1.141.1",
    "@tanstack/router-plugin": "^1.141.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.525.0",
    "next-themes": "^0.4.6",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "sonner": "^2.0.3",
    "tailwindcss": "^4.1.3",
    "tailwind-merge": "^3.3.1",
    "tw-animate-css": "^1.2.5",
    "vite-tsconfig-paths": "^5.1.4"
  },
  "devDependencies": {
    "@tanstack/react-router-devtools": "^1.141.1",
    "@testing-library/dom": "^10.4.0",
    "@testing-library/react": "^16.2.0",
    "@types/react": "19.2.7",
    "@types/react-dom": "19.2.3",
    "@vitejs/plugin-react": "^5.0.4",
    "jsdom": "^26.0.0",
    "vite": "^7.0.2",
    "web-vitals": "^5.0.3"
  }
}
`],
  ["frontend/react/tanstack-start/tsconfig.json.hbs", `{
  "include": ["**/*.ts", "**/*.tsx"],
  "compilerOptions": {
    "target": "ES2022",
    "jsx": "react-jsx",
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vite/client"],

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,

    /* Linting */
    "skipLibCheck": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
`],
  ["frontend/react/next/postcss.config.mjs.hbs", `const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
`],
  ["frontend/react/next/next.config.ts.hbs", `import "@{{projectName}}/env/web";
{{#if (eq webDeploy "cloudflare")}}
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
{{/if}}
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	{{#if (includes examples "ai")}}
	transpilePackages: ["shiki"],
	{{/if}}
	{{#if (eq dbSetup "turso")}}
	serverExternalPackages: ["libsql", "@libsql/client"],
	{{/if}}
};

export default nextConfig;

{{#if (eq webDeploy "cloudflare")}}
initOpenNextCloudflareForDev();
{{/if}}
`],
  ["frontend/react/next/next-env.d.ts.hbs", `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
`],
  ["frontend/react/next/package.json.hbs", `{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3001",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "@base-ui/react": "^1.0.0",
    "shadcn": "^3.6.2",
    "@tanstack/react-form": "^1.27.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.546.0",
    "next": "^16.1.1",
    "next-themes": "^0.4.6",
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "sonner": "^2.0.5",
    "tailwind-merge": "^3.3.1",
    "tw-animate-css": "^1.3.4",
    "babel-plugin-react-compiler": "^1.0.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.10",
    "@types/node": "^20",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "tailwindcss": "^4.1.10",
    "typescript": "^5"
  }
}
`],
  ["frontend/react/next/tsconfig.json.hbs", `{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }{{#if (or (eq serverDeploy "cloudflare") (eq webDeploy "cloudflare"))}},
    "types": [
      "@cloudflare/workers-types"
    ]{{/if}}
  },
  "include": [
    {{#if (eq serverDeploy "cloudflare")}}
    "../server/env.d.ts",
    {{/if}}
    "./next-env.d.ts",
    "./**/*.ts",
    "./**/*.tsx",
    "./.next/types/**/*.ts"
  ],
  "exclude": [
    "./node_modules"
  ]
}
`],
  ["frontend/react/tanstack-router/index.html.hbs", `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{projectName}}</title>
  </head>

  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`],
  ["frontend/react/tanstack-router/vite.config.ts.hbs", `import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackRouter({}),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3001,
  },
});`],
  ["frontend/react/tanstack-router/package.json.hbs", `{
	"name": "web",
	"version": "0.0.0",
	"private": true,
	"type": "module",
	"scripts": {
		"dev": "vite dev",
		"build": "vite build",
		"serve": "vite preview",
		"start": "vite",
		"check-types": "tsc --noEmit"
	},
	"dependencies": {
        "@hookform/resolvers": "^5.1.1",
        "@base-ui/react": "^1.0.0",
        "shadcn": "^3.6.2",
        "@tanstack/react-form": "^1.12.3",
		"@tailwindcss/vite": "^4.0.15",
		"@tanstack/react-router": "^1.141.1",
		"class-variance-authority": "^0.7.1",
		"clsx": "^2.1.1",
		"lucide-react": "^0.473.0",
        "next-themes": "^0.4.6",
		"react": "19.2.3",
		"react-dom": "19.2.3",
        "sonner": "^2.0.5",
		"tailwind-merge": "^3.3.1",
		"tw-animate-css": "^1.2.5"
	},
	"devDependencies": {
		"@tanstack/react-router-devtools": "^1.141.1",
		"@tanstack/router-plugin": "^1.141.1",
		"@types/node": "^22.13.14",
		"@types/react": "19.2.7",
		"@types/react-dom": "19.2.3",
		"@vitejs/plugin-react": "^4.3.4",
		"postcss": "^8.5.3",
		"tailwindcss": "^4.0.15",
		"vite": "^6.2.2"
	}
}
`],
  ["frontend/react/tanstack-router/tsconfig.json.hbs", `{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "jsx": "react-jsx",
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "verbatimModuleSyntax": true,
    "skipLibCheck": true,
    "types": ["vite/client"],
    "rootDirs": ["."],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
`],
  ["frontend/native/uniwind/_gitignore", `node_modules/
.expo/
dist/
npm-debug.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/

# macOS
.DS_Store

# Temporary files created by Metro to check the health of the file watcher
.metro-health-check*

# UniWind generated types
uniwind-types.d.ts

`],
  ["frontend/native/uniwind/global.css", `@import "tailwindcss";
@import "uniwind";
@import "heroui-native/styles";

@source './node_modules/heroui-native/lib';
`],
  ["frontend/native/uniwind/package.json.hbs", `{
  "name": "native",
  "version": "1.0.0",
  "private": true,
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "dev": "expo start --clear",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "prebuild": "expo prebuild",
    "web": "expo start --web"
  },
  "dependencies": {
    "@expo/metro-runtime": "~6.1.2",
    "@expo/vector-icons": "^15.0.3",
    "@gorhom/bottom-sheet": "^5",
    "@react-navigation/drawer": "^7.3.9",
    "@react-navigation/elements": "^2.8.1",
    {{#if (includes examples "ai")}}
    "@stardazed/streams-text-encoding": "^1.0.2",
    "@ungap/structured-clone": "^1.3.0",
    {{/if}}
    "expo": "^54.0.23",
    "expo-constants": "~18.0.10",
    "expo-font": "~14.0.9",
    "expo-haptics": "^15.0.7",
    "expo-linking": "~8.0.8",
    "expo-network": "~8.0.7",
    "expo-router": "~6.0.14",
    "expo-secure-store": "~15.0.7",
    "expo-status-bar": "~3.0.8",
    "heroui-native": "^1.0.0-beta.9",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native": "0.81.5",
    "react-native-gesture-handler": "^2.28.0",
    "react-native-keyboard-controller": "1.18.5",
    "react-native-reanimated": "~4.1.1",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "react-native-svg": "15.12.1",
    "react-native-web": "^0.21.0",
    "react-native-worklets": "0.5.1",
    "tailwind-merge": "^3.4.0",
    "tailwind-variants": "^3.2.2",
    "tailwindcss": "^4.1.18",
    "uniwind": "^1.2.2"
  },
  "devDependencies": {
    "@types/node": "^24.10.0",
    "@types/react": "~19.1.0"
  }
}`],
  ["frontend/native/uniwind/app.json.hbs", `{
  "expo": {
    "scheme": "{{projectName}}",
    "userInterfaceStyle": "automatic",
    "orientation": "default",
    "web": {
      "bundler": "metro"
    },
    "name": "{{projectName}}",
    "slug": "{{projectName}}",
    "plugins": [
      "expo-font"
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    }
  }
}
`],
  ["frontend/native/uniwind/tsconfig.json.hbs", `{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx"
  ]
}`],
  ["frontend/native/uniwind/metro.config.js.hbs", `const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const uniwindConfig = withUniwindConfig(config, {
  cssEntryFile: "./global.css",
  dtsFile: "./uniwind-types.d.ts",
});

module.exports = uniwindConfig;

`],
  ["frontend/react/react-router/vite.config.ts.hbs", `import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
});`],
  ["frontend/react/react-router/react-router.config.ts", `import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
  appDirectory: "src",
} satisfies Config;
`],
  ["frontend/react/react-router/package.json.hbs", `{
  "name": "web",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "react-router build",
    "dev": "react-router dev",
    "start": "react-router-serve ./build/server/index.js",
    "typecheck": "react-router typegen && tsc"
  },
  "dependencies": {
    "@base-ui/react": "^1.0.0",
    "shadcn": "^3.6.2",
    "@react-router/fs-routes": "^7.10.1",
    "@react-router/node": "^7.10.1",
    "@react-router/serve": "^7.10.1",
    "@tanstack/react-form": "^1.27.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "isbot": "^5.1.28",
    "lucide-react": "^0.511.0",
    "next-themes": "^0.4.6",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-router": "^7.10.1",
    "sonner": "^2.0.3",
    "tailwind-merge": "^3.3.0",
    "tw-animate-css": "^1.3.2"
  },
  "devDependencies": {
    "@react-router/dev": "^7.10.1",
    "@tailwindcss/vite": "^4.1.18",
    "@types/node": "^20",
    "@types/react": "~19.2.7",
    "@types/react-dom": "^19.2.3",
    "react-router-devtools": "^1.1.0",
    "tailwindcss": "^4.1.18",
    "typescript": "^5.8.3",
    "vite": "^7.2.7",
    "vite-tsconfig-paths": "^5.1.4"
  }
}
`],
  ["frontend/react/react-router/tsconfig.json.hbs", `{
  "include": [
    "**/*",
    "**/.server/**/*",
    "**/.client/**/*",
    ".react-router/types/**/*"
  ],
  "compilerOptions": {
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "types": ["node", "vite/client"],
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "rootDirs": [".", "./.react-router/types"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "esModuleInterop": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true
  }
}
`],
  ["frontend/native/bare/_gitignore", `node_modules/
.expo/
dist/
npm-debug.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/

# macOS
.DS_Store

# Temporary files created by Metro to check the health of the file watcher
.metro-health-check*

`],
  ["frontend/native/bare/package.json.hbs", `{
  "name": "native",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "dev": "expo start --clear",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "prebuild": "expo prebuild",
    "web": "expo start --web"
  },
  "dependencies": {
    "@expo/vector-icons": "^15.0.2",
    "@react-navigation/bottom-tabs": "^7.2.0",
    "@react-navigation/drawer": "^7.1.1",
    "@react-navigation/native": "^7.0.14",
    "@tanstack/react-form": "^1.0.5",
    "@tanstack/react-query": "^5.85.5",
    {{#if (includes examples "ai")}}
    "@stardazed/streams-text-encoding": "^1.0.2",
    "@ungap/structured-clone": "^1.3.0",
    {{/if}}
		"expo": "^54.0.1",
    "expo-constants": "~18.0.8",
    "expo-crypto": "~15.0.6",
    "expo-linking": "~8.0.7",
    "expo-navigation-bar": "~5.0.8",
    "expo-network": "~8.0.7",
    "expo-router": "~6.0.0",
    "expo-secure-store": "~15.0.6",
    "expo-splash-screen": "~31.0.8",
    "expo-status-bar": "~3.0.7",
    "expo-system-ui": "~6.0.7",
    "expo-web-browser": "~15.0.6",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native": "0.81.4",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-reanimated": "~4.1.0",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "react-native-web": "^0.21.0",
    "react-native-worklets": "^0.5.1"
  },
  "devDependencies": {
    "@babel/core": "^7.26.10",
    "@types/react": "~19.1.10"
  },
  "private": true
}

`],
  ["frontend/native/bare/app.json.hbs", `{
	"expo": {
		"name": "{{projectName}}",
		"slug": "{{projectName}}",
		"version": "1.0.0",
		"orientation": "portrait",
		"icon": "./assets/images/icon.png",
		"scheme": "mybettertapp",
		"userInterfaceStyle": "automatic",
		"newArchEnabled": true,
		"ios": {
			"supportsTablet": true
		},
		"android": {
			"adaptiveIcon": {
				"backgroundColor": "#E6F4FE",
				"foregroundImage": "./assets/images/android-icon-foreground.png",
				"backgroundImage": "./assets/images/android-icon-background.png",
				"monochromeImage": "./assets/images/android-icon-monochrome.png"
			},
			"edgeToEdgeEnabled": true,
			"predictiveBackGestureEnabled": false,
			"package": "com.anonymous.mybettertapp"
		},
		"web": {
			"output": "static",
			"favicon": "./assets/images/favicon.png"
		},
		"plugins": [
			"expo-router",
			[
				"expo-splash-screen",
				{
					"image": "./assets/images/splash-icon.png",
					"imageWidth": 200,
					"resizeMode": "contain",
					"backgroundColor": "#ffffff",
					"dark": {
						"backgroundColor": "#000000"
					}
				}
			]
		],
		"experiments": {
			"typedRoutes": true,
			"reactCompiler": true
		}
	}
}

`],
  ["frontend/native/bare/tsconfig.json.hbs", `{
	"extends": "expo/tsconfig.base",
	"compilerOptions": {
		"strict": true,
		"paths": {
			"@/*": ["./*"]
		}
	},
	"include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}

`],
  ["frontend/native/bare/metro.config.js.hbs", `// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = true;

module.exports = config;

`],
  ["frontend/solid/src/main.tsx.hbs", `import { RouterProvider, createRouter } from "@tanstack/solid-router";
import { render } from "solid-js/web";
import { routeTree } from "./routeTree.gen";
import "./styles.css";
{{#if (eq api "orpc")}}
import { QueryClientProvider } from "@tanstack/solid-query";
import { orpc, queryClient } from "./utils/orpc";
{{/if}}

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,
  {{#if (eq api "orpc")}}
  context: { orpc, queryClient },
  {{/if}}
});

declare module "@tanstack/solid-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    {{#if (eq api "orpc")}}
    <QueryClientProvider client={queryClient}>
    {{/if}}
      <RouterProvider router={router} />
    {{#if (eq api "orpc")}}
    </QueryClientProvider>
    {{/if}}
  );
}

const rootElement = document.getElementById("app");
if (rootElement) {
  render(() => <App />, rootElement);
}
`],
  ["frontend/solid/src/styles.css", `@import "tailwindcss";

body {
  @apply bg-neutral-950 text-neutral-100;
}
`],
  ["packages/env/package.json.hbs", `{
	"name": "@{{projectName}}/env",
	"version": "0.0.0",
	"private": true,
	"type": "module",
	"exports": {}
}`],
  ["packages/env/tsconfig.json.hbs", `{
  "extends": "@{{projectName}}/config/tsconfig.base.json",
}
`],
  ["frontend/react/web-base/_gitignore", `# Dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# Testing
/coverage

# Build outputs
/.next/
/out/
/build/
/dist/
.vinxi
.output
.react-router/
.tanstack/
.nitro/

# Deployment
.vercel
.netlify
.wrangler
.alchemy

# Environment & local files
.env*
!.env.example
.DS_Store
*.pem
*.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
*.log*

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/*
!.vscode/extensions.json
.idea

# Other
dev-dist

.wrangler
.dev.vars*

.open-next
`],
  ["frontend/react/web-base/components.json", `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-lyra",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "menuColor": "default",
  "menuAccent": "subtle",
  "registries": {}
}
`],
  ["packages/config/tsconfig.base.json.hbs", `{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ESNext"],
    "verbatimModuleSyntax": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": [
      {{#if (eq runtime "node")}}
        "node"
      {{else if (eq runtime "bun")}}
        "bun"
      {{else if (eq runtime "workers")}}
        "node"
      {{else}}
        "node"
      {{/if}}{{#if (or (eq serverDeploy "cloudflare") (eq webDeploy "cloudflare"))}},
      "@cloudflare/workers-types"{{/if}}
    ]
  }
}`],
  ["packages/config/package.json.hbs", `{
  "name": "@{{projectName}}/config",
  "version": "0.0.0",
  "private": true
}
`],
  ["packages/infra/package.json.hbs", `{
  "name": "@{{projectName}}/infra",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "alchemy dev",
    "deploy": "alchemy deploy",
    "destroy": "alchemy destroy"
  }
}
`],
  ["packages/infra/alchemy.run.ts.hbs", `import alchemy from "alchemy";
{{#if (eq webDeploy "cloudflare")}}
{{#if (includes frontend "next")}}
import { Nextjs } from "alchemy/cloudflare";
{{else if (includes frontend "nuxt")}}
import { Nuxt } from "alchemy/cloudflare";
{{else if (includes frontend "svelte")}}
import { SvelteKit } from "alchemy/cloudflare";
{{else if (includes frontend "tanstack-start")}}
import { TanStackStart } from "alchemy/cloudflare";
{{else if (includes frontend "tanstack-router")}}
import { Vite } from "alchemy/cloudflare";
{{else if (includes frontend "react-router")}}
import { ReactRouter } from "alchemy/cloudflare";
{{else if (includes frontend "solid")}}
import { Vite } from "alchemy/cloudflare";
{{/if}}
{{/if}}
{{#if (eq serverDeploy "cloudflare")}}
import { Worker } from "alchemy/cloudflare";
{{/if}}
{{#if (and (or (eq serverDeploy "cloudflare") (and (eq webDeploy "cloudflare") (eq backend "self"))) (eq dbSetup "d1"))}}
import { D1Database } from "alchemy/cloudflare";
{{/if}}
import { config } from "dotenv";

{{#if (and (eq webDeploy "cloudflare") (eq serverDeploy "cloudflare"))}}
config({ path: "./.env" });
config({ path: "../../apps/web/.env" });
config({ path: "../../apps/server/.env" });
{{else if (eq webDeploy "cloudflare")}}
config({ path: "./.env" });
config({ path: "../../apps/web/.env" });
{{else if (eq serverDeploy "cloudflare")}}
config({ path: "./.env" });
config({ path: "../../apps/server/.env" });
{{/if}}

const app = await alchemy("{{projectName}}");

{{#if (and (or (eq serverDeploy "cloudflare") (and (eq webDeploy "cloudflare") (eq backend "self"))) (eq dbSetup "d1"))}}
const db = await D1Database("database", {
	{{#if (eq orm "prisma")}}
	migrationsDir: "../../packages/db/prisma/migrations",
	{{else if (eq orm "drizzle")}}
	migrationsDir: "../../packages/db/src/migrations",
	{{/if}}
});
{{/if}}

{{#if (eq webDeploy "cloudflare")}}
{{#if (includes frontend "next")}}
export const web = await Nextjs("web", {
  cwd: "../../apps/web",
  bindings: {
    {{#if (eq backend "convex")}}
    NEXT_PUBLIC_CONVEX_URL: alchemy.env.NEXT_PUBLIC_CONVEX_URL!,
    {{#if (eq auth "better-auth")}}
    NEXT_PUBLIC_CONVEX_SITE_URL: alchemy.env.NEXT_PUBLIC_CONVEX_SITE_URL!,
    {{/if}}
    {{else if (ne backend "self")}}
    NEXT_PUBLIC_SERVER_URL: alchemy.env.NEXT_PUBLIC_SERVER_URL!,
    {{/if}}
    {{#if (eq dbSetup "d1")}}
    DB: db,
    {{else if (ne database "none")}}
    DATABASE_URL: alchemy.secret.env.DATABASE_URL!,
    {{/if}}
    {{#if (ne backend "convex")}}
    CORS_ORIGIN: alchemy.env.CORS_ORIGIN!,
    {{#if (eq auth "better-auth")}}
    BETTER_AUTH_SECRET: alchemy.secret.env.BETTER_AUTH_SECRET!,
    BETTER_AUTH_URL: alchemy.env.BETTER_AUTH_URL!,
    {{/if}}
    {{/if}}
    {{#if (eq auth "clerk")}}
    CLERK_SECRET_KEY: alchemy.secret.env.CLERK_SECRET_KEY!,
    {{/if}}
    {{#if (and (includes examples "ai") (ne backend "convex"))}}
    GOOGLE_GENERATIVE_AI_API_KEY: alchemy.secret.env.GOOGLE_GENERATIVE_AI_API_KEY!,
    {{/if}}
    {{#if (eq payments "polar")}}
    POLAR_ACCESS_TOKEN: alchemy.secret.env.POLAR_ACCESS_TOKEN!,
    POLAR_SUCCESS_URL: alchemy.env.POLAR_SUCCESS_URL!,
    {{/if}}
    {{#if (eq dbSetup "turso")}}
    DATABASE_AUTH_TOKEN: alchemy.secret.env.DATABASE_AUTH_TOKEN!,
    {{/if}}
    {{#if (eq database "mysql")}}
    {{#if (eq orm "drizzle")}}
    DATABASE_HOST: alchemy.env.DATABASE_HOST!,
    DATABASE_USERNAME: alchemy.env.DATABASE_USERNAME!,
    DATABASE_PASSWORD: alchemy.secret.env.DATABASE_PASSWORD!,
    {{/if}}
    {{/if}}
  }
});
{{else if (includes frontend "nuxt")}}
export const web = await Nuxt("web", {
  cwd: "../../apps/web",
  bindings: {
    {{#if (eq backend "convex")}}
    NUXT_PUBLIC_CONVEX_URL: alchemy.env.NUXT_PUBLIC_CONVEX_URL!,
    {{#if (eq auth "better-auth")}}
    NUXT_PUBLIC_CONVEX_SITE_URL: alchemy.env.NUXT_PUBLIC_CONVEX_SITE_URL!,
    {{/if}}
    {{else if (ne backend "self")}}
    NUXT_PUBLIC_SERVER_URL: alchemy.env.NUXT_PUBLIC_SERVER_URL!,
    {{/if}}
    {{#if (eq backend "self")}}
    {{#if (eq dbSetup "d1")}}
    DB: db,
    {{else if (ne database "none")}}
    DATABASE_URL: alchemy.secret.env.DATABASE_URL!,
    {{/if}}
    {{#if (ne backend "convex")}}
    CORS_ORIGIN: alchemy.env.CORS_ORIGIN!,
    {{#if (eq auth "better-auth")}}
    BETTER_AUTH_SECRET: alchemy.secret.env.BETTER_AUTH_SECRET!,
    BETTER_AUTH_URL: alchemy.env.BETTER_AUTH_URL!,
    {{/if}}
    {{/if}}
    {{#if (eq auth "clerk")}}
    CLERK_SECRET_KEY: alchemy.secret.env.CLERK_SECRET_KEY!,
    {{/if}}
    {{#if (and (includes examples "ai") (ne backend "convex"))}}
    GOOGLE_GENERATIVE_AI_API_KEY: alchemy.secret.env.GOOGLE_GENERATIVE_AI_API_KEY!,
    {{/if}}
    {{#if (eq payments "polar")}}
    POLAR_ACCESS_TOKEN: alchemy.secret.env.POLAR_ACCESS_TOKEN!,
    POLAR_SUCCESS_URL: alchemy.env.POLAR_SUCCESS_URL!,
    {{/if}}
    {{#if (eq dbSetup "turso")}}
    DATABASE_AUTH_TOKEN: alchemy.secret.env.DATABASE_AUTH_TOKEN!,
    {{/if}}
    {{#if (eq database "mysql")}}
    {{#if (eq orm "drizzle")}}
    DATABASE_HOST: alchemy.env.DATABASE_HOST!,
    DATABASE_USERNAME: alchemy.env.DATABASE_USERNAME!,
    DATABASE_PASSWORD: alchemy.secret.env.DATABASE_PASSWORD!,
    {{/if}}
    {{/if}}
    {{/if}}
  }
});
{{else if (includes frontend "svelte")}}
export const web = await SvelteKit("web", {
  cwd: "../../apps/web",
  bindings: {
    {{#if (eq backend "convex")}}
    PUBLIC_CONVEX_URL: alchemy.env.PUBLIC_CONVEX_URL!,
    {{#if (eq auth "better-auth")}}
    PUBLIC_CONVEX_SITE_URL: alchemy.env.PUBLIC_CONVEX_SITE_URL!,
    {{/if}}
    {{else if (ne backend "self")}}
    PUBLIC_SERVER_URL: alchemy.env.PUBLIC_SERVER_URL!,
    {{/if}}
  }
});
{{else if (includes frontend "tanstack-start")}}
export const web = await TanStackStart("web", {
  cwd: "../../apps/web",
  bindings: {
    {{#if (eq backend "convex")}}
    VITE_CONVEX_URL: alchemy.env.VITE_CONVEX_URL!,
    {{#if (eq auth "better-auth")}}
    VITE_CONVEX_SITE_URL: alchemy.env.VITE_CONVEX_SITE_URL!,
    {{/if}}
    {{else if (ne backend "self")}}
    VITE_SERVER_URL: alchemy.env.VITE_SERVER_URL!,
    {{/if}}
    {{#if (eq dbSetup "d1")}}
    DB: db,
    {{else if (ne database "none")}}
    DATABASE_URL: alchemy.secret.env.DATABASE_URL!,
    {{/if}}
    {{#if (ne backend "convex")}}
    CORS_ORIGIN: alchemy.env.CORS_ORIGIN!,
    {{#if (eq auth "better-auth")}}
    BETTER_AUTH_SECRET: alchemy.secret.env.BETTER_AUTH_SECRET!,
    BETTER_AUTH_URL: alchemy.env.BETTER_AUTH_URL!,
    {{/if}}
    {{/if}}
    {{#if (eq auth "clerk")}}
    CLERK_SECRET_KEY: alchemy.secret.env.CLERK_SECRET_KEY!,
    {{/if}}
    {{#if (and (includes examples "ai") (ne backend "convex"))}}
    GOOGLE_GENERATIVE_AI_API_KEY: alchemy.secret.env.GOOGLE_GENERATIVE_AI_API_KEY!,
    {{/if}}
    {{#if (eq payments "polar")}}
    POLAR_ACCESS_TOKEN: alchemy.secret.env.POLAR_ACCESS_TOKEN!,
    POLAR_SUCCESS_URL: alchemy.env.POLAR_SUCCESS_URL!,
    {{/if}}
    {{#if (eq dbSetup "turso")}}
    DATABASE_AUTH_TOKEN: alchemy.secret.env.DATABASE_AUTH_TOKEN!,
    {{/if}}
    {{#if (eq database "mysql")}}
    {{#if (eq orm "drizzle")}}
    DATABASE_HOST: alchemy.env.DATABASE_HOST!,
    DATABASE_USERNAME: alchemy.env.DATABASE_USERNAME!,
    DATABASE_PASSWORD: alchemy.secret.env.DATABASE_PASSWORD!,
    {{/if}}
    {{/if}}
  }
});
{{else if (includes frontend "tanstack-router")}}
export const web = await Vite("web", {
  cwd: "../../apps/web",
  assets: "dist",
  bindings: {
    {{#if (eq backend "convex")}}
    VITE_CONVEX_URL: alchemy.env.VITE_CONVEX_URL!,
    {{#if (eq auth "better-auth")}}
    VITE_CONVEX_SITE_URL: alchemy.env.VITE_CONVEX_SITE_URL!,
    {{/if}}
    {{else if (ne backend "self")}}
    VITE_SERVER_URL: alchemy.env.VITE_SERVER_URL!,
    {{/if}}
  }
});
{{else if (includes frontend "react-router")}}
export const web = await ReactRouter("web", {
  cwd: "../../apps/web",
  bindings: {
    {{#if (eq backend "convex")}}
    VITE_CONVEX_URL: alchemy.env.VITE_CONVEX_URL!,
    {{#if (eq auth "better-auth")}}
    VITE_CONVEX_SITE_URL: alchemy.env.VITE_CONVEX_SITE_URL!,
    {{/if}}
    {{else if (ne backend "self")}}
    VITE_SERVER_URL: alchemy.env.VITE_SERVER_URL!,
    {{/if}}
  }
});
{{else if (includes frontend "solid")}}
export const web = await Vite("web", {
  cwd: "../../apps/web",
  assets: "dist",
  bindings: {
    {{#if (eq backend "convex")}}
    VITE_CONVEX_URL: alchemy.env.VITE_CONVEX_URL!,
    {{#if (eq auth "better-auth")}}
    VITE_CONVEX_SITE_URL: alchemy.env.VITE_CONVEX_SITE_URL!,
    {{/if}}
    {{else if (ne backend "self")}}
    VITE_SERVER_URL: alchemy.env.VITE_SERVER_URL!,
    {{/if}}
  }
});
{{/if}}
{{/if}}

{{#if (eq serverDeploy "cloudflare")}}
export const server = await Worker("server", {
  cwd: "../../apps/server",
  entrypoint: "src/index.ts",
  compatibility: "node",
  bindings: {
    {{#if (eq dbSetup "d1")}}
    DB: db,
    {{else if (ne database "none")}}
    DATABASE_URL: alchemy.secret.env.DATABASE_URL!,
    {{/if}}
    CORS_ORIGIN: alchemy.env.CORS_ORIGIN!,
    {{#if (eq auth "better-auth")}}
    BETTER_AUTH_SECRET: alchemy.secret.env.BETTER_AUTH_SECRET!,
    BETTER_AUTH_URL: alchemy.env.BETTER_AUTH_URL!,
    {{/if}}
    {{#if (eq auth "clerk")}}
    CLERK_SECRET_KEY: alchemy.secret.env.CLERK_SECRET_KEY!,
    {{/if}}
    {{#if (includes examples "ai")}}
    GOOGLE_GENERATIVE_AI_API_KEY: alchemy.secret.env.GOOGLE_GENERATIVE_AI_API_KEY!,
    {{/if}}
    {{#if (eq payments "polar")}}
    POLAR_ACCESS_TOKEN: alchemy.secret.env.POLAR_ACCESS_TOKEN!,
    POLAR_SUCCESS_URL: alchemy.env.POLAR_SUCCESS_URL!,
    {{/if}}
    {{#if (eq dbSetup "turso")}}
    DATABASE_AUTH_TOKEN: alchemy.secret.env.DATABASE_AUTH_TOKEN!,
    {{/if}}
    {{#if (eq database "mysql")}}
    {{#if (eq orm "drizzle")}}
    DATABASE_HOST: alchemy.env.DATABASE_HOST!,
    DATABASE_USERNAME: alchemy.env.DATABASE_USERNAME!,
    DATABASE_PASSWORD: alchemy.secret.env.DATABASE_PASSWORD!,
    {{/if}}
    {{/if}}
  },
  dev: {
		port: 3000,
	},
});
{{/if}}

{{#if (and (eq webDeploy "cloudflare") (eq serverDeploy "cloudflare"))}}
console.log(\`Web    -> \${web.url}\`);
console.log(\`Server -> \${server.url}\`);
{{else if (eq webDeploy "cloudflare")}}
console.log(\`Web    -> \${web.url}\`);
{{else if (eq serverDeploy "cloudflare")}}
console.log(\`Server -> \${server.url}\`);
{{/if}}

await app.finalize();
`],
  ["db/base/_gitignore", `# dependencies (bun install)
node_modules

# output
out
dist
*.tgz
/prisma/generated

# code coverage
coverage
*.lcov

# logs
logs
_.log
report.[0-9]_.[0-9]_.[0-9]_.[0-9]_.json

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# caches
.eslintcache
.cache
*.tsbuildinfo

# IntelliJ based IDEs
.idea

# Finder (MacOS) folder config
.DS_Store
`],
  ["db/base/package.json.hbs", `{
  "name": "@{{projectName}}/db",
  "type": "module",
  "exports": {
    ".": {
      "default": "./src/index.ts"
    },
    "./*": {
      "default": "./src/*.ts"
    }
  },
  "scripts": {},
  "devDependencies": {}
}`],
  ["db/base/tsconfig.json.hbs", `{
  "extends": "@{{projectName}}/config/tsconfig.base.json",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "composite": true
  }
}`],
  ["frontend/native/unistyles/_gitignore", `node_modules/
.expo/
dist/
npm-debug.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/
# expo router
expo-env.d.ts

.env

ios
android

# macOS
.DS_Store

# Temporary files created by Metro to check the health of the file watcher
.metro-health-check*`],
  ["frontend/native/unistyles/babel.config.js.hbs", `module.exports = (api) => {
	api.cache(true);
	const plugins = [];

	plugins.push([
		"react-native-unistyles/plugin",
		{
			root: "src",
			autoProcessRoot: "app",
			autoProcessImports: ["@/components"],
		},
	]);

	plugins.push("react-native-worklets/plugin");

	return {
		presets: ["babel-preset-expo"],

		plugins,
	};
};
`],
  ["frontend/native/unistyles/unistyles.ts.hbs", `import { StyleSheet } from "react-native-unistyles";

import { breakpoints } from "./breakpoints";
import { darkTheme, lightTheme } from "./theme";

type AppBreakpoints = typeof breakpoints;

type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

declare module "react-native-unistyles" {
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  breakpoints,
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  settings: {
    adaptiveThemes: true,
  },
});
`],
  ["frontend/native/unistyles/package.json.hbs", `{
  "name": "native",
  "version": "1.0.0",
  "private": true,
  "main": "index.js",
  "scripts": {
    "dev": "expo start --clear",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "@expo/vector-icons": "^15.0.2",
    "@react-navigation/bottom-tabs": "^7.3.10",
    "@react-navigation/drawer": "^7.3.9",
    "@react-navigation/native": "^7.1.6",
    {{#if (includes examples "ai")}}
    "@stardazed/streams-text-encoding": "^1.0.2",
    "@ungap/structured-clone": "^1.3.0",
    {{/if}}
    "@tanstack/react-form": "^1.0.5",
    "expo": "^54.0.0",
    "expo-constants": "~18.0.8",
    "expo-crypto": "~15.0.6",
    "expo-linking": "~8.0.7",
    "expo-router": "~6.0.0",
    "expo-secure-store": "~15.0.6",
    "expo-splash-screen": "~31.0.8",
		"expo-status-bar": "^3.0.7",
    "expo-system-ui": "~6.0.7",
		"expo-dev-client": "~6.0.11",
    "expo-web-browser": "~15.0.6",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native": "0.81.4",
		"react-native-edge-to-edge": "^1.7.0",
    "react-native-gesture-handler": "~2.28.0",
		"react-native-nitro-modules": "^0.29.4",
    "react-native-reanimated": "~4.1.0",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
		"react-native-unistyles": "^3.0.12",
    "react-native-web": "^0.21.0",
    "react-native-worklets": "^0.5.1"
  },
  "devDependencies": {
    "ajv": "^8.17.1",
    "@babel/core": "^7.28.0",
    "@types/react": "~19.1.10"
  }
}
`],
  ["frontend/native/unistyles/breakpoints.ts.hbs", `export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  superLarge: 2000,
  tvLike: 4000,
} as const;
`],
  ["frontend/native/unistyles/app.json.hbs", `{
  "expo": {
    "name": "{{projectName}}",
    "slug": "{{projectName}}",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "mybettertapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false,
      "package": "com.anonymous.mybettertapp"
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "backgroundColor": "#000000"
          }
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    }
  }
}
`],
  ["frontend/native/unistyles/tsconfig.json.hbs", `{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
`],
  ["frontend/native/unistyles/theme.ts.hbs", `const sharedColors = {
  success: "#22C55E",
  destructive: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",
} as const;

export const lightTheme = {
  colors: {
    ...sharedColors,
    typography: "hsl(0 0% 0%)",
    background: "hsl(0 0% 100%)",
    foreground: "hsl(0 0% 0%)",
    card: "hsl(0 0% 98%)",
    cardForeground: "hsl(0 0% 0%)",
    primary: "hsl(0 0% 10%)",
    primaryForeground: "hsl(0 0% 100%)",
    secondary: "hsl(0 0% 95%)",
    secondaryForeground: "hsl(0 0% 0%)",
    muted: "hsl(0 0% 96%)",
    mutedForeground: "hsl(0 0% 45%)",
    accent: "hsl(0 0% 96%)",
    accentForeground: "hsl(0 0% 0%)",
    border: "hsl(0 0% 90%)",
    input: "hsl(0 0% 90%)",
    ring: "hsl(0 0% 20%)",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },
} as const;

export const darkTheme = {
  colors: {
    ...sharedColors,
    typography: "hsl(0 0% 100%)",
    background: "hsl(0 0% 0%)",
    foreground: "hsl(0 0% 100%)",
    card: "hsl(0 0% 2%)",
    cardForeground: "hsl(0 0% 100%)",
    primary: "hsl(0 0% 90%)",
    primaryForeground: "hsl(0 0% 0%)",
    secondary: "hsl(0 0% 10%)",
    secondaryForeground: "hsl(0 0% 100%)",
    muted: "hsl(0 0% 8%)",
    mutedForeground: "hsl(0 0% 65%)",
    accent: "hsl(0 0% 8%)",
    accentForeground: "hsl(0 0% 100%)",
    border: "hsl(0 0% 15%)",
    input: "hsl(0 0% 15%)",
    ring: "hsl(0 0% 80%)",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },
} as const;
`],
  ["frontend/native/unistyles/metro.config.js.hbs", `const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

module.exports = config;
`],
  ["frontend/native/unistyles/index.js.hbs", `import 'expo-router/entry';
import './unistyles';
`],
  ["frontend/nuxt/app/components/Header.vue.hbs", `<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
{{#if (eq auth "better-auth")}}
import UserMenu from './UserMenu.vue'
{{/if}}

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
    { label: "Home", to: "/", active: route.path === "/" },
    {{#if (or (eq auth "better-auth") (eq auth "clerk"))}}
    { label: "Dashboard", to: "/dashboard", active: route.path.startsWith("/dashboard") },
    {{/if}}
    {{#if (includes examples "todo")}}
    { label: "Todos", to: "/todos", active: route.path.startsWith("/todos") },
    {{/if}}
    {{#if (includes examples "ai")}}
    { label: "AI Chat", to: "/ai", active: route.path.startsWith("/ai") },
    {{/if}}
])
</script>

<template>
  <UHeader>
    <template #left>
      <UNavigationMenu :items="items" />
    </template>

    <template #right>
      <UColorModeButton />
      {{#if (eq auth "better-auth")}}
      <UserMenu />
      {{/if}}
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
    </template>
  </UHeader>
</template>
`],
  ["frontend/nuxt/app/pages/index.vue.hbs", `<script setup lang="ts">
{{#if (eq backend "convex")}}
import { api } from "@{{ projectName }}/backend/convex/_generated/api";
import { useConvexQuery } from "convex-vue";
{{else}}
  {{#unless (eq api "none")}}
const { $orpc } = useNuxtApp()
import { useQuery } from '@tanstack/vue-query'
  {{/unless}}
{{/if}}

const TITLE_TEXT = \`
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 \`;

{{#if (eq backend "convex")}}
const healthCheck = useConvexQuery(api.healthCheck.get, {});
{{else}}
  {{#unless (eq api "none")}}
const healthCheck = useQuery($orpc.healthCheck.queryOptions())
  {{/unless}}
{{/if}}
</script>

<template>
  <UContainer class="py-8">
    <pre class="overflow-x-auto font-mono text-sm whitespace-pre-wrap">\\{{ TITLE_TEXT }}</pre>

    <div class="grid gap-6 mt-6">
      <UCard>
        <template #header>
          <div class="font-medium">API Status</div>
        </template>

        {{#if (eq backend "convex")}}
        <div class="flex items-center gap-2">
          <UIcon
            :name="healthCheck === undefined ? 'i-lucide-loader-2' : healthCheck.data.value === 'OK' ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
            :class="[
              healthCheck === undefined ? 'animate-spin text-muted' : '',
              healthCheck?.data.value === 'OK' ? 'text-success' : 'text-error'
            ]"
          />
          <span class="text-sm">
            \\{{
              healthCheck === undefined
                ? "Checking..."
                : healthCheck.data.value === "OK"
                  ? "Connected"
                  : "Error"
            }}
          </span>
        </div>
        {{else}}
        {{#unless (eq api "none")}}
        <div class="flex items-center gap-2">
          <UIcon
            :name="healthCheck.isLoading.value ? 'i-lucide-loader-2' : healthCheck.isSuccess.value ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
            :class="[
              healthCheck.isLoading.value ? 'animate-spin text-muted' : '',
              healthCheck.isSuccess.value ? 'text-success' : '',
              healthCheck.isError.value ? 'text-error' : ''
            ]"
          />
          <span class="text-sm">
            <template v-if="healthCheck.isLoading.value">
              Checking...
            </template>
            <template v-else-if="healthCheck.isSuccess.value">
              Connected (\\{{ healthCheck.data.value }})
            </template>
            <template v-else-if="healthCheck.isError.value">
              Error: \\{{ healthCheck.error.value?.message || 'Failed to connect' }}
            </template>
            <template v-else>
              Idle
            </template>
          </span>
        </div>
        {{/unless}}
        {{/if}}
      </UCard>
    </div>
  </UContainer>
</template>
`],
  ["frontend/nuxt/app/layouts/default.vue.hbs", `<script setup></script>

<template>
  <div class="grid grid-rows-[auto_1fr] h-svh">
    <Header />
    <UMain>
      <slot />
    </UMain>
  </div>
</template>
`],
  ["addons/husky/.husky/pre-commit", `lint-staged
`],
  ["addons/ruler/.ruler/ruler.toml.hbs", `# Ruler Configuration File
# See https://okigu.com/ruler for documentation.

# Default agents to run when --agents is not specified
default_agents = []

# --- Global MCP Server Configuration ---
[mcp]
# Enable/disable MCP propagation globally (default: true)
enabled = true
# Global merge strategy: 'merge' or 'overwrite' (default: 'merge')
merge_strategy = "merge"

# --- MCP Server Definitions ---
[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp"]

{{#if (or (eq runtime "workers") (eq webDeploy "wrangler"))}}
[mcp_servers.cloudflare]
command = "npx"
args = ["mcp-remote", "https://docs.mcp.cloudflare.com/sse"]
{{/if}}

{{#if (eq backend "convex")}}
[mcp_servers.convex]
command = "npx"
args = ["-y", "convex@latest", "mcp", "start"]
{{/if}}

{{#if (or (includes frontend "tanstack-router") (includes frontend "react-router") (includes frontend "tanstack-start") (includes frontend "next"))}}
[mcp_servers.shadcn]
command = "npx"
args = ["shadcn@latest", "mcp"]
{{/if}}

{{#if (eq dbSetup "planetscale")}}
[mcp_servers.planetscale]
command = "pscale"
args = ["mcp", "server"]
{{/if}}

{{#if (eq dbSetup "prisma-postgres")}}
[mcp_servers.prisma]
command = "npx"
args = ["-y", "prisma", "mcp"]
{{/if}}

{{#if (eq dbSetup "neon")}}
[mcp_servers.neon]
command = "npx"
args = ["-y", "mcp-remote@latest", "https://mcp.neon.tech/mcp"]
{{/if}}

{{#if (eq dbSetup "mongodb-atlas")}}
[mcp_servers.mongodb]
command = "npx"
args = ["-y", "mongodb-mcp-server", "--connectionString", "mongodb://localhost:27017/myDatabase", "--readOnly"]
{{/if}}

{{#if (eq auth "better-auth")}}
[mcp_servers.better-auth]
url = "https://mcp.chonkie.ai/better-auth/better-auth-builder/mcp"
{{/if}}

{{#if (includes frontend "nuxt")}}
[mcp_servers.nuxt-ui]
url = "https://ui.nuxt.com/mcp"
{{/if}}

{{#if (includes frontend "next")}}
[mcp_servers.next-devtools]
command = "npx"
args = ["-y", "next-devtools-mcp@latest"]
{{/if}}

# --- Global .gitignore Configuration ---
[gitignore]
# Enable/disable automatic .gitignore updates (default: true)
enabled = true`],
  ["addons/ruler/.ruler/bts.md.hbs", `# Better-T-Stack Project Rules

This is a {{projectName}} project created with Better-T-Stack CLI.

## Project Structure

This is a monorepo with the following structure:

{{#if (or (includes frontend "tanstack-router") (includes frontend "react-router") (includes frontend "tanstack-start")
(includes frontend "next") (includes frontend "nuxt") (includes frontend "svelte") (includes frontend "solid"))}}
- **\`apps/web/\`** - {{#if (eq backend "self")}}Fullstack application{{else}}Frontend application{{/if}}{{#if (includes frontend "tanstack-router")}} (React with TanStack Router){{else if (includes frontend "react-router")}} (React with React Router){{else if (includes frontend "tanstack-start")}} (TanStack Start){{else if (includes frontend "next")}} (Next.js){{else if (includes frontend "nuxt")}} (Nuxt.js){{else if (includes frontend "svelte")}} (SvelteKit){{else if (includes frontend "solid")}} (SolidStart){{/if}}
{{/if}}

{{#if (ne backend "convex")}}
{{#if (and (ne backend "none") (ne backend "self"))}}
- **\`apps/server/\`** - Backend server{{#if (eq backend "hono")}} (Hono){{else if (eq backend "express")}} (Express){{else if (eq backend "fastify")}} (Fastify){{else if (eq backend "elysia")}} (Elysia){{/if}}
{{/if}}
{{else}}
- **\`packages/backend/\`** - Convex backend functions
{{/if}}

{{#if (or (includes frontend "native-bare") (includes frontend "native-uniwind") (includes frontend "native-unistyles"))}}
- **\`apps/native/\`** - React Native mobile app{{#if (includes frontend "native-uniwind")}} (with NativeWind){{else if (includes frontend "native-unistyles")}} (with Unistyles){{else if (includes frontend "native-bare")}} (bare styling){{/if}}
{{/if}}

{{#if (ne backend "convex")}}
{{#if (ne api "none")}}
- **\`packages/api/\`** - Shared API logic and types
{{/if}}
{{#if (and (ne auth "none") (ne backend "convex"))}}
- **\`packages/auth/\`** - Authentication logic and utilities
{{/if}}
{{#if (and (ne database "none") (ne orm "none"))}}
- **\`packages/db/\`** - Database schema and utilities
{{/if}}
- **\`packages/env/\`** - Shared environment variables and validation
- **\`packages/config/\`** - Shared TypeScript configuration
{{#if (or (eq webDeploy "cloudflare") (eq serverDeploy "cloudflare"))}}
- **\`packages/infra/\`** - Infrastructure as code (Alchemy for Cloudflare)
{{/if}}
{{/if}}

## Available Scripts

- \`{{packageManager}} run dev\` - Start all apps in development mode
{{#if (and (or (includes frontend "tanstack-router") (includes frontend "react-router") (includes frontend "tanstack-start")
(includes frontend "next") (includes frontend "nuxt") (includes frontend "svelte") (includes frontend "solid")) (ne backend "self"))}}
- \`{{packageManager}} run dev:web\` - Start only the web app
{{/if}}
{{#if (and (ne backend "none") (ne backend "convex") (ne backend "self"))}}
- \`{{packageManager}} run dev:server\` - Start only the server
{{/if}}
{{#if (or (includes frontend "native-bare") (includes frontend "native-uniwind") (includes frontend "native-unistyles"))}}
- \`{{packageManager}} run dev:native\` - Start only the native app
{{/if}}
- \`{{packageManager}} run build\` - Build all apps
- \`{{packageManager}} run lint\` - Lint all packages
- \`{{packageManager}} run typecheck\` - Type check all packages

{{#if (and (ne database "none") (ne orm "none") (ne backend "convex"))}}
## Database Commands

All database operations should be run from the {{#if (eq backend "self")}}web{{else}}server{{/if}} workspace:

- \`{{packageManager}} run db:push\` - Push schema changes to database
- \`{{packageManager}} run db:studio\` - Open database studio
- \`{{packageManager}} run db:generate\` - Generate {{#if (eq orm "drizzle")}}Drizzle{{else if (eq orm "prisma")}}Prisma{{else}}{{orm}}{{/if}} files
- \`{{packageManager}} run db:migrate\` - Run database migrations

{{#if (eq orm "drizzle")}}
Database schema files are located in {{#if (eq backend "self")}}\`apps/web/src/db/schema/\`{{else}}\`packages/db/src/schema/\`{{/if}}
{{else if (eq orm "prisma")}}
Database schema is located in {{#if (eq backend "self")}}\`apps/web/prisma/schema.prisma\`{{else}}\`packages/db/prisma/schema.prisma\`{{/if}}
{{else if (eq orm "mongoose")}}
Database models are located in {{#if (eq backend "self")}}\`apps/web/src/db/models/\`{{else}}\`packages/db/src/models/\`{{/if}}
{{/if}}
{{/if}}

{{#if (ne api "none")}}
## API Structure

{{#if (eq api "trpc")}}
- tRPC routers are in \`packages/api/src/routers/\`
- Client-side tRPC utils are in \`apps/web/src/utils/trpc.ts\`
{{else if (eq api "orpc")}}
- oRPC contracts and routers are in \`packages/api/src/\`
- Client-side oRPC client is in \`apps/web/src/utils/orpc.ts\`
{{/if}}
{{/if}}

{{#if (eq auth "better-auth")}}
## Authentication

Authentication is powered by Better Auth:
- Auth configuration is in \`packages/auth/src/\`
{{#if (or (includes frontend "tanstack-router") (includes frontend "react-router") (includes frontend "tanstack-start")
(includes frontend "next") (includes frontend "nuxt") (includes frontend "svelte") (includes frontend "solid"))}}
- Web app auth client is in \`apps/web/src/lib/auth-client.ts\`
{{/if}}
{{#if (or (includes frontend "native-bare") (includes frontend "native-uniwind") (includes frontend "native-unistyles"))}}
- Native app auth client is in \`apps/native/src/lib/auth-client.ts\`
{{/if}}
{{/if}}

## Project Configuration

This project includes a \`bts.jsonc\` configuration file that stores your Better-T-Stack settings:

- Contains your selected stack configuration (database, ORM, backend, frontend, etc.)
- Used by the CLI to understand your project structure
- Safe to delete if not needed

## Key Points

- This is a {{#if (includes addons "turborepo")}}Turborepo {{/if}}monorepo using {{packageManager}} workspaces
- Each app has its own \`package.json\` and dependencies
- Run commands from the root to execute across all workspaces
- Run workspace-specific commands with \`{{packageManager}} run command-name\`
{{#if (includes addons "turborepo")}}
- Turborepo handles build caching and parallel execution
{{/if}}
{{#if (or (includes addons "husky") (includes addons "lefthook"))}}
- Git hooks are configured with {{#if (includes addons "husky")}}Husky{{else}}Lefthook{{/if}} for pre-commit checks
{{/if}}
`],
  ["frontend/svelte/src/routes/+layout.svelte.hbs", `{{#if (eq backend "convex")}}
<script lang="ts">
	import '../app.css';
    import Header from '../components/Header.svelte';
    import { PUBLIC_CONVEX_URL } from '$env/static/public';
	import { setupConvex } from 'convex-svelte';

	const { children } = $props();
	setupConvex(PUBLIC_CONVEX_URL);
</script>

<div class="grid h-svh grid-rows-[auto_1fr]">
	<Header />
	<main class="overflow-y-auto">
		{@render children()}
	</main>
</div>
{{else}}
  {{#if (eq api "orpc")}}
<script lang="ts">
    import { QueryClientProvider } from '@tanstack/svelte-query';
    import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools'
	import '../app.css';
    import { queryClient } from '$lib/orpc';
    import Header from '../components/Header.svelte';

	const { children } = $props();
</script>

<QueryClientProvider client={queryClient}>
    <div class="grid h-svh grid-rows-[auto_1fr]">
		<Header />
		<main class="overflow-y-auto">
			{@render children()}
		</main>
    </div>
    <SvelteQueryDevtools />
</QueryClientProvider>
  {{else}}
<script lang="ts">
	import '../app.css';
    import Header from '../components/Header.svelte';

	const { children } = $props();
</script>

<div class="grid h-svh grid-rows-[auto_1fr]">
	<Header />
	<main class="overflow-y-auto">
		{@render children()}
	</main>
</div>
  {{/if}}
{{/if}}
`],
  ["frontend/svelte/src/routes/+page.svelte.hbs", `{{#if (eq backend "convex")}}
<script lang="ts">
import { useQuery } from 'convex-svelte';
import { api } from "@{{projectName}}/backend/convex/_generated/api";

const healthCheck = useQuery(api.healthCheck.get, {});

const TITLE_TEXT = \`
   ██████╗ ███████╗████████╗████████╗███████╗██████╗
   ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
   ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
   ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
   ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
   ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

   ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
   ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
      ██║       ███████╗   ██║   ███████║██║     █████╔╝
      ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
      ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
      ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
   \`;
</script>

<div class="container mx-auto max-w-3xl px-4 py-2">
	<pre class="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
	<div class="grid gap-6">
		<section class="rounded-lg border p-4">
			<h2 class="mb-2 font-medium">API Status</h2>
			<div class="flex items-center gap-2">
				<div
					class={\`h-2 w-2 rounded-full \${healthCheck.data ? "bg-green-500" : "bg-red-500"}\`}
				></div>
				<span class="text-muted-foreground text-sm">
					{healthCheck.isLoading
						? "Checking..."
						: healthCheck.data
							? "Connected"
							: "Disconnected"}
				</span>
			</div>
		</section>
	</div>
</div>
{{else}}
<script lang="ts">
{{#if (eq api "orpc")}}
import { orpc } from "$lib/orpc";
import { createQuery } from "@tanstack/svelte-query";
const healthCheck = createQuery(orpc.healthCheck.queryOptions());
{{/if}}

const TITLE_TEXT = \`
   ██████╗ ███████╗████████╗████████╗███████╗██████╗
   ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
   ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
   ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
   ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
   ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

   ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
   ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
      ██║       ███████╗   ██║   ███████║██║     █████╔╝
      ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
      ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
      ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
   \`;
</script>

<div class="container mx-auto max-w-3xl px-4 py-2">
	<pre class="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
	<div class="grid gap-6">
	    {{#if (eq api "orpc")}}
		<section class="rounded-lg border p-4">
			<h2 class="mb-2 font-medium">API Status</h2>
			<div class="flex items-center gap-2">
				<div
					class={\`h-2 w-2 rounded-full \${$healthCheck.data ? "bg-green-500" : "bg-red-500"}\`}
				></div>
				<span class="text-muted-foreground text-sm">
					{$healthCheck.isLoading
						? "Checking..."
						: $healthCheck.data
							? "Connected"
							: "Disconnected"}
				</span>
			</div>
		</section>
	    {{/if}}
	</div>
</div>
{{/if}}
`],
  ["frontend/svelte/src/components/Header.svelte.hbs", `<script lang="ts">

    {{#if (eq auth "better-auth")}}
	import UserMenu from './UserMenu.svelte';
    {{/if}}
    const links = [
        { to: "/", label: "Home" },
        {{#if (eq auth "better-auth")}}
        { to: "/dashboard", label: "Dashboard" },
        {{/if}}
        {{#if (includes examples "todo")}}
        { to: "/todos", label: "Todos" },
        {{/if}}
        {{#if (includes examples "ai")}}
        { to: "/ai", label: "AI Chat" },
        {{/if}}
    ];

</script>

<div>
	<div class="flex flex-row items-center justify-between px-4 py-2 md:px-6">
		<nav class="flex gap-4 text-lg">
			{#each links as link (link.to)}
				<a
					href={link.to}
					class="hover:text-neutral-400 transition-colors"
				>
					{link.label}
				</a>
			{/each}
		</nav>
		<div class="flex items-center gap-2">
		    {{#if (eq auth "better-auth")}}
            <UserMenu />
             {{/if}}
		</div>
	</div>
	<hr class="border-neutral-800" />
</div>
`],
  ["frontend/svelte/src/lib/index.ts", `// place files you want to import through the \`$lib\` alias in this folder.
export {};
`],
  ["frontend/react/tanstack-start/public/robots.txt", `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Disallow:
`],
  ["frontend/react/tanstack-start/src/router.tsx.hbs", `{{#if (eq backend "convex")}}
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { routeTree } from "./routeTree.gen";
import Loader from "./components/loader";
import "./index.css";
import { env } from "@{{projectName}}/env/web";
{{else}}
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import Loader from "./components/loader";
import "./index.css";
import { routeTree } from "./routeTree.gen";
{{#if (eq api "trpc")}}
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { toast } from "sonner";
import type { AppRouter } from "@{{projectName}}/api/routers/index";
import { TRPCProvider } from "./utils/trpc";
{{#unless (eq backend "self")}}
import { env } from "@{{projectName}}/env/web";
{{/unless}}
{{else if (eq api "orpc")}}
import { QueryClientProvider } from "@tanstack/react-query";
import { orpc, queryClient } from "./utils/orpc";
{{/if}}
{{/if}}

{{#if (eq backend "convex")}}
export function getRouter() {
	const convexUrl = env.VITE_CONVEX_URL;
	if (!convexUrl) {
		throw new Error("VITE_CONVEX_URL is not set");
	}

	const convexQueryClient = new ConvexQueryClient(convexUrl);

	const queryClient: QueryClient = new QueryClient({
		defaultOptions: {
			queries: {
				queryKeyHashFn: convexQueryClient.hashFn(),
				queryFn: convexQueryClient.queryFn(),
			},
		},
	});
	convexQueryClient.connect(queryClient);

	const router = createTanStackRouter({
		routeTree,
		defaultPreload: "intent",
		defaultPendingComponent: () => <Loader />,
		defaultNotFoundComponent: () => <div>Not Found</div>,
		context: { queryClient, convexQueryClient },
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient,
	});

	return router;
}
{{else}}
{{#if (eq api "trpc")}}
export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error, query) => {
			toast.error(error.message, {
				action: {
					label: "retry",
					onClick: query.invalidate,
				},
			});
		},
	}),
	defaultOptions: { queries: { staleTime: 60 * 1000 } },
});

const trpcClient = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: {{#if (eq backend "self")}}"/api/trpc"{{else}}\`\${env.VITE_SERVER_URL}/trpc\`{{/if}},
{{#if (eq auth "better-auth")}}
			fetch(url, options) {
				return fetch(url, {
					...options,
					credentials: "include",
				});
			},
{{/if}}
		}),
	],
});

const trpc = createTRPCOptionsProxy({
	client: trpcClient,
	queryClient: queryClient,
});
{{else if (eq api "orpc")}}
{{/if}}

export const getRouter = () => {
	const router = createTanStackRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
{{#if (eq api "trpc")}}
		context: { trpc, queryClient },
{{else if (eq api "orpc")}}
		context: { orpc, queryClient },
{{else}}
		context: {},
{{/if}}
		defaultPendingComponent: () => <Loader />,
		defaultNotFoundComponent: () => <div>Not Found</div>,
{{#if (eq api "trpc")}}
		Wrap: ({ children }) => (
			<QueryClientProvider client={queryClient}>
				<TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
					{children}
				</TRPCProvider>
			</QueryClientProvider>
		),
{{else if (eq api "orpc")}}
		Wrap: ({ children }) => (
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		),
{{else}}
		Wrap: ({ children }) => <>{children}</>,
{{/if}}
	});
	return router;
};
{{/if}}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
`],
  ["frontend/react/tanstack-router/src/main.tsx.hbs", `import { RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import Loader from "./components/loader";
import { routeTree } from "./routeTree.gen";

{{#if (eq api "orpc")}}
  import { QueryClientProvider } from "@tanstack/react-query";
  import { orpc, queryClient } from "./utils/orpc";
{{/if}}
{{#if (eq api "trpc")}}
  import { QueryClientProvider } from "@tanstack/react-query";
  import { queryClient, trpc } from "./utils/trpc";
{{/if}}
{{#if (eq backend "convex")}}
  import { ConvexReactClient } from "convex/react";
  import { env } from "@{{projectName}}/env/web";
  {{#if (eq auth "clerk")}}
  import { ClerkProvider, useAuth } from "@clerk/clerk-react";
  import { ConvexProviderWithClerk } from "convex/react-clerk";
  {{else if (eq auth "better-auth")}}
  import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
  import { authClient } from "@/lib/auth-client";
  {{else}}
  import { ConvexProvider } from "convex/react";
  {{/if}}
  const convex = new ConvexReactClient(env.VITE_CONVEX_URL);
{{/if}}

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPendingComponent: () => <Loader />,
  {{#if (eq api "orpc")}}
  context: { orpc, queryClient },
  Wrap: function WrapComponent({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  },
  {{else if (eq api "trpc")}}
  context: { trpc, queryClient },
  Wrap: function WrapComponent({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  },
  {{else if (eq backend "convex")}}
  context: {},
  Wrap: function WrapComponent({ children }: { children: React.ReactNode }) {
    {{#if (eq auth "clerk")}}
    return (
      <ClerkProvider
        publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY}
      >
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          {children}
        </ConvexProviderWithClerk>
      </ClerkProvider>
    );
    {{else if (eq auth "better-auth")}}
    return <ConvexBetterAuthProvider client={convex} authClient={authClient}>{children}</ConvexBetterAuthProvider>;
    {{else}}
    return <ConvexProvider client={convex}>{children}</ConvexProvider>;
    {{/if}}
  },
  {{else}}
  context: {},
  {{/if}}
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("Root element not found");
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
}
`],
  ["frontend/native/uniwind/contexts/app-theme-context.tsx.hbs", `import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { Uniwind, useUniwind } from 'uniwind';

type ThemeName = 'light' | 'dark';

type AppThemeContextType = {
    currentTheme: string;
    isLight: boolean;
    isDark: boolean;
    setTheme: (theme: ThemeName) => void;
    toggleTheme: () => void;
}

const AppThemeContext = createContext<AppThemeContextType | undefined>(
    undefined
);

export const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const { theme } = useUniwind();

    const isLight = useMemo(() => {
        return theme === 'light';
    }, [theme]);

    const isDark = useMemo(() => {
        return theme === 'dark';
    }, [theme]);

    const setTheme = useCallback((newTheme: ThemeName) => {
        Uniwind.setTheme(newTheme);
    }, []);

    const toggleTheme = useCallback(() => {
        Uniwind.setTheme(theme === 'light' ? 'dark' : 'light');
    }, [theme]);

    const value = useMemo(
        () => ({
            currentTheme: theme,
            isLight,
            isDark,
            setTheme,
            toggleTheme,
        }),
        [theme, isLight, isDark, setTheme, toggleTheme]
    );

    return (
        <AppThemeContext.Provider value={value}>
            {children}
        </AppThemeContext.Provider>
    );
};

export function useAppTheme() {
    const context = useContext(AppThemeContext);
    if (!context) {
        throw new Error('useAppTheme must be used within AppThemeProvider');
    }
    return context;
}

`],
  ["frontend/native/uniwind/components/theme-toggle.tsx.hbs", `import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform, Pressable } from 'react-native';
import Animated, { FadeOut, ZoomIn } from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { useAppTheme } from '@/contexts/app-theme-context';

const StyledIonicons = withUniwind(Ionicons);

export function ThemeToggle() {
	const { toggleTheme, isLight } = useAppTheme();

	return (
		<Pressable
			onPress={() => {
				if (Platform.OS === 'ios') {
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				}
				toggleTheme();
			}}
			className="px-2.5"
		>
			{isLight ? (
				<Animated.View key="moon" entering={ZoomIn} exiting={FadeOut}>
					<StyledIonicons name="moon" size={20} className="text-foreground" />
				</Animated.View>
			) : (
				<Animated.View key="sun" entering={ZoomIn} exiting={FadeOut}>
					<StyledIonicons name="sunny" size={20} className="text-foreground" />
				</Animated.View>
			)}
		</Pressable>
	);
}

`],
  ["frontend/native/uniwind/components/container.tsx.hbs", `import { cn } from "heroui-native";
import { type PropsWithChildren } from "react";
import { ScrollView, View, type ViewProps } from "react-native";
import Animated, { type AnimatedProps } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedView = Animated.createAnimatedComponent(View);

type Props = AnimatedProps<ViewProps> & {
	className?: string;
};

export function Container({
	children,
	className,
	...props
}: PropsWithChildren<Props>) {
	const insets = useSafeAreaInsets();

	return (
		<AnimatedView
			className={cn("flex-1 bg-background", className)}
			style=\\{{
				paddingBottom: insets.bottom,
			}}
			{...props}
		>
			<ScrollView contentContainerStyle=\\{{ flexGrow: 1 }}>
				{children}
			</ScrollView>
		</AnimatedView>
	);
}
`],
  ["frontend/native/uniwind/app/modal.tsx.hbs", `import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Button, Surface, useThemeColor } from "heroui-native";
import { Text, View } from "react-native";

import { Container } from "@/components/container";

function Modal() {
	const accentForegroundColor = useThemeColor("accent-foreground");

	function handleClose() {
		router.back();
	}

	return (
		<Container>
			<View className="flex-1 justify-center items-center p-4">
				<Surface variant="secondary" className="p-5 w-full max-w-sm rounded-lg">
					<View className="items-center">
						<View className="w-12 h-12 bg-accent rounded-lg items-center justify-center mb-3">
							<Ionicons name="checkmark" size={24} color={accentForegroundColor} />
						</View>
						<Text className="text-foreground font-medium text-lg mb-1">Modal Screen</Text>
						<Text className="text-muted text-sm text-center mb-4">
							This is an example modal screen for dialogs and confirmations.
						</Text>
					</View>
					<Button onPress={handleClose} className="w-full" size="sm">
						<Button.Label>Close</Button.Label>
					</Button>
				</Surface>
			</View>
		</Container>
	);
}

export default Modal;
`],
  ["frontend/native/uniwind/app/_layout.tsx.hbs", `{{#if (includes examples "ai")}}
import "@/polyfills";
{{/if}}

import "@/global.css";

{{#if (eq backend "convex")}}
  {{#if (eq auth "better-auth")}}
    import { ConvexReactClient } from "convex/react";
    import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
    import { authClient } from "@/lib/auth-client";
    import { env } from "@{{projectName}}/env/native";
  {{else}}
    import { ConvexProvider, ConvexReactClient } from "convex/react";
    import { env } from "@{{projectName}}/env/native";
  {{/if}}

  {{#if (eq auth "clerk")}}
    import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
    import { ConvexProviderWithClerk } from "convex/react-clerk";
    import { tokenCache } from "@clerk/clerk-expo/token-cache";
  {{/if}}
{{else}}
  {{#unless (eq api "none")}}
    import { QueryClientProvider } from "@tanstack/react-query";
  {{/unless}}
{{/if}}

import { Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { AppThemeProvider } from "@/contexts/app-theme-context";

{{#if (eq api "trpc")}}
  import { queryClient } from "@/utils/trpc";
{{/if}}
{{#if (eq api "orpc")}}
  import { queryClient } from "@/utils/orpc";
{{/if}}

export const unstable_settings = {
  initialRouteName: "(drawer)",
};

{{#if (eq backend "convex")}}
  const convex = new ConvexReactClient(env.EXPO_PUBLIC_CONVEX_URL, {
    unsavedChangesWarning: false,
  });
{{/if}}

function StackLayout() {
  return (
    <Stack screenOptions=\\{{}}>
      <Stack.Screen name="(drawer)" options=\\{{ headerShown: false }} />
      {{#if (eq auth "clerk")}}
        <Stack.Screen name="(auth)" options=\\{{ headerShown: false }} />
      {{/if}}
      <Stack.Screen name="modal" options=\\{{ title: "Modal", presentation: "modal" }} />
    </Stack>
  );
}

export default function Layout() {
  return (
    {{#if (eq backend "convex")}}
      {{#if (eq auth "clerk")}}
        <ClerkProvider tokenCache={tokenCache} publishableKey={env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <GestureHandlerRootView style=\\{{ flex: 1 }}>
              <KeyboardProvider>
                <AppThemeProvider>
                  <HeroUINativeProvider>
                    <StackLayout />
                  </HeroUINativeProvider>
                </AppThemeProvider>
              </KeyboardProvider>
            </GestureHandlerRootView>
          </ConvexProviderWithClerk>
        </ClerkProvider>
      {{else if (eq auth "better-auth")}}
        <ConvexBetterAuthProvider client={convex} authClient={authClient}>
          <GestureHandlerRootView style=\\{{ flex: 1 }}>
            <KeyboardProvider>
              <AppThemeProvider>
                <HeroUINativeProvider>
                  <StackLayout />
                </HeroUINativeProvider>
              </AppThemeProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </ConvexBetterAuthProvider>
      {{else}}
        <ConvexProvider client={convex}>
          <GestureHandlerRootView style=\\{{ flex: 1 }}>
            <KeyboardProvider>
              <AppThemeProvider>
                <HeroUINativeProvider>
                  <StackLayout />
                </HeroUINativeProvider>
              </AppThemeProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </ConvexProvider>
      {{/if}}
    {{else}}
      {{#unless (eq api "none")}}
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style=\\{{ flex: 1 }}>
            <KeyboardProvider>
              <AppThemeProvider>
                <HeroUINativeProvider>
                  <StackLayout />
                </HeroUINativeProvider>
              </AppThemeProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      {{else}}
        <GestureHandlerRootView style=\\{{ flex: 1 }}>
          <KeyboardProvider>
            <AppThemeProvider>
              <HeroUINativeProvider>
                <StackLayout />
              </HeroUINativeProvider>
            </AppThemeProvider>
          </KeyboardProvider>
        </GestureHandlerRootView>
      {{/unless}}
    {{/if}}
  );
}`],
  ["frontend/native/uniwind/app/+not-found.tsx.hbs", `import { Link, Stack } from "expo-router";
import { Button, Surface } from "heroui-native";
import { Text, View } from "react-native";

import { Container } from "@/components/container";

export default function NotFoundScreen() {
	return (
		<>
			<Stack.Screen options=\\{{ title: "Not Found" }} />
			<Container>
				<View className="flex-1 justify-center items-center p-4">
					<Surface variant="secondary" className="items-center p-6 max-w-sm rounded-lg">
						<Text className="text-4xl mb-3">🤔</Text>
						<Text className="text-foreground font-medium text-lg mb-1">Page Not Found</Text>
						<Text className="text-muted text-sm text-center mb-4">
							The page you're looking for doesn't exist.
						</Text>
						<Link href="/" asChild>
							<Button size="sm">Go Home</Button>
						</Link>
					</Surface>
				</View>
			</Container>
		</>
	);
}
`],
  ["frontend/react/react-router/public/favicon.ico", `[Binary file]`],
  ["frontend/react/react-router/src/routes.ts", `import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default flatRoutes() satisfies RouteConfig;
`],
  ["frontend/react/react-router/src/root.tsx.hbs", `import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import "./index.css";
import Header from "./components/header";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";

{{#if (eq backend "convex")}}
import { ConvexReactClient } from "convex/react";
import { env } from "@{{projectName}}/env/web";
{{#if (eq auth "clerk")}}
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
{{else}}
import { ConvexProvider } from "convex/react";
{{/if}}
{{else}}
  {{#unless (eq api "none")}}
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
    {{#if (eq api "orpc")}}
import { queryClient } from "./utils/orpc";
    {{/if}}
    {{#if (eq api "trpc")}}
import { queryClient } from "./utils/trpc";
    {{/if}}
  {{/unless}}
{{/if}}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href:
      "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

{{#if (eq backend "convex")}}
export default function App() {
  const convex = new ConvexReactClient(env.VITE_CONVEX_URL);
  {{#if (eq auth "clerk")}}
  return (
    <ClerkProvider publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          storageKey="vite-ui-theme"
        >
          <div className="grid grid-rows-[auto_1fr] h-svh">
            <Header />
            <Outlet />
          </div>
          <Toaster richColors />
        </ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
  {{else}}
  return (
    <ConvexProvider client={convex}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
        storageKey="vite-ui-theme"
      >
        <div className="grid grid-rows-[auto_1fr] h-svh">
          <Header />
          <Outlet />
        </div>
        <Toaster richColors />
      </ThemeProvider>
    </ConvexProvider>
  );
  {{/if}}
}
{{else if (eq api "orpc")}}
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
        storageKey="vite-ui-theme"
      >
        <div className="grid grid-rows-[auto_1fr] h-svh">
          <Header />
          <Outlet />
        </div>
        <Toaster richColors />
      </ThemeProvider>
      <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
    </QueryClientProvider>
  );
}
{{else if (eq api "trpc")}}
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
        storageKey="vite-ui-theme"
      >
        <div className="grid grid-rows-[auto_1fr] h-svh">
          <Header />
          <Outlet />
        </div>
        <Toaster richColors />
      </ThemeProvider>
      <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
    </QueryClientProvider>
  );
}
{{else}}
export default function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
      storageKey="vite-ui-theme"
    >
      <div className="grid grid-rows-[auto_1fr] h-svh">
        <Header />
        <Outlet />
      </div>
      <Toaster richColors />
    </ThemeProvider>
  );
}
{{/if}}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }
  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
`],
  ["frontend/native/bare/app/modal.tsx.hbs", `import { Container } from "@/components/container";
import { Text, View, StyleSheet } from "react-native";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";

export default function Modal() {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;

  return (
    <Container>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Modal</Text>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

`],
  ["frontend/native/bare/app/_layout.tsx.hbs", `{{#if (includes examples "ai")}}
import "@/polyfills";
{{/if}}

{{#if (eq backend "convex")}}
  {{#if (eq auth "better-auth")}}
    import { ConvexReactClient } from "convex/react";
    import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
    import { authClient } from "@/lib/auth-client";
    import { env } from "@{{projectName}}/env/native";
  {{else}}
    import { ConvexProvider, ConvexReactClient } from "convex/react";
    import { env } from "@{{projectName}}/env/native";
  {{/if}}
  {{#if (eq auth "clerk")}}
    import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
    import { ConvexProviderWithClerk } from "convex/react-clerk";
    import { tokenCache } from "@clerk/clerk-expo/token-cache";
  {{/if}}
{{else}}
  {{#unless (eq api "none")}}
    import { QueryClientProvider } from "@tanstack/react-query";
  {{/unless}}
{{/if}}

import { Stack } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  type Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
{{#if (eq api "trpc")}}
import { queryClient } from "@/utils/trpc";
{{/if}}
{{#if (eq api "orpc")}}
import { queryClient } from "@/utils/orpc";
{{/if}}
import { NAV_THEME } from "@/lib/constants";
import React, { useRef } from "react";
import { useColorScheme } from "@/lib/use-color-scheme";
import { Platform, StyleSheet } from "react-native";
import { setAndroidNavigationBar } from "@/lib/android-navigation-bar";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export const unstable_settings = {
  initialRouteName: "(drawer)",
};

{{#if (eq backend "convex")}}
const convex = new ConvexReactClient(env.EXPO_PUBLIC_CONVEX_URL, {
  unsavedChangesWarning: false,
});
{{/if}}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default function RootLayout() {
  const hasMounted = useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }
    setAndroidNavigationBar(colorScheme);
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <>
      {{#if (eq backend "convex")}}
        {{#if (eq auth "clerk")}}
          <ClerkProvider tokenCache={tokenCache} publishableKey={env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
              <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
                <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
                <GestureHandlerRootView style={styles.container}>
                  <Stack>
                    <Stack.Screen name="(drawer)" options=\\{{ headerShown: false }} />
                    <Stack.Screen name="(auth)" options=\\{{ headerShown: false }} />
                    <Stack.Screen name="modal" options=\\{{ title: "Modal", presentation: "modal" }} />
                  </Stack>
                </GestureHandlerRootView>
              </ThemeProvider>
            </ConvexProviderWithClerk>
          </ClerkProvider>
        {{else if (eq auth "better-auth")}}
          <ConvexBetterAuthProvider client={convex} authClient={authClient}>
            <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
              <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
              <GestureHandlerRootView style={styles.container}>
                <Stack>
                  <Stack.Screen name="(drawer)" options=\\{{ headerShown: false }} />
                  <Stack.Screen name="modal" options=\\{{ title: "Modal", presentation: "modal" }} />
                </Stack>
              </GestureHandlerRootView>
            </ThemeProvider>
          </ConvexBetterAuthProvider>
        {{else}}
          <ConvexProvider client={convex}>
            <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
              <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
              <GestureHandlerRootView style={styles.container}>
                <Stack>
                  <Stack.Screen name="(drawer)" options=\\{{ headerShown: false }} />
                  <Stack.Screen name="modal" options=\\{{ title: "Modal", presentation: "modal" }} />
                </Stack>
              </GestureHandlerRootView>
            </ThemeProvider>
          </ConvexProvider>
        {{/if}}
      {{else}}
        {{#unless (eq api "none")}}
          <QueryClientProvider client={queryClient}>
            <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
              <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
              <GestureHandlerRootView style={styles.container}>
                <Stack>
                  <Stack.Screen name="(drawer)" options=\\{{ headerShown: false }} />
                  <Stack.Screen name="modal" options=\\{{ title: "Modal", presentation: "modal" }} />
                </Stack>
              </GestureHandlerRootView>
            </ThemeProvider>
          </QueryClientProvider>
        {{else}}
          <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
            <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
            <GestureHandlerRootView style={styles.container}>
              <Stack>
                <Stack.Screen name="(drawer)" options=\\{{ headerShown: false }} />
                <Stack.Screen name="modal" options=\\{{ title: "Modal", presentation: "modal" }} />
              </Stack>
            </GestureHandlerRootView>
          </ThemeProvider>
        {{/unless}}
      {{/if}}
    </>
  );
}`],
  ["frontend/native/bare/app/+not-found.tsx.hbs", `import { Container } from "@/components/container";
import { Link, Stack } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";

export default function NotFoundScreen() {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;

  return (
    <>
      <Stack.Screen options=\\{{ title: "Oops!" }} />
      <Container>
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.emoji}>🤔</Text>
            <Text style={[styles.title, { color: theme.text }]}>
              Page Not Found
            </Text>
            <Text style={[styles.subtitle, { color: theme.text, opacity: 0.7 }]}>
              Sorry, the page you're looking for doesn't exist.
            </Text>
            <Link href="/" asChild>
              <Text style={[styles.link, { color: theme.primary, backgroundColor: \`\${theme.primary}1a\` }]}>
                Go to Home
              </Text>
            </Link>
          </View>
        </View>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  content: {
    alignItems: "center",
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  link: {
    padding: 12,
  },
});

`],
  ["frontend/solid/src/routes/__root.tsx.hbs", `import Header from "@/components/header";
import { Outlet, createRootRouteWithContext } from "@tanstack/solid-router";
import { TanStackRouterDevtools } from "@tanstack/solid-router-devtools";
{{#if (eq api "orpc")}}
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import type { QueryClient } from "@tanstack/solid-query";
import type { orpc } from "../utils/orpc";

export interface RouterContext {
  orpc: typeof orpc;
  queryClient: QueryClient;
}
{{else}}
export interface RouterContext {}
{{/if}}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div class="grid grid-rows-[auto_1fr] h-svh">
        <Header />
        <Outlet />
      </div>
      {{#if (eq api "orpc")}}
      <SolidQueryDevtools />
      {{/if}}
      <TanStackRouterDevtools />
    </>
  );
}
`],
  ["frontend/solid/src/routes/index.tsx.hbs", `import { createFileRoute } from "@tanstack/solid-router";
{{#if (eq api "orpc")}}
import { useQuery } from "@tanstack/solid-query";
import { orpc } from "../utils/orpc";
import { Match, Switch } from "solid-js";
{{else}}
{{/if}}

export const Route = createFileRoute("/")({
  component: App,
});

const TITLE_TEXT = \`
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 \`;

function App() {
  {{#if (eq api "orpc")}}
  const healthCheck = useQuery(() => orpc.healthCheck.queryOptions());
  {{/if}}

  return (
    <div class="container mx-auto max-w-3xl px-4 py-2">
      <pre class="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
      <div class="grid gap-6">
        {{#if (eq api "orpc")}}
        <section class="rounded-lg border p-4">
          <h2 class="mb-2 font-medium">API Status</h2>
          <Switch>
            <Match when={healthCheck.isPending}>
              <div class="flex items-center gap-2">
                <div class="h-2 w-2 rounded-full bg-gray-500 animate-pulse" />{" "}
                <span class="text-sm text-muted-foreground">Checking...</span>
              </div>
            </Match>
            <Match when={healthCheck.isError}>
              <div class="flex items-center gap-2">
                <div class="h-2 w-2 rounded-full bg-red-500" />
                <span class="text-sm text-muted-foreground">Disconnected</span>
              </div>
            </Match>
            <Match when={healthCheck.isSuccess}>
              <div class="flex items-center gap-2">
                <div
                  class={\`h-2 w-2 rounded-full \${healthCheck.data ? "bg-green-500" : "bg-red-500"}\`}
                />
                <span class="text-sm text-muted-foreground">
                  {healthCheck.data
                    ? "Connected"
                    : "Disconnected"}
                </span>
              </div>
            </Match>
          </Switch>
        </section>
        {{/if}}
      </div>
    </div>
  );
}
`],
  ["packages/env/src/native.ts.hbs", `import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	clientPrefix: "EXPO_PUBLIC_",
	client: {
{{#if (eq backend "convex")}}
		EXPO_PUBLIC_CONVEX_URL: z.url(),
{{#if (eq auth "better-auth")}}
		EXPO_PUBLIC_CONVEX_SITE_URL: z.url(),
{{/if}}
{{#if (eq auth "clerk")}}
		EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
{{/if}}
{{else}}
		EXPO_PUBLIC_SERVER_URL: z.url(),
{{/if}}
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});`],
  ["packages/env/src/server.ts.hbs", `{{#if (eq serverDeploy "cloudflare")}}
/// <reference path="../env.d.ts" />
// For Cloudflare Workers, env is accessed via cloudflare:workers module
// Types are defined in env.d.ts based on your alchemy.run.ts bindings
export { env } from "cloudflare:workers";
{{else}}
import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
{{#if (ne database "none")}}
{{#if (eq dbSetup "planetscale")}}
		DATABASE_HOST: z.string().min(1),
		DATABASE_USERNAME: z.string().min(1),
		DATABASE_PASSWORD: z.string().min(1),
{{else}}
		DATABASE_URL: z.string().min(1),
{{#if (eq dbSetup "turso")}}
		DATABASE_AUTH_TOKEN: z.string().min(1),
{{/if}}
{{/if}}
{{/if}}
{{#if (eq auth "better-auth")}}
		BETTER_AUTH_SECRET: z.string().min(32),
		BETTER_AUTH_URL: z.url(),
{{/if}}
{{#if (eq payments "polar")}}
		POLAR_ACCESS_TOKEN: z.string().min(1),
		POLAR_SUCCESS_URL: z.url(),
{{/if}}
		CORS_ORIGIN: z.url(),
		NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
{{/if}}`],
  ["packages/env/src/web.ts.hbs", `{{#if (includes frontend "next")}}
import { createEnv } from "@t3-oss/env-nextjs";
{{else if (includes frontend "nuxt")}}
import { createEnv } from "@t3-oss/env-nuxt";
{{else}}
import { createEnv } from "@t3-oss/env-core";
{{/if}}
import { z } from "zod";

{{#if (includes frontend "nuxt")}}
/**
 * Nuxt env validation - validates at build time when imported in nuxt.config.ts
 * For runtime access in components/plugins, use useRuntimeConfig() instead:
 *   const config = useRuntimeConfig()
 *   config.public.serverUrl (NUXT_PUBLIC_SERVER_URL maps to serverUrl)
 */
{{/if}}
export const env = createEnv({
{{#if (eq backend "convex")}}
{{#if (includes frontend "next")}}
	client: {
		NEXT_PUBLIC_CONVEX_URL: z.url(),
{{#if (eq auth "better-auth")}}
		NEXT_PUBLIC_CONVEX_SITE_URL: z.url(),
{{/if}}
{{#if (eq auth "clerk")}}
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
{{/if}}
	},
	runtimeEnv: {
		NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
{{#if (eq auth "better-auth")}}
		NEXT_PUBLIC_CONVEX_SITE_URL: process.env.NEXT_PUBLIC_CONVEX_SITE_URL,
{{/if}}
{{#if (eq auth "clerk")}}
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
{{/if}}
	},
{{else if (includes frontend "nuxt")}}
	client: {
		NUXT_PUBLIC_CONVEX_URL: z.url(),
	},
{{else if (includes frontend "svelte")}}
	clientPrefix: "PUBLIC_",
	client: {
		PUBLIC_CONVEX_URL: z.url(),
	},
	runtimeEnv: (import.meta as any).env,
{{else}}
	clientPrefix: "VITE_",
	client: {
		VITE_CONVEX_URL: z.url(),
{{#if (eq auth "better-auth")}}
		VITE_CONVEX_SITE_URL: z.url(),
{{/if}}
{{#if (eq auth "clerk")}}
		VITE_CLERK_PUBLISHABLE_KEY: z.string().min(1),
{{/if}}
	},
	runtimeEnv: (import.meta as any).env,
{{/if}}
{{else if (eq backend "self")}}
{{#if (includes frontend "next")}}
	client: {},
	runtimeEnv: {},
{{else if (includes frontend "nuxt")}}
	client: {},
{{else}}
	clientPrefix: "VITE_",
	client: {},
	runtimeEnv: (import.meta as any).env,
{{/if}}
{{else if (ne backend "none")}}
{{#if (includes frontend "next")}}
	client: {
		NEXT_PUBLIC_SERVER_URL: z.url(),
	},
	runtimeEnv: {
		NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
	},
{{else if (includes frontend "nuxt")}}
	client: {
		NUXT_PUBLIC_SERVER_URL: z.url(),
	},
{{else if (includes frontend "svelte")}}
	clientPrefix: "PUBLIC_",
	client: {
		PUBLIC_SERVER_URL: z.url(),
	},
	runtimeEnv: (import.meta as any).env,
{{else}}
	clientPrefix: "VITE_",
	client: {
		VITE_SERVER_URL: z.url(),
	},
	runtimeEnv: (import.meta as any).env,
{{/if}}
{{/if}}
	emptyStringAsUndefined: true,
});`],
  ["frontend/native/bare/components/header-button.tsx.hbs", `import FontAwesome from "@expo/vector-icons/FontAwesome";
import { forwardRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";

export const HeaderButton = forwardRef<
  View,
  { onPress?: () => void }
>(({ onPress }, ref) => {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;

  return (
    <Pressable
      ref={ref}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed 
            ? theme.background 
            : theme.card,
        },
      ]}
    >
      {({ pressed }) => (
        <FontAwesome
          name="info-circle"
          size={20}
          color={theme.text}
          style=\\{{
            opacity: pressed ? 0.7 : 1,
          }}
        />
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    padding: 8,
    marginRight: 8,
  },
});

`],
  ["frontend/native/bare/components/tabbar-icon.tsx.hbs", `import FontAwesome from "@expo/vector-icons/FontAwesome";

export const TabBarIcon = (props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) => {
  return <FontAwesome size={24} style=\\{{ marginBottom: -3 }} {...props} />;
};

`],
  ["frontend/native/bare/components/container.tsx.hbs", `import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";
import { StyleSheet } from "react-native";

export function Container({ children }: { children: React.ReactNode }) {
  const { colorScheme } = useColorScheme();
  const backgroundColor = colorScheme === "dark" 
    ? NAV_THEME.dark.background 
    : NAV_THEME.light.background;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

`],
  ["db/prisma/mysql/prisma.config.ts.hbs", `import path from "node:path";
import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv";

dotenv.config({
  {{#if (eq backend "self")}}
  path: "../../apps/web/.env",
  {{else}}
  path: "../../apps/server/.env",
  {{/if}}
});

export default defineConfig({
  schema: path.join("prisma", "schema"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});`],
  ["frontend/native/bare/lib/constants.ts.hbs", `export const NAV_THEME = {
  light: {
    background: "hsl(0 0% 100%)",
    border: "hsl(220 13% 91%)",
    card: "hsl(0 0% 100%)",
    notification: "hsl(0 84.2% 60.2%)",
    primary: "hsl(221.2 83.2% 53.3%)",
    text: "hsl(222.2 84% 4.9%)",
  },
  dark: {
    background: "hsl(222.2 84% 4.9%)",
    border: "hsl(217.2 32.6% 17.5%)",
    card: "hsl(222.2 84% 4.9%)",
    notification: "hsl(0 72% 51%)",
    primary: "hsl(217.2 91.2% 59.8%)",
    text: "hsl(210 40% 98%)",
  },
};

`],
  ["frontend/native/bare/lib/android-navigation-bar.tsx.hbs", `import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";
import { NAV_THEME } from "@/lib/constants";

export async function setAndroidNavigationBar(theme: "light" | "dark") {
  if (Platform.OS !== "android") return;
  await NavigationBar.setButtonStyleAsync(theme === "dark" ? "light" : "dark");
  await NavigationBar.setBackgroundColorAsync(
    theme === "dark" ? NAV_THEME.dark.background : NAV_THEME.light.background,
  );
}

`],
  ["frontend/native/bare/lib/use-color-scheme.ts.hbs", `import { useColorScheme as useRNColorScheme } from "react-native";

export function useColorScheme() {
  const systemColorScheme = useRNColorScheme();
  const colorScheme = systemColorScheme ?? "light";
  
  return {
    colorScheme: colorScheme as "light" | "dark",
    isDarkColorScheme: colorScheme === "dark",
    setColorScheme: () => {
      // Color scheme is managed by the system in bare mode
      console.warn("setColorScheme is not available in bare mode. Color scheme is managed by the system.");
    },
    toggleColorScheme: () => {
      // Color scheme is managed by the system in bare mode
      console.warn("toggleColorScheme is not available in bare mode. Color scheme is managed by the system.");
    },
  };
}

`],
  ["frontend/solid/src/components/loader.tsx", `import { Loader2 } from "lucide-solid";

export default function Loader() {
  return (
    <div class="flex h-full items-center justify-center pt-8">
      <Loader2 class="animate-spin" />
    </div>
  );
}
`],
  ["frontend/solid/src/components/header.tsx.hbs", `import { Link } from "@tanstack/solid-router";
{{#if (eq auth "better-auth")}}
import UserMenu from "./user-menu";
{{/if}}
import { For } from "solid-js";

export default function Header() {
  const links = [
    { to: "/", label: "Home" },
    {{#if (eq auth "better-auth")}}
    { to: "/dashboard", label: "Dashboard" },
    {{/if}}
    {{#if (includes examples "todo")}}
    { to: "/todos", label: "Todos" },
    {{/if}}
    {{#if (includes examples "ai")}}
    { to: "/ai", label: "AI Chat" },
    {{/if}}
  ];

  return (
    <div>
      <div class="flex flex-row items-center justify-between px-2 py-1">
        <nav class="flex gap-4 text-lg">
          <For each={links}>
            {(link) => <Link to={link.to}>{link.label}</Link>}
          </For>
        </nav>
        <div class="flex items-center gap-2">
          {{#if (eq auth "better-auth")}}
          <UserMenu />
          {{/if}}
        </div>
      </div>
      <hr />
    </div>
  );
}
`],
  ["api/orpc/server/_gitignore", `# dependencies (bun install)
node_modules

# output
out
dist
*.tgz

# code coverage
coverage
*.lcov

# logs
logs
_.log
report.[0-9]_.[0-9]_.[0-9]_.[0-9]_.json

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# caches
.eslintcache
.cache
*.tsbuildinfo

# IntelliJ based IDEs
.idea

# Finder (MacOS) folder config
.DS_Store
`],
  ["api/orpc/server/package.json.hbs", `{
  "name": "@{{projectName}}/api",
  "exports": {
    ".": {
      "default": "./src/index.ts"
    },
    "./*": {
      "default": "./src/*.ts"
    }
  },
  "type": "module",
  "scripts": {},
  "devDependencies": {},
  "dependencies": {}
}`],
  ["api/orpc/server/tsconfig.json.hbs", `{
  "extends": "@{{projectName}}/config/tsconfig.base.json",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "composite": true
  }
}`],
  ["db/prisma/postgres/prisma.config.ts.hbs", `import path from "node:path";
import { defineConfig, env } from 'prisma/config'
import dotenv from 'dotenv'

dotenv.config({
    {{#if (eq backend "self")}}
    path: "../../apps/web/.env",
    {{else}}
    path: "../../apps/server/.env",
    {{/if}}
})

export default defineConfig({
  schema: path.join("prisma", "schema"),
  migrations: {
    path: path.join("prisma", "migrations"),
    },
    datasource: {
        url: env('DATABASE_URL'),
    },
})
`],
  ["db/drizzle/mysql/drizzle.config.ts.hbs", `import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({
    {{#if (eq backend "self")}}
    path: "../../apps/web/.env",
    {{else}}
    path: "../../apps/server/.env",
    {{/if}}
});

export default defineConfig({
  schema: "./src/schema",
  out: "./src/migrations",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
});
`],
  ["db/prisma/mongodb/prisma.config.ts.hbs", `import path from "node:path";
import type { PrismaConfig } from "prisma";
import dotenv from "dotenv";

dotenv.config({
    {{#if (eq backend "self")}}
    path: "../../apps/web/.env",
    {{else}}
    path: "../../apps/server/.env",
    {{/if}}
});

export default {
  schema: path.join("prisma", "schema"),
  migrations: {
    path: path.join("prisma", "migrations"),
  }
} satisfies PrismaConfig;
`],
  ["db/prisma/sqlite/prisma.config.ts.hbs", `import path from "node:path";
import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv";

dotenv.config({
  {{#if (eq backend "self")}}
  path: "../../apps/web/.env",
  {{else}}
  path: "../../apps/server/.env",
  {{/if}}
});

export default defineConfig({
  schema: path.join("prisma", "schema"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    {{#if (eq dbSetup "turso")}}
    url: "file:./dev.db",
    {{else}}
    url: env("DATABASE_URL"),
    {{/if}}
  },
});`],
  ["api/trpc/server/_gitignore", `# dependencies (bun install)
node_modules

# output
out
dist
*.tgz

# code coverage
coverage
*.lcov

# logs
logs
_.log
report.[0-9]_.[0-9]_.[0-9]_.[0-9]_.json

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# caches
.eslintcache
.cache
*.tsbuildinfo

# IntelliJ based IDEs
.idea

# Finder (MacOS) folder config
.DS_Store
`],
  ["api/trpc/server/package.json.hbs", `{
  "name": "@{{projectName}}/api",
  "exports": {
    ".": {
      "default": "./src/index.ts"
    },
    "./*": {
      "default": "./src/*.ts"
    }
  },
  "type": "module",
  "scripts": {},
  "devDependencies": {}
}`],
  ["api/trpc/server/tsconfig.json.hbs", `{
  "extends": "@{{projectName}}/config/tsconfig.base.json",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "composite": true
  }
}`],
  ["frontend/react/web-base/src/index.css.hbs", `@import 'tailwindcss';
@import 'tw-animate-css';
@import 'shadcn/tailwind.css';
{{#if (includes examples "ai")}}
@source "../node_modules/streamdown/dist/*.js";
{{/if}}

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.58 0.22 27);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.809 0.105 251.813);
  --chart-2: oklch(0.623 0.214 259.815);
  --chart-3: oklch(0.546 0.245 262.881);
  --chart-4: oklch(0.488 0.243 264.376);
  --chart-5: oklch(0.424 0.199 265.638);
  --radius: 0.625rem;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.87 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.371 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.809 0.105 251.813);
  --chart-2: oklch(0.623 0.214 259.815);
  --chart-3: oklch(0.546 0.245 262.881);
  --chart-4: oklch(0.488 0.243 264.376);
  --chart-5: oklch(0.424 0.199 265.638);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}

@theme inline {
  --font-sans: 'Inter Variable', sans-serif;
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --color-foreground: var(--foreground);
  --color-background: var(--background);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);
  --radius-4xl: calc(var(--radius) + 16px);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply font-sans bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}
`],
  ["db/drizzle/sqlite/drizzle.config.ts.hbs", `import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({
    {{#if (eq backend "self")}}
    path: "../../apps/web/.env",
    {{else}}
    path: "../../apps/server/.env",
    {{/if}}
});

export default defineConfig({
  schema: "./src/schema",
  out: "./src/migrations",
  {{#if (eq dbSetup "d1")}}
  // DOCS: https://orm.drizzle.team/docs/guides/d1-http-with-drizzle-kit
  dialect: "sqlite",
  driver: "d1-http",
  {{else}}
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
    {{#if (eq dbSetup "turso")}}
    authToken: process.env.DATABASE_AUTH_TOKEN,
    {{/if}}
  },
  {{/if}}
});
`],
  ["db/drizzle/postgres/drizzle.config.ts.hbs", `import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({
    {{#if (eq backend "self")}}
    path: "../../apps/web/.env",
    {{else}}
    path: "../../apps/server/.env",
    {{/if}}
});

export default defineConfig({
  schema: "./src/schema",
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
});
`],
  ["backend/server/base/_gitignore", `# prod
dist/
/build
/out/

# dev
.yarn/
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions
.vscode/*
!.vscode/launch.json
!.vscode/*.code-snippets
.idea/workspace.xml
.idea/usage.statistics.xml
.idea/shelf
.wrangler
.alchemy
/.next/
.vercel
prisma/generated/


# deps
node_modules/
/node_modules
/.pnp
.pnp.*

# env
.env*
.env.production
!.env.example
.dev.vars

# logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# misc
.DS_Store
*.pem

# local db
*.db*

# typescript
*.tsbuildinfo
next-env.d.ts
`],
  ["backend/server/base/package.json.hbs", `{
	"name": "server",
	"main": "src/index.ts",
	"type": "module",
	"scripts": {
		"build": "tsdown",
		"check-types": "tsc -b",
		"compile": "bun build --compile --minify --sourcemap --bytecode ./src/index.ts --outfile server"
	},
	"dependencies": {},
	{{#if (eq dbSetup 'supabase')}}
	"trustedDependencies": [
        "supabase"
    ],
    {{/if}}
	"devDependencies": {}
}
`],
  ["backend/server/base/tsconfig.json.hbs", `{
  "extends": "@{{projectName}}/config/tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
		"outDir": "dist",
		"baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "jsx": "react-jsx"{{#if (eq backend "hono")}},
    "jsxImportSource": "hono/jsx"{{/if}}
  }
}
`],
  ["backend/server/base/tsdown.config.ts.hbs", `import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: './src/index.ts',
    format: 'esm',
    outDir: './dist',
    clean: true,
    noExternal: [/@{{projectName}}\\/.*/]
});
`],
  ["db-setup/docker-compose/mysql/docker-compose.yml.hbs", `name: {{projectName}}

services:
  mysql:
    image: mysql
    container_name: {{projectName}}-mysql
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: {{projectName}}
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    ports:
      - "3306:3306"
    volumes:
      - {{projectName}}_mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  {{projectName}}_mysql_data:`],
  ["db-setup/docker-compose/mongodb/docker-compose.yml.hbs", `name: {{projectName}}

services:
  mongodb:
    image: mongo
    container_name: {{projectName}}-mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: {{projectName}}
    ports:
      - "27017:27017"
    volumes:
      - {{projectName}}_mongodb_data:/data/db
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  {{projectName}}_mongodb_data:`],
  ["db-setup/docker-compose/postgres/docker-compose.yml.hbs", `name: {{projectName}}

services:
  postgres:
    image: postgres
    container_name: {{projectName}}-postgres
    environment:
      POSTGRES_DB: {{projectName}}
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - {{projectName}}_postgres_data:/var/lib/postgresql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  {{projectName}}_postgres_data:`],
  ["frontend/react/tanstack-router/src/components/mode-toggle.tsx.hbs", `import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="icon" />}>
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
`],
  ["frontend/react/tanstack-router/src/components/theme-provider.tsx.hbs", `import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export { useTheme } from "next-themes";
`],
  ["frontend/react/tanstack-router/src/routes/__root.tsx.hbs", `import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
{{#if (eq api "orpc")}}
import { link, orpc } from "@/utils/orpc";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import type { AppRouterClient } from "@{{projectName}}/api/routers/index";
import { createORPCClient } from "@orpc/client";
{{/if}}
{{#if (eq api "trpc")}}
import type { trpc } from "@/utils/trpc";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
{{/if}}
import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import "../index.css";

{{#if (eq api "orpc")}}
export interface RouterAppContext {
  orpc: typeof orpc;
  queryClient: QueryClient;
}
{{else if (eq api "trpc")}}
export interface RouterAppContext {
  trpc: typeof trpc;
  queryClient: QueryClient;
}
{{else}}
export interface RouterAppContext {}
{{/if}}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: "{{projectName}}",
      },
      {
        name: "description",
        content: "{{projectName}} is a web application",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
});

function RootComponent() {
  {{#if (eq api "orpc")}}
  const [client] = useState<AppRouterClient>(() => createORPCClient(link));
  const [orpcUtils] = useState(() => createTanstackQueryUtils(client));
  {{/if}}

  return (
    <>
      <HeadContent />
      {{#if (eq api "orpc")}}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          storageKey="vite-ui-theme"
        >
          <div className="grid grid-rows-[auto_1fr] h-svh">
            <Header />
            <Outlet />
          </div>
          <Toaster richColors />
        </ThemeProvider>
      {{else}}
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
        storageKey="vite-ui-theme"
      >
        <div className="grid grid-rows-[auto_1fr] h-svh">
          <Header />
          <Outlet />
        </div>
        <Toaster richColors />
      </ThemeProvider>
      {{/if}}
      <TanStackRouterDevtools position="bottom-left" />
      {{#if (or (eq api "orpc") (eq api "trpc"))}}
      <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
      {{/if}}
    </>
  );
}
`],
  ["frontend/react/tanstack-router/src/routes/index.tsx.hbs", `import { createFileRoute } from "@tanstack/react-router";
{{#if (eq api "orpc")}}
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
{{/if}}
{{#if (eq api "trpc")}}
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
{{/if}}
{{#if (eq backend "convex")}}
import { useQuery } from "convex/react";
import { api } from "@{{ projectName }}/backend/convex/_generated/api";
{{/if}}

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

const TITLE_TEXT = \`
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 \`;

function HomeComponent() {
  {{#if (eq api "orpc")}}
  const healthCheck = useQuery(orpc.healthCheck.queryOptions());
  {{/if}}
  {{#if (eq api "trpc")}}
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());
  {{/if}}
  {{#if (eq backend "convex")}}
  const healthCheck = useQuery(api.healthCheck.get);
  {{/if}}

  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <pre className="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
      <div className="grid gap-6">
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">API Status</h2>
          {{#if (eq backend "convex")}}
          <div className="flex items-center gap-2">
            <div
              className={\`h-2 w-2 rounded-full \${healthCheck === "OK" ? "bg-green-500" : healthCheck === undefined ? "bg-orange-400" : "bg-red-500"}\`}
            />
            <span className="text-sm text-muted-foreground">
              {healthCheck === undefined
                ? "Checking..."
                : healthCheck === "OK"
                  ? "Connected"
                  : "Error"}
            </span>
          </div>
          {{else}}
            {{#unless (eq api "none")}}
            <div className="flex items-center gap-2">
              <div
                className={\`h-2 w-2 rounded-full \${healthCheck.data ? "bg-green-500" : "bg-red-500"}\`}
              />
              <span className="text-sm text-muted-foreground">
                {healthCheck.isLoading
                  ? "Checking..."
                  : healthCheck.data
                    ? "Connected"
                    : "Disconnected"}
              </span>
            </div>
            {{/unless}}
          {{/if}}
        </section>
      </div>
    </div>
  );
}
`],
  ["backend/convex/packages/backend/_gitignore", `
.env.local
`],
  ["backend/convex/packages/backend/package.json.hbs", `{
  "name": "@{{projectName}}/backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "convex dev",
    "dev:setup": "convex dev --configure --until-success"
  },
  "author": "",
  "license": "ISC",
  "description": "",
  "devDependencies": {
    "@types/node": "^24.3.0"
  },
  "dependencies": {}
}
`],
  ["frontend/react/next/src/app/favicon.ico", `[Binary file]`],
  ["frontend/react/next/src/app/layout.tsx.hbs", `import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../index.css";
{{#if (eq auth "clerk")}}{{#if (eq backend "convex")}}import { ClerkProvider } from "@clerk/nextjs";
{{/if}}{{/if}}{{#if (and (eq backend "convex") (eq auth "better-auth"))}}
import { getToken } from "@/lib/auth-server";
{{/if}}
import Providers from "@/components/providers";
import Header from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "{{projectName}}",
  description: "{{projectName}}",
};

{{#if (and (eq backend "convex") (eq auth "better-auth"))}}
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await getToken();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={\`\${geistSans.variable} \${geistMono.variable} antialiased\`}
      >
        <Providers initialToken={token}>
          <div className="grid grid-rows-[auto_1fr] h-svh">
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
{{else}}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={\`\${geistSans.variable} \${geistMono.variable} antialiased\`}
			>
				{{#if (and (eq auth "clerk") (eq backend "convex"))}}<ClerkProvider>
					<Providers>
						<div className="grid grid-rows-[auto_1fr] h-svh">
							<Header />
							{children}
						</div>
					</Providers>
				</ClerkProvider>{{else}}<Providers>
					<div className="grid grid-rows-[auto_1fr] h-svh">
						<Header />
						{children}
					</div>
				</Providers>{{/if}}
			</body>
		</html>
	);
}
{{/if}}
`],
  ["frontend/react/next/src/app/page.tsx.hbs", `"use client"
{{#if (eq backend "convex")}}
import { useQuery } from "convex/react";
import { api } from "@{{projectName}}/backend/convex/_generated/api";
{{else if (or (eq api "orpc") (eq api "trpc"))}}
import { useQuery } from "@tanstack/react-query";
  {{#if (eq api "orpc")}}
import { orpc } from "@/utils/orpc";
  {{/if}}
  {{#if (eq api "trpc")}}
import { trpc } from "@/utils/trpc";
  {{/if}}
{{/if}}

const TITLE_TEXT = \`
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 \`;

export default function Home() {
  {{#if (eq backend "convex")}}
  const healthCheck = useQuery(api.healthCheck.get);
  {{else if (eq api "orpc")}}
  const healthCheck = useQuery(orpc.healthCheck.queryOptions());
  {{else if (eq api "trpc")}}
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());
  {{/if}}

  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <pre className="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
      <div className="grid gap-6">
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">API Status</h2>
          {{#if (eq backend "convex")}}
          <div className="flex items-center gap-2">
            <div
              className={\`h-2 w-2 rounded-full \${healthCheck === "OK" ? "bg-green-500" : healthCheck === undefined ? "bg-orange-400" : "bg-red-500"}\`}
            />
            <span className="text-sm text-muted-foreground">
              {healthCheck === undefined
                ? "Checking..."
                : healthCheck === "OK"
                  ? "Connected"
                  : "Error"}
            </span>
          </div>
          {{else}}
            {{#unless (eq api "none")}}
            <div className="flex items-center gap-2">
              <div
                className={\`h-2 w-2 rounded-full \${healthCheck.data ? "bg-green-500" : "bg-red-500"}\`}
              />
              <span className="text-sm text-muted-foreground">
                {healthCheck.isLoading
                  ? "Checking..."
                  : healthCheck.data
                    ? "Connected"
                    : "Disconnected"}
              </span>
            </div>
            {{/unless}}
          {{/if}}
        </section>
      </div>
    </div>
  );
}
`],
  ["auth/better-auth/native/bare/components/sign-in.tsx.hbs", `import { authClient } from "@/lib/auth-client";
{{#if (eq api "trpc")}}
import { queryClient } from "@/utils/trpc";
{{/if}}
{{#if (eq api "orpc")}}
import { queryClient } from "@/utils/orpc";
{{/if}}
import { useState } from "react";
import {
ActivityIndicator,
Text,
TextInput,
TouchableOpacity,
View,
StyleSheet,
} from "react-native";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";

function SignIn() {
const { colorScheme } = useColorScheme();
const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;
const [form, setForm] = useState({ email: "", password: "" });
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

    function handleFormChange(field: "email" | "password", value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    }

    async function handleLogin() {
    setIsLoading(true);
    setError(null);

    await authClient.signIn.email(
    {
    email: form.email,
    password: form.password,
    },
    {
    onError(error) {
    setError(error.error?.message || "Failed to sign in");
    setIsLoading(false);
    },
    onSuccess() {
    setForm({ email: "", password: "" });
    {{#if (eq api "orpc")}}
    queryClient.refetchQueries();
    {{/if}}
    {{#if (eq api "trpc")}}
    queryClient.refetchQueries();
    {{/if}}
    },
    onFinished() {
    setIsLoading(false);
    },
    }
    );
    }

    return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>Sign In</Text>

        {error ? (
        <View style={[styles.errorContainer, { backgroundColor: theme.notification + "20" }]}>
            <Text style={[styles.errorText, { color: theme.notification }]}>{error}</Text>
        </View>
        ) : null}

        <TextInput style={[ styles.input, { color: theme.text, borderColor: theme.border, backgroundColor:
            theme.background }, ]} placeholder="Email" placeholderTextColor={theme.text} value={form.email}
            onChangeText={value=> handleFormChange("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
            />

            <TextInput style={[ styles.input, { color: theme.text, borderColor: theme.border, backgroundColor:
                theme.background }, ]} placeholder="Password" placeholderTextColor={theme.text} value={form.password}
                onChangeText={value=> handleFormChange("password", value)}
                secureTextEntry
                />

                <TouchableOpacity onPress={handleLogin} disabled={isLoading} style={[ styles.button, { backgroundColor:
                    theme.primary, opacity: isLoading ? 0.5 : 1 }, ]}>
                    {isLoading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                    <Text style={styles.buttonText}>Sign In</Text>
                    )}
                </TouchableOpacity>
    </View>
    );
    }

    const styles = StyleSheet.create({
    card: {
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
    },
    title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    },
    errorContainer: {
    marginBottom: 12,
    padding: 8,
    },
    errorText: {
    fontSize: 14,
    },
    input: {
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    },
    button: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    },
    buttonText: {
    color: "#ffffff",
    fontSize: 16,
    },
    });

    export { SignIn };`],
  ["auth/better-auth/native/bare/components/sign-up.tsx.hbs", `import { authClient } from "@/lib/auth-client";
{{#if (eq api "trpc")}}
import { queryClient } from "@/utils/trpc";
{{/if}}
{{#if (eq api "orpc")}}
import { queryClient } from "@/utils/orpc";
{{/if}}
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";

function SignUp() {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignUp() {
    setIsLoading(true);
    setError(null);

    await authClient.signUp.email(
      {
        name,
        email,
        password,
      },
      {
        onError(error) {
          setError(error.error?.message || "Failed to sign up");
          setIsLoading(false);
        },
        onSuccess() {
          setName("");
          setEmail("");
          setPassword("");
          {{#if (eq api "orpc")}}
          queryClient.refetchQueries();
          {{/if}}
          {{#if (eq api "trpc")}}
          queryClient.refetchQueries();
          {{/if}}
        },
        onFinished() {
          setIsLoading(false);
        },
      }
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>

      {error ? (
        <View style={[styles.errorContainer, { backgroundColor: theme.notification + "20" }]}>
          <Text style={[styles.errorText, { color: theme.notification }]}>{error}</Text>
        </View>
      ) : null}

      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
        placeholder="Name"
        placeholderTextColor={theme.text}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
        placeholder="Email"
        placeholderTextColor={theme.text}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
        placeholder="Password"
        placeholderTextColor={theme.text}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        onPress={handleSignUp}
        disabled={isLoading}
        style={[styles.button, { backgroundColor: theme.primary, opacity: isLoading ? 0.5 : 1 }]}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  errorContainer: {
    marginBottom: 12,
    padding: 8,
  },
  errorText: {
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});

export { SignUp };

`],
  ["db/prisma/mysql/src/index.ts.hbs", `{{#if (eq runtime "workers")}}
import { PrismaClient } from "../prisma/generated/client";
import { env } from "@{{projectName}}/env/server";

{{#if (eq dbSetup "planetscale")}}
import { PrismaPlanetScale } from "@prisma/adapter-planetscale";

const adapter = new PrismaPlanetScale({ url: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
{{else}}
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const databaseUrl: string = env.DATABASE_URL;
const url: URL = new URL(databaseUrl);
const connectionConfig = {
	host: url.hostname,
	port: parseInt(url.port || "3306"),
	user: url.username,
	password: url.password,
	database: url.pathname.slice(1),
};

const adapter = new PrismaMariaDb(connectionConfig);
const prisma = new PrismaClient({ adapter });
{{/if}}

export default prisma;
{{else}}
import { PrismaClient } from "../prisma/generated/client";
import { env } from "@{{projectName}}/env/server";

{{#if (eq dbSetup "planetscale")}}
import { PrismaPlanetScale } from "@prisma/adapter-planetscale";

const adapter = new PrismaPlanetScale({ url: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
{{else}}
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const databaseUrl: string = env.DATABASE_URL;
const url: URL = new URL(databaseUrl);
const connectionConfig = {
	host: url.hostname,
	port: parseInt(url.port || "3306"),
	user: url.username,
	password: url.password,
	database: url.pathname.slice(1),
};

const adapter = new PrismaMariaDb(connectionConfig);
const prisma = new PrismaClient({ adapter });
{{/if}}

export default prisma;
{{/if}}`],
  ["frontend/native/bare/app/(drawer)/_layout.tsx.hbs", `import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";

import { HeaderButton } from "@/components/header-button";

const DrawerLayout = () => {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;

  return (
    <Drawer
      screenOptions=\\{{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTitleStyle: {
          color: theme.text,
        },
        headerTintColor: theme.text,
        drawerStyle: {
          backgroundColor: theme.background,
        },
        drawerLabelStyle: {
          color: theme.text,
        },
        drawerInactiveTintColor: theme.text,
      }}
    >
      <Drawer.Screen
        name="index"
        options=\\{{
          headerTitle: "Home",
          drawerLabel: "Home",
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="(tabs)"
        options=\\{{
          headerTitle: "Tabs",
          drawerLabel: "Tabs",
          drawerIcon: ({ size, color }) => (
            <MaterialIcons name="border-bottom" size={size} color={color} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <HeaderButton />
            </Link>
          ),
        }}
      />
      {{#if (includes examples "todo")}}
      <Drawer.Screen
        name="todos"
        options=\\{{
          headerTitle: "Todos",
          drawerLabel: "Todos",
          drawerIcon: ({ size, color }) => (
            <Ionicons name="checkbox-outline" size={size} color={color} />
          ),
        }}
      />
      {{/if}}
      {{#if (includes examples "ai")}}
      <Drawer.Screen
        name="ai"
        options=\\{{
          headerTitle: "AI",
          drawerLabel: "AI",
          drawerIcon: ({ size, color }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      {{/if}}
    </Drawer>
  );
};

export default DrawerLayout;

`],
  ["frontend/native/bare/app/(drawer)/index.tsx.hbs", `import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Container } from "@/components/container";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";
{{#if (eq api "orpc")}}
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
{{/if}}
{{#if (eq api "trpc")}}
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
{{/if}}
{{#if (and (eq backend "convex") (eq auth "clerk"))}}
import { Link } from "expo-router";
import { Authenticated, AuthLoading, Unauthenticated, useQuery } from "convex/react";
import { api } from "@{{ projectName }}/backend/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { SignOutButton } from "@/components/sign-out-button";
{{else if (and (eq backend "convex") (eq auth "better-auth"))}}
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@{{ projectName }}/backend/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { SignIn } from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
{{else if (eq backend "convex")}}
import { useQuery } from "convex/react";
import { api } from "@{{ projectName }}/backend/convex/_generated/api";
{{/if}}

export default function Home() {
const { colorScheme } = useColorScheme();
const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;
{{#if (eq api "orpc")}}
const healthCheck = useQuery(orpc.healthCheck.queryOptions());
{{/if}}
{{#if (eq api "trpc")}}
const healthCheck = useQuery(trpc.healthCheck.queryOptions());
{{/if}}
{{#if (and (eq backend "convex") (eq auth "clerk"))}}
const { user } = useUser();
const healthCheck = useQuery(api.healthCheck.get);
const privateData = useQuery(api.privateData.get);
{{else if (and (eq backend "convex") (eq auth "better-auth"))}}
const healthCheck = useQuery(api.healthCheck.get);
const { isAuthenticated } = useConvexAuth();
const user = useQuery(api.auth.getCurrentUser, isAuthenticated ? {} : "skip");
{{else if (eq backend "convex")}}
const healthCheck = useQuery(api.healthCheck.get);
{{/if}}

return (
<Container>
  <ScrollView style={styles.scrollView}>
    <View style={styles.content}>
      <Text style={[styles.title, { color: theme.text }]}>
        BETTER T STACK
      </Text>

      {{#unless (and (eq backend "convex") (eq auth "better-auth"))}}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {{#if (eq backend "convex")}}
        <View style={styles.statusRow}>
          <View style={[styles.statusIndicator, { backgroundColor: healthCheck ? "#10b981" : "#f59e0b" }]} />
          <View style={styles.statusContent}>
            <Text style={[styles.statusTitle, { color: theme.text }]}>
              Convex
            </Text>
            <Text style={[styles.statusText, { color: theme.text, opacity: 0.7 }]}>
              {healthCheck === undefined
              ? "Checking..."
              : healthCheck === "OK"
              ? "Connected to API"
              : "API Disconnected"}
            </Text>
          </View>
        </View>
        {{else}}
        {{#unless (eq api "none")}}
        <View style={styles.statusRow}>
          <View style={[styles.statusIndicator, { backgroundColor: healthCheck.data ? "#10b981" : "#f59e0b" }]} />
          <View style={styles.statusContent}>
            <Text style={[styles.statusTitle, { color: theme.text }]}>
              {{#if (eq api "orpc")}}ORPC{{else}}TRPC{{/if}}
            </Text>
            <Text style={[styles.statusText, { color: theme.text, opacity: 0.7 }]}>
              {healthCheck.isLoading
              ? "Checking connection..."
              : healthCheck.data
              ? "All systems operational"
              : "Service unavailable"}
            </Text>
          </View>
        </View>
        {{/unless}}
        {{/if}}
      </View>
      {{/unless}}

      {{#if (and (eq backend "convex") (eq auth "clerk"))}}
      <Authenticated>
        <Text style=\\{{ color: theme.text }}>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <Text style=\\{{ color: theme.text }}>Private Data: {privateData?.message}</Text>
        <SignOutButton />
      </Authenticated>
      <Unauthenticated>
        <Link href="/(auth)/sign-in">
        <Text style=\\{{ color: theme.primary }}>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
        <Text style=\\{{ color: theme.primary }}>Sign up</Text>
        </Link>
      </Unauthenticated>
      <AuthLoading>
        <Text style=\\{{ color: theme.text }}>Loading...</Text>
      </AuthLoading>
      {{/if}}

      {{#if (and (eq backend "convex") (eq auth "better-auth"))}}
      {user ? (
      <View style={[styles.userCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.userHeader}>
          <Text style={[styles.userText, { color: theme.text }]}>
            Welcome, <Text style={styles.userName}>{user.name}</Text>
          </Text>
        </View>
        <Text style={[styles.userEmail, { color: theme.text, opacity: 0.7 }]}>
          {user.email}
        </Text>
        <TouchableOpacity style={[styles.signOutButton, { backgroundColor: theme.notification }]} onPress={()=> {
          authClient.signOut();
          }}
          >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      ) : null}
      <View style={[styles.statusCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.statusCardTitle, { color: theme.text }]}>
          API Status
        </Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusIndicator, { backgroundColor: healthCheck ? "#10b981" : "#ef4444" }]} />
          <Text style={[styles.statusText, { color: theme.text, opacity: 0.7 }]}>
            {healthCheck === undefined
            ? "Checking..."
            : healthCheck === "OK"
            ? "Connected to API"
            : "API Disconnected"}
          </Text>
        </View>
      </View>
      {!user && (
      <>
        <SignIn />
        <SignUp />
      </>
      )}
      {{/if}}
    </View>
  </ScrollView>
</Container>
);
}

const styles = StyleSheet.create({
scrollView: {
flex: 1,
},
content: {
padding: 16,
},
title: {
fontSize: 24,
fontWeight: "bold",
marginBottom: 16,
},
card: {
padding: 16,
marginBottom: 16,
borderWidth: 1,
},
statusRow: {
flexDirection: "row",
alignItems: "center",
gap: 8,
},
statusIndicator: {
height: 8,
width: 8,
},
statusContent: {
flex: 1,
},
statusTitle: {
fontSize: 14,
fontWeight: "bold",
},
statusText: {
fontSize: 12,
},
userCard: {
marginBottom: 16,
padding: 16,
borderWidth: 1,
},
userHeader: {
marginBottom: 8,
},
userText: {
fontSize: 16,
},
userName: {
fontWeight: "bold",
},
userEmail: {
fontSize: 14,
marginBottom: 12,
},
signOutButton: {
padding: 12,
},
signOutText: {
color: "#ffffff",
},
statusCard: {
marginBottom: 16,
padding: 16,
borderWidth: 1,
},
statusCardTitle: {
marginBottom: 8,
fontWeight: "bold",
},
});`],
  ["frontend/react/react-router/src/routes/_index.tsx.hbs", `import type { Route } from "./+types/_index";
{{#if (eq backend "convex")}}
import { useQuery } from "convex/react";
import { api } from "@{{projectName}}/backend/convex/_generated/api";
{{else if (or (eq api "orpc") (eq api "trpc"))}}
import { useQuery } from "@tanstack/react-query";
  {{#if (eq api "orpc")}}
  import { orpc } from "@/utils/orpc";
  {{/if}}
  {{#if (eq api "trpc")}}
  import { trpc } from "@/utils/trpc";
  {{/if}}
{{/if}}

const TITLE_TEXT = \`
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 \`;

export function meta({}: Route.MetaArgs) {
  return [{ title: "{{projectName}}" }, { name: "description", content: "{{projectName}} is a web application" }];
}

export default function Home() {
  {{#if (eq backend "convex")}}
  const healthCheck = useQuery(api.healthCheck.get);
  {{else if (eq api "orpc")}}
  const healthCheck = useQuery(orpc.healthCheck.queryOptions());
  {{else if (eq api "trpc")}}
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());
  {{/if}}

  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <pre className="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
      <div className="grid gap-6">
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">API Status</h2>
          {{#if (eq backend "convex")}}
          <div className="flex items-center gap-2">
            <div
              className={\`h-2 w-2 rounded-full \${healthCheck === "OK" ? "bg-green-500" : healthCheck === undefined ? "bg-orange-400" : "bg-red-500"}\`}
            />
            <span className="text-sm text-muted-foreground">
              {healthCheck === undefined
                ? "Checking..."
                : healthCheck === "OK"
                  ? "Connected"
                  : "Error"}
            </span>
          </div>
          {{else}}
            {{#unless (eq api "none")}}
            <div className="flex items-center gap-2">
              <div
                className={\`h-2 w-2 rounded-full \${
                  healthCheck.data ? "bg-green-500" : "bg-red-500"
                }\`}
              />
              <span className="text-sm text-muted-foreground">
                {healthCheck.isLoading
                  ? "Checking..."
                  : healthCheck.data
                  ? "Connected"
                  : "Disconnected"}
              </span>
            </div>
            {{/unless}}
          {{/if}}
        </section>
      </div>
    </div>
  );
}
`],
  ["frontend/nuxt/app/assets/css/main.css", `@import "tailwindcss";
@import "@nuxt/ui";
`],
  ["frontend/native/unistyles/components/header-button.tsx.hbs", `import FontAwesome from "@expo/vector-icons/FontAwesome";
import { forwardRef } from "react";
import { Pressable } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export const HeaderButton = forwardRef<
  typeof Pressable,
  { onPress?: () => void }
>(({ onPress }, ref) => {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      {({ pressed }) => (
        <FontAwesome
          name="info-circle"
          size={20}
          color={styles.icon.color}
          style=\\{{
            opacity: pressed ? 0.7 : 1,
          }}
        />
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create((theme) => ({
  button: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: \`\${theme.colors.secondary}80\`, // 50% opacity
  },
  icon: {
    color: theme.colors.secondaryForeground,
  },
}));
`],
  ["frontend/native/unistyles/components/tabbar-icon.tsx.hbs", `import FontAwesome from "@expo/vector-icons/FontAwesome";

export const TabBarIcon = (props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) => {
  return <FontAwesome size={24} style=\\{{ marginBottom: -3 }} {...props} />;
};
`],
  ["frontend/native/unistyles/components/container.tsx.hbs", `import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

export const Container = ({ children }: { children: React.ReactNode }) => {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingBottom: rt.insets.bottom,
  },
}));
`],
  ["frontend/native/unistyles/app/modal.tsx.hbs", `import { Container } from "@/components/container";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function Modal() {
  return (
    <Container>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Modal</Text>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize["2xl"],
    fontWeight: "bold",
    color: theme.colors.foreground,
  },
}));
`],
  ["frontend/native/unistyles/app/_layout.tsx.hbs", `{{#if (includes examples "ai")}}
import "@/polyfills";
{{/if}}
{{#if (eq api "trpc")}}
import { queryClient } from "@/utils/trpc";
{{/if}}
{{#if (eq api "orpc")}}
import { queryClient } from "@/utils/orpc";
{{/if}}
{{#if (eq backend "convex")}}
{{#if (eq auth "better-auth")}}
import { ConvexReactClient } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "@/lib/auth-client";
import { env } from "@{{projectName}}/env/native";
{{else}}
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { env } from "@{{projectName}}/env/native";
{{/if}}
{{#if (eq auth "clerk")}}
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
{{/if}}
{{else}}
  {{#unless (eq api "none")}}
import { QueryClientProvider } from "@tanstack/react-query";
  {{/unless}}
{{/if}}
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useUnistyles } from "react-native-unistyles";
import { StatusBar } from "expo-status-bar";

export const unstable_settings = {
  initialRouteName: "(drawer)",
};

{{#if (eq backend "convex")}}
const convex = new ConvexReactClient(env.EXPO_PUBLIC_CONVEX_URL, {
  unsavedChangesWarning: false,
});
{{/if}}

export default function RootLayout() {
  const { theme } = useUnistyles();

  return (
    {{#if (eq backend "convex")}}
    {{#if (eq auth "clerk")}}
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <GestureHandlerRootView style=\\{{ flex: 1 }}>
          <Stack
            screenOptions=\\{{
              headerStyle: {
                backgroundColor: theme.colors.background,
              },
              headerTitleStyle: {
                color: theme.colors.foreground,
              },
              headerTintColor: theme.colors.foreground,
            }}
          >
            <Stack.Screen name="(drawer)" options=\\{{ headerShown: false }} />
            <Stack.Screen name="(auth)" options=\\{{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options=\\{{ title: "Modal", presentation: "modal" }}
            />
          </Stack>
        </GestureHandlerRootView>
      </ConvexProviderWithClerk>
    </ClerkProvider>
    {{else if (eq auth "better-auth")}}
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      <GestureHandlerRootView style=\\{{ flex: 1 }}>
        <Stack
          screenOptions=\\{{
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTitleStyle: {
              color: theme.colors.foreground,
            },
            headerTintColor: theme.colors.foreground,
          }}
        >
          <Stack.Screen name="(drawer)" options=\\{{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options=\\{{ title: "Modal", presentation: "modal" }}
          />
        </Stack>
      </GestureHandlerRootView>
    </ConvexBetterAuthProvider>
    {{else}}
    <ConvexProvider client={convex}>
      <GestureHandlerRootView style=\\{{ flex: 1 }}>
        <Stack
          screenOptions=\\{{
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTitleStyle: {
              color: theme.colors.foreground,
            },
            headerTintColor: theme.colors.foreground,
          }}
        >
          <Stack.Screen name="(drawer)" options=\\{{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options=\\{{ title: "Modal", presentation: "modal" }}
          />
        </Stack>
      </GestureHandlerRootView>
    </ConvexProvider>
    {{/if}}
    {{else}}
      {{#unless (eq api "none")}}
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style=\\{{ flex: 1 }}>
        <Stack
          screenOptions=\\{{
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTitleStyle: {
              color: theme.colors.foreground,
            },
            headerTintColor: theme.colors.foreground,
          }}
        >
          <Stack.Screen name="(drawer)" options=\\{{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options=\\{{ title: "Modal", presentation: "modal" }}
          />
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
      {{else}}
      <GestureHandlerRootView style=\\{{ flex: 1 }}>
        <Stack
          screenOptions=\\{{
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTitleStyle: {
              color: theme.colors.foreground,
            },
            headerTintColor: theme.colors.foreground,
          }}
        >
          <Stack.Screen name="(drawer)" options=\\{{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options=\\{{ title: "Modal", presentation: "modal" }}
          />
        </Stack>
      </GestureHandlerRootView>
      {{/unless}}
    {{/if}}
  );
}
`],
  ["frontend/native/unistyles/app/+not-found.tsx.hbs", `import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Container } from "@/components/container";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options=\\{{ title: "Oops!" }} />
      <Container>
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.emoji}>🤔</Text>
            <Text style={styles.title}>Page Not Found</Text>
            <Text style={styles.description}>
              Sorry, the page you're looking for doesn't exist.
            </Text>
            <Link href="/" style={styles.button}>
              <Text style={styles.buttonText}>Go to Home</Text>
            </Link>
          </View>
        </View>
      </Container>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  content: {
    alignItems: "center",
  },
  emoji: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize["2xl"],
    fontWeight: "bold",
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  description: {
    color: theme.colors.mutedForeground,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
    maxWidth: 280,
  },
  button: {
    backgroundColor: \`\${theme.colors.primary}1A\`, // 10% opacity
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm + 4,
    borderRadius: theme.borderRadius.lg,
  },
  buttonText: {
    color: theme.colors.primary,
    fontWeight: "500",
  },
}));
`],
  ["api/orpc/server/src/index.ts.hbs", `import { ORPCError, os } from "@orpc/server";
import type { Context } from "./context";

export const o = os.$context<Context>();

export const publicProcedure = o;

{{#if (eq auth "better-auth")}}
const requireAuth = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }
  return next({
    context: {
      session: context.session,
    },
  });
});

export const protectedProcedure = publicProcedure.use(requireAuth);
{{/if}}
`],
  ["api/orpc/server/src/context.ts.hbs", `{{#if (and (eq backend 'self') (includes frontend "next"))}}
import type { NextRequest } from "next/server";
{{#if (eq auth "better-auth")}}
import { auth } from "@{{projectName}}/auth";
{{/if}}

export async function createContext(req: NextRequest) {
{{#if (eq auth "better-auth")}}
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  return {
    session,
  };
{{else}}
  return {}
{{/if}}
}

{{else if (and (eq backend 'self') (includes frontend "tanstack-start"))}}
{{#if (eq auth "better-auth")}}
import { auth } from "@{{projectName}}/auth";
{{/if}}

export async function createContext({ req }: { req: Request }) {
{{#if (eq auth "better-auth")}}
	const session = await auth.api.getSession({
		headers: req.headers,
	});
	return {
		session,
	};
{{else}}
	return {};
{{/if}}
}

{{else if (and (eq backend 'self') (includes frontend "nuxt"))}}
{{#if (eq auth "better-auth")}}
import { auth } from "@{{projectName}}/auth";
{{/if}}

export type CreateContextOptions = {
  headers: Headers;
};

export async function createContext({ headers }: CreateContextOptions) {
{{#if (eq auth "better-auth")}}
  const session = await auth.api.getSession({ headers });
  return {
    session,
  };
{{else}}
  return {};
{{/if}}
}

{{else if (eq backend 'hono')}}
import type { Context as HonoContext } from "hono";
{{#if (eq auth "better-auth")}}
import { auth } from "@{{projectName}}/auth";
{{/if}}

export type CreateContextOptions = {
  context: HonoContext;
};

export async function createContext({ context }: CreateContextOptions) {
{{#if (eq auth "better-auth")}}
  const session = await auth.api.getSession({
    headers: context.req.raw.headers,
  });
  return {
    session,
  };
{{else}}
  // No auth configured
  return {
    session: null,
  };
{{/if}}
}

{{else if (eq backend 'elysia')}}
import type { Context as ElysiaContext } from "elysia";
{{#if (eq auth "better-auth")}}
import { auth } from "@{{projectName}}/auth";
{{/if}}

export type CreateContextOptions = {
  context: ElysiaContext;
};

export async function createContext({ context }: CreateContextOptions) {
{{#if (eq auth "better-auth")}}
  const session = await auth.api.getSession({
    headers: context.request.headers,
  });
  return {
    session,
  };
{{else}}
  // No auth configured
  return {
    session: null,
  };
{{/if}}
}

{{else if (eq backend 'express')}}
import type { Request } from "express";
{{#if (eq auth "better-auth")}}
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "@{{projectName}}/auth";
{{/if}}

interface CreateContextOptions {
	req: Request;
}

export async function createContext(opts: CreateContextOptions) {
{{#if (eq auth "better-auth")}}
	const session = await auth.api.getSession({
		headers: fromNodeHeaders(opts.req.headers),
	});
	return {
		session,
	};
{{else}}
  // No auth configured
	return {
		session: null,
	};
{{/if}}
}

{{else if (eq backend 'fastify')}}
import type { IncomingHttpHeaders } from "node:http";
{{#if (eq auth "better-auth")}}
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "@{{projectName}}/auth";
{{/if}}

export async function createContext(req: IncomingHttpHeaders) {
{{#if (eq auth "better-auth")}}
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req),
  });
  return {
    session,
  };
{{else}}
  // No auth configured
  return {
    session: null,
  };
{{/if}}
}

{{else}}
export async function createContext() {
  return {
    session: null,
  };
}
{{/if}}

export type Context = Awaited<ReturnType<typeof createContext>>;
`],
  ["db/prisma/postgres/src/index.ts.hbs", `{{#if (eq runtime "workers")}}
import { PrismaClient } from "../prisma/generated/client";
import { env } from "@{{projectName}}/env/server";
{{#if (eq dbSetup "neon")}}
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";

neonConfig.poolQueryViaFetch = true;

const prisma = new PrismaClient({
	adapter: new PrismaNeon({
		connectionString: env.DATABASE_URL,
	}),
});

{{else if (eq dbSetup "prisma-postgres")}}
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
	connectionString: env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

{{else}}
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

{{/if}}

export default prisma;
{{else}}
import { PrismaClient } from "../prisma/generated/client";
import { env } from "@{{projectName}}/env/server";
{{#if (eq dbSetup "neon")}}
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;

const adapter = new PrismaNeon({
	connectionString: env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

{{else if (eq dbSetup "prisma-postgres")}}
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
	connectionString: env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

{{else}}
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

{{/if}}

export default prisma;
{{/if}}`],
  ["db/drizzle/mysql/src/index.ts.hbs", `{{#if (or (eq runtime "bun") (eq runtime "node") (eq runtime "none"))}}
import { env } from "@{{projectName}}/env/server";
import * as schema from "./schema";

{{#if (eq dbSetup "planetscale")}}
import { drizzle } from "drizzle-orm/planetscale-serverless";

export const db = drizzle({
	connection: {
		host: env.DATABASE_HOST,
		username: env.DATABASE_USERNAME,
		password: env.DATABASE_PASSWORD,
	},
	schema,
});
{{else}}
import { drizzle } from "drizzle-orm/mysql2";

export const db = drizzle({
	connection: {
		uri: env.DATABASE_URL,
	},
	schema,
});
{{/if}}
{{/if}}

{{#if (eq runtime "workers")}}
import * as schema from "./schema";

{{#if (eq dbSetup "planetscale")}}
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { env } from "@{{projectName}}/env/server";

export const db = drizzle({
	connection: {
		host: env.DATABASE_HOST,
		username: env.DATABASE_USERNAME,
		password: env.DATABASE_PASSWORD,
	},
	schema,
});
{{else}}
import { drizzle } from "drizzle-orm/mysql2";
import { env } from "@{{projectName}}/env/server";

export const db = drizzle({
	connection: {
		uri: env.DATABASE_URL,
	},
	schema,
});
{{/if}}
{{/if}}
`],
  ["auth/better-auth/server/base/_gitignore", `# dependencies (bun install)
node_modules

# output
out
dist
*.tgz

# code coverage
coverage
*.lcov

# logs
logs
_.log
report.[0-9]_.[0-9]_.[0-9]_.[0-9]_.json

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# caches
.eslintcache
.cache
*.tsbuildinfo

# IntelliJ based IDEs
.idea

# Finder (MacOS) folder config
.DS_Store
`],
  ["auth/better-auth/server/base/package.json.hbs", `{
  "name": "@{{projectName}}/auth",
  "exports": {
    ".": {
      "default": "./src/index.ts"
    },
    "./*": {
      "default": "./src/*.ts"
    }
  },
  "type": "module",
  "scripts": {},
  "devDependencies": {}
}`],
  ["auth/better-auth/server/base/tsconfig.json.hbs", `{
  "extends": "@{{projectName}}/config/tsconfig.base.json",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "composite": true
  }
}`],
  ["auth/better-auth/convex/backend/convex/auth.ts.hbs", `import { createClient, type GenericCtx } from "@convex-dev/better-auth";
{{#if (or (includes frontend "native-bare") (includes frontend "native-uniwind") (includes frontend "native-unistyles"))}}
import { convex } from "@convex-dev/better-auth/plugins";
import { expo } from "@better-auth/expo";
{{else if (or (includes frontend "tanstack-router") (includes frontend "react-router") (includes frontend "nuxt") (includes frontend "svelte") (includes frontend "solid"))}}
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
{{else}}
import { convex } from "@convex-dev/better-auth/plugins";
{{/if}}
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { betterAuth } from "better-auth";
import authConfig from "./auth.config";

{{#if (or (includes frontend "tanstack-start") (includes frontend "next"))}}
const siteUrl = process.env.SITE_URL!;
{{else if (or (includes frontend "tanstack-router") (includes frontend "react-router") (includes frontend "nuxt") (includes frontend "svelte") (includes frontend "solid"))}}
const siteUrl = process.env.SITE_URL!;
{{/if}}
{{#if (or (includes frontend "native-bare") (includes frontend "native-uniwind") (includes frontend "native-unistyles"))}}
const nativeAppUrl = process.env.NATIVE_APP_URL || "mybettertapp://";
{{/if}}

export const authComponent = createClient<DataModel>(components.betterAuth);

function createAuth(ctx: GenericCtx<DataModel>) {
  return betterAuth({
    {{#if (and (or (includes frontend "native-bare") (includes frontend "native-uniwind") (includes frontend "native-unistyles")) (or (includes frontend "tanstack-start") (includes frontend "next")))}}
    baseURL: siteUrl,
    trustedOrigins: [siteUrl, nativeAppUrl],
    {{else if (and (or (includes frontend "native-bare") (includes frontend "native-uniwind") (includes frontend "native-unistyles")) (or (includes frontend "tanstack-router") (includes frontend "react-router") (includes frontend "nuxt") (includes frontend "svelte") (includes frontend "solid")))}}
    trustedOrigins: [siteUrl, nativeAppUrl],
    {{else if (or (includes frontend "native-bare") (includes frontend "native-uniwind") (includes frontend "native-unistyles"))}}
    trustedOrigins: [nativeAppUrl],
    {{else if (or (includes frontend "tanstack-start") (includes frontend "next"))}}
    baseURL: siteUrl,
    trustedOrigins: [siteUrl],
    {{else if (or (includes frontend "tanstack-router") (includes frontend "react-router") (includes frontend "nuxt") (includes frontend "svelte") (includes frontend "solid"))}}
    trustedOrigins: [siteUrl],
    {{/if}}
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      {{#if (or (includes frontend "native-bare") (includes frontend "native-uniwind") (includes frontend "native-unistyles"))}}
      expo(),
      {{else if (or (includes frontend "tanstack-router") (includes frontend "react-router") (includes frontend "nuxt") (includes frontend "svelte") (includes frontend "solid"))}}
      crossDomain({ siteUrl }),
      {{/if}}
      convex({
        authConfig,
        jwksRotateOnTokenGenerationError: true,
      }),
    ],
  });
}

export { createAuth };

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await authComponent.safeGetAuthUser(ctx);
  },
});
`],
  ["auth/better-auth/convex/backend/convex/privateData.ts.hbs", `import { query } from "./_generated/server";
import { authComponent } from "./auth";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      return {
        message: "Not authenticated",
      };
    }
    return {
      message: "This is private",
    };
  },
});
`],
  ["auth/better-auth/convex/backend/convex/auth.config.ts.hbs", `import { getAuthConfigProvider } from "@convex-dev/better-auth/auth-config";
import type { AuthConfig } from "convex/server";

export default {
  providers: [getAuthConfigProvider()],
} satisfies AuthConfig;
`],
  ["auth/better-auth/convex/backend/convex/http.ts.hbs", `import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();

{{#if (or (includes frontend "tanstack-router") (includes frontend "react-router") (includes frontend "nuxt") (includes frontend "svelte") (includes frontend "solid"))}}
authComponent.registerRoutes(http, createAuth, { cors: true });
{{else}}
authComponent.registerRoutes(http, createAuth);
{{/if}}

export default http;
`],
  ["backend/convex/packages/backend/convex/README.md", `# Welcome to your Convex functions directory!

Write your Convex functions here.
See https://docs.convex.dev/functions for more.

A query function that takes two arguments looks like:

\`\`\`ts
// convex/myFunctions.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const myQueryFunction = query({
  // Validators for arguments.
  args: {
    first: v.number(),
    second: v.string(),
  },

  // Function implementation.
  handler: async (ctx, args) => {
    // Read the database as many times as you need here.
    // See https://docs.convex.dev/database/reading-data.
    const documents = await ctx.db.query("tablename").collect();

    // Arguments passed from the client are properties of the args object.
    console.log(args.first, args.second);

    // Write arbitrary JavaScript here: filter, aggregate, build derived data,
    // remove non-public properties, or create new objects.
    return documents;
  },
});
\`\`\`

Using this query function in a React component looks like:

\`\`\`ts
const data = useQuery(api.myFunctions.myQueryFunction, {
  first: 10,
  second: "hello",
});
\`\`\`

A mutation function looks like:

\`\`\`ts
// convex/myFunctions.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const myMutationFunction = mutation({
  // Validators for arguments.
  args: {
    first: v.string(),
    second: v.string(),
  },

  // Function implementation.
  handler: async (ctx, args) => {
    // Insert or modify documents in the database here.
    // Mutations can also read from the database like queries.
    // See https://docs.convex.dev/database/writing-data.
    const message = { body: args.first, author: args.second };
    const id = await ctx.db.insert("messages", message);

    // Optionally, return a value from your mutation.
    return await ctx.db.get("messages", id);
  },
});
\`\`\`

Using this mutation function in a React component looks like:

\`\`\`ts
const mutation = useMutation(api.myFunctions.myMutationFunction);
function handleButtonPress() {
  // fire and forget, the most common way to use mutations
  mutation({ first: "Hello!", second: "me" });
  // OR
  // use the result once the mutation has completed
  mutation({ first: "Hello!", second: "me" }).then((result) =>
    console.log(result),
  );
}
\`\`\`

Use the Convex CLI to push your functions to a deployment. See everything
the Convex CLI can do by running \`npx convex -h\` in your project root
directory. To learn more, launch the docs with \`npx convex docs\`.
`],
  ["backend/convex/packages/backend/convex/convex.config.ts.hbs", `import { defineApp } from "convex/server";
{{#if (eq auth "better-auth")}}
import betterAuth from "@convex-dev/better-auth/convex.config";
{{/if}}
{{#if (includes examples "ai")}}
import agent from "@convex-dev/agent/convex.config";
{{/if}}

const app = defineApp();
{{#if (eq auth "better-auth")}}
app.use(betterAuth);
{{/if}}
{{#if (includes examples "ai")}}
app.use(agent);
{{/if}}

export default app;
`],
  ["backend/convex/packages/backend/convex/healthCheck.ts.hbs", `import { query } from "./_generated/server";

export const get = query({
  handler: async () => {
    return "OK";
  },
});
`],
  ["backend/convex/packages/backend/convex/tsconfig.json.hbs", `{
  /* This TypeScript project config describes the environment that
   * Convex functions run in and is used to typecheck them.
   * You can modify it, but some settings are required to use Convex.
   */
  "compilerOptions": {
    /* These settings are not required by Convex and can be modified. */
    "allowJs": true,
    "strict": true,
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "skipLibCheck": true,
    "allowSyntheticDefaultImports": true,

    /* These compiler options are required by Convex */
    "target": "ESNext",
    "lib": ["ES2021", "dom"],
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["./**/*"],
  "exclude": ["./_generated"]
}
`],
  ["backend/convex/packages/backend/convex/schema.ts.hbs", `import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
{{#if (includes examples "todo")}}
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
  }),
{{/if}}
});
`],
  ["payments/polar/web/nuxt/app/pages/success.vue.hbs", `<script setup lang="ts">
const route = useRoute()
const checkout_id = route.query.checkout_id as string
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-4">Payment Successful!</h1>
    <p v-if="checkout_id">Checkout ID: \\{{ checkout_id }}</p>
  </div>
</template>
`],
  ["frontend/native/base/assets/images/icon.png", `[Binary file]`],
  ["frontend/native/base/assets/images/partial-react-logo.png", `[Binary file]`],
  ["frontend/native/base/assets/images/android-icon-background.png", `[Binary file]`],
  ["frontend/native/base/assets/images/react-logo@2x.png", `[Binary file]`],
  ["frontend/native/base/assets/images/react-logo@3x.png", `[Binary file]`],
  ["frontend/native/base/assets/images/favicon.png", `[Binary file]`],
  ["frontend/native/base/assets/images/android-icon-foreground.png", `[Binary file]`],
  ["frontend/native/base/assets/images/react-logo.png", `[Binary file]`],
  ["frontend/native/base/assets/images/android-icon-monochrome.png", `[Binary file]`],
  ["frontend/native/base/assets/images/splash-icon.png", `[Binary file]`],
  ["frontend/react/web-base/src/lib/utils.ts.hbs", `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`],
  ["frontend/react/react-router/src/components/mode-toggle.tsx.hbs", `import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="icon" />}>
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
`],
  ["frontend/react/react-router/src/components/theme-provider.tsx.hbs", `import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export { useTheme } from "next-themes";
`],
  ["backend/server/fastify/src/index.ts.hbs", `import { env } from "@{{projectName}}/env/server";
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";

{{#if (eq api "trpc")}}
import { fastifyTRPCPlugin, type FastifyTRPCPluginOptions } from "@trpc/server/adapters/fastify";
import { createContext } from "@{{projectName}}/api/context";
import { appRouter, type AppRouter } from "@{{projectName}}/api/routers/index";
{{/if}}

{{#if (eq api "orpc")}}
import { OpenAPIHandler } from "@orpc/openapi/node";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { RPCHandler } from "@orpc/server/node";
import { CORSPlugin } from "@orpc/server/plugins";
import { onError } from "@orpc/server";
import { appRouter } from "@{{projectName}}/api/routers/index";
import { createServer } from "node:http";
{{#if (eq auth "better-auth")}}
import { createContext } from "@{{projectName}}/api/context";
{{/if}}
{{/if}}

{{#if (includes examples "ai")}}
import { streamText, type UIMessage, convertToModelMessages, wrapLanguageModel } from "ai";
import { google } from "@ai-sdk/google";
import { devToolsMiddleware } from "@ai-sdk/devtools";
{{/if}}

{{#if (eq auth "better-auth")}}
import { auth } from "@{{projectName}}/auth";
{{/if}}

const baseCorsConfig = {
	origin: env.CORS_ORIGIN,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: [
		"Content-Type",
		"Authorization",
		"X-Requested-With"
	],
	credentials: true,
	maxAge: 86400,
};

{{#if (eq api "orpc")}}
const rpcHandler = new RPCHandler(appRouter, {
	plugins: [
		new CORSPlugin({
			origin: env.CORS_ORIGIN,
			credentials: true,
			allowHeaders: ["Content-Type", "Authorization"],
		}),
	],
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

const apiHandler = new OpenAPIHandler(appRouter, {
	plugins: [
		new OpenAPIReferencePlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
		}),
	],
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

const fastify = Fastify({
	logger: true,
	serverFactory: (fastifyHandler) => {
		const server = createServer(async (req, res) => {
			const { matched } = await rpcHandler.handle(req, res, {
				context: await createContext(req.headers),
				prefix: "/rpc",
			});

			if (matched) {
				return;
			}

			const apiResult = await apiHandler.handle(req, res, {
				context: await createContext(req.headers),
				prefix: "/api-reference",
			});

			if (apiResult.matched) {
				return;
			}

			fastifyHandler(req, res);
		});

		return server;
	},
});
{{else}}
const fastify = Fastify({
	logger: true,
});
{{/if}}

fastify.register(fastifyCors, baseCorsConfig);

{{#if (eq auth "better-auth")}}
fastify.route({
	method: ["GET", "POST"],
	url: "/api/auth/*",
	async handler(request, reply) {
		try {
			const url = new URL(request.url, \`http://\${request.headers.host}\`);
			const headers = new Headers();
			Object.entries(request.headers).forEach(([key, value]) => {
				if (value) headers.append(key, value.toString());
			});
			const req = new Request(url.toString(), {
				method: request.method,
				headers,
				body: request.body ? JSON.stringify(request.body) : undefined,
			});
			const response = await auth.handler(req);
			reply.status(response.status);
			response.headers.forEach((value, key) => reply.header(key, value));
			reply.send(response.body ? await response.text() : null);
		} catch (error) {
			fastify.log.error({ err: error }, "Authentication Error:");
			reply.status(500).send({
				error: "Internal authentication error",
				code: "AUTH_FAILURE"
			});
		}
	}
});
{{/if}}

{{#if (eq api "trpc")}}
fastify.register(fastifyTRPCPlugin, {
	prefix: "/trpc",
	trpcOptions: {
		router: appRouter,
		createContext,
		onError({ path, error }) {
			console.error(\`Error in tRPC handler on path '\${path}':\`, error);
		},
	} satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
});
{{/if}}

{{#if (includes examples "ai")}}
interface AiRequestBody {
	id?: string;
	messages: UIMessage[];
}

fastify.post('/ai', async function (request) {
	const { messages } = request.body as AiRequestBody;
	const model = wrapLanguageModel({
		model: google('gemini-2.5-flash'),
		middleware: devToolsMiddleware(),
	});
	const result = streamText({
		model,
		messages: await convertToModelMessages(messages),
	});

	return result.toUIMessageStreamResponse();
});
{{/if}}

fastify.get('/', async () => {
	return 'OK';
});

fastify.listen({ port: 3000 }, (err) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	console.log("Server running on port 3000");
});
`],
  ["frontend/react/web-base/src/components/loader.tsx.hbs", `import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex h-full items-center justify-center pt-8">
      <Loader2 className="animate-spin" />
    </div>
  );
}
`],
  ["frontend/react/web-base/src/components/header.tsx.hbs", `{{#if (includes frontend "next")}}
"use client";
import Link from "next/link";
{{else if (includes frontend "react-router")}}
import { NavLink } from "react-router";
{{else if (or (includes frontend "tanstack-router") (includes frontend "tanstack-start"))}}
import { Link } from "@tanstack/react-router";
{{/if}}
{{#unless (includes frontend "tanstack-start")}}
import { ModeToggle } from "./mode-toggle";
{{/unless}}
{{#if (and (eq auth "better-auth") (ne backend "convex"))}}
import UserMenu from "./user-menu";
{{/if}}

export default function Header() {
  const links = [
    { to: "/", label: "Home" },
    {{#if (or (eq auth "better-auth") (eq auth "clerk"))}}
      { to: "/dashboard", label: "Dashboard" },
    {{/if}}
    {{#if (includes examples "todo")}}
    { to: "/todos", label: "Todos" },
    {{/if}}
    {{#if (includes examples "ai")}}
    { to: "/ai", label: "AI Chat" },
    {{/if}}
  ] as const;

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-2 py-1">
        <nav className="flex gap-4 text-lg">
          {links.map(({ to, label }) => {
            {{#if (includes frontend "next")}}
            return (
              <Link key={to} href={to}>
                {label}
              </Link>
            );
            {{else if (includes frontend "react-router")}}
            return (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => isActive ? "font-bold" : ""}
                end
              >
                {label}
              </NavLink>
            );
            {{else if (or (includes frontend "tanstack-router") (includes frontend "tanstack-start"))}}
            return (
              <Link
                key={to}
                to={to}
              >
                {label}
              </Link>
            );
            {{else}}
            return null;
            {{/if}}
          })}
        </nav>
        <div className="flex items-center gap-2">
          {{#unless (includes frontend "tanstack-start")}}
          <ModeToggle />
          {{/unless}}
          {{#if (and (eq auth "better-auth") (ne backend "convex"))}}
          <UserMenu />
          {{/if}}
        </div>
      </div>
      <hr />
    </div>
  );
}
`],
  ["frontend/native/bare/app/(drawer)/(tabs)/_layout.tsx.hbs", `import { TabBarIcon } from "@/components/tabbar-icon";
import { useColorScheme } from "@/lib/use-color-scheme";
import { Tabs } from "expo-router";
import { NAV_THEME } from "@/lib/constants";

export default function TabLayout() {
  const { isDarkColorScheme } = useColorScheme();
  const theme = isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light;

  return (
    <Tabs
      screenOptions=\\{{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.text,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options=\\{{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options=\\{{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="compass" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

`],
  ["frontend/native/bare/app/(drawer)/(tabs)/index.tsx.hbs", `import { Container } from "@/components/container";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";

export default function TabOne() {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;

  return (
    <Container>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]}>
            Tab One
          </Text>
          <Text style={[styles.subtitle, { color: theme.text, opacity: 0.7 }]}>
            Explore the first section of your app
          </Text>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 16,
  },
  content: {
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
});

`],
  ["frontend/native/bare/app/(drawer)/(tabs)/two.tsx.hbs", `import { Container } from "@/components/container";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";

export default function TabTwo() {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;

  return (
    <Container>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]}>
            Tab Two
          </Text>
          <Text style={[styles.subtitle, { color: theme.text, opacity: 0.7 }]}>
            Discover more features and content
          </Text>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 16,
  },
  content: {
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
});

`],
  ["db/prisma/mongodb/src/index.ts.hbs", `import { PrismaClient } from "../prisma/generated/client";

const prisma = new PrismaClient();

export default prisma;
`],
  ["api/trpc/native/utils/trpc.ts.hbs", `{{#if (eq auth "better-auth")}}
import { authClient } from "@/lib/auth-client";
{{/if}}
import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@{{projectName}}/api/routers/index";
import { env } from "@{{projectName}}/env/native";

export const queryClient = new QueryClient();

const trpcClient = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
{{#if (eq backend "self")}}
			url: \`\${env.EXPO_PUBLIC_SERVER_URL}/api/trpc\`,
{{else}}
			url: \`\${env.EXPO_PUBLIC_SERVER_URL}/trpc\`,
{{/if}}
{{#if (eq auth "better-auth")}}
			headers() {
				const headers = new Map<string, string>();
				const cookies = authClient.getCookie();
				if (cookies) {
					headers.set("Cookie", cookies);
				}
				return Object.fromEntries(headers);
			},
{{/if}}
		}),
	],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
	client: trpcClient,
	queryClient,
});
`],
  ["auth/better-auth/native/bare/app/(drawer)/index.tsx.hbs", `import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Container } from "@/components/container";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";
import { authClient } from "@/lib/auth-client";
import { SignIn } from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
{{#if (eq api "orpc")}}
import { useQuery } from "@tanstack/react-query";
import { queryClient, orpc } from "@/utils/orpc";
{{/if}}
{{#if (eq api "trpc")}}
import { useQuery } from "@tanstack/react-query";
import { queryClient, trpc } from "@/utils/trpc";
{{/if}}

export default function Home() {
const { colorScheme } = useColorScheme();
const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;
{{#if (eq api "orpc")}}
const healthCheck = useQuery(orpc.healthCheck.queryOptions());
const privateData = useQuery(orpc.privateData.queryOptions());
const isConnected = healthCheck?.data === "OK";
const isLoading = healthCheck?.isLoading;
{{/if}}
{{#if (eq api "trpc")}}
const healthCheck = useQuery(trpc.healthCheck.queryOptions());
const privateData = useQuery(trpc.privateData.queryOptions());
const isConnected = healthCheck?.data === "OK";
const isLoading = healthCheck?.isLoading;
{{/if}}
const { data: session } = authClient.useSession();

return (
<Container>
  <ScrollView style={styles.scrollView}>
    <View style={styles.content}>
      <Text style={[styles.title, { color: theme.text }]}>
        BETTER T STACK
      </Text>

      {session?.user ? (
      <View style={[styles.userCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.userHeader}>
          <Text style={[styles.userText, { color: theme.text }]}>
            Welcome, <Text style={styles.userName}>{session.user.name}</Text>
          </Text>
        </View>
        <Text style={[styles.userEmail, { color: theme.text, opacity: 0.7 }]}>
          {session.user.email}
        </Text>
        <TouchableOpacity style={[styles.signOutButton, { backgroundColor: theme.notification }]} onPress={()=> {
          authClient.signOut();
          {{#if (eq api "orpc")}}
          queryClient.invalidateQueries();
          {{/if}}
          {{#if (eq api "trpc")}}
          queryClient.invalidateQueries();
          {{/if}}
          }}
          >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      ) : null}

      {{#unless (eq api "none")}}
      <View style={[styles.statusCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          System Status
        </Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusIndicator, { backgroundColor: isConnected ? "#10b981" : "#ef4444" }]} />
          <View style={styles.statusContent}>
            <Text style={[styles.statusTitle, { color: theme.text }]}>
              {{#if (eq api "orpc")}}ORPC{{else}}TRPC{{/if}} Backend
            </Text>
            <Text style={[styles.statusText, { color: theme.text, opacity: 0.7 }]}>
              {isLoading
              ? "Checking connection..."
              : isConnected
              ? "Connected to API"
              : "API Disconnected"}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.privateDataCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          Private Data
        </Text>
        {privateData && (
        <Text style={[styles.privateDataText, { color: theme.text, opacity: 0.7 }]}>
          {privateData.data?.message}
        </Text>
        )}
      </View>
      {{/unless}}

      {!session?.user && (
      <>
        <SignIn />
        <SignUp />
      </>
      )}
    </View>
  </ScrollView>
</Container>
);
}

const styles = StyleSheet.create({
scrollView: {
flex: 1,
},
content: {
padding: 16,
},
title: {
fontSize: 24,
fontWeight: "bold",
marginBottom: 16,
},
userCard: {
marginBottom: 16,
padding: 16,
borderWidth: 1,
},
userHeader: {
marginBottom: 8,
},
userText: {
fontSize: 16,
},
userName: {
fontWeight: "bold",
},
userEmail: {
fontSize: 14,
marginBottom: 12,
},
signOutButton: {
padding: 12,
},
signOutText: {
color: "#ffffff",
},
statusCard: {
marginBottom: 16,
padding: 16,
borderWidth: 1,
},
cardTitle: {
fontSize: 16,
fontWeight: "bold",
marginBottom: 12,
},
statusRow: {
flexDirection: "row",
alignItems: "center",
gap: 8,
},
statusIndicator: {
height: 8,
width: 8,
},
statusContent: {
flex: 1,
},
statusTitle: {
fontSize: 14,
fontWeight: "bold",
},
statusText: {
fontSize: 12,
},
privateDataCard: {
marginBottom: 16,
padding: 16,
borderWidth: 1,
},
privateDataText: {
fontSize: 14,
},
});`],
  ["payments/polar/web/solid/src/routes/success.tsx.hbs", `import { createFileRoute } from "@tanstack/solid-router";
import { Show } from "solid-js";

export const Route = createFileRoute("/success")({
	component: SuccessPage,
	validateSearch: (search) => ({
		checkout_id: search.checkout_id as string,
	}),
});

function SuccessPage() {
	const searchParams = Route.useSearch();
	const checkout_id = searchParams().checkout_id;

	return (
		<div class="container mx-auto px-4 py-8">
			<h1>Payment Successful!</h1>
			<Show when={checkout_id}>
				<p>Checkout ID: {checkout_id}</p>
			</Show>
		</div>
	);
}
`],
  ["frontend/native/uniwind/app/(drawer)/_layout.tsx.hbs", `import React, { useCallback } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useThemeColor } from "heroui-native";
import { Pressable, Text } from "react-native";
import { ThemeToggle } from "@/components/theme-toggle";

function DrawerLayout() {
  const themeColorForeground = useThemeColor("foreground");
  const themeColorBackground = useThemeColor("background");

  const renderThemeToggle = useCallback(() => <ThemeToggle />, []);

  return (
    <Drawer
      screenOptions=\\{{
        headerTintColor: themeColorForeground,
        headerStyle: { backgroundColor: themeColorBackground },
        headerTitleStyle: {
          fontWeight: "600",
          color: themeColorForeground,
        },
        headerRight: renderThemeToggle,
        drawerStyle: { backgroundColor: themeColorBackground },
      }}
    >
      <Drawer.Screen
        name="index"
        options=\\{{
          headerTitle: "Home",
          drawerLabel: ({ color, focused }) => (
            <Text style=\\{{ color: focused ? color : themeColorForeground }}>Home</Text>
          ),
          drawerIcon: ({ size, color, focused }) => (
            <Ionicons name="home-outline" size={size} color={focused ? color : themeColorForeground} />
          ),
        }}
      />
      <Drawer.Screen
        name="(tabs)"
        options=\\{{
          headerTitle: "Tabs",
          drawerLabel: ({ color, focused }) => (
            <Text style=\\{{ color: focused ? color : themeColorForeground }}>Tabs</Text>
          ),
          drawerIcon: ({ size, color, focused }) => (
            <MaterialIcons name="border-bottom" size={size} color={focused ? color : themeColorForeground} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable className="mr-4">
                <Ionicons name="add-outline" size={24} color={themeColorForeground} />
              </Pressable>
            </Link>
          ),
        }}
      />
      {{#if (includes examples "todo")}}
      <Drawer.Screen
        name="todos"
        options=\\{{
          headerTitle: "Todos",
          drawerLabel: ({ color, focused }) => (
            <Text style=\\{{ color: focused ? color : themeColorForeground }}>Todos</Text>
          ),
          drawerIcon: ({ size, color, focused }) => (
            <Ionicons name="checkbox-outline" size={size} color={focused ? color : themeColorForeground} />
          ),
        }}
      />
      {{/if}}
      {{#if (includes examples "ai")}}
      <Drawer.Screen
        name="ai"
        options=\\{{
          headerTitle: "AI",
          drawerLabel: ({ color, focused }) => (
            <Text style=\\{{ color: focused ? color : themeColorForeground }}>AI</Text>
          ),
          drawerIcon: ({ size, color, focused }) => (
            <Ionicons name="chatbubble-ellipses-outline" size={size} color={focused ? color : themeColorForeground} />
          ),
        }}
      />
      {{/if}}
    </Drawer>
  );
}

export default DrawerLayout;`],
  ["frontend/native/uniwind/app/(drawer)/index.tsx.hbs", `import { Text, View } from "react-native";
import { Container } from "@/components/container";
{{#if (eq api "orpc")}}
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
{{/if}}
{{#if (eq api "trpc")}}
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
{{/if}}
{{#if (and (eq backend "convex") (eq auth "clerk"))}}
import { Link } from "expo-router";
import { Authenticated, AuthLoading, Unauthenticated, useQuery } from "convex/react";
import { api } from "@{{projectName}}/backend/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { SignOutButton } from "@/components/sign-out-button";
{{else if (and (eq backend "convex") (eq auth "better-auth"))}}
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@{{projectName}}/backend/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { SignIn } from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
{{else if (eq backend "convex")}}
import { useQuery } from "convex/react";
import { api } from "@{{projectName}}/backend/convex/_generated/api";
{{/if}}
{{#unless (or (eq backend "none") (and (eq backend "convex") (eq auth "better-auth")))}}
import { Ionicons } from "@expo/vector-icons";
{{/unless}}
import { Button, Chip, Divider, Spinner, Surface, useThemeColor } from "heroui-native";

export default function Home() {
{{#if (eq api "orpc")}}
const healthCheck = useQuery(orpc.healthCheck.queryOptions());
{{/if}}
{{#if (eq api "trpc")}}
const healthCheck = useQuery(trpc.healthCheck.queryOptions());
{{/if}}
{{#if (and (eq backend "convex") (eq auth "clerk"))}}
const { user } = useUser();
const healthCheck = useQuery(api.healthCheck.get);
const privateData = useQuery(api.privateData.get);
{{else if (and (eq backend "convex") (eq auth "better-auth"))}}
const healthCheck = useQuery(api.healthCheck.get);
const { isAuthenticated } = useConvexAuth();
const user = useQuery(api.auth.getCurrentUser, isAuthenticated ? {} : "skip");
{{else if (eq backend "convex")}}
const healthCheck = useQuery(api.healthCheck.get);
{{/if}}
{{#unless (eq backend "none")}}
const successColor = useThemeColor("success");
const dangerColor = useThemeColor("danger");

{{#if (eq backend "convex")}}
const isConnected = healthCheck === "OK";
const isLoading = healthCheck === undefined;
{{else}}
{{#unless (eq api "none")}}
const isConnected = healthCheck?.data === "OK";
const isLoading = healthCheck?.isLoading;
{{/unless}}
{{/if}}
{{/unless}}

return (
<Container className="p-4">
  <View className="py-6 mb-4">
    <Text className="text-3xl font-semibold text-foreground tracking-tight">
      Better T Stack
    </Text>
    <Text className="text-muted text-sm mt-1">Full-stack TypeScript starter</Text>
  </View>

  {{#unless (or (eq backend "none") (and (eq backend "convex") (eq auth "better-auth")))}}
  <Surface variant="secondary" className="p-4 rounded-lg">
    <View className="flex-row items-center justify-between mb-3">
      <Text className="text-foreground font-medium">System Status</Text>
      <Chip variant="secondary" color={isConnected ? "success" : "danger" } size="sm">
        <Chip.Label>
          {isConnected ? "LIVE" : "OFFLINE"}
        </Chip.Label>
      </Chip>
    </View>

    <Divider className="mb-3" />

    <Surface variant="tertiary" className="p-3 rounded-md">
      <View className="flex-row items-center">
        <View className={\`w-2 h-2 rounded-full mr-3 \${ isConnected ? "bg-success" : "bg-muted" }\`} />
        <View className="flex-1">
          <Text className="text-foreground text-sm font-medium">
            {{#if (eq backend "convex")}}
            Convex Backend
            {{else}}
            {{#unless (eq api "none")}}
            {{#if (eq api "orpc")}}ORPC{{else}}TRPC{{/if}} Backend
            {{/unless}}
            {{/if}}
          </Text>
          <Text className="text-muted text-xs mt-0.5">
            {isLoading
            ? "Checking connection..."
            : isConnected
            ? "Connected to API"
            : "API Disconnected"}
          </Text>
        </View>
        {isLoading && <Spinner size="sm" />}
        {!isLoading && isConnected && (
        <Ionicons name="checkmark-circle" size={18} color={successColor} />
        )}
        {!isLoading && !isConnected && (
        <Ionicons name="close-circle" size={18} color={dangerColor} />
        )}
      </View>
    </Surface>
  </Surface>
  {{/unless}}

  {{#if (and (eq backend "convex") (eq auth "clerk"))}}
  <Authenticated>
    <Surface variant="secondary" className="mt-4 p-4 rounded-lg">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-foreground font-medium">{user?.emailAddresses[0].emailAddress}</Text>
          <Text className="text-muted text-xs mt-0.5">Private: {privateData?.message}</Text>
        </View>
        <SignOutButton />
      </View>
    </Surface>
  </Authenticated>
  <Unauthenticated>
    <View className="mt-4 gap-3">
      <Link href="/(auth)/sign-in" asChild>
        <Button variant="secondary"><Button.Label>Sign In</Button.Label></Button>
      </Link>
      <Link href="/(auth)/sign-up" asChild>
        <Button variant="ghost"><Button.Label>Sign Up</Button.Label></Button>
      </Link>
    </View>
  </Unauthenticated>
  <AuthLoading>
    <View className="mt-4 items-center">
      <Spinner size="sm" />
    </View>
  </AuthLoading>
  {{/if}}

  {{#if (and (eq backend "convex") (eq auth "better-auth"))}}
  {user ? (
  <Surface variant="secondary" className="mb-4 p-4 rounded-lg">
    <View className="flex-row items-center justify-between">
      <View className="flex-1">
        <Text className="text-foreground font-medium">{user.name}</Text>
        <Text className="text-muted text-xs mt-0.5">{user.email}</Text>
      </View>
      <Button
        variant="destructive"
        size="sm"
        onPress={() => {
          authClient.signOut();
        }}
      >
        Sign Out
      </Button>
    </View>
  </Surface>
  ) : null}
  <Surface variant="secondary" className="p-4 rounded-lg">
    <Text className="text-foreground font-medium mb-2">API Status</Text>
    <View className="flex-row items-center gap-2">
      <View className={\`w-2 h-2 rounded-full \${healthCheck==="OK" ? "bg-success" : "bg-danger" }\`} />
      <Text className="text-muted text-xs">
        {healthCheck === undefined
        ? "Checking..."
        : healthCheck === "OK"
        ? "Connected to API"
        : "API Disconnected"}
      </Text>
    </View>
  </Surface>
  {!user && (
  <View className="mt-4 gap-4">
    <SignIn />
    <SignUp />
  </View>
  )}
  {{/if}}
</Container>
);
}`],
  ["db/mongoose/mongodb/src/index.ts.hbs", `import mongoose from "mongoose";
import { env } from "@{{projectName}}/env/server";

await mongoose.connect(env.DATABASE_URL).catch((error) => {
	console.log("Error connecting to database:", error);
});

const client = mongoose.connection.getClient().db("myDB");

export { client };
`],
  ["backend/server/hono/src/index.ts.hbs", `import { env } from "@{{projectName}}/env/server";
{{#if (eq api "orpc")}}
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { RPCHandler } from "@orpc/server/fetch";
import { onError } from "@orpc/server";
import { createContext } from "@{{projectName}}/api/context";
import { appRouter } from "@{{projectName}}/api/routers/index";
{{/if}}
{{#if (eq api "trpc")}}
import { trpcServer } from "@hono/trpc-server";
import { createContext } from "@{{projectName}}/api/context";
import { appRouter } from "@{{projectName}}/api/routers/index";
{{/if}}
{{#if (eq auth "better-auth")}}
import { auth } from "@{{projectName}}/auth";
{{/if}}
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
{{#if (and (includes examples "ai") (or (eq runtime "bun") (eq runtime "node")))}}
import { streamText, convertToModelMessages, wrapLanguageModel } from "ai";
import { google } from "@ai-sdk/google";
import { devToolsMiddleware } from "@ai-sdk/devtools";
{{/if}}
{{#if (and (includes examples "ai") (eq runtime "workers"))}}
import { streamText, convertToModelMessages, wrapLanguageModel } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { devToolsMiddleware } from "@ai-sdk/devtools";
{{/if}}

const app = new Hono();

app.use(logger());
app.use(
	"/*",
	cors({
		origin: env.CORS_ORIGIN,
		allowMethods: ["GET", "POST", "OPTIONS"],
{{#if (eq auth "better-auth")}}
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
{{/if}}
	})
);

{{#if (eq auth "better-auth")}}
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));
{{/if}}

{{#if (eq api "orpc")}}
export const apiHandler = new OpenAPIHandler(appRouter, {
	plugins: [
		new OpenAPIReferencePlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
		}),
	],
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

export const rpcHandler = new RPCHandler(appRouter, {
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

app.use("/*", async (c, next) => {
	const context = await createContext({ context: c });

	const rpcResult = await rpcHandler.handle(c.req.raw, {
		prefix: "/rpc",
		context: context,
	});

	if (rpcResult.matched) {
		return c.newResponse(rpcResult.response.body, rpcResult.response);
	}

	const apiResult = await apiHandler.handle(c.req.raw, {
		prefix: "/api-reference",
		context: context,
	});

	if (apiResult.matched) {
		return c.newResponse(apiResult.response.body, apiResult.response);
	}

	await next();
});
{{/if}}

{{#if (eq api "trpc")}}
app.use(
	"/trpc/*",
	trpcServer({
		router: appRouter,
		createContext: (_opts, context) => {
			return createContext({ context });
		},
	})
);
{{/if}}

{{#if (and (includes examples "ai") (or (eq runtime "bun") (eq runtime "node")))}}
app.post("/ai", async (c) => {
	const body = await c.req.json();
	const uiMessages = body.messages || [];
	const model = wrapLanguageModel({
		model: google("gemini-2.5-flash"),
		middleware: devToolsMiddleware(),
	});
	const result = streamText({
		model,
		messages: await convertToModelMessages(uiMessages),
	});

	return result.toUIMessageStreamResponse();
});
{{/if}}

{{#if (and (includes examples "ai") (eq runtime "workers"))}}
app.post("/ai", async (c) => {
	const body = await c.req.json();
	const uiMessages = body.messages || [];
	const google = createGoogleGenerativeAI({
		apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
	});
	const model = wrapLanguageModel({
		model: google("gemini-2.5-flash"),
		middleware: devToolsMiddleware(),
	});
	const result = streamText({
		model,
		messages: await convertToModelMessages(uiMessages),
	});

	return result.toUIMessageStreamResponse();
});
{{/if}}

app.get("/", (c) => {
	return c.text("OK");
});

{{#if (eq runtime "node")}}
import { serve } from "@hono/node-server";

serve(
	{
		fetch: app.fetch,
		port: 3000,
	},
	(info) => {
		console.log(\`Server is running on http://localhost:\${info.port}\`);
	}
);
{{else}}
{{#if (eq runtime "bun")}}
export default app;
{{/if}}
{{#if (eq runtime "workers")}}
export default app;
{{/if}}
{{/if}}
`],
  ["auth/clerk/convex/backend/convex/privateData.ts.hbs", `import { query } from "./_generated/server";

export const get = query({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			return {
				message: "Not authenticated",
			};
		}
		return {
			message: "This is private",
		};
	},
});
`],
  ["auth/clerk/convex/backend/convex/auth.config.ts.hbs", `export default {
	providers: [
		{
			// Replace with your own Clerk Issuer URL from your "convex" JWT template
			// or with \`process.env.CLERK_JWT_ISSUER_DOMAIN\`
			// and configure CLERK_JWT_ISSUER_DOMAIN on the Convex Dashboard
			// See https://docs.convex.dev/auth/clerk#configuring-dev-and-prod-instances
			domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
			applicationID: "convex",
		},
	],
};
`],
  ["frontend/native/unistyles/app/(drawer)/_layout.tsx.hbs", `import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useUnistyles } from "react-native-unistyles";

import { HeaderButton } from "../../components/header-button";

const DrawerLayout = () => {
  const { theme } = useUnistyles();

  return (
    <Drawer
      screenOptions=\\{{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTitleStyle: {
          color: theme.colors.foreground,
        },
        headerTintColor: theme.colors.foreground,
        drawerStyle: {
          backgroundColor: theme.colors.background,
        },
        drawerLabelStyle: {
          color: theme.colors.foreground,
        },
        drawerInactiveTintColor: theme.colors.mutedForeground,
      }}
    >
      <Drawer.Screen
        name="index"
        options=\\{{
          headerTitle: "Home",
          drawerLabel: "Home",
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="(tabs)"
        options=\\{{
          headerTitle: "Tabs",
          drawerLabel: "Tabs",
          drawerIcon: ({ size, color }) => (
            <MaterialIcons name="border-bottom" size={size} color={color} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <HeaderButton />
            </Link>
          ),
        }}
      />
      {{#if (includes examples "todo")}}
      <Drawer.Screen
        name="todos"
        options=\\{{
          headerTitle: "Todos",
          drawerLabel: "Todos",
          drawerIcon: ({ size, color }) => (
            <Ionicons name="checkbox-outline" size={size} color={color} />
          ),
        }}
      />
      {{/if}}
      {{#if (includes examples "ai")}}
      <Drawer.Screen
        name="ai"
        options=\\{{
          headerTitle: "AI",
          drawerLabel: "AI",
          drawerIcon: ({ size, color }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      {{/if}}
    </Drawer>
  );
};

export default DrawerLayout;
`],
  ["frontend/native/unistyles/app/(drawer)/index.tsx.hbs", `import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Container } from "@/components/container";

{{#if (eq api "orpc")}}
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
{{/if}}
{{#if (eq api "trpc")}}
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
{{/if}}
{{#if (and (eq backend "convex") (eq auth "clerk"))}}
import { Link } from "expo-router";
import { Authenticated, AuthLoading, Unauthenticated, useQuery } from "convex/react";
import { api } from "@{{ projectName }}/backend/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { SignOutButton } from "@/components/sign-out-button";
{{else if (and (eq backend "convex") (eq auth "better-auth"))}}
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@{{ projectName }}/backend/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { SignIn } from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
{{else if (eq backend "convex")}}
import { useQuery } from "convex/react";
import { api } from "@{{ projectName }}/backend/convex/_generated/api";
{{/if}}

export default function Home() {
  {{#if (eq api "orpc")}}
  const healthCheck = useQuery(orpc.healthCheck.queryOptions());
  {{/if}}
  {{#if (eq api "trpc")}}
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());
  {{/if}}
  {{#if (and (eq backend "convex") (eq auth "clerk"))}}
  const { user } = useUser();
  const healthCheck = useQuery(api.healthCheck.get);
  const privateData = useQuery(api.privateData.get);
  {{else if (and (eq backend "convex") (eq auth "better-auth"))}}
  const healthCheck = useQuery(api.healthCheck.get);
  const { isAuthenticated } = useConvexAuth();
  const user = useQuery(api.auth.getCurrentUser, isAuthenticated ? {} : "skip");
  {{else if (eq backend "convex")}}
  const healthCheck = useQuery(api.healthCheck.get);
  {{/if}}

  return (
    <Container>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heroTitle}>
          BETTER T STACK
        </Text>

        {{#unless (and (eq backend "convex") (eq auth "better-auth"))}}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>System Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>LIVE</Text>
            </View>
          </View>
          {{#if (eq backend "convex")}}
            {{#unless (eq auth "better-auth")}}
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  healthCheck === "OK"
                    ? styles.statusDotSuccess
                    : styles.statusDotWarning,
                ]}
              />
              <View style={styles.statusContent}>
                <Text style={styles.statusLabel}>Convex</Text>
                <Text style={styles.statusDescription}>
                  {healthCheck === undefined
                    ? "Checking connection..."
                    : healthCheck === "OK"
                    ? "Connected to API"
                    : "API Disconnected"}
                </Text>
              </View>
            </View>
            {{/unless}}
          {{else}}
            {{#unless (eq api "none")}}
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  healthCheck.data
                    ? styles.statusDotSuccess
                    : styles.statusDotWarning,
                ]}
              />
              <View style={styles.statusContent}>
                <Text style={styles.statusLabel}>
                  {{#if (eq api "orpc")}}ORPC{{/if}}
                  {{#if (eq api "trpc")}}TRPC{{/if}}
                </Text>
                <Text style={styles.statusDescription}>
                  {healthCheck.isLoading
                    ? "Checking connection..."
                    : healthCheck.data
                    ? "Connected to API"
                    : "API Disconnected"}
                </Text>
              </View>
            </View>
            {{/unless}}
          {{/if}}
        </View>
        {{/unless}}

        {{#if (and (eq backend "convex") (eq auth "clerk"))}}
        <Authenticated>
          <Text>
            Hello {user?.emailAddresses[0].emailAddress}
          </Text>
          <Text>
            Private Data: {privateData?.message}
          </Text>
          <SignOutButton />
        </Authenticated>
        <Unauthenticated>
          <Link href="/(auth)/sign-in">
            <Text>Sign in</Text>
          </Link>
          <Link href="/(auth)/sign-up">
            <Text>Sign up</Text>
          </Link>
        </Unauthenticated>
        <AuthLoading>
          <Text>Loading...</Text>
        </AuthLoading>
        {{/if}}

        {{#if (and (eq backend "convex") (eq auth "better-auth"))}}
        {user ? (
          <View style={styles.userCard}>
            <View style={styles.userHeader}>
              <Text style={styles.userWelcome}>
                Welcome,{" "}
                <Text style={styles.userName}>{user.name}</Text>
              </Text>
            </View>
            <Text style={styles.userEmail}>{user.email}</Text>
            <TouchableOpacity
              style={styles.signOutButton}
              onPress={() => {
                authClient.signOut();
              }}
            >
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <View style={styles.apiStatusCard}>
          <Text style={styles.apiStatusTitle}>API Status</Text>
          <View style={styles.apiStatusRow}>
            <View
              style={[
                styles.statusDot,
                healthCheck === "OK"
                  ? styles.statusDotSuccess
                  : styles.statusDotWarning,
              ]}
            />
            <Text style={styles.apiStatusText}>
              {healthCheck === undefined
                ? "Checking..."
                : healthCheck === "OK"
                ? "Connected to API"
                : "API Disconnected"}
            </Text>
          </View>
        </View>
        {!user && (
          <>
            <SignIn />
            <SignUp />
          </>
        )}
        {{/if}}
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    paddingHorizontal: theme.spacing.md,
  },
  heroSection: {
    paddingVertical: theme.spacing.xl,
  },
  heroTitle: {
    fontSize: theme.fontSize["4xl"],
    fontWeight: "bold",
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
  },
  heroSubtitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.mutedForeground,
    lineHeight: 28,
  },
  statusCard: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  statusTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: "600",
    color: theme.colors.cardForeground,
  },
  statusBadge: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: theme.spacing.sm + 4,
    paddingVertical: theme.spacing.xs,
    borderRadius: 9999,
  },
  statusBadgeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: "500",
    color: theme.colors.secondaryForeground,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm + 4,
  },
  statusDot: {
    height: 12,
    width: 12,
    borderRadius: 6,
  },
  statusDotSuccess: {
    backgroundColor: theme.colors.success,
  },
  statusDotWarning: {
    backgroundColor: "#F59E0B",
  },
  statusContent: {
    flex: 1,
  },
  statusLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: "500",
    color: theme.colors.cardForeground,
  },
  statusDescription: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
  },
  userCard: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  userWelcome: {
    fontSize: theme.fontSize.base,
    color: theme.colors.foreground,
  },
  userName: {
    fontWeight: "500",
  },
  userEmail: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.md,
  },
  signOutButton: {
    backgroundColor: theme.colors.destructive,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignSelf: "flex-start",
  },
  signOutText: {
    color: theme.colors.destructiveForeground,
    fontWeight: "500",
  },
  apiStatusCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  apiStatusTitle: {
    marginBottom: theme.spacing.sm,
    fontWeight: "500",
    color: theme.colors.foreground,
  },
  apiStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  apiStatusText: {
    color: theme.colors.mutedForeground,
  },
}));`],
  ["backend/server/elysia/src/index.ts.hbs", `import { env } from "@{{projectName}}/env/server";
{{#if (eq runtime "node")}}
import { node } from "@elysiajs/node";
{{/if}}
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
{{#if (includes examples "ai")}}
import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, wrapLanguageModel } from "ai";
import { devToolsMiddleware } from "@ai-sdk/devtools";
{{/if}}
{{#if (eq api "trpc")}}
import { createContext } from "@{{projectName}}/api/context";
import { appRouter } from "@{{projectName}}/api/routers/index";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
{{/if}}
{{#if (eq api "orpc")}}
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { RPCHandler } from "@orpc/server/fetch";
import { onError } from "@orpc/server";
import { appRouter } from "@{{projectName}}/api/routers/index";
import { createContext } from "@{{projectName}}/api/context";
{{/if}}
{{#if (eq auth "better-auth")}}
import { auth } from "@{{projectName}}/auth";
{{/if}}

{{#if (eq api "orpc")}}
const rpcHandler = new RPCHandler(appRouter, {
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});
const apiHandler = new OpenAPIHandler(appRouter, {
	plugins: [
		new OpenAPIReferencePlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
		}),
	],
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});
{{/if}}

{{#if (eq runtime "node")}}
const app = new Elysia({ adapter: node() })
{{else}}
const app = new Elysia()
{{/if}}
	.use(
		cors({
			origin: env.CORS_ORIGIN,
			methods: ["GET", "POST", "OPTIONS"],
{{#if (eq auth "better-auth")}}
			allowedHeaders: ["Content-Type", "Authorization"],
			credentials: true,
{{/if}}
		}),
	)
{{#if (eq auth "better-auth")}}
	.all("/api/auth/*", async (context) => {
		const { request, status } = context;
		if (["POST", "GET"].includes(request.method)) {
			return auth.handler(request);
		}
		return status(405)
	})
{{/if}}
{{#if (eq api "orpc")}}
	.all('/rpc*', async (context) => {
		const { response } = await rpcHandler.handle(context.request, {
			prefix: '/rpc',
			context: await createContext({ context })
		})
		return response ?? new Response('Not Found', { status: 404 })
	})
	.all('/api*', async (context) => {
		const { response } = await apiHandler.handle(context.request, {
			prefix: '/api-reference',
			context: await createContext({ context })
		})
		return response ?? new Response('Not Found', { status: 404 })
	})
{{/if}}
{{#if (eq api "trpc")}}
	.all("/trpc/*", async (context) => {
		const res = await fetchRequestHandler({
			endpoint: "/trpc",
			router: appRouter,
			req: context.request,
			createContext: () => createContext({ context }),
		});
		return res;
	})
{{/if}}
{{#if (includes examples "ai")}}
	.post("/ai", async (context) => {
		const body = await context.request.json();
		const uiMessages = body.messages || [];
		const model = wrapLanguageModel({
			model: google("gemini-2.5-flash"),
			middleware: devToolsMiddleware(),
		});
		const result = streamText({
			model,
			messages: await convertToModelMessages(uiMessages)
		});

		return result.toUIMessageStreamResponse();
	})
{{/if}}
	.get("/", () => "OK")
	.listen(3000, () => {
		console.log("Server is running on http://localhost:3000");
	});
`],
  ["api/trpc/server/src/index.ts.hbs", `import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context";

export const t = initTRPC.context<Context>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

{{#if (eq auth "better-auth")}}
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
      cause: "No session",
    });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});
{{/if}}
`],
  ["api/trpc/server/src/context.ts.hbs", `{{#if (and (eq backend 'self') (includes frontend "next"))}}
import type { NextRequest } from "next/server";
{{#if (eq auth "better-auth")}}
import { auth } from "@{{projectName}}/auth";
{{/if}}

export async function createContext(req: NextRequest) {
{{#if (eq auth "better-auth")}}
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  return {
    session,
  };
{{else}}
  // No auth configured
  return {
    session: null,
  };
{{/if}}
}

{{else if (and (eq backend 'self') (includes frontend "tanstack-start"))}}
{{#if (eq auth "better-auth")}}
import { auth } from "@{{projectName}}/auth";
{{/if}}

export async function createContext({ req }: { req: Request }) {
{{#if (eq auth "better-auth")}}
	const session = await auth.api.getSession({
		headers: req.headers,
	});
	return {
		session,
	};
{{else}}
	// No auth configured
	return {
		session: null,
	};
{{/if}}
}

{{else if (eq backend 'hono')}}
import type { Context as HonoContext } from "hono";
{{#if (eq auth "better-auth")}}
import { auth } from "@{{projectName}}/auth";
{{/if}}

export type CreateContextOptions = {
  context: HonoContext;
};

export async function createContext({ context }: CreateContextOptions) {
{{#if (eq auth "better-auth")}}
  const session = await auth.api.getSession({
    headers: context.req.raw.headers,
  });
  return {
    session,
  };
{{else}}
  // No auth configured
  return {
    session: null,
  };
{{/if}}
}

{{else if (eq backend 'elysia')}}
import type { Context as ElysiaContext } from "elysia";
{{#if (eq auth "better-auth")}}
import { auth } from "@{{projectName}}/auth";
{{/if}}

export type CreateContextOptions = {
  context: ElysiaContext;
};

export async function createContext({ context }: CreateContextOptions) {
{{#if (eq auth "better-auth")}}
  const session = await auth.api.getSession({
    headers: context.request.headers,
  });
  return {
    session,
  };
{{else}}
  // No auth configured
  return {
    session: null,
  };
{{/if}}
}

{{else if (eq backend 'express')}}
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
{{#if (eq auth "better-auth")}}
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "@{{projectName}}/auth";
{{/if}}

export async function createContext(opts: CreateExpressContextOptions) {
{{#if (eq auth "better-auth")}}
	const session = await auth.api.getSession({
		headers: fromNodeHeaders(opts.req.headers),
	});
	return {
		session,
	};
{{else}}
  // No auth configured
	return {
		session: null,
	};
{{/if}}
}

{{else if (eq backend 'fastify')}}
import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
{{#if (eq auth "better-auth")}}
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "@{{projectName}}/auth";
{{/if}}

export async function createContext({ req, res }: CreateFastifyContextOptions) {
{{#if (eq auth "better-auth")}}
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return { session };
{{else}}
  // No auth configured
	return {
		session: null,
	};
{{/if}}
}

{{else}}
export async function createContext() {
  return {
    session: null,
  };
}
{{/if}}

export type Context = Awaited<ReturnType<typeof createContext>>;
`],
  ["backend/server/express/src/index.ts.hbs", `import { env } from "@{{projectName}}/env/server";
{{#if (eq api "trpc")}}
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { createContext } from "@{{projectName}}/api/context";
import { appRouter } from "@{{projectName}}/api/routers/index";
{{/if}}
{{#if (eq api "orpc")}}
import { OpenAPIHandler } from "@orpc/openapi/node";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { RPCHandler } from "@orpc/server/node";
import { onError } from "@orpc/server";
import { appRouter } from "@{{projectName}}/api/routers/index";
{{#if (eq auth "better-auth")}}
import { createContext } from "@{{projectName}}/api/context";
{{/if}}
{{/if}}
import cors from "cors";
import express from "express";
{{#if (includes examples "ai")}}
import { streamText, type UIMessage, convertToModelMessages, wrapLanguageModel } from "ai";
import { google } from "@ai-sdk/google";
import { devToolsMiddleware } from "@ai-sdk/devtools";
{{/if}}
{{#if (eq auth "better-auth")}}
import { auth } from "@{{projectName}}/auth";
import { toNodeHandler } from "better-auth/node";
{{/if}}

const app = express();

app.use(
	cors({
		origin: env.CORS_ORIGIN,
		methods: ["GET", "POST", "OPTIONS"],
{{#if (eq auth "better-auth")}}
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
{{/if}}
	})
);

{{#if (eq auth "better-auth")}}
app.all("/api/auth{/*path}", toNodeHandler(auth));
{{/if}}

{{#if (eq api "trpc")}}
app.use(
	"/trpc",
	createExpressMiddleware({
		router: appRouter,
		createContext,
	})
);
{{/if}}

{{#if (eq api "orpc")}}
const rpcHandler = new RPCHandler(appRouter, {
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});
const apiHandler = new OpenAPIHandler(appRouter, {
	plugins: [
		new OpenAPIReferencePlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
		}),
	],
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

app.use(async (req, res, next) => {
	const rpcResult = await rpcHandler.handle(req, res, {
		prefix: "/rpc",
{{#if (eq auth "better-auth")}}
		context: await createContext({ req }),
{{else}}
		context: {},
{{/if}}
	});
	if (rpcResult.matched) return;

	const apiResult = await apiHandler.handle(req, res, {
		prefix: "/api-reference",
{{#if (eq auth "better-auth")}}
		context: await createContext({ req }),
{{else}}
		context: {},
{{/if}}
	});
	if (apiResult.matched) return;

	next();
});
{{/if}}

app.use(express.json());

{{#if (includes examples "ai")}}
app.post("/ai", async (req, res) => {
	const { messages = [] } = (req.body || {}) as { messages: UIMessage[] };
	const model = wrapLanguageModel({
		model: google("gemini-2.5-flash"),
		middleware: devToolsMiddleware(),
	});
	const result = streamText({
		model,
		messages: await convertToModelMessages(messages),
	});
	result.pipeUIMessageStreamToResponse(res);
});
{{/if}}

app.get("/", (_req, res) => {
	res.status(200).send("OK");
});

app.listen(3000, () => {
	console.log("Server is running on http://localhost:3000");
});
`],
  ["api/orpc/server/src/routers/index.ts.hbs", `{{#if (eq api "orpc")}}
import { {{#if (eq auth "better-auth")}}protectedProcedure, {{/if}}publicProcedure } from "../index";
import type { RouterClient } from "@orpc/server";
{{#if (includes examples "todo")}}
import { todoRouter } from "./todo";
{{/if}}

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  {{#if (eq auth "better-auth")}}
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session?.user,
    };
  }),
  {{/if}}
  {{#if (includes examples "todo")}}
  todo: todoRouter,
  {{/if}}
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
{{else if (eq api "trpc")}}
import {
  {{#if (eq auth "better-auth")}}protectedProcedure, {{/if}}publicProcedure,
  router,
} from "../index";
{{#if (includes examples "todo")}}
import { todoRouter } from "./todo";
{{/if}}

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  {{#if (eq auth "better-auth")}}
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
  {{/if}}
  {{#if (includes examples "todo")}}
  todo: todoRouter,
  {{/if}}
});
export type AppRouter = typeof appRouter;
{{else}}
export const appRouter = {};
export type AppRouter = typeof appRouter;
{{/if}}
`],
  ["db/drizzle/postgres/src/index.ts.hbs", `{{#if (or (eq runtime "bun") (eq runtime "node") (eq runtime "none"))}}
import { env } from "@{{projectName}}/env/server";
import * as schema from "./schema";

{{#if (eq dbSetup "neon")}}
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import ws from "ws";

neonConfig.webSocketConstructor = ws;

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
// neonConfig.poolQueryViaFetch = true

const sql = neon(env.DATABASE_URL);
export const db = drizzle(sql, { schema });
{{else}}
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(env.DATABASE_URL, { schema });
{{/if}}
{{/if}}

{{#if (eq runtime "workers")}}
import * as schema from "./schema";

{{#if (eq dbSetup "neon")}}
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { env } from "@{{projectName}}/env/server";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;

const sql = neon(env.DATABASE_URL || "");
export const db = drizzle(sql, { schema });
{{else}}
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@{{projectName}}/env/server";

export const db = drizzle(env.DATABASE_URL || "", { schema });
{{/if}}
{{/if}}`],
  ["examples/ai/native/unistyles/polyfills.js", `import structuredClone from "@ungap/structured-clone";
import { Platform } from "react-native";

if (Platform.OS !== "web") {
  const setupPolyfills = async () => {
    const { polyfillGlobal } = await import("react-native/Libraries/Utilities/PolyfillFunctions");

    const { TextEncoderStream, TextDecoderStream } =
      await import("@stardazed/streams-text-encoding");

    if (!("structuredClone" in global)) {
      polyfillGlobal("structuredClone", () => structuredClone);
    }

    polyfillGlobal("TextEncoderStream", () => TextEncoderStream);
    polyfillGlobal("TextDecoderStream", () => TextDecoderStream);
  };

  setupPolyfills();
}

export {};
`],
  ["auth/better-auth/native/base/lib/auth-client.ts.hbs", `import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import { env } from "@{{projectName}}/env/native";

export const authClient = createAuthClient({
	baseURL: env.EXPO_PUBLIC_SERVER_URL,
	plugins: [
		expoClient({
			scheme: Constants.expoConfig?.scheme as string,
			storagePrefix: Constants.expoConfig?.scheme as string,
			storage: SecureStore,
		}),
	],
});
`],
  ["examples/ai/native/uniwind/polyfills.js", `import structuredClone from "@ungap/structured-clone";
import { Platform } from "react-native";

if (Platform.OS !== "web") {
  const setupPolyfills = async () => {
    const { polyfillGlobal } = await import("react-native/Libraries/Utilities/PolyfillFunctions");

    const { TextEncoderStream, TextDecoderStream } =
      await import("@stardazed/streams-text-encoding");

    if (!("structuredClone" in global)) {
      polyfillGlobal("structuredClone", () => structuredClone);
    }

    polyfillGlobal("TextEncoderStream", () => TextEncoderStream);
    polyfillGlobal("TextDecoderStream", () => TextDecoderStream);
  };

  setupPolyfills();
}

export {};
`],
  ["auth/better-auth/native/unistyles/components/sign-in.tsx.hbs", `import { authClient } from "@/lib/auth-client";
{{#if (eq api "trpc")}}
import { queryClient } from "@/utils/trpc";
{{/if}}
{{#if (eq api "orpc")}}
import { queryClient } from "@/utils/orpc";
{{/if}}
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onError: (error) => {
          setError(error.error?.message || "Failed to sign in");
          setIsLoading(false);
        },
        onSuccess: () => {
          setEmail("");
          setPassword("");
          {{#if (eq api "orpc")}}
          queryClient.refetchQueries();
          {{/if}}
          {{#if (eq api "trpc")}}
          queryClient.refetchQueries();
          {{/if}}
        },
        onFinished: () => {
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={isLoading}
        style={styles.button}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.typography,
    marginBottom: 16,
  },
  errorContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 6,
  },
  errorText: {
    color: theme.colors.destructive,
    fontSize: 14,
  },
  input: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 6,
    color: theme.colors.typography,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "500",
  },
}));
`],
  ["auth/better-auth/native/unistyles/components/sign-up.tsx.hbs", `import { authClient } from "@/lib/auth-client";
{{#if (eq api "trpc")}}
import { queryClient } from "@/utils/trpc";
{{/if}}
{{#if (eq api "orpc")}}
import { queryClient } from "@/utils/orpc";
{{/if}}
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";

export function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    setIsLoading(true);
    setError(null);

    await authClient.signUp.email(
      {
        name,
        email,
        password,
      },
      {
        onError: (error) => {
          setError(error.error?.message || "Failed to sign up");
          setIsLoading(false);
        },
        onSuccess: () => {
          setName("");
          setEmail("");
          setPassword("");
          {{#if (eq api "orpc")}}
          queryClient.refetchQueries();
          {{/if}}
          {{#if (eq api "trpc")}}
          queryClient.refetchQueries();
          {{/if}}
        },
        onFinished: () => {
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.inputLast}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        onPress={handleSignUp}
        disabled={isLoading}
        style={styles.button}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.typography,
    marginBottom: 16,
  },
  errorContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 6,
  },
  errorText: {
    color: theme.colors.destructive,
    fontSize: 14,
  },
  input: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 6,
    color: theme.colors.typography,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inputLast: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 6,
    color: theme.colors.typography,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "500",
  },
}));
`],
  ["db/prisma/postgres/prisma/schema/schema.prisma.hbs", `generator client {
  provider = "prisma-client"
  output   = "../generated"
  moduleFormat = "esm"
  {{#if (eq runtime "bun")}}
  runtime = "bun"
  {{/if}}
  {{#if (eq runtime "node")}}
  runtime = "nodejs"
  {{/if}}
  {{#if (or (eq runtime "workers") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
  runtime = "workerd"
  {{/if}}
}

datasource db {
  provider = "postgresql"
  {{#if (eq dbSetup "planetscale")}}
  relationMode = "prisma"
  {{/if}}
}
`],
  ["auth/better-auth/server/base/src/index.ts.hbs", `{{#if (eq orm "prisma")}}
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "@{{projectName}}/env/server";
{{#if (eq payments "polar")}}
import { polar, checkout, portal } from "@polar-sh/better-auth";
import { polarClient } from "./lib/payments";
{{/if}}
import prisma from "@{{projectName}}/db";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
{{#if (eq database "postgres")}}provider: "postgresql",{{/if}}
{{#if (eq database "sqlite")}}provider: "sqlite",{{/if}}
{{#if (eq database "mysql")}}provider: "mysql",{{/if}}
{{#if (eq database "mongodb")}}provider: "mongodb",{{/if}}
	}),

	trustedOrigins: [
		env.CORS_ORIGIN,
{{#if (or (includes frontend "native-bare") (includes frontend "native-uniwind") (includes frontend "native-unistyles"))}}
		"mybettertapp://", "exp://"
{{/if}}
	],
	emailAndPassword: {
		enabled: true,
	},
{{#if (ne backend "self")}}
	advanced: {
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},
	},
{{/if}}
	plugins: [
{{#if (eq payments "polar")}}
		polar({
			client: polarClient,
			createCustomerOnSignUp: true,
			enableCustomerPortal: true,
			use: [
				checkout({
					products: [
						{
							productId: "your-product-id",
							slug: "pro",
						},
					],
					successUrl: env.POLAR_SUCCESS_URL,
					authenticatedUsersOnly: true,
				}),
				portal(),
			],
		}),
{{/if}}
	],
});
{{/if}}

{{#if (eq orm "drizzle")}}
{{#if (or (eq runtime "bun") (eq runtime "node") (eq runtime "none"))}}
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "@{{projectName}}/env/server";
{{#if (eq payments "polar")}}
import { polar, checkout, portal } from "@polar-sh/better-auth";
import { polarClient } from "./lib/payments";
{{/if}}
import { db } from "@{{projectName}}/db";
import * as schema from "@{{projectName}}/db/schema/auth";


export const auth = betterAuth({
	database: drizzleAdapter(db, {
{{#if (eq database "postgres")}}provider: "pg",{{/if}}
{{#if (eq database "sqlite")}}provider: "sqlite",{{/if}}
{{#if (eq database "mysql")}}provider: "mysql",{{/if}}
		schema: schema,
	}),
	trustedOrigins: [
		env.CORS_ORIGIN,
{{#if (or (includes frontend "native-bare") (includes frontend "native-uniwind") (includes frontend "native-unistyles"))}}
		"mybettertapp://", "exp://"
{{/if}}
	],
	emailAndPassword: {
		enabled: true,
	},
{{#if (ne backend "self")}}
	advanced: {
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},
	},
{{/if}}
	plugins: [
{{#if (eq payments "polar")}}
		polar({
			client: polarClient,
			createCustomerOnSignUp: true,
			enableCustomerPortal: true,
			use: [
				checkout({
					products: [
						{
							productId: "your-product-id",
							slug: "pro",
						},
					],
					successUrl: env.POLAR_SUCCESS_URL,
					authenticatedUsersOnly: true,
				}),
				portal(),
			],
		}),
{{/if}}
	],
});
{{/if}}

{{#if (eq runtime "workers")}}
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "@{{projectName}}/env/server";
{{#if (eq payments "polar")}}
import { polar, checkout, portal } from "@polar-sh/better-auth";
import { polarClient } from "./lib/payments";
{{/if}}
import { db } from "@{{projectName}}/db";
import * as schema from "@{{projectName}}/db/schema/auth";


export const auth = betterAuth({
	database: drizzleAdapter(db, {
{{#if (eq database "postgres")}}provider: "pg",{{/if}}
{{#if (eq database "sqlite")}}provider: "sqlite",{{/if}}
{{#if (eq database "mysql")}}provider: "mysql",{{/if}}
		schema: schema,
	}),
	trustedOrigins: [
		env.CORS_ORIGIN,
{{#if (or (includes frontend "native-bare") (includes frontend "native-uniwind") (includes frontend "native-unistyles"))}}
		"mybettertapp://", "exp://"
{{/if}}
	],
	emailAndPassword: {
		enabled: true,
	},
	// uncomment cookieCache setting when ready to deploy to Cloudflare using *.workers.dev domains
	// session: {
	//   cookieCache: {
	//     enabled: true,
	//     maxAge: 60,
	//   },
	// },
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.BETTER_AUTH_URL,
	advanced: {
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},
		// uncomment crossSubDomainCookies setting when ready to deploy and replace <your-workers-subdomain> with your actual workers subdomain
		// https://developers.cloudflare.com/workers/wrangler/configuration/#workersdev
		// crossSubDomainCookies: {
		//   enabled: true,
		//   domain: "<your-workers-subdomain>",
		// },
	},
{{#if (eq payments "polar")}}
	plugins: [
		polar({
			client: polarClient,
			createCustomerOnSignUp: true,
			enableCustomerPortal: true,
			use: [
				checkout({
					products: [
						{
							productId: "your-product-id",
							slug: "pro",
						},
					],
					successUrl: env.POLAR_SUCCESS_URL,
					authenticatedUsersOnly: true,
				}),
				portal(),
			],
		}),
	],
{{/if}}
});
{{/if}}
{{/if}}

{{#if (eq orm "mongoose")}}
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { env } from "@{{projectName}}/env/server";
{{#if (eq payments "polar")}}
import { polar, checkout, portal } from "@polar-sh/better-auth";
import { polarClient } from "./lib/payments";
{{/if}}
import { client } from "@{{projectName}}/db";

export const auth = betterAuth({
	database: mongodbAdapter(client),
	trustedOrigins: [
		env.CORS_ORIGIN,
{{#if (or (includes frontend "native-bare") (includes frontend "native-uniwind") (includes frontend "native-unistyles"))}}
		"mybettertapp://", "exp://"
{{/if}}
	],
	emailAndPassword: {
		enabled: true,
	},
{{#if (ne backend "self")}}
	advanced: {
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},
	},
{{/if}}
{{#if (eq payments "polar")}}
	plugins: [
		polar({
			client: polarClient,
			createCustomerOnSignUp: true,
			enableCustomerPortal: true,
			use: [
				checkout({
					products: [
						{
							productId: "your-product-id",
							slug: "pro",
						},
					],
					successUrl: env.POLAR_SUCCESS_URL,
					authenticatedUsersOnly: true,
				}),
				portal(),
			],
		}),
	],
{{/if}}
});
{{/if}}

{{#if (eq orm "none")}}
import { betterAuth } from "better-auth";
import { env } from "@{{projectName}}/env/server";
{{#if (eq payments "polar")}}
import { polar, checkout, portal } from "@polar-sh/better-auth";
import { polarClient } from "./lib/payments";
{{/if}}


export const auth = betterAuth({
	database: "", // Invalid configuration
	trustedOrigins: [
		env.CORS_ORIGIN,
{{#if (or (includes frontend "native-bare") (includes frontend "native-uniwind") (includes frontend "native-unistyles"))}}
		"mybettertapp://", "exp://"
{{/if}}
	],
	emailAndPassword: {
		enabled: true,
	},
{{#if (ne backend "self")}}
	advanced: {
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},
	},
{{/if}}
{{#if (eq payments "polar")}}
	plugins: [
		polar({
			client: polarClient,
			createCustomerOnSignUp: true,
			enableCustomerPortal: true,
			use: [
				checkout({
					products: [
						{
							productId: "your-product-id",
							slug: "pro",
						},
					],
					successUrl: env.POLAR_SUCCESS_URL,
					authenticatedUsersOnly: true,
				}),
				portal(),
			],
		}),
	],
{{/if}}
});
{{/if}}`],
  ["examples/ai/native/bare/polyfills.js", `import structuredClone from "@ungap/structured-clone";
import { Platform } from "react-native";

if (Platform.OS !== "web") {
  const setupPolyfills = async () => {
    const { polyfillGlobal } = await import("react-native/Libraries/Utilities/PolyfillFunctions");

    const { TextEncoderStream, TextDecoderStream } =
      await import("@stardazed/streams-text-encoding");

    if (!("structuredClone" in global)) {
      polyfillGlobal("structuredClone", () => structuredClone);
    }

    polyfillGlobal("TextEncoderStream", () => TextEncoderStream);
    polyfillGlobal("TextDecoderStream", () => TextDecoderStream);
  };

  setupPolyfills();
}

export {};
`],
  ["api/orpc/native/utils/orpc.ts.hbs", `import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import type { AppRouterClient } from "@{{projectName}}/api/routers/index";
import { env } from "@{{projectName}}/env/native";
{{#if (eq auth "better-auth")}}
import { authClient } from "@/lib/auth-client";
{{/if}}

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error) => {
			console.log(error)
		},
	}),
});

export const link = new RPCLink({
{{#if (eq backend "self")}}
	url: \`\${env.EXPO_PUBLIC_SERVER_URL}/api/rpc\`,
{{else}}
	url: \`\${env.EXPO_PUBLIC_SERVER_URL}/rpc\`,
{{/if}}
{{#if (eq auth "better-auth")}}
	headers() {
		const headers = new Map<string, string>();
		const cookies = authClient.getCookie();
		if (cookies) {
			headers.set("Cookie", cookies);
		}
		return Object.fromEntries(headers);
	},
{{/if}}
});

export const client: AppRouterClient = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);
`],
  ["db/prisma/mysql/prisma/schema/schema.prisma.hbs", `generator client {
  provider      = "prisma-client"
  output        = "../generated"
  moduleFormat  = "esm"
  {{#if (eq runtime "bun")}}
  runtime       = "bun"
  {{/if}}
  {{#if (eq runtime "node")}}
  runtime       = "nodejs"
  {{/if}}
  {{#if (or (eq runtime "workers") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
  runtime       = "workerd"
  {{/if}}
}

datasource db {
  provider = "mysql"
  {{#if (eq dbSetup "planetscale")}}
  relationMode = "prisma"
  {{/if}}
}`],
  ["db/drizzle/sqlite/src/index.ts.hbs", `{{#if (or (eq runtime "bun") (eq runtime "node") (eq runtime "none"))}}
import { env } from "@{{projectName}}/env/server";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const client = createClient({
	url: env.DATABASE_URL,
{{#if (eq dbSetup "turso")}}
	authToken: env.DATABASE_AUTH_TOKEN,
{{/if}}
});

export const db = drizzle({ client, schema });
{{/if}}

{{#if (eq runtime "workers")}}
import * as schema from "./schema";

{{#if (eq dbSetup "d1")}}
import { drizzle } from "drizzle-orm/d1";
import { env } from "@{{projectName}}/env/server";

export const db = drizzle(env.DB, { schema });
{{else}}
import { drizzle } from "drizzle-orm/libsql";
import { env } from "@{{projectName}}/env/server";
import { createClient } from "@libsql/client";

const client = createClient({
	url: env.DATABASE_URL || "",
{{#if (eq dbSetup "turso")}}
	authToken: env.DATABASE_AUTH_TOKEN,
{{/if}}
});

export const db = drizzle({ client, schema });
{{/if}}
{{/if}}
`],
  ["db/prisma/sqlite/src/index.ts.hbs", `import { PrismaClient } from "../prisma/generated/client";

{{#if (eq dbSetup "d1")}}
import { PrismaD1 } from "@prisma/adapter-d1";
import { env } from "@{{projectName}}/env/server";

const adapter = new PrismaD1(env.DB);
const prisma = new PrismaClient({ adapter });

export default prisma;
{{else}}
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { env } from "@{{projectName}}/env/server";

const adapter = new PrismaLibSql({
	url: env.DATABASE_URL,
{{#if (eq dbSetup "turso")}}
	authToken: env.DATABASE_AUTH_TOKEN || "",
{{/if}}
});

const prisma = new PrismaClient({ adapter });

export default prisma;
{{/if}}`],
  ["auth/better-auth/native/uniwind/components/sign-in.tsx.hbs", `import { authClient } from "@/lib/auth-client";
{{#if (eq api "trpc")}}
import { queryClient } from "@/utils/trpc";
{{/if}}
{{#if (eq api "orpc")}}
import { queryClient } from "@/utils/orpc";
{{/if}}
import { useState } from "react";
import { Text, View } from "react-native";
import { Button, ErrorView, Spinner, Surface, TextField } from "heroui-native";

function SignIn() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
  setIsLoading(true);
  setError(null);

  await authClient.signIn.email(
  {
  email,
  password,
  },
  {
  onError(error) {
  setError(error.error?.message || "Failed to sign in");
  setIsLoading(false);
  },
  onSuccess() {
  setEmail("");
  setPassword("");
  {{#if (eq api "orpc")}}
  queryClient.refetchQueries();
  {{/if}}
  {{#if (eq api "trpc")}}
  queryClient.refetchQueries();
  {{/if}}
  },
  onFinished() {
  setIsLoading(false);
  },
  }
  );
  }

  return (
  <Surface variant="secondary" className="p-4 rounded-lg">
    <Text className="text-foreground font-medium mb-4">Sign In</Text>

    <ErrorView isInvalid={!!error} className="mb-3">
      {error}
    </ErrorView>

    <View className="gap-3">
      <TextField>
        <TextField.Label>Email</TextField.Label>
        <TextField.Input
          value={email}
          onChangeText={setEmail}
          placeholder="email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </TextField>

      <TextField>
        <TextField.Label>Password</TextField.Label>
        <TextField.Input
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />
      </TextField>

      <Button onPress={handleLogin} isDisabled={isLoading} className="mt-1">
        {isLoading ? <Spinner size="sm" color="default" /> : <Button.Label>Sign In</Button.Label>}
      </Button>
    </View>
  </Surface>
  );
  }

  export { SignIn };`],
  ["auth/better-auth/native/uniwind/components/sign-up.tsx.hbs", `import { authClient } from "@/lib/auth-client";
{{#if (eq api "trpc")}}
import { queryClient } from "@/utils/trpc";
{{/if}}
{{#if (eq api "orpc")}}
import { queryClient } from "@/utils/orpc";
{{/if}}
import { useState } from "react";
import { Text, View } from "react-native";
import { Button, ErrorView, Spinner, Surface, TextField } from "heroui-native";

function signUpHandler({
name,
email,
password,
setError,
setIsLoading,
setName,
setEmail,
setPassword,
}: {
  name: string;
  email: string;
  password: string;
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
}) {
setIsLoading(true);
setError(null);

authClient.signUp.email(
{
name,
email,
password,
},
{
onError(error) {
setError(error.error?.message || "Failed to sign up");
setIsLoading(false);
},
onSuccess() {
setName("");
setEmail("");
setPassword("");
{{#if (eq api "orpc")}}
queryClient.refetchQueries();
{{/if}}
{{#if (eq api "trpc")}}
queryClient.refetchQueries();
{{/if}}
},
onFinished() {
setIsLoading(false);
},
}
);
}

export function SignUp() {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

  function handlePress() {
  signUpHandler({
  name,
  email,
  password,
  setError,
  setIsLoading,
  setName,
  setEmail,
  setPassword,
  });
  }

  return (
  <Surface variant="secondary" className="p-4 rounded-lg">
    <Text className="text-foreground font-medium mb-4">Create Account</Text>

    <ErrorView isInvalid={!!error} className="mb-3">
      {error}
    </ErrorView>

    <View className="gap-3">
      <TextField>
        <TextField.Label>Name</TextField.Label>
        <TextField.Input value={name} onChangeText={setName} placeholder="John Doe" />
      </TextField>

      <TextField>
        <TextField.Label>Email</TextField.Label>
        <TextField.Input
          value={email}
          onChangeText={setEmail}
          placeholder="email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </TextField>

      <TextField>
        <TextField.Label>Password</TextField.Label>
        <TextField.Input
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />
      </TextField>

      <Button onPress={handlePress} isDisabled={isLoading} className="mt-1">
        {isLoading ? (
          <Spinner size="sm" color="default" />
        ) : (
          <Button.Label>Create Account</Button.Label>
        )}
      </Button>
    </View>
  </Surface>
  );
  }`],
  ["db/prisma/mongodb/prisma/schema/schema.prisma.hbs", `generator client {
  provider = "prisma-client"
  output   = "../generated"
  moduleFormat = "esm"
  {{#if (eq runtime "bun")}}
  runtime = "bun"
  {{/if}}
  {{#if (eq runtime "node")}}
  runtime = "nodejs"
  {{/if}}
  {{#if (or (eq runtime "workers") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
  runtime = "workerd"
  {{/if}}
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}
`],
  ["frontend/native/uniwind/app/(drawer)/(tabs)/_layout.tsx.hbs", `import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "heroui-native";

export default function TabLayout() {
	const themeColorForeground = useThemeColor("foreground");
	const themeColorBackground = useThemeColor("background");

	return (
		<Tabs
			screenOptions=\\{{
				headerShown: false,
				headerStyle: {
					backgroundColor: themeColorBackground,
				},
				headerTintColor: themeColorForeground,
				headerTitleStyle: {
					color: themeColorForeground,
					fontWeight: "600",
				},
				tabBarStyle: {
					backgroundColor: themeColorBackground,
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options=\\{{
					title: "Home",
					tabBarIcon: ({ color, size }: { color: string; size: number }) => (
						<Ionicons name="home" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="two"
				options=\\{{
					title: "Explore",
					tabBarIcon: ({ color, size }: { color: string; size: number }) => (
						<Ionicons name="compass" size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
`],
  ["frontend/native/uniwind/app/(drawer)/(tabs)/index.tsx.hbs", `import { Container } from "@/components/container";
import { Text, View } from "react-native";
import { Card } from "heroui-native";

export default function Home() {
	return (
		<Container className="p-6">
			<View className="flex-1 justify-center items-center">
				<Card variant="secondary" className="p-8 items-center">
					<Card.Title className="text-3xl mb-2">Tab One</Card.Title>
				</Card>
			</View>
		</Container>
	);
}
`],
  ["frontend/native/uniwind/app/(drawer)/(tabs)/two.tsx.hbs", `import { Container } from "@/components/container";
import { Text, View } from "react-native";
import { Card } from "heroui-native";

export default function TabTwo() {
	return (
		<Container className="p-6">
			<View className="flex-1 justify-center items-center">
				<Card variant="secondary" className="p-8 items-center">
					<Card.Title className="text-3xl mb-2">TabTwo</Card.Title>
				</Card>
			</View>
		</Container>
	);
}
`],
  ["auth/better-auth/web/svelte/src/lib/auth-client.ts.hbs", `import { PUBLIC_SERVER_URL } from "$env/static/public";
import { createAuthClient } from "better-auth/svelte";
{{#if (eq payments "polar")}}
import { polarClient } from "@polar-sh/better-auth";
{{/if}}

export const authClient = createAuthClient({
	baseURL: PUBLIC_SERVER_URL,
{{#if (eq payments "polar")}}
	plugins: [polarClient()]
{{/if}}
});
`],
  ["auth/better-auth/native/unistyles/app/(drawer)/index.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Container } from "@/components/container";
import { SignIn } from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
{{#if (eq api "orpc")}}
import { useQuery } from "@tanstack/react-query";
import { queryClient, orpc } from "@/utils/orpc";
{{/if}}
{{#if (eq api "trpc")}}
import { useQuery } from "@tanstack/react-query";
import { queryClient, trpc } from "@/utils/trpc";
{{/if}}

export default function Home() {
    {{#if (eq api "orpc")}}
    const healthCheck = useQuery(orpc.healthCheck.queryOptions());
    const privateData = useQuery(orpc.privateData.queryOptions());
    {{/if}}
    {{#if (eq api "trpc")}}
    const healthCheck = useQuery(trpc.healthCheck.queryOptions());
    const privateData = useQuery(trpc.privateData.queryOptions());
    {{/if}}
  const { data: session } = authClient.useSession();

  return (
    <Container>
      <ScrollView>
        <View style={styles.pageContainer}>
          <Text style={styles.headerTitle}>BETTER T STACK</Text>
          {session?.user ? (
            <View style={styles.sessionInfoCard}>
              <View style={styles.sessionUserRow}>
                <Text style={styles.welcomeText}>
                  Welcome,{" "}
                  <Text style={styles.userNameText}>{session.user.name}</Text>
                </Text>
              </View>
              <Text style={styles.emailText}>{session.user.email}</Text>

              <TouchableOpacity
                style={styles.signOutButton}
                onPress={() => {
                  authClient.signOut();
                  {{#if (eq api "orpc")}}
                  queryClient.invalidateQueries();
                  {{/if}}
                  {{#if (eq api "trpc")}}
                  queryClient.invalidateQueries();
                  {{/if}}
                }}
              >
                <Text style={styles.signOutButtonText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          {{#unless (eq api "none")}}
          <View style={styles.apiStatusCard}>
            <Text style={styles.cardTitle}>API Status</Text>
            <View style={styles.apiStatusRow}>
              <View
                style={[
                  styles.statusIndicatorDot,
                  healthCheck.data
                    ? styles.statusIndicatorGreen
                    : styles.statusIndicatorRed,
                ]}
              />
              <Text style={styles.mutedText}>
                {healthCheck.isLoading
                  ? "Checking..."
                  : healthCheck.data
                    ? "Connected to API"
                    : "API Disconnected"}
              </Text>
            </View>
          </View>
          <View style={styles.privateDataCard}>
            <Text style={styles.cardTitle}>Private Data</Text>
            {privateData && (
              <View>
                <Text style={styles.mutedText}>
                  {privateData.data?.message}
                </Text>
              </View>
            )}
          </View>
          {{/unless}}
          {!session?.user && (
            <>
              <SignIn />
              <SignUp />
            </>
          )}
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create((theme) => ({
  pageContainer: {
    paddingHorizontal: 8,
  },
  headerTitle: {
    color: theme?.colors?.typography,
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 16,
  },
  sessionInfoCard: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme?.colors?.border,
  },
  sessionUserRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  welcomeText: {
    color: theme?.colors?.typography,
    fontSize: 16,
  },
  userNameText: {
    fontWeight: "500",
    color: theme?.colors?.typography,
  },
  emailText: {
    color: theme?.colors?.typography,
    fontSize: 14,
    marginBottom: 16,
  },
  signOutButton: {
    backgroundColor: theme?.colors?.destructive,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  signOutButtonText: {
    fontWeight: "500",
  },
  apiStatusCard: {
    marginBottom: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme?.colors?.border,
    padding: 16,
  },
  cardTitle: {
    marginBottom: 12,
    fontWeight: "500",
    color: theme?.colors?.typography,
  },
  apiStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusIndicatorDot: {
    height: 12,
    width: 12,
    borderRadius: 9999,
  },
  statusIndicatorGreen: {
    backgroundColor: theme.colors.success,
  },
  statusIndicatorRed: {
    backgroundColor: theme.colors.destructive,
  },
  mutedText: {
    color: theme?.colors?.typography,
  },
  privateDataCard: {
    marginBottom: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme?.colors?.border,
    padding: 16,
  },
}));
`],
  ["examples/ai/web/nuxt/app/pages/ai.vue.hbs", `<script setup lang="ts">
import { Chat } from '@ai-sdk/vue'
import type { UIMessage } from 'ai'
import { getTextFromMessage } from '@nuxt/ui/utils/ai'
import { DefaultChatTransport } from 'ai'
import { ref } from 'vue'

const config = useRuntimeConfig()
const messages: UIMessage[] = []
const input = ref('')

const chat = new Chat({
  messages,
  transport: new DefaultChatTransport({
    api: \`\${config.public.serverUrl}/ai\`,
  }),
  onError(error) {
    console.error('Chat error:', error)
  }
})

async function handleSubmit(e: Event) {
  e.preventDefault()
  const userInput = input.value
  input.value = ''

  if (!userInput.trim()) return

  chat.sendMessage({ text: userInput })
}
</script>

<template>
  <UContainer class="h-full flex flex-col overflow-hidden py-4">
    <div class="flex-1 min-h-0 overflow-y-auto">
      <UChatMessages :messages="chat.messages" :status="chat.status">
        <template #content="{ message }">
          <div class="whitespace-pre-wrap">\\{{ getTextFromMessage(message) }}</div>
        </template>
      </UChatMessages>
    </div>

    <div class="shrink-0 pt-4 border-t border-gray-200 dark:border-gray-800">
      <UChatPrompt
        v-model="input"
        :error="chat.error"
        @submit="handleSubmit"
        placeholder="Type your message..."
      >
        <UChatPromptSubmit :status="chat.status" @stop="() => chat.stop()" @reload="() => chat.regenerate()" />
      </UChatPrompt>
    </div>
  </UContainer>
</template>`],
  ["frontend/react/tanstack-start/src/routes/__root.tsx.hbs", `import { Toaster } from "@/components/ui/sonner";
{{#unless (eq backend "convex")}} {{#unless (eq api "none")}}
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
{{/unless}} {{/unless}}
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
{{#if (and (eq backend "convex") (or (eq auth "clerk") (eq auth "better-auth")))}}
  useRouteContext,
{{/if}}
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "../components/header";
import appCss from "../index.css?url";
{{#if (eq backend "convex")}}
import type { QueryClient } from "@tanstack/react-query";
import type { ConvexQueryClient } from "@convex-dev/react-query";
{{else}}
{{#if (or (eq api "trpc") (eq api "orpc"))}}
import type { QueryClient } from "@tanstack/react-query";
{{/if}}
{{/if}}

{{#if (and (eq backend "convex") (eq auth "clerk"))}}
import { ClerkProvider, useAuth } from "@clerk/tanstack-react-start";
import { auth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const fetchClerkAuth = createServerFn({ method: "GET" }).handler(async () => {
  const clerkAuth = await auth();
  const token = await clerkAuth.getToken({ template: "convex" });
  return { userId: clerkAuth.userId, token };
});
{{else if (and (eq backend "convex") (eq auth "better-auth"))}}
import { createServerFn } from "@tanstack/react-start";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "@/lib/auth-client";
import { getToken } from "@/lib/auth-server";

const getAuth = createServerFn({ method: "GET" }).handler(async () => {
  return await getToken();
});
{{else if (eq backend "convex")}}
import { ConvexProvider } from "convex/react";
{{/if}}

{{#if (eq backend "convex")}}
export interface RouterAppContext {
  queryClient: QueryClient;
  convexQueryClient: ConvexQueryClient;
}
{{else}}
  {{#if (eq api "trpc")}}
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@{{projectName}}/api/routers/index";
export interface RouterAppContext {
  trpc: TRPCOptionsProxy<AppRouter>;
  queryClient: QueryClient;
}
  {{else if (eq api "orpc")}}
import type { orpc } from "@/utils/orpc";
export interface RouterAppContext {
  orpc: typeof orpc;
  queryClient: QueryClient;
}
  {{else}}
export interface RouterAppContext {
}
  {{/if}}
{{/if}}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "My App",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  component: RootDocument,
  {{#if (and (eq backend "convex") (eq auth "clerk"))}}
  beforeLoad: async (ctx) => {
    const { userId, token } = await fetchClerkAuth();
    if (token) {
      ctx.context.convexQueryClient.serverHttpClient?.setAuth(token);
    }
    return { userId, token };
  },
  {{else if (and (eq backend "convex") (eq auth "better-auth"))}}
  beforeLoad: async (ctx) => {
    const token = await getAuth();
    if (token) {
      ctx.context.convexQueryClient.serverHttpClient?.setAuth(token);
    }
    return {
      isAuthenticated: !!token,
      token,
    };
  },
  {{/if}}
});

function RootDocument() {
  {{#if (and (eq backend "convex") (eq auth "clerk"))}}
  const context = useRouteContext({ from: Route.id });
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={context.convexQueryClient.convexClient} useAuth={useAuth}>
        <html lang="en" className="dark">
          <head>
            <HeadContent />
          </head>
          <body>
            <div className="grid h-svh grid-rows-[auto_1fr]">
              <Header />
              <Outlet />
            </div>
            <Toaster richColors />
            <TanStackRouterDevtools position="bottom-left" />
            <Scripts />
          </body>
        </html>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
  {{else if (and (eq backend "convex") (eq auth "better-auth"))}}
  const context = useRouteContext({ from: Route.id });
  return (
    <ConvexBetterAuthProvider
      client={context.convexQueryClient.convexClient}
      authClient={authClient}
      initialToken={context.token}
    >
      <html lang="en" className="dark">
        <head>
          <HeadContent />
        </head>
        <body>
          <div className="grid h-svh grid-rows-[auto_1fr]">
            <Header />
            <Outlet />
          </div>
          <Toaster richColors />
          <TanStackRouterDevtools position="bottom-left" />
          <Scripts />
        </body>
      </html>
    </ConvexBetterAuthProvider>
  );
  {{else if (eq backend "convex")}}
  const { convexQueryClient } = Route.useRouteContext();
  return (
    <ConvexProvider client={convexQueryClient.convexClient}>
      <html lang="en" className="dark">
        <head>
          <HeadContent />
        </head>
        <body>
          <div className="grid h-svh grid-rows-[auto_1fr]">
            <Header />
            <Outlet />
          </div>
          <Toaster richColors />
          <TanStackRouterDevtools position="bottom-left" />
          <Scripts />
        </body>
      </html>
    </ConvexProvider>
  );
  {{else}}
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="grid h-svh grid-rows-[auto_1fr]">
          <Header />
          <Outlet />
        </div>
        <Toaster richColors />
        <TanStackRouterDevtools position="bottom-left" />
        {{#unless (eq api "none")}}
        <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
        {{/unless}}
        <Scripts />
      </body>
    </html>
  );
  {{/if}}
}
`],
  ["frontend/react/tanstack-start/src/routes/index.tsx.hbs", `import { createFileRoute } from "@tanstack/react-router";
{{#if (eq backend "convex")}}
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "@{{projectName}}/backend/convex/_generated/api";
{{else if (or (eq api "trpc") (eq api "orpc"))}}
import { useQuery } from "@tanstack/react-query";
  {{#if (eq api "trpc")}}
import { useTRPC } from "@/utils/trpc";
  {{/if}}
  {{#if (eq api "orpc")}}
import { orpc } from "@/utils/orpc";
  {{/if}}
{{/if}}

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

const TITLE_TEXT = \`
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 \`;

function HomeComponent() {
  {{#if (eq backend "convex")}}
  const healthCheck = useQuery(convexQuery(api.healthCheck.get, {}));
  {{else if (eq api "trpc")}}
  const trpc = useTRPC();
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());
  {{else if (eq api "orpc")}}
  const healthCheck = useQuery(orpc.healthCheck.queryOptions());
  {{/if}}

  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <pre className="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
      <div className="grid gap-6">
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">API Status</h2>
          {{#if (eq backend "convex")}}
          <div className="flex items-center gap-2">
            <div
              className={\`h-2 w-2 rounded-full \${healthCheck.data === "OK" ? "bg-green-500" : healthCheck.isLoading ? "bg-orange-400" : "bg-red-500"}\`}
            />
            <span className="text-muted-foreground text-sm">
              {healthCheck.isLoading
                ? "Checking..."
                : healthCheck.data === "OK"
                  ? "Connected"
                  : "Error"}
            </span>
          </div>
          {{else}}
            {{#unless (eq api "none")}}
            <div className="flex items-center gap-2">
              <div
                className={\`h-2 w-2 rounded-full \${healthCheck.data ? "bg-green-500" : "bg-red-500"}\`}
              />
              <span className="text-muted-foreground text-sm">
                {healthCheck.isLoading
                  ? "Checking..."
                  : healthCheck.data
                    ? "Connected"
                    : "Disconnected"}
              </span>
            </div>
            {{/unless}}
          {{/if}}
        </section>
      </div>
    </div>
  );
}
`],
  ["auth/better-auth/web/svelte/src/components/UserMenu.svelte.hbs", `<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';

	const sessionQuery = authClient.useSession();

	async function handleSignOut() {
		await authClient.signOut({
		fetchOptions: {
			onSuccess: () => {
				goto('/');
			},
			onError: (error) => {
				console.error('Sign out failed:', error);
			}
		}
		});
	}

	function goToLogin() {
		goto('/login');
	}

</script>

<div class="relative">
	{#if $sessionQuery.isPending}
		<div class="h-8 w-24 animate-pulse rounded bg-neutral-700"></div>
	{:else if $sessionQuery.data?.user}
		{@const user = $sessionQuery.data.user}
		<div class="flex items-center gap-3">
			<span class="text-sm text-neutral-300 hidden sm:inline" title={user.email}>
				{user.name || user.email?.split('@')[0] || 'User'}
			</span>
			<button
				onclick={handleSignOut}
				class="rounded px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white transition-colors"
			>
				Sign Out
			</button>
		</div>
	{:else}
		<div class="flex items-center gap-2">
			<button
				onclick={goToLogin}
				class="rounded px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
			>
				Sign In
			</button>
		</div>
	{/if}
</div>
`],
  ["auth/better-auth/web/svelte/src/components/SignUpForm.svelte.hbs", `<script lang="ts">
	import { createForm } from '@tanstack/svelte-form';
	import { z } from 'zod';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';

	let { switchToSignIn } = $props<{ switchToSignIn: () => void }>();

	const validationSchema = z.object({
		name: z.string().min(2, 'Name must be at least 2 characters'),
		email: z.email('Invalid email address'),
		password: z.string().min(8, 'Password must be at least 8 characters'),
	});


	const form = createForm(() => ({
		defaultValues: { name: '', email: '', password: '' },
		onSubmit: async ({ value }) => {
				await authClient.signUp.email(
					{
						email: value.email,
						password: value.password,
						name: value.name,
					},
					{
						onSuccess: () => {
							goto('/dashboard');
						},
						onError: (error) => {
							console.log(error.error.message || 'Sign up failed. Please try again.');
						},
					}
				);

		},
		validators: {
			onSubmit: validationSchema,
		},
	}));
</script>

<div class="mx-auto mt-10 w-full max-w-md p-6">
	<h1 class="mb-6 text-center font-bold text-3xl">Create Account</h1>

	<form
		id="form"
		class="space-y-4"
		onsubmit={(e) => {
			e.preventDefault();
			e.stopPropagation();
			form.handleSubmit();
		}}
	>
		<form.Field name="name">
			{#snippet children(field)}
				<div class="space-y-1">
					<label for={field.name}>Name</label>
					<input
						id={field.name}
						name={field.name}
						class="w-full border"
						onblur={field.handleBlur}
						value={field.state.value}
						oninput={(e: Event) => {
							const target = e.target as HTMLInputElement;
							field.handleChange(target.value);
						}}
					/>
					{#if field.state.meta.isTouched}
						{#each field.state.meta.errors as error}
							<p class="text-sm text-red-500" role="alert">{error}</p>
						{/each}
					{/if}
				</div>
			{/snippet}
		</form.Field>

		<form.Field name="email">
			{#snippet children(field)}
				<div class="space-y-1">
					<label for={field.name}>Email</label>
					<input
						id={field.name}
						name={field.name}
						type="email"
						class="w-full border"
						onblur={field.handleBlur}
						value={field.state.value}
						oninput={(e: Event) => {
							const target = e.target as HTMLInputElement;
							field.handleChange(target.value);
						}}
					/>
					{#if field.state.meta.isTouched}
						{#each field.state.meta.errors as error}
							<p class="text-sm text-red-500" role="alert">{error}</p>
						{/each}
					{/if}
				</div>
			{/snippet}
		</form.Field>

		<form.Field name="password">
			{#snippet children(field)}
				<div class="space-y-1">
					<label for={field.name}>Password</label>
					<input
						id={field.name}
						name={field.name}
						type="password"
						class="w-full border"
						onblur={field.handleBlur}
						value={field.state.value}
						oninput={(e: Event) => {
							const target = e.target as HTMLInputElement;
							field.handleChange(target.value);
						}}
					/>
					{#if field.state.meta.isTouched}
						{#each field.state.meta.errors as error}
							<p class="text-sm text-red-500" role="alert">{error}</p>
						{/each}
					{/if}
				</div>
			{/snippet}
		</form.Field>

		<form.Subscribe selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}>
			{#snippet children(state)}
				<button type="submit" class="w-full" disabled={!state.canSubmit || state.isSubmitting}>
					{state.isSubmitting ? 'Submitting...' : 'Sign Up'}
				</button>
			{/snippet}
		</form.Subscribe>
	</form>

	<div class="mt-4 text-center">
		<button type="button" class="text-indigo-600 hover:text-indigo-800" onclick={switchToSignIn}>
			Already have an account? Sign In
		</button>
	</div>
</div>
`],
  ["auth/better-auth/web/svelte/src/components/SignInForm.svelte.hbs", `<script lang="ts">
	import { createForm } from '@tanstack/svelte-form';
	import { z } from 'zod';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';

	let { switchToSignUp } = $props<{ switchToSignUp: () => void }>();

	const validationSchema = z.object({
		email: z.email('Invalid email address'),
		password: z.string().min(1, 'Password is required'),
	});

	const form = createForm(() => ({
		defaultValues: { email: '', password: '' },
		onSubmit: async ({ value }) => {
				await authClient.signIn.email(
					{ email: value.email, password: value.password },
					{
						onSuccess: () => goto('/dashboard'),
						onError: (error) => {
							console.log(error.error.message || 'Sign in failed. Please try again.');
						},
					}
				);

		},
		validators: {
			onSubmit: validationSchema,
		},
	}));
</script>

<div class="mx-auto mt-10 w-full max-w-md p-6">
	<h1 class="mb-6 text-center font-bold text-3xl">Welcome Back</h1>

	<form
		class="space-y-4"
		onsubmit={(e) => {
			e.preventDefault();
			e.stopPropagation();
			form.handleSubmit();
		}}
	>
		<form.Field name="email">
			{#snippet children(field)}
				<div class="space-y-1">
					<label for={field.name}>Email</label>
					<input
						id={field.name}
						name={field.name}
						type="email"
						class="w-full border"
						onblur={field.handleBlur}
						value={field.state.value}
						oninput={(e: Event) => {
							const target = e.target as HTMLInputElement;
							field.handleChange(target.value);
						}}
					/>
					{#if field.state.meta.isTouched}
						{#each field.state.meta.errors as error}
							<p class="text-sm text-red-500" role="alert">{error}</p>
						{/each}
					{/if}
				</div>
			{/snippet}
		</form.Field>

		<form.Field name="password">
			{#snippet children(field)}
				<div class="space-y-1">
					<label for={field.name}>Password</label>
					<input
						id={field.name}
						name={field.name}
						type="password"
						class="w-full border"
						onblur={field.handleBlur}
						value={field.state.value}
						oninput={(e: Event) => {
							const target = e.target as HTMLInputElement;
							field.handleChange(target.value);
						}}
					/>
					{#if field.state.meta.isTouched}
						{#each field.state.meta.errors as error}
							<p class="text-sm text-red-500" role="alert">{error}</p>
						{/each}
					{/if}
				</div>
			{/snippet}
		</form.Field>

		<form.Subscribe selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}>
			{#snippet children(state)}
				<button type="submit" class="w-full" disabled={!state.canSubmit || state.isSubmitting}>
					{state.isSubmitting ? 'Submitting...' : 'Sign In'}
				</button>
			{/snippet}
		</form.Subscribe>
	</form>

	<div class="mt-4 text-center">
		<button type="button" class="text-indigo-600 hover:text-indigo-800" onclick={switchToSignUp}>
			Need an account? Sign Up
		</button>
	</div>
</div>
`],
  ["examples/todo/native/uniwind/app/(drawer)/todos.tsx.hbs", `import { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
{{#if (eq backend "convex")}}
import { useMutation, useQuery } from "convex/react";
import { api } from "@{{projectName}}/backend/convex/_generated/api";
import type { Id } from "@{{projectName}}/backend/convex/_generated/dataModel";
{{else}}
import { useMutation, useQuery } from "@tanstack/react-query";
{{/if}}
import { Container } from "@/components/container";
{{#unless (eq backend "convex")}}
  {{#if (eq api "orpc")}}
    import { orpc } from "@/utils/orpc";
  {{/if}}
  {{#if (eq api "trpc")}}
    import { trpc } from "@/utils/trpc";
  {{/if}}
{{/unless}}
import { Button, Checkbox, Chip, Spinner, Surface, TextField, useThemeColor } from "heroui-native";

export default function TodosScreen() {
  const [newTodoText, setNewTodoText] = useState("");
  {{#if (eq backend "convex")}}
    const todos = useQuery(api.todos.getAll);
    const createTodoMutation = useMutation(api.todos.create);
    const toggleTodoMutation = useMutation(api.todos.toggle);
    const deleteTodoMutation = useMutation(api.todos.deleteTodo);
  {{else}}
    {{#if (eq api "orpc")}}
      const todos = useQuery(orpc.todo.getAll.queryOptions());
      const createMutation = useMutation(orpc.todo.create.mutationOptions({
        onSuccess: () => {
          todos.refetch();
          setNewTodoText("");
        },
      }));
      const toggleMutation = useMutation(orpc.todo.toggle.mutationOptions({
        onSuccess: () => {
          todos.refetch();
        },
      }));
      const deleteMutation = useMutation(orpc.todo.delete.mutationOptions({
        onSuccess: () => {
          todos.refetch();
        },
      }));
    {{/if}}
    {{#if (eq api "trpc")}}
      const todos = useQuery(trpc.todo.getAll.queryOptions());
      const createMutation = useMutation(trpc.todo.create.mutationOptions({
        onSuccess: () => {
          todos.refetch();
          setNewTodoText("");
        },
      }));
      const toggleMutation = useMutation(trpc.todo.toggle.mutationOptions({
        onSuccess: () => {
          todos.refetch();
        },
      }));
      const deleteMutation = useMutation(trpc.todo.delete.mutationOptions({
        onSuccess: () => {
          todos.refetch();
        },
      }));
    {{/if}}
  {{/if}}

  const mutedColor = useThemeColor("muted");
  const dangerColor = useThemeColor("danger");
  const foregroundColor = useThemeColor("foreground");

  {{#if (eq backend "convex")}}
    const handleAddTodo = async () => {
      const text = newTodoText.trim();
      if (!text) return;
      await createTodoMutation({ text });
      setNewTodoText("");
    };

    const handleToggleTodo = (id: Id<"todos">, currentCompleted: boolean) => {
      toggleTodoMutation({ id, completed: !currentCompleted });
    };

    const handleDeleteTodo = (id: Id<"todos">) => {
      Alert.alert("Delete Todo", "Are you sure you want to delete this todo?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTodoMutation({ id }),
        },
      ]);
    };

    const isLoading = !todos;
    const completedCount = todos?.filter((t) => t.completed).length || 0;
    const totalCount = todos?.length || 0;
  {{else}}
    const handleAddTodo = () => {
      if (newTodoText.trim()) {
        createMutation.mutate({ text: newTodoText });
      }
    };

    const handleToggleTodo = (id: number, completed: boolean) => {
      toggleMutation.mutate({ id, completed: !completed });
    };

    const handleDeleteTodo = (id: number) => {
      Alert.alert("Delete Todo", "Are you sure you want to delete this todo?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteMutation.mutate({ id }),
        },
      ]);
    };

    const isLoading = todos?.isLoading;
    const completedCount = todos?.data?.filter((t) => t.completed).length || 0;
    const totalCount = todos?.data?.length || 0;
  {{/if}}

  return (
    <Container>
      <ScrollView className="flex-1" contentContainerClassName="p-4">
        <View className="py-4 mb-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-semibold text-foreground tracking-tight">Tasks</Text>
            {totalCount > 0 && (
              <Chip variant="secondary" color="accent" size="sm">
                <Chip.Label>
                  {completedCount}/{totalCount}
                </Chip.Label>
              </Chip>
            )}
          </View>
        </View>

        <Surface variant="secondary" className="mb-4 p-3 rounded-lg">
          <View className="flex-row items-center gap-2">
            <View className="flex-1">
              <TextField>
                <TextField.Input
                  value={newTodoText}
                  onChangeText={setNewTodoText}
                  placeholder="Add a new task..."
                  {{#unless (eq backend "convex")}}
                    editable={!createMutation.isPending}
                  {{/unless}}
                  onSubmitEditing={handleAddTodo}
                  returnKeyType="done"
                />
              </TextField>
            </View>
            <Button
              isIconOnly
              {{#if (eq backend "convex")}}
                variant={!newTodoText.trim() ? "secondary" : "primary"}
                isDisabled={!newTodoText.trim()}
              {{else}}
                variant={createMutation.isPending || !newTodoText.trim() ? "secondary" : "primary"}
                isDisabled={createMutation.isPending || !newTodoText.trim()}
              {{/if}}
              onPress={handleAddTodo}
              size="sm"
            >
              {{#if (eq backend "convex")}}
                <Ionicons
                  name="add"
                  size={20}
                  color={newTodoText.trim() ? foregroundColor : mutedColor}
                />
              {{else}}
                {createMutation.isPending ? (
                  <Spinner size="sm" color="default" />
                ) : (
                  <Ionicons
                    name="add"
                    size={20}
                    color={(createMutation.isPending || !newTodoText.trim()) ? mutedColor : foregroundColor}
                  />
                )}
              {{/if}}
            </Button>
          </View>
        </Surface>

        {{#if (eq backend "convex")}}
          {isLoading && (
            <View className="items-center justify-center py-12">
              <Spinner size="lg" />
              <Text className="text-muted text-sm mt-3">Loading tasks...</Text>
            </View>
          )}

          {todos && todos.length === 0 && !isLoading && (
            <Surface variant="secondary" className="items-center justify-center py-10 rounded-lg">
              <Ionicons name="checkbox-outline" size={40} color={mutedColor} />
              <Text className="text-foreground font-medium mt-3">No tasks yet</Text>
              <Text className="text-muted text-xs mt-1">Add your first task to get started</Text>
            </Surface>
          )}

          {todos && todos.length > 0 && (
            <View className="gap-2">
              {todos.map((todo) => (
                <Surface key={todo._id} variant="secondary" className="p-3 rounded-lg">
                  <View className="flex-row items-center gap-3">
                    <Checkbox
                      isSelected={todo.completed}
                      onSelectedChange={() => handleToggleTodo(todo._id, todo.completed)}
                    />
                    <View className="flex-1">
                      <Text className={\`text-sm \${todo.completed ? "text-muted line-through" : "text-foreground"}\`}>
                        {todo.text}
                      </Text>
                    </View>
                    <Button
                      isIconOnly
                      variant="ghost"
                      onPress={() => handleDeleteTodo(todo._id)}
                      size="sm"
                    >
                      <Ionicons name="trash-outline" size={16} color={dangerColor} />
                    </Button>
                  </View>
                </Surface>
              ))}
            </View>
          )}
        {{else}}
          {isLoading && (
            <View className="items-center justify-center py-12">
              <Spinner size="lg" />
              <Text className="text-muted text-sm mt-3">Loading tasks...</Text>
            </View>
          )}

          {todos?.data && todos.data.length === 0 && !isLoading && (
            <Surface variant="secondary" className="items-center justify-center py-10 rounded-lg">
              <Ionicons name="checkbox-outline" size={40} color={mutedColor} />
              <Text className="text-foreground font-medium mt-3">No tasks yet</Text>
              <Text className="text-muted text-xs mt-1">Add your first task to get started</Text>
            </Surface>
          )}

          {todos?.data && todos.data.length > 0 && (
            <View className="gap-2">
              {todos.data.map((todo) => (
                <Surface key={todo.id} variant="secondary" className="p-3 rounded-lg">
                  <View className="flex-row items-center gap-3">
                    <Checkbox
                      isSelected={todo.completed}
                      onSelectedChange={() => handleToggleTodo(todo.id, todo.completed)}
                    />
                    <View className="flex-1">
                      <Text className={\`text-sm \${todo.completed ? "text-muted line-through" : "text-foreground"}\`}>
                        {todo.text}
                      </Text>
                    </View>
                    <Button
                      isIconOnly
                      variant="ghost"
                      onPress={() => handleDeleteTodo(todo.id)}
                      size="sm"
                    >
                      <Ionicons name="trash-outline" size={16} color={dangerColor} />
                    </Button>
                  </View>
                </Surface>
              ))}
            </View>
          )}
        {{/if}}
      </ScrollView>
    </Container>
  );
}`],
  ["payments/polar/web/react/tanstack-start/src/routes/success.tsx.hbs", `import { createFileRoute, useSearch } from "@tanstack/react-router";

export const Route = createFileRoute("/success")({
	component: SuccessPage,
	validateSearch: (search) => ({
		checkout_id: search.checkout_id as string,
	}),
});

function SuccessPage() {
	const { checkout_id } = useSearch({ from: "/success" });

	return (
		<div className="container mx-auto px-4 py-8">
			<h1>Payment Successful!</h1>
			{checkout_id && <p>Checkout ID: {checkout_id}</p>}
		</div>
	);
}
`],
  ["frontend/react/next/src/components/providers.tsx.hbs", `"use client";

{{#if (eq backend "convex")}}
{{#if (eq auth "clerk")}}
import { useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { env } from "@{{projectName}}/env/web";
{{else if (eq auth "better-auth")}}
import { ConvexReactClient } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "@/lib/auth-client";
import { env } from "@{{projectName}}/env/web";
{{else}}
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { env } from "@{{projectName}}/env/web";
{{/if}}
{{else}}
{{#unless (eq api "none")}}
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
{{#if (eq api "orpc")}}
import { queryClient } from "@/utils/orpc";
{{/if}}
{{#if (eq api "trpc")}}
import { queryClient } from "@/utils/trpc";
{{/if}}
{{/unless}}
{{/if}}
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";

{{#if (eq backend "convex")}}
const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);
{{/if}}

export default function Providers({
  children,
{{#if (and (eq backend "convex") (eq auth "better-auth"))}}
  initialToken,
{{/if}}
}: {
  children: React.ReactNode;
{{#if (and (eq backend "convex") (eq auth "better-auth"))}}
  initialToken?: string | null;
{{/if}}
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {{#if (eq backend "convex")}}
      {{#if (eq auth "clerk")}}
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
      {{else if (eq auth "better-auth")}}
      <ConvexBetterAuthProvider
        client={convex}
        authClient={authClient}
        initialToken={initialToken}
      >
        {children}
      </ConvexBetterAuthProvider>
      {{else}}
      <ConvexProvider client={convex}>{children}</ConvexProvider>
      {{/if}}
      {{else}}
      {{#unless (eq api "none")}}
      <QueryClientProvider client={queryClient}>
        {{#if (eq api "orpc")}}
        {children}
        {{/if}}
        {{#if (eq api "trpc")}}
        {children}
        {{/if}}
        <ReactQueryDevtools />
      </QueryClientProvider>
      {{else}}
      {children}
      {{/unless}}
      {{/if}}
      <Toaster richColors />
    </ThemeProvider>
  );
}
`],
  ["frontend/react/next/src/components/mode-toggle.tsx.hbs", `"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="icon" />}>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
`],
  ["frontend/react/next/src/components/theme-provider.tsx.hbs", `"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
`],
  ["auth/better-auth/web/solid/src/routes/dashboard.tsx.hbs", `import { authClient } from "@/lib/auth-client";
{{#if (eq api "orpc")}}
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/solid-query";
{{/if}}
import { createFileRoute, redirect } from "@tanstack/solid-router";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	beforeLoad: async () => {
		const session = await authClient.getSession();
		if (!session.data) {
			redirect({
				to: "/login",
				throw: true,
			});
		}
		{{#if (eq payments "polar")}}
		const { data: customerState } = await authClient.customer.state();
		return { session, customerState };
		{{else}}
		return { session };
		{{/if}}
	},
});

function RouteComponent() {
	const context = Route.useRouteContext();

	const session = context().session;
	{{#if (eq payments "polar")}}
	const customerState = context().customerState;
	{{/if}}

	{{#if (eq api "orpc")}}
	const privateData = useQuery(() => orpc.privateData.queryOptions());
	{{/if}}

	{{#if (eq payments "polar")}}
	const hasProSubscription = () =>
		customerState?.activeSubscriptions?.length! > 0;
	{{/if}}

	return (
		<div>
			<h1>Dashboard</h1>
			<p>Welcome {session.data?.user.name}</p>
			{{#if (eq api "orpc")}}
			<p>API: {privateData.data?.message}</p>
			{{/if}}
			{{#if (eq payments "polar")}}
			<p>Plan: {hasProSubscription() ? "Pro" : "Free"}</p>
			{hasProSubscription() ? (
				<button onClick={async () => await authClient.customer.portal()}>
					Manage Subscription
				</button>
			) : (
				<button
					onClick={async () => await authClient.checkout({ slug: "pro" })}
				>
					Upgrade to Pro
				</button>
			)}
			{{/if}}
		</div>
	);
}
`],
  ["auth/better-auth/web/solid/src/routes/login.tsx.hbs", `import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import { createFileRoute } from "@tanstack/solid-router";
import { createSignal, Match, Switch } from "solid-js";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showSignIn, setShowSignIn] = createSignal(false);

  return (
    <Switch>
      <Match when={showSignIn()}>
        <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
      </Match>
      <Match when={!showSignIn()}>
        <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
      </Match>
    </Switch>
  );
}
`],
  ["payments/polar/web/react/tanstack-start/src/functions/get-payment.ts.hbs", `import { authClient } from "@/lib/auth-client";
import { authMiddleware } from "@/middleware/auth";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

export const getPayment = createServerFn({ method: "GET" })
    .middleware([authMiddleware])
    .handler(async () => {
        const { data: customerState } = await authClient.customer.state({
            fetchOptions: {
                headers: getRequestHeaders()
            }
        });
        return customerState;
    });
`],
  ["auth/better-auth/web/solid/src/lib/auth-client.ts.hbs", `import { createAuthClient } from "better-auth/solid";
{{#if (eq payments "polar")}}
import { polarClient } from "@polar-sh/better-auth";
{{/if}}
import { env } from "@{{projectName}}/env/web";

export const authClient = createAuthClient({
	baseURL: env.VITE_SERVER_URL,
{{#if (eq payments "polar")}}
	plugins: [polarClient()]
{{/if}}
});
`],
  ["api/trpc/server/src/routers/index.ts.hbs", `{{#if (eq api "orpc")}}
import { {{#if (eq auth "better-auth")}}protectedProcedure, {{/if}}publicProcedure } from "../index";
import type { RouterClient } from "@orpc/server";
{{#if (includes examples "todo")}}
import { todoRouter } from "./todo";
{{/if}}

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  {{#if (eq auth "better-auth")}}
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session?.user,
    };
  }),
  {{/if}}
  {{#if (includes examples "todo")}}
  todo: todoRouter,
  {{/if}}
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
{{else if (eq api "trpc")}}
import {
  {{#if (eq auth "better-auth")}}protectedProcedure, {{/if}}publicProcedure,
  router,
} from "../index";
{{#if (includes examples "todo")}}
import { todoRouter } from "./todo";
{{/if}}

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  {{#if (eq auth "better-auth")}}
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
  {{/if}}
  {{#if (includes examples "todo")}}
  todo: todoRouter,
  {{/if}}
});
export type AppRouter = typeof appRouter;
{{else}}
export const appRouter = {};
export type AppRouter = typeof appRouter;
{{/if}}
`],
  ["auth/better-auth/web/solid/src/components/sign-in-form.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { createForm } from "@tanstack/solid-form";
import { useNavigate } from "@tanstack/solid-router";
import z from "zod";
import { For } from "solid-js";

export default function SignInForm({ onSwitchToSignUp }: { onSwitchToSignUp: () => void }) {
  const navigate = useNavigate({
    from: "/",
  });

  const form = createForm(() => ({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            navigate({
              to: "/dashboard",
            });
            console.log("Sign in successful");
          },
          onError: (error) => {
            console.error(error.error.message);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  }));

  return (
    <div class="mx-auto w-full mt-10 max-w-md p-6">
      <h1 class="mb-6 text-center text-3xl font-bold">Welcome Back</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        class="space-y-4"
      >
        <div>
          <form.Field name="email">
            {(field) => (
              <div class="space-y-2">
                <label for={field().name}>Email</label>
                <input
                  id={field().name}
                  name={field().name}
                  type="email"
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                  class="w-full rounded border p-2"
                />
                <For each={field().state.meta.errors}>
                  {(error) => <p class="text-sm text-red-600">{error?.message}</p>}
                </For>
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="password">
            {(field) => (
              <div class="space-y-2">
                <label for={field().name}>Password</label>
                <input
                  id={field().name}
                  name={field().name}
                  type="password"
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                  class="w-full rounded border p-2"
                />
                <For each={field().state.meta.errors}>
                  {(error) => <p class="text-sm text-red-600">{error?.message}</p>}
                </For>
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe>
          {(state) => (
            <button
              type="submit"
              class="w-full rounded bg-indigo-600 p-2 text-white hover:bg-indigo-700 disabled:opacity-50"
              disabled={!state().canSubmit || state().isSubmitting}
            >
              {state().isSubmitting ? "Submitting..." : "Sign In"}
            </button>
          )}
        </form.Subscribe>
      </form>

      <div class="mt-4 text-center">
        <button
          type="button"
          onClick={onSwitchToSignUp}
          class="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          Need an account? Sign Up
        </button>
      </div>
    </div>
  );
}
`],
  ["auth/better-auth/web/solid/src/components/sign-up-form.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { createForm } from "@tanstack/solid-form";
import { useNavigate } from "@tanstack/solid-router";
import z from "zod";
import { For } from "solid-js";

export default function SignUpForm({ onSwitchToSignIn }: { onSwitchToSignIn: () => void }) {
  const navigate = useNavigate({
    from: "/",
  });

  const form = createForm(() => ({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: () => {
            navigate({
              to: "/dashboard",
            });
            console.log("Sign up successful");
          },
          onError: (error) => {
            console.error(error.error.message);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  }));

  return (
    <div class="mx-auto w-full mt-10 max-w-md p-6">
      <h1 class="mb-6 text-center text-3xl font-bold">Create Account</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        class="space-y-4"
      >
        <div>
          <form.Field name="name">
            {(field) => (
              <div class="space-y-2">
                <label for={field().name}>Name</label>
                <input
                  id={field().name}
                  name={field().name}
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                  class="w-full rounded border p-2"
                />
                <For each={field().state.meta.errors}>
                  {(error) => <p class="text-sm text-red-600">{error?.message}</p>}
                </For>
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="email">
            {(field) => (
              <div class="space-y-2">
                <label for={field().name}>Email</label>
                <input
                  id={field().name}
                  name={field().name}
                  type="email"
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                  class="w-full rounded border p-2"
                />
                <For each={field().state.meta.errors}>
                  {(error) => <p class="text-sm text-red-600">{error?.message}</p>}
                </For>
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="password">
            {(field) => (
              <div class="space-y-2">
                <label for={field().name}>Password</label>
                <input
                  id={field().name}
                  name={field().name}
                  type="password"
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                  class="w-full rounded border p-2"
                />
                <For each={field().state.meta.errors}>
                  {(error) => <p class="text-sm text-red-600">{error?.message}</p>}
                </For>
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe>
          {(state) => (
            <button
              type="submit"
              class="w-full rounded bg-indigo-600 p-2 text-white hover:bg-indigo-700 disabled:opacity-50"
              disabled={!state().canSubmit || state().isSubmitting}
            >
              {state().isSubmitting ? "Submitting..." : "Sign Up"}
            </button>
          )}
        </form.Subscribe>
      </form>

      <div class="mt-4 text-center">
        <button
          type="button"
          onClick={onSwitchToSignIn}
          class="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          Already have an account? Sign In
        </button>
      </div>
    </div>
  );
}
`],
  ["auth/better-auth/web/solid/src/components/user-menu.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useNavigate, Link } from "@tanstack/solid-router";
import { createSignal, Show } from "solid-js";

export default function UserMenu() {
  const navigate = useNavigate();
  const session = authClient.useSession();
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);

  return (
    <div class="relative inline-block text-left">
      <Show when={session().isPending}>
        <div class="h-9 w-24 animate-pulse rounded" />
      </Show>

      <Show when={!session().isPending && !session().data}>
        <Link to="/login" class="inline-block border rounded px-4  text-sm">
          Sign In
        </Link>
      </Show>

      <Show when={!session().isPending && session().data}>
        <button
          type="button"
          class="inline-block border rounded px-4  text-sm"
          onClick={() => setIsMenuOpen(!isMenuOpen())}
        >
          {session().data?.user.name}
        </button>

        <Show when={isMenuOpen()}>
          <div class="absolute right-0 mt-2 w-56 rounded p-1 shadow-sm">
            <div class="px-4  text-sm">{session().data?.user.email}</div>
            <button
              type="button"
              class="mt-1 w-full border rounded px-4  text-center text-sm"
              onClick={() => {
                setIsMenuOpen(false);
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      navigate({ to: "/" });
                    },
                  },
                });
              }}
            >
              Sign Out
            </button>
          </div>
        </Show>
      </Show>
    </div>
  );
}
`],
  ["payments/polar/server/base/src/lib/payments.ts.hbs", `import { Polar } from "@polar-sh/sdk";
import { env } from "@{{projectName}}/env/server";

export const polarClient = new Polar({
	accessToken: env.POLAR_ACCESS_TOKEN,
	server: "sandbox",
});
`],
  ["auth/better-auth/convex/native/unistyles/components/sign-in.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onError: (error) => {
          setError(error.error?.message || "Failed to sign in");
          setIsLoading(false);
        },
        onSuccess: () => {
          setEmail("");
          setPassword("");
        },
        onFinished: () => {
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={isLoading}
        style={styles.button}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.typography,
    marginBottom: 16,
  },
  errorContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 6,
  },
  errorText: {
    color: theme.colors.destructive,
    fontSize: 14,
  },
  input: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 6,
    color: theme.colors.typography,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "500",
  },
}));
`],
  ["auth/better-auth/convex/native/unistyles/components/sign-up.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";

export function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    setIsLoading(true);
    setError(null);

    await authClient.signUp.email(
      {
        name,
        email,
        password,
      },
      {
        onError: (error) => {
          setError(error.error?.message || "Failed to sign up");
          setIsLoading(false);
        },
        onSuccess: () => {
          setName("");
          setEmail("");
          setPassword("");
        },
        onFinished: () => {
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.inputLast}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        onPress={handleSignUp}
        disabled={isLoading}
        style={styles.button}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.typography,
    marginBottom: 16,
  },
  errorContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 6,
  },
  errorText: {
    color: theme.colors.destructive,
    fontSize: 14,
  },
  input: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 6,
    color: theme.colors.typography,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inputLast: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 6,
    color: theme.colors.typography,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "500",
  },
}));
`],
  ["payments/polar/web/react/react-router/src/routes/success.tsx.hbs", `import { useSearchParams } from "react-router";

export default function SuccessPage() {
    const [searchParams] = useSearchParams();
    const checkout_id = searchParams.get("checkout_id");

    return (
        <div className="container mx-auto px-4 py-8">
            <h1>Payment Successful!</h1>
            {checkout_id && <p>Checkout ID: {checkout_id}</p>}
        </div>
    );
}
`],
  ["frontend/native/unistyles/app/(drawer)/(tabs)/_layout.tsx.hbs", `import { Tabs } from "expo-router";
import { useUnistyles } from "react-native-unistyles";

import { TabBarIcon } from "@/components/tabbar-icon";

export default function TabLayout() {
  const { theme } = useUnistyles();

  return (
    <Tabs
      screenOptions=\\{{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options=\\{{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options=\\{{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="compass" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
`],
  ["frontend/native/unistyles/app/(drawer)/(tabs)/index.tsx.hbs", `import { Container } from "@/components/container";
import { ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function Home() {
  return (
    <Container>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Tab One</Text>
          <Text style={styles.subtitle}>
            Explore the first section of your app
          </Text>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.spacing.lg,
  },
  headerSection: {
    paddingVertical: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize["3xl"],
    fontWeight: "bold",
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.mutedForeground,
  },
}));
`],
  ["frontend/native/unistyles/app/(drawer)/(tabs)/two.tsx.hbs", `import { Container } from "@/components/container";
import { ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function TabTwo() {
  return (
    <Container>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Tab Two</Text>
          <Text style={styles.subtitle}>
            Discover more features and content
          </Text>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.spacing.lg,
  },
  headerSection: {
    paddingVertical: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize["3xl"],
    fontWeight: "bold",
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.mutedForeground,
  },
}));
`],
  ["auth/better-auth/convex/native/uniwind/components/sign-in.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Text, View } from "react-native";
import { Button, ErrorView, Spinner, Surface, TextField } from "heroui-native";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onError: (error) => {
          setError(error.error?.message || "Failed to sign in");
          setIsLoading(false);
        },
        onSuccess: () => {
          setEmail("");
          setPassword("");
        },
        onFinished: () => {
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <Surface variant="secondary" className="p-4 rounded-lg">
      <Text className="text-foreground font-medium mb-4">Sign In</Text>

      <ErrorView isInvalid={!!error} className="mb-3">
        {error}
      </ErrorView>

      <View className="gap-3">
        <TextField>
          <TextField.Label>Email</TextField.Label>
          <TextField.Input
            value={email}
            onChangeText={setEmail}
            placeholder="email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </TextField>

        <TextField>
          <TextField.Label>Password</TextField.Label>
          <TextField.Input
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />
        </TextField>

        <Button onPress={handleLogin} isDisabled={isLoading} className="mt-1">
          {isLoading ? <Spinner size="sm" color="default" /> : <Button.Label>Sign In</Button.Label>}
        </Button>
      </View>
    </Surface>
  );
}
`],
  ["auth/better-auth/convex/native/uniwind/components/sign-up.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Text, View } from "react-native";
import { Button, ErrorView, Spinner, Surface, TextField } from "heroui-native";

export function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    setIsLoading(true);
    setError(null);

    await authClient.signUp.email(
      {
        name,
        email,
        password,
      },
      {
        onError: (error) => {
          setError(error.error?.message || "Failed to sign up");
          setIsLoading(false);
        },
        onSuccess: () => {
          setName("");
          setEmail("");
          setPassword("");
        },
        onFinished: () => {
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <Surface variant="secondary" className="p-4 rounded-lg">
      <Text className="text-foreground font-medium mb-4">Create Account</Text>

      <ErrorView isInvalid={!!error} className="mb-3">
        {error}
      </ErrorView>

      <View className="gap-3">
        <TextField>
          <TextField.Label>Name</TextField.Label>
          <TextField.Input value={name} onChangeText={setName} placeholder="John Doe" />
        </TextField>

        <TextField>
          <TextField.Label>Email</TextField.Label>
          <TextField.Input
            value={email}
            onChangeText={setEmail}
            placeholder="email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </TextField>

        <TextField>
          <TextField.Label>Password</TextField.Label>
          <TextField.Input
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />
        </TextField>

        <Button onPress={handleSignUp} isDisabled={isLoading} className="mt-1">
          {isLoading ? (
            <Spinner size="sm" color="default" />
          ) : (
            <Button.Label>Create Account</Button.Label>
          )}
        </Button>
      </View>
    </Surface>
  );
}
`],
  ["frontend/react/web-base/src/components/ui/sonner.tsx.hbs", `import { useTheme } from 'next-themes'
import { Toaster as Sonner  } from 'sonner'
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import type {ToasterProps} from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      icons=\\{{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      toastOptions=\\{{
        classNames: {
          toast: 'cn-toast',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
`],
  ["frontend/react/web-base/src/components/ui/skeleton.tsx.hbs", `import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-muted rounded-none animate-pulse", className)}
      {...props}
    />
  );
}

export { Skeleton };
`],
  ["frontend/react/web-base/src/components/ui/card.tsx.hbs", `import * as React from 'react'

import { cn } from '@/lib/utils'

function Card({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<'div'> & { size?: 'default' | 'sm' }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        'ring-foreground/10 bg-card text-card-foreground gap-4 overflow-hidden rounded-none py-4 text-xs/relaxed ring-1 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-2 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-none *:[img:last-child]:rounded-none group/card flex flex-col',
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'gap-1 rounded-none px-4 group-data-[size=sm]/card:px-3 [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3 group/card-header @container/card-header grid auto-rows-min items-start has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]',
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        'text-sm font-medium group-data-[size=sm]/card:text-sm',
        className,
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-xs/relaxed', className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-4 group-data-[size=sm]/card:px-3', className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        'rounded-none border-t p-4 group-data-[size=sm]/card:p-3 flex items-center',
        className,
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
`],
  ["frontend/react/web-base/src/components/ui/checkbox.tsx.hbs", `import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'

import { CheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'border-input dark:bg-input/30 data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary data-checked:border-primary aria-invalid:aria-checked:border-primary aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 flex size-4 items-center justify-center rounded-none border transition-colors group-has-disabled/field:opacity-50 focus-visible:ring-1 aria-invalid:ring-1 peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="[&>svg]:size-3.5 grid place-content-center text-current transition-none"
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
`],
  ["frontend/react/web-base/src/components/ui/label.tsx.hbs", `'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

function Label({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      data-slot="label"
      className={cn(
        'gap-2 text-xs leading-none group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  )
}

export { Label }
`],
  ["frontend/react/web-base/src/components/ui/button.tsx.hbs", `import { Button as ButtonPrimitive } from '@base-ui/react/button'
import {  cva } from 'class-variance-authority'
import type {VariantProps} from 'class-variance-authority';

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-none border border-transparent bg-clip-padding text-xs font-medium focus-visible:ring-1 aria-invalid:ring-1 [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a]:hover:bg-primary/80',
        outline:
          'border-border bg-background hover:bg-muted hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 aria-expanded:bg-muted aria-expanded:text-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
        ghost:
          'hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground',
        destructive:
          'bg-destructive/10 hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/20 text-destructive focus-visible:border-destructive/40 dark:hover:bg-destructive/30',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default:
          'h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        xs: "h-6 gap-1 rounded-none px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-none px-2.5 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
        icon: 'size-8',
        'icon-xs': "size-6 rounded-none [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-7 rounded-none',
        'icon-lg': 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
`],
  ["frontend/react/web-base/src/components/ui/input.tsx.hbs", `import * as React from 'react'
import { Input as InputPrimitive } from '@base-ui/react/input'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        'dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 h-8 rounded-none border bg-transparent px-2.5 py-1 text-xs transition-colors file:h-6 file:text-xs file:font-medium focus-visible:ring-1 aria-invalid:ring-1 md:text-xs file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
`],
  ["frontend/react/web-base/src/components/ui/dropdown-menu.tsx.hbs", `import * as React from 'react'
import { Menu as MenuPrimitive } from '@base-ui/react/menu'

import { CheckIcon, ChevronRightIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuContent({
  align = 'start',
  alignOffset = 0,
  side = 'bottom',
  sideOffset = 4,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset'
  >) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            'data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 bg-popover text-popover-foreground min-w-32 rounded-none shadow-md ring-1 duration-100 z-50 max-h-(--available-height) w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto outline-none data-closed:overflow-hidden',
            className,
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        'text-muted-foreground px-2 py-2 text-xs data-[inset]:pl-8',
        className,
      )}
      {...props}
    />
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean
  variant?: 'default' | 'destructive'
}) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive not-data-[variant=destructive]:focus:**:text-accent-foreground gap-2 rounded-none px-2 py-2 text-xs [&_svg:not([class*='size-'])]:size-4 group/dropdown-menu-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  )
}

function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground gap-2 rounded-none px-2 py-2 text-xs [&_svg:not([class*='size-'])]:size-4 flex cursor-default items-center outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </MenuPrimitive.SubmenuTrigger>
  )
}

function DropdownMenuSubContent({
  align = 'start',
  alignOffset = -3,
  side = 'right',
  sideOffset = 0,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        'data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 bg-popover text-popover-foreground min-w-[96px] rounded-none shadow-lg ring-1 duration-100 w-auto',
        className,
      )}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: MenuPrimitive.CheckboxItem.Props) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground gap-2 rounded-none py-2 pr-8 pl-2 text-xs [&_svg:not([class*='size-'])]:size-4 relative flex cursor-default items-center outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center pointer-events-none"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: MenuPrimitive.RadioItem.Props) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground gap-2 rounded-none py-2 pr-8 pl-2 text-xs [&_svg:not([class*='size-'])]:size-4 relative flex cursor-default items-center outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center pointer-events-none"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn('bg-border -mx-1 h-px', className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        'text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground ml-auto text-xs tracking-widest',
        className,
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
`],
  ["addons/pwa/apps/web/vite/pwa-assets.config.ts.hbs", `import {
  defineConfig,
  minimal2023Preset as preset,
} from "@vite-pwa/assets-generator/config";

export default defineConfig({
  headLinkOptions: {
    preset: "2023",
  },
  preset,
  images: ["public/logo.png"],
});
`],
  ["auth/better-auth/fullstack/nuxt/server/api/auth/[...all].ts.hbs", `import { auth } from "@{{projectName}}/auth";

export default defineEventHandler((event) => {
  return auth.handler(toWebRequest(event));
});
`],
  ["auth/better-auth/convex/native/bare/components/sign-in.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";

function SignIn() {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setIsLoading(true);
    setError(null);

    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onError(error) {
          setError(error.error?.message || "Failed to sign in");
          setIsLoading(false);
        },
        onSuccess() {
          setEmail("");
          setPassword("");
        },
        onFinished() {
          setIsLoading(false);
        },
      }
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.title, { color: theme.text }]}>Sign In</Text>

      {error ? (
        <View style={[styles.errorContainer, { backgroundColor: theme.notification + "20" }]}>
          <Text style={[styles.errorText, { color: theme.notification }]}>{error}</Text>
        </View>
      ) : null}

      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
        placeholder="Email"
        placeholderTextColor={theme.text}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
        placeholder="Password"
        placeholderTextColor={theme.text}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={isLoading}
        style={[styles.button, { backgroundColor: theme.primary, opacity: isLoading ? 0.5 : 1 }]}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  errorContainer: {
    marginBottom: 12,
    padding: 8,
  },
  errorText: {
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});

export { SignIn };

`],
  ["auth/better-auth/convex/native/bare/components/sign-up.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";

function SignUp() {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignUp() {
    setIsLoading(true);
    setError(null);

    await authClient.signUp.email(
      {
        name,
        email,
        password,
      },
      {
        onError(error) {
          setError(error.error?.message || "Failed to sign up");
          setIsLoading(false);
        },
        onSuccess() {
          setName("");
          setEmail("");
          setPassword("");
        },
        onFinished() {
          setIsLoading(false);
        },
      }
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>

      {error ? (
        <View style={[styles.errorContainer, { backgroundColor: theme.notification + "20" }]}>
          <Text style={[styles.errorText, { color: theme.notification }]}>{error}</Text>
        </View>
      ) : null}

      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
        placeholder="Name"
        placeholderTextColor={theme.text}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
        placeholder="Email"
        placeholderTextColor={theme.text}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
        placeholder="Password"
        placeholderTextColor={theme.text}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        onPress={handleSignUp}
        disabled={isLoading}
        style={[styles.button, { backgroundColor: theme.primary, opacity: isLoading ? 0.5 : 1 }]}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  errorContainer: {
    marginBottom: 12,
    padding: 8,
  },
  errorText: {
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});

export { SignUp };

`],
  ["payments/polar/web/react/tanstack-router/src/routes/success.tsx.hbs", `import { createFileRoute, useSearch } from "@tanstack/react-router";

export const Route = createFileRoute("/success")({
	component: SuccessPage,
	validateSearch: (search) => ({
		checkout_id: search.checkout_id as string,
	}),
});

function SuccessPage() {
	const { checkout_id } = useSearch({ from: "/success" });

	return (
		<div className="container mx-auto px-4 py-8">
			<h1>Payment Successful!</h1>
			{checkout_id && <p>Checkout ID: {checkout_id}</p>}
		</div>
	);
}
`],
  ["auth/better-auth/convex/native/base/lib/auth-client.ts.hbs", `import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { expoClient } from "@better-auth/expo/client";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { env } from "@{{projectName}}/env/native";

export const authClient = createAuthClient({
	baseURL: env.EXPO_PUBLIC_CONVEX_SITE_URL,
	plugins: [
		expoClient({
			scheme: Constants.expoConfig?.scheme as string,
			storagePrefix: Constants.expoConfig?.scheme as string,
			storage: SecureStore,
		}),
		convexClient(),
	],
});
`],
  ["api/orpc/web/svelte/src/lib/orpc.ts.hbs", `import { PUBLIC_SERVER_URL } from "$env/static/public";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryCache, QueryClient } from "@tanstack/svelte-query";
import type { AppRouterClient } from "@{{projectName}}/api/routers/index";

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error) => {
			console.error(\`Error: \${error.message}\`);
		},
	}),
});

export const link = new RPCLink({
	url: \`\${PUBLIC_SERVER_URL}/rpc\`,
	{{#if (eq auth "better-auth")}}
	fetch(url, options) {
		return fetch(url, {
			...options,
			credentials: "include",
		});
	},
	{{/if}}
});

export const client: AppRouterClient = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);
`],
  ["db/drizzle/base/src/schema/index.ts.hbs", `{{#if (eq auth "better-auth")}}
export * from "./auth";
{{/if}}
{{#if (includes examples "todo")}}
export * from "./todo";
{{/if}}
export {};`],
  ["auth/clerk/convex/web/react/tanstack-start/src/start.ts.hbs", `import { clerkMiddleware } from '@clerk/tanstack-react-start/server'
import { createStart } from '@tanstack/react-start'

export const startInstance = createStart(() => {
	return {
		requestMiddleware: [clerkMiddleware()],
	}
})`],
  ["auth/better-auth/web/nuxt/app/pages/login.vue.hbs", `<script setup lang="ts">
const { $authClient } = useNuxtApp();
import SignInForm from "~/components/SignInForm.vue";
import SignUpForm from "~/components/SignUpForm.vue";

const session = $authClient.useSession();
const showSignIn = ref(true);

watchEffect(() => {
  if (!session?.value.isPending && session?.value.data) {
    navigateTo("/dashboard", { replace: true });
  }
});
</script>

<template>
  <UContainer class="py-8">
    <div v-if="session.isPending" class="flex flex-col items-center justify-center gap-4 py-12">
      <UIcon name="i-lucide-loader-2" class="animate-spin text-4xl text-primary" />
      <span class="text-muted">Loading...</span>
    </div>
    <div v-else-if="!session.data">
      <SignInForm v-if="showSignIn" @switch-to-sign-up="showSignIn = false" />
      <SignUpForm v-else @switch-to-sign-in="showSignIn = true" />
    </div>
  </UContainer>
</template>
`],
  ["auth/better-auth/web/nuxt/app/pages/dashboard.vue.hbs", `<script setup lang="ts">
{{#if (eq api "orpc")}}
import { useQuery } from '@tanstack/vue-query'
{{/if}}

const { $authClient, $orpc } = useNuxtApp()

definePageMeta({
  middleware: ['auth']
})

const session = $authClient.useSession()

{{#if (eq payments "polar")}}
const customerState = ref<any>(null)
{{/if}}

{{#if (eq api "orpc")}}
const privateData = useQuery({
  ...$orpc.privateData.queryOptions(),
  enabled: computed(() => !!session.value?.data?.user)
})
{{/if}}

{{#if (eq payments "polar")}}
onMounted(async () => {
  if (session.value?.data) {
    const { data } = await $authClient.customer.state()
    customerState.value = data
  }
})

const hasProSubscription = computed(() => 
  customerState.value?.activeSubscriptions?.length! > 0
)
{{/if}}
</script>

<template>
  <UContainer class="py-8">
    <UPageHeader
      title="Dashboard"
      :description="session?.data?.user ? \`Welcome back, \${session.data.user.name}!\` : 'Loading...'"
    />

    <div class="mt-6 space-y-4">
      {{#if (eq api "orpc")}}
      <UCard>
        <template #header>
          <div class="font-medium">Private Data</div>
        </template>

        <USkeleton v-if="privateData.status.value === 'pending'" class="h-6 w-48" />

        <UAlert
          v-else-if="privateData.status.value === 'error'"
          color="error"
          icon="i-lucide-alert-circle"
          title="Error loading data"
          :description="privateData.error.value?.message || 'Failed to load private data'"
        />

        <div v-else-if="privateData.data.value" class="flex items-center gap-2">
          <UIcon name="i-lucide-check-circle" class="text-success" />
          <span>\\{{ privateData.data.value.message }}</span>
        </div>
      </UCard>
      {{/if}}

      {{#if (eq payments "polar")}}
      <UCard>
        <template #header>
          <div class="font-medium">Subscription</div>
        </template>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon :name="hasProSubscription ? 'i-lucide-crown' : 'i-lucide-user'" :class="hasProSubscription ? 'text-warning' : 'text-muted'" />
            <span>Plan: \\{{ hasProSubscription ? "Pro" : "Free" }}</span>
          </div>
          <UButton 
            v-if="hasProSubscription"
            variant="outline"
            @click="() => { $authClient.customer.portal() }"
          >
            Manage Subscription
          </UButton>
          <UButton 
            v-else
            @click="() => { $authClient.checkout({ slug: 'pro' }) }"
          >
            Upgrade to Pro
          </UButton>
        </div>
      </UCard>
      {{/if}}
    </div>
  </UContainer>
</template>
`],
  ["examples/ai/native/unistyles/app/(drawer)/ai.tsx.hbs", `{{#if (eq backend "convex")}}
import { Ionicons } from "@expo/vector-icons";
import {
  useUIMessages,
  useSmoothText,
  type UIMessage,
} from "@convex-dev/agent/react";
import { api } from "@{{projectName}}/backend/convex/_generated/api";
import { useMutation } from "convex/react";
import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Container } from "@/components/container";

function MessageContent({
  text,
  isStreaming,
  style,
}: {
  text: string;
  isStreaming: boolean;
  style: object;
}) {
  const [visibleText] = useSmoothText(text, {
    startStreaming: isStreaming,
  });
  return <Text style={style}>{visibleText}</Text>;
}

export default function AIScreen() {
  const { theme } = useUnistyles();
  const [input, setInput] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const createThread = useMutation(api.chat.createNewThread);
  const sendMessage = useMutation(api.chat.sendMessage);

  const { results: messages } = useUIMessages(
    api.chat.listMessages,
    threadId ? { threadId } : "skip",
    { initialNumItems: 50, stream: true },
  );

  const hasStreamingMessage = messages?.some(
    (m: UIMessage) => m.status === "streaming",
  );

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const onSubmit = async () => {
    const value = input.trim();
    if (!value || isLoading) return;

    setIsLoading(true);
    setInput("");

    try {
      let currentThreadId = threadId;
      if (!currentThreadId) {
        currentThreadId = await createThread();
        setThreadId(currentThreadId);
      }

      await sendMessage({ threadId: currentThreadId, prompt: value });
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>AI Chat</Text>
            <Text style={styles.headerSubtitle}>
              Chat with our AI assistant
            </Text>
          </View>

          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
          >
            {!messages || messages.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Ask me anything to get started!
                </Text>
              </View>
            ) : (
              <View style={styles.messagesWrapper}>
                {messages.map((message: UIMessage) => (
                  <View
                    key={message.key}
                    style={[
                      styles.messageContainer,
                      message.role === "user"
                        ? styles.userMessage
                        : styles.assistantMessage,
                    ]}
                  >
                    <Text style={styles.messageRole}>
                      {message.role === "user" ? "You" : "AI Assistant"}
                    </Text>
                    <MessageContent
                      text={message.text ?? ""}
                      isStreaming={message.status === "streaming"}
                      style={styles.messageContent}
                    />
                  </View>
                ))}
                {isLoading && !hasStreamingMessage && (
                  <View style={[styles.messageContainer, styles.assistantMessage]}>
                    <Text style={styles.messageRole}>AI Assistant</Text>
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color={theme.colors.primary} />
                      <Text style={styles.loadingText}>Thinking...</Text>
                    </View>
                  </View>
                )}
              </View>
            )}
          </ScrollView>

          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Type your message..."
                placeholderTextColor={theme.colors.border}
                style={styles.textInput}
                onSubmitEditing={(e) => {
                  e.preventDefault();
                  onSubmit();
                }}
                editable={!isLoading}
                autoFocus={true}
              />
              <TouchableOpacity
                onPress={onSubmit}
                disabled={!input.trim() || isLoading}
                style={[
                  styles.sendButton,
                  (!input.trim() || isLoading) && styles.sendButtonDisabled,
                ]}
              >
                <Ionicons
                  name="send"
                  size={20}
                  color={
                    input.trim() && !isLoading
                      ? theme.colors.background
                      : theme.colors.border
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.typography,
    marginBottom: theme.spacing.sm,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.typography,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: theme.colors.typography,
    fontSize: 18,
  },
  messagesWrapper: {
    gap: theme.spacing.md,
  },
  messageContainer: {
    padding: theme.spacing.md,
    borderRadius: 8,
  },
  userMessage: {
    backgroundColor: theme.colors.primary + "20",
    marginLeft: theme.spacing.xl,
    alignSelf: "flex-end",
  },
  assistantMessage: {
    backgroundColor: theme.colors.background,
    marginRight: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  messageRole: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: theme.spacing.sm,
    color: theme.colors.typography,
  },
  messageContent: {
    color: theme.colors.typography,
    lineHeight: 20,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  loadingText: {
    color: theme.colors.typography,
    opacity: 0.7,
  },
  inputSection: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: theme.spacing.sm,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    color: theme.colors.typography,
    backgroundColor: theme.colors.background,
    fontSize: 16,
    minHeight: 40,
    maxHeight: 120,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.sm,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
}));
{{else}}
import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { fetch as expoFetch } from "expo/fetch";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Container } from "@/components/container";
import { env } from "@{{projectName}}/env/native";

const generateAPIUrl = (relativePath: string) => {
  const serverUrl = env.EXPO_PUBLIC_SERVER_URL;
  if (!serverUrl) {
    throw new Error(
      "EXPO_PUBLIC_SERVER_URL environment variable is not defined"
    );
  }
  const path = relativePath.startsWith("/") ? relativePath : \`/\${relativePath}\`;
  return serverUrl.concat(path);
};

export default function AIScreen() {
  const { theme } = useUnistyles();
  const [input, setInput] = useState("");
  const { messages, error, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: generateAPIUrl("/ai"),
    }),
    onError: (error) => console.error(error, "AI Chat Error"),
  });

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const onSubmit = () => {
    const value = input.trim();
    if (value) {
      sendMessage({ text: value });
      setInput("");
    }
  };

  if (error) {
    return (
      <Container>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error.message}</Text>
          <Text style={styles.errorSubtext}>
            Please check your connection and try again.
          </Text>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>AI Chat</Text>
            <Text style={styles.headerSubtitle}>
              Chat with our AI assistant
            </Text>
          </View>

          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
          >
            {messages.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Ask me anything to get started!
                </Text>
              </View>
            ) : (
              <View style={styles.messagesWrapper}>
                {messages.map((message) => (
                  <View
                    key={message.id}
                    style={[
                      styles.messageContainer,
                      message.role === "user"
                        ? styles.userMessage
                        : styles.assistantMessage,
                    ]}
                  >
                    <Text style={styles.messageRole}>
                      {message.role === "user" ? "You" : "AI Assistant"}
                    </Text>
                    <View style={styles.messageContentWrapper}>
                      {message.parts.map((part, i) => {
                        if (part.type === "text") {
                          return (
                            <Text
                              key={\`\${message.id}-\${i}\`}
                              style={styles.messageContent}
                            >
                              {part.text}
                            </Text>
                          );
                        }
                        return (
                          <Text
                            key={\`\${message.id}-\${i}\`}
                            style={styles.messageContent}
                          >
                            {JSON.stringify(part)}
                          </Text>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Type your message..."
                placeholderTextColor={theme.colors.border}
                style={styles.textInput}
                onSubmitEditing={(e) => {
                  e.preventDefault();
                  onSubmit();
                }}
                autoFocus={true}
              />
              <TouchableOpacity
                onPress={onSubmit}
                disabled={!input.trim()}
                style={[
                  styles.sendButton,
                  !input.trim() && styles.sendButtonDisabled,
                ]}
              >
                <Ionicons
                  name="send"
                  size={20}
                  color={
                    input.trim()
                      ? theme.colors.background
                      : theme.colors.border
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.destructive,
    textAlign: "center",
    fontSize: 18,
    marginBottom: theme.spacing.md,
  },
  errorSubtext: {
    color: theme.colors.typography,
    textAlign: "center",
    fontSize: 16,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.typography,
    marginBottom: theme.spacing.sm,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.typography,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: theme.colors.typography,
    fontSize: 18,
  },
  messagesWrapper: {
    gap: theme.spacing.md,
  },
  messageContainer: {
    padding: theme.spacing.md,
    borderRadius: 8,
  },
  userMessage: {
    backgroundColor: theme.colors.primary + "20",
    marginLeft: theme.spacing.xl,
    alignSelf: "flex-end",
  },
  assistantMessage: {
    backgroundColor: theme.colors.background,
    marginRight: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  messageRole: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: theme.spacing.sm,
    color: theme.colors.typography,
  },
  messageContentWrapper: {
    gap: theme.spacing.xs,
  },
  messageContent: {
    color: theme.colors.typography,
    lineHeight: 20,
  },
  inputSection: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: theme.spacing.sm,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    color: theme.colors.typography,
    backgroundColor: theme.colors.background,
    fontSize: 16,
    minHeight: 40,
    maxHeight: 120,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.sm,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
}));
{{/if}}
`],
  ["api/orpc/fullstack/tanstack-start/src/routes/api/rpc/$.ts.hbs", `import { createContext } from "@{{projectName}}/api/context";
import { appRouter } from "@{{projectName}}/api/routers/index";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { RPCHandler } from "@orpc/server/fetch";
import { onError } from "@orpc/server";
import { createFileRoute } from "@tanstack/react-router";

const rpcHandler = new RPCHandler(appRouter, {
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

const apiHandler = new OpenAPIHandler(appRouter, {
	plugins: [
		new OpenAPIReferencePlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
		}),
	],
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

async function handle({ request }: { request: Request }) {
	const rpcResult = await rpcHandler.handle(request, {
		prefix: "/api/rpc",
		context: await createContext({ req: request }),
	});
	if (rpcResult.response) return rpcResult.response;

	const apiResult = await apiHandler.handle(request, {
		prefix: "/api/rpc/api-reference",
		context: await createContext({ req: request }),
	});
	if (apiResult.response) return apiResult.response;

	return new Response("Not found", { status: 404 });
}

export const Route = createFileRoute('/api/rpc/$')({
  server: {
    handlers: {
      HEAD: handle,
      GET: handle,
      POST: handle,
      PUT: handle,
      PATCH: handle,
      DELETE: handle,
    },
  },
})`],
  ["examples/ai/convex/packages/backend/convex/chat.ts.hbs", `import {
  createThread,
  listUIMessages,
  saveMessage,
  syncStreams,
  vStreamArgs,
} from "@convex-dev/agent";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import { components, internal } from "./_generated/api";
import { internalAction, mutation, query } from "./_generated/server";
import { chatAgent } from "./agent";

export const createNewThread = mutation({
  args: {},
  handler: async (ctx) => {
    const threadId = await createThread(ctx, components.agent, {});
    return threadId;
  },
});

export const listMessages = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
    streamArgs: vStreamArgs,
  },
  handler: async (ctx, args) => {
    const paginated = await listUIMessages(ctx, components.agent, args);
    const streams = await syncStreams(ctx, components.agent, args);
    return { ...paginated, streams };
  },
});

export const sendMessage = mutation({
  args: {
    threadId: v.string(),
    prompt: v.string(),
  },
  handler: async (ctx, { threadId, prompt }) => {
    const { messageId } = await saveMessage(ctx, components.agent, {
      threadId,
      prompt,
    });
    await ctx.scheduler.runAfter(0, internal.chat.generateResponseAsync, {
      threadId,
      promptMessageId: messageId,
    });
    return messageId;
  },
});

export const generateResponseAsync = internalAction({
  args: {
    threadId: v.string(),
    promptMessageId: v.string(),
  },
  handler: async (ctx, { threadId, promptMessageId }) => {
    await chatAgent.streamText(
      ctx,
      { threadId },
      { promptMessageId },
      { saveStreamDeltas: true },
    );
  },
});
`],
  ["examples/ai/convex/packages/backend/convex/agent.ts.hbs", `import { Agent } from "@convex-dev/agent";
import { google } from "@ai-sdk/google";
import { components } from "./_generated/api";

export const chatAgent = new Agent(components.agent, {
  name: "Chat Agent",
  languageModel: google("gemini-2.5-flash"),
  instructions: "You are a helpful AI assistant. Be concise and friendly in your responses.",
});
`],
  ["api/orpc/web/nuxt/app/plugins/vue-query.ts.hbs", `import type {
  DehydratedState,
  VueQueryPluginOptions,
} from '@tanstack/vue-query'
import {
  dehydrate,
  hydrate,
  QueryCache,
  QueryClient,
  VueQueryPlugin,
} from '@tanstack/vue-query'

export default defineNuxtPlugin((nuxt) => {
  const vueQueryState = useState<DehydratedState | null>('vue-query')

  const toast = useToast()

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        console.log(error)
        toast.add({
          title: 'Error',
          description: error?.message || 'An unexpected error occurred.',
        })
      },
    }),
  })
  const options: VueQueryPluginOptions = { queryClient }

  nuxt.vueApp.use(VueQueryPlugin, options)

  if (import.meta.server) {
    nuxt.hooks.hook('app:rendered', () => {
      vueQueryState.value = dehydrate(queryClient)
    })
  }

  if (import.meta.client) {
    nuxt.hooks.hook('app:created', () => {
      hydrate(queryClient, vueQueryState.value)
    })
  }
})
`],
  ["api/orpc/web/nuxt/app/plugins/orpc.ts.hbs", `import { defineNuxtPlugin } from '#app'
import type { AppRouterClient } from "@{{projectName}}/api/routers/index";
import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const rpcUrl = \`\${config.public.serverUrl}/rpc\`;

  const rpcLink = new RPCLink({
    url: rpcUrl,
    {{#if (eq auth "better-auth")}}
    fetch(url, options) {
        return fetch(url, {
        ...options,
        credentials: "include",
        });
    },
    {{/if}}
  })


  const client: AppRouterClient = createORPCClient(rpcLink)
  const orpcUtils = createTanstackQueryUtils(client)

  return {
    provide: {
      orpc: orpcUtils
    }
  }
})
`],
  ["auth/better-auth/web/nuxt/app/components/UserMenu.vue.hbs", `<script setup lang="ts">

const {$authClient} = useNuxtApp()
const session = $authClient.useSession()
const toast = useToast()

const handleSignOut = async () => {
  try {
    await $authClient.signOut({
      fetchOptions: {
        onSuccess: async () => {
          toast.add({ title: 'Signed out successfully' })
          await navigateTo('/', { replace: true, external: true })
        },
        onError: (error) => {
           toast.add({ title: 'Sign out failed', description: error?.error?.message || 'Unknown error'})
        }
      },
    })
  } catch (error: any) {
     toast.add({ title: 'An unexpected error occurred during sign out', description: error.message || 'Please try again.'})
  }
}
</script>

<template>
  <div>
    <USkeleton v-if="session.isPending" class="h-9 w-24" />

    <UButton v-else-if="!session.data" variant="outline" to="/login">
      Sign In
    </UButton>

    <UButton
      v-else
      variant="solid"
      icon="i-lucide-log-out"
      label="Sign out"
      @click="handleSignOut()"
    />
  </div>
</template>
`],
  ["auth/better-auth/web/nuxt/app/components/SignUpForm.vue.hbs", `<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

const { $authClient } = useNuxtApp()

const emit = defineEmits(['switchToSignIn'])

const toast = useToast()
const loading = ref(false)

const fields: AuthFormField[] = [
  {
    name: 'name',
    type: 'text',
    label: 'Name',
    placeholder: 'Enter your name',
    required: true
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    required: true
  }
]

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type Schema = z.output<typeof schema>

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    await $authClient.signUp.email(
      {
        name: event.data.name,
        email: event.data.email,
        password: event.data.password,
      },
      {
        onSuccess: () => {
          toast.add({ title: 'Sign up successful' })
          navigateTo('/dashboard', { replace: true })
        },
        onError: (error) => {
          toast.add({ title: 'Sign up failed', description: error.error.message })
        },
      },
    )
  } catch (error: any) {
    toast.add({ title: 'An unexpected error occurred', description: error.message || 'Please try again.' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        :fields="fields"
        title="Create Account"
        icon="i-lucide-user-plus"
        :submit="{ label: 'Sign Up', loading }"
        @submit="onSubmit"
      >
        <template #description>
          Already have an account?
          <ULink class="text-primary font-medium" @click="$emit('switchToSignIn')">
            Sign In
          </ULink>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
`],
  ["auth/better-auth/web/nuxt/app/components/SignInForm.vue.hbs", `<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

const { $authClient } = useNuxtApp()

const emit = defineEmits(['switchToSignUp'])

const toast = useToast()
const loading = ref(false)

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    required: true
  }
]

const schema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type Schema = z.output<typeof schema>

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    await $authClient.signIn.email(
      {
        email: event.data.email,
        password: event.data.password,
      },
      {
        onSuccess: () => {
          toast.add({ title: 'Sign in successful' })
          navigateTo('/dashboard', { replace: true })
        },
        onError: (error) => {
          toast.add({ title: 'Sign in failed', description: error.error.message })
        },
      },
    )
  } catch (error: any) {
    toast.add({ title: 'An unexpected error occurred', description: error.message || 'Please try again.' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        :fields="fields"
        title="Welcome Back"
        icon="i-lucide-log-in"
        :submit="{ label: 'Sign In', loading }"
        @submit="onSubmit"
      >
        <template #description>
          Need an account?
          <ULink class="text-primary font-medium" @click="$emit('switchToSignUp')">
            Sign Up
          </ULink>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
`],
  ["examples/ai/web/react/next/src/app/ai/page.tsx.hbs", `{{#if (eq backend "convex")}}
"use client";

import { api } from "@{{projectName}}/backend/convex/_generated/api";
import {
  useUIMessages,
  useSmoothText,
  type UIMessage,
} from "@convex-dev/agent/react";
import { useMutation } from "convex/react";
import { Send, Loader2 } from "lucide-react";
{{#if (eq webDeploy "cloudflare")}}
import dynamic from "next/dynamic";

const Streamdown = dynamic(
  () => import("streamdown").then((mod) => ({ default: mod.Streamdown })),
  {
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground">Loading response...</div>
      </div>
    ),
    ssr: false,
  }
);
{{else}}
import { Streamdown } from "streamdown";
{{/if}}
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function MessageContent({
  text,
  isStreaming,
}: {
  text: string;
  isStreaming: boolean;
}) {
  const [visibleText] = useSmoothText(text, {
    startStreaming: isStreaming,
  });
  return <Streamdown>{visibleText}</Streamdown>;
}

export default function AIPage() {
  const [input, setInput] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const createThread = useMutation(api.chat.createNewThread);
  const sendMessage = useMutation(api.chat.sendMessage);

  const { results: messages } = useUIMessages(
    api.chat.listMessages,
    threadId ? { threadId } : "skip",
    { initialNumItems: 50, stream: true },
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const hasStreamingMessage = messages?.some(
    (m: UIMessage) => m.status === "streaming",
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    setIsLoading(true);
    setInput("");

    try {
      let currentThreadId = threadId;
      if (!currentThreadId) {
        currentThreadId = await createThread();
        setThreadId(currentThreadId);
      }

      await sendMessage({ threadId: currentThreadId, prompt: text });
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[1fr_auto] overflow-hidden w-full mx-auto p-4">
      <div className="overflow-y-auto space-y-4 pb-4">
        {!messages || messages.length === 0 ? (
          <div className="text-center text-muted-foreground mt-8">
            Ask me anything to get started!
          </div>
        ) : (
          messages.map((message: UIMessage) => (
            <div
              key={message.key}
              className={\`p-3 rounded-lg \${
                message.role === "user"
                  ? "bg-primary/10 ml-8"
                  : "bg-secondary/20 mr-8"
              }\`}
            >
              <p className="text-sm font-semibold mb-1">
                {message.role === "user" ? "You" : "AI Assistant"}
              </p>
              <MessageContent
                text={message.text ?? ""}
                isStreaming={message.status === "streaming"}
              />
            </div>
          ))
        )}
        {isLoading && !hasStreamingMessage && (
          <div className="p-3 rounded-lg bg-secondary/20 mr-8">
            <p className="text-sm font-semibold mb-1">AI Assistant</p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full flex items-center space-x-2 pt-2 border-t"
      >
        <Input
          name="prompt"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          autoComplete="off"
          autoFocus
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </Button>
      </form>
    </div>
  );
}
{{else}}
"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Send } from "lucide-react";
{{#if (eq webDeploy "cloudflare")}}
import dynamic from "next/dynamic";

const Streamdown = dynamic(
  () => import("streamdown").then((mod) => ({ default: mod.Streamdown })),
  {
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground">Loading response...</div>
      </div>
    ),
    ssr: false,
  }
);
{{else}}
import { Streamdown } from "streamdown";
{{/if}}
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { env } from "@{{projectName}}/env/web";

export default function AIPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: {{#if (eq backend "self")}}"/api/ai"{{else}}\`\${env.NEXT_PUBLIC_SERVER_URL}/ai\`{{/if}},
    }),
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    sendMessage({ text });
    setInput("");
  };

  return (
    <div className="grid grid-rows-[1fr_auto] overflow-hidden w-full mx-auto p-4">
      <div className="overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground mt-8">
            Ask me anything to get started!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={\`p-3 rounded-lg \${
                message.role === "user"
                  ? "bg-primary/10 ml-8"
                  : "bg-secondary/20 mr-8"
              }\`}
            >
              <p className="text-sm font-semibold mb-1">
                {message.role === "user" ? "You" : "AI Assistant"}
              </p>
              {message.parts?.map((part, index) => {
                if (part.type === "text") {
                  return (
                    <Streamdown
                      key={index}
                      isAnimating={status === "streaming" && message.role === "assistant"}
                    >
                      {part.text}
                    </Streamdown>
                  );
                }
                return null;
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full flex items-center space-x-2 pt-2 border-t"
      >
        <Input
          name="prompt"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          autoComplete="off"
          autoFocus
        />
        <Button type="submit" size="icon">
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
}
{{/if}}
`],
  ["auth/better-auth/web/nuxt/app/plugins/auth-client.ts.hbs", `import { createAuthClient } from "better-auth/vue";
{{#if (eq payments "polar")}}
import { polarClient } from "@polar-sh/better-auth";
{{/if}}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const authClient = createAuthClient({
    baseURL: config.public.serverUrl,
    {{#if (eq payments "polar")}}
    plugins: [polarClient()],
    {{/if}}
  });

  return {
    provide: {
      authClient: authClient,
    },
  };
});
`],
  ["examples/todo/web/solid/src/routes/todos.tsx.hbs", `import { createFileRoute } from "@tanstack/solid-router";
import { Loader2, Trash2 } from "lucide-solid";
import { createSignal, For, Show } from "solid-js";
import { orpc } from "@/utils/orpc";
import { useQuery, useMutation } from "@tanstack/solid-query";

export const Route = createFileRoute("/todos")({
  component: TodosRoute,
});

function TodosRoute() {
  const [newTodoText, setNewTodoText] = createSignal("");

  const todos = useQuery(() => orpc.todo.getAll.queryOptions());

  const createMutation = useMutation(() =>
    orpc.todo.create.mutationOptions({
      onSuccess: () => {
        todos.refetch();
        setNewTodoText("");
      },
    }),
  );

  const toggleMutation = useMutation(() =>
    orpc.todo.toggle.mutationOptions({
      onSuccess: () => { todos.refetch() },
    }),
  );

  const deleteMutation = useMutation(() =>
    orpc.todo.delete.mutationOptions({
      onSuccess: () => { todos.refetch() },
    }),
  );

  const handleAddTodo = (e: Event) => {
    e.preventDefault();
    if (newTodoText().trim()) {
      createMutation.mutate({ text: newTodoText() });
    }
  };

  const handleToggleTodo = (id: number, completed: boolean) => {
    toggleMutation.mutate({ id, completed: !completed });
  };

  const handleDeleteTodo = (id: number) => {
    deleteMutation.mutate({ id });
  };

  return (
    <div class="mx-auto w-full max-w-md py-10">
      <div class="rounded-lg border p-6 shadow-sm">
        <div class="mb-4">
          <h2 class="text-xl font-semibold">Todo List</h2>
          <p class="text-sm">Manage your tasks efficiently</p>
        </div>
        <div>
          <form
            onSubmit={handleAddTodo}
            class="mb-6 flex items-center space-x-2"
          >
            <input
              type="text"
              value={newTodoText()}
              onInput={(e) => setNewTodoText(e.currentTarget.value)}
              placeholder="Add a new task..."
              disabled={createMutation.isPending}
              class="w-full rounded-md border p-2 text-sm"
            />
            <button
              type="submit"
              disabled={createMutation.isPending || !newTodoText().trim()}
              class="rounded-md bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              <Show when={createMutation.isPending} fallback="Add">
                <Loader2 class="h-4 w-4 animate-spin" />
              </Show>
            </button>
          </form>

          <Show when={todos.isLoading}>
            <div class="flex justify-center py-4">
              <Loader2 class="h-6 w-6 animate-spin" />
            </div>
          </Show>

          <Show when={!todos.isLoading && todos.data?.length === 0}>
            <p class="py-4 text-center">No todos yet. Add one above!</p>
          </Show>

          <Show when={!todos.isLoading}>
            <ul class="space-y-2">
              <For each={todos.data}>
                {(todo) => (
                  <li class="flex items-center justify-between rounded-md border p-2">
                    <div class="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() =>
                          handleToggleTodo(todo.id, todo.completed)
                        }
                        id={\`todo-\${todo.id}\`}
                        class="h-4 w-4"
                      />
                      <label
                        for={\`todo-\${todo.id}\`}
                        class={todo.completed ? "line-through" : ""}
                      >
                        {todo.text}
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteTodo(todo.id)}
                      aria-label="Delete todo"
                      class="ml-2 rounded-md p-1"
                    >
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </li>
                )}
              </For>
            </ul>
          </Show>
        </div>
      </div>
    </div>
  );
}
`],
  ["auth/better-auth/web/nuxt/app/middleware/auth.ts.hbs", `export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) return;

  const { $authClient } = useNuxtApp();
  const session = $authClient.useSession();

  if (session.value.isPending) {
    return;
  }

  if (!session.value.data) {
    return navigateTo("/login");
  }
});
`],
  ["auth/better-auth/server/db/mongoose/mongodb/src/models/auth.model.ts.hbs", `import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        _id: { type: String },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        emailVerified: { type: Boolean, required: true },
        image: { type: String },
        createdAt: { type: Date, required: true },
        updatedAt: { type: Date, required: true },
    },
    { collection: 'user' }
);

const sessionSchema = new Schema(
    {
        _id: { type: String },
        expiresAt: { type: Date, required: true },
        token: { type: String, required: true, unique: true },
        createdAt: { type: Date, required: true },
        updatedAt: { type: Date, required: true },
        ipAddress: { type: String },
        userAgent: { type: String },
        userId: { type: String, ref: 'User', required: true },
    },
    { collection: 'session' }
);

const accountSchema = new Schema(
    {
        _id: { type: String },
        accountId: { type: String, required: true },
        providerId: { type: String, required: true },
        userId: { type: String, ref: 'User', required: true },
        accessToken: { type: String },
        refreshToken: { type: String },
        idToken: { type: String },
        accessTokenExpiresAt: { type: Date },
        refreshTokenExpiresAt: { type: Date },
        scope: { type: String },
        password: { type: String },
        createdAt: { type: Date, required: true },
        updatedAt: { type: Date, required: true },
    },
    { collection: 'account' }
);

const verificationSchema = new Schema(
    {
        _id: { type: String },
        identifier: { type: String, required: true },
        value: { type: String, required: true },
        expiresAt: { type: Date, required: true },
        createdAt: { type: Date },
        updatedAt: { type: Date },
    },
    { collection: 'verification' }
);

const User = model('User', userSchema);
const Session = model('Session', sessionSchema);
const Account = model('Account', accountSchema);
const Verification = model('Verification', verificationSchema);

export { User, Session, Account, Verification };
`],
  ["auth/better-auth/server/db/prisma/postgres/prisma/schema/auth.prisma.hbs", `model User {
  id            String    @id
  name          String
  email         String
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]

  @@unique([email])
  @@map("user")
}

model Session {
  id        String   @id
  expiresAt DateTime
  token     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([token])
  @@index([userId])
  @@map("session")
}

model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([userId])
  @@map("account")
}

model Verification {
  id         String   @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([identifier])
  @@map("verification")
}
`],
  ["auth/clerk/convex/web/react/tanstack-start/src/routes/dashboard.tsx.hbs", `import { SignInButton, UserButton, useUser } from "@clerk/tanstack-react-start";
import { api } from "@{{projectName}}/backend/convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import {
	Authenticated,
	AuthLoading,
	Unauthenticated,
	useQuery,
} from "convex/react";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const privateData = useQuery(api.privateData.get);
	const user = useUser();

	return (
		<>
			<Authenticated>
				<div>
					<h1>Dashboard</h1>
					<p>Welcome {user.user?.fullName}</p>
					<p>privateData: {privateData?.message}</p>
					<UserButton />
				</div>
			</Authenticated>
			<Unauthenticated>
				<SignInButton />
			</Unauthenticated>
			<AuthLoading>
				<div>Loading...</div>
			</AuthLoading>
		</>
	);
}
`],
  ["auth/better-auth/server/db/prisma/sqlite/prisma/schema/auth.prisma.hbs", `model User {
  id            String    @id
  name          String
  email         String
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]

  @@unique([email])
  @@map("user")
}

model Session {
  id        String   @id
  expiresAt DateTime
  token     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([token])
  @@index([userId])
  @@map("session")
}

model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([userId])
  @@map("account")
}

model Verification {
  id         String   @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([identifier])
  @@map("verification")
}
`],
  ["examples/todo/server/prisma/mysql/prisma/schema/todo.prisma.hbs", `model Todo {
  id        Int     @id @default(autoincrement())
  text      String
  completed Boolean @default(false)

  @@map("todo")
}
`],
  ["auth/better-auth/server/db/prisma/mongodb/prisma/schema/auth.prisma.hbs", `model User {
  id            String    @id @map("_id")
  name          String
  email         String
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]

  @@unique([email])
  @@map("user")
}

model Session {
  id        String   @id @map("_id")
  expiresAt DateTime
  token     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([token])
  @@index([userId])
  @@map("session")
}

model Account {
  id                    String    @id @map("_id")
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([userId])
  @@map("account")
}

model Verification {
  id         String   @id @map("_id")
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([identifier])
  @@map("verification")
}
`],
  ["auth/better-auth/convex/web/react/tanstack-router/src/routes/dashboard.tsx.hbs", `import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import UserMenu from "@/components/user-menu";
import { api } from "@{{projectName}}/backend/convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useQuery,
} from "convex/react";
import { useState } from "react";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showSignIn, setShowSignIn] = useState(false);
  const privateData = useQuery(api.privateData.get);

  return (
    <>
      <Authenticated>
        <div>
          <h1>Dashboard</h1>
          <p>privateData: {privateData?.message}</p>
          <UserMenu />
        </div>
      </Authenticated>
      <Unauthenticated>
        {showSignIn ? (
          <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
        ) : (
          <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
        )}
      </Unauthenticated>
      <AuthLoading>
        <div>Loading...</div>
      </AuthLoading>
    </>
  );
}
`],
  ["auth/clerk/convex/web/react/react-router/src/routes/dashboard.tsx.hbs", `import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { api } from "@{{projectName}}/backend/convex/_generated/api";
import {
	Authenticated,
	AuthLoading,
	Unauthenticated,
	useQuery,
} from "convex/react";

export default function Dashboard() {
	const privateData = useQuery(api.privateData.get);
	const user = useUser();

	return (
		<>
			<Authenticated>
				<div>
					<h1>Dashboard</h1>
					<p>Welcome {user.user?.fullName}</p>
					<p>privateData: {privateData?.message}</p>
					<UserButton />
				</div>
			</Authenticated>
			<Unauthenticated>
				<SignInButton />
			</Unauthenticated>
			<AuthLoading>
				<div>Loading...</div>
			</AuthLoading>
		</>
	);
}
`],
  ["auth/clerk/convex/web/react/tanstack-router/src/routes/dashboard.tsx.hbs", `import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { api } from "@{{projectName}}/backend/convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import {
	Authenticated,
	AuthLoading,
	Unauthenticated,
	useQuery,
} from "convex/react";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const privateData = useQuery(api.privateData.get);
	const user = useUser()

	return (
		<>
			<Authenticated>
				<div>
					<h1>Dashboard</h1>
					<p>Welcome {user.user?.fullName}</p>
					<p>privateData: {privateData?.message}</p>
					<UserButton />
				</div>
			</Authenticated>
			<Unauthenticated>
				<SignInButton />
			</Unauthenticated>
			<AuthLoading>
				<div>Loading...</div>
			</AuthLoading>
		</>
	);
}
`],
  ["examples/todo/web/react/next/src/app/todos/page.tsx.hbs", `"use client"

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

{{#if (eq backend "convex")}}
import { useMutation, useQuery } from "convex/react";
import { api } from "@{{projectName}}/backend/convex/_generated/api";
import type { Id } from "@{{projectName}}/backend/convex/_generated/dataModel";
{{else}}
import { useMutation, useQuery } from "@tanstack/react-query";
  {{#if (eq api "orpc")}}
import { orpc } from "@/utils/orpc";
  {{/if}}
  {{#if (eq api "trpc")}}
import { trpc } from "@/utils/trpc";
  {{/if}}
{{/if}}


export default function TodosPage() {
  const [newTodoText, setNewTodoText] = useState("");

  {{#if (eq backend "convex")}}
  const todos = useQuery(api.todos.getAll);
  const createTodoMutation = useMutation(api.todos.create);
  const toggleTodoMutation = useMutation(api.todos.toggle);
  const deleteTodoMutation = useMutation(api.todos.deleteTodo);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = newTodoText.trim();
    if (!text) return;
    await createTodoMutation({ text });
    setNewTodoText("");
  };

  const handleToggleTodo = (id: Id<"todos">, currentCompleted: boolean) => {
    toggleTodoMutation({ id, completed: !currentCompleted });
  };

  const handleDeleteTodo = (id: Id<"todos">) => {
    deleteTodoMutation({ id });
  };
  {{else}}
    {{#if (eq api "orpc")}}
    const todos = useQuery(orpc.todo.getAll.queryOptions());
    const createMutation = useMutation(
      orpc.todo.create.mutationOptions({
        onSuccess: () => {
          todos.refetch();
          setNewTodoText("");
        },
      }),
    );
    const toggleMutation = useMutation(
      orpc.todo.toggle.mutationOptions({
        onSuccess: () => { todos.refetch() },
      }),
    );
    const deleteMutation = useMutation(
      orpc.todo.delete.mutationOptions({
        onSuccess: () => { todos.refetch() },
      }),
    );
    {{/if}}
    {{#if (eq api "trpc")}}
    const todos = useQuery(trpc.todo.getAll.queryOptions());
    const createMutation = useMutation(
      trpc.todo.create.mutationOptions({
        onSuccess: () => {
          todos.refetch();
          setNewTodoText("");
        },
      }),
    );
    const toggleMutation = useMutation(
      trpc.todo.toggle.mutationOptions({
        onSuccess: () => { todos.refetch() },
      }),
    );
    const deleteMutation = useMutation(
      trpc.todo.delete.mutationOptions({
        onSuccess: () => { todos.refetch() },
      }),
    );
    {{/if}}

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      createMutation.mutate({ text: newTodoText });
    }
  };

  const handleToggleTodo = (id: number, completed: boolean) => {
    toggleMutation.mutate({ id, completed: !completed });
  };

  const handleDeleteTodo = (id: number) => {
    deleteMutation.mutate({ id });
  };
  {{/if}}

  return (
    <div className="mx-auto w-full max-w-md py-10">
      <Card>
        <CardHeader>
          <CardTitle>Todo List</CardTitle>
          <CardDescription>Manage your tasks efficiently</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleAddTodo}
            className="mb-6 flex items-center space-x-2"
          >
            <Input
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Add a new task..."
              {{#if (eq backend "convex")}}
              {{else}}
              disabled={createMutation.isPending}
              {{/if}}
            />
            <Button
              type="submit"
              {{#if (eq backend "convex")}}
              disabled={!newTodoText.trim()}
              {{else}}
              disabled={createMutation.isPending || !newTodoText.trim()}
              {{/if}}
            >
              {{#if (eq backend "convex")}}
                Add
              {{else}}
                {createMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Add"
                )}
              {{/if}}
            </Button>
          </form>

          {{#if (eq backend "convex")}}
            {todos === undefined ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : todos.length === 0 ? (
              <p className="py-4 text-center">No todos yet. Add one above!</p>
            ) : (
              <ul className="space-y-2">
                {todos.map((todo) => (
                  <li
                    key={todo._id}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() =>
                          handleToggleTodo(todo._id, todo.completed)
                        }
                        id={\`todo-\${todo._id}\`}
                      />
                      <label
                        htmlFor={\`todo-\${todo._id}\`}
                        className={\`\${todo.completed ? "line-through text-muted-foreground" : ""}\`}
                      >
                        {todo.text}
                      </label>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTodo(todo._id)}
                      aria-label="Delete todo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          {{else}}
            {todos.isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : todos.data?.length === 0 ? (
              <p className="py-4 text-center">
                No todos yet. Add one above!
              </p>
            ) : (
              <ul className="space-y-2">
                {todos.data?.map((todo) => (
                  <li
                    key={todo.id}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() =>
                          handleToggleTodo(todo.id, todo.completed)
                        }
                        id={\`todo-\${todo.id}\`}
                      />
                      <label
                        htmlFor={\`todo-\${todo.id}\`}
                        className={\`\${todo.completed ? "line-through text-muted-foreground" : ""}\`}
                      >
                        {todo.text}
                      </label>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTodo(todo.id)}
                      aria-label="Delete todo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          {{/if}}
        </CardContent>
      </Card>
    </div>
  );
}
`],
  ["auth/better-auth/convex/web/react/tanstack-router/src/lib/auth-client.ts.hbs", `import { createAuthClient } from "better-auth/react";
import {
	convexClient,
	crossDomainClient,
} from "@convex-dev/better-auth/client/plugins";
import { env } from "@{{projectName}}/env/web";

export const authClient = createAuthClient({
	baseURL: env.VITE_CONVEX_SITE_URL,
	plugins: [convexClient(), crossDomainClient()],
});`],
  ["auth/better-auth/convex/web/react/tanstack-router/src/components/sign-in-form.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SignInForm({
    onSwitchToSignUp,
}: {
    onSwitchToSignUp: () => void;
}) {
    const navigate = useNavigate({
        from: "/",
    });

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        onSubmit: async ({ value }) => {
            await authClient.signIn.email(
                {
                    email: value.email,
                    password: value.password,
                },
                {
                    onSuccess: () => {
                        navigate({
                            to: "/dashboard",
                        });
                        toast.success("Sign in successful");
                    },
                    onError: (error) => {
                        toast.error(error.error.message || error.error.statusText);
                    },
                },
            );
        },
        validators: {
            onSubmit: z.object({
                email: z.email("Invalid email address"),
                password: z.string().min(8, "Password must be at least 8 characters"),
            }),
        },
    });

    return (
        <div className="mx-auto w-full mt-10 max-w-md p-6">
            <h1 className="mb-6 text-center text-3xl font-bold">Welcome Back</h1>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className="space-y-4"
            >
                <div>
                    <form.Field name="email">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor={field.name}>Email</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type="email"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                {field.state.meta.errors.map((error) => (
                                    <p key={error?.message} className="text-red-500">
                                        {error?.message}
                                    </p>
                                ))}
                            </div>
                        )}
                    </form.Field>
                </div>

                <div>
                    <form.Field name="password">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor={field.name}>Password</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type="password"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                {field.state.meta.errors.map((error) => (
                                    <p key={error?.message} className="text-red-500">
                                        {error?.message}
                                    </p>
                                ))}
                            </div>
                        )}
                    </form.Field>
                </div>

                <form.Subscribe>
                    {(state) => (
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={!state.canSubmit || state.isSubmitting}
                        >
                            {state.isSubmitting ? "Submitting..." : "Sign In"}
                        </Button>
                    )}
                </form.Subscribe>
            </form>

            <div className="mt-4 text-center">
                <Button
                    variant="link"
                    onClick={onSwitchToSignUp}
                    className="text-indigo-600 hover:text-indigo-800"
                >
                    Need an account? Sign Up
                </Button>
            </div>
        </div>
    );
}
`],
  ["auth/better-auth/convex/web/react/tanstack-router/src/components/sign-up-form.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SignUpForm({
    onSwitchToSignIn,
}: {
    onSwitchToSignIn: () => void;
}) {
    const navigate = useNavigate({
        from: "/",
    });

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
            name: "",
        },
        onSubmit: async ({ value }) => {
            await authClient.signUp.email(
                {
                    email: value.email,
                    password: value.password,
                    name: value.name,
                },
                {
                    onSuccess: () => {
                        navigate({
                            to: "/dashboard",
                        });
                        toast.success("Sign up successful");
                    },
                    onError: (error) => {
                        toast.error(error.error.message || error.error.statusText);
                    },
                },
            );
        },
        validators: {
            onSubmit: z.object({
                name: z.string().min(2, "Name must be at least 2 characters"),
                email: z.email("Invalid email address"),
                password: z.string().min(8, "Password must be at least 8 characters"),
            }),
        },
    });

    return (
        <div className="mx-auto w-full mt-10 max-w-md p-6">
            <h1 className="mb-6 text-center text-3xl font-bold">Create Account</h1>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className="space-y-4"
            >
                <div>
                    <form.Field name="name">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor={field.name}>Name</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                {field.state.meta.errors.map((error) => (
                                    <p key={error?.message} className="text-red-500">
                                        {error?.message}
                                    </p>
                                ))}
                            </div>
                        )}
                    </form.Field>
                </div>

                <div>
                    <form.Field name="email">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor={field.name}>Email</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type="email"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                {field.state.meta.errors.map((error) => (
                                    <p key={error?.message} className="text-red-500">
                                        {error?.message}
                                    </p>
                                ))}
                            </div>
                        )}
                    </form.Field>
                </div>

                <div>
                    <form.Field name="password">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor={field.name}>Password</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type="password"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                {field.state.meta.errors.map((error) => (
                                    <p key={error?.message} className="text-red-500">
                                        {error?.message}
                                    </p>
                                ))}
                            </div>
                        )}
                    </form.Field>
                </div>

                <form.Subscribe>
                    {(state) => (
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={!state.canSubmit || state.isSubmitting}
                        >
                            {state.isSubmitting ? "Submitting..." : "Sign Up"}
                        </Button>
                    )}
                </form.Subscribe>
            </form>

            <div className="mt-4 text-center">
                <Button
                    variant="link"
                    onClick={onSwitchToSignIn}
                    className="text-indigo-600 hover:text-indigo-800"
                >
                    Already have an account? Sign In
                </Button>
            </div>
        </div>
    );
}
`],
  ["auth/better-auth/convex/web/react/tanstack-router/src/components/user-menu.tsx.hbs", `import { useNavigate } from "@tanstack/react-router";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "convex/react";
import { api } from "@{{projectName}}/backend/convex/_generated/api";

import { Button } from "./ui/button";

export default function UserMenu() {
    const navigate = useNavigate();
    const user = useQuery(api.auth.getCurrentUser)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
                {user?.name}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>{user?.email}</DropdownMenuItem>
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => {
                            authClient.signOut({
                                fetchOptions: {
                                    onSuccess: () => {
                                        navigate({
                                            to: "/dashboard",
                                        });
                                    },
                                },
                            });
                        }}
                    >
                        Sign Out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
`],
  ["auth/better-auth/convex/web/react/tanstack-start/src/routes/dashboard.tsx.hbs", `import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import UserMenu from "@/components/user-menu";
import { api } from "@{{projectName}}/backend/convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useQuery,
} from "convex/react";
import { useState } from "react";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showSignIn, setShowSignIn] = useState(false);
  const privateData = useQuery(api.privateData.get);

  return (
    <>
      <Authenticated>
        <div>
          <h1>Dashboard</h1>
          <p>privateData: {privateData?.message}</p>
          <UserMenu />
        </div>
      </Authenticated>
      <Unauthenticated>
        {showSignIn ? (
          <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
        ) : (
          <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
        )}
      </Unauthenticated>
      <AuthLoading>
        <div>Loading...</div>
      </AuthLoading>
    </>
  );
}
`],
  ["auth/better-auth/server/db/drizzle/postgres/src/schema/auth.ts.hbs", `import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
`],
  ["auth/clerk/convex/web/react/next/src/middleware.ts.hbs", `import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
`],
  ["addons/pwa/apps/web/next/src/app/manifest.ts.hbs", `import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "{{projectName}}",
		short_name: "{{projectName}}",
		description:
			"my pwa app",
		start_url: "/new",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#000000",
		icons: [
			{
				src: "/favicon/web-app-manifest-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/favicon/web-app-manifest-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
`],
  ["payments/polar/web/react/next/src/app/success/page.tsx.hbs", `export default async function SuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ checkout_id: string }>
}) {
    const params = await searchParams;
    const checkout_id = params.checkout_id;

    return (
        <div className="px-4 py-8">
            <h1>Payment Successful!</h1>
            {checkout_id && <p>Checkout ID: {checkout_id}</p>}
        </div>
    );
}
`],
  ["auth/better-auth/convex/web/react/tanstack-start/src/lib/auth-client.ts.hbs", `import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [convexClient()],
});`],
  ["auth/better-auth/convex/web/react/tanstack-start/src/lib/auth-server.ts.hbs", `import { convexBetterAuthReactStart } from "@convex-dev/better-auth/react-start";
import { env } from "@{{projectName}}/env/web";

export const {
	handler,
	getToken,
	fetchAuthQuery,
	fetchAuthMutation,
	fetchAuthAction,
} = convexBetterAuthReactStart({
	convexUrl: env.VITE_CONVEX_URL,
	convexSiteUrl: env.VITE_CONVEX_SITE_URL,
});
`],
  ["examples/todo/server/mongoose/base/src/routers/todo.ts.hbs", `{{#if (eq api "orpc")}}
import z from "zod";
import { publicProcedure } from "../index";
import { Todo } from "@{{projectName}}/db/models/todo.model";

export const todoRouter = {
    getAll: publicProcedure.handler(async () => {
        return await Todo.find().lean();
    }),

    create: publicProcedure
        .input(z.object({ text: z.string().min(1) }))
        .handler(async ({ input }) => {
            const newTodo = await Todo.create({ text: input.text });
            return newTodo.toObject();
    }),

    toggle: publicProcedure
        .input(z.object({ id: z.string(), completed: z.boolean() }))
        .handler(async ({ input }) => {
            await Todo.updateOne({ id: input.id }, { completed: input.completed });
            return { success: true };
    }),

    delete: publicProcedure
        .input(z.object({ id: z.string() }))
        .handler(async ({ input }) => {
            await Todo.deleteOne({ id: input.id });
            return { success: true };
    }),
};

{{/if}}

{{#if (eq api "trpc")}}
import z from "zod";
import { router, publicProcedure } from "../index";
import { Todo } from "@{{projectName}}/db/models/todo.model";

export const todoRouter = router({
    getAll: publicProcedure.query(async () => {
        return await Todo.find().lean();
    }),

    create: publicProcedure
        .input(z.object({ text: z.string().min(1) }))
        .mutation(async ({ input }) => {
            const newTodo = await Todo.create({ text: input.text });
        return newTodo.toObject();
    }),

    toggle: publicProcedure
        .input(z.object({ id: z.string(), completed: z.boolean() }))
        .mutation(async ({ input }) => {
            await Todo.updateOne({ id: input.id }, { completed: input.completed });
            return { success: true };
    }),

    delete: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input }) => {
            await Todo.deleteOne({ id: input.id });
            return { success: true };
    }),
});
{{/if}}
`],
  ["auth/better-auth/web/svelte/src/routes/login/+page.svelte.hbs", `<script lang="ts">
	import SignInForm from '../../components/SignInForm.svelte';
	import SignUpForm from '../../components/SignUpForm.svelte';

	let showSignIn = $state(true);
</script>

{#if showSignIn}
	<SignInForm switchToSignUp={() => showSignIn = false} />
{:else}
	<SignUpForm switchToSignIn={() => showSignIn = true} />
{/if}
`],
  ["auth/better-auth/convex/web/react/tanstack-start/src/components/sign-in-form.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SignInForm({
    onSwitchToSignUp,
}: {
    onSwitchToSignUp: () => void;
}) {
    const navigate = useNavigate({
        from: "/",
    });

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        onSubmit: async ({ value }) => {
            await authClient.signIn.email(
                {
                    email: value.email,
                    password: value.password,
                },
                {
                    onSuccess: () => {
                        navigate({
                            to: "/dashboard",
                        });
                        toast.success("Sign in successful");
                    },
                    onError: (error) => {
                        toast.error(error.error.message || error.error.statusText);
                    },
                },
            );
        },
        validators: {
            onSubmit: z.object({
                email: z.email("Invalid email address"),
                password: z.string().min(8, "Password must be at least 8 characters"),
            }),
        },
    });

    return (
        <div className="mx-auto w-full mt-10 max-w-md p-6">
            <h1 className="mb-6 text-center text-3xl font-bold">Welcome Back</h1>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className="space-y-4"
            >
                <div>
                    <form.Field name="email">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor={field.name}>Email</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type="email"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                {field.state.meta.errors.map((error) => (
                                    <p key={error?.message} className="text-red-500">
                                        {error?.message}
                                    </p>
                                ))}
                            </div>
                        )}
                    </form.Field>
                </div>

                <div>
                    <form.Field name="password">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor={field.name}>Password</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type="password"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                {field.state.meta.errors.map((error) => (
                                    <p key={error?.message} className="text-red-500">
                                        {error?.message}
                                    </p>
                                ))}
                            </div>
                        )}
                    </form.Field>
                </div>

                <form.Subscribe>
                    {(state) => (
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={!state.canSubmit || state.isSubmitting}
                        >
                            {state.isSubmitting ? "Submitting..." : "Sign In"}
                        </Button>
                    )}
                </form.Subscribe>
            </form>

            <div className="mt-4 text-center">
                <Button
                    variant="link"
                    onClick={onSwitchToSignUp}
                    className="text-indigo-600 hover:text-indigo-800"
                >
                    Need an account? Sign Up
                </Button>
            </div>
        </div>
    );
}
`],
  ["auth/better-auth/convex/web/react/tanstack-start/src/components/sign-up-form.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SignUpForm({
    onSwitchToSignIn,
}: {
    onSwitchToSignIn: () => void;
}) {
    const navigate = useNavigate({
        from: "/",
    });

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
            name: "",
        },
        onSubmit: async ({ value }) => {
            await authClient.signUp.email(
                {
                    email: value.email,
                    password: value.password,
                    name: value.name,
                },
                {
                    onSuccess: () => {
                        navigate({
                            to: "/dashboard",
                        });
                        toast.success("Sign up successful");
                    },
                    onError: (error) => {
                        toast.error(error.error.message || error.error.statusText);
                    },
                },
            );
        },
        validators: {
            onSubmit: z.object({
                name: z.string().min(2, "Name must be at least 2 characters"),
                email: z.email("Invalid email address"),
                password: z.string().min(8, "Password must be at least 8 characters"),
            }),
        },
    });

    return (
        <div className="mx-auto w-full mt-10 max-w-md p-6">
            <h1 className="mb-6 text-center text-3xl font-bold">Create Account</h1>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className="space-y-4"
            >
                <div>
                    <form.Field name="name">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor={field.name}>Name</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                {field.state.meta.errors.map((error) => (
                                    <p key={error?.message} className="text-red-500">
                                        {error?.message}
                                    </p>
                                ))}
                            </div>
                        )}
                    </form.Field>
                </div>

                <div>
                    <form.Field name="email">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor={field.name}>Email</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type="email"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                {field.state.meta.errors.map((error) => (
                                    <p key={error?.message} className="text-red-500">
                                        {error?.message}
                                    </p>
                                ))}
                            </div>
                        )}
                    </form.Field>
                </div>

                <div>
                    <form.Field name="password">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor={field.name}>Password</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type="password"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                {field.state.meta.errors.map((error) => (
                                    <p key={error?.message} className="text-red-500">
                                        {error?.message}
                                    </p>
                                ))}
                            </div>
                        )}
                    </form.Field>
                </div>

                <form.Subscribe>
                    {(state) => (
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={!state.canSubmit || state.isSubmitting}
                        >
                            {state.isSubmitting ? "Submitting..." : "Sign Up"}
                        </Button>
                    )}
                </form.Subscribe>
            </form>

            <div className="mt-4 text-center">
                <Button
                    variant="link"
                    onClick={onSwitchToSignIn}
                    className="text-indigo-600 hover:text-indigo-800"
                >
                    Already have an account? Sign In
                </Button>
            </div>
        </div>
    );
}
`],
  ["auth/better-auth/convex/web/react/tanstack-start/src/components/user-menu.tsx.hbs", `import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "convex/react";
import { api } from "@{{projectName}}/backend/convex/_generated/api";

import { Button } from "./ui/button";

export default function UserMenu() {
    const user = useQuery(api.auth.getCurrentUser)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
                {user?.name}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>{user?.email}</DropdownMenuItem>
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => {
                            authClient.signOut({
                                fetchOptions: {
                                    onSuccess: () => {
                                        location.reload();
                                    },
                                },
                            });
                        }}
                    >
                        Sign Out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
`],
  ["api/orpc/fullstack/next/src/app/api/rpc/[[...rest]]/route.ts.hbs", `import { createContext } from "@{{projectName}}/api/context";
import { appRouter } from "@{{projectName}}/api/routers/index";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { RPCHandler } from "@orpc/server/fetch";
import { onError } from "@orpc/server";
import { NextRequest } from "next/server";

const rpcHandler = new RPCHandler(appRouter, {
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});
const apiHandler = new OpenAPIHandler(appRouter, {
	plugins: [
		new OpenAPIReferencePlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
		}),
	],
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

async function handleRequest(req: NextRequest) {
	const rpcResult = await rpcHandler.handle(req, {
		prefix: "/api/rpc",
		context: await createContext(req),
	});
	if (rpcResult.response) return rpcResult.response;

	const apiResult = await apiHandler.handle(req, {
		prefix: "/api/rpc/api-reference",
		context: await createContext(req),
	});
	if (apiResult.response) return apiResult.response;

	return new Response("Not found", { status: 404 });
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;`],
  ["addons/pwa/apps/web/vite/public/logo.png", `[Binary file]`],
  ["api/orpc/web/solid/src/utils/orpc.ts.hbs", `import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryCache, QueryClient } from "@tanstack/solid-query";
import type { AppRouterClient } from "@{{projectName}}/api/routers/index";
import { env } from "@{{projectName}}/env/web";

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error) => {
			console.error(\`Error: \${error.message}\`);
		},
	}),
});

export const link = new RPCLink({
	url: \`\${env.VITE_SERVER_URL}/rpc\`,
{{#if (eq auth "better-auth")}}
	fetch(url, options) {
		return fetch(url, {
			...options,
			credentials: "include",
		});
	},
{{/if}}
});

export const client: AppRouterClient = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);
`],
  ["auth/better-auth/web/react/next/src/components/sign-in-form.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import z from "zod";
import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";

export default function SignInForm({
  onSwitchToSignUp,
}: {
  onSwitchToSignUp: () => void;
}) {
  const router = useRouter()
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            router.push("/dashboard")
            toast.success("Sign in successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="mx-auto w-full mt-10 max-w-md p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Welcome Back</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div>
          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe>
          {(state) => (
            <Button
              type="submit"
              className="w-full"
              disabled={!state.canSubmit || state.isSubmitting}
            >
              {state.isSubmitting ? "Submitting..." : "Sign In"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-4 text-center">
        <Button
          variant="link"
          onClick={onSwitchToSignUp}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Need an account? Sign Up
        </Button>
      </div>
    </div>
  );
}
`],
  ["auth/better-auth/web/react/next/src/components/sign-up-form.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import z from "zod";
import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";

export default function SignUpForm({
  onSwitchToSignIn,
}: {
  onSwitchToSignIn: () => void;
}) {
  const router = useRouter();
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: () => {
            router.push("/dashboard");
            toast.success("Sign up successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="mx-auto w-full mt-10 max-w-md p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Create Account</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div>
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe>
          {(state) => (
            <Button
              type="submit"
              className="w-full"
              disabled={!state.canSubmit || state.isSubmitting}
            >
              {state.isSubmitting ? "Submitting..." : "Sign Up"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-4 text-center">
        <Button
          variant="link"
          onClick={onSwitchToSignIn}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Already have an account? Sign In
        </Button>
      </div>
    </div>
  );
}
`],
  ["auth/better-auth/web/react/next/src/components/user-menu.tsx.hbs", `import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export default function UserMenu() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <Skeleton className="h-9 w-24" />;
  }

  if (!session) {
    return (
      <Link href="/login">
        <Button variant="outline">Sign In</Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        {session.user.name}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>{session.user.email}</DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.push("/");
                  },
                },
              });
            }}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
`],
  ["examples/todo/web/react/react-router/src/routes/todos.tsx.hbs", `import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

{{#if (eq backend "convex")}}
import { useMutation, useQuery } from "convex/react";
import { api } from "@{{projectName}}/backend/convex/_generated/api";
import type { Id } from "@{{projectName}}/backend/convex/_generated/dataModel";
{{else}}
  {{#if (eq api "orpc")}}
  import { orpc } from "@/utils/orpc";
  {{/if}}
  {{#if (eq api "trpc")}}
  import { trpc } from "@/utils/trpc";
  {{/if}}
import { useMutation, useQuery } from "@tanstack/react-query";
{{/if}}

export default function Todos() {
  const [newTodoText, setNewTodoText] = useState("");

  {{#if (eq backend "convex")}}
  const todos = useQuery(api.todos.getAll);
  const createTodo = useMutation(api.todos.create);
  const toggleTodo = useMutation(api.todos.toggle);
  const deleteTodo = useMutation(api.todos.deleteTodo);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = newTodoText.trim();
    if (!text) return;
    await createTodo({ text });
    setNewTodoText("");
  };

  const handleToggleTodo = (id: Id<"todos">, currentCompleted: boolean) => {
    toggleTodo({ id, completed: !currentCompleted });
  };

  const handleDeleteTodo = (id: Id<"todos">) => {
    deleteTodo({ id });
  };
  {{else}}
    {{#if (eq api "orpc")}}
    const todos = useQuery(orpc.todo.getAll.queryOptions());
    const createMutation = useMutation(
      orpc.todo.create.mutationOptions({
        onSuccess: () => {
          todos.refetch();
          setNewTodoText("");
        },
      })
    );
    const toggleMutation = useMutation(
      orpc.todo.toggle.mutationOptions({
        onSuccess: () => { todos.refetch() },
      })
    );
    const deleteMutation = useMutation(
      orpc.todo.delete.mutationOptions({
        onSuccess: () => { todos.refetch() },
      })
    );
    {{/if}}
    {{#if (eq api "trpc")}}
    const todos = useQuery(trpc.todo.getAll.queryOptions());
    const createMutation = useMutation(
      trpc.todo.create.mutationOptions({
        onSuccess: () => {
          todos.refetch();
          setNewTodoText("");
        },
      })
    );
    const toggleMutation = useMutation(
      trpc.todo.toggle.mutationOptions({
        onSuccess: () => { todos.refetch() },
      })
    );
    const deleteMutation = useMutation(
      trpc.todo.delete.mutationOptions({
        onSuccess: () => { todos.refetch() },
      })
    );
    {{/if}}

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      createMutation.mutate({ text: newTodoText });
    }
  };

  const handleToggleTodo = (id: number, completed: boolean) => {
    toggleMutation.mutate({ id, completed: !completed });
  };

  const handleDeleteTodo = (id: number) => {
    deleteMutation.mutate({ id });
  };
  {{/if}}

  return (
    <div className="w-full mx-auto max-w-md py-10">
      <Card>
        <CardHeader>
          <CardTitle>Todo List</CardTitle>
          <CardDescription>Manage your tasks efficiently</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleAddTodo}
            className="mb-6 flex items-center space-x-2"
          >
            <Input
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Add a new task..."
              {{#if (eq backend "convex")}}
              {{else}}
              disabled={createMutation.isPending}
              {{/if}}
            />
            <Button
              type="submit"
              {{#if (eq backend "convex")}}
              disabled={!newTodoText.trim()}
              {{else}}
              disabled={createMutation.isPending || !newTodoText.trim()}
              {{/if}}
            >
              {{#if (eq backend "convex")}}
              Add
              {{else}}
                {createMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Add"
                )}
              {{/if}}
            </Button>
          </form>

          {{#if (eq backend "convex")}}
            {todos === undefined ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : todos.length === 0 ? (
              <p className="py-4 text-center">No todos yet. Add one above!</p>
            ) : (
              <ul className="space-y-2">
                {todos.map((todo) => (
                  <li
                    key={todo._id}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() =>
                          handleToggleTodo(todo._id, todo.completed)
                        }
                        id={\`todo-\${todo._id}\`}
                      />
                      <label
                        htmlFor={\`todo-\${todo._id}\`}
                        className={\`\${todo.completed ? "line-through text-muted-foreground" : ""}\`}
                      >
                        {todo.text}
                      </label>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTodo(todo._id)}
                      aria-label="Delete todo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          {{else}}
            {todos.isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : todos.data?.length === 0 ? (
              <p className="py-4 text-center">
                No todos yet. Add one above!
              </p>
            ) : (
              <ul className="space-y-2">
                {todos.data?.map((todo) => (
                  <li
                    key={todo.id}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() =>
                          handleToggleTodo(todo.id, todo.completed)
                        }
                        id={\`todo-\${todo.id}\`}
                      />
                      <label
                        htmlFor={\`todo-\${todo.id}\`}
                        className={\`\${todo.completed ? "line-through" : ""}\`}
                      >
                        {todo.text}
                      </label>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTodo(todo.id)}
                      aria-label="Delete todo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          {{/if}}
        </CardContent>
      </Card>
    </div>
  );
}
`],
  ["addons/pwa/apps/web/next/public/favicon/web-app-manifest-192x192.png", `[Binary file]`],
  ["addons/pwa/apps/web/next/public/favicon/apple-touch-icon.png", `[Binary file]`],
  ["addons/pwa/apps/web/next/public/favicon/site.webmanifest.hbs", `{
	"name": "{{projectName}}",
	"short_name": "{{projectName}}",
	"icons": [
		{
			"src": "/web-app-manifest-192x192.png",
			"sizes": "192x192",
			"type": "image/png",
			"purpose": "maskable"
		},
		{
			"src": "/web-app-manifest-512x512.png",
			"sizes": "512x512",
			"type": "image/png",
			"purpose": "maskable"
		}
	],
	"theme_color": "#ffffff",
	"background_color": "#ffffff",
	"display": "standalone"
}
`],
  ["addons/pwa/apps/web/next/public/favicon/web-app-manifest-512x512.png", `[Binary file]`],
  ["addons/pwa/apps/web/next/public/favicon/favicon-96x96.png", `[Binary file]`],
  ["addons/pwa/apps/web/next/public/favicon/favicon.svg", `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="92" height="92"><svg width="92" height="92" viewBox="0 0 92 92" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="8" y="8" width="76" height="76" rx="12" fill="#F5EEFF" stroke="#B79AFF" stroke-width="3"></rect>
  <text x="46" y="56" text-anchor="middle" font-family="monospace" font-size="40" fill="#8F5BFF">$<tspan dx="0" dy="0">_</tspan></text>
</svg><style>@media (prefers-color-scheme: light) { :root { filter: none; } }
@media (prefers-color-scheme: dark) { :root { filter: none; } }
</style></svg>`],
  ["examples/todo/web/react/tanstack-start/src/routes/todos.tsx.hbs", `import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";
{{#if (eq backend "convex")}}
import { Trash2 } from "lucide-react";
{{else}}
import { Loader2, Trash2 } from "lucide-react";
{{/if}}
import { useState } from "react";

{{#if (eq backend "convex")}}
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { useMutation } from "convex/react";
import { api } from "@{{projectName}}/backend/convex/_generated/api";
import type { Id } from "@{{projectName}}/backend/convex/_generated/dataModel";
{{else}}
{{#if (eq api "trpc")}}
import { useTRPC } from "@/utils/trpc";
{{/if}}
{{#if (eq api "orpc")}}
import { orpc } from "@/utils/orpc";
{{/if}}
import { useMutation, useQuery } from "@tanstack/react-query";
{{/if}}

export const Route = createFileRoute("/todos")({
  component: TodosRoute,
});

function TodosRoute() {
  const [newTodoText, setNewTodoText] = useState("");

  {{#if (eq backend "convex")}}
  const todosQuery = useSuspenseQuery(convexQuery(api.todos.getAll, {}));
  const todos = todosQuery.data;

  const createTodo = useMutation(api.todos.create);
  const toggleTodo = useMutation(api.todos.toggle);
  const removeTodo = useMutation(api.todos.deleteTodo);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = newTodoText.trim();
    if (text) {
      setNewTodoText("");
      try {
        await createTodo({ text });
      } catch (error) {
        console.error("Failed to add todo:", error);
        setNewTodoText(text);
      }
    }
  };

  const handleToggleTodo = async (id: Id<"todos">, completed: boolean) => {
    try {
      await toggleTodo({ id, completed: !completed });
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  const handleDeleteTodo = async (id: Id<"todos">) => {
    try {
      await removeTodo({ id });
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };
  {{else}}
    {{#if (eq api "trpc")}}
  const trpc = useTRPC();
    {{/if}}
    {{#if (eq api "orpc")}}
    {{/if}}

    {{#if (eq api "trpc")}}
  const todos = useQuery(trpc.todo.getAll.queryOptions());
  const createMutation = useMutation(
    trpc.todo.create.mutationOptions({
      onSuccess: () => {
        todos.refetch();
        setNewTodoText("");
      },
    }),
  );
  const toggleMutation = useMutation(
    trpc.todo.toggle.mutationOptions({
      onSuccess: () => { todos.refetch() },
    }),
  );
  const deleteMutation = useMutation(
    trpc.todo.delete.mutationOptions({
      onSuccess: () => { todos.refetch() },
    }),
  );
    {{/if}}
    {{#if (eq api "orpc")}}
  const todos = useQuery(orpc.todo.getAll.queryOptions());
  const createMutation = useMutation(
    orpc.todo.create.mutationOptions({
      onSuccess: () => {
        todos.refetch();
        setNewTodoText("");
      },
    }),
  );
  const toggleMutation = useMutation(
    orpc.todo.toggle.mutationOptions({
      onSuccess: () => { todos.refetch() },
    }),
  );
  const deleteMutation = useMutation(
    orpc.todo.delete.mutationOptions({
      onSuccess: () => { todos.refetch() },
    }),
  );
    {{/if}}

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      createMutation.mutate({ text: newTodoText });
    }
  };

  const handleToggleTodo = (id: number, completed: boolean) => {
    toggleMutation.mutate({ id, completed: !completed });
  };

  const handleDeleteTodo = (id: number) => {
    deleteMutation.mutate({ id });
  };
  {{/if}}

  return (
    <div className="mx-auto w-full max-w-md py-10">
      <Card>
        <CardHeader>
          <CardTitle>Todo List{{#if (eq backend "convex")}} (Convex){{/if}}</CardTitle>
          <CardDescription>Manage your tasks efficiently</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleAddTodo}
            className="mb-6 flex items-center space-x-2"
          >
            <Input
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Add a new task..."
              {{#unless (eq backend "convex")}}
              disabled={createMutation.isPending}
              {{/unless}}
            />
            <Button
              type="submit"
              {{#unless (eq backend "convex")}}
              disabled={createMutation.isPending || !newTodoText.trim()}
              {{else}}
              disabled={!newTodoText.trim()}
              {{/unless}}
            >
              {{#unless (eq backend "convex")}}
              {createMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Add"
              )}
              {{else}}
              Add
              {{/unless}}
            </Button>
          </form>

          {{#if (eq backend "convex")}}
          {todos?.length === 0 ? (
            <p className="py-4 text-center">No todos yet. Add one above!</p>
          ) : (
            <ul className="space-y-2">
              {todos?.map((todo) => (
                <li
                  key={todo._id}
                  className="flex items-center justify-between rounded-md border p-2"
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() =>
                        handleToggleTodo(todo._id, todo.completed)
                      }
                      id={\`todo-\${todo._id}\`}
                    />
                    <label
                      htmlFor={\`todo-\${todo._id}\`}
                      className={\`\${
                        todo.completed
                          ? "text-muted-foreground line-through"
                          : ""
                      }\`}
                    >
                      {todo.text}
                    </label>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTodo(todo._id)}
                    aria-label="Delete todo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
          {{else}}
          {todos.isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : todos.data?.length === 0 ? (
            <p className="py-4 text-center">No todos yet. Add one above!</p>
          ) : (
            <ul className="space-y-2">
              {todos.data?.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between rounded-md border p-2"
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() =>
                        handleToggleTodo(todo.id, todo.completed)
                      }
                      id={\`todo-\${todo.id}\`}
                    />
                    <label
                      htmlFor={\`todo-\${todo.id}\`}
                      className={\`\${todo.completed ? "line-through" : ""}\`}
                    >
                      {todo.text}
                    </label>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTodo(todo.id)}
                    aria-label="Delete todo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
          {{/if}}
        </CardContent>
      </Card>
    </div>
  );
}
`],
  ["examples/todo/server/prisma/postgres/prisma/schema/todo.prisma.hbs", `model Todo {
  id        Int     @id @default(autoincrement())
  text      String
  completed Boolean @default(false)

  @@map("todo")
}
`],
  ["api/trpc/fullstack/tanstack-start/src/routes/api/trpc/$.ts.hbs", `import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@{{projectName}}/api/routers/index'
import { createContext } from '@{{projectName}}/api/context'
import { createFileRoute } from '@tanstack/react-router'

function handler({ request }: { request: Request }) {
  return fetchRequestHandler({
    req: request,
    router: appRouter,
    createContext,
    endpoint: '/api/trpc',
  })
}

export const Route = createFileRoute('/api/trpc/$')({
  server: {
    handlers: {
      GET: handler,
      POST: handler,
    },
  },
})
`],
  ["examples/ai/fullstack/next/src/app/api/ai/route.ts.hbs", `import { google } from "@ai-sdk/google";
import { streamText, type UIMessage, convertToModelMessages, wrapLanguageModel } from "ai";
import { devToolsMiddleware } from "@ai-sdk/devtools";

export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages }: { messages: UIMessage[] } = await req.json();

	const model = wrapLanguageModel({
		model: google("gemini-2.5-flash"),
		middleware: devToolsMiddleware(),
	});
	const result = streamText({
		model,
		messages: await convertToModelMessages(messages),
	});

	return result.toUIMessageStreamResponse();
}
`],
  ["auth/better-auth/web/svelte/src/routes/dashboard/+page.svelte.hbs", `<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	{{#if (eq api "orpc")}}
	import { orpc } from '$lib/orpc';
	import { createQuery } from '@tanstack/svelte-query';
	{{/if}}
	{{#if (eq payments "polar")}}
	let customerState = $state<{ activeSubscriptions?: unknown[] } | null>(null);
	{{/if}}

	const sessionQuery = authClient.useSession();

	{{#if (eq api "orpc")}}
	const privateDataQuery = createQuery(orpc.privateData.queryOptions());
	{{/if}}

	$effect(() => {
		if (!$sessionQuery.isPending && !$sessionQuery.data) {
			goto('/login');
		}
	});

	{{#if (eq payments "polar")}}
	$effect(() => {
		if ($sessionQuery.data) {
			authClient.customer.state().then(({ data }) => {
				customerState = data;
			});
		}
	});
	{{/if}}
</script>

{#if $sessionQuery.isPending}
	<div>Loading...</div>
{:else if !$sessionQuery.data}
	<div>Redirecting to login...</div>
{:else}
	<div>
		<h1>Dashboard</h1>
		<p>Welcome {$sessionQuery.data.user.name}</p>
		{{#if (eq api "orpc")}}
		<p>API: {$privateDataQuery.data?.message}</p>
		{{/if}}
		{{#if (eq payments "polar")}}
		<p>Plan: {customerState?.activeSubscriptions?.length > 0 ? "Pro" : "Free"}</p>
		{#if customerState?.activeSubscriptions?.length > 0}
			<button onclick={async () => await authClient.customer.portal()}>
				Manage Subscription
			</button>
		{:else}
			<button onclick={async () => await authClient.checkout({ slug: "pro" })}>
				Upgrade to Pro
			</button>
		{/if}
		{{/if}}
	</div>
{/if}
`],
  ["examples/todo/server/mongoose/mongodb/src/models/todo.model.ts.hbs", `import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const todoSchema = new Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, {
  collection: 'todo'
});

const Todo = model('Todo', todoSchema);

export { Todo };
`],
  ["examples/todo/web/react/tanstack-router/src/routes/todos.tsx.hbs", `import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

{{#if (eq backend "convex")}}
import { useMutation, useQuery } from "convex/react";
import { api } from "@{{projectName}}/backend/convex/_generated/api";
import type { Id } from "@{{projectName}}/backend/convex/_generated/dataModel";
{{else}}
  {{#if (eq api "orpc")}}
  import { orpc } from "@/utils/orpc";
  {{/if}}
  {{#if (eq api "trpc")}}
  import { trpc } from "@/utils/trpc";
  {{/if}}
import { useMutation, useQuery } from "@tanstack/react-query";
{{/if}}

export const Route = createFileRoute("/todos")({
  component: TodosRoute,
});

function TodosRoute() {
  const [newTodoText, setNewTodoText] = useState("");

  {{#if (eq backend "convex")}}
  const todos = useQuery(api.todos.getAll);
  const createTodo = useMutation(api.todos.create);
  const toggleTodo = useMutation(api.todos.toggle);
  const deleteTodo = useMutation(api.todos.deleteTodo);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = newTodoText.trim();
    if (!text) return;
    await createTodo({ text });
    setNewTodoText("");
  };

  const handleToggleTodo = (id: Id<"todos">, currentCompleted: boolean) => {
    toggleTodo({ id, completed: !currentCompleted });
  };

  const handleDeleteTodo = (id: Id<"todos">) => {
    deleteTodo({ id });
  };
  {{else}}
    {{#if (eq api "orpc")}}
    const todos = useQuery(orpc.todo.getAll.queryOptions());
    const createMutation = useMutation(
      orpc.todo.create.mutationOptions({
        onSuccess: () => {
          todos.refetch();
          setNewTodoText("");
        },
      }),
    );
    const toggleMutation = useMutation(
      orpc.todo.toggle.mutationOptions({
        onSuccess: () => { todos.refetch() },
      }),
    );
    const deleteMutation = useMutation(
      orpc.todo.delete.mutationOptions({
        onSuccess: () => { todos.refetch() },
      }),
    );
    {{/if}}
    {{#if (eq api "trpc")}}
    const todos = useQuery(trpc.todo.getAll.queryOptions());
    const createMutation = useMutation(
      trpc.todo.create.mutationOptions({
        onSuccess: () => {
          todos.refetch();
          setNewTodoText("");
        },
      }),
    );
    const toggleMutation = useMutation(
      trpc.todo.toggle.mutationOptions({
        onSuccess: () => { todos.refetch() },
      }),
    );
    const deleteMutation = useMutation(
      trpc.todo.delete.mutationOptions({
        onSuccess: () => { todos.refetch() },
      }),
    );
    {{/if}}

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      createMutation.mutate({ text: newTodoText });
    }
  };

  const handleToggleTodo = (id: number, completed: boolean) => {
    toggleMutation.mutate({ id, completed: !completed });
  };

  const handleDeleteTodo = (id: number) => {
    deleteMutation.mutate({ id });
  };
  {{/if}}

  return (
    <div className="mx-auto w-full max-w-md py-10">
      <Card>
        <CardHeader>
          <CardTitle>Todo List</CardTitle>
          <CardDescription>Manage your tasks efficiently</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleAddTodo}
            className="mb-6 flex items-center space-x-2"
          >
            <Input
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Add a new task..."
              {{#if (eq backend "convex")}}
              {{else}}
              disabled={createMutation.isPending}
              {{/if}}
            />
            <Button
              type="submit"
              {{#if (eq backend "convex")}}
              disabled={!newTodoText.trim()}
              {{else}}
              disabled={createMutation.isPending || !newTodoText.trim()}
              {{/if}}
            >
              {{#if (eq backend "convex")}}
              Add
              {{else}}
                {createMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Add"
                )}
              {{/if}}
            </Button>
          </form>

          {{#if (eq backend "convex")}}
            {todos === undefined ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : todos.length === 0 ? (
              <p className="py-4 text-center">No todos yet. Add one above!</p>
            ) : (
              <ul className="space-y-2">
                {todos.map((todo) => (
                  <li
                    key={todo._id}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() =>
                          handleToggleTodo(todo._id, todo.completed)
                        }
                        id={\`todo-\${todo._id}\`}
                      />
                      <label
                        htmlFor={\`todo-\${todo._id}\`}
                        className={\`\${todo.completed ? "line-through text-muted-foreground" : ""}\`}
                      >
                        {todo.text}
                      </label>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTodo(todo._id)}
                      aria-label="Delete todo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          {{else}}
            {todos.isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : todos.data?.length === 0 ? (
              <p className="py-4 text-center">
                No todos yet. Add one above!
              </p>
            ) : (
              <ul className="space-y-2">
                {todos.data?.map((todo) => (
                  <li
                    key={todo.id}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() =>
                          handleToggleTodo(todo.id, todo.completed)
                        }
                        id={\`todo-\${todo.id}\`}
                      />
                      <label
                        htmlFor={\`todo-\${todo.id}\`}
                        className={\`\${todo.completed ? "line-through" : ""}\`}
                      >
                        {todo.text}
                      </label>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTodo(todo.id)}
                      aria-label="Delete todo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          {{/if}}
        </CardContent>
      </Card>
    </div>
  );
}
`],
  ["auth/better-auth/web/react/tanstack-router/src/routes/dashboard.tsx.hbs", `{{#if (eq payments "polar")}}
import { Button } from "@/components/ui/button";
{{/if}}
import { authClient } from "@/lib/auth-client";
{{#if (eq api "orpc")}}
import { orpc } from "@/utils/orpc";
{{/if}}
{{#if (eq api "trpc")}}
import { trpc } from "@/utils/trpc";
{{/if}}
{{#if ( or (eq api "orpc") (eq api "trpc"))}}
import { useQuery } from "@tanstack/react-query";
{{/if}}
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	beforeLoad: async () => {
		const session = await authClient.getSession();
		if (!session.data) {
			redirect({
				to: "/login",
				throw: true
			});
		}
		{{#if (eq payments "polar")}}
		const {data: customerState} = await authClient.customer.state()
		return { session, customerState };
		{{else}}
		return { session };
		{{/if}}
	}
});

function RouteComponent() {
	const { session{{#if (eq payments "polar")}}, customerState{{/if}} } = Route.useRouteContext();

	{{#if (eq api "orpc")}}
	const privateData = useQuery(orpc.privateData.queryOptions());
	{{/if}}
	{{#if (eq api "trpc")}}
	const privateData = useQuery(trpc.privateData.queryOptions());
	{{/if}}

	{{#if (eq payments "polar")}}
	const hasProSubscription = customerState?.activeSubscriptions?.length! > 0
    console.log("Active subscriptions:", customerState?.activeSubscriptions)
	{{/if}}

	return (
		<div>
			<h1>Dashboard</h1>
			<p>Welcome {session.data?.user.name}</p>
			{{#if ( or (eq api "orpc") (eq api "trpc"))}}
			<p>API: {privateData.data?.message}</p>
			{{/if}}
			{{#if (eq payments "polar")}}
			<p>Plan: {hasProSubscription ? "Pro" : "Free"}</p>
			{hasProSubscription ? (
				<Button onClick={async () => await authClient.customer.portal()}>
					Manage Subscription
				</Button>
			) : (
				<Button onClick={async () => await authClient.checkout({ slug: "pro" })}>
					Upgrade to Pro
				</Button>
			)}
			{{/if}}
		</div>
	);
}
`],
  ["auth/better-auth/web/react/tanstack-router/src/routes/login.tsx.hbs", `import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showSignIn, setShowSignIn] = useState(false);

  return showSignIn ? (
    <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
  ) : (
    <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
  );
}
`],
  ["examples/ai/web/react/tanstack-start/src/routes/ai.tsx.hbs", `{{#if (eq backend "convex")}}
import { api } from "@{{projectName}}/backend/convex/_generated/api";
import {
  useUIMessages,
  useSmoothText,
  type UIMessage,
} from "@convex-dev/agent/react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { Send, Loader2 } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { Streamdown } from "streamdown";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/ai")({
  component: RouteComponent,
});

function MessageContent({
  text,
  isStreaming,
}: {
  text: string;
  isStreaming: boolean;
}) {
  const [visibleText] = useSmoothText(text, {
    startStreaming: isStreaming,
  });
  return <Streamdown>{visibleText}</Streamdown>;
}

function RouteComponent() {
  const [input, setInput] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const createThread = useMutation(api.chat.createNewThread);
  const sendMessage = useMutation(api.chat.sendMessage);

  const { results: messages } = useUIMessages(
    api.chat.listMessages,
    threadId ? { threadId } : "skip",
    { initialNumItems: 50, stream: true },
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const hasStreamingMessage = messages?.some(
    (m: UIMessage) => m.status === "streaming",
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    setIsLoading(true);
    setInput("");

    try {
      let currentThreadId = threadId;
      if (!currentThreadId) {
        currentThreadId = await createThread();
        setThreadId(currentThreadId);
      }

      await sendMessage({ threadId: currentThreadId, prompt: text });
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[1fr_auto] overflow-hidden w-full mx-auto p-4">
      <div className="overflow-y-auto space-y-4 pb-4">
        {!messages || messages.length === 0 ? (
          <div className="text-center text-muted-foreground mt-8">
            Ask me anything to get started!
          </div>
        ) : (
          messages.map((message: UIMessage) => (
            <div
              key={message.key}
              className={\`p-3 rounded-lg \${
                message.role === "user"
                  ? "bg-primary/10 ml-8"
                  : "bg-secondary/20 mr-8"
              }\`}
            >
              <p className="text-sm font-semibold mb-1">
                {message.role === "user" ? "You" : "AI Assistant"}
              </p>
              <MessageContent
                text={message.text ?? ""}
                isStreaming={message.status === "streaming"}
              />
            </div>
          ))
        )}
        {isLoading && !hasStreamingMessage && (
          <div className="p-3 rounded-lg bg-secondary/20 mr-8">
            <p className="text-sm font-semibold mb-1">AI Assistant</p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full flex items-center space-x-2 pt-2 border-t"
      >
        <Input
          name="prompt"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          autoComplete="off"
          autoFocus
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </Button>
      </form>
    </div>
  );
}
{{else}}
import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Send } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { Streamdown } from "streamdown";
{{#unless (eq backend "self")}}
import { env } from "@{{projectName}}/env/web";
{{/unless}}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/ai")({
  component: RouteComponent,
});

function RouteComponent() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: {{#if (eq backend "self")}}"/api/ai"{{else}}\`\${env.VITE_SERVER_URL}/ai\`{{/if}},
    }),
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    sendMessage({ text });
    setInput("");
  };

  return (
    <div className="grid grid-rows-[1fr_auto] overflow-hidden w-full mx-auto p-4">
      <div className="overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground mt-8">
            Ask me anything to get started!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={\`p-3 rounded-lg \${
                message.role === "user"
                  ? "bg-primary/10 ml-8"
                  : "bg-secondary/20 mr-8"
              }\`}
            >
              <p className="text-sm font-semibold mb-1">
                {message.role === "user" ? "You" : "AI Assistant"}
              </p>
              {message.parts?.map((part, index) => {
                if (part.type === "text") {
                  return (
                    <Streamdown
                      key={index}
                      isAnimating={status === "streaming" && message.role === "assistant"}
                    >
                      {part.text}
                    </Streamdown>
                  );
                }
                return null;
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full flex items-center space-x-2 pt-2 border-t"
      >
        <Input
          name="prompt"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          autoComplete="off"
          autoFocus
        />
        <Button type="submit" size="icon">
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
}
{{/if}}
`],
  ["examples/todo/native/bare/app/(drawer)/todos.tsx.hbs", `import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
{{#if (eq backend "convex")}}
import { useMutation, useQuery } from "convex/react";
import { api } from "@{{projectName}}/backend/convex/_generated/api";
import type { Id } from "@{{projectName}}/backend/convex/_generated/dataModel";
{{else}}
import { useMutation, useQuery } from "@tanstack/react-query";
{{/if}}
import { Container } from "@/components/container";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";
{{#unless (eq backend "convex")}}
  {{#if (eq api "orpc")}}
import { orpc } from "@/utils/orpc";
  {{/if}}
  {{#if (eq api "trpc")}}
import { trpc } from "@/utils/trpc";
  {{/if}}
{{/unless}}

export default function TodosScreen() {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;
  const [newTodoText, setNewTodoText] = useState("");

  {{#if (eq backend "convex")}}
  const todos = useQuery(api.todos.getAll);
  const createTodoMutation = useMutation(api.todos.create);
  const toggleTodoMutation = useMutation(api.todos.toggle);
  const deleteTodoMutation = useMutation(api.todos.deleteTodo);

  async function handleAddTodo() {
    const text = newTodoText.trim();
    if (!text) return;
    await createTodoMutation({ text });
    setNewTodoText("");
  }

  function handleToggleTodo(id: Id<"todos">, currentCompleted: boolean) {
    toggleTodoMutation({ id, completed: !currentCompleted });
  }

  function handleDeleteTodo(id: Id<"todos">) {
    Alert.alert("Delete Todo", "Are you sure you want to delete this todo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteTodoMutation({ id }),
      },
    ]);
  }

  const isLoading = !todos;
  const completedCount = todos?.filter((t) => t.completed).length || 0;
  const totalCount = todos?.length || 0;
  {{else}}
    {{#if (eq api "orpc")}}
  const todos = useQuery(orpc.todo.getAll.queryOptions());
  const createMutation = useMutation(
    orpc.todo.create.mutationOptions({
      onSuccess: () => {
        todos.refetch();
        setNewTodoText("");
      },
    })
  );
  const toggleMutation = useMutation(
    orpc.todo.toggle.mutationOptions({
      onSuccess: () => {
        todos.refetch();
      },
    })
  );
  const deleteMutation = useMutation(
    orpc.todo.delete.mutationOptions({
      onSuccess: () => {
        todos.refetch();
      },
    })
  );
    {{/if}}
    {{#if (eq api "trpc")}}
  const todos = useQuery(trpc.todo.getAll.queryOptions());
  const createMutation = useMutation(
    trpc.todo.create.mutationOptions({
      onSuccess: () => {
        todos.refetch();
        setNewTodoText("");
      },
    })
  );
  const toggleMutation = useMutation(
    trpc.todo.toggle.mutationOptions({
      onSuccess: () => {
        todos.refetch();
      },
    })
  );
  const deleteMutation = useMutation(
    trpc.todo.delete.mutationOptions({
      onSuccess: () => {
        todos.refetch();
      },
    })
  );
    {{/if}}

  function handleAddTodo() {
    if (newTodoText.trim()) {
      createMutation.mutate({ text: newTodoText });
    }
  }

  function handleToggleTodo(id: number, completed: boolean) {
    toggleMutation.mutate({ id, completed: !completed });
  }

  function handleDeleteTodo(id: number) {
    Alert.alert("Delete Todo", "Are you sure you want to delete this todo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteMutation.mutate({ id }),
      },
    ]);
  }

  const isLoading = todos?.isLoading;
  const completedCount = todos?.data?.filter((t) => t.completed).length || 0;
  const totalCount = todos?.data?.length || 0;
  {{/if}}

  return (
    <Container>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: theme.text }]}>
              Todo List
            </Text>
            {totalCount > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.primary }]}>
                <Text style={styles.badgeText}>
                  {completedCount}/{totalCount}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View
          style={[
            styles.inputCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <TextInput
                value={newTodoText}
                onChangeText={setNewTodoText}
                placeholder="Add a new task..."
                placeholderTextColor={theme.text}
                {{#unless (eq backend "convex")}}
                editable={!createMutation.isPending}
                {{/unless}}
                onSubmitEditing={handleAddTodo}
                returnKeyType="done"
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    borderColor: theme.border,
                    backgroundColor: theme.background,
                  },
                ]}
              />
            </View>
            <TouchableOpacity
              onPress={handleAddTodo}
              {{#if (eq backend "convex")}}
              disabled={!newTodoText.trim()}
              style={[
                styles.addButton,
                {
                  backgroundColor: !newTodoText.trim()
                    ? theme.border
                    : theme.primary,
                  opacity: !newTodoText.trim() ? 0.5 : 1,
                },
              ]}
            >
              <Ionicons
                name="add"
                size={24}
                color={newTodoText.trim() ? "#ffffff" : theme.text}
              />
              {{else}}
              disabled={createMutation.isPending || !newTodoText.trim()}
              style={[
                styles.addButton,
                {
                  backgroundColor:
                    createMutation.isPending || !newTodoText.trim()
                      ? theme.border
                      : theme.primary,
                  opacity:
                    createMutation.isPending || !newTodoText.trim() ? 0.5 : 1,
                },
              ]}
            >
              {createMutation.isPending ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons name="add" size={24} color="#ffffff" />
              )}
              {{/if}}
            </TouchableOpacity>
          </View>
        </View>

        {{#if (eq backend "convex")}}
        {isLoading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text
              style={[styles.loadingText, { color: theme.text, opacity: 0.7 }]}
            >
              Loading todos...
            </Text>
          </View>
        )}

        {todos && todos.length === 0 && !isLoading && (
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Ionicons
              name="checkbox-outline"
              size={64}
              color={theme.text}
              style=\\{{ opacity: 0.5, marginBottom: 16 }}
            />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              No todos yet
            </Text>
            <Text
              style={[styles.emptyText, { color: theme.text, opacity: 0.7 }]}
            >
              Add your first task to get started!
            </Text>
          </View>
        )}

        {todos && todos.length > 0 && (
          <View style={styles.todosList}>
            {todos.map((todo) => (
              <View
                key={todo._id}
                style={[
                  styles.todoCard,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <View style={styles.todoRow}>
                  <TouchableOpacity
                    onPress={() => handleToggleTodo(todo._id, todo.completed)}
                    style={[styles.checkbox, { borderColor: theme.border }]}
                  >
                    {todo.completed && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={theme.primary}
                      />
                    )}
                  </TouchableOpacity>
                  <View style={styles.todoTextContainer}>
                    <Text
                      style={[
                        styles.todoText,
                        { color: theme.text },
                        todo.completed && {
                          textDecorationLine: "line-through",
                          opacity: 0.5,
                        },
                      ]}
                    >
                      {todo.text}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteTodo(todo._id)}
                    style={styles.deleteButton}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={24}
                      color={theme.notification}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
        {{else}}
        {isLoading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text
              style={[styles.loadingText, { color: theme.text, opacity: 0.7 }]}
            >
              Loading todos...
            </Text>
          </View>
        )}

        {todos?.data && todos.data.length === 0 && !isLoading && (
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Ionicons
              name="checkbox-outline"
              size={64}
              color={theme.text}
              style=\\{{ opacity: 0.5, marginBottom: 16 }}
            />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              No todos yet
            </Text>
            <Text
              style={[styles.emptyText, { color: theme.text, opacity: 0.7 }]}
            >
              Add your first task to get started!
            </Text>
          </View>
        )}

        {todos?.data && todos.data.length > 0 && (
          <View style={styles.todosList}>
            {todos.data.map((todo) => (
              <View
                key={todo.id}
                style={[
                  styles.todoCard,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <View style={styles.todoRow}>
                  <TouchableOpacity
                    onPress={() => handleToggleTodo(todo.id, todo.completed)}
                    style={[styles.checkbox, { borderColor: theme.border }]}
                  >
                    {todo.completed && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={theme.primary}
                      />
                    )}
                  </TouchableOpacity>
                  <View style={styles.todoTextContainer}>
                    <Text
                      style={[
                        styles.todoText,
                        { color: theme.text },
                        todo.completed && {
                          textDecorationLine: "line-through",
                          opacity: 0.5,
                        },
                      ]}
                    >
                      {todo.text}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteTodo(todo.id)}
                    style={styles.deleteButton}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={24}
                      color={theme.notification}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
        {{/if}}
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 12,
  },
  inputCard: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
  },
  addButton: {
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
  },
  emptyCard: {
    borderWidth: 1,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
  todosList: {
    gap: 8,
  },
  todoCard: {
    borderWidth: 1,
    padding: 12,
  },
  todoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  todoTextContainer: {
    flex: 1,
  },
  todoText: {
    fontSize: 16,
  },
  deleteButton: {
    padding: 8,
  },
});`],
  ["examples/todo/web/nuxt/app/pages/todos.vue.hbs", `<script setup lang="ts">
import { ref } from 'vue'
{{#if (eq backend "convex")}}
import { api } from "@{{ projectName }}/backend/convex/_generated/api";
import type { Id } from "@{{ projectName }}/backend/convex/_generated/dataModel";
import { useConvexMutation, useConvexQuery } from "convex-vue";

const { data, error, isPending } = useConvexQuery(api.todos.getAll, {});

const newTodoText = ref("");
const { mutate: createTodo, isPending: isCreatePending } = useConvexMutation(api.todos.create);

const { mutate: toggleTodo } = useConvexMutation(api.todos.toggle);
const { mutate: deleteTodo, error: deleteError } = useConvexMutation(
  api.todos.deleteTodo,
);

function handleAddTodo() {
  const text = newTodoText.value.trim();
  if (!text) return;

  createTodo({ text });
  newTodoText.value = "";
}

function handleToggleTodo(id: Id<"todos">, completed: boolean) {
  toggleTodo({ id, completed: !completed });
}

function handleDeleteTodo(id: Id<"todos">) {
  deleteTodo({ id });
}
{{else}}
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'

const { $orpc } = useNuxtApp()

const newTodoText = ref('')
const queryClient = useQueryClient()

const todos = useQuery($orpc.todo.getAll.queryOptions())

const createMutation = useMutation($orpc.todo.create.mutationOptions({
  onSuccess: () => {
    queryClient.invalidateQueries()
    newTodoText.value = ''
  }
}))

const toggleMutation = useMutation($orpc.todo.toggle.mutationOptions({
  onSuccess: () => queryClient.invalidateQueries()
}))

const deleteMutation = useMutation($orpc.todo.delete.mutationOptions({
  onSuccess: () => queryClient.invalidateQueries()
}))

function handleAddTodo() {
  if (newTodoText.value.trim()) {
    createMutation.mutate({ text: newTodoText.value })
  }
}

function handleToggleTodo(id: number, completed: boolean) {
  toggleMutation.mutate({ id, completed: !completed })
}

function handleDeleteTodo(id: number) {
  deleteMutation.mutate({ id })
}
{{/if}}
</script>

<template>
  <UContainer class="py-8 max-w-md">
    <UCard>
      <template #header>
        <div>
          <div class="text-xl font-bold">Todo List</div>
          <div class="text-muted text-sm">Manage your tasks efficiently</div>
        </div>
      </template>

      <form @submit.prevent="handleAddTodo" class="mb-6 flex items-center gap-2">
        <UInput
          v-model="newTodoText"
          placeholder="Add a new task..."
          autocomplete="off"
          class="flex-1"
          {{#if (eq backend "convex")}}
          :disabled="isCreatePending"
          {{/if}}
        />
        <UButton
          type="submit"
          {{#if (eq backend "convex")}}
          :loading="isCreatePending"
          :disabled="!newTodoText.trim()"
          {{else}}
          :loading="createMutation.isPending.value"
          {{/if}}
        >
          Add
        </UButton>
      </form>

      {{#if (eq backend "convex")}}
      <!-- Loading State -->
      <div v-if="isPending" class="space-y-2">
        <USkeleton v-for="i in 3" :key="i" class="h-12 w-full" />
      </div>

      <!-- Error State -->
      <UAlert
        v-else-if="error || deleteError"
        color="error"
        icon="i-lucide-alert-circle"
        title="Error"
        :description="error?.message || deleteError?.message"
      />

      <!-- Empty State -->
      <UEmpty
        v-else-if="data?.length === 0"
        icon="i-lucide-clipboard-list"
        title="No todos yet"
        description="Add your first task above!"
      />

      <!-- Todo List -->
      <ul v-else-if="data" class="space-y-2">
        <li
          v-for="todo in data"
          :key="todo._id"
          class="flex items-center justify-between rounded-md border p-3"
        >
          <div class="flex items-center gap-3">
            <UCheckbox
              :model-value="todo.completed"
              @update:model-value="() => handleToggleTodo(todo._id, todo.completed)"
              :id="\`todo-\${todo._id}\`"
            />
            <label
              :for="\`todo-\${todo._id}\`"
              :class="{ 'line-through text-muted': todo.completed }"
              class="cursor-pointer"
            >
              \\{{ todo.text }}
            </label>
          </div>
          <UButton
            color="error"
            variant="ghost"
            size="sm"
            square
            @click="handleDeleteTodo(todo._id)"
            aria-label="Delete todo"
            icon="i-lucide-trash-2"
          />
        </li>
      </ul>
      {{else}}
      <!-- Loading State -->
      <div v-if="todos.status.value === 'pending'" class="space-y-2">
        <USkeleton v-for="i in 3" :key="i" class="h-12 w-full" />
      </div>

      <!-- Error State -->
      <UAlert
        v-else-if="todos.status.value === 'error'"
        color="error"
        icon="i-lucide-alert-circle"
        title="Failed to load todos"
        :description="todos.error.value?.message"
      />

      <!-- Empty State -->
      <UEmpty
        v-else-if="todos.data.value?.length === 0"
        icon="i-lucide-clipboard-list"
        title="No todos yet"
        description="Add your first task above!"
      />

      <!-- Todo List -->
      <ul v-else class="space-y-2">
        <li
          v-for="todo in todos.data.value"
          :key="todo.id"
          class="flex items-center justify-between rounded-md border p-3"
        >
          <div class="flex items-center gap-3">
            <UCheckbox
              :model-value="todo.completed"
              @update:model-value="() => handleToggleTodo(todo.id, todo.completed)"
              :id="\`todo-\${todo.id}\`"
            />
            <label
              :for="\`todo-\${todo.id}\`"
              :class="{ 'line-through text-muted': todo.completed }"
              class="cursor-pointer"
            >
              \\{{ todo.text }}
            </label>
          </div>
          <UButton
            color="error"
            variant="ghost"
            size="sm"
            square
            @click="handleDeleteTodo(todo.id)"
            aria-label="Delete todo"
            icon="i-lucide-trash-2"
          />
        </li>
      </ul>
      {{/if}}
    </UCard>
  </UContainer>
</template>
`],
  ["examples/todo/server/prisma/base/src/routers/todo.ts.hbs", `{{#if (eq api "orpc")}}
import z from "zod";
import prisma from "@{{projectName}}/db";
import { publicProcedure } from "../index";

export const todoRouter = {
  getAll: publicProcedure.handler(async () => {
    return await prisma.todo.findMany({
      orderBy: {
        id: "asc",
      },
    });
  }),

  create: publicProcedure
    .input(z.object({ text: z.string().min(1) }))
    .handler(async ({ input }) => {
      return await prisma.todo.create({
        data: {
          text: input.text,
        },
      });
    }),

  toggle: publicProcedure
    {{#if (eq database "mongodb")}}
    .input(z.object({ id: z.string(), completed: z.boolean() }))
    {{else}}
    .input(z.object({ id: z.number(), completed: z.boolean() }))
    {{/if}}
    .handler(async ({ input }) => {
      return await prisma.todo.update({
        where: { id: input.id },
        data: { completed: input.completed },
      });
    }),

  delete: publicProcedure
    {{#if (eq database "mongodb")}}
    .input(z.object({ id: z.string() }))
    {{else}}
    .input(z.object({ id: z.number() }))
    {{/if}}
    .handler(async ({ input }) => {
      return await prisma.todo.delete({
        where: { id: input.id },
      });
    }),
};
{{/if}}

{{#if (eq api "trpc")}}
import { TRPCError } from "@trpc/server";
import z from "zod";
import prisma from "@{{projectName}}/db";
import { publicProcedure, router } from "../index";

export const todoRouter = router({
  getAll: publicProcedure.query(async () => {
    return await prisma.todo.findMany({
      orderBy: {
        id: "asc"
      }
    });
  }),

  create: publicProcedure
    .input(z.object({ text: z.string().min(1) }))
    .mutation(async ({ input }) => {
      return await prisma.todo.create({
        data: {
          text: input.text,
        },
      });
    }),

  toggle: publicProcedure
    {{#if (eq database "mongodb")}}
    .input(z.object({ id: z.string(), completed: z.boolean() }))
    {{else}}
    .input(z.object({ id: z.number(), completed: z.boolean() }))
    {{/if}}
    .mutation(async ({ input }) => {
      try {
        return await prisma.todo.update({
          where: { id: input.id },
          data: { completed: input.completed },
        });
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Todo not found",
        });
      }
    }),

  delete: publicProcedure
    {{#if (eq database "mongodb")}}
    .input(z.object({ id: z.string() }))
    {{else}}
    .input(z.object({ id: z.number() }))
    {{/if}}
    .mutation(async ({ input }) => {
      try {
        return await prisma.todo.delete({
          where: { id: input.id },
        });
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Todo not found",
        });
      }
    }),
});
{{/if}}
`],
  ["examples/ai/fullstack/nuxt/server/api/ai.post.ts.hbs", `import { devToolsMiddleware } from "@ai-sdk/devtools";
import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages, wrapLanguageModel } from "ai";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const uiMessages = body.messages || [];

  const model = wrapLanguageModel({
    model: google("gemini-2.5-flash"),
    middleware: devToolsMiddleware(),
  });

  const result = streamText({
    model,
    messages: await convertToModelMessages(uiMessages),
  });

  return result.toUIMessageStreamResponse();
});
`],
  ["examples/ai/native/bare/app/(drawer)/ai.tsx.hbs", `{{#if (eq backend "convex")}}
import { Ionicons } from "@expo/vector-icons";
import {
  useUIMessages,
  useSmoothText,
  type UIMessage,
} from "@convex-dev/agent/react";
import { api } from "@{{projectName}}/backend/convex/_generated/api";
import { useMutation } from "convex/react";
import { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { Container } from "@/components/container";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";

function MessageContent({
  text,
  isStreaming,
  textColor,
}: {
  text: string;
  isStreaming: boolean;
  textColor: string;
}) {
  const [visibleText] = useSmoothText(text, {
    startStreaming: isStreaming,
  });
  return <Text style={[styles.messageText, { color: textColor }]}>{visibleText}</Text>;
}

export default function AIScreen() {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;
  const [input, setInput] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const createThread = useMutation(api.chat.createNewThread);
  const sendMessage = useMutation(api.chat.sendMessage);

  const { results: messages } = useUIMessages(
    api.chat.listMessages,
    threadId ? { threadId } : "skip",
    { initialNumItems: 50, stream: true },
  );

  const hasStreamingMessage = messages?.some(
    (m: UIMessage) => m.status === "streaming",
  );

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  async function onSubmit() {
    const value = input.trim();
    if (!value || isLoading) return;

    setIsLoading(true);
    setInput("");

    try {
      let currentThreadId = threadId;
      if (!currentThreadId) {
        currentThreadId = await createThread();
        setThreadId(currentThreadId);
      }

      await sendMessage({ threadId: currentThreadId, prompt: value });
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Container>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              AI Chat
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.text, opacity: 0.7 }]}>
              Chat with our AI assistant
            </Text>
          </View>
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {!messages || messages.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: theme.text, opacity: 0.7 }]}>
                  Ask me anything to get started!
                </Text>
              </View>
            ) : (
              <View style={styles.messagesList}>
                {messages.map((message: UIMessage) => (
                  <View
                    key={message.key}
                    style={[
                      styles.messageCard,
                      {
                        backgroundColor: message.role === "user"
                          ? theme.primary + "20"
                          : theme.card,
                        borderColor: theme.border,
                        alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                        marginLeft: message.role === "user" ? 32 : 0,
                        marginRight: message.role === "user" ? 0 : 32,
                      },
                    ]}
                  >
                    <Text style={[styles.messageRole, { color: theme.text }]}>
                      {message.role === "user" ? "You" : "AI Assistant"}
                    </Text>
                    <MessageContent
                      text={message.text ?? ""}
                      isStreaming={message.status === "streaming"}
                      textColor={theme.text}
                    />
                  </View>
                ))}
                {isLoading && !hasStreamingMessage && (
                  <View
                    style={[
                      styles.messageCard,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                        alignSelf: "flex-start",
                        marginRight: 32,
                      },
                    ]}
                  >
                    <Text style={[styles.messageRole, { color: theme.text }]}>
                      AI Assistant
                    </Text>
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color={theme.primary} />
                      <Text style={[styles.loadingText, { color: theme.text, opacity: 0.7 }]}>
                        Thinking...
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}
          </ScrollView>
          <View style={[styles.inputContainer, { borderTopColor: theme.border }]}>
            <View style={styles.inputRow}>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Type your message..."
                placeholderTextColor={theme.text}
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    borderColor: theme.border,
                    backgroundColor: theme.background,
                  },
                ]}
                onSubmitEditing={(e) => {
                  e.preventDefault();
                  onSubmit();
                }}
                editable={!isLoading}
                autoFocus={true}
                multiline
              />
              <TouchableOpacity
                onPress={onSubmit}
                disabled={!input.trim() || isLoading}
                style={[
                  styles.sendButton,
                  {
                    backgroundColor: input.trim() && !isLoading ? theme.primary : theme.border,
                    opacity: input.trim() && !isLoading ? 1 : 0.5,
                  },
                ]}
              >
                <Ionicons
                  name="send"
                  size={20}
                  color="#ffffff"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
  messagesList: {
    gap: 8,
    paddingBottom: 16,
  },
  messageCard: {
    borderWidth: 1,
    padding: 12,
    maxWidth: "80%",
  },
  messageRole: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
  },
  inputContainer: {
    borderTopWidth: 1,
    paddingTop: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 8,
    fontSize: 14,
    minHeight: 36,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
{{else}}
import { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { fetch as expoFetch } from "expo/fetch";
import { Ionicons } from "@expo/vector-icons";
import { Container } from "@/components/container";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";
import { env } from "@{{projectName}}/env/native";

const generateAPIUrl = (relativePath: string) => {
  const serverUrl = env.EXPO_PUBLIC_SERVER_URL;
  if (!serverUrl) {
    throw new Error(
      "EXPO_PUBLIC_SERVER_URL environment variable is not defined"
    );
  }
  const path = relativePath.startsWith("/") ? relativePath : \`/\${relativePath}\`;
  return serverUrl.concat(path);
};

export default function AIScreen() {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;
  const [input, setInput] = useState("");
  const { messages, error, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: generateAPIUrl("/ai"),
    }),
    onError: (error) => console.error(error, "AI Chat Error"),
  });
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  function onSubmit() {
    const value = input.trim();
    if (value) {
      sendMessage({ text: value });
      setInput("");
    }
  }

  if (error) {
    return (
      <Container>
        <View style={styles.errorContainer}>
          <View style={[styles.errorCard, { backgroundColor: theme.notification + "20", borderColor: theme.notification }]}>
            <Text style={[styles.errorTitle, { color: theme.notification }]}>
              Error: {error.message}
            </Text>
            <Text style={[styles.errorText, { color: theme.text, opacity: 0.7 }]}>
              Please check your connection and try again.
            </Text>
          </View>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              AI Chat
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.text, opacity: 0.7 }]}>
              Chat with our AI assistant
            </Text>
          </View>
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {messages.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: theme.text, opacity: 0.7 }]}>
                  Ask me anything to get started!
                </Text>
              </View>
            ) : (
              <View style={styles.messagesList}>
                {messages.map((message) => (
                  <View
                    key={message.id}
                    style={[
                      styles.messageCard,
                      {
                        backgroundColor: message.role === "user"
                          ? theme.primary + "20"
                          : theme.card,
                        borderColor: theme.border,
                        alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                        marginLeft: message.role === "user" ? 32 : 0,
                        marginRight: message.role === "user" ? 0 : 32,
                      },
                    ]}
                  >
                    <Text style={[styles.messageRole, { color: theme.text }]}>
                      {message.role === "user" ? "You" : "AI Assistant"}
                    </Text>
                    <View style={styles.messageParts}>
                      {message.parts.map((part, i) =>
                        part.type === "text" ? (
                          <Text
                            key={\`\${message.id}-\${i}\`}
                            style={[styles.messageText, { color: theme.text }]}
                          >
                            {part.text}
                          </Text>
                        ) : (
                          <Text
                            key={\`\${message.id}-\${i}\`}
                            style={[styles.messageText, { color: theme.text }]}
                          >
                            {JSON.stringify(part)}
                          </Text>
                        )
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
          <View style={[styles.inputContainer, { borderTopColor: theme.border }]}>
            <View style={styles.inputRow}>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Type your message..."
                placeholderTextColor={theme.text}
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    borderColor: theme.border,
                    backgroundColor: theme.background,
                  },
                ]}
                onSubmitEditing={(e) => {
                  e.preventDefault();
                  onSubmit();
                }}
                autoFocus={true}
                multiline
              />
              <TouchableOpacity
                onPress={onSubmit}
                disabled={!input.trim()}
                style={[
                  styles.sendButton,
                  {
                    backgroundColor: input.trim() ? theme.primary : theme.border,
                    opacity: input.trim() ? 1 : 0.5,
                  },
                ]}
              >
                <Ionicons
                  name="send"
                  size={20}
                  color="#ffffff"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
  messagesList: {
    gap: 8,
    paddingBottom: 16,
  },
  messageCard: {
    borderWidth: 1,
    padding: 12,
    maxWidth: "80%",
  },
  messageRole: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  messageParts: {
    gap: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  inputContainer: {
    borderTopWidth: 1,
    paddingTop: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 8,
    fontSize: 14,
    minHeight: 36,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorCard: {
    borderWidth: 1,
    padding: 16,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
  },
});
{{/if}}
`],
  ["auth/better-auth/server/db/drizzle/mysql/src/schema/auth.ts.hbs", `import { relations } from "drizzle-orm";
import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = mysqlTable(
  "session",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = mysqlTable(
  "account",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { fsp: 3 }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { fsp: 3 }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = mysqlTable(
  "verification",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    identifier: varchar("identifier", { length: 255 }).notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
`],
  ["auth/better-auth/native/uniwind/app/(drawer)/index.tsx.hbs", `import { Text, View, Pressable } from "react-native";
import { Container } from "@/components/container";
import { authClient } from "@/lib/auth-client";
import { Ionicons } from "@expo/vector-icons";
import { Card, Chip, useThemeColor } from "heroui-native";
import { SignIn } from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
{{#if (eq api "orpc")}}
import { useQuery } from "@tanstack/react-query";
import { queryClient, orpc } from "@/utils/orpc";
{{/if}}
{{#if (eq api "trpc")}}
import { useQuery } from "@tanstack/react-query";
import { queryClient, trpc } from "@/utils/trpc";
{{/if}}

export default function Home() {
{{#if (eq api "orpc")}}
const healthCheck = useQuery(orpc.healthCheck.queryOptions());
const privateData = useQuery(orpc.privateData.queryOptions());
const isConnected = healthCheck?.data === "OK";
const isLoading = healthCheck?.isLoading;
{{/if}}
{{#if (eq api "trpc")}}
const healthCheck = useQuery(trpc.healthCheck.queryOptions());
const privateData = useQuery(trpc.privateData.queryOptions());
const isConnected = healthCheck?.data === "OK";
const isLoading = healthCheck?.isLoading;
{{/if}}
const { data: session } = authClient.useSession();

const mutedColor = useThemeColor("muted");
const successColor = useThemeColor("success");
const dangerColor = useThemeColor("danger");
const foregroundColor = useThemeColor("foreground");

return (
<Container className="p-6">
  <View className="py-4 mb-6">
    <Text className="text-4xl font-bold text-foreground mb-2">
      BETTER T STACK
    </Text>
  </View>

  {session?.user ? (
  <Card variant="secondary" className="mb-6 p-4">
    <Text className="text-foreground text-base mb-2">
      Welcome, <Text className="font-medium">{session.user.name}</Text>
    </Text>
    <Text className="text-muted text-sm mb-4">
      {session.user.email}
    </Text>
    <Pressable className="bg-danger py-3 px-4 rounded-lg self-start active:opacity-70" onPress={()=> {
      authClient.signOut();
      {{#if (eq api "orpc")}}
      queryClient.invalidateQueries();
      {{/if}}
      {{#if (eq api "trpc")}}
      queryClient.invalidateQueries();
      {{/if}}
      }}
      >
      <Text className="text-foreground font-medium">Sign Out</Text>
    </Pressable>
  </Card>
  ) : null}

  {{#unless (eq api "none")}}
  <Card variant="secondary" className="p-6">
    <View className="flex-row items-center justify-between mb-4">
      <Card.Title>System Status</Card.Title>
      <Chip variant="secondary" color={isConnected ? "success" : "danger" } size="sm">
        <Chip.Label>{isConnected ? "LIVE" : "OFFLINE"}</Chip.Label>
      </Chip>
    </View>

    <Card className="p-4">
      <View className="flex-row items-center">
        <View className={\`w-3 h-3 rounded-full mr-3 \${isConnected ? "bg-success" : "bg-muted" }\`} />
        <View className="flex-1">
          <Text className="text-foreground font-medium mb-1">
            {{#if (eq api "orpc")}}ORPC{{else}}TRPC{{/if}} Backend
          </Text>
          <Card.Description>
            {isLoading
            ? "Checking connection..."
            : isConnected
            ? "Connected to API"
            : "API Disconnected"}
          </Card.Description>
        </View>
        {isLoading && (
        <Ionicons name="hourglass-outline" size={20} color={mutedColor} />
        )}
        {!isLoading && isConnected && (
        <Ionicons name="checkmark-circle" size={20} color={successColor} />
        )}
        {!isLoading && !isConnected && (
        <Ionicons name="close-circle" size={20} color={dangerColor} />
        )}
      </View>
    </Card>
  </Card>

  <Card variant="secondary" className="mt-6 p-4">
    <Card.Title className="mb-3">Private Data</Card.Title>
    {privateData && (
    <Card.Description>
      {privateData.data?.message}
    </Card.Description>
    )}
  </Card>
  {{/unless}}

  {!session?.user && (
  <>
    <SignIn />
    <SignUp />
  </>
  )}
</Container>
);
}`],
  ["auth/better-auth/fullstack/next/src/app/api/auth/[...all]/route.ts.hbs", `import { auth } from "@{{projectName}}/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth.handler);
`],
  ["auth/better-auth/web/react/react-router/src/routes/dashboard.tsx.hbs", `{{#if (eq payments "polar")}}
import { Button } from "@/components/ui/button";
{{/if}}
import { authClient } from "@/lib/auth-client";
{{#if (eq api "orpc")}}
import { orpc } from "@/utils/orpc";
{{/if}}
{{#if (eq api "trpc")}}
import { trpc } from "@/utils/trpc";
{{/if}}
{{#if ( or (eq api "orpc") (eq api "trpc"))}}
import { useQuery } from "@tanstack/react-query";
{{/if}}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();
  {{#if (eq payments "polar")}}
  const [customerState, setCustomerState] = useState<any>(null);
  {{/if}}

  {{#if (eq api "orpc")}}
  const privateData = useQuery(orpc.privateData.queryOptions());
  {{/if}}
  {{#if (eq api "trpc")}}
  const privateData = useQuery(trpc.privateData.queryOptions());
  {{/if}}

  useEffect(() => {
    if (!session && !isPending) {
      navigate("/login");
    }
  }, [session, isPending, navigate]);

  {{#if (eq payments "polar")}}
  useEffect(() => {
    async function fetchCustomerState() {
      if (session) {
        const { data } = await authClient.customer.state();
        setCustomerState(data);
      }
    }

    fetchCustomerState();
  }, [session]);
  {{/if}}

  if (isPending) {
    return <div>Loading...</div>;
  }

  {{#if (eq payments "polar")}}
  const hasProSubscription = customerState?.activeSubscriptions?.length! > 0;
  console.log("Active subscriptions:", customerState?.activeSubscriptions);
  {{/if}}

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session?.user.name}</p>
      {{#if ( or (eq api "orpc") (eq api "trpc"))}}
      <p>API: {privateData.data?.message}</p>
      {{/if}}
      {{#if (eq payments "polar")}}
      <p>Plan: {hasProSubscription ? "Pro" : "Free"}</p>
      {hasProSubscription ? (
        <Button onClick={async () => await authClient.customer.portal()}>
          Manage Subscription
        </Button>
      ) : (
        <Button onClick={async () => await authClient.checkout({ slug: "pro" })}>
          Upgrade to Pro
        </Button>
      )}
      {{/if}}
    </div>
  );
}
`],
  ["auth/better-auth/web/react/react-router/src/routes/login.tsx.hbs", `import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import { useState } from "react";

export default function Login() {
  const [showSignIn, setShowSignIn] = useState(false);

  return showSignIn ? (
    <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
  ) : (
    <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
  );
}
`],
  ["examples/todo/server/prisma/sqlite/prisma/schema/todo.prisma.hbs", `model Todo {
  id        Int     @id @default(autoincrement())
  text      String
  completed Boolean @default(false)

  @@map("todo")
}
`],
  ["examples/ai/web/react/react-router/src/routes/ai.tsx.hbs", `{{#if (eq backend "convex")}}
import { api } from "@{{projectName}}/backend/convex/_generated/api";
import {
  useUIMessages,
  useSmoothText,
  type UIMessage,
} from "@convex-dev/agent/react";
import { useMutation } from "convex/react";
import { Send, Loader2 } from "lucide-react";
import React, { useRef, useEffect, useState } from "react";
import { Streamdown } from "streamdown";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function MessageContent({
  text,
  isStreaming,
}: {
  text: string;
  isStreaming: boolean;
}) {
  const [visibleText] = useSmoothText(text, {
    startStreaming: isStreaming,
  });
  return <Streamdown>{visibleText}</Streamdown>;
}

const AI: React.FC = () => {
  const [input, setInput] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const createThread = useMutation(api.chat.createNewThread);
  const sendMessage = useMutation(api.chat.sendMessage);

  const { results: messages } = useUIMessages(
    api.chat.listMessages,
    threadId ? { threadId } : "skip",
    { initialNumItems: 50, stream: true },
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const hasStreamingMessage = messages?.some(
    (m: UIMessage) => m.status === "streaming",
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    setIsLoading(true);
    setInput("");

    try {
      let currentThreadId = threadId;
      if (!currentThreadId) {
        currentThreadId = await createThread();
        setThreadId(currentThreadId);
      }

      await sendMessage({ threadId: currentThreadId, prompt: text });
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[1fr_auto] overflow-hidden w-full mx-auto p-4">
      <div className="overflow-y-auto space-y-4 pb-4">
        {!messages || messages.length === 0 ? (
          <div className="text-center text-muted-foreground mt-8">
            Ask me anything to get started!
          </div>
        ) : (
          messages.map((message: UIMessage) => (
            <div
              key={message.key}
              className={\`p-3 rounded-lg \${
                message.role === "user"
                  ? "bg-primary/10 ml-8"
                  : "bg-secondary/20 mr-8"
              }\`}
            >
              <p className="text-sm font-semibold mb-1">
                {message.role === "user" ? "You" : "AI Assistant"}
              </p>
              <MessageContent
                text={message.text ?? ""}
                isStreaming={message.status === "streaming"}
              />
            </div>
          ))
        )}
        {isLoading && !hasStreamingMessage && (
          <div className="p-3 rounded-lg bg-secondary/20 mr-8">
            <p className="text-sm font-semibold mb-1">AI Assistant</p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full flex items-center space-x-2 pt-2 border-t"
      >
        <Input
          name="prompt"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          autoComplete="off"
          autoFocus
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </Button>
      </form>
    </div>
  );
};

export default AI;
{{else}}
import React, { useRef, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Send } from "lucide-react";
import { Streamdown } from "streamdown";
import { env } from "@{{projectName}}/env/web";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AI: React.FC = () => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: \`\${env.VITE_SERVER_URL}/ai\`,
    }),
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    sendMessage({ text });
    setInput("");
  };

  return (
    <div className="grid grid-rows-[1fr_auto] overflow-hidden w-full mx-auto p-4">
      <div className="overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground mt-8">
            Ask me anything to get started!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={\`p-3 rounded-lg \${
                message.role === "user"
                  ? "bg-primary/10 ml-8"
                  : "bg-secondary/20 mr-8"
              }\`}
            >
              <p className="text-sm font-semibold mb-1">
                {message.role === "user" ? "You" : "AI Assistant"}
              </p>
              {message.parts?.map((part, index) => {
                if (part.type === "text") {
                  return (
                    <Streamdown
                      key={index}
                      isAnimating={status === "streaming" && message.role === "assistant"}
                    >
                      {part.text}
                    </Streamdown>
                  );
                }
                return null;
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full flex items-center space-x-2 pt-2 border-t"
      >
        <Input
          name="prompt"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          autoComplete="off"
          autoFocus
        />
        <Button type="submit" size="icon">
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
};

export default AI;
{{/if}}
`],
  ["api/orpc/web/react/base/src/utils/orpc.ts.hbs", `import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
{{#if (and (includes frontend "tanstack-start") (eq backend "self"))}}
import { createRouterClient } from "@orpc/server";
import type { RouterClient } from "@orpc/server";
import { createIsomorphicFn } from "@tanstack/react-start";
import { appRouter } from "@{{projectName}}/api/routers/index";
import { createContext } from "@{{projectName}}/api/context";
{{else if (includes frontend "tanstack-start")}}
import type { RouterClient } from "@orpc/server";
import type { AppRouter } from "@{{projectName}}/api/routers/index";
import { env } from "@{{projectName}}/env/web";
{{else}}
import type { AppRouterClient } from "@{{projectName}}/api/routers/index";
{{#unless (eq backend "self")}}
import { env } from "@{{projectName}}/env/web";
{{/unless}}
{{/if}}

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error, query) => {
			toast.error(\`Error: \${error.message}\`, {
				action: {
					label: "retry",
					onClick: query.invalidate,
				},
			});
		},
	}),
});

{{#if (and (includes frontend "tanstack-start") (eq backend "self"))}}
const getORPCClient = createIsomorphicFn()
	.server(() =>
		createRouterClient(appRouter, {
			context: async ({ req }) => {
				return createContext({ req });
			},
		}),
	)
	.client((): RouterClient<typeof appRouter> => {
			const link = new RPCLink({
			url: \`\${window.location.origin}/api/rpc\`,
{{#if (eq auth "better-auth")}}
			fetch(url, options) {
				return fetch(url, {
					...options,
					credentials: "include",
				});
			},
{{/if}}
		});

		return createORPCClient(link);
	});

export const client: RouterClient<typeof appRouter> = getORPCClient();
{{else if (includes frontend "tanstack-start")}}
const link = new RPCLink({
	url: \`\${env.VITE_SERVER_URL}/rpc\`,
{{#if (eq auth "better-auth")}}
	fetch(url, options) {
		return fetch(url, {
			...options,
			credentials: "include",
		});
	},
{{/if}}
});

const getORPCClient = () => {
	return createORPCClient(link) as RouterClient<AppRouter>;
};

export const client: RouterClient<AppRouter> = getORPCClient();
{{else}}
export const link = new RPCLink({
{{#if (and (eq backend "self") (includes frontend "next"))}}
	url: \`\${typeof window !== "undefined" ? window.location.origin : "http://localhost:3001"}/api/rpc\`,
{{else if (includes frontend "next")}}
	url: \`\${env.NEXT_PUBLIC_SERVER_URL}/rpc\`,
{{else}}
	url: \`\${env.VITE_SERVER_URL}/rpc\`,
{{/if}}
{{#if (eq auth "better-auth")}}
	fetch(url, options) {
		return fetch(url, {
			...options,
			credentials: "include",
		});
	},
{{#if (includes frontend "next")}}
	headers: async () => {
		if (typeof window !== "undefined") {
			return {}
		}

		const { headers } = await import("next/headers")
		return Object.fromEntries(await headers())
	},
{{/if}}
{{/if}}
});

export const client: AppRouterClient = createORPCClient(link)
{{/if}}

export const orpc = createTanstackQueryUtils(client)

`],
  ["examples/ai/native/uniwind/app/(drawer)/ai.tsx.hbs", `{{#if (eq backend "convex")}}
import { Ionicons } from "@expo/vector-icons";
import {
  useUIMessages,
  useSmoothText,
  type UIMessage,
} from "@convex-dev/agent/react";
import { api } from "@{{projectName}}/backend/convex/_generated/api";
import { useMutation } from "convex/react";
import { Button, Divider, Spinner, Surface, TextField, useThemeColor } from "heroui-native";
import { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Container } from "@/components/container";

function MessageContent({
  text,
  isStreaming,
}: {
  text: string;
  isStreaming: boolean;
}) {
  const [visibleText] = useSmoothText(text, {
    startStreaming: isStreaming,
  });
  return <Text className="text-foreground text-sm leading-relaxed">{visibleText}</Text>;
}

export default function AIScreen() {
  const [input, setInput] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const mutedColor = useThemeColor("muted");
  const foregroundColor = useThemeColor("foreground");

  const createThread = useMutation(api.chat.createNewThread);
  const sendMessage = useMutation(api.chat.sendMessage);

  const { results: messages } = useUIMessages(
    api.chat.listMessages,
    threadId ? { threadId } : "skip",
    { initialNumItems: 50, stream: true },
  );

  const hasStreamingMessage = messages?.some(
    (m: UIMessage) => m.status === "streaming",
  );

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const onSubmit = async () => {
    const value = input.trim();
    if (!value || isLoading) return;

    setIsLoading(true);
    setInput("");

    try {
      let currentThreadId = threadId;
      if (!currentThreadId) {
        currentThreadId = await createThread();
        setThreadId(currentThreadId);
      }

      await sendMessage({ threadId: currentThreadId, prompt: value });
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 px-4 py-4">
          <View className="py-4 mb-4">
            <Text className="text-2xl font-semibold text-foreground tracking-tight">AI Chat</Text>
            <Text className="text-muted text-sm mt-1">Chat with our AI assistant</Text>
          </View>

          <ScrollView
            ref={scrollViewRef}
            className="flex-1 mb-4"
            showsVerticalScrollIndicator={false}
          >
            {!messages || messages.length === 0 ? (
              <View className="flex-1 justify-center items-center py-10">
                <Ionicons name="chatbubble-ellipses-outline" size={32} color={mutedColor} />
                <Text className="text-muted text-sm mt-3">Ask me anything to get started</Text>
              </View>
            ) : (
              <View className="gap-2">
                {messages.map((message: UIMessage) => (
                  <Surface
                    key={message.key}
                    variant={message.role === "user" ? "tertiary" : "secondary"}
                    className={\`p-3 rounded-lg \${message.role === "user" ? "ml-10" : "mr-10"}\`}
                  >
                    <Text className="text-xs font-medium mb-1 text-muted">
                      {message.role === "user" ? "You" : "AI"}
                    </Text>
                    <MessageContent
                      text={message.text ?? ""}
                      isStreaming={message.status === "streaming"}
                    />
                  </Surface>
                ))}
                {isLoading && !hasStreamingMessage && (
                  <Surface variant="secondary" className="p-3 mr-10 rounded-lg">
                    <Text className="text-xs font-medium mb-1 text-muted">AI</Text>
                    <View className="flex-row items-center gap-2">
                      <Spinner size="sm" />
                      <Text className="text-muted text-sm">Thinking...</Text>
                    </View>
                  </Surface>
                )}
              </View>
            )}
          </ScrollView>

          <Divider className="mb-3" />

          <View className="flex-row items-center gap-2">
            <View className="flex-1">
              <TextField>
                <TextField.Input
                  value={input}
                  onChangeText={setInput}
                  placeholder="Type a message..."
                  onSubmitEditing={onSubmit}
                  editable={!isLoading}
                  autoFocus
                />
              </TextField>
            </View>
            <Button
              isIconOnly
              variant={input.trim() && !isLoading ? "primary" : "secondary"}
              onPress={onSubmit}
              isDisabled={!input.trim() || isLoading}
              size="sm"
            >
              <Ionicons
                name="arrow-up"
                size={18}
                color={input.trim() && !isLoading ? foregroundColor : mutedColor}
              />
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
}
{{else}}
import { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { fetch as expoFetch } from "expo/fetch";
import { Ionicons } from "@expo/vector-icons";
import { Container } from "@/components/container";
import { Button, Divider, ErrorView, Spinner, Surface, TextField, useThemeColor } from "heroui-native";
import { env } from "@{{projectName}}/env/native";

const generateAPIUrl = (relativePath: string) => {
  const serverUrl = env.EXPO_PUBLIC_SERVER_URL;
  if (!serverUrl) {
    throw new Error(
      "EXPO_PUBLIC_SERVER_URL environment variable is not defined"
    );
  }
  const path = relativePath.startsWith("/") ? relativePath : \`/\${relativePath}\`;
  return serverUrl.concat(path);
};

export default function AIScreen() {
  const [input, setInput] = useState("");
  const { messages, error, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: generateAPIUrl("/ai"),
    }),
    onError: (error) => console.error(error, "AI Chat Error"),
  });
  const scrollViewRef = useRef<ScrollView>(null);
  const foregroundColor = useThemeColor("foreground");
  const mutedColor = useThemeColor("muted");

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const onSubmit = () => {
    const value = input.trim();
    if (value) {
      sendMessage({ text: value });
      setInput("");
    }
  };

  if (error) {
    return (
      <Container>
        <View className="flex-1 justify-center items-center px-4">
          <Surface variant="secondary" className="p-4 rounded-lg">
            <ErrorView isInvalid>
              <Text className="text-danger text-center font-medium mb-1">
                {error.message}
              </Text>
              <Text className="text-muted text-center text-xs">
                Please check your connection and try again.
              </Text>
            </ErrorView>
          </Surface>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 px-4 py-4">
          <View className="py-4 mb-4">
            <Text className="text-2xl font-semibold text-foreground tracking-tight">AI Chat</Text>
            <Text className="text-muted text-sm mt-1">Chat with our AI assistant</Text>
          </View>

          <ScrollView
            ref={scrollViewRef}
            className="flex-1 mb-4"
            showsVerticalScrollIndicator={false}
          >
            {messages.length === 0 ? (
              <View className="flex-1 justify-center items-center py-10">
                <Ionicons name="chatbubble-ellipses-outline" size={32} color={mutedColor} />
                <Text className="text-muted text-sm mt-3">Ask me anything to get started</Text>
              </View>
            ) : (
              <View className="gap-2">
                {messages.map((message) => (
                  <Surface
                    key={message.id}
                    variant={message.role === "user" ? "tertiary" : "secondary"}
                    className={\`p-3 rounded-lg \${message.role === "user" ? "ml-10" : "mr-10"}\`}
                  >
                    <Text className="text-xs font-medium mb-1 text-muted">
                      {message.role === "user" ? "You" : "AI"}
                    </Text>
                    <View className="gap-1">
                      {message.parts.map((part, i) =>
                        part.type === "text" ? (
                          <Text
                            key={\`\${message.id}-\${i}\`}
                            className="text-foreground text-sm leading-relaxed"
                          >
                            {part.text}
                          </Text>
                        ) : (
                          <Text
                            key={\`\${message.id}-\${i}\`}
                            className="text-foreground text-sm leading-relaxed"
                          >
                            {JSON.stringify(part)}
                          </Text>
                        )
                      )}
                    </View>
                  </Surface>
                ))}
              </View>
            )}
          </ScrollView>

          <Divider className="mb-3" />

          <View className="flex-row items-center gap-2">
            <View className="flex-1">
              <TextField>
                <TextField.Input
                  value={input}
                  onChangeText={setInput}
                  placeholder="Type a message..."
                  onSubmitEditing={onSubmit}
                  autoFocus
                />
              </TextField>
            </View>
            <Button
              isIconOnly
              variant={input.trim() ? "primary" : "secondary"}
              onPress={onSubmit}
              isDisabled={!input.trim()}
              size="sm"
            >
              <Ionicons
                name="arrow-up"
                size={18}
                color={input.trim() ? foregroundColor : mutedColor}
              />
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
}
{{/if}}
`],
  ["auth/better-auth/web/react/react-router/src/components/sign-in-form.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";
import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SignInForm({
  onSwitchToSignUp,
}: {
  onSwitchToSignUp: () => void;
}) {
  const navigate = useNavigate();
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            navigate("/dashboard");
            toast.success("Sign in successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        }
      );
    },
    validators: {
      onSubmit: z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="mx-auto w-full mt-10 max-w-md p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Welcome Back</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div>
          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe>
          {(state) => (
            <Button
              type="submit"
              className="w-full"
              disabled={!state.canSubmit || state.isSubmitting}
            >
              {state.isSubmitting ? "Submitting..." : "Sign In"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-4 text-center">
        <Button
          variant="link"
          onClick={onSwitchToSignUp}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Need an account? Sign Up
        </Button>
      </div>
    </div>
  );
}
`],
  ["auth/better-auth/web/react/react-router/src/components/sign-up-form.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";
import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SignUpForm({
  onSwitchToSignIn,
}: {
  onSwitchToSignIn: () => void;
}) {
  const navigate = useNavigate();
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: () => {
            navigate("/dashboard");
            toast.success("Sign up successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        }
      );
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="mx-auto w-full mt-10 max-w-md p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Create Account</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div>
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe>
          {(state) => (
            <Button
              type="submit"
              className="w-full"
              disabled={!state.canSubmit || state.isSubmitting}
            >
              {state.isSubmitting ? "Submitting..." : "Sign Up"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-4 text-center">
        <Button
          variant="link"
          onClick={onSwitchToSignIn}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Already have an account? Sign In
        </Button>
      </div>
    </div>
  );
}
`],
  ["auth/better-auth/web/react/react-router/src/components/user-menu.tsx.hbs", `import { Link, useNavigate } from "react-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export default function UserMenu() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <Skeleton className="h-9 w-24" />;
  }

  if (!session) {
    return (
      <Link to="/login">
        <Button variant="outline">Sign In</Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        {session.user.name}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>{session.user.email}</DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    navigate("/");
                  },
                },
              });
            }}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
`],
  ["examples/ai/web/svelte/src/routes/ai/+page.svelte.hbs", `<script lang="ts">
	import { PUBLIC_SERVER_URL } from "$env/static/public";
	import { Chat } from "@ai-sdk/svelte";
	import { DefaultChatTransport } from "ai";

	let input = $state("");
	const chat = new Chat({
		transport: new DefaultChatTransport({
			api: \`\${PUBLIC_SERVER_URL}/ai\`,
		}),
	});

	let messagesEndElement: HTMLDivElement | null = $state(null);

	$effect(() => {
		if (chat.messages.length > 0) {
			setTimeout(() => {
				messagesEndElement?.scrollIntoView({ behavior: "smooth" });
			}, 0);
		}
	});

	function handleSubmit(e: Event) {
		e.preventDefault();
		const text = input.trim();
		if (!text) return;
		chat.sendMessage({ text });
		input = "";
	}
</script>

<div
	class="mx-auto grid h-full w-full max-w-2xl grid-rows-[1fr_auto] overflow-hidden p-4"
>
	<div class="mb-4 space-y-4 overflow-y-auto pb-4">
		{#if chat.messages.length === 0}
			<div class="mt-8 text-center text-neutral-500">
				Ask me anything to get started!
			</div>
		{/if}

		{#each chat.messages as message (message.id)}
			<div
				class="p-3 rounded-lg w-fit max-w-[85%] text-sm md:text-base"
				class:ml-auto={message.role === "user"}
				class:bg-primary={message.role === "user"}
				class:bg-secondary={message.role === "assistant"}
			>
				<p
					class="mb-1 text-sm font-semibold"
					class:text-indigo-600={message.role === "user"}
					class:text-neutral-400={message.role === "assistant"}
				>
					{message.role === "user" ? "You" : "AI Assistant"}
				</p>
				<div class="whitespace-pre-wrap break-words">
					{#each message.parts as part, partIndex (partIndex)}
						{#if part.type === "text"}
							{part.text}
						{/if}
					{/each}
				</div>
			</div>
		{/each}
		<div bind:this={messagesEndElement}></div>
	</div>

	<form
		onsubmit={handleSubmit}
		class="w-full flex items-center space-x-2 pt-2 border-t"
	>
		<input
			name="prompt"
			bind:value={input}
			placeholder="Type your message..."
			class="flex-1 rounded border border-neutral-600 bg-neutral-800 px-3 py-2 text-neutral-100 placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
			autocomplete="off"
			onkeydown={(e) => {
				if (e.key === "Enter" && !e.shiftKey) {
					e.preventDefault();
					handleSubmit(e);
				}
			}}
		/>
		<button
			type="submit"
			disabled={!input.trim()}
			class="inline-flex h-10 w-10 items-center justify-center rounded bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
			aria-label="Send message"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="m22 2-7 20-4-9-9-4Z" />
				<path d="M22 2 11 13" />
			</svg>
		</button>
	</form>
</div>
`],
  ["examples/todo/server/drizzle/postgres/src/schema/todo.ts", `import { pgTable, text, boolean, serial } from "drizzle-orm/pg-core";

export const todo = pgTable("todo", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  completed: boolean("completed").default(false).notNull(),
});
`],
  ["api/trpc/web/react/base/src/utils/trpc.ts.hbs", `{{#if (includes frontend 'next')}}
import { QueryCache, QueryClient } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import type { AppRouter } from "@{{projectName}}/api/routers/index";
import { toast } from 'sonner';
{{#unless (eq backend "self")}}
import { env } from "@{{projectName}}/env/web";
{{/unless}}

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error, query) => {
			toast.error(error.message, {
				action: {
					label: "retry",
					onClick: query.invalidate,
				},
			});
		},
	}),
});

const trpcClient = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
{{#if (eq backend "self")}}
			url: "/api/trpc",
{{else}}
			url: \`\${env.NEXT_PUBLIC_SERVER_URL}/trpc\`,
{{/if}}
{{#if (eq auth "better-auth")}}
			fetch(url, options) {
				return fetch(url, {
					...options,
					credentials: "include",
				});
			},
{{/if}}
		}),
	],
})

export const trpc = createTRPCOptionsProxy<AppRouter>({
	client: trpcClient,
	queryClient,
});

{{else if (includes frontend 'tanstack-start')}}
import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@{{projectName}}/api/routers/index";

export const { TRPCProvider, useTRPC, useTRPCClient } =
	createTRPCContext<AppRouter>();

{{else}}
import type { AppRouter } from "@{{projectName}}/api/routers/index";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { toast } from "sonner";
import { env } from "@{{projectName}}/env/web";

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error, query) => {
			toast.error(error.message, {
				action: {
					label: "retry",
					onClick: query.invalidate,
				},
			});
		},
	}),
});

export const trpcClient = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: \`\${env.VITE_SERVER_URL}/trpc\`,
{{#if (eq auth "better-auth")}}
			fetch(url, options) {
				return fetch(url, {
					...options,
					credentials: "include",
				});
			},
{{/if}}
		}),
	],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
	client: trpcClient,
	queryClient,
});
{{/if}}
`],
  ["auth/clerk/convex/web/react/next/src/app/dashboard/page.tsx.hbs", `"use client";

import { api } from "@{{projectName}}/backend/convex/_generated/api";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Authenticated, AuthLoading, Unauthenticated, useQuery } from "convex/react";

export default function Dashboard() {
  const user = useUser();
  const privateData = useQuery(api.privateData.get);

  return (
    <>
      <Authenticated>
        <div>
          <h1>Dashboard</h1>
          <p>Welcome {user.user?.fullName}</p>
          <p>privateData: {privateData?.message}</p>
          <UserButton />
        </div>
      </Authenticated>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
      <AuthLoading>
        <div>Loading...</div>
      </AuthLoading>
    </>
  );
}
`],
  ["auth/better-auth/web/react/base/src/lib/auth-client.ts.hbs", `import { createAuthClient } from "better-auth/react";
{{#if (eq payments "polar")}}
import { polarClient } from "@polar-sh/better-auth";
{{/if}}
{{#unless (eq backend "self")}}
import { env } from "@{{projectName}}/env/web";
{{/unless}}

export const authClient = createAuthClient({
{{#unless (eq backend "self")}}
	baseURL: env.{{#if (includes frontend "next")}}NEXT_PUBLIC_SERVER_URL{{else}}VITE_SERVER_URL{{/if}},
{{/unless}}
{{#if (eq payments "polar")}}
	plugins: [polarClient()]
{{/if}}
});
`],
  ["examples/todo/server/drizzle/base/src/routers/todo.ts.hbs", `{{#if (eq api "orpc")}}
import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "@{{projectName}}/db";
import { todo } from "@{{projectName}}/db/schema/todo";
import { publicProcedure } from "../index";

export const todoRouter = {
  getAll: publicProcedure.handler(async () => {
    return await db.select().from(todo);
  }),

  create: publicProcedure
    .input(z.object({ text: z.string().min(1) }))
    .handler(async ({ input }) => {
      return await db
        .insert(todo)
        .values({
          text: input.text,
        });
    }),

  toggle: publicProcedure
    .input(z.object({ id: z.number(), completed: z.boolean() }))
    .handler(async ({ input }) => {
      return await db
        .update(todo)
        .set({ completed: input.completed })
        .where(eq(todo.id, input.id));
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .handler(async ({ input }) => {
      return await db.delete(todo).where(eq(todo.id, input.id));
    }),
};
{{/if}}

{{#if (eq api "trpc")}}
import z from "zod";
import { router, publicProcedure } from "../index";
import { todo } from "@{{projectName}}/db/schema/todo";
import { eq } from "drizzle-orm";
import { db } from "@{{projectName}}/db";

export const todoRouter = router({
  getAll: publicProcedure.query(async () => {
    return await db.select().from(todo);
  }),

  create: publicProcedure
    .input(z.object({ text: z.string().min(1) }))
    .mutation(async ({ input }) => {
      return await db.insert(todo).values({
        text: input.text,
      });
    }),

  toggle: publicProcedure
    .input(z.object({ id: z.number(), completed: z.boolean() }))
    .mutation(async ({ input }) => {
      return await db
        .update(todo)
        .set({ completed: input.completed })
        .where(eq(todo.id, input.id));
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await db.delete(todo).where(eq(todo.id, input.id));
    }),
});
{{/if}}
`],
  ["auth/better-auth/web/react/next/src/app/login/page.tsx.hbs", `"use client"

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import { useState } from "react";


export default function LoginPage() {
  const [showSignIn, setShowSignIn] = useState(false);

  return showSignIn ? (
    <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
  ) : (
    <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
  );
}
`],
  ["examples/ai/web/react/tanstack-router/src/routes/ai.tsx.hbs", `{{#if (eq backend "convex")}}
import { api } from "@{{projectName}}/backend/convex/_generated/api";
import {
  useUIMessages,
  useSmoothText,
  type UIMessage,
} from "@convex-dev/agent/react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { Send, Loader2 } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { Streamdown } from "streamdown";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/ai")({
  component: RouteComponent,
});

function MessageContent({
  text,
  isStreaming,
}: {
  text: string;
  isStreaming: boolean;
}) {
  const [visibleText] = useSmoothText(text, {
    startStreaming: isStreaming,
  });
  return <Streamdown>{visibleText}</Streamdown>;
}

function RouteComponent() {
  const [input, setInput] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const createThread = useMutation(api.chat.createNewThread);
  const sendMessage = useMutation(api.chat.sendMessage);

  const { results: messages } = useUIMessages(
    api.chat.listMessages,
    threadId ? { threadId } : "skip",
    { initialNumItems: 50, stream: true },
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const hasStreamingMessage = messages?.some(
    (m: UIMessage) => m.status === "streaming",
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    setIsLoading(true);
    setInput("");

    try {
      let currentThreadId = threadId;
      if (!currentThreadId) {
        currentThreadId = await createThread();
        setThreadId(currentThreadId);
      }

      await sendMessage({ threadId: currentThreadId, prompt: text });
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[1fr_auto] overflow-hidden w-full mx-auto p-4">
      <div className="overflow-y-auto space-y-4 pb-4">
        {!messages || messages.length === 0 ? (
          <div className="text-center text-muted-foreground mt-8">
            Ask me anything to get started!
          </div>
        ) : (
          messages.map((message: UIMessage) => (
            <div
              key={message.key}
              className={\`p-3 rounded-lg \${
                message.role === "user"
                  ? "bg-primary/10 ml-8"
                  : "bg-secondary/20 mr-8"
              }\`}
            >
              <p className="text-sm font-semibold mb-1">
                {message.role === "user" ? "You" : "AI Assistant"}
              </p>
              <MessageContent
                text={message.text ?? ""}
                isStreaming={message.status === "streaming"}
              />
            </div>
          ))
        )}
        {isLoading && !hasStreamingMessage && (
          <div className="p-3 rounded-lg bg-secondary/20 mr-8">
            <p className="text-sm font-semibold mb-1">AI Assistant</p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full flex items-center space-x-2 pt-2 border-t"
      >
        <Input
          name="prompt"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          autoComplete="off"
          autoFocus
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </Button>
      </form>
    </div>
  );
}
{{else}}
import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { Streamdown } from "streamdown";
{{#unless (eq backend "self")}}
import { env } from "@{{projectName}}/env/web";
{{/unless}}

export const Route = createFileRoute("/ai")({
  component: RouteComponent,
});

function RouteComponent() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: {{#if (eq backend "self")}}"/api/ai"{{else}}\`\${env.VITE_SERVER_URL}/ai\`{{/if}},
    }),
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    sendMessage({ text });
    setInput("");
  };

  return (
    <div className="grid grid-rows-[1fr_auto] overflow-hidden w-full mx-auto p-4">
      <div className="overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground mt-8">
            Ask me anything to get started!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={\`p-3 rounded-lg \${
                message.role === "user"
                  ? "bg-primary/10 ml-8"
                  : "bg-secondary/20 mr-8"
              }\`}
            >
              <p className="text-sm font-semibold mb-1">
                {message.role === "user" ? "You" : "AI Assistant"}
              </p>
              {message.parts?.map((part, index) => {
                if (part.type === "text") {
                  return (
                    <Streamdown
                      key={index}
                      isAnimating={status === "streaming" && message.role === "assistant"}
                    >
                      {part.text}
                    </Streamdown>
                  );
                }
                return null;
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full flex items-center space-x-2 pt-2 border-t"
      >
        <Input
          name="prompt"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          autoComplete="off"
          autoFocus
        />
        <Button type="submit" size="icon">
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
}
{{/if}}
`],
  ["auth/better-auth/web/react/next/src/app/dashboard/dashboard.tsx.hbs", `"use client";
{{#if (eq payments "polar")}}
import { Button } from "@/components/ui/button";
{{/if}}
import { authClient } from "@/lib/auth-client";
{{#if (eq api "orpc")}}
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
{{/if}}
{{#if (eq api "trpc")}}
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
{{/if}}

export default function Dashboard({
	{{#if (eq payments "polar")}}
	customerState,
	{{/if}}
	session
}: {
	{{#if (eq payments "polar")}}
	customerState: ReturnType<typeof authClient.customer.state>;
	{{/if}}
	session: typeof authClient.$Infer.Session;
}) {
	{{#if (eq api "orpc")}}
	const privateData = useQuery(orpc.privateData.queryOptions());
	{{/if}}
	{{#if (eq api "trpc")}}
	const privateData = useQuery(trpc.privateData.queryOptions());
	{{/if}}

	{{#if (eq payments "polar")}}
	const hasProSubscription = customerState?.activeSubscriptions?.length! > 0;
	console.log("Active subscriptions:", customerState?.activeSubscriptions);
	{{/if}}

	return (
		<>
			{{#if (eq api "orpc")}}
			<p>API: {privateData.data?.message}</p>
			{{/if}}
			{{#if (eq api "trpc")}}
			<p>API: {privateData.data?.message}</p>
			{{/if}}
			{{#if (eq payments "polar")}}
			<p>Plan: {hasProSubscription ? "Pro" : "Free"}</p>
			{hasProSubscription ? (
				<Button onClick={async () => await authClient.customer.portal()}>
					Manage Subscription
				</Button>
			) : (
				<Button onClick={async () => await authClient.checkout({ slug: "pro" })}>
					Upgrade to Pro
				</Button>
			)}
			{{/if}}
		</>
	);
}
`],
  ["auth/better-auth/web/react/next/src/app/dashboard/page.tsx.hbs", `import { redirect } from "next/navigation";
import Dashboard from "./dashboard";
import { headers } from "next/headers";
{{#if (eq backend "self")}}
import { auth } from "@{{projectName}}/auth";
{{/if}}
import { authClient } from "@/lib/auth-client";

export default async function DashboardPage() {
	{{#if (eq backend "self")}}
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	{{else}}
	const session = await authClient.getSession({
		fetchOptions: {
			headers: await headers(),
			throw: true
		}
	});
	{{/if}}

	if (!session?.user) {
		redirect("/login");
	}

	{{#if (eq payments "polar")}}
	const { data: customerState } = await authClient.customer.state({
		fetchOptions: {
			headers: await headers(),
		},
	});
	{{/if}}

	return (
		<div>
			<h1>Dashboard</h1>
			<p>Welcome {session.user.name}</p>
			<Dashboard session={session} {{#if (eq payments "polar")}}customerState={customerState}{{/if}} />
		</div>
	);
}
`],
  ["auth/better-auth/convex/web/react/next/src/lib/auth-client.ts.hbs", `import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [convexClient()],
});
`],
  ["auth/better-auth/convex/web/react/next/src/lib/auth-server.ts.hbs", `import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";
import { env } from "@{{projectName}}/env/web";

export const {
	handler,
	preloadAuthQuery,
	isAuthenticated,
	getToken,
	fetchAuthQuery,
	fetchAuthMutation,
	fetchAuthAction,
} = convexBetterAuthNextJs({
	convexUrl: env.NEXT_PUBLIC_CONVEX_URL,
	convexSiteUrl: env.NEXT_PUBLIC_CONVEX_SITE_URL,
});
`],
  ["examples/todo/convex/packages/backend/convex/todos.ts.hbs", `import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
    handler: async (ctx) => {
        return await ctx.db.query("todos").collect();
    },
});

export const create = mutation({
    args: {
        text: v.string(),
    },
    handler: async (ctx, args) => {
        const newTodoId = await ctx.db.insert("todos", {
            text: args.text,
            completed: false,
        });
        return await ctx.db.get("todos", newTodoId);
    },
});

export const toggle = mutation({
    args: {
        id: v.id("todos"),
        completed: v.boolean(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch("todos", args.id, { completed: args.completed });
        return { success: true };
    },
});

export const deleteTodo = mutation({
    args: {
        id: v.id("todos"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete("todos", args.id);
        return { success: true };
    },
});`],
  ["examples/todo/server/drizzle/mysql/src/schema/todo.ts", `import { mysqlTable, varchar, int, boolean } from "drizzle-orm/mysql-core";

export const todo = mysqlTable("todo", {
  id: int("id").primaryKey().autoincrement(),
  text: varchar("text", { length: 255 }).notNull(),
  completed: boolean("completed").default(false).notNull(),
});
`],
  ["auth/better-auth/server/db/drizzle/sqlite/src/schema/auth.ts.hbs", `import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .default(false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql\`(cast(unixepoch('subsecond') * 1000 as integer))\`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql\`(cast(unixepoch('subsecond') * 1000 as integer))\`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = sqliteTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql\`(cast(unixepoch('subsecond') * 1000 as integer))\`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = sqliteTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", {
      mode: "timestamp_ms",
    }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", {
      mode: "timestamp_ms",
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql\`(cast(unixepoch('subsecond') * 1000 as integer))\`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = sqliteTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql\`(cast(unixepoch('subsecond') * 1000 as integer))\`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql\`(cast(unixepoch('subsecond') * 1000 as integer))\`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
`],
  ["examples/todo/server/drizzle/sqlite/src/schema/todo.ts", `import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todo = sqliteTable("todo", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  text: text("text").notNull(),
  completed: integer("completed", { mode: "boolean" }).default(false).notNull(),
});
`],
  ["auth/better-auth/convex/web/react/tanstack-start/src/routes/api/auth/$.ts.hbs", `import { createFileRoute } from "@tanstack/react-router";
import { handler } from "@/lib/auth-server";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => handler(request),
      POST: ({ request }) => handler(request),
    },
  },
});
`],
  ["examples/todo/native/unistyles/app/(drawer)/todos.tsx.hbs", `import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

{{#if (eq backend "convex")}}
import { useMutation, useQuery } from "convex/react";
import { api } from "@{{projectName}}/backend/convex/_generated/api";
import type { Id } from "@{{projectName}}/backend/convex/_generated/dataModel";
{{else}}
import { useMutation, useQuery } from "@tanstack/react-query";
{{/if}}

import { Container } from "@/components/container";
{{#unless (eq backend "convex")}}
{{#if (eq api "orpc")}}
import { orpc } from "@/utils/orpc";
{{/if}}
{{#if (eq api "trpc")}}
import { trpc } from "@/utils/trpc";
{{/if}}
{{/unless}}

export default function TodosScreen() {
  const [newTodoText, setNewTodoText] = useState("");
  const { theme } = useUnistyles();

  {{#if (eq backend "convex")}}
  const todos = useQuery(api.todos.getAll);
  const createTodoMutation = useMutation(api.todos.create);
  const toggleTodoMutation = useMutation(api.todos.toggle);
  const deleteTodoMutation = useMutation(api.todos.deleteTodo);

  const handleAddTodo = async () => {
    const text = newTodoText.trim();
    if (!text) return;
    await createTodoMutation({ text });
    setNewTodoText("");
  };

  const handleToggleTodo = (id: Id<"todos">, currentCompleted: boolean) => {
    toggleTodoMutation({ id, completed: !currentCompleted });
  };

  const handleDeleteTodo = (id: Id<"todos">) => {
    Alert.alert("Delete Todo", "Are you sure you want to delete this todo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteTodoMutation({ id }),
      },
    ]);
  };
  {{else}}
    {{#if (eq api "orpc")}}
    const todos = useQuery(orpc.todo.getAll.queryOptions());
    const createMutation = useMutation(
      orpc.todo.create.mutationOptions({
        onSuccess: () => {
          todos.refetch();
          setNewTodoText("");
        },
      })
    );
    const toggleMutation = useMutation(
      orpc.todo.toggle.mutationOptions({
        onSuccess: () => { todos.refetch() },
      })
    );
    const deleteMutation = useMutation(
      orpc.todo.delete.mutationOptions({
        onSuccess: () => { todos.refetch() },
      })
    );
    {{/if}}
    {{#if (eq api "trpc")}}
    const todos = useQuery(trpc.todo.getAll.queryOptions());
    const createMutation = useMutation(
      trpc.todo.create.mutationOptions({
        onSuccess: () => {
          todos.refetch();
          setNewTodoText("");
        },
      })
    );
    const toggleMutation = useMutation(
      trpc.todo.toggle.mutationOptions({
        onSuccess: () => { todos.refetch() },
      })
    );
    const deleteMutation = useMutation(
      trpc.todo.delete.mutationOptions({
        onSuccess: () => { todos.refetch() },
      })
    );
    {{/if}}

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      createMutation.mutate({ text: newTodoText });
    }
  };

  const handleToggleTodo = (id: number, completed: boolean) => {
    toggleMutation.mutate({ id, completed: !completed });
  };

  const handleDeleteTodo = (id: number) => {
    Alert.alert("Delete Todo", "Are you sure you want to delete this todo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteMutation.mutate({ id }),
      },
    ]);
  };
  {{/if}}

  const isLoading = {{#if (eq backend "convex")}}!todos{{else}}todos.isLoading{{/if}};
  const isCreating = {{#if (eq backend "convex")}}false{{else}}createMutation.isPending{{/if}};
  const primaryButtonTextColor = theme.colors.background;

  return (
    <Container>
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Todo List</Text>
          <Text style={styles.headerSubtitle}>
            Manage your tasks efficiently
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              value={newTodoText}
              onChangeText={setNewTodoText}
              placeholder="Add a new task..."
              placeholderTextColor={theme.colors.border}
              editable={!isCreating}
              style={styles.textInput}
              onSubmitEditing={handleAddTodo}
              returnKeyType="done"
            />
            <TouchableOpacity
              onPress={handleAddTodo}
              disabled={isCreating || !newTodoText.trim()}
              style={[
                styles.addButton,
                (isCreating || !newTodoText.trim()) && styles.addButtonDisabled,
              ]}
            >
              {isCreating ? (
                <ActivityIndicator size="small" color={primaryButtonTextColor} />
              ) : (
                <Ionicons
                  name="add"
                  size={24}
                  color={primaryButtonTextColor}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading todos...</Text>
          </View>
        )}

        {{#if (eq backend "convex")}}
          {todos && todos.length === 0 && !isLoading && (
            <Text style={styles.emptyText}>No todos yet. Add one!</Text>
          )}
          {todos?.map((todo) => (
            <View key={todo._id} style={styles.todoItem}>
              <TouchableOpacity
                onPress={() => handleToggleTodo(todo._id, todo.completed)}
                style={styles.todoContent}
              >
                <Ionicons
                  name={todo.completed ? "checkbox" : "square-outline"}
                  size={24}
                  color={todo.completed ? theme.colors.primary : theme.colors.typography}
                  style={styles.checkbox}
                />
                <Text
                  style={[
                    styles.todoText,
                    todo.completed && styles.todoTextCompleted,
                  ]}
                >
                  {todo.text}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteTodo(todo._id)}>
                <Ionicons name="trash-outline" size={24} color={theme.colors.destructive} />
              </TouchableOpacity>
            </View>
          ))}
        {{else}}
          {todos.data && todos.data.length === 0 && !isLoading && (
             <Text style={styles.emptyText}>No todos yet. Add one!</Text>
          )}
          {todos.data?.map((todo: { id: number; text: string; completed: boolean }) => (
            <View key={todo.id} style={styles.todoItem}>
              <TouchableOpacity
                onPress={() => handleToggleTodo(todo.id, todo.completed)}
                style={styles.todoContent}
              >
                <Ionicons
                  name={todo.completed ? "checkbox" : "square-outline"}
                  size={24}
                  color={todo.completed ? theme.colors.primary : theme.colors.typography}
                  style={styles.checkbox}
                />
                <Text
                  style={[
                    styles.todoText,
                    todo.completed && styles.todoTextCompleted,
                  ]}
                >
                  {todo.text}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteTodo(todo.id)}>
                <Ionicons name="trash-outline" size={24} color={theme.colors.destructive} />
              </TouchableOpacity>
            </View>
          ))}
        {{/if}}
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create((theme) => ({
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.typography,
    marginBottom: theme.spacing.sm,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.typography,
    marginBottom: theme.spacing.md,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    color: theme.colors.typography,
    backgroundColor: theme.colors.background,
    marginRight: theme.spacing.sm,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.sm,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  loadingText: {
    marginTop: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.typography,
  },
  emptyText: {
    textAlign: "center",
    marginTop: theme.spacing.xl,
    fontSize: 16,
    color: theme.colors.typography,
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  todoContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  checkbox: {
    marginRight: theme.spacing.md,
  },
  todoText: {
    fontSize: 16,
    color: theme.colors.typography,
    flex: 1,
  },
  todoTextCompleted: {
    textDecorationLine: "line-through",
    color: theme.colors.border,
  },
}));
`],
  ["auth/better-auth/convex/web/react/next/src/components/sign-in-form.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";

export default function SignInForm({
	onSwitchToSignUp,
}: {
	onSwitchToSignUp: () => void;
}) {
	const router = useRouter();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signIn.email(
				{
					email: value.email,
					password: value.password,
				},
				{
					onSuccess: () => {
						router.push("/dashboard");
						toast.success("Sign in successful");
					},
					onError: (error) => {
						toast.error(error.error.message || error.error.statusText);
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				email: z.email("Invalid email address"),
				password: z.string().min(8, "Password must be at least 8 characters"),
			}),
		},
	});

	return (
		<div className="mx-auto w-full mt-10 max-w-md p-6">
			<h1 className="mb-6 text-center text-3xl font-bold">Welcome Back</h1>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-4"
			>
				<div>
					<form.Field name="email">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Email</Label>
								<Input
									id={field.name}
									name={field.name}
									type="email"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								{field.state.meta.errors.map((error) => (
									<p key={error?.message} className="text-red-500">
										{error?.message}
									</p>
								))}
							</div>
						)}
					</form.Field>
				</div>

				<div>
					<form.Field name="password">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Password</Label>
								<Input
									id={field.name}
									name={field.name}
									type="password"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								{field.state.meta.errors.map((error) => (
									<p key={error?.message} className="text-red-500">
										{error?.message}
									</p>
								))}
							</div>
						)}
					</form.Field>
				</div>

				<form.Subscribe>
					{(state) => (
						<Button
							type="submit"
							className="w-full"
							disabled={!state.canSubmit || state.isSubmitting}
						>
							{state.isSubmitting ? "Submitting..." : "Sign In"}
						</Button>
					)}
				</form.Subscribe>
			</form>

			<div className="mt-4 text-center">
				<Button
					variant="link"
					onClick={onSwitchToSignUp}
					className="text-indigo-600 hover:text-indigo-800"
				>
					Need an account? Sign Up
				</Button>
			</div>
		</div>
	);
}
`],
  ["auth/better-auth/convex/web/react/next/src/components/sign-up-form.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";

export default function SignUpForm({
	onSwitchToSignIn,
}: {
	onSwitchToSignIn: () => void;
}) {
	const router = useRouter();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			name: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signUp.email(
				{
					email: value.email,
					password: value.password,
					name: value.name,
				},
				{
					onSuccess: () => {
						router.push("/dashboard");
						toast.success("Sign up successful");
					},
					onError: (error) => {
						toast.error(error.error.message || error.error.statusText);
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				name: z.string().min(2, "Name must be at least 2 characters"),
				email: z.email("Invalid email address"),
				password: z.string().min(8, "Password must be at least 8 characters"),
			}),
		},
	});

	return (
		<div className="mx-auto w-full mt-10 max-w-md p-6">
			<h1 className="mb-6 text-center text-3xl font-bold">Create Account</h1>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-4"
			>
				<div>
					<form.Field name="name">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Name</Label>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								{field.state.meta.errors.map((error) => (
									<p key={error?.message} className="text-red-500">
										{error?.message}
									</p>
								))}
							</div>
						)}
					</form.Field>
				</div>

				<div>
					<form.Field name="email">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Email</Label>
								<Input
									id={field.name}
									name={field.name}
									type="email"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								{field.state.meta.errors.map((error) => (
									<p key={error?.message} className="text-red-500">
										{error?.message}
									</p>
								))}
							</div>
						)}
					</form.Field>
				</div>

				<div>
					<form.Field name="password">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Password</Label>
								<Input
									id={field.name}
									name={field.name}
									type="password"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								{field.state.meta.errors.map((error) => (
									<p key={error?.message} className="text-red-500">
										{error?.message}
									</p>
								))}
							</div>
						)}
					</form.Field>
				</div>

				<form.Subscribe>
					{(state) => (
						<Button
							type="submit"
							className="w-full"
							disabled={!state.canSubmit || state.isSubmitting}
						>
							{state.isSubmitting ? "Submitting..." : "Sign Up"}
						</Button>
					)}
				</form.Subscribe>
			</form>

			<div className="mt-4 text-center">
				<Button
					variant="link"
					onClick={onSwitchToSignIn}
					className="text-indigo-600 hover:text-indigo-800"
				>
					Already have an account? Sign In
				</Button>
			</div>
		</div>
	);
}
`],
  ["auth/better-auth/convex/web/react/next/src/components/user-menu.tsx.hbs", `import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@{{projectName}}/backend/convex/_generated/api";

export default function UserMenu() {
	const router = useRouter();
	const user = useQuery(api.auth.getCurrentUser)

	return (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button variant="outline" />}>
				{user?.name}
			</DropdownMenuTrigger>
			<DropdownMenuContent className="bg-card">
				<DropdownMenuGroup>
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>{user?.email}</DropdownMenuItem>
					<DropdownMenuItem
						variant="destructive"
						onClick={() => {
							authClient.signOut({
								fetchOptions: {
									onSuccess: () => {
										router.push("/dashboard");
									},
								},
							});
						}}
					>
						Sign Out
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
`],
  ["auth/better-auth/web/react/tanstack-start/src/routes/dashboard.tsx.hbs", `import { getUser } from "@/functions/get-user";
{{#if (eq payments "polar") }}
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { getPayment } from "@/functions/get-payment";
{{/if}}
{{#if (eq api "trpc") }}
import { useTRPC } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
{{/if}}
{{#if (eq api "orpc") }}
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
{{/if}}
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getUser();
    {{#if (eq payments "polar") }}
    const customerState = await getPayment();
    return { session, customerState };
    {{else}}
    return { session };
    {{/if}}
  },
  loader: async ({ context }) => {
    if (!context.session) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

function RouteComponent() {
  const { session{{#if (eq payments "polar") }}, customerState{{/if}} } = Route.useRouteContext();

  {{#if (eq api "trpc") }}
  const trpc = useTRPC();
  const privateData = useQuery(trpc.privateData.queryOptions());
  {{/if}}
  {{#if (eq api "orpc") }}
  const privateData = useQuery(orpc.privateData.queryOptions());
  {{/if}}

  {{#if (eq payments "polar") }}
  const hasProSubscription = (customerState?.activeSubscriptions?.length ?? 0) > 0;
  // For debugging: console.log("Active subscriptions:", customerState?.activeSubscriptions);
  {{/if}}

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session?.user.name}</p>
      {{#if (eq api "trpc") }}
      <p>API: {privateData.data?.message}</p>
      {{else if (eq api "orpc") }}
      <p>API: {privateData.data?.message}</p>
      {{/if}}
      {{#if (eq payments "polar") }}
      <p>Plan: {hasProSubscription ? "Pro" : "Free"}</p>
      {hasProSubscription ? (
        <Button
          onClick={async function handlePortal() {
            await authClient.customer.portal();
          }}
        >
          Manage Subscription
        </Button>
      ) : (
        <Button
          onClick={async function handleUpgrade() {
            await authClient.checkout({ slug: "pro" });
          }}
        >
          Upgrade to Pro
        </Button>
      )}
      {{/if}}
    </div>
  );
}`],
  ["auth/better-auth/web/react/tanstack-start/src/routes/login.tsx.hbs", `import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showSignIn, setShowSignIn] = useState(false);

  return showSignIn ? (
    <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
  ) : (
    <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
  );
}
`],
  ["auth/better-auth/web/react/tanstack-start/src/components/sign-in-form.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SignInForm({ onSwitchToSignUp }: { onSwitchToSignUp: () => void }) {
  const navigate = useNavigate({
    from: "/",
  });
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            navigate({
              to: "/dashboard",
            });
            toast.success("Sign in successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="mx-auto w-full mt-10 max-w-md p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Welcome Back</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div>
          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe>
          {(state) => (
            <Button
              type="submit"
              className="w-full"
              disabled={!state.canSubmit || state.isSubmitting}
            >
              {state.isSubmitting ? "Submitting..." : "Sign In"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-4 text-center">
        <Button
          variant="link"
          onClick={onSwitchToSignUp}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Need an account? Sign Up
        </Button>
      </div>
    </div>
  );
}
`],
  ["auth/better-auth/web/react/tanstack-start/src/components/sign-up-form.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SignUpForm({ onSwitchToSignIn }: { onSwitchToSignIn: () => void }) {
  const navigate = useNavigate({
    from: "/",
  });
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: () => {
            navigate({
              to: "/dashboard",
            });
            toast.success("Sign up successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="mx-auto w-full mt-10 max-w-md p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Create Account</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div>
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe>
          {(state) => (
            <Button
              type="submit"
              className="w-full"
              disabled={!state.canSubmit || state.isSubmitting}
            >
              {state.isSubmitting ? "Submitting..." : "Sign Up"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-4 text-center">
        <Button
          variant="link"
          onClick={onSwitchToSignIn}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Already have an account? Sign In
        </Button>
      </div>
    </div>
  );
}
`],
  ["auth/better-auth/web/react/tanstack-start/src/components/user-menu.tsx.hbs", `import { Link, useNavigate } from "@tanstack/react-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export default function UserMenu() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <Skeleton className="h-9 w-24" />;
  }

  if (!session) {
    return (
      <Link to="/login">
        <Button variant="outline">Sign In</Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        {session.user.name}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>{session.user.email}</DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    navigate({
                      to: "/",
                    });
                  },
                },
              });
            }}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
`],
  ["api/orpc/fullstack/nuxt/app/plugins/orpc.server.ts.hbs", `import { createRouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { appRouter } from "@{{projectName}}/api/routers/index";
import { createContext } from "@{{projectName}}/api/context";

export default defineNuxtPlugin(async () => {
  const event = useRequestEvent();

  const context = await createContext({
    headers: event?.headers ?? new Headers(),
  });

  const client = createRouterClient(appRouter, {
    context,
  });

  const orpc = createTanstackQueryUtils(client);

  return {
    provide: {
      orpc,
    },
  };
});
`],
  ["api/orpc/fullstack/nuxt/app/plugins/orpc.client.ts.hbs", `import type { AppRouterClient } from "@{{projectName}}/api/routers/index";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

export default defineNuxtPlugin(() => {
  const rpcLink = new RPCLink({
    url: \`\${window.location.origin}/rpc\`,
    {{#if (eq auth "better-auth")}}
    fetch(url, options) {
        return fetch(url, {
        ...options,
        credentials: "include",
        });
    },
    {{/if}}
  });

  const client: AppRouterClient = createORPCClient(rpcLink);
  const orpcUtils = createTanstackQueryUtils(client);

  return {
    provide: {
      orpc: orpcUtils,
    },
  };
});
`],
  ["auth/better-auth/web/react/tanstack-start/src/functions/get-user.ts.hbs", `import { authMiddleware } from "@/middleware/auth";
import { createServerFn } from "@tanstack/react-start";

export const getUser = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(async ({ context }) => {
    return context.session
})`],
  ["auth/better-auth/web/react/tanstack-start/src/middleware/auth.ts.hbs", `{{#if (eq backend "self")}}
import { auth } from "@{{projectName}}/auth";
import { createMiddleware } from "@tanstack/react-start";


export const authMiddleware = createMiddleware().server(async ({ next, request }) => {
    const session = await auth.api.getSession({
        headers: request.headers,
    })
    return next({
        context: { session }
    })
})
{{else}}
import { authClient } from "@/lib/auth-client";
import { createMiddleware } from "@tanstack/react-start";

export const authMiddleware = createMiddleware().server(
	async ({ next, request }) => {
		const session = await authClient.getSession({
			fetchOptions: {
				headers: request.headers,
				throw: true
			}
		})
		return next({
			context: { session },
		});
	},
);
{{/if}}
`],
  ["payments/polar/web/svelte/src/routes/success/+page.svelte.hbs", `<script lang="ts">
	import { page } from '$app/state';
	
	const checkout_id = $derived(page.url.searchParams.get('checkout_id'));
</script>

<div class="container mx-auto px-4 py-8">
	<h1>Payment Successful!</h1>
	{#if checkout_id}
		<p>Checkout ID: {checkout_id}</p>
	{/if}
</div>
`],
  ["examples/todo/server/prisma/mongodb/prisma/schema/todo.prisma.hbs", `model Todo {
  id        String  @id @default(auto()) @map("_id") @db.ObjectId
  text      String
  completed Boolean @default(false)

  @@map("todo")
}
`],
  ["db/prisma/sqlite/prisma/schema/schema.prisma.hbs", `generator client {
  provider = "prisma-client"
  output   = "../generated"
  moduleFormat = "esm"
  {{#if (eq runtime "bun")}}
  runtime = "bun"
  {{/if}}
  {{#if (eq runtime "node")}}
  runtime = "nodejs"
  {{/if}}
  {{#if (or (eq runtime "workers") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
  runtime = "workerd"
  {{/if}}
}

datasource db {
  provider = "sqlite"
}
`],
  ["api/trpc/fullstack/next/src/app/api/trpc/[trpc]/route.ts.hbs", `import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@{{projectName}}/api/routers/index";
import { createContext } from "@{{projectName}}/api/context";
import { NextRequest } from "next/server";

function handler(req: NextRequest) {
	return fetchRequestHandler({
		endpoint: "/api/trpc",
		req,
		router: appRouter,
		createContext: () => createContext(req),
	});
}
export { handler as GET, handler as POST };
`],
  ["auth/clerk/convex/native/base/app/(auth)/sign-in.tsx.hbs", `import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import React from "react";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View>
      <Text>Sign in</Text>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <TouchableOpacity onPress={onSignInPress}>
        <Text>Continue</Text>
      </TouchableOpacity>
      <View style=\\{{ display: "flex", flexDirection: "row", gap: 3 }}>
        <Text>Don't have an account?</Text>
        <Link href="/sign-up">
          <Text>Sign up</Text>
        </Link>
      </View>
    </View>
  );
}
`],
  ["auth/clerk/convex/native/base/app/(auth)/_layout.tsx.hbs", `import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/"} />;
  }

  return <Stack />;
}
`],
  ["auth/clerk/convex/native/base/app/(auth)/sign-up.tsx.hbs", `import * as React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    console.log(emailAddress, password);

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <>
        <Text>Verify your email</Text>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />
        <TouchableOpacity onPress={onVerifyPress}>
          <Text>Verify</Text>
        </TouchableOpacity>
      </>
    );
  }

  return (
    <View>
      <Text>Sign up</Text>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(email) => setEmailAddress(email)}
      />
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <TouchableOpacity onPress={onSignUpPress}>
        <Text>Continue</Text>
      </TouchableOpacity>
      <View style=\\{{ display: "flex", flexDirection: "row", gap: 3 }}>
        <Text>Already have an account?</Text>
        <Link href="/sign-in">
          <Text>Sign in</Text>
        </Link>
      </View>
    </View>
  );
}
`],
  ["auth/better-auth/convex/web/react/next/src/app/dashboard/page.tsx.hbs", `"use client"

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import UserMenu from "@/components/user-menu";
import { api } from "@{{projectName}}/backend/convex/_generated/api";
import {
    Authenticated,
    AuthLoading,
    Unauthenticated,
    useQuery,
} from "convex/react";
import { useState } from "react";

export default function DashboardPage() {
    const [showSignIn, setShowSignIn] = useState(false);
    const privateData = useQuery(api.privateData.get);

    return (
        <>
            <Authenticated>
                <div>
                    <h1>Dashboard</h1>
                    <p>privateData: {privateData?.message}</p>
                    <UserMenu />
                </div>
            </Authenticated>
            <Unauthenticated>
                {showSignIn ? (
                    <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
                ) : (
                    <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
                )}
            </Unauthenticated>
            <AuthLoading>
                <div>Loading...</div>
            </AuthLoading>
        </>
    );
}
`],
  ["auth/better-auth/web/react/tanstack-router/src/components/sign-in-form.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SignInForm({ onSwitchToSignUp }: { onSwitchToSignUp: () => void }) {
  const navigate = useNavigate({
    from: "/",
  });
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            navigate({
              to: "/dashboard",
            });
            toast.success("Sign in successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="mx-auto w-full mt-10 max-w-md p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Welcome Back</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div>
          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe>
          {(state) => (
            <Button
              type="submit"
              className="w-full"
              disabled={!state.canSubmit || state.isSubmitting}
            >
              {state.isSubmitting ? "Submitting..." : "Sign In"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-4 text-center">
        <Button
          variant="link"
          onClick={onSwitchToSignUp}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Need an account? Sign Up
        </Button>
      </div>
    </div>
  );
}
`],
  ["auth/better-auth/web/react/tanstack-router/src/components/sign-up-form.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SignUpForm({ onSwitchToSignIn }: { onSwitchToSignIn: () => void }) {
  const navigate = useNavigate({
    from: "/",
  });
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: () => {
            navigate({
              to: "/dashboard",
            });
            toast.success("Sign up successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="mx-auto w-full mt-10 max-w-md p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Create Account</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div>
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe>
          {(state) => (
            <Button
              type="submit"
              className="w-full"
              disabled={!state.canSubmit || state.isSubmitting}
            >
              {state.isSubmitting ? "Submitting..." : "Sign Up"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-4 text-center">
        <Button
          variant="link"
          onClick={onSwitchToSignIn}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Already have an account? Sign In
        </Button>
      </div>
    </div>
  );
}
`],
  ["auth/better-auth/web/react/tanstack-router/src/components/user-menu.tsx.hbs", `import { Link, useNavigate } from "@tanstack/react-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export default function UserMenu() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <Skeleton className="h-9 w-24" />;
  }

  if (!session) {
    return (
      <Link to="/login">
        <Button variant="outline">Sign In</Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        {session.user.name}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>{session.user.email}</DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    navigate({
                      to: "/",
                    });
                  },
                },
              });
            }}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
`],
  ["auth/clerk/convex/native/base/components/sign-out-button.tsx.hbs", `import { useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

export const SignOutButton = () => {
  // Use \`useClerk()\` to access the \`signOut()\` function
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to your desired page
      router.replace("/");
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <TouchableOpacity onPress={handleSignOut}>
      <Text>Sign out</Text>
    </TouchableOpacity>
  );
};
`],
  ["auth/better-auth/server/db/prisma/mysql/prisma/schema/auth.prisma.hbs", `model User {
  id            String    @id
  name          String    @db.Text
  email         String
  emailVerified Boolean   @default(false)
  image         String?   @db.Text
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]

  @@unique([email])
  @@map("user")
}

model Session {
  id        String   @id
  expiresAt DateTime
  token     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ipAddress String?  @db.Text
  userAgent String?  @db.Text
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([token])
  @@index([userId(length: 191)])
  @@map("session")
}

model Account {
  id                    String    @id
  accountId             String    @db.Text
  providerId            String    @db.Text
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?   @db.Text
  refreshToken          String?   @db.Text
  idToken               String?   @db.Text
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?   @db.Text
  password              String?   @db.Text
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([userId(length: 191)])
  @@map("account")
}

model Verification {
  id         String   @id
  identifier String   @db.Text
  value      String   @db.Text
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([identifier(length: 191)])
  @@map("verification")
}
`],
  ["examples/todo/web/svelte/src/routes/todos/+page.svelte.hbs", `{{#if (eq backend "convex")}}
<script lang="ts">
	import { useQuery, useConvexClient } from 'convex-svelte';
	import { api } from '@{{projectName}}/backend/convex/_generated/api';
	import type { Id } from '@{{projectName}}/backend/convex/_generated/dataModel';

	let newTodoText = $state('');
	let isAdding = $state(false);
	let addError = $state<Error | null>(null);
	let togglingId = $state<Id<'todos'> | null>(null);
	let toggleError = $state<Error | null>(null);
	let deletingId = $state<Id<'todos'> | null>(null);
	let deleteError = $state<Error | null>(null);

	const client = useConvexClient();

	const todosQuery = useQuery(api.todos.getAll, {});

	async function handleAddTodo(event: SubmitEvent) {
		event.preventDefault();
		const text = newTodoText.trim();
		if (!text || isAdding) return;

		isAdding = true;
		addError = null;
		try {
			await client.mutation(api.todos.create, { text });
			newTodoText = '';
		} catch (err) {
			console.error('Failed to add todo:', err);
			addError = err instanceof Error ? err : new Error(String(err));
		} finally {
			isAdding = false;
		}
	}

	async function handleToggleTodo(id: Id<'todos'>, completed: boolean) {
		if (togglingId === id || deletingId === id) return;

		togglingId = id;
		toggleError = null;
		try {
			await client.mutation(api.todos.toggle, { id, completed: !completed });
		} catch (err) {
			console.error('Failed to toggle todo:', err);
			toggleError = err instanceof Error ? err : new Error(String(err));
		} finally {
			if (togglingId === id) {
				togglingId = null;
			}
		}
	}

	async function handleDeleteTodo(id: Id<'todos'>) {
		if (togglingId === id || deletingId === id) return;

		deletingId = id;
		deleteError = null;
		try {
			await client.mutation(api.todos.deleteTodo, { id });
		} catch (err) {
			console.error('Failed to delete todo:', err);
			deleteError = err instanceof Error ? err : new Error(String(err));
		} finally {
			if (deletingId === id) {
				deletingId = null;
			}
		}
	}

	const canAdd = $derived(!isAdding && newTodoText.trim().length > 0);
	const isLoadingTodos = $derived(todosQuery.isLoading);
	const todos = $derived(todosQuery.data ?? []);
	const hasTodos = $derived(todos.length > 0);

</script>

<div class="p-4">
	<h1 class="text-xl mb-4">Todos (Convex)</h1>

	<form onsubmit={handleAddTodo} class="flex gap-2 mb-4">
		<input
			type="text"
			bind:value={newTodoText}
			placeholder="New task..."
			disabled={isAdding}
			class="p-1 flex-grow"
		/>
		<button
			type="submit"
			disabled={!canAdd}
			class="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
		>
			{#if isAdding}Adding...{:else}Add{/if}
		</button>
	</form>

	{#if isLoadingTodos}
		<p>Loading...</p>
	{:else if !hasTodos}
		<p>No todos yet.</p>
	{:else}
		<ul class="space-y-1">
			{#each todos as todo (todo._id)}
				{@const isTogglingThis = togglingId === todo._id}
				{@const isDeletingThis = deletingId === todo._id}
				{@const isDisabled = isTogglingThis || isDeletingThis}
				<li
					class="flex items-center justify-between p-2"
					class:opacity-50={isDisabled}
				>
					<div class="flex items-center gap-2">
						<input
							type="checkbox"
							id={\`todo-\${todo._id}\`}
							checked={todo.completed}
							onchange={() => handleToggleTodo(todo._id, todo.completed)}
							disabled={isDisabled}
						/>
						<label
							for={\`todo-\${todo._id}\`}
							class:line-through={todo.completed}
						>
							{todo.text}
						</label>
					</div>
					<button
						type="button"
						onclick={() => handleDeleteTodo(todo._id)}
						disabled={isDisabled}
						aria-label="Delete todo"
						class="text-red-500 px-1 disabled:opacity-50"
					>
						{#if isDeletingThis}Deleting...{:else}X{/if}
					</button>
				</li>
			{/each}
		</ul>
	{/if}

	{#if todosQuery.error}
		<p class="mt-4 text-red-500">
			Error loading: {todosQuery.error?.message ?? 'Unknown error'}
		</p>
	{/if}
	{#if addError}
		<p class="mt-4 text-red-500">
			Error adding: {addError.message ?? 'Unknown error'}
		</p>
	{/if}
	{#if toggleError}
		<p class="mt-4 text-red-500">
			Error updating: {toggleError.message ?? 'Unknown error'}
		</p>
	{/if}
	{#if deleteError}
		<p class="mt-4 text-red-500">
			Error deleting: {deleteError.message ?? 'Unknown error'}
		</p>
	{/if}
</div>
{{else}}
<script lang="ts">
	{{#if (eq api "orpc")}}
	import { orpc } from '$lib/orpc';
	{{/if}}
	import { createQuery, createMutation } from '@tanstack/svelte-query';

	let newTodoText = $state('');

	{{#if (eq api "orpc")}}
	const todosQuery = createQuery(orpc.todo.getAll.queryOptions());

	const addMutation = createMutation(
		orpc.todo.create.mutationOptions({
			onSuccess: () => {
				$todosQuery.refetch();
				newTodoText = '';
			},
			onError: (error) => {
				console.error('Failed to create todo:', error?.message ?? error);
			},
		})
	);

	const toggleMutation = createMutation(
		orpc.todo.toggle.mutationOptions({
			onSuccess: () => {
				$todosQuery.refetch();
			},
			onError: (error) => {
				console.error('Failed to toggle todo:', error?.message ?? error);
			},
		})
	);

	const deleteMutation = createMutation(
		orpc.todo.delete.mutationOptions({
			onSuccess: () => {
				$todosQuery.refetch();
			},
			onError: (error) => {
				console.error('Failed to delete todo:', error?.message ?? error);
			},
		})
	);
	{{/if}}

	function handleAddTodo(event: SubmitEvent) {
		event.preventDefault();
		const text = newTodoText.trim();
		if (text) {
			$addMutation.mutate({ text });
		}
	}

	function handleToggleTodo(id: number, completed: boolean) {
		$toggleMutation.mutate({ id, completed: !completed });
	}

	function handleDeleteTodo(id: number) {
		$deleteMutation.mutate({ id });
	}

	const isAdding = $derived($addMutation.isPending);
	const canAdd = $derived(!isAdding && newTodoText.trim().length > 0);
	const isLoadingTodos = $derived($todosQuery.isLoading);
	const todos = $derived($todosQuery.data ?? []);
	const hasTodos = $derived(todos.length > 0);

</script>

<div class="p-4">
	<h1 class="text-xl mb-4">Todos{{#if (eq api "orpc")}} (oRPC){{/if}}</h1>

	<form onsubmit={handleAddTodo} class="flex gap-2 mb-4">
		<input
			type="text"
			bind:value={newTodoText}
			placeholder="New task..."
			disabled={isAdding}
			class=" p-1 flex-grow"
		/>
		<button
			type="submit"
			disabled={!canAdd}
			class="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
		>
			{#if isAdding}Adding...{:else}Add{/if}
		</button>
	</form>

	{#if isLoadingTodos}
		<p>Loading...</p>
	{:else if !hasTodos}
		<p>No todos yet.</p>
	{:else}
		<ul class="space-y-1">
			{#each todos as todo (todo.id)}
				{@const isToggling = $toggleMutation.isPending && $toggleMutation.variables?.id === todo.id}
				{@const isDeleting = $deleteMutation.isPending && $deleteMutation.variables?.id === todo.id}
				{@const isDisabled = isToggling || isDeleting}
				<li
					class="flex items-center justify-between p-2 "
					class:opacity-50={isDisabled}
				>
					<div class="flex items-center gap-2">
						<input
							type="checkbox"
							id={\`todo-\${todo.id}\`}
							checked={todo.completed}
							onchange={() => handleToggleTodo(todo.id, todo.completed)}
							disabled={isDisabled}
						/>
						<label
							for={\`todo-\${todo.id}\`}
							class:line-through={todo.completed}
						>
							{todo.text}
						</label>
					</div>
					<button
						type="button"
						onclick={() => handleDeleteTodo(todo.id)}
						disabled={isDisabled}
						aria-label="Delete todo"
						class="text-red-500 px-1 disabled:opacity-50"
					>
						{#if isDeleting}Deleting...{:else}X{/if}
					</button>
				</li>
			{/each}
		</ul>
	{/if}

	{#if $todosQuery.isError}
		<p class="mt-4 text-red-500">
			Error loading: {$todosQuery.error?.message ?? 'Unknown error'}
		</p>
	{/if}
	{#if $addMutation.isError}
		<p class="mt-4 text-red-500">
			Error adding: {$addMutation.error?.message ?? 'Unknown error'}
		</p>
	{/if}
	{#if $toggleMutation.isError}
		<p class="mt-4 text-red-500">
			Error updating: {$toggleMutation.error?.message ?? 'Unknown error'}
		</p>
	{/if}
	{#if $deleteMutation.isError}
		<p class="mt-4 text-red-500">
			Error deleting: {$deleteMutation.error?.message ?? 'Unknown error'}
		</p>
	{/if}
</div>
{{/if}}
`],
  ["auth/better-auth/convex/web/react/next/src/app/api/auth/[...all]/route.ts.hbs", `import { handler } from "@/lib/auth-server";

export const { GET, POST } = handler;
`],
  ["examples/ai/fullstack/tanstack-start/src/routes/api/ai/$.ts.hbs", `import { createFileRoute } from "@tanstack/react-router";
import { google } from "@ai-sdk/google";
import { streamText, type UIMessage, convertToModelMessages, wrapLanguageModel } from "ai";
import { devToolsMiddleware } from "@ai-sdk/devtools";

export const Route = createFileRoute("/api/ai/$")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages }: { messages: UIMessage[] } = await request.json();

          const model = wrapLanguageModel({
            model: google("gemini-2.5-flash"),
            middleware: devToolsMiddleware(),
          });
          const result = streamText({
            model,
            messages: await convertToModelMessages(messages),
          });

          return result.toUIMessageStreamResponse();
        } catch (error) {
          console.error("AI API error:", error);
          return new Response(
            JSON.stringify({ error: "Failed to process AI request" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      },
    },
  },
});
`],
  ["api/orpc/fullstack/nuxt/server/routes/rpc/index.ts.hbs", `export { default } from "./[...]";
`],
  ["api/orpc/fullstack/nuxt/server/routes/rpc/[...].ts.hbs", `import { RPCHandler } from "@orpc/server/fetch";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { BatchHandlerPlugin } from "@orpc/server/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod";
import { appRouter } from "@{{projectName}}/api/routers/index";
import { createContext } from "@{{projectName}}/api/context";

const rpcHandler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
  plugins: [new BatchHandlerPlugin()],
});

const apiHandler = new OpenAPIHandler(appRouter, {
  plugins: [
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
  ],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

export default defineEventHandler(async (event) => {
  const request = toWebRequest(event);
  const context = await createContext({ headers: request.headers });

  const rpcResult = await rpcHandler.handle(request, {
    prefix: "/rpc",
    context,
  });
  if (rpcResult.response) return rpcResult.response;

  const apiResult = await apiHandler.handle(request, {
    prefix: "/rpc/api-reference",
    context,
  });
  if (apiResult.response) return apiResult.response;

  setResponseStatus(event, 404, "Not Found");
  return "Not found";
});
`],
  ["auth/better-auth/fullstack/tanstack-start/src/routes/api/auth/$.ts.hbs", `import { auth } from '@{{projectName}}/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: ({ request }) => {
        return auth.handler(request)
      },
      POST: ({ request }) => {
        return auth.handler(request)
      },
    },
  },
})
`]
]);

export const TEMPLATE_COUNT = 414;
