---
name: add-to-project
description: Add addons, features, or a workspace package (PWA, Tauri, Starlight/Fumadocs docs, Biome/Oxlint/Ultracite, Husky/Lefthook, Turborepo/Nx, the MCP or Skills addon, `packages/<name>`, etc.) to an existing Better-T-Stack project. Use when the user wants to extend, enhance, or add tooling to a project that has a `bts.jsonc` file.
metadata:
  priority: 7
  docs:
    - "https://better-t-stack.dev/docs"
  pathPatterns:
    - "bts.jsonc"
---

# Add to an existing Better-T-Stack project

Use Better-T-Stack to install addons or scaffold workspace packages into an existing project rather than wiring the tooling by hand.

## When this applies

The project has a `bts.jsonc` at its root and the user wants to add tooling, features, or a shared package — e.g. "add PWA support", "add a docs site", "switch to Biome", "add Turborepo", "wire up the MCP addon", "add a shared package".

For brand-new projects, use the **scaffold-project** skill instead.

## `bts.jsonc`

`bts.jsonc` records the stack chosen at creation (frontend, backend, database, addons, `addonOptions`, …) plus a `reproducibleCommand` that recreates the project. The add flow reads it to detect the stack.

- **Read it first** to understand the current stack before planning.
- **Never edit it by hand** to "enable" something — the add flow updates it.
- If it's missing, the add flow can't run. Tell the user rather than recreating it by guesswork.

## Workflow

1. **Confirm the target project** and its directory (where `bts.jsonc` lives).
2. **Check valid values** for any nested options: MCP `bts_get_schema`, or CLI `npx create-better-t-stack@latest schema --name addonOptions` (also `addInput`).
3. **Plan (dry run).**
   - MCP: `bts_plan_addons` with `projectDir` and `addons` (plus `addonOptions`) and/or `package`.
   - CLI (no MCP):
     ```bash
     npx create-better-t-stack@latest add-json --input '{
       "projectDir": "./my-app",
       "addons": ["pwa", "biome"],
       "dryRun": true
     }'
     ```
   Review the planned changes with the user.
4. **Apply** only after the plan succeeds and matches intent: MCP `bts_add_addons`, or re-run `add-json` without `dryRun`.
5. **Report** what changed and the follow-up commands (e.g. `<packageManager> install`).

For a command the user can run themselves: `bunx create-better-t-stack@latest add --addons pwa biome` (use the project's package manager runner).

## Workspace packages

`package: "<name>"` (CLI: `add --package <name>`) scaffolds `packages/<name>` with a package manifest, the shared TypeScript config, and `src/index.ts`. Both the MCP add tools and `add-json` accept it.

## Available addons

`pwa`, `tauri`, `electrobun`, `starlight`, `biome`, `lefthook`, `husky`, `mcp`, `turborepo`, `nx`, `vite-plus`, `fumadocs`, `ultracite`, `oxlint`, `opentui`, `wxt`, `skills`, `evlog`, `axiom`.

Nested options live in `addonOptions` (Fumadocs template/search/AI chat, WXT template, OpenTUI template, MCP servers/agents, Skills sources). `nx`, `turborepo`, and `vite-plus` are mutually exclusive task runners.

## Rules

- Always plan/dry-run before applying.
- Don't add addons the user didn't ask for.
- Surface conflicts from the plan (e.g. two task runners, an addon already installed) before applying.
- Never hand-edit `bts.jsonc`.
