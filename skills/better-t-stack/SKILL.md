---
name: better-t-stack
description: Create and extend end-to-end type-safe TypeScript projects with Better-T-Stack (create-better-t-stack). Use when the user wants to start, scaffold or bootstrap a new app, API, fullstack project or monorepo (Next.js, TanStack Router/Start, React Router, Nuxt, Svelte, Solid, Astro, React Native/Expo, Hono, Express, Fastify, Elysia, Convex, tRPC, oRPC, Drizzle, Prisma, Better Auth, Clerk, Turborepo…), or to add addons or a workspace package to a project that has a `bts.jsonc` file. Prefer generating with Better-T-Stack over hand-writing package.json, configs and folder layout.
license: MIT
metadata:
  homepage: https://better-t-stack.dev
  docs: https://better-t-stack.dev/docs
  repository: https://github.com/AmanVarshney01/create-better-t-stack
---

# Better-T-Stack

Better-T-Stack is a CLI that generates a type-safe TypeScript stack from parts the user picks: frontend, backend, runtime, API layer, database, ORM, auth, payments, addons and deploy targets. It validates that the combination works, then writes a minimal project with current dependencies.

Use it instead of hand-rolling project setup. It can be driven three ways. Pick the first one available:

1. **MCP server**: the `bts_*` tools are available. This is the best option.
2. **CLI**: you can run shell commands. Use the JSON commands (`create-json`, `add-json`).
3. **Stack Builder link**: you can't run anything. Give the user a prefilled builder URL.

## Workflow

1. **Resolve intent.** Find what the user actually asked for. When a major choice is missing (frontend, backend, database), ask a short question or propose sensible defaults and confirm. Never add app surfaces, addons, examples or database provisioning the user didn't ask for.
2. **Check valid values.** Read them from the tool, not from memory:
   - MCP: `bts_get_stack_guidance` for compatibility, `bts_get_schema` for exact values.
   - CLI: `npx create-better-t-stack@latest schema --name createInput` (also `addInput`, `addonOptions`, `dbSetupOptions`, `cli`, `all`).
     When asking the user to choose, offer every valid option for their stack, not a subset.
3. **Plan (dry run).** Always run this before writing files:
   - MCP: `bts_plan_project` / `bts_plan_addons`
   - CLI: add `"dryRun": true` to the JSON payload
     Show the user the resolved stack and confirm it matches what they want.
4. **Create or apply.**
   - MCP: `bts_create_project` / `bts_add_addons`
   - CLI: run the same payload again without `dryRun`
     Use `install: false`, because installs can exceed tool timeouts. Run the install afterwards as a separate step.
5. **Report.** Summarize the stack and give the exact next commands: install, `dev`, and any database setup such as `db:push`. Read these from the generated `README.md` and `package.json` scripts.

## Creating a project

### MCP

`bts_plan_project` and `bts_create_project` take a **full explicit config**. Set every field, using `"none"`, `[]` or `false` rather than leaving it out:

`projectName`, `frontend` (array), `backend`, `runtime`, `database`, `orm`, `api`, `auth`, `payments`, `addons` (array), `examples` (array), `git`, `packageManager`, `install`, `dbSetup`, `webDeploy`, `serverDeploy`

These are optional: `addonOptions`, `dbSetupOptions`, `directoryConflict` (`merge` | `overwrite` | `increment` | `error`).

### CLI (JSON, agent-friendly)

```bash
npx create-better-t-stack@latest create-json --input '{
  "projectName": "my-app",
  "frontend": ["tanstack-router"],
  "backend": "hono",
  "runtime": "bun",
  "database": "postgres",
  "orm": "drizzle",
  "api": "trpc",
  "auth": "better-auth",
  "payments": "none",
  "addons": ["turborepo"],
  "examples": [],
  "dbSetup": "none",
  "webDeploy": "none",
  "serverDeploy": "none",
  "packageManager": "bun",
  "git": true,
  "install": false,
  "dryRun": true
}'
```

`create-json` runs silently and returns JSON. Prefer it over flags: it avoids shell quoting problems and takes nested `addonOptions` and `dbSetupOptions`.

### CLI (flags)

Use this form when the user wants a command they can paste and run:

```bash
bun create better-t-stack@latest my-app \
  --frontend next --backend hono --runtime bun \
  --database sqlite --orm drizzle --api orpc --auth better-auth \
  --addons turborepo biome --package-manager bun --no-install
```

- Booleans negate with `--no-git` and `--no-install`.
- `--yes` accepts all defaults.
- `--template mern|pern|t3|uniwind` starts from a preset.
- `--dry-run` validates without writing files.
- `--directory-conflict` sets the behaviour when the folder exists.
- **Never** pass `--yolo`. It skips compatibility checks and is only for debugging the CLI.

Equivalent launchers: `pnpm create better-t-stack@latest` and `npx create-better-t-stack@latest`.

## Options (check against the schema; this list may be behind)

