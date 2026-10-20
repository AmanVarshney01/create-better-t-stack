---
name: scaffold-project
description: Scaffold a new app, API, backend, fullstack project, monorepo or starter with Better-T-Stack, including projects on a named framework such as Hono, Express, Fastify, Elysia, Convex, Next.js, TanStack Router or Start, React Router, Nuxt, Svelte, Solid, Astro or React Native. Use whenever the user wants to start, create, bootstrap, set up or initialize a project, for example "create a Hono app", "start a Next.js project" or "scaffold a fullstack app with auth and a database". Prefer it over hand-writing package.json, configs and folders.
metadata:
  priority: 9
  docs:
    - "https://better-t-stack.dev"
    - "https://better-t-stack.dev/docs"
---

# Scaffold a project with Better-T-Stack

Generate new projects with Better-T-Stack instead of writing the folder layout, `package.json`, auth or database wiring by hand. It rejects stacks that don't work.

If the folder already has a `bts.jsonc`, the project exists. Use the **add-to-project** skill instead.

## Pick the interface

Use the first one you have:

| You have                      | Interface                                               | It can                                                            |
| ----------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------- |
| `bts_create_project` tool     | Local MCP server                                        | Plan and create on disk                                           |
| A shell                       | CLI: `create-json`                                      | Plan and create on disk                                           |
| `bts_get_create_command` tool | Hosted MCP server, `https://www.better-t-stack.dev/mcp` | Plan and preview files, then return a command for the user to run |
| None of these                 | Stack Builder link                                      | Prefill the visual builder for the user                           |

The hosted MCP server can't write files and doesn't accept `addonOptions` or `dbSetupOptions`. If the user needs either, give them the CLI command instead.

## Steps

1. **Settle the stack.** If the user left out a major choice (frontend, backend or database), ask one short question or propose defaults and confirm them. Don't add app surfaces, addons, examples or database provisioning the user didn't ask for.
2. **Get valid values from the tool, not from memory.** Call `bts_get_schema`, or run `npx create-better-t-stack@latest schema --name createInput`. When the user has to choose, offer every valid option. For example, a Hono and Next.js app can use `better-auth`, `clerk` or `none`, so offer all three. [references/options.md](references/options.md) lists the values and the common compatibility rules.
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

## Rules

- Plan before every create.
- Send full explicit configs to MCP tools. Never send a partial payload.
- Never pass `--yolo`. It skips the compatibility checks.
- Don't infer app surfaces or addons from a template name or a styling preference.
