# Implementation Plan

- [-] 1. Set up core bknd integration infrastructure
  - Add bknd as a backend option to the CLI type system
  - Create bknd-specific prompt handling and configuration logic
  - Set up basic dependency management for bknd
  - _Requirements: 1.1, 1.4_

- [x] 1.1 Extend CLI types to include bknd backend option
  - Modify `BackendSchema` in `apps/cli/src/types.ts` to include "bknd"
  - Add `BkndDatabaseSchema` and `BkndDatabase` type for bknd-specific database options
  - Add `bkndDatabase` field to `CreateInput` and `ProjectConfig` interfaces
  - _Requirements: 1.1_

- [x] 1.2 Add bknd to backend selection prompt
  - Modify `apps/cli/src/prompts/backend.ts` to include bknd option
  - Add appropriate hint text describing bknd capabilities
  - Ensure bknd appears in correct position among backend options
  - _Requirements: 1.1_

- [x] 1.3 Create bknd database configuration prompt
  - Create new file `apps/cli/src/prompts/bknd-database.ts`
  - Implement `getBkndDatabaseChoice` function for bknd-specific database selection
  - Support SQLite, PostgreSQL, Turso, D1, and memory options
  - Add conditional logic to show D1 only when runtime is "workers"
  - _Requirements: 1.3, 3.2, 3.3, 3.4_

- [ ] 1.4 Update config gathering logic to handle bknd
  - Modify `apps/cli/src/prompts/config-prompts.ts` to add bkndDatabase prompt
  - Add bkndDatabase to the prompt group results and config gathering flow
  - Add post-processing logic similar to Convex to set appropriate defaults when bknd is selected
  - Ensure bknd bypasses traditional database/ORM/API prompts like Convex does
  - _Requirements: 1.2, 5.2_

- [ ] 1.5 Add bknd dependencies to version map
  - Update `dependencyVersionMap` in `apps/cli/src/constants.ts`
  - Add bknd core package and framework-specific adapter packages
  - Include database-specific packages for different bknd database options
  - _Requirements: 1.4_

- [ ] 2. Implement bknd template system and setup logic
  - Create bknd template directory structure following Convex pattern
  - Implement bknd setup handler for dependency management
  - Update project generation flow to handle bknd like Convex
  - _Requirements: 1.2, 5.2, 6.1_

- [ ] 2.1 Create bknd template directory structure
  - Create `apps/cli/templates/backend/bknd/` directory structure
  - Set up base templates for bknd configuration files
  - Create framework-specific subdirectories for different frontend integrations
  - Follow the same pattern as `templates/backend/convex/`
  - _Requirements: 6.1, 6.3_

- [ ] 2.2 Update project generation logic for bknd
  - Modify `apps/cli/src/helpers/project-generation/template-manager.ts` to handle bknd
  - Add bknd-specific template processing similar to Convex handling
  - Ensure bknd projects skip server app creation and use bknd templates instead
  - _Requirements: 5.1, 5.2_

- [ ] 2.3 Update setup handlers to skip traditional backend setup for bknd
  - Modify `apps/cli/src/helpers/setup/backend-setup.ts` to skip setup when backend is bknd
  - Update `apps/cli/src/helpers/setup/db-setup.ts` to skip database setup for bknd
  - Modify `apps/cli/src/helpers/setup/auth-setup.ts` to skip Better-Auth setup for bknd
  - Update `apps/cli/src/helpers/setup/api-setup.ts` to handle bknd-specific API setup
  - _Requirements: 1.2, 5.2_

- [ ] 3. Create core bknd configuration templates
  - Implement main bknd.config.ts template with database connection handling
  - Add environment variable templates
  - Create shared configuration files for bknd projects
  - _Requirements: 3.1, 3.5, 6.3_

- [ ] 3.1 Create main bknd configuration template
  - Create `apps/cli/templates/backend/bknd/bknd.config.ts.hbs`
  - Implement Handlebars template with conditional database configuration
  - Add support for SQLite, PostgreSQL, Turso, and D1 configurations
  - Include authentication configuration and entity definitions
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 3.2 Create environment variable templates
  - Create `apps/cli/templates/backend/bknd/.env.example.hbs`
  - Include database connection variables based on selected bknd database
  - Add bknd-specific environment variables (BKND_SECRET, etc.)
  - Document required vs optional variables with comments
  - _Requirements: 3.5, 6.5_

