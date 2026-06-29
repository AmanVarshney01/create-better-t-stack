# @better-t-stack/opencode

An [opencode](https://opencode.ai) plugin that lets your AI agent scaffold and extend projects with [Better-T-Stack](https://better-t-stack.dev) — natively, with no MCP server to wire up.

## What it does

- **Registers native opencode tools** that mirror the Better-T-Stack MCP:
  - `bts_get_stack_guidance`, `bts_get_schema` — discover valid options
  - `bts_plan_project`, `bts_create_project` — plan then generate a project
  - `bts_plan_addons`, `bts_add_addons` — plan then add addons to an existing project
- **Makes the agent Better-T-Stack aware.** It injects context into the system prompt: inside a Better-T-Stack project (a `bts.jsonc` is present) it surfaces the current stack and steers the agent to extend it with `bts_add_addons`; elsewhere it points the agent at the scaffold tools for new projects.

## Install

Add it to your opencode config (`opencode.json` or `~/.config/opencode/opencode.json`):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@better-t-stack/opencode"]
}
```

opencode installs the package automatically on startup. Then just ask:

> "create a fullstack app with Next, Hono, Postgres and Better Auth"

The agent plans a valid stack and generates it. Dependencies are not installed automatically — run your package manager's `install` in the new project afterwards.

## Workflow

1. `bts_get_stack_guidance` / `bts_get_schema` for valid options (when the request is ambiguous)
2. `bts_plan_project` (dry run) — confirm the resolved stack
3. `bts_create_project` — generate (no install)
4. For existing projects: `bts_plan_addons` → `bts_add_addons`

## Alternative: MCP server

Prefer MCP? Better-T-Stack also ships a stdio MCP server that works in opencode (`opencode mcp add` → `npx -y create-better-t-stack@latest mcp`). This plugin is the native opencode alternative, with the added system-prompt awareness.

## License

MIT
