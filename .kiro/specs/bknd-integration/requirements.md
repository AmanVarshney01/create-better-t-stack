# Requirements Document

## Introduction

This feature will integrate `bknd` as a Backend-as-a-Service (BaaS) option in the better-t-stack CLI, similar to how Convex is integrated. `bknd` is a plug-n-play solution that provides most backend functionality including auth, database, APIs, ORM, admin UI, user management, and email capabilities. Like Convex, `bknd` is a comprehensive backend solution that still needs frontend frameworks, package managers, and can benefit from add-on features. This integration will allow developers to scaffold full-stack applications with `bknd` as the backend foundation while maintaining better-t-stack's philosophy of making it easy to create great web applications with minimal configuration.

## Requirements

### Requirement 1

**User Story:** As a developer using better-t-stack, I want to select bknd as my backend option during project setup, so that I can leverage its comprehensive backend capabilities including built-in auth, database, ORM, and admin UI.

#### Acceptance Criteria

1. WHEN the user runs the CLI setup THEN bknd SHALL appear as a backend option in the backend selection prompt alongside Hono, Express, Fastify, Elysia, Next.js, and Convex
2. WHEN the user selects bknd as backend THEN the ORM selection SHALL be automatically set to "None" since bknd has its own built-in ORM
3. WHEN the user selects bknd as backend THEN the auth selection SHALL be automatically disabled and set to "None" since bknd comes with its own auth system
4. WHEN the user selects bknd as backend THEN the API selection SHALL be automatically disabled and set to "No API" since bknd's apis are type-safe already.
5. WHEN the user selects bknd as backend THEN MySQL and MongoDB database options SHALL be disabled since bknd only supports SQLite, libSQL (a variant of SQLite), and PostgreSQL

### Requirement 2

**User Story:** As a developer, I want the CLI to generate framework-specific bknd integration code for supported frontend frameworks, so that I can start using bknd immediately without manual configuration.

#### Acceptance Criteria

1. WHEN the user selects Next.js frontend with bknd THEN the system SHALL generate Next.js-specific bknd integration code including API routes, client setup, and configuration
2. WHEN the user selects React Router frontend with bknd THEN the system SHALL generate React Router-specific bknd client setup and integration
3. WHEN the user selects TanStack Start frontend with bknd THEN the system SHALL generate TanStack Start-specific bknd integration using Vite plugin patterns
4. WHEN the user selects unsupported frontend frameworks (Nuxt, Svelte, SolidJS) with bknd THEN the CLI SHALL display a warning that bknd integration is not yet supported for these frameworks
5. WHEN bknd is selected THEN framework-specific templates SHALL be generated using Handlebars with appropriate conditional logic

### Requirement 3

**User Story:** As a developer, I want the CLI to set up bknd configuration files with database provider options that bknd supports, so that I can choose my preferred database setup within bknd's capabilities.

#### Acceptance Criteria

1. WHEN the user selects bknd THEN the system SHALL generate a bknd configuration file with database provider selection prompts for SQLite, libSQL (Turso), and PostgreSQL options
2. WHEN the user chooses SQLite with bknd THEN the system SHALL generate bknd configuration with SQLite database setup
3. WHEN the user chooses PostgreSQL-based providers (PostgreSQL, Neon, Supabase, PlanetScale) with bknd THEN the system SHALL generate bknd configuration with PostgreSQL connection setup
4. WHEN the user chooses Turso with bknd THEN the system SHALL generate bknd configuration with libSQL/Turso connection setup
5. WHEN MySQL or MongoDB are selected with bknd THEN the CLI SHALL display a warning that these databases are not supported by bknd and suggest compatible alternatives
6. WHEN bknd database configuration is generated THEN appropriate environment variables SHALL be documented in .env.example files
7. IF D1 is selected with bknd THEN the runtime MUST be Cloudflare Workers for compatibility

### Requirement 4

**User Story:** As a developer, I want the CLI to generate bknd client integration code and examples for supported frontend frameworks, so that I can immediately start using bknd's comprehensive backend features. (Examples can be found on https://docs.bknd.io/integration/introduction)

#### Acceptance Criteria

1. WHEN bknd is selected THEN the system SHALL generate bknd client setup code for supported frontend frameworks using their specific integration patterns
2. WHEN bknd is selected THEN the system SHALL generate example API usage showing how to perform CRUD operations using bknd's built-in data API
3. WHEN bknd is selected THEN the system SHALL generate authentication examples showing login/logout flows using bknd's built-in auth system
4. WHEN bknd is selected THEN the system SHALL generate media handling examples demonstrating bknd's storage and media capabilities
5. WHEN examples are selected (todo, ai chat) THEN the system SHALL generate bknd-specific implementations that utilize bknd's APIs instead of traditional database operations
6. WHEN bknd is selected THEN the system SHALL generate admin UI access examples showing how to leverage bknd's built-in admin interface
7. WHEN bknd is selected with email driver THEN the system SHALL generate email integration examples using bknd's Resend email driver

### Requirement 5

**User Story:** As a developer, I want the CLI to follow consistent patterns with other better-t-stack integrations like better-auth and Convex, so that bknd integration feels familiar and maintains the same quality standards.

#### Acceptance Criteria

1. WHEN bknd is selected THEN dependencies SHALL be added to appropriate package.json files using the same addPackageDependency utility used for other integrations
2. WHEN bknd templates are generated THEN they SHALL use Handlebars (.hbs) templates with conditional logic similar to better-auth and Convex templates
3. WHEN bknd configuration is generated THEN it SHALL follow the same convention-over-configuration approach as other better-t-stack integrations
4. WHEN bknd setup completes THEN the CLI SHALL provide clear next steps including how to access bknd's admin UI, documentation links, and integration examples
5. WHEN bknd is selected THEN environment variable handling SHALL follow established better-t-stack patterns with appropriate naming conventions
6. WHEN bknd is selected THEN the integration SHALL maintain the same level of type safety and developer experience as other better-t-stack components