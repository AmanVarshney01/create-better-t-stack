---
name: add-to-project
description: Add addons, tooling or a workspace package to an existing Better-T-Stack project, such as PWA, Tauri, Starlight or Fumadocs docs, Biome, Oxlint, Ultracite, Husky, Lefthook, Turborepo, Nx, the MCP or Skills addon, or a shared `packages/<name>`. Use when the project has a `bts.jsonc` file and the user wants to extend it or add tooling.
metadata:
  priority: 7
  docs:
    - "https://better-t-stack.dev/docs"
  pathPatterns:
    - "bts.jsonc"
---

# Add to an existing Better-T-Stack project

Add tooling to a Better-T-Stack project with its `add` flow instead of wiring it by hand. For a new project, use the **scaffold-project** skill.

`bts.jsonc` at the project root records the stack chosen at creation and a `reproducibleCommand` that recreates it. The `add` flow reads it to detect the stack and updates it afterwards.

## Pick the interface

- `bts_add_addons` tool: the local MCP server.
- A shell: the CLI's `add-json`.
- Neither: give the user the command `bunx create-better-t-stack@latest add --addons <names>`, using the project's package runner.

The hosted MCP server can't change an existing project.

## Steps

1. **Read `bts.jsonc`.** It tells you the current stack. If it's missing, `add` can't run. Tell the user instead of recreating the file. Never edit it by hand.
2. **Check nested options.** Some addons take options in `addonOptions`: the Fumadocs template, search and AI chat, the WXT and OpenTUI templates, the MCP addon's servers and agents, and the Skills addon's sources. Get their shape from `bts_get_schema` or `npx create-better-t-stack@latest schema --name addonOptions`.
3. **Plan.** Call `bts_plan_addons`, or run:

   ```bash
   npx create-better-t-stack@latest add-json --json '{
     "projectDir": "./my-app",
     "addons": ["pwa", "biome"],
     "dryRun": true
   }'
   ```

   Pass `addons`, a workspace `package` name, or both. Show the user what will change, including any conflict the plan reports.

4. **Apply** after the user agrees: `bts_add_addons`, or `add-json` without `dryRun`.
5. **Prove it runs.** Run `<packageManager> install`. With the user's OK, run the project's typecheck or build script. Report the exact error if a step fails.
6. **Report** what changed and the follow-up commands.

## What can be added

Addons: `pwa`, `tauri`, `electrobun`, `starlight`, `fumadocs`, `biome`, `oxlint`, `ultracite`, `husky`, `lefthook`, `turborepo`, `nx`, `vite-plus`, `mcp`, `skills`, `opentui`, `wxt`, `evlog`.

- `turborepo`, `nx` and `vite-plus` are task runners. A project can have one.
- `axiom` can't be added later. It sets up deployment infrastructure, so it must be chosen at creation. If the user asks for it, say so instead of planning it.
- A workspace package (`package: "shared"`, or `add --package shared`) scaffolds `packages/shared` with a manifest, the shared tsconfig and `src/index.ts`.

## Rules

- Plan before every apply.
- Don't add addons the user didn't ask for.
- Never hand-edit `bts.jsonc`.
