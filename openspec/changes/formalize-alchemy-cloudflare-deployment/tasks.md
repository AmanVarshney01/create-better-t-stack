## 1. Baseline and Evidence Ledger

- [x] 1.1 Re-verify the accepted npm version/tag commit, upstream-main commit, relevant PR status, external reproduction commit, and verification date in `docs/alchemy-v2-beta-findings.md`.
- [ ] 1.2 Inventory every generated Cloudflare topology/framework/runtime/database/addon cell and publish a scoreboard that separates generated, offline-verified, live-verified, experimental, and blocked status.
- [ ] 1.3 Move the one-off A1 StaticSite Output/dependency plan into the canonical reproduction repository or this repository with an exact dependency lock.
- [ ] 1.4 Re-run and document canonical reproductions for A2 Config serialization, A3 pure-SPA output, A4 React Router handler selection, A5 sibling-workspace memo scope, and A6 prerelease resolution.
- [x] 1.5 Delete the external reproduction repository's misclassified `nodejs_compat` case so it cannot be cited as a confirmed Alchemy defect.
- [ ] 1.6 Record `alchemy logs` authorization and OpenNext `WORKER_SELF_REFERENCE` ISR as open limitations until their focused live tests pass.
- [ ] 1.7 Add a ledger check requiring ID, classification, affected release, evidence, upstream status, current handling, removal condition, and last-verification date for every entry.
- [x] 1.8 Record merged Alchemy PRs #886 and #923, beta.69, published `@distilled.cloud/*@0.17.0` packages, package peers, and framework limitations without treating publication as accepted behavior.

## 2. Exact Dependency and Generated Artifact Gates

- [x] 2.1 Keep the accepted Alchemy version in one generator dependency source and assert exact `alchemy@2.0.0-beta.69` output with no semver range; pin Effect and both platform packages to compatible beta.103.
- [ ] 2.2 Generate npm, pnpm, and Bun projects and prove each resolves the exact accepted Alchemy package rather than an incompatible test prerelease.
- [ ] 2.3 Add deterministic artifact assertions for web-only, server-only, combined, full-stack `self`, Convex-web, D1, and mixed single-plane Cloudflare topologies.
- [ ] 2.4 Assert that every selected Cloudflare plane emits `packages/infra/alchemy.run.ts`, the infra package, scripts, framework adapter/configuration, bindings, inferred env types, and user guidance.
- [ ] 2.5 Add configuration-time rejection tests for non-Hono Cloudflare servers, non-Workers runtimes, unsupported `self` frontends, and invalid D1 consumers across flags and programmatic generation.
- [x] 2.6 Regenerate `packages/template-generator/src/templates.generated.ts` only from source templates and verify it introduces no independent behavioral drift.
- [ ] 2.7 For a release containing first-class framework resources, prove every dynamic `@distilled.cloud/*` source resolves from its generated package location under fresh npm, pnpm, and Bun installs without accidental hoisting.
- [ ] 2.8 Assert that no generated project uses a git dependency, pull-request branch, moving dist-tag, or unpublished framework source package.

## 3. Compatibility Safeguard Tests

- [x] 3.1 Assert native `StaticSite` receives the combined server Output directly and live-prove the deployed URL reaches its build artifact.
- [ ] 3.2 Complete the native `StaticSite` Config corpus for `Config.redacted` and missing configuration; direct `Config.string` generation and live binding behavior are verified.
- [x] 3.3 Assert the retired Output-aware wrapper and its serializer are absent from generated infrastructure.
- [x] 3.4 Add A3 generation/build tests proving TanStack Router and Solid use released `Website.Vite` SPA handling after beta.64 passes the targeted live removal gate.
- [ ] 3.5 Add A4 tests proving React Router emits the explicit Worker entry, registers a fetch handler, and uses `renderToReadableStream` rather than Node pipeable streams.
- [ ] 3.6 Add A5 tests that edit an imported sibling workspace without changing the lockfile and prove a normal generated build cannot reuse stale output.
- [ ] 3.7 Add A6 package-manager tests proving the exact pin resolves identically under npm, pnpm, and Bun; retain exact pinning permanently rather than attempting to qualify an open-ended range.
- [ ] 3.8 Add a one-to-one test mapping from A1–A12 to the generated line(s), reproduction, and retention/removal rule so no safeguard becomes orphaned.
- [ ] 3.9 Add a deterministic secret sentinel and assert its cleartext is absent from plans, subprocess and cleanup diagnostics, generated documentation, and test failure output.

