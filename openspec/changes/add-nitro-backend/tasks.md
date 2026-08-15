## 1. Shared Configuration and DX

- [x] 1.1 Add Nitro to shared backend schemas, serialized configuration, analytics-safe values, and display names
- [x] 1.2 Add the experimental Nitro choice to CLI prompts, runtime selection, summaries, and programmatic validation
- [x] 1.3 Add Nitro to the web stack builder, compatibility logic, and generated preview path
- [x] 1.4 Reject unsupported Nitro combinations, including Workers/Cloudflare and evlog, before generation

## 2. Native Nitro Generation

- [x] 2.1 Add the official Nitro config, TypeScript config, package scripts, ignores, and route directory structure
- [x] 2.2 Add health, CORS, Better Auth, Clerk context, oRPC, tRPC, payments, and AI handlers using Web Request APIs
- [x] 2.3 Wire Nitro dependencies and generated shared package imports without duplicating framework dependencies
- [x] 2.4 Verify database, ORM, auth, frontend, native, payments, and examples template composition

## 3. Deployment Integrations

- [x] 3.1 Generate Node and Bun Docker images from native Nitro output and update compose behavior
- [x] 3.2 Generate Prisma Compute command-build configuration for Nitro output
- [x] 3.3 Generate Vercel Services configuration using Nitro framework detection
- [x] 3.4 Update generated deployment instructions, requirements, ignores, and task-runner configuration

## 4. Automated Verification

- [x] 4.1 Add focused schema, prompt, validation, dependency, output, and stack-builder tests
- [x] 4.2 Add representative generated Nitro matrix cases across Bun, npm, and pnpm
- [x] 4.3 Install, typecheck, build, start, and HTTP-probe generated Nitro fixtures including API, auth, database, and example boundaries
- [x] 4.4 Run repository formatting, linting, typechecking, build, CLI tests, web tests, and derived-template regeneration checks

## 5. Live Provider Verification

- [x] 5.1 Build and run disposable Node and Bun Docker images, probe routes, and remove owned containers/images
- [x] 5.2 Create a uniquely marked Prisma stage, deploy, probe routes, destroy from retained state, and reconcile only marker-owned resources
- [x] 5.3 Create a uniquely marked Vercel deployment, probe routes, remove only owned resources, and reconcile by marker
- [x] 5.4 Confirm unsupported Cloudflare configuration fails before generation and record the first-class adapter release gate

## 6. Delivery

- [x] 6.1 Regenerate committed builder/template artifacts and review the complete diff for duplication or provider workarounds
- [x] 6.2 Commit with a conventional message, push the feature branch, and open a concise pull request with the supported matrix
