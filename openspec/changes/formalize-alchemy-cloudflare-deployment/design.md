## Context

Better-T-Stack generates Cloudflare infrastructure through `packages/template-generator/templates/packages/infra/alchemy.run.ts.hbs`. The current integration pins `alchemy@2.0.0-beta.67` and emits paths for Cloudflare web, Hono Workers server, combined web/server, full-stack `self`, and D1 topologies. Generated paths are not automatically live-verified support claims; the accepted-version scoreboard defined below owns that distinction.

Alchemy v2 is still a prerelease API. Better-T-Stack currently needs three active targeted safeguards because the accepted release does not correctly cover every generated framework and monorepo behavior. A3 was independently retired after its beta.64 removal gate passed; A1 and A2 were retired after beta.67 passed direct generated-project typechecks plus Config and Output live gates. Beta.67 also fixes beta.66's A10 local D1 runtime regression. Several reviews produced plausible but disproved claims. The design therefore treats source inspection, a provider-free plan, and a live deployment as different evidence levels.

The source of truth for observed behavior is [docs/alchemy-v2-beta-findings.md](../../../docs/alchemy-v2-beta-findings.md). It records:

- the accepted published version and tag commit;
- the inspected upstream-main commit;
- runnable reproduction commits;
- confirmed defects and publication hazards;
- limitations that remain unverified;
- disproved claims that must not be reopened without new evidence;
- a removal condition for every workaround.

Relevant upstream references include:

