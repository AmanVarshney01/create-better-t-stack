# Engineering Backlog

This file tracks the engineering tasks that were previously grouped under "Codex improvements".

## Completed (verified in repo)

- [x] Improve `/api/preview` fidelity so preview output matches real generation behavior.
  - Evidence: `apps/web/src/lib/preview-config.ts`, `apps/web/src/routes/api/preview.ts`, `apps/web/test/preview-config.test.ts`
- [x] Clarify backend taxonomy in UI/CLI (standalone backend vs `self-*` fullstack modes).
  - Evidence: `apps/web/src/lib/constant.ts` (`Fullstack *` backend options), `apps/web/src/lib/stack-utils.ts` (`self-*` to `self` CLI mapping)
- [x] Add compatibility UX improvements (deterministic disabled reasons + auto-adjusted fallbacks).
  - Evidence: `packages/types/src/compatibility.ts` (`getDisabledReason`, `analyzeStackCompatibility`)
- [x] Add contract tests to enforce CLI/web compatibility and command parity.
  - Evidence: `apps/cli/test/cli-builder-sync.test.ts`
- [x] Remove stale/experimental web routes and unreferenced components.
  - Evidence: deleted dead home components (including `apps/web/src/components/home/combinations-3d-section.tsx`) after reference sweep.
- [x] Automate combinations count generation (remove hardcoded values).
  - Evidence: `apps/web/src/lib/combinations-count.ts` now drives `apps/web/src/components/home/combinations-section.tsx`.
- [x] Tighten CLI/web sync tests to remove parser skips and unmapped category blind spots.
  - Evidence: `apps/cli/test/cli-builder-sync.test.ts` now hard-fails on parse gaps, maps Python/shadcn/feature-flag categories, and validates prompt extraction without skip fallbacks.
- [x] Normalize naming consistency (`SvelteKit` display name, preserve backward-compatible aliases).
  - Evidence: `packages/types/src/option-metadata.ts` (`svelte`/`self-svelte` alias normalization), `apps/web/src/lib/constant.ts` (`SvelteKit` label), `apps/cli/src/prompts/frontend.ts`.
- [x] Add canonical option metadata map for IDs, aliases, labels, and category semantics.
  - Evidence: `packages/types/src/option-metadata.ts`, consumed by `apps/web/src/components/stack-builder/stack-builder.tsx` and `apps/cli/test/cli-builder-sync.test.ts`.
- [x] Reduce snapshot brittleness by normalizing generated file whitespace/newlines.
  - Evidence: `apps/cli/test/snapshot-utils.ts` normalizes line endings, trailing whitespace, and final newline shape before snapshotting.
- [x] Add release-focused CI lane for template snapshots + compatibility parity + CLI/web sync.
  - Evidence: root `package.json` (`test:release`), `.github/workflows/test.yaml` (`Release Guard` job), `.github/workflows/release.yaml` (pre-publish release verification).
- [x] Continue weekly upstream backports focused on reliability, dependency safety, and compatibility.
  - Evidence: `scripts/upstream-gap-report.ts` now highlights priority backport candidates by focus area in the weekly report consumed by `.github/workflows/upstream-gap.yml`.

## Planned
- No open items. Add new tasks here as follow-up engineering backlog work is identified.
