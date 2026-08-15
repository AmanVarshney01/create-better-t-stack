## ADDED Requirements

### Requirement: Prisma is a first-class deployment choice

The CLI and generated user guidance SHALL label the target **Prisma**. The generated infrastructure MAY use the provider's `Prisma.Compute` API, but SHALL NOT expose “Prisma Compute” as the deployment-option label or topology summary.

#### Scenario: Interactive selection

- **WHEN** a supported web or server application is configured
- **THEN** Prisma SHALL appear as a deployment option
- **AND** its hint SHALL explain that Alchemy performs the deployment

### Requirement: Prisma web support uses verified production artifacts

Prisma web deployment SHALL support Next.js, Nuxt, Astro, React Router, TanStack Start, SvelteKit, and Solid 2. Automatic Alchemy framework builds SHALL be used where available; every other supported framework SHALL emit a production server artifact from its documented deployment adapter that listens on the configured port.

#### Scenario: Solid 2 custom artifact

- **WHEN** Solid 2 is deployed to Prisma
- **THEN** the generated build SHALL produce `.output/server/index.mjs`
- **AND** the deployment SHALL use that entrypoint on port 3000

#### Scenario: React Router custom server

- **WHEN** React Router is deployed to Prisma
- **THEN** the framework build SHALL use its custom-server Vite entry
- **AND** the deployable `build/server/index.js` SHALL include the Express request handler
- **AND** client assets SHALL remain available from the sibling `build/client` directory

#### Scenario: Static SPA without a native Prisma resource

- **WHEN** Prisma deployment is selected for the TanStack Router SPA
- **THEN** validation SHALL reject the combination before files are written
- **AND** the CLI SHALL explain that Prisma Compute requires an executable server artifact
- **AND** the generator SHALL NOT synthesize a static-file server

#### Scenario: SvelteKit adapter-node artifact

- **WHEN** SvelteKit is deployed to Prisma
- **THEN** SvelteKit SHALL build with `adapter-node`
- **AND** its official build output SHALL be self-contained without a second adapter-specific build
- **AND** the deployment entrypoint SHALL be `build/index.js`

### Requirement: Prisma server support uses container-compatible runtimes

Prisma server deployment SHALL support Hono, Express, Fastify, and Elysia on Bun or Node. Workers, Convex, `self`, and backend-less server targets SHALL be rejected.

#### Scenario: Fastify deployment

- **WHEN** Fastify is deployed to Prisma
- **THEN** the generated server SHALL bind `0.0.0.0`
- **AND** the deployment SHALL expose port 3000 with a health check

### Requirement: One project may host web, server, and Prisma Postgres resources

When any application targets Prisma, the stack SHALL create one reusable Prisma project with `createDatabase: false`. A Prisma Postgres selection SHALL add its database to that same project rather than creating a second project.

#### Scenario: Web and server both use Prisma

- **WHEN** both planes target Prisma
- **THEN** both application resources SHALL depend on the same project
- **AND** stack outputs SHALL include both URLs

### Requirement: Mixed Alchemy deployments preserve cross-plane URLs

Cloudflare and Prisma planes SHALL be composable in either direction. The web build and runtime SHALL receive the deployed server URL as an Alchemy Output with an explicit dependency edge.

#### Scenario: Cloudflare web with Prisma server

- **WHEN** the server targets Prisma and the web targets Cloudflare
- **THEN** the server resource SHALL be yielded before the web resource
- **AND** the framework public server variable SHALL use the deployed Prisma URL

#### Scenario: Prisma web with Cloudflare server

- **WHEN** the server targets Cloudflare and the web targets Prisma
- **THEN** the Prisma build, runtime, and development environments SHALL receive the Cloudflare server URL

### Requirement: Prisma deployment preserves build-time and runtime environment boundaries

Application secrets and database values SHALL be runtime environment values. Framework-public values required during compilation SHALL be provided to both build and runtime as appropriate.

#### Scenario: Public and private deployment values

- **WHEN** Prisma deploys an application with framework-public configuration and runtime secrets
- **THEN** public configuration SHALL be available to the production build and runtime
- **AND** secrets and database credentials SHALL be supplied only to the runtime

### Requirement: Prisma deployment uses the common Alchemy lifecycle

Generated Prisma projects SHALL expose the same root `dev`, `deploy`, and `destroy` workflow as Cloudflare projects, and `packages/infra` SHALL typecheck independently.

#### Scenario: Local development scripts

- **WHEN** a Prisma target is selected
- **THEN** the app's original development command SHALL be retained as `dev:bare`
- **AND** the root app-specific development script SHALL call `dev:bare`
- **AND** the root aggregate `dev` command SHALL start Alchemy exactly once

### Requirement: Released framework packagers define the available Cloudflare matrix

The CLI SHALL reject a Cloudflare web combination when its released framework packager cannot
produce a deployable artifact. The rejection SHALL be scoped to the broken combination and SHALL
not disable a database provider or addon for unaffected frontends and deployment targets.

#### Scenario: Next.js omits node-postgres runtime files

- **WHEN** a generic PostgreSQL Prisma setup is selected with Next.js on Cloudflare while OpenNext omits `pg-cloudflare`'s workerd files
- **THEN** configuration validation SHALL fail before files are written
- **AND** Neon, Prisma Postgres, other supported Cloudflare frontends, and non-Cloudflare targets SHALL remain available

### Requirement: Nuxt Cloudflare Prisma emits one database runtime graph

Nuxt server-side oRPC calls with Prisma on Cloudflare SHALL execute through Nitro's in-process RPC
route rather than importing the database-backed router into the page renderer. The resulting Worker
SHALL contain one Prisma WASM module and fit the documented Cloudflare free-plan compressed Worker
limit for the generated baseline.

#### Scenario: Build a Nuxt Prisma Worker

- **WHEN** a generated Nuxt self-backend Prisma project builds for Cloudflare
- **THEN** server-side oRPC calls SHALL use the request event's internal fetch against `/rpc`
- **AND** the Cloudflare artifact SHALL contain one Prisma WASM module
- **AND** Wrangler dry-run SHALL report a compressed upload below 3 MiB
