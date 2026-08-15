## Context

Better-T-Stack generates all Alchemy infrastructure through one `packages/infra/alchemy.run.ts` artifact assembled from a typed deployment plan. The current integration pins `alchemy@2.0.0-beta.72` with Effect rc.108 and emits Cloudflare, Prisma, managed-database, mixed-provider, full-stack `self`, and separate-server topologies. Generated paths are not automatically live-verified support claims; the accepted-version scoreboard defined below owns that distinction.

Alchemy v2 is still a prerelease API. Better-T-Stack currently needs four active targeted safeguards plus a permanent exact-version policy because the accepted release does not correctly cover every generated framework and monorepo behavior. A3 was independently retired after its beta.64 removal gate passed; A1 and A2 were retired after beta.67 passed direct generated-project typechecks plus Config and Output live gates. Beta.67 also fixes beta.66's A10 local D1 runtime regression. Several reviews produced plausible but disproved claims. The design therefore treats source inspection, a provider-free plan, and a live deployment as different evidence levels.

As verified on 2026-08-12, beta.72 contains the first-class framework resources and the published `@alchemy.run/cloudflare-frameworks@2.0.0-beta.72` source package. Nuxt's provider owns the compiled development bridge and request-context bindings, while Astro owns its build and injects its adapter in memory. The generated Nuxt and Astro paths therefore use `Website.Nuxt` and `Website.Astro`; Next.js remains generic because the released provider requires OpenNext 1.20.1 while 1.20.2 is current, and SvelteKit remains generic because its provider requires Kit 3 while stable Kit is 2.70.x. Beta.72 also contains the `Schema.TaggedError` migration and the framework-package publication fix, so the graph starts with Effect rc.108 and resolves under Bun, npm, and pnpm without an override or hoisting requirement.

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
- [Alchemy Next.js resource PR #923](https://github.com/alchemy-run/alchemy/pull/923)
- [Alchemy cloudflare-tools repository](https://github.com/alchemy-run/cloudflare-tools)
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
- Replace generic framework deployment plumbing with first-class Cloudflare framework resources only where the released resource preserves Better-T-Stack's complete behavior.
- Let Next.js, Nuxt, SvelteKit, and Astro qualify independently, including independent dependency, configuration, local-development, binding, memo, and live-route gates.
- Make live verification disposable, ownership-safe, and leak-audited.
- Prevent static review claims from overriding repeated live evidence.

**Non-Goals:**

- Adding a new deployment provider.
- Adding or redesigning Vercel, Railway, or Docker support.
- Changing Docker or Compose behavior.
- Adding Waku as a Better-T-Stack frontend.
- Generalizing all deployment providers behind a new abstraction.
- Replacing Alchemy with raw Wrangler configuration.
- Adding dependency overrides, hoisted installs, or older transitive pins to bypass a published Alchemy compatibility failure.
- Adopting a branch, git dependency, or unpublished framework source package.
- Requiring a framework major upgrade solely to consume an Alchemy resource; any framework-major migration needs its own product decision and compatibility work.
- Treating all framework adapter constraints as Alchemy core defects.
- Claiming full OpenNext ISR or `alchemy logs` authentication until their focused live gates pass.

## Current implementation seams

Future implementation and verification work is concentrated in:

- `packages/template-generator/templates/packages/infra/alchemy.run.ts.hbs` for resources, bindings, Inputs, framework entries, and memo behavior;
- `packages/template-generator/src/utils/add-deps.ts` and `src/processors/infra-deps.ts` for the exact Alchemy dependency;
- `packages/template-generator/src/processors/deploy-deps.ts` for framework adapters, Workers types, Wrangler, and the released `@alchemy.run/cloudflare-frameworks` source-provider dependency;
- `packages/template-generator/src/processors/alchemy-plugins.ts` for Nuxt development, Wrangler compatibility flags, D1 migration patterns, and Images binding configuration;
- `packages/template-generator/src/post-process/package-configs.ts` for generated Alchemy scripts;
- framework configuration templates for Next.js, Nuxt, SvelteKit, and Astro, whose adapter and development responsibilities may move into a released first-class resource;
- `packages/template-generator/src/processors/readme-generator.ts` and post-install output for user guidance;
- `apps/cli/test/deployment.test.ts`, `cloudflare-db-clients.test.ts`, and generated-project smoke tests;
- `docs/alchemy-v2-beta-findings.md` and the external reproduction repository.

Generated template snapshots in `packages/template-generator/src/templates.generated.ts` are outputs, not an independent source of truth.

## Decisions

### 1. Pin one exact Alchemy release

Generated Alchemy projects SHALL use exactly `alchemy@2.0.0-beta.72` until a replacement release passes this design's upgrade gate. No caret, tilde, tag, git SHA, or version range is accepted in generated packages. Generated projects SHALL also pin `effect`, `@effect/platform-node`, and `@effect/platform-bun` to rc.108 exactly.

The exact version SHALL live in one generator dependency source and be asserted in generated npm, pnpm, and Bun projects. An upstream merge, npm deprecation, or `next` tag movement does not change the accepted version automatically.

Beta.67 was accepted on 2026-08-01 after direct native `StaticSite` Config/Output usage typechecked across fresh projects and the affected live gates passed. Beta.72 retains those fixes, publishes the consolidated framework package, and supports the selected Effect rc.108 line. Better-T-Stack SHALL continue to reject git dependencies, conditional Alchemy versions, dependency overrides, hoisted-linker assumptions, and removal of production migration wiring as substitutes for a compatible release.

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

| Framework       | Generated beta.72 path                                                                                | Current decision                                     | Verification status                     |
| --------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | --------------------------------------- |
| TanStack Router | `Website.Vite` with explicit single-page-application asset handling                                   | keep                                                 | generated and previously live-qualified |
| Solid 2         | `Website.Vite` SSR with worker-first asset routing                                                    | keep                                                 | generated/build-verified                |
| React Router    | `Website.Vite` plus an explicit registered Worker entry and web-stream SSR                            | keep                                                 | generated/build-verified                |
| TanStack Start  | `Website.Vite` with explicit Cloudflare compatibility and bindings                                    | keep                                                 | generated/build-verified                |
| Next.js         | `StaticSite`/OpenNext assets plus Worker entry and explicit flags/bindings                            | wait for latest OpenNext-compatible `Website.Nextjs` | generated/build-verified                |
| Nuxt            | `Website.Nuxt` with provider-owned build, dev, preset, binding proxy, and asset collection            | adopt released framework package                     | generated/typechecked                   |
| SvelteKit       | `StaticSite` with the Cloudflare adapter Worker shim bundled                                          | wait for stable-Kit-compatible `Website.SvelteKit`   | generated/build-verified                |
| Astro           | `Website.Astro` with provider-owned build, dev, adapter, and assets; explicit session/Images bindings | adopt released framework package                     | generated/typechecked                   |

Generated Nuxt and Astro projects follow the first-class resources' intended lifecycle. Nuxt retains its ordinary build command as an application-level verification path; Astro omits a standalone Cloudflare production build because Alchemy injects the adapter programmatically. Provider-owned builds are still verified separately from ordinary framework builds.

A framework path may change only after its generated build, typecheck, direct request, and affected binding checks pass.

#### 2.1 Evidence boundary for first-class resources

The released wrappers document zero-configuration calls and own framework builds, local development, asset collection, and input hashing. Released-source inspection confirms that `@alchemy.run/cloudflare-frameworks` ships compiled Nuxt and Astro source providers, loads native project configuration, and injects the target integration. Astro can auto-provision a session KV, but that implicit binding is not represented in the wrapper's inferred return type and would use a different logical ID from the existing generated resource. Better-T-Stack therefore passes explicit `SESSION` and `IMAGES` bindings. Remaining product differences are explicit: SvelteKit peers on Kit 3 while Better-T-Stack uses stable Kit 2; Astro selects passthrough image behavior; and Next.js requires OpenNext 1.20.1 while 1.20.2 is current.

It is reasonable to infer that a released first-class resource can eventually delete substantial generated plumbing. It is not reasonable to infer framework parity, package-manager resolution, state continuity, or binding behavior from the shorter call alone. Every claim below therefore remains a candidate requirement until a published exact release passes it.

#### 2.2 Shared first-class resource contract

The current generic pattern teaches Alchemy how to deploy framework output:

```typescript
Effect.gen(function* () {
  const webWorker = yield* Cloudflare.Website.StaticSite("web", {
    cwd: "../../apps/web",
    command: "bun run build",
    memo: false,
    outdir: ".output/public",
    main: "../../apps/web/.output/server/index.mjs",
    bundle: false,
    compatibility: { flags: ["nodejs_compat"] },
    env: { PUBLIC_SERVER_URL: serverWorker.url.as<string>() },
    dev: { command: "bun run dev:bare", url: "http://localhost:3001" },
  });

  return webWorker;
});
```

The target shape delegates framework build knowledge while preserving application inputs:

```typescript
Effect.gen(function* () {
  const webWorker = yield* Cloudflare.Website.Nuxt("web", {
    rootDir: "../../apps/web",
    env: { PUBLIC_SERVER_URL: serverWorker.url.as<string>() },
  });

  return webWorker;
});
```

For each adopted resource, Better-T-Stack SHALL:

- keep the logical Worker ID `web`, the same stack/stage semantics, and all application-facing Outputs;
- preserve every generated `env` value and its dependency edge, including server URLs, Effect Config values, D1, secrets, auth, payments, and framework-public variables;
- remove `command`, output directory, Worker entry, bundling mode, compatibility default, development command/URL, and `memo: false` only when the released resource demonstrably owns that concern;
- install every dynamically loaded source-provider package in a location that resolves under strict npm, pnpm, and Bun installs, with a compatible and reproducible peer graph;
- avoid version-detection branches or parallel generic/first-class paths inside one generated project; the exact accepted Alchemy version determines one generated path per framework;
- prove through a provider-free plan that adopting the new wrapper does not unexpectedly replace or delete the existing Worker, D1 database, KV namespace, Images binding, or another stateful resource;
- keep a framework on the accepted generic path when any one of its gates is blocked, even if sibling resources ship in the same Alchemy release.

First-class source hashing may replace A5's `memo: false` only for the adopted framework after an unchanged redeploy skips its build and edits in imported sibling workspaces, root lockfiles, manifests, framework configuration, and relevant generated configuration each invalidate the memo. Passing Alchemy's Vite workspace test does not prove a distinct framework source provider's hashing.

#### 2.3 Next.js adoption contract

`Website.Nextjs` may replace the OpenNext `StaticSite` block only after a released resource builds the generated Next.js version and preserves normal SSR, static assets, route handlers, public build variables, runtime secrets, Images, and Cloudflare bindings. The initial migration SHALL retain `open-next.config.ts` and `@opennextjs/cloudflare` whenever the released source provider or generated runtime imports them. The generated `build:cloudflare` script, deployment-only Wrangler layout, `.open-next` paths, `bundle: false`, hard-coded dev URL, and flags may be removed independently only when the released resource owns and verifies each behavior.

The gate SHALL include both preview-parity `alchemy dev` and the project's normal HMR workflow. It SHALL verify whether `global_fetch_strictly_public` is still required instead of assuming the resource's `nodejs_compat` default replaces it. It SHALL exercise a real image route or transformation before removing `IMAGES`. On-demand ISR remains unsupported until revalidation writes and `WORKER_SELF_REFERENCE` pass their existing focused live gate; adoption of `Website.Nextjs` alone does not close that limitation.

#### 2.4 Nuxt adoption contract

`Website.Nuxt` replaces the Nitro `StaticSite` block with the released `@alchemy.run/cloudflare-frameworks@2.0.0-beta.72` provider. Released source loads the native `nuxt.config.ts`, owns the `cloudflare_module` target, externalizes `cloudflare:` imports, injects a compiled development plugin, and proxies real bindings without Wrangler. The generated Cloudflare preset, `nitro-cloudflare-dev`, `cloudflare:workers` alias, development Wrangler file, manual output paths, and hard-coded resource dev command are therefore removed. Better-T-Stack reads the provider's native `event.context.cloudflare.env` contract at request boundaries and passes it to auth/database factories; Prisma-specific WASM and `pg-native` configuration remains application-owned.

Generation, strict dependency installation, infrastructure typechecking, and an ordinary Nuxt build pass. The resource's own build/dev and page/API/D1 gates remain independent live-verification tasks; no success is inferred from source inspection alone.

#### 2.5 SvelteKit adoption contract

`Website.SvelteKit` SHALL NOT force Better-T-Stack from its supported SvelteKit major to an upstream prerelease. Adoption waits for a released resource compatible with Better-T-Stack's selected stable SvelteKit version, or for a separately approved framework-major change that passes the complete non-Cloudflare and addon regression matrix.

Once version-compatible, the resource must preserve preprocessing, aliases, route configuration, SSR, prerendering, `platform.env`, D1, and auth behavior. Only then may generation remove `@sveltejs/adapter-cloudflare`, the Cloudflare adapter block, the `_worker.js` bundling comment/path, `.assetsignore`, hard-coded dev URL, and related Wrangler dependency. Both HMR and a real local resource binding must work; literal-only `platform.env` stubs do not satisfy the gate.

#### 2.6 Astro adoption contract

`Website.Astro` replaces the Astro `StaticSite` block with the released `@alchemy.run/cloudflare-frameworks@2.0.0-beta.72` provider. Released source loads and merges native `astro.config.*`, preserves its Vite plugins, injects the Cloudflare adapter in memory, owns development and production builds, and reuses a caller-provided session namespace. The generated Cloudflare adapter, manual `dist` entries, bundling/compatibility fields, generic memo override, hard-coded resource dev command, and standalone production build script are therefore removed. Explicit `SESSION` and `IMAGES` resources remain so `Cloudflare.InferEnv` exposes both bindings and the existing session resource identity is preserved.

This lifecycle intentionally differs from direct `astro build`: server output without a checked-in adapter cannot build standalone, while configuring `@astrojs/cloudflare` conflicts with the provider-owned adapter. Alchemy's own first-class Astro example likewise exposes only Alchemy lifecycle scripts. Generation, dependency installation, and typechecking pass; SSR, session, Images, prerendered assets, `_headers`, `_redirects`, 404, MIME, and live cleanup remain independent live gates.

#### 2.7 Cloudflare framework-resource boundary

The first-class Cloudflare framework-resource migration changes only Cloudflare web resources and the Cloudflare-specific adapter/configuration they own. It does not authorize Vercel, Railway, Docker, or generalized deployment refactors. Prisma deployment and managed databases are separate capabilities in this change and SHALL pass their own topology and ownership requirements rather than being inferred from Cloudflare framework-resource tests.

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
| A11 | retired: older Effect compatibility pin                 | removed release workaround            | beta.72 starts with Effect rc.108; fresh Bun, npm, and pnpm graphs resolve without an override              |
| A12 | retired: Nuxt raw-plugin/generic development path       | removed provider workaround           | beta.72 publishes compiled Nuxt development code inside the consolidated framework package                  |

The removable safeguards A1–A5 SHALL be evaluated independently. A3 was removed on 2026-07-26 after fresh TanStack Router and the then-current Solid SPA projects passed install, build, infrastructure typecheck, live root/deep-route requests, and cleanup audits against beta.64. The Solid SSR path requires its own coverage after every framework-major migration. A1 and A2 were removed on 2026-08-01 after beta.67 passed their independent generated and live gates. Those results do not justify removing A4 or A5. A6 is not a temporary shim: Better-T-Stack SHALL continue exact-pinning Alchemy even after a stable release and shall replace one verified exact version only with another verified exact version.

### 5. Preserve deployment-time values and secret boundaries

In a combined Cloudflare stack, the server Worker resource SHALL be yielded before the frontend resource. The frontend build variable SHALL receive the resolved deployed Worker URL and retain an Alchemy dependency edge on that Worker.

`.as<string>()` is only a TypeScript cast and SHALL NOT be treated as Output resolution. A raw occurrence of `localhost:3000` in a bundle is also not proof that the active deployed value is wrong; verification must inspect the build input, dependency plan, and live artifact behavior.

Effect `Config.string` and `Config.redacted` descriptors and Alchemy Outputs SHALL be passed directly as native Website Inputs, whether the accepted framework path is generic `StaticSite` or a qualified first-class resource. Secrets SHALL remain redacted in plans, command output, generated documentation, and live-test diagnostics.

### 6. Treat framework bindings and development shims as explicit contracts

The generated infrastructure and framework configuration SHALL agree on every binding exactly once, including D1, KV/session, Images, and Worker service bindings. `Cloudflare.InferEnv` output and generated application environment types SHALL expose the same names. Moving adapter or build ownership into a first-class resource does not authorize renaming, auto-replacing, or dropping a binding.

The following remain integration shims unless their own targeted gate passes:

| Integration shim                                                                       | Retention/removal gate                                                                                                          |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| explicit `nodejs_compat` and `global_fetch_strictly_public` flags for external entries | remove a flag only when the exact framework entry no longer requires it and a direct workerd request passes                     |
| Prisma's full nested Wrangler `migrations_pattern`                                     | remove only when local Wrangler discovers and applies nested Prisma migrations without it                                       |
| framework adapter/entrypoint and workerd-compatible rendering                          | remove only when the released framework/Alchemy default builds, uploads, and serves the same document/API behavior              |
| Astro/Next Images bindings                                                             | remove a binding only when the framework adapter no longer declares/uses it and binding types plus the affected live route pass |

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
- first-class source-provider dependency resolution and peer compatibility under strict npm, pnpm, and Bun installs;
- a non-destructive plan comparison between each generic resource and its candidate first-class replacement;
- per-provider memo invalidation for imported sibling workspaces and root/framework configuration;
- framework build outputs for Next, Nuxt, SvelteKit, Astro, TanStack Start, React Router, TanStack Router, and Solid.

Credentialed live gates SHALL cover, at minimum:

- web-only, server-only, combined, and `self` topologies;
- a real deployed server URL reaching a dependent frontend build;
- root and deep-link requests for a pure SPA;
- a React Router document SSR request;
- a Nuxt page request and D1-backed operation in development;
- a production D1 migration and database-backed request;
- framework-required KV/Images bindings where generated;
- framework-native `alchemy dev`, normal HMR development, and resource-backed local bindings for every adopted first-class resource;
- unchanged redeploy plus sibling-workspace-only change for each adopted source provider;
- `_headers`, `_redirects`, 404 handling, and representative MIME responses through first-class asset collection;
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

1. Identify a published exact candidate and its released tag commit, plus the exact published framework source packages it dynamically loads.
2. Update a temporary candidate fixture without changing generated defaults.
3. Re-run every applicable canonical reproduction against the released package.
4. Generate, install, typecheck, and build the affected topology matrix under npm, pnpm, and Bun without relying on accidental hoisting.
5. Compare the resource plan and state identity before changing a framework's generated resource.
6. Run the credentialed live scenarios affected by the release.
7. Change the exact generated pin only if the complete release gate passes.
8. Adopt each first-class framework resource independently; a failed framework remains on its generic path.
9. Remove only independently qualified A1–A5 safeguards or named integration shims; retain A6 exact pinning.
10. Re-run that shim's provider-free and live removal gate without it.
11. Update the findings ledger in the same change.

If a candidate fixes one defect but regresses another supported topology, Better-T-Stack keeps the current pin. Rollback means restoring the previous exact dependency and compatibility code; it never destroys user infrastructure.

## Risks / Trade-offs

- **Exact prerelease pinning slows upgrades** → Prefer reproducibility; qualify published candidates deliberately.
- **`memo: false` makes builds slower** → Accept the cost until a published workspace-aware default passes the defined imported-workspace and root-input corpus.
- **Framework adapters evolve independently** → Verify each framework path and binding rather than treating one Cloudflare deploy as universal proof.
- **First-class resources can shorten code while changing behavior** → Compare builds, state plans, framework configuration, bindings, local development, and live routes before deleting generic fields.
- **Dynamic source packages add a second compatibility surface** → Pin or otherwise lock the released compatible graph and test resolution under every supported package manager without hoisting assumptions.
- **A source provider may require a different framework major** → Keep that framework on `StaticSite`; do not couple an Alchemy adoption to an implicit framework-major upgrade.
- **Provider-owned defaults may replace stateful bindings** → Preserve logical IDs and explicit bindings during initial adoption, and require a separate non-destructive removal gate for automatic resources.
- **Live verification consumes Cloudflare resources** → Use owned stages, trusted credentials, cleanup reconciliation, and explicit leak audits.
- **Merged fixes can remain unreleased** → Track both main and registry state, but generate only released exact packages.
- **Static review can produce persuasive false positives** → Keep disproved claims in the ledger and require the evidence level appropriate to the assertion.

## Migration Plan

Implementation work should proceed in this order:

1. Canonicalize the baseline ledger and missing one-off reproductions without changing templates.
2. Record the current generic code, framework configuration, dependencies, bindings, development path, plan identity, and live behavior as the per-framework comparison baseline.
3. Add deterministic generated-artifact, dependency-pin, and typecheck gates around current behavior.
4. Harden the disposable live harness and cleanup reconciliation.
5. Run the full accepted-version baseline and publish an honest support scoreboard.
6. Record beta.69 and `@distilled.cloud/*@0.17.0` as released candidates without changing framework defaults.
7. Qualify the Worker source engine and every published `@distilled.cloud/*` dependency against unaffected Cloudflare paths first.
8. Evaluate Next.js, Nuxt, SvelteKit, and Astro independently against their named offline, development, live, and cleanup gates.
9. Upgrade the exact pin only if the release does not regress the supported Cloudflare matrix; adopt only the framework resources whose own gates pass.
10. Remove generic resource fields, adapters, plugins, scripts, dependencies, flags, and bindings independently through their named gates.
11. Retain the generic path for blocked frameworks and document why; never add a moving-version branch to generated code.

## Open Questions

1. Will a released default React Router path select a registered workerd handler without a custom entry?
2. What published upstream behavior and cross-workspace/root-input evidence is sufficient to classify Alchemy's default memo scope as workspace-aware and remove A5?
3. Can Alchemy express OpenNext's self service binding without a resource dependency cycle, or must ISR remain partially unsupported?
4. Does a freshly authenticated profile make both `alchemy logs` and `alchemy tail` work with the required scopes?
5. When will the released Distilled runtime/plugin peers agree with Alchemy's selected Cloudflare core version under strict npm, pnpm, and Bun workspaces?
6. Will `Website.SvelteKit` support Better-T-Stack's selected stable SvelteKit major without forcing an unrelated framework migration?
7. Will `Website.Astro` preserve Cloudflare Images behavior rather than the inspected draft's passthrough image service, while loading native Astro configuration as its source currently does?
8. Can a first-class resource preserve the existing Worker and binding identities in the plan, or does any framework require an explicit state migration?

Resolved on 2026-07-26: beta.64 `Website.Vite` reliably served both TanStack Router and the former Solid SPA root
and direct deep-link requests, so the A3 `StaticSite` fallback was removed.

Resolved on 2026-08-01: beta.67 native `StaticSite` Inputs preserved generated Config values and
the combined server Output dependency, so the A1 wrapper and A2 caller-side resolution were removed.

Resolved on 2026-08-06: PRs #886 and #923 and `@distilled.cloud/*@0.17.0` are published in beta.69.

## 10. Managed database architecture

Database ownership follows the process that opens the connection, not whichever deployment prompt happens to run first. `backend: self` assigns ownership to the web plane; every separate backend assigns it to the server plane. This keeps mixed provider stacks honest: Alchemy provisions a hosted database only when it also controls the consuming plane.

The single `alchemy.run.ts` co-locates provider construction, migration credentials, runtime credentials, provider layers, and application deployment. It defines an Effect-shaped `databaseEnv` for Prisma resources and statically shaped `databaseBindings` whose individual values are Effects for Cloudflare. The second form is intentional: passing the entire Worker props object through an Effect widens Alchemy's Worker binding generic, while individual binding Effects retain precise `Cloudflare.InferEnv` output.

Runtime credentials are pooled or least privilege. Migration credentials are direct or elevated and never reach the application resource. Prisma migrations run through `Command.Exec` because schema history belongs in the repository; Drizzle uses native Neon/PlanetScale `migrationsDir` support and a command for Prisma Postgres. PlanetScale defaults to `PS_DEV`, with an explicit cost warning in generated guidance.

## 11. Prisma deployment architecture

The product surface calls the target **Prisma**; `Prisma.Compute` is the Alchemy resource used in generated code. Supported automatic framework builds are Next.js, Nuxt, Astro, and TanStack Start. Solid 2 uses the standalone `.output/server/index.mjs` artifact produced by its Nitro deployment adapter. React Router uses the framework's documented custom-server Vite input so `react-router build` emits a self-contained Express server at `build/server/index.js`. SvelteKit uses the official `adapter-node` output directly at `build/index.js`; Vite bundles its production dependencies during that framework build because Prisma Compute uploads only the selected artifact directory. TanStack Router is rejected for Prisma deployment because it emits only static SPA assets and the released Alchemy Prisma provider has no static-site resource. Server apps use the Bun auto-build surface for Hono, Express, Fastify, and Elysia on Bun or Node.

One `Prisma.Project` is reused by all Prisma application resources and, when selected, Prisma Postgres. Mixed Cloudflare/Prisma stacks remain one Alchemy graph, so the server resource is yielded before the web and its URL remains an Output rather than a copied configuration string.
Nuxt and Astro now use their released first-class resources. Next.js and SvelteKit remain on
qualified generic paths because their current provider peers do not match the latest generated
framework dependencies. Beta.72 contains the Effect compatibility fix; the remaining Nuxt and Astro
work is provider-owned live build, development, binding, and request verification rather than a
dependency-startup blocker.
