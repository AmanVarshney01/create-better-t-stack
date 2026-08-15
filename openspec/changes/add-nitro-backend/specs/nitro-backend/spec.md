## ADDED Requirements

### Requirement: Nitro backend selection

The system SHALL expose Nitro as an experimental separate-server backend through the interactive CLI, programmatic configuration, JSON schema, generated summaries, and web stack builder.

#### Scenario: Interactive selection

- **WHEN** a user opens the backend prompt for a web or native project
- **THEN** Nitro is available with an experimental label and a description of its native file-routed server model

#### Scenario: Programmatic selection

- **WHEN** a user supplies `backend: "nitro"` through a supported non-interactive interface
- **THEN** validation accepts the value and generated summaries identify the backend as Nitro

### Requirement: Native Nitro project structure

The generator SHALL create a Nitro 3 server using documented standalone project structure and public APIs, without nesting another server framework or adding a compatibility wrapper.

#### Scenario: Generated source layout

- **WHEN** a Nitro project is generated
- **THEN** `apps/server` contains a Nitro config, Nitro TypeScript configuration, native Nitro scripts, and file-based handlers under `server/routes`

#### Scenario: Runtime defaults

- **WHEN** Node or Bun is selected for Nitro
- **THEN** the generated Nitro configuration uses that runtime as its default preset while allowing provider auto-detection to override it

### Requirement: Nitro API and authentication integrations

The generator SHALL implement selected API and authentication integrations at Nitro's Web Request boundary using released public adapters.

#### Scenario: oRPC routes

- **WHEN** Nitro and oRPC are selected
- **THEN** generated RPC and OpenAPI reference routes handle requests through oRPC fetch handlers and receive the shared request context

#### Scenario: tRPC routes

- **WHEN** Nitro and tRPC are selected with a compatible frontend
- **THEN** generated tRPC routes handle requests through the official tRPC fetch adapter and receive the shared request context

#### Scenario: Better Auth route

- **WHEN** Nitro and Better Auth are selected
- **THEN** generated GET and POST requests under `/api/auth` are passed to Better Auth as standard Web Requests

#### Scenario: Clerk context

- **WHEN** Nitro and Clerk are selected
- **THEN** generated API context authenticates the incoming standard Web Request through Clerk's backend client

### Requirement: Existing stack feature compatibility

The system SHALL apply existing frontend, database, ORM, auth, payments, example, and addon compatibility rules to Nitro and SHALL generate the selected supported integrations without backend-specific omissions.

#### Scenario: Database and ORM

- **WHEN** a valid Nitro database and ORM combination is selected
- **THEN** the server can import the generated database package and the generated project installs, typechecks, and builds

#### Scenario: Todo example

- **WHEN** Nitro, an API, a database, and the Todo example are selected
- **THEN** the generated Todo procedures and client calls work through the Nitro API routes

#### Scenario: AI example

- **WHEN** Nitro and a frontend that supports the AI example are selected
- **THEN** Nitro exposes the generated streaming AI route using a standard Web Request and Response

#### Scenario: Unsupported addon

- **WHEN** Nitro is selected with an addon that rewrites only supported framework entrypoints
- **THEN** configuration rejects the addon before files are generated with an actionable reason

### Requirement: Truthful Nitro deployment choices

The system SHALL only offer Nitro deployment targets backed by released provider contracts and SHALL reject unsupported targets during configuration.

#### Scenario: Docker deployment

- **WHEN** Nitro is selected with Node or Bun and Docker deployment
- **THEN** the generated image builds Nitro output and starts `.output/server/index.mjs` with the selected runtime

#### Scenario: Prisma deployment

- **WHEN** Nitro is selected with Prisma deployment
- **THEN** generated Alchemy uses Prisma Compute's documented command-build output and `server/index.mjs` entrypoint

#### Scenario: Vercel deployment

- **WHEN** Nitro is selected with Vercel deployment
- **THEN** generated Vercel Services configuration identifies Nitro and allows Nitro's provider detection to create Vercel output

#### Scenario: Cloudflare deployment

- **WHEN** Nitro is selected with the Workers runtime and Cloudflare server deployment
- **THEN** generated Alchemy builds Nitro's `cloudflare_module` output, deploys `.output/server/index.mjs` as a prebuilt Worker, uploads `.output/public` as assets, and preserves runtime bindings in local and live environments

### Requirement: Nitro verification matrix

The change SHALL include deterministic generated-project verification across package managers and representative feature boundaries, plus live deployment probes where credentials are available.

#### Scenario: Package-manager builds

- **WHEN** verification runs for Bun, npm, and pnpm Nitro fixtures
- **THEN** each fixture installs dependencies, typechecks, builds, starts, and responds successfully on its generated health/API routes

#### Scenario: Provider lifecycle

- **WHEN** a disposable Nitro deployment is created for an authenticated supported provider
- **THEN** verification probes health, API, auth or database routes as applicable and destroys all created resources afterward
