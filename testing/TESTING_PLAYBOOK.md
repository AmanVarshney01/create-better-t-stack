# Production Matrix Playbook

## Scope

Validate scaffold quality using production package command:

```bash
bun create better-fullstack@latest
```

Run 10 unique combos per cycle (unless specified otherwise), verify internals, fix template issues in repo, and record results.

## Standard Flow

1. Read existing combo ledger in `testing/combos-*.json` and avoid duplicates.
2. Generate 10 new projects with `--yes --no-install --no-git --disable-analytics` plus ecosystem flags.
3. Verify generated content:
   - root file presence (`Cargo.toml` / `pyproject.toml` / `go.mod`)
   - selected-option markers in generated files
4. Run deeper checks:
   - Rust: `cargo check`
   - Python: `python3 -m compileall -q .`
   - Go: `go mod tidy && go build ./...`
5. Classify failures:
   - environment/tool missing
   - template/generator bug
6. Fix real bugs in repo templates/processors.
7. Rebuild/regen as needed (e.g. template-generator embedded templates).
8. Re-test failing combos until passing.
9. Delete generated temp projects.
10. Update combo JSON ledger with outcomes and fixed issues.

## Required Tooling

- `bun`
- `python3`
- `cargo`
- `go`
- `protoc` (needed for Rust tonic projects)

## Notes

- `go.sum` is expected only after `go mod tidy` / build.
- If CLI uses embedded templates, rebuild template generator before re-test.
