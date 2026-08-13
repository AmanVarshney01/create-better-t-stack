# Alchemy v2 beta integration findings

This is the evidence log for upstream Alchemy issues found while integrating Cloudflare deployment
in Better-T-Stack. Keep confirmed defects separate from limitations and disproved review claims so
future upgrades do not remove workarounds prematurely or preserve them after upstream fixes.

Last verified: 2026-08-12

- Accepted dependency and current `next` tag: `alchemy@2.0.0-beta.72`
- Framework package: `@alchemy.run/cloudflare-frameworks@2.0.0-beta.72`
- Reproduction repository:
  [`AmanVarshney01/alchemy-v2-beta-repros`](https://github.com/AmanVarshney01/alchemy-v2-beta-repros)

Do not remove a workaround merely because a fix is on main. Wait for a release containing the fix,
upgrade the pinned dependency, and rerun the generated-project smoke test.

In the table, “Confirmed” describes evidence against the published beta: source inspection, a
provider-free plan, or a runnable/live reproduction as detailed below. Main statuses are source-only
unless they explicitly say live-reverified. Registry and OAuth observations are labeled separately.

## Confirmed defects and publication hazards

| ID  | Finding                                                             | Accepted beta.72 status      | Upstream status on 2026-08-12                                                                                | Current handling or required action                                            |
| --- | ------------------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| A1  | `StaticSite` serializes unresolved `Output` values before `Build`   | Fixed and live-qualified     | Released through merged [#796](https://github.com/alchemy-run/alchemy/pull/796)                              | Removed `outputAwareStaticSite`; use native `StaticSite` Inputs                |
| A2  | `StaticSite` serializes `Config` values as `{"_id":"Config"}`       | Fixed and live-qualified     | Released through merged [#796](https://github.com/alchemy-run/alchemy/pull/796)                              | Removed caller-side Config resolution; pass Config directly                    |
| A3  | `Website.Vite` misses pure-client output                            | Fixed and live-qualified     | Released through merged [#795](https://github.com/alchemy-run/alchemy/pull/795)                              | TanStack Router uses the fixed SPA path; SolidStart v2 uses `Website.Vite` SSR |
| A4  | React Router builds a Worker with no registered handler             | Mitigated                    | Custom `main`, relative resolution, and loud invalid-handler errors are released; no handler is synthesized  | Generate an explicit registered Worker entry                                   |
| A5  | Default `Command.Build` memo scope misses sibling workspace changes | Confirmed                    | Generic `StaticSite` still requires explicit scope; #822 improves `Website.Vite`                             | Generated `StaticSite` builds disable memo reuse                               |
| A6  | A published test prerelease can satisfy beta caret ranges           | Confirmed                    | N/A; npm package deprecated                                                                                  | Pin the selected Alchemy and supported Effect beta exactly                     |
| A7  | Worker Assets drops `_headers` and `_redirects`                     | Fixed in released source     | Released through merged [#928](https://github.com/alchemy-run/alchemy/pull/928)                              | Fixed reproduction removed from the current-failures repository                |
| A8  | Worker Assets assigns incomplete MIME types                         | Fixed in released source     | beta.72 covers the reported image, font, media, manifest, map, and JavaScript types                          | Rerun the representative live MIME fixture; no template workaround             |
| A9  | Published Cloudflare packages have incompatible peer ranges         | Fixed in released graph      | beta.72 consolidates runtime/framework packages with aligned Distilled and Effect peers                      | No template override                                                           |
| A10 | beta.66 local D1 migrations cannot open the Cloudflare runtime      | Fixed and locally qualified  | Released through merged [#1009](https://github.com/alchemy-run/alchemy/pull/1009)                            | beta.70 applies real nested Prisma migrations in `alchemy dev`                 |
| A11 | Alchemy calls removed `Schema.TaggedErrorClass` with newer Effect   | Fixed                        | Released in beta.72 through merged [#1132](https://github.com/alchemy-run/alchemy/pull/1132)                 | Use Effect rc.108 directly; no compatibility pin or override                   |
| A12 | `Website.Nuxt` injects raw TypeScript that Nitro cannot parse       | Fixed                        | beta.72 ships compiled Nuxt development code in `@alchemy.run/cloudflare-frameworks`                         | Use native `Website.Nuxt`; remove the generic Nitro/Wrangler path              |
| A13 | Alchemy pins optional Drizzle peers to an exact prerelease          | Non-blocking packaging issue | npm hoists the app's stable Drizzle and reports Alchemy's optional peer as invalid; install/build/start pass | Support npm without changing app Drizzle; upstream should widen the peer range |

### A1: `StaticSite` drops deploy-time Outputs

The beta.64 [`StaticSite` implementation](https://github.com/alchemy-run/alchemy/blob/v2.0.0-beta.64/packages/alchemy/src/Cloudflare/Website/StaticSite.ts)
calls `serializeEnv(props.env)` before declaring `Command.Build`. Its serializer JSON-encodes every
non-string, non-Redacted value. The tested property Output,
`serverWorker.url.as<string>()`, therefore becomes `undefined`; other Output shapes are likewise
serialized incorrectly. `.as<string>()` is a type cast, not resolution. This also removes the
server Worker to web Build dependency edge.

A provider-free plan test against the exact published package observed:

- Upstream `StaticSite`: build env value `undefined`, no server dependency.
- Direct `Command.Build` input: resolved sentinel URL and server dependency.
- Better-T-Stack wrapper: resolved sentinel URL and server dependency.

The canonical live reproduction is
[`9-output-in-staticsite-build-env`](https://github.com/AmanVarshney01/alchemy-v2-beta-repros/tree/31b7a35e66956131d0a81726e032290517f70862/9-output-in-staticsite-build-env).
Against beta.61 its build logged `SERVER_URL = <missing>` and the deployed page contained the same
missing value instead of the yielded API Worker's URL. Merged PR #796 adds coverage for Output
strings, objects, and null values and is published in beta.67. On 2026-08-01, a fresh generated
SvelteKit + Hono combined stack passed direct infrastructure typecheck and live deployment using
native `StaticSite`: both Worker URLs returned 200, and the built frontend contained the exact
deployed server Worker URL. A fresh Next.js build also contained its exact deployed server URL
before that upload correctly failed this account's unrelated 3 MiB free-plan Worker limit. Both
owned stages were destroyed.

The generator now passes Output-valued environment entries directly to upstream `StaticSite` and
no longer contains `outputAwareStaticSite`, its custom serializer, or its duplicated
`Build -> Worker` implementation.

Removal condition: an otherwise acceptable published release must preserve Output-valued env
entries and their dependency edges while serializing build env values, and a both-Cloudflare
plan/deploy must prove the real server URL reaches the frontend build.

### A2: `StaticSite` stringifies Effect Config descriptors

The same serializer turns `Config.string("MY_URL")` into `{"_id":"Config"}` and passes that value to
the build subprocess, overriding a valid `process.env.MY_URL`. The runnable reproduction is
[`3-config-in-staticsite-build-env`](https://github.com/AmanVarshney01/alchemy-v2-beta-repros/tree/31b7a35e66956131d0a81726e032290517f70862/3-config-in-staticsite-build-env).

Beta.67 contains the #796 serializer fix. Direct `Config`/`Output` usage typechecked in fresh
generated Next, Nuxt, SvelteKit, and Astro infrastructure. A fresh web-only SvelteKit deployment
passed `Config.string("PUBLIC_SERVER_URL")` directly to `StaticSite`; Cloudflare's deployed-version
metadata contained the configured string as a plain-text binding rather than a Config descriptor,
and the route returned 200. The owned stage was then destroyed and the Cloudflare API reported the
Worker absent.

Removal condition: an otherwise acceptable released `StaticSite` must pass the configured
string—not the Config descriptor—to the build without requiring callers to resolve it manually.

### A3: `Website.Vite` misses pure-client output

In beta.61, the output collector's post-order `buildApp` hook can resolve before the client
environment's `writeBundle` hook. Alchemy then reports `Vite build produced neither assets nor
server output` even though Vite wrote the SPA assets. See
[`1-vite-spa-no-output`](https://github.com/AmanVarshney01/alchemy-v2-beta-repros/tree/31b7a35e66956131d0a81726e032290517f70862/1-vite-spa-no-output).

Beta.62 includes [PR #795](https://github.com/alchemy-run/alchemy/pull/795), which reads
collected output after `builder.buildApp()` resolves. Beta.64 therefore contains the fix.

On 2026-07-26, fresh TanStack Router and then-current Solid SPA projects installed beta.64, passed
their application builds and direct infrastructure typechecks, and deployed with `Website.Vite`.
For both projects, `/` and `/direct/deep-route` returned `200 text/html`, proving the configured
single-page-application fallback. The owned stages
`a3-vite-tsr-20260726-01` and `a3-vite-solid-20260726-01` were destroyed from their originating
directories; subsequent Cloudflare API inventory returned Worker-not-found (`10007`) for both
generated Worker names.

The removal gate remains satisfied for TanStack Router. The historical Solid SPA evidence is retained,
but Solid now scaffolds SolidStart v2 SSR and uses `Website.Vite` with worker-first routing rather than
the SPA fallback. Neither path uses the former A1/A2 `StaticSite` compatibility wrapper.

### A4: React Router handler and entrypoint integration

In beta.61, `Website.Vite` can treat React Router's server-build manifest as the Worker entry even
though that manifest has no default handler. The generated default becomes `{}`, and Cloudflare
rejects the upload because it has no registered handler. The beta also lacks a custom `main` escape
hatch, which makes the default-selection defect harder to work around. See
[`4-react-router-handlerless-worker`](https://github.com/AmanVarshney01/alchemy-v2-beta-repros/tree/31b7a35e66956131d0a81726e032290517f70862/4-react-router-handlerless-worker).

Beta.64 plumbs a `main` option through `Website.Vite` and consumes `cloudflare-tools@0.13.8`,
which includes [cloudflare-tools PR #62](https://github.com/alchemy-run/cloudflare-tools/pull/62).
Relative custom entries resolve against the Vite root and an invalid entry fails loudly instead of
silently producing an empty handler. Alchemy still does not synthesize a React Router request
handler, so the explicit registered entry remains required. The older React Router 8.1 pipeable-stream
failure is version-specific: React Router 8.2 added a Web Streams default, so a fresh unlocked
install cannot be used to reproduce the earlier runtime behavior. Better-T-Stack still keeps an
explicit registered request-handler entry until the released default path passes its live gate.

Removal condition: the released default `Website.Vite` React Router path must deploy a registered
handler and successfully serve a document request without a generated custom entry.

### A5: default build memoization misses monorepo dependencies

[`Command.Build` memoization](https://github.com/alchemy-run/alchemy/blob/v2.0.0-beta.67/packages/alchemy/src/Command/Memo.ts)
hashes files under `cwd` plus the nearest lockfile. Changing a sibling workspace package imported by
the frontend does not change the default hash, so a deploy can reuse stale output. The relevant
Build/Memo source is unchanged on the inspected main commit.

Alchemy accepts explicit `memo.include` globs that reach outside `cwd`. When using them, also set
`lockfile: true`, because an explicit include disables lockfile hashing by default. However, a
repository-local include list is not an accepted Better-T-Stack removal gate: one passing sibling
edit cannot prove the list covers all transitive workspace and root configuration inputs.
Better-T-Stack therefore keeps `memo: false` for generated `StaticSite` builds, ensuring
shared-package changes rebuild at the cost of skipping this cache.

Removal condition for `memo: false`: a published exact Alchemy release must provide a documented
workspace-aware default memo scope, then tests must prove changes to every imported sibling
workspace and relevant root lockfile, manifest, workspace, task-runner, and generated-config input
cause the next normal deploy to rebuild the frontend.

### A6: publication hazard from an incompatible test build

`alchemy@2.0.0-pipeline-v2-test` sorts above `2.0.0-beta.x` under standard prerelease ordering and
was observed satisfying a caret beta range under Bun despite lacking expected Cloudflare exports.
The package is now deprecated on npm, but it remains published. Better-T-Stack pins
`2.0.0-beta.72` exactly together with `effect`, `@effect/platform-node`, and
`@effect/platform-bun` rc.108. This keeps the Effect package family aligned while preventing an
unrelated prerelease from entering generated projects.

Exact pinning is a permanent publication-safety policy, not a temporary workaround. Changing the
accepted release means replacing one verified exact version with another verified exact version;
Better-T-Stack does not generate an open-ended Alchemy version range.

### A7: Worker Assets drops `_headers` and `_redirects`

Beta.61 through beta.64 read `_headers` and `_redirects`, exclude them from the ordinary
manifest, and include their contents in the asset hash. The Worker provider then uploads only the
asset config and JWT; it never forwards the two parsed strings as Cloudflare asset configuration.
See the beta.64 [`Assets` implementation](https://github.com/alchemy-run/alchemy/blob/v2.0.0-beta.64/packages/alchemy/src/Cloudflare/Workers/Assets.ts).

The live
[`10-assets-headers-redirects`](https://github.com/AmanVarshney01/alchemy-v2-beta-repros/tree/31b7a35e66956131d0a81726e032290517f70862/10-assets-headers-redirects)
reproduction served the asset without its custom header and returned `404` for the configured
redirect. Its owned Worker stage was destroyed after verification.

Merged [Alchemy PR #928](https://github.com/alchemy-run/alchemy/pull/928) now forwards both files in
production and development, preserves them on a no-op/keep-assets deployment, and adds live HTTP
coverage for create and update behavior. Beta.67 contains the fix and is accepted. The canonical
external live repro still needs to pass against beta.67 before Better-T-Stack claims complete
static-asset rule parity.

### A8: Worker Assets assigns incomplete MIME types

Alchemy's hardcoded asset MIME lookup covers only a small set of extensions. AVIF, JPEG, WebP,
WOFF2, and other common formats fall through to `application/octet-stream`. Wrangler uses a full
MIME resolver instead of this limited table.

The live
[`11-assets-mime-types`](https://github.com/AmanVarshney01/alchemy-v2-beta-repros/tree/2c7376919eede555f3ae016017248c5daca90b5e/11-assets-mime-types)
reproduction observed `application/octet-stream` for `.avif`, `.jpg`, `.webp`, and `.woff2` on
beta.61. Its owned Worker stage was destroyed after verification. Source inspection confirms the
same hard-coded fallback remained in beta.70 source. Beta.72's released map now covers every
extension in the reported fixture, including AVIF, JPEG, WebP, and WOFF2, plus common media and
manifest types. The source-level defect is fixed; rerun the live fixture before closing the
end-to-end response-header gate.

There is no generic Better-T-Stack workaround at the uploader boundary. Closure condition: a
published Alchemy release must use a complete, charset-aware MIME resolver and the live fixture must
serve every expected content type.

### A9: published Cloudflare packages had incompatible peer ranges

Older Alchemy releases combined Distilled Cloudflare packages whose peer ranges did not overlap,
which produced non-fatal warnings under strict installers. Beta.72 replaces the split runtime and
framework packages with `@alchemy.run/cloudflare-runtime` and
`@alchemy.run/cloudflare-frameworks`; both select `@distilled.cloud/cloudflare@1.0.0-rc.4` and
compatible Effect peers. Fresh Bun, npm, and pnpm installs complete without the old warning. No
template override was added or is required.

### A10: beta.66 local D1 migrations cannot open the runtime

Alchemy beta.66 moved Cloudflare providers behind an RPC provider proxy, but its local D1 migration
path still opens `cloudflare-runtime/Runtime` in the main process. A generated Prisma D1 project
with a real nested migration reached D1 creation and then failed in `alchemy dev` with:

```text
Service not found: cloudflare-runtime/Runtime
```

The same generated D1 resource succeeds when its migrations directory contains no SQL file, which
is why generation, typechecking, or an empty-directory smoke test does not catch this regression.
Merged [Alchemy PR #1009](https://github.com/alchemy-run/alchemy/pull/1009) provides the runtime for
local D1 migrations and is published in beta.67. On 2026-08-01, a fresh generated Nuxt + Prisma D1
project with a real nested migration completed `alchemy dev`, created the local D1 resource, applied
the migration, and served the Nuxt page with HTTP 200. This closes the beta.66 regression and allows
beta.67 and later beta.70 to replace beta.64. The generated production `migrationsDir` remains required; it is product
wiring, not an A10 workaround.

On 2026-08-06, a fresh generated beta.69 Nuxt + Drizzle + D1 project generated and applied a real
local migration through the root command, passed its production build and direct infrastructure
typecheck, served page SSR with HTTP 200 under `alchemy dev`, and completed a Better Auth D1 signup
with HTTP 200. This requalifies the currently accepted release on the generic Nuxt path.

### A11: older Alchemy releases called a removed Effect Schema API

Alchemy beta.69 declared `effect >=4.0.0-beta.102 || >=4.0.0`, which accepted beta.104. A clean
install using that historical resolution crashed even for `alchemy --help`:

```text
TypeError: Schema.TaggedErrorClass is not a function
at alchemy/src/Auth/AuthProvider.ts:43:39
```

The current reproduction is
[`1-effect-latest-startup`](https://github.com/AmanVarshney01/alchemy-v2-beta-repros/tree/2c7376919eede555f3ae016017248c5daca90b5e/1-effect-latest-startup).
The same API is absent from Effect beta.104 onward. On 2026-08-09, a clean generated beta.70 +
beta.106 project reproduced the crash with `bun alchemy --help` before any
provider or framework code ran. Infrastructure still typechecks because beta.70's declaration
files accept the broad peer range; typechecking does not prove CLI startup.

Merged [Alchemy PR #1132](https://github.com/alchemy-run/alchemy/pull/1132) replaces
`Schema.TaggedErrorClass` with `Schema.TaggedError` and raises the Effect floor. Beta.72 contains
that fix. Fresh beta.72 + Effect rc.108 Bun, npm, and pnpm projects install, typecheck, and start the
Alchemy CLI without the old crash. Better-T-Stack therefore removed
the beta.102 compatibility pin instead of carrying an override, patch, hoisted linker, or git
dependency.

### A12: the old first-class Nuxt provider injected untranspiled TypeScript

Alchemy beta.69 and `@distilled.cloud/nuxt@0.17.0` exposed `Website.Nuxt`. In a minimal native Nuxt
project, `alchemy dev` started Nuxt and then Nitro/Rollup failed while parsing the provider's
injected `src/dev/plugin.ts`:

```text
@distilled.cloud/nuxt/src/dev/plugin.ts (28:12): Expected ',', got '*'
import type * as ConnectClient from
"@distilled.cloud/cloudflare-runtime/platform-proxy/connect";
```

The beta.70 reproduction is
[`2-nuxt-dev-plugin-parse`](https://github.com/AmanVarshney01/alchemy-v2-beta-repros/tree/2c7376919eede555f3ae016017248c5daca90b5e/2-nuxt-dev-plugin-parse).

`@distilled.cloud/nuxt@0.17.1` publishes both source and compiled plugins, but its `bun` export
selects `src/index.ts`. The source host module consequently resolves `src/dev/plugin.ts`; Nitro
passes that plugin to Rollup's JavaScript parser without transpiling its type-only imports. On
2026-08-10, a fresh generated beta.70 + beta.102 Nuxt/D1 project reached Alchemy resource creation,
created the local D1 resource, and then failed its provider-owned development build at:

```text
@distilled.cloud/nuxt/src/dev/plugin.ts (28:12): Expected ',', got '*'
import type * as ConnectClient from "@distilled.cloud/cloudflare-runtime/platform-proxy/connect";
```

Merged [cloudflare-tools PR #109](https://github.com/alchemy-run/cloudflare-tools/pull/109) always
resolves the compiled development plugin. Beta.72 now publishes that implementation inside
`@alchemy.run/cloudflare-frameworks`. Generated Nuxt projects therefore use `Website.Nuxt` and
remove the duplicate Nitro preset, `nitro-cloudflare-dev`, Wrangler file, `cloudflare:workers`
development alias, manual `.output` paths, and hard-coded resource dev command. The provider's
native `event.context.cloudflare.env` value is passed into generated auth and database factories at
the request boundary.

### A13: Alchemy's exact optional Drizzle peer does not block npm projects

On 2026-08-11, a fresh generated npm workspace declared exact beta.102 versions in
`packages/infra`, but npm hoisted Effect beta.107 for Alchemy's open-ended dependencies such as
`@effect/sql-d1 >=4.0.0-beta.102`. `npm ls effect` showed beta.102 in the infra workspace and
beta.107 under Alchemy's dependency graph. The resulting infrastructure typecheck failed because
the two `Effect` types have different identities, and `npx alchemy --help` crashed at
`Schema.TaggedErrorClass` before loading a provider.

The minimal
[`3-npm-workspace-effect-split`](https://github.com/AmanVarshney01/alchemy-v2-beta-repros/tree/2c7376919eede555f3ae016017248c5daca90b5e/3-npm-workspace-effect-split)
reproduction records the dependency tree, infrastructure type failure, and startup crash without
resolution controls.

That Effect split is fixed in beta.72. In a fresh generated npm workspace, stable Drizzle lives in
`packages/db` while Alchemy lives in `packages/infra`; install, application build, infrastructure
typecheck, and both `npx alchemy --help` and `bunx alchemy --help` pass with Effect beta.107. npm does
not install Alchemy's exact optional `drizzle-orm@1.0.0-rc.5-ab785fc` peer separately, however. It
hoists the application's `drizzle-orm@0.45.2`, and `npm ls drizzle-orm` consequently exits with
`ELSPROBLEMS` even though npm installation emits no peer error and the generated project works.

This is an Alchemy package-metadata issue rather than a reason to downgrade the application's ORM or
change the workspace linker. Better-T-Stack supports npm and removes the old rejection without an
override, duplicate root dependency, special linker mode, or hoisted install. Alchemy should widen
or remove the exact optional Drizzle peer for consumers that do not use its Drizzle-backed providers.

## Current limitations, not confirmed upstream defects

- `alchemy logs` was observed failing the Workers observability telemetry query with `Unauthorized`
  when using credentials created by `alchemy login`; `alchemy tail` continued to work. Beta.61 and
  main both request the relevant observability scopes, so this is not source-confirmed as an Alchemy
  defect. Retest with a newly authenticated profile before filing it upstream.
- OpenNext's `WORKER_SELF_REFERENCE` needs a self service binding for on-demand revalidation. The
  beta Worker resource has no clean declarative self-binding path that avoids a dependency cycle.
  Normal request handling works; explicitly test `res.revalidate()` before claiming full ISR support.
- A fix present on Alchemy main is not usable by generated projects until it is published and the
  pinned dependency is upgraded.
- Alchemy PR [#1183](https://github.com/alchemy-run/alchemy/pull/1183), which makes the injected
  Cloudflare Vite plugin self-deduplicating, is not released. SolidStart and TanStack Start retain
  their `ALCHEMY_CLOUDFLARE_VITE_INJECTED` integration guards until a published provider passes the
  generated build and development gates without them.
- The first-class resources are published in beta.72 with
  `@alchemy.run/cloudflare-frameworks@2.0.0-beta.72`. Publication closes the intake gate, not each
  framework's adoption gate:
  - `Website.Nuxt` is generated. The provider owns build, preset, assets, workspace discovery, and
    local bindings; Better-T-Stack passes the native request-context environment into auth and
    database factories.
  - `Website.SvelteKit` declares a Kit 3 peer while Better-T-Stack uses stable Kit 2. A direct
    beta.69 development check nevertheless served a real Kit 2 SSR document with HTTP 200, so the
    warning alone is not filed as a runtime bug. Production, bindings, and build-memo gates remain.
  - `Website.Astro` is generated with `@alchemy.run/cloudflare-frameworks`. Released source loads the
    native config and injects the Cloudflare adapter in memory, so the checked-in adapter is removed
    and Alchemy owns the build/dev lifecycle. The wrapper can auto-provision a default session KV,
    but its return type does not add that implicit binding to `InferEnv` and its generated logical ID
    differs from the existing resource. Better-T-Stack therefore retains explicit `SESSION` and
    `IMAGES` resources so the wrapper reuses the binding and preserves state identity and types.
    On 2026-08-10, a fresh beta.70/beta.102 project served SSR pages, the oRPC reference, and static
    assets, then completed a Better Auth D1 signup under `alchemy dev`. Session behavior, real image
    handling, production deployment, asset rules, and cleanup gates remain pending.
  - `Website.Nextjs` has an exact OpenNext 1.20.1 peer while 1.20.2 is current. That warning alone is
    not a runtime verdict; the existing OpenNext/binding/live gates remain.
- `Website.Astro` deliberately owns the Astro build. Alchemy's own current example therefore has no
  standalone framework `build` script, and Better-T-Stack follows that model for Cloudflare Astro.
  Running `astro build` directly with `output: "server"` and no adapter fails by design; configuring
  `@astrojs/cloudflare` instead conflicts with the adapter injected by the source provider.
- OpenNext Cloudflare currently omits `pg-cloudflare`'s workerd condition files while tracing a
  Prisma `@prisma/adapter-pg` Next.js build. The build then fails to resolve
  `pg-cloudflare/dist/index.js`; the upstream packaging report remains open as
  [#1214](https://github.com/opennextjs/opennextjs-cloudflare/issues/1214), with a related Hyperdrive
  runtime report in [#1322](https://github.com/opennextjs/opennextjs-cloudflare/issues/1322).
  Better-T-Stack therefore rejects generic PostgreSQL Prisma setups such as PlanetScale Postgres or
  Supabase only for Next.js + Cloudflare. Neon, Prisma Postgres, other Cloudflare frontends, and
  non-Cloudflare deploy targets remain available.
- A full Nuxt + Prisma Postgres build originally emitted two identical Prisma WASM modules because
  its optimized SSR oRPC client imported the database graph into both the page and Nitro API
  bundles. The generated Cloudflare path now calls `/rpc` through Nitro's in-process `event.fetch`,
  emits one WASM module, and dry-runs below the 3 MiB compressed free-plan limit. This is integration
  wiring in Better-T-Stack, not an Alchemy defect.

## Disproved claims

These were investigated and must not be filed as Alchemy bugs without new evidence:

- **“Alchemy v2 reads D1 migration directories non-recursively.”** False. [`SqlFile`](https://github.com/alchemy-run/alchemy/blob/v2.0.0-beta.61/packages/alchemy/src/Sql/SqlFile.ts)
  calls `readDirectory(directory, { recursive: true })`. Prisma's local Wrangler integration needed
  a full nested `migrations_pattern`; that is separate from Alchemy's deploy path.
- **“A pure `StaticSite` requires an explicit Worker entrypoint.”** False. `StaticSite` injects a
  fallback Worker that forwards requests to `env.ASSETS` when neither `main` nor `script` is set.
- **“Implicit `nodejs_compat` is lost during upload.”** False for
  [the linked reproduction](https://github.com/AmanVarshney01/alchemy-v2-beta-repros/tree/31b7a35e66956131d0a81726e032290517f70862/2-nodejs-compat-default-lost).
  [`Platform`](https://github.com/alchemy-run/alchemy/blob/v2.0.0-beta.61/packages/alchemy/src/Platform.ts)
  intentionally marks a non-Effect Worker entrypoint as external, and compatibility defaults are
  only added to Effect-native Workers. The observed absence is real, but it is computed before
  upload rather than dropped by WorkerProvider. Beta.67 contains #796's default changes; generated
  external framework entries still declare the flags their own live gates require.
- **“Seeing `localhost:3000` in a production bundle proves it is the active API URL.”** False. It
  may be a dead fallback branch. Verify the actual build env value and dependency plan, not a raw
  string occurrence.
- **“`.as<string>()` resolves an Output.”** False. It only narrows the TypeScript type.

## Upgrade checklist

When changing the pinned Alchemy version:

1. Recheck every row against the released tag, not only main.
2. Run the pinned external reproductions relevant to a workaround.
3. Generate and typecheck both web-only and combined Cloudflare projects.
4. Build a Prisma Workers server and an OpenNext Worker bundle.
5. Plan or deploy a combined stack and verify the frontend build receives the deployed server URL.
6. Deploy a pure SPA and React Router app, then make a real request to each.
7. Change an imported sibling workspace without changing the lockfile and verify a normal deploy
   rebuilds it.
8. Exercise local D1 migration discovery and one real request through each affected framework.
9. If auth/logging changed, use a fresh `alchemy login` profile and test both `logs` and `tail`.
10. If OpenNext bindings changed, exercise `res.revalidate()` rather than only normal requests.
11. Run the `_headers`/`_redirects` and MIME live repros, including an update deployment.
12. For Astro, inspect generated adapter metadata and exercise SSR, sessions, Images, static rules,
    MIME types, and the exact compatibility date—not only a homepage request.
13. Recheck exact-version resolution with every supported generated-project package manager; do not
    replace the pin with a range.
14. Remove a workaround only after its specific removal gate passes without it.
15. Before mutation, assign a unique stage and persist an ownership marker, expected resource
    inventory, source digest, originating directory, and state location outside the runner.
16. Track every child process and reserved port. In `finally`, terminate only owned processes,
    release owned ports, and fail visibly rather than killing an unrelated listener.
17. Destroy from the originating directory with the exact stage and retained `.alchemy` state,
    then audit owned Workers, D1 databases, KV namespaces, and related resources for leaks.
18. After an interruption, run an independent reconciler that uses provider APIs and deletes only
    resources matching the persisted marker; print exact recovery commands for anything retained.
19. Keep time, resource-count, and concurrency ceilings active, and verify cleanup/diagnostic output
    never contains secret sentinel values.
