---
description: Scaffold a new Better-T-Stack project. Plans a full, validated stack with the Better-T-Stack MCP server (or the CLI's create-json), confirms it, then generates the project.
argument-hint: "<project name and/or stack description>"
---

# Create a Better-T-Stack project

User request: $ARGUMENTS

Scaffold a new project with Better-T-Stack. Do not hand-roll the project structure, tooling, auth, or database wiring. Follow the **scaffold-project** skill.

## Steps

1. **Parse the request.** Extract the project name and any stack preferences from the arguments above. If nothing was provided, ask what kind of project they want.
2. **Resolve unknowns.** For any major choice not specified, either ask a brief question or pick a sensible default and state it. Call `bts_get_stack_guidance` and `bts_get_schema` (or `npx create-better-t-stack@latest schema --name createInput`) for the authoritative option list and rules.
3. **Build a full explicit config.** Every field must be set explicitly (use `"none"`, `[]`, `true`/`false`). Required: `projectName`, `frontend`, `backend`, `runtime`, `database`, `orm`, `api`, `auth`, `payments`, `addons`, `examples`, `git`, `packageManager`, `install`, `dbSetup`, `webDeploy`, `serverDeploy`.
4. **Plan** with `bts_plan_project` — or, without the MCP, `create-better-t-stack create-json --input '<config with "dryRun": true>'`. Show the resolved stack and confirm it matches intent.
5. **Create** with `bts_create_project` (or `create-json` without `dryRun`) once confirmed. Use `install: false` to avoid timeouts.
6. **Report** the stack and the exact next commands (`<packageManager> install`, `dev`, any DB setup).

Always plan before create. Never send a partial config. Never use `--yolo`.
