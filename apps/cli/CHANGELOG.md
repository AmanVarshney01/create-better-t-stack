# create-better-t-stack

## 2.28.5

### Patch Changes

- 2ad89b7: fix auth error handling in all react templates

## 2.28.4

### Patch Changes

- 53985fe: fix nuxt template issues with bun

## 2.28.3

### Patch Changes

- 17389ac: Update Nuxt template deps and add tailwind as dep

## 2.28.2

### Patch Changes

- c8df019: update readme

## 2.28.1

### Patch Changes

- 16c4d42: Upgrade to Prisma 6.13.0

## 2.28.0

### Minor Changes

- 216c242: Added addons: fumadocs, ultracite, oxlint

  Added bunfig.toml with isolated linker

  Grouped addon prompts

### Patch Changes

- 82a4f42: Added Sao Paulo region

## 2.27.1

### Patch Changes

- 31be802: Update prisma setup options labels and hints

## 2.27.0

### Minor Changes

- 0c26578: feat: Add quick setup option with create-db by Prisma
  feat: Make Prisma Postgres available for both Prisma and Drizzle ORMs

## 2.26.5

### Patch Changes

- 23497b6: Remove tsc-alias configuration from tsconfig

## 2.26.4

### Patch Changes

- a4209b7: add react deps in next backend

## 2.26.3

### Patch Changes

- 2b71ef2: Use next-themes in theme provider for React frontends, and fix neon setup

## 2.26.2

### Patch Changes

- e2e4504: Bump better-auth packages to v1.3.0

## 2.26.1

### Patch Changes

- 5ab503a: Add conditional rendering for private data based on API type in dashboard page

## 2.26.0

### Minor Changes

- 8a9ddc9: Update Nuxt template to v4

## 2.25.9

### Patch Changes

- b47671c: Fix start script paths in Bun and Node runtime setup
- b9e9292: Return DB results directly in todo router handlers

## 2.25.8

### Patch Changes

- 5080b6b: Switch to tsdown in server template and update configs

## 2.25.7

### Patch Changes

- 4ece24b: Update telemetry disable instructions to use BTS_TELEMETRY_DISABLED

## 2.25.6

### Patch Changes

- 71e5850: remove telemetry console logs

## 2.25.5

### Patch Changes

- 901e1ff: fix telemetry logic

## 2.25.4

### Patch Changes

- 65c29c2: Allow disabling telemetry with BTS_TELEMETRY_DISABLED=1

## 2.25.3

### Patch Changes

- ea826a5: biome ignore .wrangler dir

## 2.25.2

### Patch Changes

- 7881892: remove trailing comma in biome.json

## 2.25.1

### Patch Changes

- 110fa5a: exclude .expo dir from biome.json

## 2.25.0

### Minor Changes

- 3569b04: Added support for local database setup using Docker Compose for PostgreSQL, MySQL, and MongoDB.

## 2.24.5

### Patch Changes

- b2195dd: Upgrade to zod@4.0.2

## 2.24.4

### Patch Changes

- 5fec00a: fix: web-deploy validation to check for frontend flag

## 2.24.3

### Patch Changes

- fe7b4ff: Remove unnecessary returning() from todo insert query

## 2.24.2

### Patch Changes

- e21756a: fix root path in unistyles template

## 2.24.1

### Patch Changes

- d344b85: Prevent web-deploy when no web frontend is selected
- 98bb4a3: Upgrade to unistyles 3.0

## 2.24.0

### Minor Changes

- 0ae1347: add workers support for tanstack start

## 2.23.1

### Patch Changes

- aea23e8: add workers help message in neext steps box

## 2.23.0

### Minor Changes

- d267427: add cloudflare workers deployment support for next, solid, tanstack-router, react-router, nuxt

## 2.22.10

### Patch Changes

- 8dc521c: Avoid db:local script for D1 database

## 2.22.9

### Patch Changes

