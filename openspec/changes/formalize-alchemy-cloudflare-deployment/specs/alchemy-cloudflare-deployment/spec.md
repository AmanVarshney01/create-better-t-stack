## ADDED Requirements

### Requirement: Vetted exact Alchemy version

Every generated Alchemy project SHALL use the exact accepted Alchemy version. The currently selected release SHALL be `alchemy@2.0.0-beta.72`; Alchemy version ranges SHALL NOT be generated. The generated `effect`, `@effect/platform-node`, and `@effect/platform-bun` versions SHALL use the exact latest selected Effect release candidate, currently rc.108. This combination contains Alchemy's released `Schema.TaggedError` migration and SHALL be verified without an older Effect pin, dependency patch, override, or hoisted linker. A replacement version SHALL pass every applicable Better-T-Stack offline and live gate before becoming accepted. A fix on main or in a pull request SHALL not be treated as available until a containing release is pinned and verified. Exact pinning is a permanent publication-safety policy, not a temporary beta shim.

#### Scenario: Generate a Cloudflare target

- **WHEN** either deployment plane selects Cloudflare
- **THEN** the infra package SHALL depend on exactly `alchemy@2.0.0-beta.72`
- **AND** its Effect and Effect platform dependencies SHALL be pinned exactly to `4.0.0-rc.108`
- **AND** the generated package manager SHALL resolve that exact version
- **AND** the generated dependency graph SHALL install without an Effect downgrade or package-manager restriction

#### Scenario: Evaluate an upgrade

- **WHEN** a newer Alchemy release is proposed
- **THEN** every applicable bug-ledger reproduction and live verification scenario SHALL run against the released tag
- **AND** the exact pin SHALL change only after those checks pass
- **AND** the replacement SHALL remain an exact version

#### Scenario: A candidate fixes some safeguards but regresses another topology

- **WHEN** a candidate release passes targeted workaround-removal checks but fails any supported Cloudflare topology gate
- **THEN** the accepted exact pin and all safeguards required by that accepted version SHALL remain unchanged
- **AND** the failed candidate and its upstream fix gate SHALL be recorded in the findings ledger

### Requirement: Experimental Alchemy disclosure

Generated documentation and post-install output SHALL state that the accepted Alchemy v2 integration uses an exact prerelease, link the current findings ledger, and distinguish supported, experimental, blocked, and open-limitation behavior. Alchemy SHALL remain opt-in and SHALL not be presented as stable solely because a generated build succeeds.

#### Scenario: Generate Cloudflare instructions

- **WHEN** either deployment plane selects Cloudflare
- **THEN** the README SHALL show the exact Alchemy version, deploy/destroy commands, stage guidance, and current support limitations

### Requirement: Supported Cloudflare topology matrix

Subject to existing stack compatibility, the generator SHALL emit intentional Cloudflare paths for web-only deployment across the web frontends, full-stack `self` deployment for Next.js, Nuxt, SvelteKit, Astro, and TanStack Start, server-only Hono Workers, combined Cloudflare web plus Hono Workers, mixed single-plane Cloudflare deployment, and supported D1 consumers. Cloudflare server deployment SHALL reject non-Hono separate backends and non-Workers runtimes. Emitting a path SHALL NOT by itself classify the cell as live-verified; generated documentation SHALL use the maintained support scoreboard.

Generated `self` paths that extend beyond Alchemy's documented framework support SHALL remain experimental until the exact accepted version passes the named page/document and binding-backed live scenarios.

#### Scenario: Generate combined Cloudflare

- **WHEN** a supported web frontend and Hono Workers backend both select Cloudflare
- **THEN** the server Worker SHALL be created before the web build
- **AND** the web build SHALL receive the deployed server URL through an Alchemy dependency edge

#### Scenario: Generate a self backend

- **WHEN** a supported full-stack frontend uses `backend=self` and Cloudflare web deployment
- **THEN** routes, bindings, and optional D1 resources SHALL be web-owned
- **AND** no separate server Worker SHALL be generated

#### Scenario: Reject an invalid server

