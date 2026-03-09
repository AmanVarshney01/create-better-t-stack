# Production Package Testing

Use this guide when validating the published npm package with real scaffold runs rather than only testing the local workspace code.

## Purpose

The `testing/` folder is the working area for production validation cycles against:

```bash
bun create better-fullstack@latest
```

This is not the default test path for normal feature work. Open these files only when the task explicitly involves production-package validation, matrix runs, or updating the combo ledger.

## Files to use

- `testing/README.md` explains the workspace purpose.
- `testing/TESTING_PLAYBOOK.md` is the manual step-by-step cycle.
- `testing/PROMPT_TEMPLATE.md` is the reusable operator prompt.
- `testing/combos-*.json` files are the historical combo ledger. Avoid duplicate combos in new cycles.
- `testing/generate-combos.ts` helps produce candidate combinations.

## Recommended flow

1. Read recent `testing/combos-*.json` files and avoid already-covered combinations.
2. Create a fresh batch, usually 10 unique projects unless the task says otherwise.
3. Use the production package command first: `bun create better-fullstack@latest`.
4. Keep runs non-interactive with explicit flags such as `--ai-docs none` and `--no-git`.
5. Use `--no-install` only when the goal is a fast scaffold-only sweep or the environment lacks required tooling. For smaller or higher-signal production validation batches, allowing installs is preferred.
6. Do not combine explicit stack flags with `--yes`.
7. Verify generated file markers and run ecosystem-specific checks.
8. If production output fails because of a real repo bug, fix the repo, rebuild local artifacts, and re-test the failing combinations with the local CLI path.
9. Delete generated temp projects after verification.
10. Record outcomes in a new dated combo JSON file.

## Verification expectations

- TypeScript projects: inspect generated markers and run the most relevant package or workspace checks for the bug being investigated.
- Rust: `cargo check`
- Python: `python3 -m compileall -q .`
- Go: `go mod tidy && go build ./...`
- Rust tonic projects may require `protoc`.

## Flag meanings

- `--ai-docs none`: do not generate agent-doc files like `AGENTS.md` or `CLAUDE.md`, and avoid that prompt.
- `--no-git`: skip git repository initialization and the initial commit inside the generated project.
- `--no-install`: skip dependency installation. Useful for speed and for isolating scaffold generation from dependency-install failures, but not required for every production test cycle.

## Local re-test rule

After fixing a repo bug, do not pretend the published package changed. Record the failure under `@latest`, then separately document the local re-test using the built CLI, typically:

```bash
node ./apps/cli/dist/cli.mjs create <name> ...
```

Run this from the repository root.

If the change affects embedded templates, rebuild template artifacts before re-testing.

## Ledger hygiene

- Add one compact dated file per cycle: `testing/combos-YYYY-MM-DD.json`
- Record the command shape, pass/fail result, issue codes, and whether the repo fix resolved it locally
- Keep notes concrete enough that a later release can be verified against the exact same failure mode
