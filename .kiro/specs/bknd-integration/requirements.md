# Requirements Document

## Introduction

This feature will integrate bknd.io as a backend option in the better-t-stack CLI, allowing users to choose bknd as their backend solution alongside existing options like Hono, Express, Fastify, Elysia, Next.js, and Convex. bknd.io is a lightweight, infrastructure-agnostic backend that provides instant REST APIs, authentication, media management, and workflow automation with a powerful admin UI. Like better-auth, bknd is a framework-agnostic solution that plugs into existing applications rather than requiring a separate server setup.

## Requirements

### Requirement 1

**User Story:** As a developer using better-t-stack, I want to select bknd as my backend option during project setup, so that I can leverage its instant API generation and admin UI capabilities.

#### Acceptance Criteria

1. WHEN the user runs the CLI setup THEN bknd should appear as a backend option in the backend selection prompt alongside Hono, Express, Fastify, Elysia, Next.js, and Convex
2. WHEN the user selects bknd as backend THEN the CLI should skip the traditional database and ORM selection prompts since bknd handles these internally
3. WHEN the user selects bknd as backend THEN the CLI should prompt for bknd-specific database configuration (SQLite file, in-memory, Turso, PostgreSQL, etc.)
4. WHEN the user completes bknd setup THEN the necessary bknd dependencies should be added to the appropriate package.json files based on the selected frontends

### Requirement 2

**User Story:** As a developer, I want the CLI to generate framework-specific bknd integration code using Handlebars templates, so that I can start using bknd immediately without manual configuration.

#### Acceptance Criteria

1. WHEN the user selects Next.js frontend with bknd THEN Next.js-specific bknd integration code should be generated including catch-all API routes ([...bknd]/route.ts), helper functions, and admin UI pages
2. WHEN the user selects TanStack Router or React Router with bknd THEN appropriate bknd client setup, API integration, and route configuration should be generated
3. WHEN the user selects React Native (NativeWind or Unistyles) with bknd THEN mobile-specific bknd client configuration should be generated with proper API base URL handling
4. WHEN the user selects Nuxt, Svelte, or SolidJS with bknd THEN framework-specific bknd integration should be generated using their respective adapter patterns
5. WHEN multiple frontends are selected with bknd THEN each should receive appropriate integration code without conflicts

### Requirement 3

**User Story:** As a developer, I want the CLI to set up bknd database connections and configuration files based on my preferences and runtime environment, so that I can use my preferred database without additional configuration.

#### Acceptance Criteria

1. WHEN the user selects bknd THEN a bknd.config.ts file should be generated with appropriate database connection configuration using Handlebars templates
2. WHEN the user selects SQLite with bknd THEN file-based SQLite configuration should be generated with appropriate file paths
3. WHEN the user selects PostgreSQL with bknd THEN PostgreSQL connection setup should be generated with @bknd/postgres dependency
4. WHEN the user selects Turso/LibSQL with bknd THEN Turso configuration should be generated with auth token handling
5. WHEN database configuration is generated THEN appropriate environment variables should be documented in .env.example files

### Requirement 4

**User Story:** As a developer, I want the CLI to generate bknd client integration code for each selected frontend framework, so that I can immediately start making API calls and using bknd features.

#### Acceptance Criteria

1. WHEN bknd is selected THEN bknd client setup code should be generated for each frontend framework using their specific patterns (similar to better-auth client setup)
2. WHEN bknd is selected THEN example API usage should be generated showing how to perform CRUD operations with bknd's data API
3. WHEN authentication is enabled with bknd THEN auth integration examples should be generated showing login/logout flows
4. WHEN media handling is enabled with bknd THEN media upload components should be generated using bknd's media API
5. WHEN examples are selected (todo, ai) THEN bknd-specific implementations should be generated replacing traditional database operations

### Requirement 5

**User Story:** As a developer, I want the CLI to handle bknd's unique architecture where it integrates directly into frontend frameworks rather than requiring a separate server, so that the generated project structure is optimized for bknd.

#### Acceptance Criteria

1. WHEN bknd is selected as backend THEN no separate server app should be generated since bknd integrates directly into frontend frameworks
2. WHEN bknd is selected THEN the database and ORM selection should be skipped since bknd provides its own data layer
3. WHEN bknd is selected THEN API selection (tRPC/oRPC) should still be available for additional API layers on top of bknd
4. WHEN bknd is selected with tRPC THEN examples should show how to use bknd API within tRPC procedures
5. WHEN bknd is selected THEN the project structure should be optimized for frontend-centric development with bknd as an embedded backend

### Requirement 6

**User Story:** As a developer, I want the CLI to follow the same template and dependency management patterns used for better-auth integration, so that bknd integration feels consistent with the rest of the better-t-stack ecosystem.

#### Acceptance Criteria

1. WHEN bknd is selected THEN dependencies should be added to appropriate package.json files using the same addPackageDependency utility used for better-auth
2. WHEN bknd templates are generated THEN they should use Handlebars (.hbs) templates with conditional logic similar to better-auth templates
3. WHEN bknd configuration is generated THEN it should follow the same convention-over-configuration approach as better-auth
4. WHEN bknd setup completes THEN the CLI should provide clear next steps including how to access the admin UI and relevant documentation links
5. WHEN bknd is selected THEN environment variable handling should follow the same patterns as better-auth (BETTER_AUTH_SECRET → BKND_SECRET, etc.)