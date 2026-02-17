# Testing Workspace

This folder is the reusable workspace for manual production CLI validation runs.

## Goal

Run repeatable matrix tests with:

- `bun create better-fullstack@latest`
- 10 unique project combos per cycle
- verification (create + compile/build checks)
- issue reporting + repo fixes
- cleanup of generated projects
- combo ledger updates

## Files

- `testing/TESTING_PLAYBOOK.md`: step-by-step process
- `testing/PROMPT_TEMPLATE.md`: reusable prompt so you do not rewrite instructions
- `testing/combos-2026-02-17.json`: compact combo ledger from the latest cycle

## Output Convention

Add one compact JSON file per run date:

- `testing/combos-YYYY-MM-DD.json`