- **WHEN** Cloudflare server deployment is selected without Hono on Workers
- **THEN** validation SHALL fail before generation with an actionable alternative

#### Scenario: Claim a server-rendered framework as live-supported

- **WHEN** documentation classifies a Next.js, Nuxt, SvelteKit, Astro, or TanStack Start `self` path as live-supported
- **THEN** the accepted-version scoreboard SHALL link a successful page/document request for that exact framework path
- **AND** an API-only request or generated typecheck SHALL not satisfy the claim

### Requirement: Complete generated Alchemy artifacts

Every non-`none` Cloudflare selection SHALL emit the infrastructure source, exact dependency, scripts, framework adapter or entry, required bindings, inferred environment types, ignore behavior, and user guidance needed by that topology. Interactive, flag, and programmatic generation SHALL apply the same hard compatibility rules.

#### Scenario: Generate a Cloudflare plane

- **WHEN** web or server deployment selects Cloudflare
- **THEN** generation SHALL include `packages/infra/alchemy.run.ts` and the required infra package/scripts
- **AND** every selected framework resource and binding SHALL be represented in deterministic generator tests

#### Scenario: Use programmatic generation

- **WHEN** a programmatic caller requests an invalid Cloudflare runtime/backend/database consumer
- **THEN** validation SHALL reject it before emitting partial provider artifacts

### Requirement: Correct deploy-time values and bindings

Cloudflare resources SHALL preserve dependency ordering and pass resolved values to build subprocesses. Config descriptors and unresolved Outputs SHALL NOT be serialized into application build environments. Secret inputs SHALL be redacted, and framework-required bindings SHALL be declared exactly once and reflected in inferred environment types.

#### Scenario: Propagate server URL

- **WHEN** a combined Cloudflare stack is deployed
- **THEN** the frontend build SHALL receive the deployed Workers URL
- **AND** retain a dependency edge on the server resource

#### Scenario: Resolve Effect Config

- **WHEN** a StaticSite property contains an Effect Config value
- **THEN** the build environment SHALL contain the resolved string or redacted value
- **AND** SHALL NOT contain a serialized Config descriptor

#### Scenario: Generate a framework binding

- **WHEN** a framework requires D1, KV, Images, or another Worker binding
- **THEN** the generated resource SHALL contain that binding exactly once
- **AND** its type SHALL appear in the inferred environment type

#### Scenario: Handle a secret build value

- **WHEN** a generated Cloudflare build requires a secret configuration value
- **THEN** it SHALL remain redacted through plan, subprocess input diagnostics, generated documentation, and test failure output

### Requirement: Framework-specific Cloudflare paths

Each web framework SHALL use the intentional generated resource and runtime entry described by the accepted-version design: `Website.Vite` with single-page-application asset handling for TanStack Router, worker-first `Website.Vite` SSR for Solid 2, explicit-entry `Website.Vite` for React Router, `Website.Vite` for TanStack Start, `Website.Nuxt` for Nuxt, `Website.Astro` for Astro, and qualified generic `StaticSite` paths for Next.js and SvelteKit until their first-class providers pass the generated framework's independent gates. A framework path SHALL not change solely because another framework's gate passed.

#### Scenario: Verify Nuxt support

- **WHEN** Nuxt uses Cloudflare full-stack or web deployment
- **THEN** generated verification SHALL exercise a page SSR request and the selected path's development binding contract
- **AND** an API-route-only probe SHALL not establish page support

#### Scenario: Verify Astro support

- **WHEN** Astro uses a server-rendered Cloudflare path
- **THEN** generated verification SHALL exercise a document or action route with its required session/Images bindings
- **AND** a static asset response alone SHALL not establish SSR support

### Requirement: Released first-class Cloudflare framework resources

Better-T-Stack SHALL generate `Website.Nextjs`, `Website.Nuxt`, `Website.SvelteKit`, or `Website.Astro` only when that API is present in the accepted exact Alchemy release and every dynamically loaded framework source package is published, reproducibly resolvable, peer-compatible with the generated framework, and qualified by that framework's independent gates. A draft, merge commit, upstream-main implementation, git dependency, or passing sibling framework SHALL NOT make a resource eligible.

