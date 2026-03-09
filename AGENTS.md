The role of this file is to describe common mistakes and confusion points that agents might encounter as they work in this project. If you ever encounter something in the project that surprises you, please alert the developer working with you and indicate that this is the case in the AgentMD file to help prevent future agents from having the same issue.

## Guidelines

Do not read files in `docs/guidelines/` by default. Treat this section as an index and only open a guideline file when the user request clearly matches that topic.

See `docs/guidelines/` for deeper reference on these topics:

- `README.md` - folder purpose, usage rules, and quick index for all guideline files
- `architecture-and-ownership.md` - monorepo package ownership and where changes belong
- `stack-options-and-compatibility.md` - schema source of truth, canonical option metadata, aliases, and compatibility rules
- `generator-change-playbook.md` - how option changes flow through templates, snapshots, CLI output, and web previews
- `web-builder-and-url-state.md` - stack builder state, URL parsing, lazy-route constraints, and preview wiring
- `testing-release-and-upstream.md` - targeted verification commands, release guard expectations, and upstream backport workflow
- `scripted-cli-runs.md` - safe non-interactive CLI usage, prompt-avoidance flags, and matrix-testing caveats
- `production-package-testing.md` - how to use the `testing/` workspace for published npm-package validation cycles

## Workflow

- Never start the dev server (`turbo dev`, `bun run dev`, `vite dev`, etc.) unless explicitly asked to.
- After code changes, run the smallest verification set that proves the modified area still works. Prefer package-local `bun run lint`, `bun run test`, `bun run build`, or specific `bun test <file>` commands over broad workspace sweeps.
- For release-sensitive stack or generator changes, run `bun run test:release` from the repo root. That lane covers template snapshots, CLI/builder parity, and preview-config regressions.

## Bun

Bun is the default package manager and script runner. Use `bun install`, `bun run <script>`, `bun test`, and `bunx`. Do not switch to npm, pnpm, yarn, npx, or ad hoc `node` wrappers unless a file explicitly requires it.


## High-Signal Gotchas

- `--yes` cannot be combined with core stack flags like `--frontend`, `--css-framework`, or `--ui-library`. If you need explicit stack options, do not pass `--yes`.
- Even with many non-interactive flags set, CLI may still prompt for AI documentation files unless `--ai-docs none` is provided explicitly.
- Route-level `validateSearch` on `apps/web/src/routes/new.tsx` can pull `zod` and search-schema code into the main client bundle. Prefer parsing search params inside the lazy-loaded stack builder path to protect homepage performance.
- After adding/removing files in `apps/web/src/routes`, `apps/web/src/routeTree.gen.ts` may be stale until a route generator run (triggered by `vite build`/`vite dev`). `tsc --noEmit` can fail with route type errors if regeneration hasn't happened yet.
- `apps/cli/test/cli-builder-sync.test.ts` was historically brittle: it depended on current working directory for file resolution and silently skipped prompt/schema checks when parsing failed. Keep path resolution root-safe (`apps/cli/...` fallback) and fail hard on parse gaps to avoid false-green sync tests.
- The old CLI/builder sync test intentionally excluded `analytics=umami`, which let the builder drift behind the CLI schema without failing CI. When excluding schema values from parity tests, document the product reason and revisit the exclusion quickly or it will mask real stack-option drift.
## Load-on-demand guidance
- The CI lint job builds `@better-fullstack/types` before running `validate:tech-links`, so workspace alias imports work in `apps/web`. If a new pre-build CI step is added that touches web source, ensure types are built first.
- Go builder rendering depends on both `ECOSYSTEM_CATEGORIES.go` in `apps/web/src/lib/constant.ts` and `GO_CATEGORY_ORDER` in `apps/web/src/lib/stack-utils.ts`. If a Go option exists in the metadata but not the builder UI, check that both lists were updated together.
- Auth capability metadata is intentionally global across ecosystems in `packages/types`, but the web builder should filter visible auth choices by ecosystem in `apps/web/src/components/stack-builder/utils.ts`. Do not assume disabled reasons alone are enough to produce the desired builder UI.
- The builder has two auth option render paths in `apps/web/src/components/stack-builder/stack-builder.tsx` (sidebar accordion + main category grid). Apply auth visibility filtering in both paths to avoid inconsistent options between sidebar and main content.
