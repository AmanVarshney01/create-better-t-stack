The role of this file is to describe common mistakes and confusion points that agents might encounter as they work in this project. If you ever encounter something in the project that surprises you, please alert the developer working with you and indicate that this is the case in the AgentMD file to help prevent future agents from having the same issue.

## Discovered gotchas (2026-03-03)

- `--yes` cannot be combined with core stack flags like `--frontend`, `--css-framework`, or `--ui-library`. If you need explicit stack options, do not pass `--yes`.
- Even with many non-interactive flags set, CLI may still prompt for AI documentation files unless `--ai-docs none` is provided explicitly.
- `bts.jsonc` currently does not persist shadcn sub-options (for example `shadcnColorTheme`, `shadcnFont`). Validate those via generated files (`components.json`, CSS, dependencies) instead of expecting them in `bts.jsonc`.
- Route-level `validateSearch` on `apps/web/src/routes/new.tsx` can pull `zod` and search-schema code into the main client bundle. Prefer parsing search params inside the lazy-loaded stack builder path to protect homepage performance.
- After adding/removing files in `apps/web/src/routes`, `apps/web/src/routeTree.gen.ts` may be stale until a route generator run (triggered by `vite build`/`vite dev`). `tsc --noEmit` can fail with route type errors if regeneration hasn't happened yet.

## Discovered gotchas (2026-03-04)

- `shadcn-ui` is intentionally incompatible with `svelte` and `solid-start`; CLI validation blocks those combos. For these frontends, use `daisyui`, `ark-ui`, `park-ui` (solid-start only), or `none`.
- For SvelteKit/SolidStart Tailwind + DaisyUI, plugin activation is in `apps/web/src/app.css` via `@plugin "daisyui";` (not in `tailwind.config.ts`).
- Fets server template emitted `toNativeRequest` even when `auth=none` and `api=none`, causing TypeScript `TS6133` (unused variable) during `bun run check-types`. The helper must be generated only when auth/API routes need it.
- Go server template declared `addr` unconditionally, which breaks `go build` when `goWebFramework=none` (unused variable). Host/port declarations must be conditional on selected web framework/API paths.
- TRPC server context template lacked a `fets` backend branch. With `backend=fets` + `api=trpc` + `auth=better-auth`, context typed `session` as `null`, causing `protectedProcedure` downstream type errors (`ctx.session.user` on `never`).
- Root workspace `check-types` command should use `--if-present` (`bun`/`pnpm`/`npm`) because several frontend templates (for example Nuxt/Qwik) do not define a `check-types` script; strict filtering otherwise fails with `No packages matched the filter`.
- Redwood path helpers must be backend-aware: `web/api` paths apply to `frontend=redwood` only when `backend=none`; with external backends (hono/express/etc.) paths are `apps/web` and `apps/server`.
- Redwood constraints to remember during matrix creation: API must be `none` and compatible UI libraries are currently `daisyui` or `none`.
- In scripted/non-interactive runs with `--ui-library shadcn-ui`, pass explicit shadcn sub-options (at minimum `--shadcn-base`, ideally full `--shadcn-*` set). Otherwise CLI can stop at the shadcn prompt and leave an empty project directory while returning exit code 0.
