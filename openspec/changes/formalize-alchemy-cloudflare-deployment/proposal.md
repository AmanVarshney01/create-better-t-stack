## Why

Better-T-Stack's Cloudflare deployment path depends on the experimental Alchemy v2 API and currently carries six targeted compatibility safeguards. Upstream main, published releases, framework integration constraints, and disproved review claims have repeatedly been conflated. Without one normative contract and executable retention/removal gates, an Alchemy upgrade can either reintroduce a known failure or preserve obsolete compatibility code indefinitely.

## What Changes

- Define the accepted exact Alchemy version and the evidence required to upgrade it.
- Formalize the supported Cloudflare topology, framework, runtime, database, binding, and deployment-time value behavior.
- Classify every current workaround as a confirmed Alchemy defect workaround, framework/platform integration shim, Better-T-Stack correctness policy, limitation, or disproved claim.
- Make `docs/alchemy-v2-beta-findings.md` the versioned evidence ledger for upstream status, reproductions, current handling, and removal conditions.
- Specify provider-free generation/typecheck/build checks and credentialed disposable live tests for version upgrades, resource-wiring changes, and shim removal.
- Require owned-stage cleanup, process/port cleanup, leak auditing, and independent reconciliation for interrupted live tests.
- Remove one compatibility shim at a time only after its published-release reproduction, generated-project checks, affected live request, and ledger update all pass.

### Non-goals

- Implementing or removing any Alchemy workaround in this planning change.
- Adding another deployment provider.
- Refactoring all deployment providers behind a common lifecycle abstraction.
- Treating a merged upstream pull request as usable before publication.
- Claiming `alchemy logs` authentication or OpenNext on-demand ISR is fixed without a focused live reproduction.

## Capabilities

### New Capabilities

- `alchemy-cloudflare-deployment`: Exact-version policy, supported Cloudflare matrix, sanctioned compatibility layer, bug ledger, verification, cleanup, and shim-removal gates.

### Modified Capabilities

None. This repository had no baseline OpenSpec capabilities before this proposal.

## Impact

This planning change adds only OpenSpec documentation. Future implementation work may affect `packages/template-generator/templates/packages/infra/alchemy.run.ts.hbs`, Alchemy dependency generation, framework adapters/plugins, generated environment/binding types, deployment tests, the external reproduction repository, live verification scripts, and `docs/alchemy-v2-beta-findings.md`. Existing generated application behavior and the current `alchemy@2.0.0-beta.61` pin remain unchanged by this change.