## 4. Framework, Binding, and Development Verification

- [ ] 4.1 Generate, install, typecheck, and build the Cloudflare path for Next.js, Nuxt, SvelteKit, Astro, TanStack Start, React Router, TanStack Router, and Solid against the exact accepted release.
- [ ] 4.2 Verify Next/OpenNext assets, Worker entry, explicit compatibility flags, Images binding, and normal request behavior.
- [ ] 4.3 Verify Nuxt Nitro assets/server entry, page SSR path, development `getPlatformProxy` alias, and D1-backed request rather than probing only an API route.
- [x] 4.4 Verify SvelteKit's Cloudflare adapter output, bundled `_worker.js` shim, document request, and bindings.
- [ ] 4.5 Verify Astro's server entry, session KV, Images binding/type, document or action route, and distinction between static and SSR output.
- [ ] 4.6 Verify TanStack Start's `Website.Vite` Worker output, document/API route, runtime bindings, and framework auth/environment values.
- [ ] 4.7 Verify React Router's custom entry through a real workerd document request.
- [x] 4.8 Verify TanStack Router and Solid root plus direct deep-route SPA requests.
- [ ] 4.9 Verify Prisma D1 production migration discovery separately from the full nested Wrangler `migrations_pattern` required for local development.
- [ ] 4.10 Assert D1, KV/session, Images, and service bindings exist exactly once in infrastructure, framework config, and inferred environment types.
- [ ] 4.11 Verify explicit external-Worker compatibility flags as framework/platform requirements and do not relabel them as implicit-default loss.
- [x] 4.12 Assert the split-backend Astro Cloudflare path emits both adapter-required `SESSION` and `IMAGES` bindings.
- [ ] 4.13 Capture the accepted generic Next.js, Nuxt, SvelteKit, and Astro resource props, framework config, dependencies, plan identity, development behavior, bindings, and live routes as the comparison baseline for first-class adoption.

## 5. Disposable Live Harness

- [ ] 5.1 Create a credential-gated harness that assigns a unique stage/ownership record before mutation and retains the originating directory plus `.alchemy` state through destruction.
- [ ] 5.2 Track every child process and reserved port, terminate only owned processes, and fail early on an unrelated occupied port rather than killing it.
- [ ] 5.3 Persist the ownership marker, expected resource inventory, source digest, and discovered IDs outside the runner; destroy from the same directory/exact stage in `finally`, and make the independent reconciler delete only marker-matched resources through Cloudflare APIs without local Alchemy state.
- [ ] 5.4 Audit owned Workers, D1 databases, KV namespaces, and related resources after destroy; leave unowned resources untouched and print exact recovery commands for leaks.
- [ ] 5.5 Restrict credentialed tests to trusted protected code and isolated disposable Cloudflare scope; run provider-free checks for forks/untrusted pull requests.
- [ ] 5.6 Add time, resource-count, and concurrency ceilings so a failed matrix cannot create unbounded paid resources.

## 6. Accepted-Version Live Baseline

