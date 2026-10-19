# CLI and Stack Builder

## Create with JSON

`create-json` takes the whole config through `--json`, runs without prompts and prints JSON. Prefer it to flags: it avoids shell-quoting problems and accepts `addonOptions` and `dbSetupOptions`.

```bash
npx create-better-t-stack@latest create-json --json '{
  "projectName": "my-app",
  "frontend": ["tanstack-router"],
  "backend": "hono",
  "runtime": "bun",
  "database": "sqlite",
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

With `"dryRun": true` it validates and writes nothing. Remove `dryRun` to create the project.

## Add with JSON

```bash
npx create-better-t-stack@latest add-json --json '{
  "projectDir": "./my-app",
  "addons": ["pwa", "biome"],
  "dryRun": true
}'
```

Pass `"package": "shared"` to scaffold a workspace package as well as, or instead of, addons.

## Flags, for a command the user pastes

```bash
bun create better-t-stack@latest my-app \
  --frontend next --backend self --runtime none \
  --database postgres --orm drizzle --api orpc --auth better-auth \
  --payments none --addons turborepo biome --examples none \
  --db-setup none --web-deploy none --server-deploy none \
  --package-manager bun --no-install
```

- Turn a boolean off with `--no-git` or `--no-install`.
- `--dry-run` validates without writing files.
- `--yes` accepts every default.
- `--template mern`, `pern`, `t3` or `uniwind` starts from a preset.
- `--directory-conflict` sets what happens when the folder exists: `merge`, `overwrite`, `increment` or `error`.
- `pnpm create better-t-stack@latest` and `npx create-better-t-stack@latest` work the same way.

To add to an existing project: `bunx create-better-t-stack@latest add --addons pwa biome`, or `add --package shared`.

## Other commands

| Command                       | What it does                                                                                                            |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `schema --name <name>`        | Prints a schema as JSON. Names: `all`, `cli`, `createInput`, `addInput`, `addonOptions`, `dbSetupOptions`               |
| `mcp`                         | Runs the local MCP server over stdio. Install it with `npx -y add-mcp@latest "npx -y create-better-t-stack@latest mcp"` |
| `history`                     | Lists past projects. Takes `--limit <n>`, `--json` and `--clear`                                                        |
| `builder`, `docs`, `sponsors` | Opens the Stack Builder, the docs or the sponsors page                                                                  |

## Stack Builder link

When nothing can run, send the user to `https://www.better-t-stack.dev/new` with the stack in the query string. The builder shows the file tree and gives them the command.

| Key    | Field           | Key   | Field           |
| ------ | --------------- | ----- | --------------- |
| `name` | project name    | `au`  | auth            |
| `fe-w` | web frontend    | `pay` | payments        |
| `fe-n` | native frontend | `pm`  | package manager |
| `rt`   | runtime         | `add` | addons          |
| `be`   | backend         | `ex`  | examples        |
| `api`  | API layer       | `wd`  | web deploy      |
| `db`   | database        | `sd`  | server deploy   |
| `orm`  | ORM             | `dbs` | database setup  |

Join several values with commas in one key: `add=turborepo,biome`. For `backend: self`, write the frontend into the value: `be=self-next`. A full link:

```
https://www.better-t-stack.dev/new?name=my-app&fe-w=next&be=hono&rt=bun&db=postgres&orm=drizzle&api=trpc&au=better-auth&add=turborepo,biome
```
