---
name: add-to-project
description: Add addons or features (PWA, Tauri, Starlight/Fumadocs docs, Biome/Oxlint, Husky/Lefthook, Turborepo/Nx, the MCP addon, etc.) to an existing Better-T-Stack project. Use when the user wants to extend, enhance, or add tooling to a project that was created with Better-T-Stack.
metadata:
  priority: 7
  docs:
    - "https://better-t-stack.dev/docs"
  pathPatterns:
    - "bts.jsonc"
    - "better-t-stack.jsonc"
---

# Add addons to an existing Better-T-Stack project

Use the Better-T-Stack MCP server to install addons into an existing project rather than wiring the tooling by hand.

## When this applies

The user already has a Better-T-Stack project (look for a `bts.jsonc` / `better-t-stack.jsonc` config) and wants to add tooling or features — e.g. "add PWA support", "add a docs site", "switch to Biome", "add Turborepo", "wire up the MCP addon".

For brand-new projects, use the **scaffold-project** skill instead.

## Workflow

1. **Confirm the target project** is a Better-T-Stack project and identify its directory.
2. **Plan.** Call `bts_plan_addons` with the desired addon set (and any nested `addonOptions`). This is a dry run — review the planned changes with the user.
3. **Apply.** Only after the plan succeeds and matches intent, call `bts_add_addons`.
4. **Report** what changed and the follow-up commands to run.

## Available addons

`pwa`, `tauri`, `electrobun`, `starlight`, `biome`, `lefthook`, `husky`, `mcp`, `turborepo`, `nx`, `vite-plus`, `fumadocs`, `ultracite`, `oxlint`, `opentui`, `wxt`, `skills`, `evlog`.

Note: `nx`, `turborepo`, and `vite-plus` are mutually exclusive task runners. Use `bts_get_schema` for nested addon options (e.g. Fumadocs templates/search/AI chat, WXT templates, OpenTUI templates).

## Rules

- Always `bts_plan_addons` before `bts_add_addons`.
- Don't add addons the user didn't ask for.
- Surface any conflicts (e.g. two task runners) from the plan before applying.