#### Scenario: Upstream pull request remains unreleased

- **WHEN** PR #886 or #923 contains a candidate resource that is absent from the accepted exact release
- **THEN** the affected framework SHALL remain on its accepted generic Cloudflare path
- **AND** generation SHALL NOT install the pull-request branch or an unpublished source package

#### Scenario: A release contains only some usable resources

- **WHEN** one exact Alchemy release contains multiple first-class framework resources but only a subset passes Better-T-Stack's framework-specific gates
- **THEN** only the passing subset SHALL migrate
- **AND** every blocked framework SHALL retain its previous generated path

#### Scenario: Resolve a framework source under strict workspaces

- **WHEN** an adopted resource dynamically loads `@alchemy.run/cloudflare-frameworks` from Alchemy beta.72
- **THEN** fresh npm, pnpm, and Bun projects SHALL resolve that package without accidental global installation or hoisting
- **AND** the generated framework and Effect/Alchemy versions SHALL satisfy its released peer contract

### Requirement: First-class resource migration contract

Adopting a first-class framework resource SHALL preserve the `web` Worker identity, output contract, dependency graph, application `env`, secret redaction, framework-public build variables, D1 and other bindings, and generated environment types. Generic build commands, output paths, entries, bundling options, flags, development wiring, adapters, dependencies, and memo overrides SHALL be removed only where the released resource owns the same behavior and its named removal gate passes.

#### Scenario: Migrate a combined web and server stack

- **WHEN** the web framework moves from `StaticSite` to its first-class resource
- **THEN** the first-class resource SHALL receive the deployed server Worker URL through the same Alchemy dependency edge
- **AND** the built frontend and live application SHALL use that deployed URL

#### Scenario: Compare the resource plan

- **WHEN** a generated fixture changes only from the generic framework resource to its candidate first-class wrapper
- **THEN** the provider-free plan SHALL show no unexpected deletion or replacement of the Worker, D1 database, KV namespace, Images resource, or another stateful binding
- **AND** any unavoidable identity change SHALL block adoption until an explicit migration and rollback design is approved

#### Scenario: Remove provider-owned plumbing

- **WHEN** a first-class resource proves ownership of build, asset, entrypoint, compatibility, development, or memo behavior
- **THEN** the duplicate generated field, script, adapter, plugin, or dependency SHALL be removed in the same framework-scoped change
- **AND** unrelated framework and non-Cloudflare configuration SHALL remain unchanged

#### Scenario: Preserve a database consumer

- **WHEN** an adopted full-stack or separate-server Cloudflare path consumes D1 or an existing redacted `DATABASE_URL`
- **THEN** the same consuming Worker SHALL receive the same database contract
- **AND** framework-resource adoption SHALL NOT introduce an Alchemy Prisma resource or change database-provider ownership

### Requirement: Next.js first-class parity

`Website.Nextjs` SHALL replace the OpenNext `StaticSite` path only after the released resource preserves generated Next.js SSR, route handlers, static assets, public build variables, runtime secrets, Images, Cloudflare bindings, development workflows, and normal request behavior. OpenNext ISR SHALL remain an explicit limitation until its separate `WORKER_SELF_REFERENCE` revalidation gate passes.

#### Scenario: Adopt Website.Nextjs

- **WHEN** a released `Website.Nextjs` candidate is evaluated
- **THEN** a fresh generated project SHALL build and serve SSR, a route handler, a static asset, and a real Images-backed route or transformation
- **AND** the live Worker SHALL receive the expected runtime secrets and bindings

#### Scenario: Remove manual OpenNext deployment wiring

- **WHEN** the released Next.js resource owns OpenNext build, Worker bundling, asset routing, compatibility defaults, and development serving
- **THEN** generation MAY remove `build:cloudflare`, deployment-only Wrangler layout, `.open-next` paths, `bundle: false`, and the hard-coded development URL only after their individual assertions pass
- **AND** `open-next.config.ts`, `@opennextjs/cloudflare`, `IMAGES`, or `global_fetch_strictly_public` SHALL remain wherever the generated runtime or a live gate still requires them

