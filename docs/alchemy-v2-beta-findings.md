# Alchemy v2 beta integration findings

This is the evidence log for upstream Alchemy issues found while integrating Cloudflare deployment
in Better-T-Stack. Keep confirmed defects separate from limitations and disproved review claims so
future upgrades do not remove workarounds prematurely or preserve them after upstream fixes.

Last verified: 2026-07-10

- Published dependency: `alchemy@2.0.0-beta.61`, tag commit
  [`3ddf4d6`](https://github.com/alchemy-run/alchemy-effect/commit/3ddf4d61697dd896d6db478060a1dd57d77948d5)
- Upstream main inspected: commit
  [`87244a5`](https://github.com/alchemy-run/alchemy-effect/commit/87244a57cc03d32b1948af641a5fd9f38e848636)
- Runnable beta.61 reproductions:
  [`AmanVarshney01/alchemy-v2-beta-repros@5be48bd`](https://github.com/AmanVarshney01/alchemy-v2-beta-repros/tree/5be48bdb63e61d49fba60e009024fdae60935d1f)

Do not remove a workaround merely because a fix is on main. Wait for a release containing the fix,
upgrade the pinned dependency, and rerun the generated-project smoke test.

In the table, “Confirmed” describes evidence against the published beta: source inspection, a
provider-free plan, or a runnable/live reproduction as detailed below. Main statuses are source-only
unless they explicitly say live-reverified. Registry and OAuth observations are labeled separately.

## Confirmed defects and publication hazards

| ID  | Finding                                                             | beta.61   | Main at `87244a5`                                                       | Current handling or required action                                              |
| --- | ------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| A1  | `StaticSite` serializes unresolved `Output` values before `Build`   | Confirmed | Still present                                                           | `outputAwareStaticSite` maps Outputs before serialization                        |
| A2  | `StaticSite` serializes `Config` values as `{"_id":"Config"}`       | Confirmed | Still present                                                           | Resolve Config values inside an `Effect.gen` props builder                       |
| A3  | `Website.Vite` misses pure-client output                            | Confirmed | Fixed by [#795](https://github.com/alchemy-run/alchemy-effect/pull/795) | Use `StaticSite` for TanStack Router and Solid until a fixed version is released |
| A4  | React Router builds a Worker with no registered handler             | Confirmed | Default remains; custom `main` added                                    | Generate an explicit Worker entry and workerd-compatible server rendering        |
| A5  | Default `Command.Build` memo scope misses sibling workspace changes | Confirmed | Still present                                                           | Generated `StaticSite` builds disable memo reuse                                 |
| A6  | A published test prerelease can satisfy beta caret ranges           | Confirmed | N/A; npm package deprecated                                             | Pin the exact Alchemy beta instead of using a caret range                        |

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

That one-off harness was run during PR
[#1110](https://github.com/AmanVarshney01/create-better-t-stack/pull/1110) but is not yet checked
into the canonical reproduction repository. Add it there before relying on this check during a
future upgrade.

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
[`3-config-in-staticsite-build-env`](https://github.com/AmanVarshney01/alchemy-v2-beta-repros/tree/5be48bdb63e61d49fba60e009024fdae60935d1f/3-config-in-staticsite-build-env).

Resolve Config values in an `Effect.gen` props builder and terminate its configuration error channel
with `Effect.orDie` before passing the props to `StaticSite` or the compatibility wrapper.

Removal condition: a released `StaticSite` must pass the configured string—not the Config
descriptor—to the build without requiring callers to resolve it manually.

### A3: `Website.Vite` misses pure-client output

In beta.61, the output collector's post-order `buildApp` hook can resolve before the client
environment's `writeBundle` hook. Alchemy then reports `Vite build produced neither assets nor
server output` even though Vite wrote the SPA assets. See
[`1-vite-spa-no-output`](https://github.com/AmanVarshney01/alchemy-v2-beta-repros/tree/5be48bdb63e61d49fba60e009024fdae60935d1f/1-vite-spa-no-output).

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
[`4-react-router-handlerless-worker`](https://github.com/AmanVarshney01/alchemy-v2-beta-repros/tree/5be48bdb63e61d49fba60e009024fdae60935d1f/4-react-router-handlerless-worker).

Main now plumbs a `main` option through `Website.Vite`, which supplies a custom-entry escape hatch.
The default React Router entry selection is unchanged. Two related integration constraints are not
classified as Alchemy core defects here: the beta workaround's custom Vite input must be absolute
because of downstream plugin resolution, and React Router's built-in Node streaming entry can fail
in workerd because `renderToPipeableStream` is unavailable there. Better-T-Stack keeps an explicit
request-handler Worker entry and uses React Router's web-stream `renderToReadableStream` behavior.

Removal condition: the released default `Website.Vite` React Router path must deploy a registered
handler and successfully serve a document request without a generated custom entry.

### A5: default build memoization misses monorepo dependencies

[`Command.Build` memoization](https://github.com/alchemy-run/alchemy-effect/blob/v2.0.0-beta.61/packages/alchemy/src/Command/Memo.ts)
hashes files under `cwd` plus the nearest lockfile. Changing a sibling workspace package imported by
the frontend does not change the default hash, so a deploy can reuse stale output. The relevant
Build/Memo source is unchanged on the inspected main commit.

Alchemy accepts explicit `memo.include` globs that reach outside `cwd`. When using them, also set
`lockfile: true`, because an explicit include disables lockfile hashing by default. Otherwise run
`alchemy deploy --force` after changing shared packages. CI deployment jobs should prefer
correctness over the default memo scope. Better-T-Stack currently sets `memo: false` for generated
`StaticSite` builds, ensuring shared-package changes rebuild at the cost of skipping this cache.

Removal condition for `memo: false`: configure complete external memo includes or adopt a
workspace-aware upstream default, then prove that editing an imported sibling workspace with no
lockfile change makes the next normal deploy rebuild the frontend.

### A6: publication hazard from an incompatible test build

`alchemy@2.0.0-pipeline-v2-test` sorts above `2.0.0-beta.x` under standard prerelease ordering and
was observed satisfying a caret beta range under Bun despite lacking expected Cloudflare exports.
The package is now deprecated on npm, but it remains published. Better-T-Stack pins
`2.0.0-beta.61` exactly.

Removal condition: move away from exact pinning only after the proposed replacement range is proven
unable to select the incompatible prerelease under every package manager supported by generated
projects.

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

## Disproved claims

These were investigated and must not be filed as Alchemy bugs without new evidence:

- **“Alchemy v2 reads D1 migration directories non-recursively.”** False. [`SqlFile`](https://github.com/alchemy-run/alchemy-effect/blob/v2.0.0-beta.61/packages/alchemy/src/Sql/SqlFile.ts)
  calls `readDirectory(directory, { recursive: true })`. Prisma's local Wrangler integration needed
  a full nested `migrations_pattern`; that is separate from Alchemy's deploy path.
- **“A pure `StaticSite` requires an explicit Worker entrypoint.”** False. `StaticSite` injects a
  fallback Worker that forwards requests to `env.ASSETS` when neither `main` nor `script` is set.
- **“Implicit `nodejs_compat` is lost during upload.”** False for
  [the linked reproduction](https://github.com/AmanVarshney01/alchemy-v2-beta-repros/tree/5be48bdb63e61d49fba60e009024fdae60935d1f/2-nodejs-compat-default-lost).
  [`Platform`](https://github.com/alchemy-run/alchemy-effect/blob/v2.0.0-beta.61/packages/alchemy/src/Platform.ts)
  intentionally marks a non-Effect Worker entrypoint as external, and compatibility defaults are
  only added to Effect-native Workers. External Workers must declare required flags explicitly.
  The canonical reproduction repository's item 2 is therefore misclassified.
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
11. Recheck prerelease range resolution with the generated project's package manager.
12. Remove a workaround only after its specific removal gate passes without it.