- [ ] 6.1 Live-deploy and request one web-only, one Hono Workers server-only, one combined web/server, and each currently claimed full-stack `self` archetype.
- [x] 6.2 In the combined case, inspect the plan/build input and deployed artifact to prove the real Worker URL and dependency edge, not merely the absence of localhost strings.
- [x] 6.3a Live-test TanStack Router and Solid pure SPA root and deep routes.
- [ ] 6.3b Live-test React Router document SSR and each server-rendered framework's page route.
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
- [ ] 7.5 Change the generated exact pin only when the full release gate passes; otherwise record the candidate regression and keep the previously accepted exact version.
- [x] 7.6 Remove only the independently qualified A3 pure-SPA fallback and rerun its provider-free and live removal gates without it; A6 exact pinning is not removable.
- [x] 7.7 Update the findings ledger, generated assertions, comments, and user documentation in the same change that removes the A3 shim.
- [x] 7.8 Evaluate beta.66: confirm #796 and #928 are released, reproduce the A10 local D1 migration regression, record post-tag fix #1009, and retain beta.64 plus the A1/A2/A7 safeguards.
- [x] 7.9 Accept beta.67 after generated Next/Nuxt/SvelteKit/Astro builds and infra typechecks, a real local nested Prisma D1 migration, direct Config binding verification, combined Output live deployment, HTTP checks, and owned-stage cleanup.
- [x] 7.10 Remove the independently qualified A1 Output wrapper and A2 caller-side Config resolution while retaining A4, A5, A6, and framework/platform shims.
- [ ] 7.11 When a release contains first-class framework resources, qualify the changed Worker source engine against existing Worker, Website.Vite, and generic StaticSite paths before adopting any new wrapper.
- [ ] 7.12 Adopt first-class resources per framework rather than per release; leave each failed framework on its accepted generic path with no generated runtime version branch.

## 8. Documentation and Final Review

- [ ] 8.1 Document the exact Alchemy pin, prerelease status, first-login/deploy/destroy commands, stage ownership, cleanup expectations, and current support scoreboard.
- [ ] 8.2 Explain which non-obvious generated lines are confirmed workarounds, integration shims, correctness policies, open limitations, or disproved claims.
- [ ] 8.3 Keep README, post-install output, plugin skill, code comments, and `docs/alchemy-v2-beta-findings.md` consistent with the same support claims and removal gates.
- [ ] 8.4 Run formatting/lint, generator typecheck, relevant unit tests, generated-project checks, canonical reproductions, and strict OpenSpec validation.
- [ ] 8.5 Reader-test the upgrade checklist and recovery instructions with a reviewer that has only the generated project, ledger, and official prerequisites.
- [x] 8.6 Audit the final diff for out-of-scope provider-unification remnants, unrelated files, stale generated snapshots, local state, secret values, and accidental workaround removal.
- [ ] 8.7 Publish an honest release report listing generated, offline-verified, live-verified, experimental, blocked, fixed-but-unreleased, and cleaned-up status separately.

## 9. First-Class Framework Release Intake

- [x] 9.1 Confirm PRs #886 and #923 are merged and beta.69 plus referenced `@distilled.cloud/*@0.17.0` source packages are published; do not treat publication as adoption.
- [x] 9.2 Record beta.69's tag commit, source-package versions, documented props, inspected source behavior, peer ranges, and known limitations separately in the findings ledger.
- [ ] 9.3 Generate candidate fixtures against the released packages without changing Better-T-Stack defaults, and direct-typecheck the candidate resource calls with native Outputs, Config, secrets, D1, KV, Images, and framework-public variables.
- [ ] 9.4 Install the candidate dependency graph with npm, pnpm, and Bun in non-hoisted/strict workspace conditions and fail the candidate on missing dynamic imports or unresolved peer incompatibilities.
- [ ] 9.5 Run existing Hono Worker, Website.Vite, generic StaticSite, D1, Config, Output, `_headers`, `_redirects`, and cleanup regressions against the changed source engine before evaluating framework-specific deletion.
- [ ] 9.6 Keep the accepted exact Alchemy pin and generic framework paths when the released engine regresses any supported Cloudflare cell, even if a targeted first-class example passes upstream.
- [x] 9.7 Publish minimal current reproductions for the Effect beta.104 startup crash and Nuxt injected-plugin parse failure; delete fixed beta.61 repros from the current-failures repository.
- [x] 9.8 Record direct candidate results honestly: stable Kit 2 SvelteKit SSR returns HTTP 200 despite its peer warning, and Astro loads native project configuration; neither result alone completes its production adoption gate.

