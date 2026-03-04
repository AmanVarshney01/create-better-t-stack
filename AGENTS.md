The role of this file is to describe common mistakes and confusion points that agents might encounter as they work in this project. If you ever encounter something in the project that surprises you, please alert the developer working with you and indicate that this is the case in the AgentMD file to help prevent future agents from having the same issue.

## Discovered gotchas (2026-03-03)

- `--yes` cannot be combined with core stack flags like `--frontend`, `--css-framework`, or `--ui-library`. If you need explicit stack options, do not pass `--yes`.
- Even with many non-interactive flags set, CLI may still prompt for AI documentation files unless `--ai-docs none` is provided explicitly.
- `bts.jsonc` currently does not persist shadcn sub-options (for example `shadcnColorTheme`, `shadcnFont`). Validate those via generated files (`components.json`, CSS, dependencies) instead of expecting them in `bts.jsonc`.
- Route-level `validateSearch` on `apps/web/src/routes/new.tsx` can pull `zod` and search-schema code into the main client bundle. Prefer parsing search params inside the lazy-loaded stack builder path to protect homepage performance.
- After adding/removing files in `apps/web/src/routes`, `apps/web/src/routeTree.gen.ts` may be stale until a route generator run (triggered by `vite build`/`vite dev`). `tsc --noEmit` can fail with route type errors if regeneration hasn't happened yet.
