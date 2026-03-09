# Guidelines

This folder contains extended project guidance for AI agents working in Better-Fullstack.

Usage rules:

- Do not read every file here by default. Start from `AGENTS.md`, then open only the guideline file that matches the task.
- Keep these files focused on reusable project knowledge, not one-off task notes.
- If a guideline becomes stale, update the guideline and the `AGENTS.md` index together.

Files:

- `architecture-and-ownership.md` - monorepo layout, package responsibilities, and where edits belong
- `stack-options-and-compatibility.md` - canonical option metadata, aliases, schema ownership, and compatibility constraints
- `generator-change-playbook.md` - template-generation change flow, snapshot expectations, and output validation
- `web-builder-and-url-state.md` - stack builder state handling, URL encoding, lazy loading constraints, and route gotchas
- `testing-release-and-upstream.md` - verification commands, release-focused CI, and upstream backport workflow
- `scripted-cli-runs.md` - non-interactive CLI rules, prompt avoidance, and matrix caveats
- `production-package-testing.md` - production `bun create better-fullstack@latest` validation workflow and combo-ledger rules
- `template-output-and-validation.md` - template conditional logic, generated output validation, sync test discipline, and framework-specific constraints
