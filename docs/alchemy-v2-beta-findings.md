# Alchemy v2 beta integration findings

This is the evidence log for upstream Alchemy issues found while integrating Cloudflare deployment
in Better-T-Stack. Keep confirmed defects separate from limitations and disproved review claims so
future upgrades do not remove workarounds prematurely or preserve them after upstream fixes.

Last verified: 2026-07-13

- Published dependency: `alchemy@2.0.0-beta.61`, tag commit
  [`3ddf4d6`](https://github.com/alchemy-run/alchemy-effect/commit/3ddf4d61697dd896d6db478060a1dd57d77948d5)
- Upstream main inspected: commit
  [`a644c85`](https://github.com/alchemy-run/alchemy-effect/commit/a644c854dd2438edaa0ff7ef03cb0e68653f8c3b)
- Runnable beta.61 reproductions:
  [`AmanVarshney01/alchemy-v2-beta-repros@31b7a35`](https://github.com/AmanVarshney01/alchemy-v2-beta-repros/tree/31b7a35e66956131d0a81726e032290517f70862)

Do not remove a workaround merely because a fix is on main. Wait for a release containing the fix,
upgrade the pinned dependency, and rerun the generated-project smoke test.

In the table, “Confirmed” describes evidence against the published beta: source inspection, a
provider-free plan, or a runnable/live reproduction as detailed below. Main statuses are source-only
unless they explicitly say live-reverified. Registry and OAuth observations are labeled separately.

## Confirmed defects and publication hazards

| ID  | Finding                                                             | beta.61   | Main at `a644c85`                                                                                             | Current handling or required action                                              |
| --- | ------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| A1  | `StaticSite` serializes unresolved `Output` values before `Build`   | Confirmed | Still present; fixed by open [#796](https://github.com/alchemy-run/alchemy-effect/pull/796)                   | `outputAwareStaticSite` maps Outputs before serialization                        |
| A2  | `StaticSite` serializes `Config` values as `{"_id":"Config"}`       | Confirmed | Still present; fixed by open [#796](https://github.com/alchemy-run/alchemy-effect/pull/796)                   | Resolve Config values inside an `Effect.gen` props builder                       |
| A3  | `Website.Vite` misses pure-client output                            | Confirmed | Fixed by merged [#795](https://github.com/alchemy-run/alchemy-effect/pull/795)                                | Use `StaticSite` for TanStack Router and Solid until a fixed version is released |
| A4  | React Router builds a Worker with no registered handler             | Confirmed | Default remains; custom `main` added by merged [#779](https://github.com/alchemy-run/alchemy-effect/pull/779) | Generate an explicit registered Worker entry                                     |
| A5  | Default `Command.Build` memo scope misses sibling workspace changes | Confirmed | Still present; #796 documents explicit external includes                                                      | Generated `StaticSite` builds disable memo reuse                                 |
| A6  | A published test prerelease can satisfy beta caret ranges           | Confirmed | N/A; npm package deprecated                                                                                   | Pin an exact Alchemy version permanently                                         |
| A7  | Worker Assets drops `_headers` and `_redirects`                     | Confirmed | Still present; no matching issue or PR found                                                                  | Do not claim Cloudflare Static Assets rule parity                                |
| A8  | Worker Assets assigns incomplete MIME types                         | Confirmed | Still present; no matching issue or PR found                                                                  | Do not claim full static-asset parity                                            |

### A1: `StaticSite` drops deploy-time Outputs

The beta.61 [`StaticSite` implementation](https://github.com/alchemy-run/alchemy-effect/blob/v2.0.0-beta.61/packages/alchemy/src/Cloudflare/Website/StaticSite.ts)
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
missing value instead of the yielded API Worker's URL. Open PR #796 adds coverage for Output strings,
objects, and null values, but remains unreleased.

The current template delegates to upstream `StaticSite` during development and mirrors its
`Build -> Worker` deploy path with `Output.map` during deployment. Resource identities remain
`web/Build` and `web/Worker`. This workaround handles the top-level env Outputs used by the
generated templates; it is not a general recursive Input serializer.

Removal condition: upstream must preserve Output-valued env entries and their dependency edges
while serializing build env values, and a both-Cloudflare plan/deploy must prove the real server URL
reaches the frontend build.

### A2: `StaticSite` stringifies Effect Config descriptors

The same serializer turns `Config.string("MY_URL")` into `{"_id":"Config"}` and passes that value to
the build subprocess, overriding a valid `process.env.MY_URL`. The runnable reproduction is
[`3-config-in-staticsite-build-env`](https://github.com/AmanVarshney01/alchemy-v2-beta-repros/tree/31b7a35e66956131d0a81726e032290517f70862/3-config-in-staticsite-build-env).

Resolve Config values in an `Effect.gen` props builder and terminate its configuration error channel
with `Effect.orDie` before passing the props to `StaticSite` or the compatibility wrapper.

Removal condition: a released `StaticSite` must pass the configured string—not the Config
descriptor—to the build without requiring callers to resolve it manually.

### A3: `Website.Vite` misses pure-client output

In beta.61, the output collector's post-order `buildApp` hook can resolve before the client
environment's `writeBundle` hook. Alchemy then reports `Vite build produced neither assets nor
server output` even though Vite wrote the SPA assets. See
[`1-vite-spa-no-output`](https://github.com/AmanVarshney01/alchemy-v2-beta-repros/tree/31b7a35e66956131d0a81726e032290517f70862/1-vite-spa-no-output).

Upstream main fixes this in [PR #795](https://github.com/alchemy-run/alchemy-effect/pull/795) by
reading collected output after `builder.buildApp()` resolves. Better-T-Stack must keep its
`StaticSite` fallback until that fix is published and verified.

Removal condition: upgrade to a release containing #795, then deploy and request a pure SPA using
`Website.Vite` without the fallback.

### A4: React Router handler and entrypoint integration

In beta.61, `Website.Vite` can treat React Router's server-build manifest as the Worker entry even
though that manifest has no default handler. The generated default becomes `{}`, and Cloudflare
rejects the upload because it has no registered handler. The beta also lacks a custom `main` escape
hatch, which makes the default-selection defect harder to work around. See
[`4-react-router-handlerless-worker`](https://github.com/AmanVarshney01/alchemy-v2-beta-repros/tree/31b7a35e66956131d0a81726e032290517f70862/4-react-router-handlerless-worker).

Main now plumbs a `main` option through `Website.Vite`, which supplies a custom-entry escape hatch.
The default React Router entry selection is unchanged. Open PR #796 resolves a relative `main`
against the Vite root, while the companion
[cloudflare-tools PR #62](https://github.com/alchemy-run/cloudflare-tools/pull/62) addresses plugin
entry resolution and the silent `{}` handler fallback. The older React Router 8.1 pipeable-stream
failure is version-specific: React Router 8.2 added a Web Streams default, so a fresh unlocked
install cannot be used to reproduce the earlier runtime behavior. Better-T-Stack still keeps an
explicit registered request-handler entry until the released default path passes its live gate.

Removal condition: the released default `Website.Vite` React Router path must deploy a registered
handler and successfully serve a document request without a generated custom entry.

### A5: default build memoization misses monorepo dependencies

[`Command.Build` memoization](https://github.com/alchemy-run/alchemy-effect/blob/v2.0.0-beta.61/packages/alchemy/src/Command/Memo.ts)
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
`2.0.0-beta.61` exactly.

Exact pinning is a permanent publication-safety policy, not a temporary workaround. Changing the
accepted release means replacing one verified exact version with another verified exact version;
Better-T-Stack does not generate an open-ended Alchemy version range.

### A7: Worker Assets drops `_headers` and `_redirects`

Both beta.61 and inspected main read `_headers` and `_redirects`, exclude them from the ordinary
manifest, and include their contents in the asset hash. The Worker provider then uploads only the
asset config and JWT; it never forwards the two parsed strings as Cloudflare asset configuration.
See the beta.61 [`Assets` implementation](https://github.com/alchemy-run/alchemy-effect/blob/v2.0.0-beta.61/packages/alchemy/src/Cloudflare/Workers/Assets.ts)
and current [`WorkerProvider`](https://github.com/alchemy-run/alchemy-effect/blob/a644c854dd2438edaa0ff7ef03cb0e68653f8c3b/packages/alchemy/src/Cloudflare/Workers/WorkerProvider.ts).

The live
[`10-assets-headers-redirects`](https://github.com/AmanVarshney01/alchemy-v2-beta-repros/tree/31b7a35e66956131d0a81726e032290517f70862/10-assets-headers-redirects)
reproduction served the asset without its custom header and returned `404` for the configured
redirect. Its owned Worker stage was destroyed after verification.

There is no Better-T-Stack workaround that can restore arbitrary user/framework asset rules today.
Closure condition: a published Alchemy release must forward both special files and the live repro
must pass for create and update deployments.

### A8: Worker Assets assigns incomplete MIME types

Alchemy's hardcoded asset MIME lookup covers only a small set of extensions. AVIF, JPEG, WebP,
WOFF2, and other common formats fall through to `application/octet-stream`. Wrangler uses a full
MIME resolver instead of this limited table.

The live
[`11-assets-mime-types`](https://github.com/AmanVarshney01/alchemy-v2-beta-repros/tree/31b7a35e66956131d0a81726e032290517f70862/11-assets-mime-types)
reproduction observed `application/octet-stream` for `.avif`, `.jpg`, `.webp`, and `.woff2` on
beta.61. Its owned Worker stage was destroyed after verification. The same fallback remains in
inspected main.

There is no generic Better-T-Stack workaround at the uploader boundary. Closure condition: a
published Alchemy release must use a complete, charset-aware MIME resolver and the live fixture must
serve every expected content type.

## Current limitations, not confirmed upstream defects

- `alchemy logs` was observed failing the Workers observability telemetry query with `Unauthorized`
  when using credentials created by `alchemy login`; `alchemy tail` continued to work. Beta.61 and
  main both request the relevant observability scopes, so this is not source-confirmed as an Alchemy
  defect. Retest with a newly authenticated profile before filing it upstream.
- OpenNext's `WORKER_SELF_REFERENCE` needs a self service binding for on-demand revalidation. The
  beta Worker resource has no clean declarative self-binding path that avoids a dependency cycle.
  Normal request handling works; explicitly test `res.revalidate()` before claiming full ISR support.
- The dev branch of `StaticSite` still uses upstream's serializer. Generated projects intentionally
  pass the server Output in top-level env, but their framework dev servers separately load the
  literal local URL from `.env`; those dev flows were live-tested. This does not prove the upstream
  dev serializer handles Outputs, so keep that distinction explicit.
- A fix present on Alchemy main is not usable by generated projects until it is published and the
  pinned dependency is upgraded.
- Astro SSR can use the current `StaticSite` foundation with `dist/client`,
  `dist/server/entry.mjs`, and `bundle: false`; Alchemy's
  [issue #621](https://github.com/alchemy-run/alchemy-effect/issues/621) live-proved that basic
  shape. Alchemy still does not consume Astro's generated Wrangler/deploy metadata for the
  compatibility date, flags, custom entry, assets, conditional `SESSION`/`IMAGES` bindings, custom
  binding names, or auxiliary workers. This is an unsupported integration gap rather than proof
  that the `StaticSite` foundation should be removed.
- Better-T-Stack independently needs to add `IMAGES` to its separate-backend Astro branch and align
  Astro build/development/deployment compatibility dates. Those are generator defects or policy
  gaps, not Alchemy core defects.

## Disproved claims

These were investigated and must not be filed as Alchemy bugs without new evidence:

- **“Alchemy v2 reads D1 migration directories non-recursively.”** False. [`SqlFile`](https://github.com/alchemy-run/alchemy-effect/blob/v2.0.0-beta.61/packages/alchemy/src/Sql/SqlFile.ts)
  calls `readDirectory(directory, { recursive: true })`. Prisma's local Wrangler integration needed
  a full nested `migrations_pattern`; that is separate from Alchemy's deploy path.
- **“A pure `StaticSite` requires an explicit Worker entrypoint.”** False. `StaticSite` injects a
  fallback Worker that forwards requests to `env.ASSETS` when neither `main` nor `script` is set.
- **“Implicit `nodejs_compat` is lost during upload.”** False for
  [the linked reproduction](https://github.com/AmanVarshney01/alchemy-v2-beta-repros/tree/31b7a35e66956131d0a81726e032290517f70862/2-nodejs-compat-default-lost).
  [`Platform`](https://github.com/alchemy-run/alchemy-effect/blob/v2.0.0-beta.61/packages/alchemy/src/Platform.ts)
  intentionally marks a non-Effect Worker entrypoint as external, and compatibility defaults are
  only added to Effect-native Workers. The observed absence is real, but it is computed before
  upload rather than dropped by WorkerProvider. Open PR #796 proposes changing that default; until
  released, external framework Workers must declare required flags explicitly.
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