#### Scenario: Evaluate Next.js ISR after adoption

- **WHEN** normal SSR and prerendered content pass under `Website.Nextjs`
- **THEN** Better-T-Stack SHALL still describe on-demand ISR writes as unsupported
- **AND** SHALL NOT promote ISR until a revalidation request proves a working self-reference binding and durable cache write

### Requirement: Nuxt first-class parity

`Website.Nuxt` SHALL replace the Nitro `StaticSite` path only when a released resource containing the compiled development-plugin fix loads and preserves the generated Nuxt configuration, owns a compatible Cloudflare preset and build lifecycle, serves page SSR and API routes, propagates public and private values, and provides real local resource bindings. Until then, the generated project SHALL retain its qualified Nitro, Wrangler, alias, build, and `StaticSite` plumbing and SHALL NOT install a provider fork or unpublished package.

#### Scenario: Adopt Website.Nuxt

- **WHEN** a released `Website.Nuxt` candidate is evaluated
- **THEN** the generated UI, runtime config, route rules, page SSR, API routes, assets, auth values, and production bindings SHALL behave as before
- **AND** an API-only probe SHALL not satisfy the page SSR gate

#### Scenario: Remove the Nuxt development shim

- **WHEN** provider-owned Nuxt development replaces `nitro-cloudflare-dev`, the `cloudflare:workers` alias, Wrangler development config, or `dev:bare`
- **THEN** `alchemy dev` SHALL serve a page and a D1-backed operation through real local bindings without each removed shim
- **AND** normal Nuxt HMR SHALL remain usable

#### Scenario: Delegate the Nuxt production build

- **WHEN** a generated Cloudflare Nuxt project uses `Website.Nuxt`
- **THEN** the web package SHALL NOT expose a duplicate standalone production build or preview script
- **AND** the Alchemy source provider SHALL load Nuxt and inject the deployment adapter during its owned build lifecycle

### Requirement: SvelteKit first-class parity

`Website.SvelteKit` SHALL NOT be adopted by forcing an unapproved framework-major or prerelease upgrade. A version-compatible released resource SHALL preserve preprocessing, aliases, route configuration, SSR, prerendering, `platform.env`, D1, auth, assets, and both Alchemy-managed and normal HMR development before Cloudflare adapter plumbing is removed.

#### Scenario: Candidate requires a different SvelteKit major

- **WHEN** the released source provider's peer range excludes Better-T-Stack's selected stable SvelteKit version
- **THEN** SvelteKit SHALL remain on its accepted generic Cloudflare path
- **AND** the Alchemy upgrade SHALL NOT silently change the generated SvelteKit major

#### Scenario: Adopt Website.SvelteKit

- **WHEN** a version-compatible `Website.SvelteKit` passes provider-free checks
- **THEN** a live document, prerendered route, asset, and binding-backed `platform.env` operation SHALL pass in deployment and development
- **AND** only then may generation remove `@sveltejs/adapter-cloudflare`, `_worker.js` deployment wiring, `.assetsignore`, and the hard-coded dev URL

### Requirement: Astro first-class parity

`Website.Astro` SHALL replace the Astro `StaticSite` path when the released resource loads and merges the native Astro configuration, injects the Cloudflare adapter during its owned build, and preserves Tailwind/Vite plugins, environment schema, integrations, SSR, prerendering, sessions, Cloudflare Images behavior, asset metadata, and generated binding types. The generated Astro config SHALL NOT install or call a competing checked-in `@astrojs/cloudflare` adapter. The generated resource SHALL retain explicit `SESSION` and `IMAGES` bindings so the wrapper reuses the existing namespace, `Cloudflare.InferEnv` exposes both names, and first-class adoption does not replace state solely because the wrapper also supports an implicit default namespace.

#### Scenario: Preserve native Astro configuration

- **WHEN** `Website.Astro` builds the generated project
- **THEN** the Tailwind Vite plugin, environment schema, integrations, and route configuration from `astro.config.*` SHALL remain active
- **AND** stale documentation that contradicts released source behavior SHALL block adoption until corrected or conclusively qualified

