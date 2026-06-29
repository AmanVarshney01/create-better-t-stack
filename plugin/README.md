# Better-T-Stack plugin

Make your AI assistant scaffold and extend projects with [Better-T-Stack](https://better-t-stack.dev) instead of hand-rolling boilerplate.

The plugin bundles:

- **MCP server** — the official `create-better-t-stack mcp` server (stdio, no auth/key). Exposes `bts_get_stack_guidance`, `bts_get_schema`, `bts_plan_project`, `bts_create_project`, `bts_plan_addons`, `bts_add_addons`.
- **Skills** — `scaffold-project` (start a new project) and `add-to-project` (add addons). These steer the assistant to plan a valid stack and generate it through the MCP rather than writing config by hand.
- **Commands** — `/better-t-stack:new` and `/better-t-stack:add`.
- **Agent** — `stack-architect`, which designs a coherent stack from a product description and generates it.

## Requirements

- Node.js with `npx` available (the MCP server runs via `npx -y create-better-t-stack@latest mcp`).

## Install in Claude Code

```bash
# Add this repo as a plugin marketplace
/plugin marketplace add AmanVarshney01/create-better-t-stack

# Install the plugin
/plugin install better-t-stack@better-t-stack
```

Then just ask: _"create a fullstack app with Next, Hono, Postgres and Better Auth"_ — the `scaffold-project` skill activates and the assistant plans the stack with the MCP before generating it. Or run `/better-t-stack:new <description>`.

## Install in Codex

This plugin is dual-target: the same `skills/` and `.mcp.json` are reused by a Codex manifest (`.codex-plugin/plugin.json`), and the repo also exposes a Codex marketplace catalog (`.agents/plugins/marketplace.json`). So Codex gets both the `scaffold-project` / `add-to-project` skills **and** the MCP server — Codex skills use the same `SKILL.md` frontmatter and implicit-invocation model as Claude Code.

Add the marketplace and install via Codex's plugins screen, or point Codex at the local source. Codex discovers marketplaces from `$REPO_ROOT/.agents/plugins/marketplace.json` or `~/.agents/plugins/marketplace.json`.

> Note: Codex has no slash-command concept, so `/better-t-stack:new` and `/better-t-stack:add` (and the `stack-architect` subagent) are Claude Code only. The skills cover the same workflows in Codex.

### Just the MCP server (any MCP client)

The CLI can wire the server into Codex (and Cursor, VS Code, Gemini CLI, etc.) for you:

```bash
npx create-better-t-stack@latest add --addons mcp
```

…and choose `codex` (or your client) when prompted. Or add it to `~/.codex/config.toml` manually:

```toml
[mcp_servers.better-t-stack]
command = "npx"
args = ["-y", "create-better-t-stack@latest", "mcp"]
```

## How the assistant uses it

1. Resolve intent (ask briefly or pick sensible defaults).
2. `bts_get_stack_guidance` / `bts_get_schema` for valid options.
3. `bts_plan_project` (dry run) — confirm the resolved stack.
4. `bts_create_project` with `install: false` — generate.
5. Report the stack and the exact `install` / `dev` commands.

Plan always precedes create; configs are always sent in full (explicit `"none"`, `[]`, booleans).
