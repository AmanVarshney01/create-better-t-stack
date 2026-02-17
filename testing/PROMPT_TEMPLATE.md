# Reusable Prompt Template

Use this prompt to start a full test cycle without rewriting instructions.

```text
Use production command `bun create better-fullstack@latest` to test scaffolding quality.

Requirements:
1) Create 10 unique projects that are not already in `testing/combos-*.json`.
2) Use ecosystems: rust, python, go , Typescript.
3) Verify each project internally:
   - file structure checks
   - selected option marker checks
   - Rust: cargo check
   - Python: python3 -m compileall -q .
   - Go: go mod tidy && go build ./...
4) Report pass/fail per combo with concrete issue details.
5) If failures are template/generator bugs, fix them in repo and re-verify failed combos.
6) Remove all generated temp projects after verification.
7) Update `testing/combos-YYYY-MM-DD.json` in compact format with:
   - combo flags
   - result in @latest
   - issue code/details
   - fixedInRepo

Deliver:
- final summary with total pass/fail
- list of issues found
- list of files changed for fixes
```
