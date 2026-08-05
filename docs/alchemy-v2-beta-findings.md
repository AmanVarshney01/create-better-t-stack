# Alchemy v2 beta integration findings

This is the evidence log for upstream Alchemy issues found while integrating Cloudflare deployment
in Better-T-Stack. Keep confirmed defects separate from limitations and disproved review claims so
future upgrades do not remove workarounds prematurely or preserve them after upstream fixes.

Last verified: 2026-08-01

- Accepted dependency and current `next` tag: `alchemy@2.0.0-beta.67`, tag commit
  [`da667f7`](https://github.com/alchemy-run/alchemy/commit/da667f7d46751fe93952cfeb49768e6eb8212693)
- Upstream main inspected: commit
  [`73d7de6`](https://github.com/alchemy-run/alchemy/commit/73d7de6e3cc095823845237c547f813db89563c9)
- Runnable beta.61 reproductions:
  [`AmanVarshney01/alchemy-v2-beta-repros@31b7a35`](https://github.com/AmanVarshney01/alchemy-v2-beta-repros/tree/31b7a35e66956131d0a81726e032290517f70862)

Do not remove a workaround merely because a fix is on main. Wait for a release containing the fix,
upgrade the pinned dependency, and rerun the generated-project smoke test.

In the table, “Confirmed” describes evidence against the published beta: source inspection, a
provider-free plan, or a runnable/live reproduction as detailed below. Main statuses are source-only
unless they explicitly say live-reverified. Registry and OAuth observations are labeled separately.

## Confirmed defects and publication hazards

| ID  | Finding                                                             | Accepted beta.67 status     | Upstream status on 2026-08-01                                                                               | Current handling or required action                                            |
| --- | ------------------------------------------------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| A1  | `StaticSite` serializes unresolved `Output` values before `Build`   | Fixed and live-qualified    | Released through merged [#796](https://github.com/alchemy-run/alchemy/pull/796)                             | Removed `outputAwareStaticSite`; use native `StaticSite` Inputs                |
| A2  | `StaticSite` serializes `Config` values as `{"_id":"Config"}`       | Fixed and live-qualified    | Released through merged [#796](https://github.com/alchemy-run/alchemy/pull/796)                             | Removed caller-side Config resolution; pass Config directly                    |
| A3  | `Website.Vite` misses pure-client output                            | Fixed and live-qualified    | Released through merged [#795](https://github.com/alchemy-run/alchemy/pull/795)                             | TanStack Router uses the fixed SPA path; SolidStart v2 uses `Website.Vite` SSR |
| A4  | React Router builds a Worker with no registered handler             | Mitigated                   | Custom `main`, relative resolution, and loud invalid-handler errors are released; no handler is synthesized | Generate an explicit registered Worker entry                                   |
| A5  | Default `Command.Build` memo scope misses sibling workspace changes | Confirmed                   | Generic `StaticSite` still requires explicit scope; #822 improves `Website.Vite`                            | Generated `StaticSite` builds disable memo reuse                               |
| A6  | A published test prerelease can satisfy beta caret ranges           | Confirmed                   | N/A; npm package deprecated                                                                                 | Pin beta.67 and its Effect peers exactly                                       |
| A7  | Worker Assets drops `_headers` and `_redirects`                     | Fixed in released source    | Released through merged [#928](https://github.com/alchemy-run/alchemy/pull/928)                             | Canonical live recheck remains before claiming complete rule parity            |
| A8  | Worker Assets assigns incomplete MIME types                         | Confirmed                   | Still present in beta.67; no matching issue or PR found                                                     | Do not claim full static-asset parity                                          |
| A9  | Published Cloudflare packages have incompatible peer ranges         | Confirmed                   | Still present in beta.67                                                                                    | Accept the non-fatal warning; do not add a template-level transitive override  |
| A10 | beta.66 local D1 migrations cannot open the Cloudflare runtime      | Fixed and locally qualified | Released through merged [#1009](https://github.com/alchemy-run/alchemy/pull/1009)                           | beta.67 applies real nested Prisma migrations in `alchemy dev`                 |

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
`2.0.0-beta.67` exactly together with `effect`, `@effect/platform-node`, and
`@effect/platform-bun` at `4.0.0-beta.101`.

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
[`11-assets-mime-types`](https://github.com/AmanVarshney01/alchemy-v2-beta-repros/tree/31b7a35e66956131d0a81726e032290517f70862/11-assets-mime-types)
reproduction observed `application/octet-stream` for `.avif`, `.jpg`, `.webp`, and `.woff2` on
beta.61. Its owned Worker stage was destroyed after verification. Source inspection confirms the
same fallback remains in beta.67 source.

There is no generic Better-T-Stack workaround at the uploader boundary. Closure condition: a
published Alchemy release must use a complete, charset-aware MIME resolver and the live fixture must
serve every expected content type.

### A9: published Cloudflare packages have incompatible peer ranges

Alchemy beta.64 depends on `@distilled.cloud/cloudflare@0.30.1` together with
`@distilled.cloud/cloudflare-runtime@0.13.8` and
`@distilled.cloud/cloudflare-vite-plugin@0.13.8`. Both `0.13.8` packages declare
`@distilled.cloud/cloudflare` as `^0.29.0`, which excludes `0.30.1` under semver rules. Fresh Bun
installs of generated combined, Astro, Next.js, and React Router projects therefore report
`incorrect peer dependency "@distilled.cloud/cloudflare@0.30.1"` even though installation and
typechecking continue.

This mismatch is wholly inside Alchemy's published dependency graph. Better-T-Stack must not pin or
override the transitive Distilled packages independently because that can split the runtime/plugin
protocol. Closure condition: an Alchemy release must consume Cloudflare packages whose dependency
and peer ranges agree, and fresh generated installs must complete without this warning.

Beta.67 keeps `@distilled.cloud/cloudflare@0.30.3` with runtime and Vite plugin `0.15.0`; those
packages still declare the incompatible `^0.29.0` peer range. Fresh generated beta.67 installs also
emit non-fatal Effect peer warnings even though Alchemy's own declared Effect floor accepts the
exact generated beta.101 peers. Do not paper over either warning with a template override.

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
beta.67 to replace beta.64. The generated production `migrationsDir` remains required; it is product
wiring, not an A10 workaround.

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
- Astro SSR can use the current `StaticSite` foundation with `dist/client`,
  `dist/server/entry.mjs`, and `bundle: false`; Alchemy's
  [issue #621](https://github.com/alchemy-run/alchemy/issues/621) live-proved that basic
  shape. Alchemy still does not consume Astro's generated Wrangler/deploy metadata for the
  compatibility date, flags, custom entry, assets, conditional `SESSION`/`IMAGES` bindings, custom
  binding names, or auxiliary workers. This is an unsupported integration gap rather than proof
  that the `StaticSite` foundation should be removed.
  Draft [Alchemy PR #886](https://github.com/alchemy-run/alchemy/pull/886) proposes first-class
  Astro, SvelteKit, Nuxt, and Waku resources, but remains conflicting and unreleased at
  `e03bdbf`. Its current Astro branch loads the project's Astro config natively, while its prose
  still describes the config as ignored/default-server; session, Images, and custom binding parity
  therefore still need focused review and live gates before replacing the generated `StaticSite`
  paths. Draft [Alchemy PR #923](https://github.com/alchemy-run/alchemy/pull/923) proposes a
  first-class Next.js resource but is stacked on #886, conflicting, and unreleased.
- Better-T-Stack explicitly maps Astro's `SESSION` and `IMAGES` bindings in both relevant generated
  paths. Build, development, and deployment compatibility dates still need an intentional alignment
  policy; that is a generator policy gap rather than an Alchemy core defect.

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