- [ ] 3.3 Create package.json template for bknd backend
  - Create `apps/cli/templates/backend/bknd/package.json.hbs`
  - Include bknd dependencies and database-specific packages
  - Add appropriate scripts for bknd development and deployment
  - Follow the same pattern as Convex package.json template
  - _Requirements: 1.4, 6.1_

- [ ] 4. Implement frontend framework integration templates
  - Create framework-specific bknd integration templates
  - Add API route handlers and client setup for each framework
  - Implement admin UI integration for supported frameworks
  - _Requirements: 2.1, 4.1_

- [ ] 4.1 Create Next.js bknd integration templates
  - Create `apps/cli/templates/frontend/next/api/[...bknd]/route.ts.hbs`
  - Create `apps/cli/templates/frontend/next/admin/[[...admin]]/page.tsx.hbs`
  - Create `apps/cli/templates/frontend/next/lib/bknd.ts.hbs`
  - Add middleware template if needed for authentication
  - _Requirements: 2.1_

- [ ] 4.2 Create React Router bknd integration templates
  - Create `apps/cli/templates/frontend/react-router/routes/api.$.ts.hbs`
  - Create `apps/cli/templates/frontend/react-router/routes/admin.$.tsx.hbs`
  - Create `apps/cli/templates/frontend/react-router/lib/bknd.ts.hbs`
  - Add proper loader and action handlers for React Router
  - _Requirements: 2.2_

- [ ] 4.3 Create TanStack Router bknd integration templates
  - Create `apps/cli/templates/frontend/tanstack-router/routes/api/$.ts.hbs`
  - Create `apps/cli/templates/frontend/tanstack-router/routes/admin/$.tsx.hbs`
  - Create `apps/cli/templates/frontend/tanstack-router/lib/bknd.ts.hbs`
  - Add proper route configuration and handlers
  - _Requirements: 2.2_

- [ ] 4.4 Create additional framework templates
  - Create Nuxt.js bknd integration templates (`server/api/[...bknd].ts.hbs`)
  - Create Svelte bknd integration templates (`routes/api/[...bknd]/+server.ts.hbs`)
  - Create SolidJS bknd integration templates (`routes/api/[...bknd].ts.hbs`)
  - Add framework-specific client setup and admin UI templates
  - _Requirements: 2.4_

- [ ] 5. Implement React Native bknd integration
  - Create React Native bknd client templates
  - Handle mobile-specific API configuration
  - Add proper TypeScript types for mobile usage
  - _Requirements: 2.3, 4.1_

- [ ] 5.1 Create React Native bknd client templates
  - Create `apps/cli/templates/frontend/native-nativewind/lib/bknd.ts.hbs`
  - Create `apps/cli/templates/frontend/native-unistyles/lib/bknd.ts.hbs`
  - Implement mobile-specific bknd client configuration
  - Handle API base URL configuration for mobile development
  - _Requirements: 2.3, 4.1_

- [ ] 5.2 Add React Native example components
  - Create example components showing bknd usage in React Native
  - Add authentication flow examples
  - Include data fetching and mutation examples
  - _Requirements: 4.2, 4.3_

- [ ] 6. Implement bknd dependency management and setup
  - Create bknd-specific dependency installation logic
  - Add bknd setup handler following Convex pattern
  - Update API setup to handle bknd dependencies
  - _Requirements: 1.4, 6.1_

- [ ] 6.1 Create bknd dependency installation logic
  - Update `apps/cli/src/helpers/setup/api-setup.ts` to handle bknd dependencies
  - Add bknd package installation for web and native apps
  - Include framework-specific bknd adapter packages
  - Follow the same pattern as Convex dependency management
  - _Requirements: 1.4, 6.1_

- [ ] 6.2 Add bknd to environment variable setup
  - Update `apps/cli/src/helpers/project-generation/env-setup.ts` to handle bknd
  - Add bknd-specific environment variables (BKND_URL, etc.)
  - Handle different frontend framework environment variable naming
  - _Requirements: 3.5, 6.5_

- [ ] 7. Implement additional framework support
  - Add Nuxt.js bknd integration
  - Create Svelte bknd templates
  - Add SolidJS support
  - _Requirements: 2.4_

- [ ] 7.1 Create Nuxt.js bknd integration
  - Create `apps/cli/templates/bknd/web/nuxt/server/api/[...bknd].ts.hbs`
  - Add Nuxt plugin for bknd client setup
  - Create admin UI page template for Nuxt
  - _Requirements: 2.4_