#### Scenario: Delegate the Astro production build

- **WHEN** a generated Cloudflare Astro project uses `Website.Astro`
- **THEN** the web package SHALL NOT expose a duplicate standalone production build or preview script
- **AND** the source provider SHALL load Astro programmatically and inject its deployment adapter during the Alchemy-owned build

#### Scenario: Preserve Astro session and image behavior

- **WHEN** the candidate resource changes adapter or binding ownership
- **THEN** a session-backed route and a real Cloudflare image route or transformation SHALL pass with matching inferred binding types
- **AND** a passthrough-only image service SHALL NOT silently replace currently generated Cloudflare Images behavior

#### Scenario: Preserve Astro asset behavior

- **WHEN** a generated Astro site deploys through `Website.Astro`
- **THEN** SSR, a prerendered route, 404 handling, `_headers`, `_redirects`, and representative HTML, JavaScript, CSS, image, and font MIME responses SHALL pass

### Requirement: First-class development, memo, and asset ownership

Each adopted framework source provider SHALL own a coherent build and development lifecycle. Its memo SHALL skip an unchanged rebuild while invalidating on every imported sibling workspace and relevant root, lockfile, manifest, framework-config, and generated-config input. Its asset collector SHALL preserve routing metadata and content types. Passing the generic Vite resource's corresponding tests SHALL NOT qualify a different source provider.

#### Scenario: Redeploy without changes

- **WHEN** an adopted framework is deployed twice with unchanged inputs
- **THEN** the second plan SHALL reuse the framework build
- **AND** SHALL make no provider mutation caused solely by generated output hashing itself

#### Scenario: Change an imported workspace

- **WHEN** only a sibling workspace imported by the framework changes
- **THEN** the next normal deploy SHALL rebuild and deploy the affected frontend
- **AND** `memo: false` SHALL remain until that provider-specific check passes

#### Scenario: Exercise both development modes

- **WHEN** a first-class framework resource replaces explicit `dev` wiring
- **THEN** `alchemy dev` SHALL expose its real Cloudflare binding contract
- **AND** the project's normal framework HMR command SHALL remain documented and usable without recursive script invocation or a fixed-port collision

### Requirement: Independent first-class rollout and rollback

First-class framework resources SHALL be adopted in framework-scoped changes after the containing exact release passes the complete existing Cloudflare regression matrix. A failed resource SHALL be rolled back by restoring the prior exact generated path, dependency graph, and configuration; rollback SHALL NOT delete or recreate user infrastructure.

#### Scenario: One framework regresses the release

- **WHEN** a candidate Alchemy release introduces first-class resources but regresses any already supported Cloudflare topology
- **THEN** the accepted Alchemy pin SHALL remain unchanged
- **AND** no first-class resource from that release SHALL be generated

#### Scenario: One resource fails after the release is accepted

- **WHEN** the release is otherwise acceptable but one framework fails its resource-specific gate
- **THEN** that framework SHALL remain on its generic path while independently passing frameworks may migrate
- **AND** generated code SHALL contain no runtime version switch between the paths

### Requirement: Cloudflare framework-resource scope

Cloudflare framework-resource adoption SHALL change only Alchemy-managed Cloudflare web resources and the Cloudflare-specific framework configuration they replace. It SHALL NOT add or redesign Vercel, Railway, Docker, Waku, or a cross-provider deployment abstraction. Separate managed-database and Prisma deployment capabilities SHALL be evaluated by their own requirements.

#### Scenario: Implement the framework-resource design

- **WHEN** implementation tasks from this specification are completed
- **THEN** Vercel, Railway, and Docker deployment behavior SHALL be unchanged
- **AND** managed databases and Prisma deployment SHALL remain governed by their separate specifications

### Requirement: Sanctioned Alchemy compatibility shims

