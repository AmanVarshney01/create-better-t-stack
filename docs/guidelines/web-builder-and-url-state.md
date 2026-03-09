# Web Builder And URL State

Use this guide for changes in `apps/web` that affect stack selection, builder state, preview generation, routes, or homepage sections.

## Builder state flow

- `apps/web/src/lib/stack-defaults.ts` defines the full `StackState` shape and defaults.
- `apps/web/src/lib/stack-url-keys.ts` maps stack keys to short URL params.
- `apps/web/src/lib/stack-url-state.shared.ts` parses and serializes stack state.
- `apps/web/src/lib/stack-option-normalization.ts` normalizes aliases and canonical option IDs across parsed state.
- `apps/web/src/lib/preview-config.ts` converts normalized stack state into preview data.

If URL parsing changes without normalization, alias handling usually breaks somewhere between shared links and preview rendering.

## Performance and routing constraints

- Do not move heavy search parsing or schema validation into eager route code on `apps/web/src/routes/new.tsx` unless you have measured the bundle cost.
- Route-level `validateSearch` can pull `zod` and search-schema code into the main client bundle. Prefer parsing inside the lazy-loaded builder path.
- After adding or removing route files, `apps/web/src/routeTree.gen.ts` can be stale until a route-generator run such as `vite build`.

## Editing guidance

- When adding a stack field to shareable URLs, update defaults, URL keys, parsing, serialization, and normalization together.
- Keep builder labels aligned with canonical metadata from `packages/types` unless there is a deliberate UX reason to diverge.
- Before cleaning up homepage sections, check whether a component is actually imported by `apps/web/src/routes/index.tsx`. The home component directory can contain dead marketing sections.
- For SvelteKit or SolidStart with Tailwind + DaisyUI, plugin activation lives in `apps/web/src/app.css` via `@plugin "daisyui";`, not in `tailwind.config.ts`.

## Ecosystem and auth rendering

- Go builder rendering depends on both `ECOSYSTEM_CATEGORIES.go` in `apps/web/src/lib/constant.ts` and `GO_CATEGORY_ORDER` in `apps/web/src/lib/stack-utils.ts`. If a Go option exists in the metadata but not the builder UI, check that both lists were updated together.
- Auth capability metadata is intentionally global across ecosystems in `packages/types`, but the web builder should filter visible auth choices by ecosystem in `apps/web/src/components/stack-builder/utils.ts`. Do not assume disabled reasons alone are enough to produce the desired builder UI.
- The builder has two auth option render paths in `apps/web/src/components/stack-builder/stack-builder.tsx` (sidebar accordion + main category grid). Apply auth visibility filtering in both paths to avoid inconsistent options between sidebar and main content.

## Useful verification

- `bun run --cwd apps/web lint`
- `bun test apps/web/test/preview-config.test.ts`
- `bun run build:web` when route generation, bundling, or preview wiring changed
