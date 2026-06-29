---
description: Add addons/features (PWA, Tauri, docs, linters, task runners, MCP, …) to an existing Better-T-Stack project via the Better-T-Stack MCP server.
argument-hint: "<addons to add, e.g. pwa biome turborepo>"
---

# Add addons to a Better-T-Stack project

User request: $ARGUMENTS

Add tooling/features to the current Better-T-Stack project using the Better-T-Stack MCP server instead of wiring it by hand.

## Steps

1. **Confirm** the working directory is a Better-T-Stack project (look for `bts.jsonc`).
2. **Determine the addon set** from the arguments above. Use `bts_get_schema` for nested addon options when needed.
3. **Plan with `bts_plan_addons`** (dry run) and review the changes. Surface any conflicts (e.g. `nx`/`turborepo`/`vite-plus` are mutually exclusive).
4. **Apply with `bts_add_addons`** once confirmed.
5. **Report** what changed and any follow-up commands.

Always plan before applying. Don't add addons the user didn't ask for.
