# Testing, Release, And Upstream

Use this guide when deciding what to verify after changes or when working on release-facing and upstream-maintenance tasks.

## Default verification strategy

Run the narrowest checks that cover the changed area:

- `bun run --cwd packages/types build` for shared type and metadata changes
- `bun run --cwd apps/web lint` for builder, route, or preview changes
- `bun run --cwd apps/cli lint` for prompt, CLI, or parity changes
- `bun test <path>` for focused regressions

For changes that affect stack options, generated output, compatibility, or preview correctness, also run:

```bash
bun run test:release
```

That release lane currently covers:

- CLI template snapshots
- CLI/web option parity
- web preview config tests

## Important package-specific notes

- `apps/cli` lint already includes the sync test, so a parity regression can appear as a lint failure.
- Not every generated frontend template defines `check-types`. Root commands should use `--if-present` semantics when filtering across packages.
- `apps/web` route changes can require a build to regenerate `routeTree.gen.ts` before type checks settle.

## Release workflow expectations

- `.github/workflows/test.yaml` runs a dedicated `Release Guard` job before broader build checks.
- `.github/workflows/release.yaml` also runs the release verification lane before publishing packages.
- Published packages are versioned independently inside the release workflow. Do not hand-edit version bumps casually during unrelated feature work.

## Upstream maintenance

- Use `bun run upstream-gap-report` or `bun run scripts/upstream-gap-report.ts --markdown` to inspect drift from upstream.
- The report classifies likely backport candidates into `reliability`, `dependency-safety`, and `compatibility`.
- Prefer manual backports over large cherry-picks unless the upstream change is isolated and low-risk.
- Keep Better-Fullstack-specific naming and architecture choices intact when backporting.
- Use `docs/plans/README.md` as the stable entry point for current planning documents instead of assuming an older backlog filename still exists.
