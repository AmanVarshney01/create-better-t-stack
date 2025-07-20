# Implementation Plan

- [x] 1. Set up core bknd integration infrastructure

  - Add bknd as a backend option to the CLI type system
  - Create bknd-specific prompt handling and configuration logic
  - Set up basic dependency management for bknd
  - _Requirements: 1.1, 1.4_

- [x] 1.1 Extend CLI types to include bknd backend option

  - Modify `BackendSchema` in `apps/cli/src/types.ts` to include "bknd"
  - Add backend compatibility and details to constants
  - Update database compatibility to include bknd
  - _Requirements: 1.1_

- [x] 1.2 Add bknd to backend selection prompt

  - Add bknd to `BACKEND_DETAILS` in constants with appropriate hint text
  - Ensure bknd appears in backend selection through existing prompt logic
  - Add bknd to `BACKEND_COMPATIBILITY` with supported frontend frameworks
  - _Requirements: 1.1_

- [x] 1.3 Update database compatibility for bknd

  - Add bknd to `DATABASE_COMPATIBILITY` for SQLite and PostgreSQL
  - Ensure bknd is excluded from MySQL and MongoDB compatibility
  - Add bknd to runtime compatibility in constants
  - _Requirements: 1.5, 3.2, 3.3, 3.4_

- [ ] 1.4 Update config gathering logic to handle bknd

  - Modify `apps/cli/src/prompts/config-prompts.ts` to add post-processing logic for bknd
  - Add bknd handling similar to Convex to set appropriate defaults when bknd is selected
  - Ensure bknd bypasses traditional ORM/API/auth prompts like Convex does
  - _Requirements: 1.2, 1.3, 1.4, 5.2_

- [ ] 1.5 Add bknd dependencies to version map

  - Update `dependencyVersionMap` in `apps/cli/src/constants.ts`
  - Add bknd core package and framework-specific adapter packages
  - Include database-specific packages for different bknd database options
  - _Requirements: 5.1_

- [ ] 2. Implement bknd template system and setup logic

  - Create bknd template directory structure following Convex pattern
  - Update project generation flow to handle bknd like Convex
  - Implement bknd-specific template processing
  - _Requirements: 2.5, 5.2, 5.3_

- [ ] 2.1 Create bknd template directory structure

  - Create `apps/cli/templates/backend/bknd/` directory structure following Convex pattern
  - Set up base templates for bknd configuration files (bknd.config.ts, package.json, .env.example)
  - Create framework-specific subdirectories for different frontend integrations
  - _Requirements: 5.2, 5.3_

- [ ] 2.2 Update project generation logic for bknd

  - Modify `setupBackendFramework` in `apps/cli/src/helpers/project-generation/template-manager.ts`
  - Add bknd-specific template processing similar to Convex handling
  - Ensure bknd projects skip server app creation and create packages/backend instead
  - _Requirements: 5.2_

- [ ] 2.3 Create bknd configuration templates

  - Create `apps/cli/templates/backend/bknd/packages/backend/bknd.config.ts.hbs`
  - Create `apps/cli/templates/backend/bknd/packages/backend/package.json.hbs`
  - Create `apps/cli/templates/backend/bknd/packages/backend/.env.example.hbs`
  - Add conditional logic for different database configurations
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6_

- [ ] 3. Create frontend framework integration templates

  - Implement framework-specific bknd integration templates for Next.js and React Router
  - Add API route handlers and client setup for supported frameworks
  - Create warning templates for unsupported frameworks
  - _Requirements: 2.1, 2.2, 2.4_

- [ ] 3.1 Create Next.js bknd integration templates

  - Create `apps/cli/templates/frontend/next/api/[...bknd]/route.ts.hbs` for API routes
  - Create `apps/cli/templates/frontend/next/admin/[[...admin]]/page.tsx.hbs` for admin UI
  - Create `apps/cli/templates/frontend/next/lib/bknd.ts.hbs` for client setup
  - Add middleware template for authentication if needed
  - _Requirements: 2.1_

- [ ] 3.2 Create React Router bknd integration templates

  - Create `apps/cli/templates/frontend/react-router/routes/api.$.ts.hbs` for API routes
  - Create `apps/cli/templates/frontend/react-router/routes/admin.$.tsx.hbs` for admin UI
  - Create `apps/cli/templates/frontend/react-router/lib/bknd.ts.hbs` for client setup
  - Add proper loader and action handlers for React Router
  - _Requirements: 2.2_

- [ ] 3.3 Create warning templates for unsupported frameworks

  - Create warning templates for Nuxt, Svelte, SolidJS, and TanStack Start
  - Add informative messages about bknd support status
  - Include links to bknd documentation for manual integration
  - _Requirements: 2.4_

- [ ] 4. Implement React Native bknd integration

  - Create React Native bknd client templates for supported native frameworks
  - Handle mobile-specific API configuration
  - Add proper TypeScript types for mobile usage
  - _Requirements: 2.1, 4.1_

