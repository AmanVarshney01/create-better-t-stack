# Better-T-Stack plugin

Make your AI assistant scaffold and extend projects with [Better-T-Stack](https://better-t-stack.dev) instead of hand-rolling boilerplate.

The plugin bundles:

- **MCP server**: the official `create-better-t-stack mcp` server. It runs locally over stdio and needs no API key. It exposes `bts_get_stack_guidance`, `bts_get_schema`, `bts_plan_project`, `bts_create_project`, `bts_plan_addons`, `bts_add_addons`.
- **Skills**: `scaffold-project` starts a new project, and `add-to-project` adds addons or a workspace package to a project that has a `bts.jsonc`. They make the assistant plan a valid stack and generate it instead of writing config by hand.
- **Commands**: `/better-t-stack:new` and `/better-t-stack:add`.
- **Agent**: `stack-architect` designs a stack from a product description and generates it.

## Requirements

- Node.js with `npx`. The MCP server runs with `npx -y create-better-t-stack@latest mcp`.

## Install in Claude Code

```bash
# Add this repo as a plugin marketplace
/plugin marketplace add AmanVarshney01/create-better-t-stack

# Install the plugin
/plugin install better-t-stack@better-t-stack
```

Then ask for a project, such as _"create a fullstack app with Next, Hono, Postgres and Better Auth"_. The `scaffold-project` skill activates, and the assistant plans the stack before generating it. You can also run `/better-t-stack:new <description>`.

## Install in Codex

This plugin is dual-target: the same `skills/` and `.mcp.json` are reused by a Codex manifest (`.codex-plugin/plugin.json`), and the repo also exposes a Codex marketplace catalog (`.agents/plugins/marketplace.json`). Codex gets both skills and the MCP server. Codex skills use the same `SKILL.md` frontmatter and the same implicit invocation as Claude Code.

Add the marketplace and install via Codex's plugins screen, or point Codex at the local source. Codex discovers marketplaces from `$REPO_ROOT/.agents/plugins/marketplace.json` or `~/.agents/plugins/marketplace.json`.

> Note: Codex has no slash-command concept, so `/better-t-stack:new` and `/better-t-stack:add` (and the `stack-architect` subagent) are Claude Code only. The skills cover the same workflows in Codex.

### Just the MCP server (any MCP client)

Add the server to Codex, Cursor, VS Code, Gemini CLI or another client with `add-mcp`:

```bash
npx -y add-mcp@latest "npx -y create-better-t-stack@latest mcp"
```

Choose your client when prompted. For Codex, you can instead add it to `~/.codex/config.toml`:

```toml
[mcp_servers.better-t-stack]
command = "npx"
args = ["-y", "create-better-t-stack@latest", "mcp"]
```

### Hosted MCP server (web and mobile clients)

Clients that can't run a local server, such as claude.ai and ChatGPT, can add `https://www.better-t-stack.dev/mcp` as a remote connector. It plans stacks and previews the generated files, then returns the command to run. It can't write files or change an existing project.

## How the assistant uses it

1. Settle the stack: ask a short question or propose defaults.
2. Read valid values from `bts_get_schema`.
3. Plan with `bts_plan_project`, and confirm the stack with the user.
4. Create with `bts_create_project` and `install: false`.
5. Install, check that the project builds, and report the next commands.

The assistant always plans before it creates and always sends the full config, with explicit `"none"`, `[]` and booleans.

Without the local MCP server, the skills use the CLI's `create-json` and `add-json` (with `"dryRun": true` first), then the hosted MCP server, then a prefilled Stack Builder link.
