# Implementation Plan

- [ ] 1. Set up core bknd integration infrastructure
  - Add bknd as a backend option to the CLI type system
  - Create bknd-specific prompt handling
  - Set up basic dependency management for bknd
  - _Requirements: 1.1, 1.4_

- [ ] 1.1 Extend CLI types to include bknd backend option
  - Modify `BackendSchema` in `apps/cli/src/types.ts` to include "bknd"
  - Add `BkndDatabaseSchema` enum for bknd-specific database options
  - Extend `ProjectConfig` interface to include `bkndDatabase` field
  - _Requirements: 1.1_

- [ ] 1.2 Add bknd to backend selection prompt
  - Modify `apps/cli/src/prompts/backend.ts` to include bknd option
  - Add appropriate hint text describing bknd capabilities
  - Ensure bknd appears in correct position among backend options
  - _Requirements: 1.1_

- [ ] 1.3 Create bknd database configuration prompt
  - Create new file `apps/cli/src/prompts/bknd-database.ts`
  - Implement prompt for bknd-specific database selection (SQLite, PostgreSQL, Turso, D1, memory)
  - Add conditional logic to show appropriate options based on runtime
  - _Requirements: 1.3, 3.2, 3.3, 3.4_

- [ ] 1.4 Add bknd dependencies to version map
  - Update `dependencyVersionMap` in `apps/cli/src/constants.ts`
  - Add bknd core package and adapter-specific packages
  - Include database-specific packages (@bknd/postgres, @bknd/sqlocal)
  - _Requirements: 1.4_

- [ ] 2. Implement bknd setup handler and logic
  - Create main bknd setup handler
  - Implement logic to skip database/ORM prompts when bknd is selected
  - Add dependency installation logic for different frontend combinations
  - _Requirements: 1.2, 5.2, 6.1_

- [ ] 2.1 Create bknd setup handler
  - Create new file `apps/cli/src/helpers/setup/bknd-setup.ts`
  - Implement `setupBknd` function following better-auth pattern
  - Add logic to install bknd dependencies to appropriate package.json files
  - Handle different frontend combinations (web, native, multiple frontends)
  - _Requirements: 1.4, 6.1_

- [ ] 2.2 Modify main setup flow to handle bknd
  - Update project generation logic to skip database/ORM prompts when bknd is selected
  - Integrate bknd setup into main project creation flow
  - Ensure bknd setup runs at appropriate time in the setup sequence
  - _Requirements: 1.2, 5.2_

- [ ] 2.3 Update project structure logic for bknd
  - Modify project structure generation to skip server app creation when bknd is selected
  - Ensure frontend apps are properly configured for bknd integration
  - Handle monorepo structure optimization for bknd-based projects
  - _Requirements: 5.1, 5.5_

- [ ] 3. Create bknd configuration templates
  - Implement main bknd.config.ts template with database connection handling
  - Add environment variable templates
  - Create framework-specific configuration variations
  - _Requirements: 3.1, 3.5, 6.3_

- [ ] 3.1 Create main bknd configuration template
  - Create `apps/cli/templates/bknd/config/bknd.config.ts.hbs`
  - Implement Handlebars template with conditional database configuration
  - Add support for SQLite, PostgreSQL, Turso, and D1 configurations
  - Include authentication configuration when auth is enabled
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 3.2 Create environment variable templates
  - Create `.env.example.hbs` template for bknd projects
  - Include database connection variables
  - Add bknd-specific environment variables (BKND_SECRET, etc.)
  - Document required vs optional variables
  - _Requirements: 3.5, 6.5_

- [ ] 3.3 Add initial data structure templates
  - Create templates for example entity definitions using bknd's entity manager
  - Add example schema setup for todo and other examples
  - Include relationship and index definitions
  - _Requirements: 4.2, 4.5_

- [ ] 4. Implement Next.js bknd integration templates
  - Create Next.js-specific bknd integration code
  - Add API route handlers and admin UI pages
  - Implement bknd client setup for Next.js
  - _Requirements: 2.1, 4.1_

- [ ] 4.1 Create Next.js API route templates
  - Create `apps/cli/templates/bknd/web/next/src/app/api/[...bknd]/route.ts.hbs`
  - Implement catch-all API route handler using bknd Next.js adapter
  - Add proper TypeScript types and error handling
  - _Requirements: 2.1_

- [ ] 4.2 Create Next.js admin UI template
  - Create `apps/cli/templates/bknd/web/next/src/app/admin/[[...admin]]/page.tsx.hbs`
  - Implement admin UI page using bknd's Admin component
  - Add proper authentication and configuration
  - _Requirements: 2.1_

- [ ] 4.3 Create Next.js bknd client helper
  - Create `apps/cli/templates/bknd/web/next/src/lib/bknd.ts.hbs`
  - Implement helper functions for bknd app and API access
  - Add proper TypeScript types and Next.js-specific configuration
  - _Requirements: 2.1, 4.1_

- [ ] 4.4 Create Next.js middleware template (if needed)
  - Create `apps/cli/templates/bknd/web/next/middleware.ts.hbs`
  - Add authentication middleware if auth is enabled
  - Handle route protection and redirects
  - _Requirements: 4.3_

- [ ] 5. Implement React Router and TanStack Router integration
  - Create React Router specific bknd templates
  - Add TanStack Router bknd integration
  - Implement shared React client setup
  - _Requirements: 2.2, 4.1_

- [ ] 5.1 Create shared React bknd client template
  - Create `apps/cli/templates/bknd/web/react/base/src/lib/bknd-client.ts.hbs`
  - Implement bknd client setup following better-auth pattern
  - Add proper environment variable handling for different React frameworks
  - _Requirements: 2.2, 4.1_

- [ ] 5.2 Create React Router API route template
  - Create `apps/cli/templates/bknd/web/react/react-router/src/routes/api.$.ts.hbs`
  - Implement splat route for bknd API handling
  - Add proper loader and action handlers
  - _Requirements: 2.2_

- [ ] 5.3 Create TanStack Router API route template
  - Create `apps/cli/templates/bknd/web/react/tanstack-router/src/routes/api/$.ts.hbs`
  - Implement catch-all route for bknd API
  - Add proper route configuration and handlers
  - _Requirements: 2.2_

- [ ] 5.4 Create React admin UI templates
  - Create admin UI templates for both React Router and TanStack Router
  - Implement lazy loading and proper component structure
  - Add authentication handling and route protection
  - _Requirements: 2.2_

- [ ] 6. Add React Native bknd integration
  - Create React Native bknd client templates
  - Handle mobile-specific API base URL configuration
  - Add proper TypeScript types for mobile usage
  - _Requirements: 2.3, 4.1_

- [ ] 6.1 Create React Native bknd client templates
  - Create `apps/cli/templates/bknd/native/nativewind/lib/bknd-client.ts.hbs`
  - Create `apps/cli/templates/bknd/native/unistyles/lib/bknd-client.ts.hbs`
  - Implement mobile-specific bknd client configuration
  - Handle API base URL configuration for mobile development
  - _Requirements: 2.3, 4.1_

- [ ] 6.2 Add React Native example components
  - Create example components showing bknd usage in React Native
  - Add authentication flow examples
  - Include data fetching and mutation examples
  - _Requirements: 4.2, 4.3_

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