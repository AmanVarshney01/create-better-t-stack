## 1. Baseline and Evidence Ledger

- [ ] 1.1 Re-verify the accepted npm version/tag commit, upstream-main commit, relevant PR status, external reproduction commit, and verification date in `docs/alchemy-v2-beta-findings.md`.
- [ ] 1.2 Inventory every generated Cloudflare topology/framework/runtime/database/addon cell and publish a scoreboard that separates generated, offline-verified, live-verified, experimental, and blocked status.
- [ ] 1.3 Move the one-off A1 StaticSite Output/dependency plan into the canonical reproduction repository or this repository with an exact dependency lock.
- [ ] 1.4 Re-run and document canonical reproductions for A2 Config serialization, A3 pure-SPA output, A4 React Router handler selection, A5 sibling-workspace memo scope, and A6 prerelease resolution.
- [ ] 1.5 Correct or annotate the external reproduction repository's misclassified `nodejs_compat` case so it cannot be cited as a confirmed Alchemy defect.
- [ ] 1.6 Record `alchemy logs` authorization and OpenNext `WORKER_SELF_REFERENCE` ISR as open limitations until their focused live tests pass.
- [ ] 1.7 Add a ledger check requiring ID, classification, affected release, evidence, upstream status, current handling, removal condition, and last-verification date for every entry.

## 2. Exact Dependency and Generated Artifact Gates

- [ ] 2.1 Keep the accepted Alchemy version in one generator dependency source and assert exact `alchemy@2.0.0-beta.61` output with no semver range.
- [ ] 2.2 Generate npm, pnpm, and Bun projects and prove each resolves the exact accepted Alchemy package rather than an incompatible test prerelease.
- [ ] 2.3 Add deterministic artifact assertions for web-only, server-only, combined, full-stack `self`, Convex-web, D1, and mixed single-plane Cloudflare topologies.
- [ ] 2.4 Assert that every selected Cloudflare plane emits `packages/infra/alchemy.run.ts`, the infra package, scripts, framework adapter/configuration, bindings, inferred env types, and user guidance.
- [ ] 2.5 Add configuration-time rejection tests for non-Hono Cloudflare servers, non-Workers runtimes, unsupported `self` frontends, and invalid D1 consumers across flags and programmatic generation.
- [ ] 2.6 Regenerate `packages/template-generator/src/templates.generated.ts` only from source templates and verify it introduces no independent behavioral drift.

## 3. Compatibility Safeguard Tests

- [ ] 3.1 Add a provider-free A1 test proving the real resolved server URL and server dependency edge reach the frontend `Command.Build` input through `outputAwareStaticSite`.
- [ ] 3.2 Add A2 tests for `Config.string`, `Config.redacted`, missing configuration, and the exact boundary where descriptors become concrete/redacted build values.
- [ ] 3.3 Assert that the Output-aware wrapper remains limited to supported top-level env shapes and does not claim recursive Input handling.
- [ ] 3.4 Add A3 generation/build tests proving TanStack Router and Solid use the StaticSite fallback with SPA not-found behavior under beta.61.
- [ ] 3.5 Add A4 tests proving React Router emits the explicit Worker entry, registers a fetch handler, and uses `renderToReadableStream` rather than Node pipeable streams.
- [ ] 3.6 Add A5 tests that edit an imported sibling workspace without changing the lockfile and prove a normal generated build cannot reuse stale output.
- [ ] 3.7 Add A6 package-manager tests proving the exact pin resolves identically under npm, pnpm, and Bun; retain exact pinning permanently rather than attempting to qualify an open-ended range.
- [ ] 3.8 Add a one-to-one test mapping from A1–A6 to the generated line(s), reproduction, and retention/removal rule so no safeguard becomes orphaned.

## 4. Framework, Binding, and Development Verification

- [ ] 4.1 Generate, install, typecheck, and build the Cloudflare path for Next.js, Nuxt, SvelteKit, Astro, TanStack Start, React Router, TanStack Router, and Solid against the exact accepted release.
- [ ] 4.2 Verify Next/OpenNext assets, Worker entry, explicit compatibility flags, Images binding, and normal request behavior.
- [ ] 4.3 Verify Nuxt Nitro assets/server entry, page SSR path, development `getPlatformProxy` alias, and D1-backed request rather than probing only an API route.
- [ ] 4.4 Verify SvelteKit's Cloudflare adapter output, bundled `_worker.js` shim, document request, and bindings.
- [ ] 4.5 Verify Astro's server entry, session KV, Images binding/type, document or action route, and distinction between static and SSR output.
- [ ] 4.6 Verify TanStack Start's `Website.Vite` Worker output, document/API route, runtime bindings, and framework auth/environment values.
- [ ] 4.7 Verify React Router's custom entry through a real workerd document request.
- [ ] 4.8 Verify TanStack Router and Solid root plus direct deep-route SPA requests.
- [ ] 4.9 Verify Prisma D1 production migration discovery separately from the full nested Wrangler `migrations_pattern` required for local development.
- [ ] 4.10 Assert D1, KV/session, Images, and service bindings exist exactly once in infrastructure, framework config, and inferred environment types.
- [ ] 4.11 Verify explicit external-Worker compatibility flags as framework/platform requirements and do not relabel them as implicit-default loss.