Until their individual removal gates pass, the generator SHALL retain the workspace-safe memo policy for generic `StaticSite`, React Router Worker entry with web-stream rendering, Nuxt development binding proxy, explicit external-Worker compatibility flags, and local Wrangler Prisma migration pattern. Native `StaticSite` SHALL receive Alchemy Outputs and Effect Config values directly. The adopted `Website.Astro` path SHALL rely on its provider-owned development/build lifecycle instead of retaining duplicate generated shims. Integration shims SHALL not be mislabeled as confirmed Alchemy core defects.

#### Scenario: Change a sibling workspace

- **WHEN** a frontend-imported sibling package changes without a lockfile change
- **THEN** a normal deploy SHALL rebuild the frontend rather than reuse stale output

#### Scenario: Deploy the TanStack Router Vite SPA

- **WHEN** TanStack Router deploys with the accepted Alchemy version
- **THEN** it SHALL use `Website.Vite` with single-page-application asset handling
- **AND** a direct client-side route request SHALL receive the SPA fallback

#### Scenario: Deploy Solid 2 SSR

- **WHEN** Solid 2 deploys with the accepted Alchemy version
- **THEN** it SHALL use `Website.Vite` with worker-first asset routing and a server entry
- **AND** document, Better Auth, and oRPC requests SHALL execute through the SSR Worker

#### Scenario: Serve React Router

- **WHEN** a React Router Worker receives a document request
- **THEN** a registered fetch handler SHALL serve it
- **AND** SSR SHALL use workerd-compatible web streams

#### Scenario: Run Nuxt with D1 locally

- **WHEN** a Nuxt self-backend D1 project runs a page in development
- **THEN** the retained development proxy SHALL provide the real local `cloudflare:workers` binding contract
- **AND** a D1-backed request SHALL succeed

#### Scenario: Remove a development or migration shim

- **WHEN** maintainers propose removing the Prisma Wrangler migration pattern or another remaining development shim
- **THEN** the corresponding nested local migration or binding-backed request SHALL pass without that exact shim
- **AND** the change SHALL not be classified as an Alchemy fix unless released-source evidence supports that classification

#### Scenario: Remove a compatibility flag or binding

- **WHEN** maintainers propose removing an external-Worker flag, Images binding, or session KV
- **THEN** the exact framework adapter SHALL no longer declare or consume it
- **AND** inferred binding types, generated build, and the affected workerd/live route SHALL pass without it

#### Scenario: Remove a framework entry or rendering shim

- **WHEN** a released framework or Alchemy default replaces a custom entry or rendering path
- **THEN** it SHALL build, upload a registered handler, and serve the same document/API behavior before the generated shim is removed

### Requirement: Versioned Alchemy bug ledger

The repository SHALL maintain a versioned Alchemy findings ledger. Each entry SHALL contain an identifier, classification, affected release, evidence or reproduction, upstream reference and release status, current handling, removal condition, and last verification date. Confirmed defects, limitations, publication hazards, unverified observations, and disproved claims SHALL remain distinct.

#### Scenario: Record a suspected bug

- **WHEN** review identifies suspicious Alchemy behavior
- **THEN** the ledger SHALL classify it as unverified until released-tag source and a minimal plan, build, or live reproduction support it
- **AND** static analysis alone SHALL not be presented as a confirmed live failure

#### Scenario: Main contains a fix

- **WHEN** an upstream fix is merged but not in the accepted release
- **THEN** the ledger SHALL mark it unreleased
- **AND** the current workaround SHALL remain generated

### Requirement: Layered Alchemy verification

Provider-free verification SHALL cover representative web-only, server-only, combined, self-backend, D1, pure-SPA, React Router, Nuxt, and OpenNext generation and typechecks. Credentialed live verification SHALL be required for version upgrades, shim removal, and resource-wiring changes.

The repository SHALL maintain an accepted-version scoreboard that distinguishes generated, provider-free verified, live verified, experimental, and blocked cells. Missing live evidence SHALL downgrade the claim rather than being inferred from another framework or topology.

#### Scenario: Verify a combined deployment

- **WHEN** a generated combined stack is deployed to an owned review stage
- **THEN** real HTTP requests to web and server SHALL succeed
- **AND** the frontend artifact SHALL use the deployed server URL

#### Scenario: Verify a framework behavior

