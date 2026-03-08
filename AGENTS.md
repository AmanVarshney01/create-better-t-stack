The role of this file is to describe common mistakes and confusion points that agents might encounter as they work in this project. If you ever encounter something in the project that surprises you, please alert the developer working with you and indicate that this is the case in the AgentMD file to help prevent future agents from having the same issue.

## Load-on-demand guidance

- `docs/guidelines/README.md` is the index for deeper guidance. Do not read guideline files by default.
- If the task touches template generation, generated README/env output, release verification, or CLI tests around generated projects, open `docs/guidelines/template-generator/gotchas.md`.

## High-signal defaults

- `--yes` cannot be combined with core stack flags like `--frontend`, `--css-framework`, or `--ui-library`. If you need explicit stack options, do not pass `--yes`.
- Even with many non-interactive flags set, CLI may still prompt for AI documentation files unless `--ai-docs none` is provided explicitly.
- Route-level `validateSearch` on `apps/web/src/routes/new.tsx` can pull `zod` and search-schema code into the main client bundle. Prefer parsing search params inside the lazy-loaded stack builder path to protect homepage performance.
- After adding or removing files in `apps/web/src/routes`, `apps/web/src/routeTree.gen.ts` may be stale until a route generator run triggered by `vite build` or `vite dev`.
- The CI lint job builds `@better-fullstack/types` before running `validate:tech-links`, so workspace alias imports work in `apps/web`. If a new pre-build CI step is added that touches web source, ensure types are built first.
- Go builder rendering depends on both `ECOSYSTEM_CATEGORIES.go` in `apps/web/src/lib/constant.ts` and `GO_CATEGORY_ORDER` in `apps/web/src/lib/stack-utils.ts`. If a Go option exists in the metadata but not the builder UI, check that both lists were updated together.
- Auth capability metadata is intentionally global across ecosystems in `packages/types`, but the web builder should filter visible auth choices by ecosystem in `apps/web/src/components/stack-builder/utils.ts`. Do not assume disabled reasons alone are enough to produce the desired builder UI.
- The builder has two auth option render paths in `apps/web/src/components/stack-builder/stack-builder.tsx` (sidebar accordion + main category grid). Apply auth visibility filtering in both paths to avoid inconsistent options between sidebar and main content.
