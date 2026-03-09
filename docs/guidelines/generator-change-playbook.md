# Generator Change Playbook

Use this guide when the task changes generated project files or the way stack selections affect emitted output.

## Mental model

- `packages/types` defines what selections are valid.
- `packages/template-generator` turns those selections into a virtual file tree.
- `apps/cli` writes that tree to disk for real project generation.
- `apps/web` uses the same stack data to render previews and shareable configurations.

If generated output changes but the web preview or CLI does not, the change is usually incomplete.

## Common change flow

1. Confirm the stack value exists in the shared types layer.
2. Update template-generator branches so the correct files are emitted.
3. Update preview handling if the web builder should reflect the change.
4. Re-run snapshot tests and any targeted package checks.

## Snapshot expectations

- `apps/cli/test/template-snapshots.test.ts` protects high-value generated output.
- `apps/cli/test/snapshot-utils.ts` normalizes CRLF and trailing whitespace before snapshotting.
- Snapshot updates should reflect meaningful template changes, not line-ending noise.

## Validation advice

- Validate shadcn-specific behavior through generated files like `components.json`, CSS, and dependencies. `bts.jsonc` does not currently persist shadcn sub-options.
- When a helper or variable is conditional, emit it only when downstream code uses it. Recent failures came from unconditional helpers (`toNativeRequest`, `addr`) becoming unused in certain stack branches.
- For stack-specific type issues, inspect generated context types instead of assuming the template branch covers every backend. The `fets` + `trpc` + `better-auth` path was a real example of a missing branch.
- Root workspace `check-types` commands for generated projects must use `--if-present` semantics because some templates do not define that script.
- Redwood path helpers must stay backend-aware. When `frontend=redwood` and `backend != none`, generated paths should target `apps/web` and `apps/server`, not `web/api`.

## Good verification targets

- `bun test apps/cli/test/template-snapshots.test.ts`
- `bun test apps/cli/test/cli-builder-sync.test.ts`
- package-local lint or type checks for the package you changed
- focused generator scripts or matrix tests when the change touches a broad compatibility surface