## 10. Shared Framework-Resource Migration Gates

- [ ] 10.1 Add one generated baseline/candidate pair for each of Next.js, Nuxt, SvelteKit, and Astro showing the exact `StaticSite` fields, framework config, adapter, dependencies, scripts, bindings, and shims proposed for removal.
- [ ] 10.2 Assert that an adopted resource uses logical ID `web`, `rootDir: "../../apps/web"`, native Inputs, and the same application `env`, while omitting only provider-owned generic build/output/entry/bundle/dev fields.
- [ ] 10.3 Compare provider-free plans and block adoption on unexpected Worker replacement or deletion/recreation of D1, KV/session, Images, or another stateful resource; document an explicit migration if identity cannot remain stable.
- [ ] 10.4 Prove combined deployments retain the server-to-web Output dependency and exact deployed URL, and prove direct Config/redacted values remain resolved and secret-safe through the source-provider build.
- [ ] 10.5 For each source provider, prove an unchanged second deploy skips the framework build while edits to every imported sibling workspace and relevant root lockfile, manifest, framework config, and generated config trigger a normal rebuild.
- [ ] 10.6 Verify `alchemy dev` plus the normal framework HMR command, including literal values, secrets, D1/resource bindings, no recursive script invocation, tracked child-process shutdown, and deterministic port cleanup.
- [ ] 10.7 Verify SSR/static routing, `_headers`, `_redirects`, 404 behavior, and representative HTML, JavaScript, CSS, JSON, image, and font MIME responses through provider-owned asset collection.
- [ ] 10.8 Run a unique owned-stage deploy, unchanged redeploy, binding-backed request corpus, destroy, and leak audit for each adopted framework before changing the default template.

## 11. Website.Nextjs Adoption

- [ ] 11.1 Generate and typecheck `Website.Nextjs` with the current Better-T-Stack Next.js version, OpenNext config, public server Output, runtime secrets, D1/remote database contract, auth values, and `IMAGES`.
- [ ] 11.2 Prove SSR, a route handler, a static asset, public build-value inlining, and a real Images-backed route or transformation in preview and live deployment.
- [ ] 11.3 Determine from released source and live workerd behavior whether `global_fetch_strictly_public`, explicit compatibility date/flags, `open-next.config.ts`, `@opennextjs/cloudflare`, and `initOpenNextCloudflareForDev` remain required; remove each independently.
- [ ] 11.4 Remove `build:cloudflare`, deployment-only Wrangler layout, manual `.open-next` paths, `bundle: false`, generic `memo: false`, and hard-coded dev URL only after the replacement behavior passes shared gates.
- [ ] 11.5 Keep `WORKER_SELF_REFERENCE` and on-demand ISR classified as unsupported until a focused revalidation write/read test passes; do not use ordinary SSR or prerendered ISR reads as evidence.
- [ ] 11.6 Verify the generated Next.js Worker against both account-size-eligible live infrastructure and provider-free bundle assertions; record a Cloudflare plan limit as an environment limitation rather than a framework correctness result.

## 12. Website.Nuxt Adoption

- [ ] 12.1 Generate and typecheck `Website.Nuxt` with the current Nuxt version and native `nuxt.config.ts`, preserving Nuxt UI, runtime config, route rules, public server Outputs, auth values, and database bindings.
- [ ] 12.2 Verify a real page SSR request, API route, static asset, public value, private binding, and production D1-backed operation; an API-only probe does not pass.
- [ ] 12.3 Remove the generated `nitro.preset` only when the released resource owns the Cloudflare preset and rejects or supersedes the project value without losing other Nuxt configuration.
- [ ] 12.4 Remove `nitro-cloudflare-dev`, the `cloudflare:workers` alias file, dev Wrangler config, `dev:bare`, hard-coded port, and explicit `nodejs_compat` independently only after `alchemy dev`, normal HMR, local nested D1 migration, page SSR, and D1 operation pass without each item.
- [ ] 12.5 Remove Nuxt's generic `command`, `.output` assets/server paths, `bundle: false`, and `memo: false` only after shared provider-owned build, assets, plan, and workspace-memo gates pass.