## 5. Disposable Live Harness

- [ ] 5.1 Create a credential-gated harness that assigns a unique stage/ownership record before mutation and retains the originating directory plus `.alchemy` state through destruction.
- [ ] 5.2 Track every child process and reserved port, terminate only owned processes, and fail early on an unrelated occupied port rather than killing it.
- [ ] 5.3 Persist the ownership marker, expected resource inventory, source digest, and discovered IDs outside the runner; destroy from the same directory/exact stage in `finally`, and make the independent reconciler delete only marker-matched resources through Cloudflare APIs without local Alchemy state.
- [ ] 5.4 Audit owned Workers, D1 databases, KV namespaces, and related resources after destroy; leave unowned resources untouched and print exact recovery commands for leaks.
- [ ] 5.5 Restrict credentialed tests to trusted protected code and isolated disposable Cloudflare scope; run provider-free checks for forks/untrusted pull requests.
- [ ] 5.6 Add time, resource-count, and concurrency ceilings so a failed matrix cannot create unbounded paid resources.

## 6. Accepted-Version Live Baseline

- [ ] 6.1 Live-deploy and request one web-only, one Hono Workers server-only, one combined web/server, and each currently claimed full-stack `self` archetype.
- [ ] 6.2 In the combined case, inspect the plan/build input and deployed artifact to prove the real Worker URL and dependency edge, not merely the absence of localhost strings.
- [ ] 6.3 Live-test pure SPA root and deep routes, React Router document SSR, and each server-rendered framework's page route.
- [ ] 6.4 Live-test D1 migration plus a database-backed application request for every claimed consumer shape.
- [ ] 6.5 Live-test framework-required KV/Images bindings with behavior or an adapter route, not only generated type declarations.
- [ ] 6.6 Exercise a sibling-workspace-only edit followed by a normal deploy when evaluating memo behavior.
- [ ] 6.7 Exercise OpenNext on-demand revalidation before promoting `WORKER_SELF_REFERENCE` ISR from limitation to supported.
- [ ] 6.8 Reauthenticate with a fresh Alchemy profile and test both `alchemy logs` and `alchemy tail` before filing or closing an upstream authorization issue.
- [ ] 6.9 Publish the accepted-version scoreboard and downgrade any generated-but-not-live-verified framework/topology claim to experimental until its named live route passes.

## 7. Upgrade and Shim-Removal Workflow

- [ ] 7.1 Evaluate only a published exact Alchemy candidate and record its tag commit; never upgrade from main, an open PR, or a moving dist-tag alone.
- [ ] 7.2 Run every applicable A1–A6 reproduction against the candidate before changing the generated dependency.
- [ ] 7.3 Generate/install/typecheck/build the affected framework and topology matrix against the candidate under npm, pnpm, and Bun.
- [ ] 7.4 Run every affected credentialed live scenario and cleanup audit against the candidate.
- [ ] 7.5 Change the generated exact pin only when the full release gate passes; otherwise record the candidate regression and keep beta.61.
- [ ] 7.6 Remove at most one logically independent A1–A5 workaround or named integration shim per follow-up change and rerun its provider-free and live removal gates without it; A6 exact pinning is not removable.
- [ ] 7.7 Update the findings ledger, generated assertions, comments, and user documentation in the same change that changes a pin or removes a shim.
- [ ] 7.8 Re-evaluate Alchemy PRs #779, #795, #796 and cloudflare-tools PR #62 only after a containing exact package is published.

## 8. Documentation and Final Review

- [ ] 8.1 Document the exact Alchemy pin, prerelease status, first-login/deploy/destroy commands, stage ownership, cleanup expectations, and current support scoreboard.
- [ ] 8.2 Explain which non-obvious generated lines are confirmed workarounds, integration shims, correctness policies, open limitations, or disproved claims.
- [ ] 8.3 Keep README, post-install output, plugin skill, code comments, and `docs/alchemy-v2-beta-findings.md` consistent with the same support claims and removal gates.
- [ ] 8.4 Run formatting/lint, generator typecheck, relevant unit tests, generated-project checks, canonical reproductions, and strict OpenSpec validation.
- [ ] 8.5 Reader-test the upgrade checklist and recovery instructions with a reviewer that has only the generated project, ledger, and official prerequisites.
- [ ] 8.6 Audit the final diff for out-of-scope provider-unification remnants, unrelated files, stale generated snapshots, local state, secret values, and accidental workaround removal.
- [ ] 8.7 Publish an honest release report listing generated, offline-verified, live-verified, experimental, blocked, fixed-but-unreleased, and cleaned-up status separately.