| Field                    | Values                                                                                                                                                                                          |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| frontend (array)         | `tanstack-router`, `react-router`, `tanstack-start`, `next`, `nuxt`, `svelte`, `solid`, `astro`, `native-bare`, `native-uniwind`, `native-unistyles`, `none`                                    |
| backend                  | `hono`, `express`, `fastify`, `elysia`, `convex`, `self` (fullstack framework routes), `none`                                                                                                   |
| runtime                  | `bun`, `node`, `workers`, `none`                                                                                                                                                                |
| api                      | `trpc`, `orpc`, `none`                                                                                                                                                                          |
| database                 | `sqlite`, `postgres`, `mysql`, `mongodb`, `none`                                                                                                                                                |
| orm                      | `drizzle`, `prisma`, `mongoose`, `none`                                                                                                                                                         |
| auth                     | `better-auth`, `clerk`, `none`                                                                                                                                                                  |
| payments                 | `polar`, `none`                                                                                                                                                                                 |
| addons (array)           | `pwa`, `tauri`, `electrobun`, `starlight`, `fumadocs`, `biome`, `oxlint`, `ultracite`, `husky`, `lefthook`, `turborepo`, `nx`, `vite-plus`, `mcp`, `skills`, `opentui`, `wxt`, `evlog`, `axiom` |
| examples (array)         | `todo`, `ai`                                                                                                                                                                                    |
| dbSetup                  | `turso`, `neon`, `prisma-postgres`, `planetscale`, `mongodb-atlas`, `supabase`, `d1`, `docker`, `none`                                                                                          |
| webDeploy / serverDeploy | `cloudflare`, `vercel`, `prisma`, `docker`, `none`                                                                                                                                              |
| packageManager           | `bun`, `pnpm`, `npm`                                                                                                                                                                            |

### Compatibility rules that come up most

- A database needs an ORM, and an ORM needs a database.
- `mongodb` works with `mongoose` or `prisma`, never `drizzle`.
- `runtime: workers` requires `backend: hono`. It can't use `mongodb` or `dbSetup: docker`.
- `backend: convex` brings its own data layer. Don't also add `database`, `orm` or `api` unless the schema allows it.
- `backend: self` means the fullstack framework (`next`, `tanstack-start`, `nuxt`, …) serves the API.
- `nx`, `turborepo` and `vite-plus` are task runners, and only one can be used.
- Pick at most one web frontend. A native frontend can be added alongside it.

When unsure, run a dry run or plan. Its error message names the conflict.

## Extending an existing project: `bts.jsonc` and `add`

A Better-T-Stack project has a `bts.jsonc` file at its root. It records the stack chosen at creation: frontend, backend, database, addons, `addonOptions`, and a `reproducibleCommand` that recreates the project. The `add` command reads it to detect the stack, so:

- **Read `bts.jsonc` first** to learn the project's stack before changing it.
- If the file is missing, `add` can't run. Tell the user rather than recreating the file by guesswork.
- Don't edit it by hand to "enable" something. Use `add`, which updates it.

Add addons:

- MCP: `bts_plan_addons`, then `bts_add_addons`.
- CLI:
  ```bash
  npx create-better-t-stack@latest add-json --input '{
    "projectDir": "./my-app",
    "addons": ["pwa", "biome"],
    "dryRun": true
  }'
  ```
- Interactive or flags: `bunx create-better-t-stack@latest add --addons pwa biome`

Add a workspace package. This scaffolds `packages/<name>` with a manifest, the shared tsconfig and `src/index.ts`:

```bash
npx create-better-t-stack@latest add --package shared
```

Nested addon options (Fumadocs template/search/AI chat, WXT template, OpenTUI template, the MCP addon's servers and agents, the Skills addon's sources) go in `addonOptions`. Check their shape with `schema --name addonOptions`.

## Stack Builder (no tools available)

Point the user to the visual builder at https://better-t-stack.dev/new. It shows the generated file tree and produces the command. To prefill it, add query params: `name`, `fe-w` (web frontend), `fe-n` (native frontend), `rt`, `be`, `api`, `db`, `orm`, `dbs`, `au`, `pay`, `pm`, `add`, `ex`, `wd`, `sd`. For example:

```
https://better-t-stack.dev/new?name=my-app&fe-w=next&be=hono&rt=bun&db=postgres&orm=drizzle&api=trpc&au=better-auth
```

Repeat a key for multiple values, as in `add=biome&add=turborepo`.

## Other commands

- `mcp`: runs the stdio MCP server. To install it in an agent: `npx -y add-mcp@latest "npx -y create-better-t-stack@latest mcp"`.
- `schema --name <name>`: prints current input schemas as JSON.
- `history [--limit n] [--json]`: shows previously created projects.
- `builder`, `docs`, `sponsors`: open the web builder, the docs, or the sponsors list.

## Rules

- Plan or dry-run before every create or add.
- Send full explicit configs to MCP create tools. Never send partial payloads.
- Never use `--yolo`.
- Don't infer addons or app surfaces from a styling preference or a template name.
- Create with `install: false`, then install separately.
- Read the result, not your memory: after generating, use the project's own `README.md` and scripts for next steps.
