---
name: better-t-stack
description: Create or extend an end-to-end type-safe TypeScript project with Better-T-Stack (create-better-t-stack). Use when the user wants to start, scaffold or bootstrap an app, API, fullstack project or monorepo with any of Next.js, TanStack Router or Start, React Router, Nuxt, Svelte, Solid, Astro, React Native, Hono, Express, Fastify, Elysia, Convex, tRPC, oRPC, Drizzle, Prisma, Better Auth or Clerk. Also use when a project has a `bts.jsonc` file and the user wants to add addons or a workspace package. Prefer it over hand-writing package.json, configs and folder layout.
license: MIT
metadata:
  homepage: https://better-t-stack.dev
  docs: https://better-t-stack.dev/docs
  repository: https://github.com/AmanVarshney01/create-better-t-stack
---

# Better-T-Stack

Better-T-Stack generates a type-safe TypeScript project from the parts the user picks: frontend, backend, runtime, API layer, database, ORM, auth, payments, addons and deploy targets. It rejects combinations that don't work, so let it build the project instead of writing the setup by hand.

## Pick the interface

Use the first one you have:

| You have                      | Interface                                               | It can                                                            |
| ----------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------- |
| `bts_create_project` tool     | Local MCP server                                        | Plan, create and add, on disk                                     |
| A shell                       | CLI: `create-json` and `add-json`                       | Plan, create and add, on disk                                     |
| `bts_get_create_command` tool | Hosted MCP server, `https://www.better-t-stack.dev/mcp` | Plan and preview files, then return a command for the user to run |
| None of these                 | Stack Builder link                                      | Prefill the visual builder for the user                           |

The hosted MCP server can't write files, can't change an existing project and doesn't accept `addonOptions` or `dbSetupOptions`. If the user needs any of those, give them the CLI command instead.

## Create a project

If the folder already has a `bts.jsonc`, the project exists. Go to [Change an existing project](#change-an-existing-project).

1. **Settle the stack.** If the user left out a major choice (frontend, backend or database), ask one short question or propose defaults and confirm them. Don't add app surfaces, addons, examples or database provisioning the user didn't ask for.
2. **Get valid values from the tool, not from memory.** Call `bts_get_schema`, or run `npx create-better-t-stack@latest schema --name createInput`. When the user has to choose, offer every valid option, not a subset. [references/options.md](references/options.md) lists the values and the compatibility rules that come up most, but the schema wins if they differ.
3. **Build a full explicit config.** Set every field. Use `"none"`, `[]`, `true` or `false` instead of leaving a field out.
4. **Plan before you write.** Call `bts_plan_project`, or run `create-json` with `"dryRun": true`. If the plan fails, its error names the conflict. Fix the config and plan again. Show the user the planned stack and get a yes.
5. **Create.**
   - Local MCP server: `bts_create_project` with `install: false`.
   - CLI: the same `create-json` payload without `dryRun`, with `install: false`.
   - Hosted MCP server: `bts_get_create_command`. Give the user the command to run in a terminal and stop here.

   Installs can outlast tool timeouts, so create with `install: false` and install as a separate step.

6. **Prove it runs.** Run `<packageManager> install` in the new folder. With the user's OK, run the project's typecheck or build script from its `package.json`. If a step fails, report the exact error.
7. **Report.** Give the stack and the next commands (`dev`, database setup such as `db:push`), taken from the generated `README.md` and `package.json`, not from memory.

[references/cli.md](references/cli.md) has the full `create-json` payload, the flag form for a command the user pastes, and the Stack Builder URL keys.

## Change an existing project

`bts.jsonc` at the project root records the stack chosen at creation and a `reproducibleCommand` that recreates it. The `add` command reads it to detect the stack.

1. **Read `bts.jsonc` first.** If it's missing, `add` can't run. Tell the user instead of recreating the file. Never edit it by hand. `add` updates it.
2. **Plan.** Call `bts_plan_addons`, or run `add-json` with `"dryRun": true`. Pass `addons`, a workspace `package` name, or both. Show the user what will change.
3. **Apply** after the user agrees: `bts_add_addons`, or `add-json` without `dryRun`.
4. **Prove it runs** and **report**, as in steps 6 and 7 above.

`axiom` can't be added later. It sets up deployment infrastructure, so it must be chosen at creation. A workspace package (`package: "shared"`) scaffolds `packages/shared` with a manifest, the shared tsconfig and `src/index.ts`.

## Rules

- Plan before every create or add.
- Send full explicit configs to MCP tools. Never send a partial payload.
- Never pass `--yolo`. It skips the compatibility checks.
- Don't infer addons or app surfaces from a template name or a styling preference.