## 13. Website.SvelteKit Adoption

- [ ] 13.1 Compare the released source provider's SvelteKit/Vite peers with Better-T-Stack's selected stable versions; block adoption rather than silently moving to a prerelease or new major.
- [ ] 13.2 If a framework-major upgrade is needed, leave this Alchemy task blocked and open a separate product change covering all SvelteKit deployment providers, addons, generated config, migrations, and user-facing breaking changes.
- [ ] 13.3 For a version-compatible provider, verify preprocessing, aliases, SSR, prerendering, assets, auth, `platform.env`, D1, literal values, and real resource bindings in deployed and local/HMR modes.
- [ ] 13.4 Remove `@sveltejs/adapter-cloudflare`, the adapter block, `_worker.js` path/bundling shim, `.assetsignore`, Wrangler dependency/config, hard-coded dev URL, and `memo: false` independently after their exact replacement gates pass.
- [ ] 13.5 Verify SvelteKit document behavior and a binding-backed server load/action rather than treating a static asset or literal-only platform stub as parity.

## 14. Website.Astro Adoption

- [ ] 14.1 Reconcile released `Website.Astro` documentation with released source and prove the native `astro.config.*` loads and merges before adopting the resource.
- [ ] 14.2 Preserve and verify Tailwind's Vite plugin, environment schema, integrations, route configuration, SSR, prerendering, and user Astro configuration while removing only the Cloudflare adapter ownership that moves upstream.
- [ ] 14.3 Preserve explicit `SESSION` and `IMAGES` identities during initial evaluation; separately verify a session-backed route, inferred types, and a real Cloudflare image route/transformation before allowing either binding to change or disappear.
- [ ] 14.4 Block adoption while the released provider would replace Cloudflare Images behavior with passthrough-only serving, unless Better-T-Stack explicitly approves and documents that product regression in a separate change.
- [ ] 14.5 Verify SSR, prerendered content, static assets, 404 behavior, `_headers`, `_redirects`, and representative MIME responses in local workerd and a live deployment.
- [ ] 14.6 Remove `@astrojs/cloudflare`, its adapter import/call, manual `dist` entries, `bundle: false`, hard-coded dev URL, explicit compatibility flag, and `memo: false` independently only after their replacement gates pass.

## 15. Cloudflare-Only Rollout and Documentation

- [ ] 15.1 Land each passing framework migration as an independently reviewable change with its generated assertions, package-manager checks, plan comparison, live evidence, cleanup result, ledger update, and rollback instructions.
- [ ] 15.2 Keep blocked frameworks on the generic resource in the same accepted release and make generated documentation explain the mixed resource matrix without presenting blocked cells as failures of working generic deployment.
- [ ] 15.3 Update README, post-install output, plugin skills, source comments, support scoreboard, and findings ledger with the exact provider-owned responsibilities and remaining framework limitations.
- [ ] 15.4 Diff all non-Cloudflare deployment templates, deployment enums, Docker/Compose output, and database-provider setup to prove this work adds no Vercel, Railway, Prisma Compute, Alchemy Prisma Postgres, Waku, or provider-abstraction changes.
- [ ] 15.5 Retain existing Prisma ORM plus Cloudflare D1 nested-migration and request tests only as database-binding regressions for adopted framework resources.
- [ ] 15.6 Run strict OpenSpec validation, formatting/lint, generator typecheck, the full CLI suite, fresh generated-project builds, every affected live route, destroy, and resource-leak audit before marking a framework task complete.