- 3ae5ab9: auto git commit if git init is true

## 2.22.8

### Patch Changes

- 0486e2a: Update TanStack Start references from devinxi to vite

## 2.22.7

### Patch Changes

- 2948629: Update Unistyles config and bump to 3.0.0-rc.5

## 2.22.6

### Patch Changes

- e21f6de: generate better readme

## 2.22.5

### Patch Changes

- 32275d3: Add support for Neon database in db-setup

## 2.22.4

### Patch Changes

- da3d0ed: Exclude bts.jsonc from Biome

## 2.22.3

### Patch Changes

- e37a846: Update dependencies and version maps to latest releases

## 2.22.2

### Patch Changes

- 215bd2f: refactor files

## 2.22.1

### Patch Changes

- 3fbd751: fix(post-installation): use selected package manager

## 2.22.0

### Minor Changes

- 9c7a0f0: Add 'add' command for adding addons to existing projects

## 2.21.1

### Patch Changes

- 410ffda: update tailwindcss dep in next

## 2.21.0

### Minor Changes

- 0c5dd2e: add d1 database setup

## 2.20.0

### Minor Changes

- 7013426: upgrade to biome v2

## 2.19.1

### Patch Changes

- 2e56b27: Switch workers template from TOML to JSONC format

## 2.19.0

### Minor Changes

- b34e94a: add cloudflare workers support for hono

## 2.18.6

### Patch Changes

- 2eacf7b: Add better-auth package in solid frontend

## 2.18.5

### Patch Changes

- 2e1aad3: update prisma dep

## 2.18.4

### Patch Changes

- 4cae3b7: fix prisma type error

## 2.18.3

### Patch Changes

- bfcecf5: update domain

## 2.18.2

### Patch Changes

- fd86d51: add sponsors, builder, docs command

## 2.18.1

### Patch Changes

- fc8e994: Migrate to radix-ui monorepo package and update imports

## 2.18.0

### Minor Changes

- 0ffaedd: Upgrade to Tanstack start vite

### Patch Changes

- 1dc9222: use zod for project name validation

## 2.17.1

### Patch Changes

- 28e5a7e: Remove redundant await return in create project mutation

## 2.17.0

### Minor Changes

- d677159: migrate to trpc-cli

## 2.16.7

### Patch Changes

- 5567d65: Show privateData only for selected API in dashboard template

## 2.16.6

### Patch Changes

- 737690c: Add trustedDependencies for Supabase when dbSetup is supabase

## 2.16.5

### Patch Changes

- 591affc: add neondb cli support

## 2.16.4

### Patch Changes

- da16fdc: remove biome check after installation

## 2.16.3

### Patch Changes

- ded8f89: Refactor Neon authentication logic

## 2.16.2

### Patch Changes

- 9aad821: fix react version

## 2.16.1

### Patch Changes

- 2e6454a: Improve oRPC templates

## 2.16.0

### Minor Changes

- 1485809: update orpc tanstack integration

## 2.15.2

### Patch Changes

- 314a38c: Remove @better-auth/expo from unistyles template

## 2.15.1

### Patch Changes

- f19c6d7: Simplify frontend/native prompt messages

## 2.15.0

### Minor Changes

- 7851d06: add AI and todo example templates for nativewind and unistyles

## 2.14.4

### Patch Changes

- 942c48f: run project tracker after reproducible command

## 2.14.3

### Patch Changes

- 3be1953: THIS IS JUST A TEST

## 2.14.2

### Patch Changes

- 27e4411: update react router deps and fix next backend tsconfig error

## 2.14.1

### Patch Changes

- c5c3fa3: update nextjs backend hint

## 2.14.0

### Minor Changes

- 591ecf8: add posthog analytics

### Patch Changes

- 906b555: Add Native Todo Example Support
- 1c2e8f1: fix convex imports
- 46651fb: add composite in server for references

