---
description: Add addons/features (PWA, Tauri, docs, linters, task runners, MCP, …) or a workspace package to an existing Better-T-Stack project via the Better-T-Stack MCP server (or the CLI's add-json).
argument-hint: "<addons to add, e.g. pwa biome turborepo, or a package name>"
---

# Add to a Better-T-Stack project

User request: $ARGUMENTS

Add tooling/features or a workspace package to the current Better-T-Stack project instead of wiring it by hand. Follow the **add-to-project** skill.

## Steps

1. **Confirm** the working directory is a Better-T-Stack project and read its `bts.jsonc` to learn the current stack. If it's missing, stop and tell the user — don't recreate it.
2. **Determine the addon set** (or `package` name) from the arguments above. Use `bts_get_schema` (or `schema --name addonOptions`) for nested addon options when needed.
3. **Plan with `bts_plan_addons`** — or, without the MCP, `create-better-t-stack add-json --input '<payload with "dryRun": true>'` — and review the changes. Surface any conflicts (e.g. `nx`/`turborepo`/`vite-plus` are mutually exclusive).
4. **Apply with `bts_add_addons`** (or `add-json` without `dryRun`) once confirmed.
5. **Report** what changed and any follow-up commands.

Always plan before applying. Don't add addons the user didn't ask for. Never hand-edit `bts.jsonc`.