- [Alchemy v2 documentation](https://alchemy.run)
- [Alchemy Cloudflare frontend support matrix](https://alchemy.run/cloudflare/frontend/frontends/)
- [Alchemy repository](https://github.com/alchemy-run/alchemy)
- [Alchemy PR #779](https://github.com/alchemy-run/alchemy/pull/779)
- [Alchemy PR #795](https://github.com/alchemy-run/alchemy/pull/795)
- [Alchemy PR #796](https://github.com/alchemy-run/alchemy/pull/796)
- [Alchemy PR #928](https://github.com/alchemy-run/alchemy/pull/928)
- [Alchemy PR #1009](https://github.com/alchemy-run/alchemy/pull/1009)
- [Alchemy framework resources PR #886](https://github.com/alchemy-run/alchemy/pull/886)
- [cloudflare-tools PR #62](https://github.com/alchemy-run/cloudflare-tools/pull/62)
- [Better-T-Stack beta reproductions](https://github.com/AmanVarshney01/alchemy-v2-beta-repros)

### Evidence levels

1. **Released source** establishes what exact code a generated project installs.
2. **Provider-free reproduction** can prove serialization, dependency edges, handler selection, memo inputs, generated files, and type behavior without credentials.
3. **Live reproduction** is required for Cloudflare upload, routing, bindings, D1 behavior, authentication scopes, deployment output, and cleanup.
4. **Upstream main** predicts a possible future fix but is not usable evidence for removing generated compatibility code.

## Goals / Non-Goals

**Goals:**

- Keep the generated Cloudflare path correct against one exact, verified Alchemy release.
- Define the supported topology and framework matrix precisely enough to test it.
- Preserve real deploy-time Outputs and dependency edges in frontend builds.
- Keep secrets redacted and Effect Config values resolved before subprocess serialization.
- Distinguish Alchemy defects from framework/platform shims and Better-T-Stack policy.
- Give every safeguard an executable retention rule or release-based removal gate.
- Make live verification disposable, ownership-safe, and leak-audited.
- Prevent static review claims from overriding repeated live evidence.

**Non-Goals:**

- Adding a new deployment provider.
- Generalizing all deployment providers behind a new abstraction.
- Replacing Alchemy with raw Wrangler configuration.
- Removing a workaround during this planning change.
- Treating all framework adapter constraints as Alchemy core defects.
- Claiming full OpenNext ISR or `alchemy logs` authentication until their focused live gates pass.

## Current implementation seams

Future implementation and verification work is concentrated in:

- `packages/template-generator/templates/packages/infra/alchemy.run.ts.hbs` for resources, bindings, Inputs, framework entries, and memo behavior;
- `packages/template-generator/src/utils/add-deps.ts` and `src/processors/infra-deps.ts` for the exact Alchemy dependency;
- `packages/template-generator/src/processors/alchemy-plugins.ts` for Nuxt development, Wrangler compatibility flags, D1 migration patterns, and Images binding configuration;
- `packages/template-generator/src/post-process/package-configs.ts` for generated Alchemy scripts;
- `packages/template-generator/src/processors/readme-generator.ts` and post-install output for user guidance;
- `apps/cli/test/deployment.test.ts`, `cloudflare-db-clients.test.ts`, and generated-project smoke tests;
- `docs/alchemy-v2-beta-findings.md` and the external reproduction repository.

Generated template snapshots in `packages/template-generator/src/templates.generated.ts` are outputs, not an independent source of truth.

## Decisions

### 1. Pin one exact Alchemy release

Generated Cloudflare projects SHALL use exactly `alchemy@2.0.0-beta.67` until a replacement release passes this design's upgrade gate. No caret, tilde, tag, git SHA, or version range is accepted in generated packages.

The exact version SHALL live in one generator dependency source and be asserted in generated npm, pnpm, and Bun projects. An upstream merge, npm deprecation, or `next` tag movement does not change the accepted version automatically.

Beta.67 was accepted on 2026-08-01 after direct native `StaticSite` Config/Output usage typechecked across fresh Next, Nuxt, SvelteKit, and Astro projects; a combined SvelteKit + Hono deployment embedded the exact deployed server URL and served both Workers; a web-only SvelteKit deployment preserved a direct `Config.string` value; and a generated Prisma D1 project applied a real nested migration in local `alchemy dev`. Better-T-Stack SHALL continue to reject git dependencies, conditional Alchemy versions, and removal of production migration wiring as substitutes for a released gate.

**Reason:** the published `2.0.0-pipeline-v2-test` prerelease was observed satisfying a beta caret range while lacking expected Cloudflare exports. Exact pinning makes generation reproducible and prevents an unrelated test publication from entering user projects.

### 2. Keep the supported Cloudflare matrix explicit

Subject to existing stack compatibility, the Alchemy path covers:

| Topology              | Generated Cloudflare resources                                | Required verification                                        |
| --------------------- | ------------------------------------------------------------- | ------------------------------------------------------------ |
| web only              | one framework-specific web resource                           | root request plus framework-specific route                   |
| server only           | one Hono Worker                                               | API request and environment/binding check                    |
| combined web + server | Hono Worker followed by the web resource                      | real server URL in the frontend build and requests to both   |
| full-stack `self`     | one framework-owned web Worker and optional database/bindings | document/API request and binding-backed behavior             |
| Convex web            | web resource; Convex remains external                         | configured public Convex values and document request         |
| D1 consumer           | D1 database plus binding on the actual consuming Worker       | migration plus a real database-backed request                |
| mixed single plane    | only the plane selecting Cloudflare                           | Cloudflare output and the configured external production URL |

Cloudflare separate-server deployment requires Hono on the Workers runtime. Full-stack `self` remains limited to the generated frameworks that provide a Cloudflare-compatible server output. Invalid combinations must fail through the existing configuration validator before templates are emitted.

Framework resource paths remain intentional:

| Framework              | Current generated path                                                     |
| ---------------------- | -------------------------------------------------------------------------- |
| TanStack Router, Solid | `Website.Vite` with explicit single-page-application asset handling        |
| React Router           | `Website.Vite` plus an explicit registered Worker entry and web-stream SSR |
| TanStack Start         | `Website.Vite` with explicit Cloudflare compatibility and bindings         |
| Next.js                | `StaticSite`/OpenNext assets plus Worker entry and explicit flags/bindings |
| Nuxt                   | `StaticSite` with Nitro public assets/server entry and a local dev proxy   |
| SvelteKit              | `StaticSite` with the Cloudflare adapter Worker shim bundled               |
| Astro                  | `StaticSite` with server entry, session KV, and Images where required      |

Alchemy's current framework matrix marks TanStack Start and React Router as supported, Astro only through `StaticSite` static output, and Nuxt as not yet supported. Better-T-Stack's custom Next.js, Nuxt, SvelteKit, and Astro server-entry paths do not inherit an upstream support claim merely because `StaticSite` accepts a build directory and custom `main`. Until the accepted-version scoreboard records each exact page/document live gate, those generated `self` cells SHALL remain experimental.

A framework path may change only after its generated build, typecheck, direct request, and affected binding checks pass.

### 3. Maintain an explicit compatibility-layer classification

Every non-obvious Alchemy-related line SHALL be assigned one of these classes:

1. **Confirmed Alchemy defect workaround** — released source plus a focused reproduction demonstrates incorrect upstream behavior.
2. **Framework/platform integration shim** — required by a framework adapter, Cloudflare runtime, Wrangler development behavior, or generated application contract; not automatically an Alchemy defect.
3. **Better-T-Stack correctness policy** — a conservative choice such as exact pinning or disabling an unsafe cache.
4. **Open limitation** — observed behavior that lacks enough evidence to file upstream or claim support.
5. **Disproved claim** — investigated and contradicted by released source or live evidence.

Reviews and pull-request comments may propose a classification, but the findings ledger changes only with evidence at the appropriate level.

### 4. Retain active safeguards and record retired safeguards independently

| ID  | Current safeguard                                       | Classification                        | Removal gate                                                                                                |
| --- | ------------------------------------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| A1  | retired: custom Output-aware `StaticSite` wrapper       | removed defect workaround             | satisfied on beta.67 with native Inputs, generated typechecks, built artifact, and live combined deployment |
| A2  | retired: caller-side Effect Config resolution           | removed defect workaround             | satisfied on beta.67 with direct Config generation, live binding metadata, and HTTP request                 |
| A3  | retired: use `StaticSite` for pure Vite SPAs            | removed defect workaround             | satisfied on beta.64 with generated builds and live root/deep-route requests                                |
| A4  | explicit React Router Worker entry and web-stream SSR   | defect workaround plus framework shim | released default uploads a registered handler and serves a real workerd document                            |
| A5  | `memo: false` for workspace-dependent StaticSite builds | correctness policy for upstream scope | published workspace-aware upstream default plus imported-sibling and root-input rebuild gates               |
| A6  | exact Alchemy version pin                               | permanent publication-safety policy   | never removed; upgrades replace one verified exact version with another exact version                       |

The removable safeguards A1–A5 SHALL be evaluated independently. A3 was removed on 2026-07-26 after fresh TanStack Router and Solid projects passed install, build, infrastructure typecheck, live root/deep-route requests, and cleanup audits against beta.64. A1 and A2 were removed on 2026-08-01 after beta.67 passed their independent generated and live gates. Those results do not justify removing A4 or A5. A6 is not a temporary shim: Better-T-Stack SHALL continue exact-pinning Alchemy even after a stable release and shall replace one verified exact version only with another verified exact version.

### 5. Preserve deployment-time values and secret boundaries

In a combined Cloudflare stack, the server Worker resource SHALL be yielded before the frontend resource. The frontend build variable SHALL receive the resolved deployed Worker URL and retain an Alchemy dependency edge on that Worker.

`.as<string>()` is only a TypeScript cast and SHALL NOT be treated as Output resolution. A raw occurrence of `localhost:3000` in a bundle is also not proof that the active deployed value is wrong; verification must inspect the build input, dependency plan, and live artifact behavior.

Effect `Config.string` and `Config.redacted` descriptors and Alchemy Outputs SHALL be passed directly as native `StaticSite` Inputs. Secrets SHALL remain redacted in plans, command output, generated documentation, and live-test diagnostics.

### 6. Treat framework bindings and development shims as explicit contracts

The generated infrastructure and framework configuration SHALL agree on every binding exactly once, including D1, KV/session, Images, and Worker service bindings. `Cloudflare.InferEnv` output and generated application environment types SHALL expose the same names.

The following remain integration shims unless their own targeted gate passes:

| Integration shim                                                                       | Retention/removal gate                                                                                                          |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Nuxt development-only `getPlatformProxy` alias for `cloudflare:workers`                | remove only when a Nuxt page and D1-backed request work in development without the alias                                        |
| explicit `nodejs_compat` and `global_fetch_strictly_public` flags for external entries | remove a flag only when the exact framework entry no longer requires it and a direct workerd request passes                     |
| Prisma's full nested Wrangler `migrations_pattern`                                     | remove only when local Wrangler discovers and applies nested Prisma migrations without it                                       |
| framework adapter/entrypoint and workerd-compatible rendering                          | remove only when the released framework/Alchemy default builds, uploads, and serves the same document/API behavior              |
| Astro/Next Images bindings and Astro session KV                                        | remove a binding only when the framework adapter no longer declares/uses it and binding types plus the affected live route pass |

Development and deployment are separate evidence paths. A working literal local `.env` URL does not prove that upstream development serialization resolves Outputs, and a passing API route does not prove a framework page SSR route.

### 7. Keep the findings ledger versioned and reviewable

Each ledger entry SHALL include an ID, classification, affected exact release, released-source or reproduction evidence, upstream link/status, current generator handling, removal condition, and last verification date.

The ledger SHALL preserve these disproved claims unless new released evidence overturns them:

- Alchemy v2 reads D1 migration directories non-recursively.
- A pure `StaticSite` requires an explicit Worker entry.
- implicit `nodejs_compat` is lost for the linked external-Worker reproduction.
- any production-bundle occurrence of `localhost:3000` proves the active API URL is local.
- `.as<string>()` resolves an Output.

Canonical reproductions should be provider-free when provider access is unnecessary and live only when the claim depends on Cloudflare behavior. One-off review harnesses must be moved into the canonical reproduction repository or checked into this repository before they become an upgrade gate.

### 8. Use layered verification rather than one aggregate score

Provider-free gates SHALL cover:

- exact dependency resolution under npm, pnpm, and Bun;
- generator assertions for every supported topology and required artifact;
- generated project typechecks against the exact release;
- StaticSite Output and Config serialization plans;
- pure-SPA output collection;
- React Router handler registration and entry selection;
- sibling-workspace memo invalidation behavior;
- D1 migration discovery and binding types;
- framework build outputs for Next, Nuxt, SvelteKit, Astro, TanStack Start, React Router, TanStack Router, and Solid.

Credentialed live gates SHALL cover, at minimum:

- web-only, server-only, combined, and `self` topologies;
- a real deployed server URL reaching a dependent frontend build;
- root and deep-link requests for a pure SPA;
- a React Router document SSR request;
- a Nuxt page request and D1-backed operation in development;
- a production D1 migration and database-backed request;
- framework-required KV/Images bindings where generated;
- a sibling-workspace-only change causing a normal rebuild when memo behavior is under review;
- OpenNext on-demand revalidation before claiming `WORKER_SELF_REFERENCE` ISR;
- fresh-login `alchemy logs` and `alchemy tail` behavior before classifying the authorization observation.

A passing typecheck, build, deploy exit code, API-only probe, or raw bundle string search is never a substitute for the named affected behavior.

### 9. Make live verification disposable and ownership-safe

Every live run SHALL create a unique review stage and ownership record before mutation. The normal cleanup path SHALL retain the originating generated directory and `.alchemy` state until destruction completes, because `alchemy destroy` must run from the same state context and exact stage.

The harness SHALL:

- register a stable stage ownership marker, expected resource naming/inventory, source digest, and known resource IDs in an external cleanup record before deployment, updating IDs after creation;
- start all child processes through a tracked supervisor;
- reserve and release ports deterministically;
- destroy in `finally` as the fast path;
- terminate every child process it started;
- audit Workers, D1 databases, KV namespaces, and other generated resources after destroy;
- leave stages/resources untouched when ownership cannot be proven;
- use an independent expiry-based reconciler for runner loss or SIGKILL; this fallback SHALL inventory and delete only marker-matched resources through narrowly scoped Cloudflare APIs and SHALL NOT depend on the lost local `.alchemy` state;
- fail the verification when owned cleanup cannot be confirmed and print a precise recovery command.

Credentialed CI SHALL run only from trusted code with protected secrets and isolated disposable provider scope. Pull requests from forks or untrusted changes SHALL run provider-free gates only.

### 10. Upgrade and remove shims one at a time

An Alchemy upgrade follows this sequence:

1. Identify a published exact candidate and its released tag commit.
2. Update a temporary candidate fixture without changing generated defaults.
3. Re-run every applicable canonical reproduction against the released package.
4. Generate, install, typecheck, and build the affected topology matrix.
5. Run the credentialed live scenarios affected by the release.
6. Change the exact generated pin only if the complete release gate passes.
7. Remove only independently qualified A1–A5 safeguards or named integration shims; retain A6 exact pinning.
8. Re-run that shim's provider-free and live removal gate without it.
9. Update the findings ledger in the same change.

If a candidate fixes one defect but regresses another supported topology, Better-T-Stack keeps the current pin. Rollback means restoring the previous exact dependency and compatibility code; it never destroys user infrastructure.

## Risks / Trade-offs

- **Exact prerelease pinning slows upgrades** → Prefer reproducibility; qualify published candidates deliberately.
- **`memo: false` makes builds slower** → Accept the cost until a published workspace-aware default passes the defined imported-workspace and root-input corpus.
- **Framework adapters evolve independently** → Verify each framework path and binding rather than treating one Cloudflare deploy as universal proof.
- **Live verification consumes Cloudflare resources** → Use owned stages, trusted credentials, cleanup reconciliation, and explicit leak audits.
- **Merged fixes can remain unreleased** → Track both main and registry state, but generate only released exact packages.
- **Static review can produce persuasive false positives** → Keep disproved claims in the ledger and require the evidence level appropriate to the assertion.

## Migration Plan

Implementation work should proceed in this order:

1. Canonicalize the baseline ledger and missing one-off reproductions without changing templates.
2. Add deterministic generated-artifact, dependency-pin, and typecheck gates around current behavior.
3. Harden the disposable live harness and cleanup reconciliation.
4. Run the full accepted-version baseline and publish an honest support scoreboard.
5. Evaluate a new Alchemy release only when it is published.
6. Upgrade the exact pin if all applicable gates pass.
7. Remove compatibility shims independently through their named gates.

## Open Questions

1. Will a released default React Router path select a registered workerd handler without a custom entry?
2. What published upstream behavior and cross-workspace/root-input evidence is sufficient to classify Alchemy's default memo scope as workspace-aware and remove A5?
3. Can Alchemy express OpenNext's self service binding without a resource dependency cycle, or must ISR remain partially unsupported?
4. Does a freshly authenticated profile make both `alchemy logs` and `alchemy tail` work with the required scopes?
   Resolved on 2026-07-26: beta.64 `Website.Vite` reliably served both TanStack Router and Solid root
   and direct deep-link requests, so the A3 `StaticSite` fallback was removed.

Resolved on 2026-08-01: beta.67 native `StaticSite` Inputs preserved generated Config values and
the combined server Output dependency, so the A1 wrapper and A2 caller-side resolution were removed.
