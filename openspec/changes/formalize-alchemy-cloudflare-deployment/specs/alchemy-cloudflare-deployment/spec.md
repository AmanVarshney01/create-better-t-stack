## ADDED Requirements

### Requirement: Vetted exact Alchemy version

Every generated Cloudflare project SHALL use the exact accepted Alchemy version. The currently accepted version SHALL be `alchemy@2.0.0-beta.62`; Alchemy version ranges SHALL NOT be generated. A replacement version SHALL pass every applicable Better-T-Stack offline and live gate before becoming accepted. A fix on main or in a pull request SHALL not be treated as available until a containing release is pinned and verified. Exact pinning is a permanent publication-safety policy, not a temporary beta shim.

#### Scenario: Generate a Cloudflare target

- **WHEN** either deployment plane selects Cloudflare
- **THEN** the infra package SHALL depend on exactly `alchemy@2.0.0-beta.62`
- **AND** the generated package manager SHALL resolve that exact version

#### Scenario: Evaluate an upgrade

- **WHEN** a newer Alchemy release is proposed
- **THEN** every applicable bug-ledger reproduction and live verification scenario SHALL run against the released tag
- **AND** the exact pin SHALL change only after those checks pass
- **AND** the replacement SHALL remain an exact version

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

Each web framework SHALL use the intentional generated resource and runtime entry described by the accepted-version design: Output-aware StaticSite for TanStack Router/Solid SPAs, explicit-entry Website.Vite for React Router, Website.Vite for TanStack Start, and framework server/static outputs for Next.js, Nuxt, SvelteKit, and Astro. A framework path SHALL not change solely because another framework's gate passed.

#### Scenario: Verify Nuxt support

- **WHEN** Nuxt uses Cloudflare full-stack or web deployment
- **THEN** generated verification SHALL exercise a page SSR request and the development platform proxy when applicable
- **AND** an API-route-only probe SHALL not establish page support

#### Scenario: Verify Astro support

- **WHEN** Astro uses a server-rendered Cloudflare path
- **THEN** generated verification SHALL exercise a document or action route with its required session/Images bindings
- **AND** a static asset response alone SHALL not establish SSR support

### Requirement: Sanctioned Alchemy compatibility shims

Until their individual removal gates pass, the generator SHALL retain the Output-aware StaticSite wrapper, explicit Config resolution, workspace-safe memo policy, StaticSite pure-SPA fallback, React Router Worker entry with web-stream rendering, Nuxt development platform proxy, explicit external-Worker compatibility flags, and local Wrangler Prisma migration pattern. Integration shims SHALL not be mislabeled as confirmed Alchemy core defects.

#### Scenario: Change a sibling workspace

- **WHEN** a frontend-imported sibling package changes without a lockfile change
- **THEN** a normal deploy SHALL rebuild the frontend rather than reuse stale output

#### Scenario: Deploy a pure Vite SPA

- **WHEN** TanStack Router or Solid deploys with the accepted Alchemy version
- **THEN** it SHALL use the current StaticSite compatibility path
- **AND** a direct client-side route request SHALL receive the SPA fallback

#### Scenario: Serve React Router

- **WHEN** a React Router Worker receives a document request
- **THEN** a registered fetch handler SHALL serve it
- **AND** SSR SHALL use workerd-compatible web streams

#### Scenario: Run Nuxt with D1 locally

- **WHEN** a Nuxt self-backend D1 project runs a page in development
- **THEN** `cloudflare:workers` SHALL resolve through the development proxy
- **AND** a D1-backed request SHALL succeed

#### Scenario: Remove a development or migration shim

- **WHEN** maintainers propose removing the Nuxt development proxy or Prisma Wrangler migration pattern
- **THEN** the same page/D1 request or nested local migration SHALL pass without that exact shim
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

#### Scenario: Remove React Router entry

- **WHEN** a released default Website.Vite React Router path is considered
- **THEN** it SHALL upload a registered handler and serve a real SSR document in workerd before the custom entry is removed