- **WHEN** a framework integration changes
- **THEN** the live gate SHALL exercise a real affected route
- **AND** SPA, React Router, and D1 paths SHALL test fallback, document SSR, and database behavior respectively

#### Scenario: Claim OpenNext ISR

- **WHEN** Better-T-Stack claims on-demand ISR support
- **THEN** the live gate SHALL exercise revalidation through `WORKER_SELF_REFERENCE`
- **AND** normal request success alone SHALL not satisfy the gate

#### Scenario: Lack a framework live artifact

- **WHEN** a generated framework/topology has typecheck or build evidence but no named live route result
- **THEN** the scoreboard and generated documentation SHALL call it experimental rather than live-verified

### Requirement: Owned Alchemy cleanup

Every credentialed Alchemy verification SHALL use a unique owned stage, retain the originating deployment directory and state until normal destruction finishes, persist a stable ownership marker and expected resource inventory outside the runner before creation, destroy from the same directory and exact stage, terminate child processes, and audit for leaked Workers, D1 databases, KV namespaces, and related resources. `finally` remains the normal fast path. An independent expiry-based reconciler SHALL cover runner loss by inventorying and deleting only marker-matched resources through narrowly scoped Cloudflare APIs without depending on lost local Alchemy state. Provider credentials SHALL be available only to trusted protected code in an isolated disposable scope, never to fork or untrusted pull-request execution.

#### Scenario: Verification fails after partial creation

- **WHEN** deployment or an assertion fails after resources exist
- **THEN** cleanup SHALL still run from the owning directory
- **AND** the result SHALL fail if cleanup cannot be confirmed
- **AND** report the stage, identifiers, directory, and recovery command

#### Scenario: Stage ownership is unknown

- **WHEN** a stage cannot be proven to belong to the current run
- **THEN** automated cleanup SHALL leave it untouched
- **AND** report it separately

#### Scenario: Lose the originating runner and state

- **WHEN** a runner exits before normal Alchemy destruction can use its local directory/state
- **THEN** the independent reconciler SHALL inventory the externally recorded stage marker and expected resource classes
- **AND** delete only resources whose ownership matches through provider APIs
- **AND** report any resource that cannot be safely identified or removed

### Requirement: Compatibility-safeguard removal gates

An A1–A5 safeguard SHALL be removed only when its named behavior is available in a published exact Alchemy release, the relevant minimal reproduction passes without the safeguard, generated projects build/typecheck without it, affected live scenarios pass without it, and the bug ledger is updated in the same change. Integration shims SHALL use their framework/platform-specific gates above. A6 exact pinning SHALL not be removed.

#### Scenario: Remove Output-aware StaticSite

- **WHEN** a published release preserves supported top-level Output string/object and null build-environment values without the wrapper
- **THEN** the A1 provider-free plan and a combined live deployment SHALL prove the real server URL and dependency edge survive before removing the wrapper

#### Scenario: Remove explicit Config resolution

- **WHEN** a published release serializes `Config.string` and `Config.redacted` correctly without caller resolution
- **THEN** the A2 reproduction SHALL receive the configured string/redacted value rather than a Config descriptor
- **AND** generated builds and the affected live route SHALL pass before removing the `Effect.gen` resolution boundary

#### Scenario: Restore memoization

- **WHEN** a published exact release provides a documented workspace-aware default memo scope
- **THEN** tests SHALL prove that changes to every imported sibling workspace and relevant root lockfile, manifest, workspace, task-runner, and generated-config input cause a normal non-forced rebuild before `memo: false` is removed
- **AND** repository-local partial include globs SHALL not qualify as a removal gate

#### Scenario: Adopt Website.Vite for SPAs

- **WHEN** a release containing Alchemy PR #795 is pinned
- **THEN** a fresh live deployment and direct SPA-route request SHALL pass with Website.Vite before switching
- **AND** after that gate passes the generated SPA path SHALL NOT retain the StaticSite fallback

#### Scenario: Remove React Router entry

- **WHEN** a released default Website.Vite React Router path is considered
- **THEN** it SHALL upload a registered handler and serve a real SSR document in workerd before the custom entry is removed