- [ ] 7.2 Create Svelte bknd integration
  - Create `apps/cli/templates/bknd/web/svelte/src/routes/api/[...bknd]/+server.ts.hbs`
  - Add Svelte bknd client setup
  - Create admin UI route template
  - _Requirements: 2.4_

- [ ] 7.3 Create SolidJS bknd integration
  - Create `apps/cli/templates/bknd/web/solid/src/routes/api/[...bknd].ts.hbs`
  - Add SolidJS bknd client configuration
  - Create admin UI route template
  - _Requirements: 2.4_

- [ ] 8. Add authentication and media integration
  - Create authentication flow templates
  - Add media upload component templates
  - Integrate with bknd's auth and media APIs
  - _Requirements: 4.3, 4.4_

- [ ] 8.1 Create authentication templates
  - Add login/logout flow examples for each framework
  - Create authentication middleware templates
  - Add user session handling examples
  - _Requirements: 4.3_

- [ ] 8.2 Create media handling templates
  - Add file upload component templates
  - Create media gallery examples
  - Add image optimization and handling examples
  - _Requirements: 4.4_

- [ ] 9. Implement example templates (todo, ai)
  - Create bknd-specific todo app implementation
  - Add AI chat example using bknd
  - Replace traditional database operations with bknd API calls
  - _Requirements: 4.5_

- [ ] 9.1 Create bknd todo example templates
  - Modify existing todo templates to use bknd instead of traditional database
  - Add entity definitions for todo items
  - Update CRUD operations to use bknd data API
  - _Requirements: 4.5_

- [ ] 9.2 Create bknd AI example templates
  - Modify AI chat templates to use bknd for data persistence
  - Add chat history storage using bknd entities
  - Update AI integration to work with bknd backend
  - _Requirements: 4.5_

- [ ] 10. Add tRPC integration support
  - Create examples showing bknd usage within tRPC procedures
  - Add proper type safety between bknd and tRPC
  - Handle authentication flow between both systems
  - _Requirements: 5.3, 5.4_

- [ ] 10.1 Create tRPC + bknd integration examples
  - Add tRPC procedure examples that use bknd API internally
  - Show how to combine bknd's instant API with custom tRPC procedures
  - Add proper error handling and type safety
  - _Requirements: 5.3, 5.4_

- [ ] 10.2 Add authentication bridge between tRPC and bknd
  - Create middleware to share authentication between tRPC and bknd
  - Add examples of protected tRPC procedures using bknd auth
  - Handle session management across both systems
  - _Requirements: 5.4_

- [ ] 11. Add comprehensive testing and validation
  - Create unit tests for bknd integration logic
  - Add template compilation tests
  - Implement end-to-end integration tests
  - _Requirements: 6.2, 6.4_

- [ ] 11.1 Create unit tests for bknd setup logic
  - Test bknd backend selection and database configuration
  - Validate dependency installation logic
  - Test template variable substitution
  - _Requirements: 6.2_

- [ ] 11.2 Add template validation tests
  - Ensure all Handlebars templates compile correctly
  - Validate generated TypeScript code syntax
  - Test conditional logic in templates
  - _Requirements: 6.2_

- [ ] 11.3 Create integration tests
  - Test complete project generation with bknd
  - Validate generated projects can be built and run
  - Test different framework and database combinations
  - _Requirements: 6.4_

- [ ] 12. Add documentation and CLI improvements
  - Create README templates with bknd instructions
  - Add CLI help text and next steps
  - Implement error handling and user guidance
  - _Requirements: 6.3, 6.4_

- [ ] 12.1 Create documentation templates
  - Add bknd-specific sections to README templates
  - Include setup instructions and development commands
  - Add links to bknd documentation and resources
  - _Requirements: 6.4_

- [ ] 12.2 Add CLI completion messages
  - Create success messages with next steps for bknd projects
  - Add information about accessing admin UI
  - Include relevant documentation links
  - _Requirements: 6.3_

- [ ] 12.3 Implement error handling and validation
  - Add validation for bknd configuration options
  - Create helpful error messages for common issues
  - Add recovery options for failed setups
  - _Requirements: 6.3_

- [ ] 12.4 Update CLI documentation and help text
  - Add bknd to the backend options in CLI help text
  - Add `--bknd-database` flag to CLI options
  - Update README.md to include bknd in features table and examples
  - Add compatibility notes for bknd similar to Convex
  - _Requirements: 6.4_