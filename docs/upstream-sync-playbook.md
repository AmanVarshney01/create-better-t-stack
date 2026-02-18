# Upstream Sync Playbook

This repository tracks upstream improvements from `AmanVarshney01/create-better-t-stack` without doing full rebases.

## Goals

- Keep drift visible and bounded.
- Backport high-value fixes/features selectively.
- Protect Better-Fullstack-specific architecture choices.

## Weekly Workflow

1. CI runs `.github/workflows/upstream-gap.yml` every Monday.
2. It generates a grouped gap report for:
   - `apps/cli`
   - `apps/web`
   - `packages/template-generator`
   - `packages/types`
3. It posts the report in the workflow summary and appends to the tracking issue.

## Local Usage

Run a report locally:

```bash
bun run scripts/upstream-gap-report.ts --markdown
```

Useful options:

```bash
# JSON output
bun run scripts/upstream-gap-report.ts --json

# Compare against a specific base ref
bun run scripts/upstream-gap-report.ts --base origin/main --markdown

# Limit displayed commits per area
bun run scripts/upstream-gap-report.ts --markdown --max-per-area 25
```

## Backport Procedure

1. Pick commits from the report by area and impact.
2. Implement manually (avoid large cherry-picks unless isolated and low-risk).
3. Keep branding/package names as Better-Fullstack.
4. Run gates:
   - `bun run check`
   - `bun run build`
   - `cd apps/cli && bun test cli-builder-sync`
   - `cd apps/web && bun run build`
5. Open focused PRs by theme (stability, commands, web parity, etc.).

## Decision Rules

- Prefer reliability, DX, and compatibility fixes first.
- Skip upstream architectural shifts that conflict with this fork.
- Treat report as advisory: no automatic merge/cherry-pick in CI.