- [ ] 4.1 Create React Native bknd client templates

  - Create `apps/cli/templates/frontend/native-nativewind/lib/bknd.ts.hbs`
  - Create `apps/cli/templates/frontend/native-unistyles/lib/bknd.ts.hbs`
  - Implement mobile-specific bknd client configuration
  - Handle API base URL configuration for mobile development
  - _Requirements: 2.1, 4.1_

- [ ] 4.2 Add React Native example components

  - Create example components showing bknd usage in React Native
  - Add authentication flow examples for mobile
  - Include data fetching and mutation examples
  - _Requirements: 4.2, 4.3_

- [ ] 5. Implement bknd dependency management and setup

  - Add bknd dependencies to version map
  - Update template processing to handle bknd dependencies
  - Ensure proper package installation for bknd projects
  - _Requirements: 5.1_

- [ ] 5.1 Add bknd dependencies to version map

  - Update `dependencyVersionMap` in `apps/cli/src/constants.ts`
  - Add bknd core package and framework-specific adapter packages
  - Include database-specific packages for different bknd database options
  - _Requirements: 5.1_

- [ ] 5.2 Update template processing for bknd dependencies

  - Ensure bknd templates include proper dependencies in package.json
  - Add framework-specific bknd adapter packages to appropriate templates
  - Handle database-specific dependencies based on selected database
  - _Requirements: 5.1_

- [ ] 6. Implement example templates (todo, ai)

  - Create bknd-specific todo app implementation
  - Add AI chat example using bknd
  - Replace traditional database operations with bknd API calls
  - _Requirements: 4.5_

- [ ] 6.1 Create bknd todo example templates

  - Modify existing todo templates to use bknd instead of traditional database
  - Add entity definitions for todo items using bknd schema
  - Update CRUD operations to use bknd data API
  - _Requirements: 4.5_

- [ ] 6.2 Create bknd AI example templates

  - Modify AI chat templates to use bknd for data persistence
  - Add chat history storage using bknd entities
  - Update AI integration to work with bknd backend
  - _Requirements: 4.5_

- [ ] 7. Add authentication and media integration examples

  - Create authentication flow templates for supported frameworks
  - Add media upload component templates
  - Integrate with bknd's auth and media APIs
  - _Requirements: 4.3, 4.4, 4.6_

- [ ] 7.1 Create authentication templates

  - Add login/logout flow examples for Next.js and React Router
  - Create authentication middleware templates
  - Add user session handling examples
  - _Requirements: 4.3_

- [ ] 7.2 Create media handling templates

  - Add file upload component templates for supported frameworks
  - Create media gallery examples
  - Add image optimization and handling examples
  - _Requirements: 4.4_

- [ ] 7.3 Create admin UI integration examples

  - Add admin UI access examples for Next.js and React Router
  - Show how to leverage bknd's built-in admin interface
  - Include proper authentication for admin access
  - _Requirements: 4.6_

- [ ] 8. Add email integration support

  - Create email integration examples using bknd's Resend email driver
  - Add email templates and configuration
  - Show how to send transactional emails through bknd
  - _Requirements: 4.7_

- [ ] 8.1 Create email integration templates

  - Add email configuration examples in bknd.config.ts
  - Create email sending examples using bknd's email API
  - Add email template examples for common use cases
  - _Requirements: 4.7_

- [ ] 9. Add comprehensive testing and validation

  - Create unit tests for bknd integration logic
  - Add template compilation tests
  - Implement end-to-end integration tests
  - _Requirements: 5.6_

- [ ] 9.1 Create unit tests for bknd setup logic

  - Test bknd backend selection and database configuration
  - Validate dependency installation logic
  - Test template variable substitution
  - _Requirements: 5.6_

- [ ] 9.2 Add template validation tests

  - Ensure all Handlebars templates compile correctly
  - Validate generated TypeScript code syntax
  - Test conditional logic in templates
  - _Requirements: 5.6_

- [ ] 9.3 Create integration tests

  - Test complete project generation with bknd
  - Validate generated projects can be built and run
  - Test different framework and database combinations
  - _Requirements: 5.6_

- [ ] 10. Add documentation and CLI improvements

  - Create README templates with bknd instructions
  - Add CLI help text and next steps
  - Implement error handling and user guidance
  - _Requirements: 5.4, 5.5_

- [ ] 10.1 Create documentation templates

  - Add bknd-specific sections to README templates
  - Include setup instructions and development commands
  - Add links to bknd documentation and resources
  - _Requirements: 5.4_

- [ ] 10.2 Add CLI completion messages

  - Create success messages with next steps for bknd projects
  - Add information about accessing admin UI
  - Include relevant documentation links
  - _Requirements: 5.4_

- [ ] 10.3 Implement error handling and validation
  - Add validation for bknd configuration options
  - Create helpful error messages for common issues
  - Add recovery options for failed setups
  - _Requirements: 5.5_
