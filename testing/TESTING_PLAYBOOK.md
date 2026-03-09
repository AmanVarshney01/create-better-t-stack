# Production Matrix Playbook

## Scope

Validate scaffold quality using production package command:

```bash
bun create better-fullstack@latest
```

Run 10 unique combos per cycle (unless specified otherwise), verify internals, fix template issues in repo, and record results.

## Standard Flow

1. Read existing combo ledger in `testing/combos-*.json` and avoid duplicates.
2. Generate 10 new projects with explicit stack flags plus `--ai-docs none --no-git`.
3. Choose the run mode:
   - Broad scaffold sweep: add `--no-install` to keep the cycle fast and isolate scaffold correctness.
   - Full validation: allow installs, then run the ecosystem checks below.
4. Verify generated content:
   - root file presence (`Cargo.toml` / `pyproject.toml` / `go.mod`)
   - selected-option markers in generated files
5. Run deeper checks:
   - Rust: `cargo check`
   - Python: `python3 -m compileall -q .`
   - Go: `go mod tidy && go build ./...`
6. Classify failures:
   - environment/tool missing
   - template/generator bug
7. Fix real bugs in repo templates/processors.
8. Rebuild/regen as needed (e.g. template-generator embedded templates).
9. Re-test failing combos until passing.
10. Delete generated temp projects.
11. Update combo JSON ledger with outcomes and fixed issues.

## Required Tooling

- `bun`
- `python3`
- `cargo`
- `go`
- `protoc` (needed for Rust tonic projects)

## Notes

- `--ai-docs none` suppresses AI documentation file prompts and keeps the run deterministic.
- `--no-git` skips git init and the initial commit, which reduces noise in temp test projects.
- `go.sum` is expected only after `go mod tidy` / build.
- If CLI uses embedded templates, rebuild template generator before re-test.
- Do not combine `--yes` with explicit stack flags like `--frontend`, `--css-framework`, or `--ui-library`.
- Prefer `--no-install` only for broad scaffold sweeps or when the environment is missing ecosystem tooling. For production package validation of a smaller batch, installs are useful and should usually be enabled.