## 2.13.4

### Patch Changes

- 71706c6: update database setup log messages

## 2.13.3

### Patch Changes

- a9d3601: Refactor CLI argument parsing, validation, and project setup logic

## 2.13.2

### Patch Changes

- cb0c98d: Add todo example and --configure to setup

## 2.13.1

### Patch Changes

- 07deae5: remove deprecated @types/globby

## 2.13.0

### Minor Changes

- 1cc9d81: Auto-generate .env.example files with empty values

## 2.12.0

### Minor Changes

- b9dae19: add fastify

## 2.11.0

### Minor Changes

- 01d745a: add pwa support in nextjs

### Patch Changes

- 5cfd3d3: fix zod v4 madness

## 2.10.4

### Patch Changes

- 1521aa1: add react query devtools in next template

## 2.10.3

### Patch Changes

- aed897c: fixed(#269): duplicate logging message during project creation

## 2.10.2

### Patch Changes

- 34ecf97: added support to select region for neon postgres

## 2.10.1

### Patch Changes

- 5a90912: fix prisma config dotenv error

## 2.10.0

### Minor Changes

- 5c5a4b2: add supabase database setup

### Patch Changes

- 0631b23: add supabase flag validation

## 2.9.9

### Patch Changes

- 4840951: remove references from tsconfig when backend is none or convex

## 2.9.8

### Patch Changes

- c147b35: fix tauri frontend dist locationd for react router

## 2.9.7

### Patch Changes

- 2b8eb62: add server references in web apps

## 2.9.6

### Patch Changes

- f5598c9: add tauri option for nextjs

## 2.9.5

### Patch Changes

- 6a339bc: dont allow examples when api is none

## 2.9.4

### Patch Changes

- 95c9113: fix incorrect helper usage

## 2.9.3

### Patch Changes

- 8209713: fix templates when backend is none

## 2.9.2

### Patch Changes

- 89caa15: Make Turborepo a default addon

## 2.9.1

### Patch Changes

- 296ea3d: Improve type safety for orpc protectedProcedure context

## 2.9.0

### Minor Changes

- 6c269a4: add expo with unistyles

### Patch Changes

- d09a284: make backend optional

## 2.8.4

### Patch Changes

- 4d5495d: Bump orpc and nativewind dependencies

## 2.8.3

### Patch Changes

- b0e23cb: Remove todos route from base Solid frontend template

## 2.8.2

### Patch Changes

- 317fd47: update readme

## 2.8.1

### Patch Changes

- 357dfbb: Prompt to overwrite non-empty dirs before config
- a2469b6: Add merge and rename options for existing directories

## 2.8.0

### Minor Changes

- 4f89b8b: add solid

## 2.7.2

### Patch Changes

- 1695185: Use CommonJS exports in babel config

## 2.7.1

### Patch Changes

- 7ecef29: Enable edge-to-edge display for Android

## 2.7.0

### Minor Changes

- 437cf9a: add mongoose orm support to the stack builder

### Patch Changes

- 0cb24b1: add migrate and generate scripts

## 2.6.1

### Patch Changes

- cebb077: Add dotenv import to Prisma config files

## 2.6.0

### Minor Changes

- d5894e5: upgrade to expo 53

## 2.5.2

### Patch Changes

- 920a8f0: Fixed an issue where the CLI would still allow selecting non-Convex backends after specifying `--api none` flag.

## 2.5.1

### Patch Changes

- 9e00e20: add todo, ai template for next

## 2.5.0

### Minor Changes

- 8c648de: update to prisma v6.7.0

## 2.4.1

### Patch Changes

- 0510a27: Fix spinner behavior in Neon command execution

## 2.4.0

### Minor Changes

- 065f862: add convex for svelte

## 2.3.0

### Minor Changes

- 2a5358a: add convex

## 2.2.4

### Patch Changes

- 9180ac2: fix shebang banner
- 49f1fa1: Replace tsup with tsdown

## 2.2.3

### Patch Changes

- aef7aa4: Refactor: Simplify error handling in CLI helpers

## 2.2.2

### Patch Changes

- f1ce6b4: fix(templates): password must be at least 8 characters

## 2.2.1

### Patch Changes

- ca0dcda: add svelte post installation hint

## 2.2.0

### Minor Changes

- ba55384: Add svelte

## 2.1.5

### Patch Changes

- 8adf020: add svelte

## 2.1.4

### Patch Changes

- 9b685d7: add .cache in native gitignore

## 2.1.3

### Patch Changes

- b400b7e: Add .nuxt to ignore list in biome.json

## 2.1.2

### Patch Changes

- 6031287: add zod dep in react router

## 2.1.1

### Patch Changes

- 9c125c2: fix prisma todo location

## 2.1.0

### Minor Changes

- d3a80b7: add nuxt and expo with orpc

## 2.0.12

### Patch Changes

- 7839950: Add express.json() middleware to the Express backend template.
  Rename the TanStack Start frontend package to "web".

## 2.0.11

### Patch Changes

- ea79154: ensure .npmrc is included and copied for native setup

## 2.0.10

### Patch Changes

- 579d125: add zod dep in tanstack start

## 2.0.9

### Patch Changes

- b5267e0: Add setup warnings and handle no-ORM auth

## 2.0.8

### Patch Changes

- 1cb5c0c: fix database none flags validation

## 2.0.7

### Patch Changes

- d82ad80: fix native scaffolding

## 2.0.6

### Patch Changes

- 0de49d4: remove none option in api
- 0de49d4: Only add tRPC server adapters when API is tRPC

## 2.0.6-beta.1

### Patch Changes

- 9d9bd1d: remove none option in api

## 2.0.6-beta.0

### Patch Changes

- 0a4813b: Only add tRPC server adapters when API is tRPC

## 2.0.5

### Patch Changes

- 88afa9a: fix ai example template path

## 2.0.4

### Patch Changes

- 933c4ac: Implement @/\* path aliases and move dotenv imports

## 2.0.3

### Patch Changes

- 98fdc3b: fix pnpm dev script

## 2.0.2

### Patch Changes

- 13241ee: fix cli project name check

## 2.0.1

### Patch Changes

- 2a51f85: fix express server orpc route

## 2.0.0

### Major Changes

- 7f441ef: add orpc, make turborepo optional, use handlebarjs to scaffold template

## 1.13.2

### Patch Changes

- 1e67949: add consola errors, update to better-auth v1.2.6

## 1.13.1

### Patch Changes

- 6d16f27: Update trpc endpoint path from '/api/trpc' to '/trpc'

## 1.13.0

### Minor Changes

- 33158a2: add nextjs frontend and backend

## 1.12.4

### Patch Changes

- bef8182: add command completions

## 1.12.3

### Patch Changes

- 3e7a605: upgrade to prisma v6.6.0

## 1.12.2

### Patch Changes

- 5a15147: Fix validation logic with --yes flag for addon compatibility

## 1.12.1

### Patch Changes

- 30efd64: Add spinner feedback to database setup workflows

## 1.12.0

### Minor Changes

- 0868672: add neon postgres setup

## 1.11.0

### Minor Changes

- aac6a7d: add starlight docs addon

## 1.10.3

### Patch Changes

- 8120222: Replace postgres package with pg for PostgreSQL support with drizzle

## 1.10.2

### Patch Changes

- c84bfcd: Fix Postgres DB setup choice condition to require Prisma ORM

## 1.10.1

### Patch Changes

- 9222c1e: Change PrismaClient instantiation from `let` to `const`

## 1.10.0

### Minor Changes

- c9b7e25: add mysql database

## 1.9.2

### Patch Changes

- 7504d27: Rename database environment variables for consistency

## 1.9.1

### Patch Changes

- fe7153f: update deps

## 1.9.0

### Minor Changes

- 2cf01d1: Add express backend, mongodb database and automated mongodb atlas setup

## 1.8.1

### Patch Changes

- e8a777e: make frontend optional

## 1.8.0

### Minor Changes

- d943bf0: add tanstack start

## 1.7.1

### Patch Changes

- 935a23b: update readme

## 1.7.0

### Minor Changes

- 81dc240: Add Better Auth in Native

## 1.6.2

### Patch Changes

- b3c746c: Add useSortedClasses rule to Biome configuration

## 1.6.1

### Patch Changes

- b170dfc: fix prisma postgres setup prompt

## 1.6.0

### Minor Changes

- cc56381: Add automatic prisma postgres setup

## 1.5.0

### Minor Changes

- dafefb8: Add React Router

## 1.4.5

### Patch Changes

- 0d7ac63: Update CLI prompts

## 1.4.4

### Patch Changes

- b230ddb: Improve native connectivity instruction message

## 1.4.3

### Patch Changes

- b296ac2: use spaces instead of commas in flags

## 1.4.2

### Patch Changes

- 5435dd3: Replace log.info with note for post-install instructions

## 1.4.1

### Patch Changes

- c3ebe27: Remove debug console.log in examples setup

## 1.4.0

### Minor Changes

- a6ac5dc: Add AI chat example and update flags structures

## 1.3.3

### Patch Changes

- a69ff19: fix(todos): trpc v11

## 1.3.2

### Patch Changes

- 851c1b7: Add @trpc/tanstack-react-query dependency to web package.json

## 1.3.1

### Patch Changes

- b0e3432: fix several bugs

## 1.3.0

### Minor Changes

- 1c66d64: Added support for building mobile applications with Expo

## 1.2.0

### Minor Changes

- 91fe9f8: Add option to choose elysiajs as backend framework

## 1.1.0

### Minor Changes

- 88afd53: Add runtime selection feature between Bun and Node.js

## 1.0.10

### Patch Changes

- 4a45ce9: Use current package manager version in packageManager field

## 1.0.9

### Patch Changes

- 380f659: Add package manager specific support for Tauri setup

## 1.0.8

### Patch Changes

- c9d4e4c: Fix self-closing div tag syntax in client template

## 1.0.7

### Patch Changes

- 2bfbcf6: fix several db conf issues

## 1.0.6

### Patch Changes

- d0133f3: rename packages folder to apps

## 1.0.5

### Patch Changes

- 6683202: Fix get() error method drizzle

## 1.0.4

### Patch Changes

- e358534: Add prismaSchemaFolder preview feature to Prisma config

## 1.0.3

### Patch Changes

- 53be1b8: fix pnpm workspace

## 1.0.2

### Patch Changes

- b5f47fc: Add Todo button to homepage when examples are included

## 1.0.1

### Patch Changes

- e7335d6: stable release

## 1.0.0

### Major Changes

- 4cc13bf: stable release

## 0.17.2

### Patch Changes

- 137cc31: some improvements

## 0.17.1

### Patch Changes

- 9574230: Redirect unauthenticated users to login page instead of home

## 0.17.0

### Minor Changes

- 996b35b: Add Biome and Husky for code formatting and Git hooks

## 0.16.0

### Minor Changes

- 406864f: Add Tauri Desktop App addon

## 0.15.0

### Minor Changes

- 66a47c7: Add Progressive Web App (PWA) support

## 0.14.1

### Patch Changes

- 03c400d: fix schema

## 0.14.0

### Minor Changes

- fc59f63: Enhance template with improved UI

## 0.13.1

### Patch Changes

- 3124a6a: fix .gitignore

## 0.13.0

### Minor Changes

- af70905: Fix auth template setup, todo example, turso setup with setup selection

## 0.12.3

### Patch Changes

- 17db765: Remove GitHub Actions and SEO addons

## 0.12.2

### Patch Changes

- e4f950c: fix env when turso setup is off

## 0.12.1

### Patch Changes

- 5897e9c: several improvements

## 0.12.0

### Minor Changes

- 03d9559: Simplify auth setup, centralize environment variable management and fix readme

## 0.11.5

### Patch Changes

- 640e64e: Improve package manager prompts

## 0.11.4

### Patch Changes

- b7ac81d: Add dependency version constants and package management utility

## 0.11.3

### Patch Changes

- ac2f220: simplify auth setup

## 0.11.2

### Patch Changes

- 98b1262: Add postgres support

## 0.11.1

### Patch Changes

- 036c62c: Enhance authentication setup and improve documentation

## 0.11.0

### Minor Changes

- f02ffd7: added github seo add-on

## 0.10.4

### Patch Changes

- 03571ca: allow specifying project path in prompt

## 0.10.3

### Patch Changes

- 5b13b04: rename features to addons

## 0.10.2

### Patch Changes

- 76ea670: fix template typo

## 0.10.1

### Patch Changes

- 48efa59: fix commander init

## 0.10.0

### Minor Changes

- 792885b: add auth, drizzle, prisma setup logic

## 0.9.0

### Minor Changes

- 6600d1f: implement auth add or remove logic

## 0.8.1

### Patch Changes

- ba77104: update ascii art

## 0.8.0

### Minor Changes

- 3d78d1e: add flags and prompt for orm, add none option in database

## 0.7.5

### Patch Changes

- 64fc644: refactor(cli): simplify database selection flags

## 0.7.4

### Patch Changes

- d30adfd: remove ugly emojis

## 0.7.3

### Patch Changes

- 7181751: remove caching in degit

## 0.7.2

### Patch Changes

- 91b786c: update readme

## 0.7.1

### Patch Changes

- be5c662: update readme

## 0.7.0

### Minor Changes

- f98216e: replace chalk with picocolors

## 0.6.2

### Patch Changes

- e9ecdbf: update template repo url and add degit

## 0.6.1

### Patch Changes

- f73c7d2: fix: dependency installation output flow

## 0.6.0

### Minor Changes

- aa3eaad: refactor: simplify package manager flags

## 0.5.0

### Minor Changes

- 0983fc1: feat(cli): display pre-selected flags before prompts

## 0.4.6

### Patch Changes

- 31f1271: Improve prompts

## 0.4.5

### Patch Changes

- 7fc5010: add small title for shorter window

## 0.4.4

### Patch Changes

- 92d2443: clear console on start

## 0.4.3

### Patch Changes

- ecd7db9: feat: add project name validation

## 0.4.2

### Patch Changes

- d8875f0: bug fixes

## 0.4.1

### Patch Changes

- 305fb72: remove logger and fix minor bugs

## 0.4.0

### Minor Changes

- 76a14ea: refactor: migrate inquirer to @clack/prompts

## 0.3.4

### Patch Changes

- 0bd0c8e: colorize the prompts

## 0.3.3

### Patch Changes

- ffda73e: Improve error handling

## 0.3.2

### Patch Changes

- d99e161: use script syntax in execa

## 0.3.1

### Patch Changes

- 7481bee: fix package manager detection

## 0.3.0

### Minor Changes

- 4659db9: feat: add package manager selection and configuration

## 0.2.1

### Patch Changes

- a0cef2b: bump version to 0.2.1

## 0.2.0

### Minor Changes

- b56096f: feat(cli): add reproducible command output and flag support

## 0.1.3

### Patch Changes

- a06be85: refactor(cli): improve Turso database setup workflow

## 0.1.2

### Patch Changes

- 5554818: auto get current package version

## 0.1.1

### Patch Changes

- 5d89847: Add -y to auto select the defaults

## 0.1.0

### Minor Changes

- 5c83a10: initial release
