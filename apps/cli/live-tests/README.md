# Live generated-project tests

Run from the repository root. These tests create disposable projects and databases, install through the actual CLI, run generated commands, and exercise the app in Chromium. They are not connected to CI or the release workflow.

```sh
bun run build:cli
cd apps/cli && bunx playwright install chromium && cd ../..
bun run test:live plan --where '{"frontend":["tanstack-router"],"backend":"hono","runtime":"bun","database":"postgres","orm":"drizzle","dbSetup":"neon","api":"trpc","auth":"better-auth","payments":"none","webDeploy":"none","serverDeploy":"none","packageManager":"bun","addons":[],"examples":["todo"]}'
```

Replace `plan` with `run` to execute that selection. Remove selection fields to enumerate their valid alternatives. An empty selection enumerates all supported core stack choices, frontend/native pairs, addon subsets, and example subsets using the existing compatibility rules. It does **not** yet enumerate addon-specific options or automatic database-setup login flows.

`--limit N` bounds a run for development; a limited run reports incomplete coverage and exits nonzero. Zero matching cases also exits nonzero. An enumerated case only passes after its runtime checks and resource cleanup succeed. Missing adapters or credentials are blocked, never passed.

## Accounts

Supply credentials in the local process environment or use the provider CLI's existing login. Do not commit credentials here.

| Provider                                    | Runner input                                                            | Status                                                                                              |
| ------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Neon                                        | `NEON_API_KEY`; optional `BTS_LIVE_NEON_ORG_ID`, `BTS_LIVE_NEON_REGION` | Disposable project provisioning and cleanup implemented                                             |
| Vercel                                      | Existing `vercel login`; `BTS_LIVE_VERCEL_SCOPE`                        | Disposable project; production and preview deployments; browser checks and runtime logs implemented |
| Cloudflare through Alchemy                  | Project-local Alchemy profile; `CLOUDFLARE_ACCOUNT_ID`                  | Adapter needs an authenticated live run; Wrangler login alone is insufficient                       |
| Clerk, Polar sandbox, Convex                | Dedicated test accounts to be added later                               | Blocked; provider-specific verification still required                                              |
| Supabase, Turso, PlanetScale, MongoDB Atlas | Dedicated test accounts to be added later                               | Blocked; database provisioners still required                                                       |

Vercel function cases require the Node runtime; Bun remains a supported package manager. Vercel's first deployment is production, so the runner verifies production first and preview second on its disposable project. It creates a deployment-protection bypass secret scoped to that project. Browser requests only attach it to the test deployment's origin.

## Verification and current limits

- The CLI must save the requested selections in `bts.jsonc`; silently selecting a default is a failure.
- Generated dependencies install, then the project typechecks. Local cases also build and run the generated dev scripts.
- Drizzle/Neon cases generate and apply a migration, repeat it to check idempotence, then run `db:push`. Prisma cases generate the client and run `db:push`; Prisma migration lifecycle coverage is still pending.
- Browser checks cover rendering, API health, Better Auth signup/login/logout, session persistence after reload, protected navigation, and todo create/update/delete with reloads. Browser crashes, failed requests, API errors, and incorrect API origins fail the case.
- Local browser verification currently targets development servers, not the built production server. Native devices, Docker, mixed deployment providers, AI, payments, and many addons are explicitly blocked until their runtime checks exist. Direct database assertions, redeployment persistence, and PWA offline checks are still pending.
- Next.js remains under investigation: live runs exposed an intermittent login hydration error, and local Turbopack development leaves an imported utility's public Varlock `ENV` value undefined. Passing retries do not resolve these findings.
- Framework-specific browser selectors still need validation across the full matrix. A passing TanStack Router case does not certify other frameworks.

## Results, resume, and cleanup

The runner prints its directory under `apps/cli/.smoke/live/`. It contains SQLite results, generated projects, redacted command logs, browser traces, and screenshots for failures. Generated `.env` files and browser traces can contain disposable test credentials; the directory is private and ignored by Git.

```sh
bun run test:live report --directory apps/cli/.smoke/live/RUN_ID
bun run test:live cleanup --directory apps/cli/.smoke/live/RUN_ID
```

Repeat the same `run --where ...` command to resume. Passed cases are skipped; use `--retry-failed` to retry failures. Blocked and interrupted cases are revisited. The identity includes the built CLI, generated-template bundle, shared types, runner source, lockfile, commit, and filter; changed inputs require a new run directory.

Cleanup normally runs after each case. `--retain-failed` preserves failed deployments for investigation; clean them with the command above. Interruptions retain resource records so cleanup can resume. A failed cleanup keeps the case failed and the resource pending. Unconfirmed Vercel creation intents require inspecting the create log/account before reconciliation; cleanup will not delete an unconfirmed project by name.

Only one process can mutate a given run directory. `runner.lock` contains its PID. After an ungraceful kill, confirm that process is gone before removing the stale lock. Local cases also refuse to use occupied framework ports.

The small runner regression suite does not deploy anything:

```sh
bun test apps/cli/live-tests/runner.test.ts
```
