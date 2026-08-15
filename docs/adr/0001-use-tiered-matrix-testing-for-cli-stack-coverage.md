# Use tiered matrix testing for CLI stack coverage

We will expose two test entrypoints: `bun test` for the fast default suite and `bun run test:complete` for the complete confidence pass. The default suite runs in CI and covers focused CLI behavior, MCP contracts, filesystem scaffolding, and representative regressions. The complete pass adds the balanced smoke matrix plus curated generated-project install/typecheck/build samples. The exhaustive normalized core-stack matrix remains available as an explicit `BTS_MATRIX_MODE=full` run for targeted local or sharded CI use, while addon subset products, the add path, the MCP surface, filesystem scaffolding, and real dependency builds use focused suites or curated representative cases. This balances the desire to cover all meaningful stack combinations with the runtime and maintenance cost of crossing every addon, protocol, filesystem, and build dimension through the same matrix.

## Considered Options

- Put every schema value, addon subset, MCP tool path, filesystem write, install, typecheck, and build into one exhaustive product.
- Keep only focused tests and targeted regressions.
- Use tiered coverage with a balanced default matrix, an opt-in exhaustive core-stack matrix, and focused suites for behavior that does not benefit from full cross-product testing.

## Consequences

- The full matrix is not part of the default `bun test` or `bun run test:complete` suite.
- The full matrix can be run explicitly with `BTS_MATRIX_MODE=full` and should use `BTS_MATRIX_SHARD`; unsharded full runs require `BTS_MATRIX_ALLOW_UNSHARDED_FULL=1`.
- Addon compatibility coverage proves addon rules and important interactions without crossing every addon subset through every core-stack combination.
- MCP coverage focuses on protocol and tool contracts instead of duplicating the full create matrix through MCP transport.
- Compile confidence comes from a curated build set rather than building every valid matrix case.
- Invalid matrix cases assert the rejecting rule or category; exact user-facing error messages are covered by focused validation tests.
- Matrix implementation should use reusable case-generation and oracle utilities with small test entrypoints, not one mega test file.
