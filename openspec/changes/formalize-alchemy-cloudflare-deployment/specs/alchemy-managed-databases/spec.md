## ADDED Requirements

### Requirement: Database ownership follows the consuming application plane

Neon, PlanetScale, and Prisma Postgres SHALL be provisioned by Alchemy only when the deployment that runs the database-consuming application is also an Alchemy target. For `backend: self`, the web deployment SHALL own the database. For a separate backend, the server deployment SHALL own it.

#### Scenario: Full-stack web owns its database

- **WHEN** `backend` is `self`, `dbSetup` is an Alchemy database setup, and `webDeploy` is Cloudflare or Prisma
- **THEN** the generated Alchemy stack SHALL provision the selected database
- **AND** provider-specific CLI setup SHALL be skipped

#### Scenario: Separate server uses another provider

- **WHEN** a Prisma web deployment is paired with a separate Vercel server that consumes Neon
- **THEN** Alchemy SHALL NOT provision Neon
- **AND** the generated application SHALL retain external `DATABASE_URL` configuration

### Requirement: Managed providers use runtime-safe credentials

The generated database resource SHALL expose least-privilege or pooled credentials to the application and a direct or elevated credential only to the deploy-time migration command.

#### Scenario: Neon credentials

- **WHEN** Neon is managed
- **THEN** the pooled connection URI SHALL be the application `DATABASE_URL`
- **AND** the direct connection URI SHALL be used only for migrations
- **AND** both SHALL remain redacted Alchemy Outputs

#### Scenario: PlanetScale Postgres credentials

- **WHEN** PlanetScale Postgres is managed
- **THEN** the runtime role SHALL inherit read/write data roles
- **AND** Prisma migrations SHALL use a separate short-lived role inheriting `postgres`

#### Scenario: PlanetScale MySQL credentials

- **WHEN** PlanetScale MySQL with Prisma is managed
- **THEN** runtime credentials SHALL use the `readwriter` role
- **AND** migrations SHALL use a separate short-lived `admin` password
- **AND** connection URLs SHALL be formed through Output mapping without revealing secrets

### Requirement: Prisma Postgres resources are explicit

Managed Prisma Postgres SHALL create one Prisma project, one database, and one connection. An absent application URL SHALL fail with a descriptive error at the provider boundary, and the direct URL SHALL be preferred for migrations when available.

#### Scenario: Prisma Postgres URL resolution

- **WHEN** the Prisma connection resolves
- **THEN** its optional provider output SHALL be narrowed once in `alchemy.run.ts`
- **AND** Cloudflare and Prisma application resources SHALL receive a required typed value

### Requirement: Deployments apply source-controlled migrations

Managed database deployment SHALL apply checked-in migrations after provisioning and before application deployment can complete.

#### Scenario: Prisma ORM migrations

- **WHEN** Prisma ORM is selected
- **THEN** generated Better Auth or Todo models SHALL include an initial migration
- **AND** Alchemy SHALL run `prisma migrate deploy` through `Command.Exec`
- **AND** command memoization SHALL include Prisma schema and migration files

#### Scenario: Drizzle migrations on Neon or PlanetScale

- **WHEN** Drizzle is selected with Neon or PlanetScale
- **THEN** the provider resource SHALL receive `packages/db/src/migrations`
- **AND** the README SHALL instruct the user to generate and commit SQL before deployment

#### Scenario: Drizzle migrations on Prisma Postgres

- **WHEN** Drizzle is selected with Prisma Postgres
- **THEN** Alchemy SHALL run `drizzle-kit migrate` through the package's `db:migrate:deploy` script
- **AND** memoization SHALL include Drizzle schema and migration files

### Requirement: Cloudflare bindings preserve precise environment inference

Managed database values passed to Cloudflare SHALL be individual Effect inputs in a statically shaped binding object. The implementation SHALL NOT wrap the complete Worker or Website props in an Effect solely to obtain database values.

#### Scenario: Mixed Prisma web and Cloudflare server

- **WHEN** a Cloudflare server receives an Alchemy-managed `DATABASE_URL`
- **THEN** `Cloudflare.InferEnv` SHALL infer `DATABASE_URL` as a string
- **AND** shared auth, API, and database packages SHALL typecheck without casts

### Requirement: Managed database setup uses the Alchemy lifecycle

The user-facing flow SHALL use `alchemy login --configure`, root development, deployment, and destruction commands. Generated instructions SHALL state that provider-specific setup is unnecessary.

#### Scenario: PlanetScale cost notice

- **WHEN** PlanetScale is selected
- **THEN** the resource SHALL default to `PS_DEV`
- **AND** generated CLI and README guidance SHALL warn that the database may incur charges
