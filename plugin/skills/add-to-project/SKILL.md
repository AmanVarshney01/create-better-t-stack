---
name: add-to-project
description: Add addons, features, or another frontend app (PWA, Tauri, Starlight/Fumadocs docs, Biome/Oxlint, Husky/Lefthook, Turborepo/Nx, the MCP addon, an admin/landing app, etc.) to an existing Better-T-Stack project. Use when the user wants to extend, enhance, or add tooling or apps to a project that was created with Better-T-Stack.
metadata:
  priority: 7
  docs:
    - "https://better-t-stack.dev/docs"
  pathPatterns:
    - "bts.jsonc"
---

# Add addons to an existing Better-T-Stack project

Use the Better-T-Stack MCP server to install addons into an existing project rather than wiring the tooling by hand.

## When this applies

The user already has a Better-T-Stack project (look for a `bts.jsonc` config) and wants to add tooling, features, or another frontend app — e.g. "add PWA support", "add a docs site", "switch to Biome", "add Turborepo", "wire up the MCP addon", "add an admin panel app".

For brand-new projects, use the **scaffold-project** skill instead.

## Workflow

1. **Confirm the target project** is a Better-T-Stack project and identify its directory.
2. **Plan.** Call `bts_plan_addons` with the desired addon set (and any nested `addonOptions`). This is a dry run — review the planned changes with the user.
3. **Apply.** Only after the plan succeeds and matches intent, call `bts_add_addons`.
4. **Report** what changed and the follow-up commands to run.

## Adding another frontend app

When the user wants an additional app surface (admin panel, landing page, storefront) rather than an addon, use `bts_plan_app` → `bts_add_app` with `{ name, frontend }`. The framework may differ from the existing web app but is validated against the project's api/auth/backend (tRPC and Clerk projects accept React-family frameworks only; fullstack `self` projects cannot add apps). The new app lands in `apps/<name>` with its own dev port; relay the manual CORS/auth origin steps the tool returns.

## Available addons

`pwa`, `tauri`, `electrobun`, `starlight`, `biome`, `lefthook`, `husky`, `mcp`, `turborepo`, `nx`, `vite-plus`, `fumadocs`, `ultracite`, `oxlint`, `opentui`, `wxt`, `skills`, `evlog`.

Note: `nx`, `turborepo`, and `vite-plus` are mutually exclusive task runners. Use `bts_get_schema` for nested addon options (e.g. Fumadocs templates/search/AI chat, WXT templates, OpenTUI templates).

## Rules

- Always `bts_plan_addons` before `bts_add_addons`, and `bts_plan_app` before `bts_add_app`.
- Don't add addons or apps the user didn't ask for.
- Surface any conflicts (e.g. two task runners) from the plan before applying.
