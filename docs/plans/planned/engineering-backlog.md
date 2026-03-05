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

## Planned

- [ ] Normalize naming consistency (`SvelteKit` display name, preserve backward-compatible aliases).
  - Note: partially improved, but still needs explicit closure criteria.
- [ ] Add canonical option metadata map for IDs, aliases, labels, and category semantics.
- [ ] Reduce snapshot brittleness by normalizing generated file whitespace/newlines.
- [ ] Add release-focused CI lane for template snapshots + compatibility parity + CLI/web sync.
- [ ] Continue weekly upstream backports focused on reliability, dependency safety, and compatibility.
