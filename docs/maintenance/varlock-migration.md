# Varlock migration experiment

This draft evaluates replacing both dotenv and T3 Env with Varlock while keeping generated application scripts unchanged. It does not change the generator's defaults. The first supported experiment is a CLI-generated Hono/Bun server plus a TanStack Router/Vite frontend, with and without Turborepo.

Run the reproducible check from the repository root:

```sh
bun run scripts/varlock-smoke.ts
```

The script builds the CLI, invokes its command-line entry point, migrates only the temporary generated projects, installs Varlock 1.18.0 and its Vite integration 1.5.1, and verifies them. It removes its temporary projects afterward. Network access and Node 22.3+ are required. No real credentials are needed or read from the repository.

The focused `Varlock Migration Experiment` workflow runs this check when the experiment changes and can also be dispatched manually. It remains separate from the Default Suite and Curated Build Set.

## Monorepo design

Each application owns `.env.schema` beside its existing env files. `packages/env` retains separate web/server exports for consumers and contains the generated TypeScript accessors; it does not become a central collection of all application secrets. This follows Varlock's [monorepo schema layout](https://varlock.dev/guides/monorepos/#schema-layout).

App schemas use `@generateTsTypes(..., exposeEnv=local)`. Global module augmentation would combine keys from different schemas in one TypeScript program. The smoke check asserts that web types cannot access the server secret or an unrelated root secret. See [typed ENV across packages](https://varlock.dev/guides/monorepos/#typed-env-across-packages).

Only genuinely shared settings belong in the root schema. The experiment imports `SHARED_LABEL` with `@import(../../, pick=[SHARED_LABEL])`, leaving a root-only secret out of both apps, and checks the value supplied by the root `.env.local`. The import graph flows from applications to the root; the root does not import applications. See [shared configuration](https://varlock.dev/guides/monorepos/#sharing-config-from-the-root-or-siblings).

Varlock loads relative to the application's working directory. Workspace tasks therefore run inside each app. Explicit `loadPath` settings are reserved for tools that run elsewhere, such as database configuration or infrastructure packages.

Turbo's strict mode requires ambient variables to be declared in `globalEnv` or task `env`. The experiment declares its environment selector and synthetic validation inputs, hashes the relevant env files, and checks that a root process override selects the production values. A full migration must also cover CI/provider detection and resolver inputs actually used by each selected stack. See [Turbo environment handling](https://varlock.dev/guides/monorepos/#turborepo-and-strict-env-mode).

## Loading without script wrappers

- The server's env entry imports `varlock/auto-load` before exporting its typed accessor.
- Vite uses `varlockVitePlugin()` to load and validate configuration and supply public values to the frontend.
- `bunfig.toml` disables Bun's own dotenv loading. Framework integrations own loading and watching; no global Varlock preload is added.
- Generated `dev`, `build`, `start`, and type-check scripts stay unchanged. The smoke check compares every script before and after migration.

The auto-load module still calls the Varlock CLI internally. Avoiding a script wrapper does not eliminate that deployment dependency. References: [Node](https://varlock.dev/integrations/javascript/), [Bun](https://varlock.dev/integrations/bun/), and [Vite](https://varlock.dev/integrations/vite/).

## Verification and remaining work

### Imported environment selector discrepancy in 1.18.0

The guide says a root `@currentEnv=$APP_ENV` carries through a partial import that includes `APP_ENV`. In a minimal local reproduction with Varlock 1.18.0, the app received `APP_ENV=preview` from the root `.env.local`, but still used its schema's default URL instead of the URL from its own `.env.preview`. Explicitly adding `@currentEnv=$APP_ENV` to the importing app then failed with `environment flag "APP_ENV" must be defined within this schema`.

Reproduction layout:

```text
.env.schema         # @currentEnv=$APP_ENV; APP_ENV=development
.env.local          # APP_ENV=preview
apps/web/.env.schema # @import(../../, pick=[APP_ENV]); VITE_SERVER_URL=http://localhost:3000
apps/web/.env.preview # VITE_SERVER_URL=http://localhost:4300
```

These comments abbreviate separate decorator and value lines. `varlock load --path apps/web/ --agent` returned `APP_ENV=preview` with `VITE_SERVER_URL=http://localhost:3000`. This needs upstream confirmation before relying on inherited selectors. The experiment declares `APP_ENV` and `@currentEnv` locally in each app, an alternative supported by the guide; Turbo forwards a shared process override when one is supplied.

### Coverage

The automated experiment checks installation, generated type isolation, builds in preview and production environments, Node and Bun loading, the built Hono handler and CORS origin, missing-variable failures, unchanged scripts, removal of direct dotenv/T3 Env dependencies, and absence of synthetic secrets in client artifacts.

A separate local production Chromium check of the same Hono/Vite integration rendered the public server URL through the shared env package. Browser automation is not part of this smoke script.

Before replacing the defaults:

- Verify Next.js overrides at the workspace root for Bun, npm, and pnpm, plus standalone/Docker runtime loading. The documented standalone path currently uses `varlock run`.
- Verify Alchemy/Cloudflare runtime bindings. Varlock's documented deployment integration uses `varlock-wrangler`; plain Vite SSR configuration must not bake secrets into Worker artifacts.
- Verify Solid, React Router, TanStack Start, Nuxt, Astro, SvelteKit, and all three native choices, including their supported deployment adapters.
- Preserve Expo's Babel/Metro composition and validate iOS/Android exports.
- Ensure compiled Bun deployments include the required Varlock CLI and configuration.
- Migrate database and infrastructure loaders, generated env updates, Add Path behavior, Docker build/runtime separation, and provider-derived defaults.
- Include imported schema/value files in container contexts, or validate Varlock's flattening workflow.
- Run the applicable Curated Build Set and browser/runtime checks after generator integration.

References: [Next.js](https://varlock.dev/integrations/nextjs/), [Cloudflare](https://varlock.dev/integrations/cloudflare/), [Expo](https://varlock.dev/integrations/expo/), and [monorepo containers](https://varlock.dev/guides/monorepos/#container-builds).
