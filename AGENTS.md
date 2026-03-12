The role of this file is to describe common mistakes and confusion points that agents might encounter as they work in this project. If you ever encounter something in the project that surprises you, please alert the developer working with you and indicate that this is the case in the AgentMD file to help prevent future agents from having the same issue.

## Guidelines

Do not read files in `docs/guidelines/` by default. Treat this section as an index and only open a guideline file when the user request clearly matches that topic.

See `docs/guidelines/` for deeper reference on these topics:

- `README.md` - folder purpose, usage rules, and quick index for all guideline files
- `architecture-and-ownership.md` - monorepo package ownership and where changes belong
- `stack-options-and-compatibility.md` - schema source of truth, canonical option metadata, aliases, and compatibility rules
- `generator-change-playbook.md` - how option changes flow through templates, snapshots, CLI output, and web previews
- `web-builder-and-url-state.md` - stack builder state, URL parsing, lazy-route constraints, and preview wiring
- `testing-release-and-upstream.md` - targeted verification commands, release guard expectations, and upstream backport workflow
- `scripted-cli-runs.md` - safe non-interactive CLI usage, prompt-avoidance flags, and matrix-testing caveats
- `production-package-testing.md` - how to use the `testing/` workspace for published npm-package validation cycles
- `template-output-and-validation.md` - template conditional logic, generated output validation, sync test discipline, and framework-specific constraints

## Workflow

- Never start the dev server (`turbo dev`, `bun run dev`, `vite dev`, etc.) unless explicitly asked to.
- After code changes, run the smallest verification set that proves the modified area still works. Prefer package-local `bun run lint`, `bun run test`, `bun run build`, or specific `bun test <file>` commands over broad workspace sweeps.
- For release-sensitive stack or generator changes, run `bun run test:release` from the repo root. That lane covers template snapshots, CLI/builder parity, and preview-config regressions.
- Surprise worth remembering: `apps/cli/test/cli-builder-sync.test.ts` reads the built `packages/types/dist` output via the workspace package, not just the source files. After changing `packages/types/src/*`, rebuild `packages/types` before trusting that parity test.
- Surprise worth remembering: `react-vite` originally received auth dependencies from `packages/template-generator/src/processors/auth-deps.ts` without receiving matching auth templates from `packages/template-generator/src/template-handlers/auth.ts`. When expanding `react-vite`, verify both dependency processors and template handlers are updated together.

## Bun

Bun is the default package manager and script runner. Use `bun install`, `bun run <script>`, `bun test`, and `bunx`. Do not switch to npm, pnpm, yarn, npx, or ad hoc `node` wrappers unless a file explicitly requires it.
- In this WSL setup, `bun` on `PATH` can resolve to the Windows install instead of native Linux Bun. For Turbo runs and published-package verification, prefer `~/.bun/bin/bun` and `~/.bun/bin/bunx` explicitly.
