## Context

Better T Stack currently generates framework-owned server entrypoints for Hono, Express, Fastify, and Elysia. Nitro 3 provides a different first-class model: a `nitro.config.ts`, a `server/` source directory with file-based routes, and provider-selected production output. Its current `latest` npm release is still prerelease software, but the repository already generates applications that depend on the same Nitro version through Solid and TanStack Start.

The documented Nitro behavior is:

- `nitro dev` runs the development server and `nitro build` writes the production artifact.
- `server/routes` is scanned for routes and each route exports a Web API-compatible handler through H3/Nitro.
- the runtime selects a local default preset, while detected deployment providers take precedence over `defaultPreset`.
- Node and Bun builds expose `.output/server/index.mjs`; Vercel builds use the Vercel Build Output API.

Inspected Alchemy behavior provides two relevant build contracts:

- Prisma `Compute` has a released command-build contract consisting of a build command, output directory, and output-relative entrypoint. This can package Nitro without teaching Alchemy a Nitro-specific build strategy.
- Alchemy `Command.Build` can own an arbitrary framework build, and `Cloudflare.Worker` can deploy a prebuilt ESM entrypoint byte-for-byte with sibling modules, static assets, runtime bindings, and the normal local workerd lifecycle. Nitro's documented `cloudflare_module` preset emits exactly that shape.

## Goals / Non-Goals

**Goals:**

- Generate a native Nitro 3 backend with official configuration, file routing, imports, scripts, and output conventions.
- Preserve the existing stack experience for oRPC, tRPC, Better Auth, Clerk, databases, ORMs, payments, examples, web/native clients, and task runners wherever those features have portable Web API integrations.
- Make every provider choice truthful at prompt/validation time.
- Verify source generation, dependency installation, typechecking, production builds, runtime routes, container output, and live provider behavior.

**Non-Goals:**

- Embedding another backend framework inside Nitro.
- Creating a bespoke server wrapper around Nitro output.
- Adding a generated compatibility server or modifying Nitro's provider output.
- Enabling evlog until it has a Nitro integration.
- Depending on unreleased provider code.

## Decisions

### Generate Nitro's standalone CLI layout

The server package will own `nitro.config.ts`, extend `nitro/tsconfig`, and place handlers under `server/routes`. Shared application logic remains in the existing workspace packages.

Alternative considered: keep `src/index.ts` and mount H3/Hono manually through Nitro's custom server entry. Rejected because it discards the file-routing DX the backend selection is meant to provide and creates another integration surface.

### Support Node and Bun as runtime defaults

Nitro will receive `defaultPreset: "node"` for the Node runtime and `defaultPreset: "bun"` for Bun. `defaultPreset` is used instead of `preset` so provider auto-detection, especially Vercel, can override it as documented. Development uses `nitro dev` in both cases.

### Use Web Request adapters for integrations

Better Auth receives the route event's `Request`. oRPC uses its fetch handlers, and tRPC uses its fetch adapter. Context creation will accept a `Request`, keeping auth/session logic independent of H3 internals. CORS and native redirect handlers use H3's documented response APIs.

### Use provider-native build contracts

| Deployment | Runtime            | Contract                                                              | Status                                              |
| ---------- | ------------------ | --------------------------------------------------------------------- | --------------------------------------------------- |
| None       | Node/Bun           | Nitro dev/build                                                       | Supported                                           |
| Docker     | Node               | `.output/server/index.mjs` in a Node image                            | Supported                                           |
| Docker     | Bun                | `.output/server/index.mjs` in a Bun image                             | Supported                                           |
| Prisma     | Node/Bun           | `Prisma.Compute` command build of `.output`, entry `server/index.mjs` | Supported                                           |
| Vercel     | Node/Bun selection | Vercel Services `nitro` framework and Nitro's detected Vercel preset  | Supported, experimental with existing Vercel option |
| Cloudflare | Workers            | Nitro `cloudflare_module` build + Alchemy prebuilt Worker and assets  | Supported                                           |

The generated Nitro config uses the selected runtime as its default preset. Workers selects `cloudflare_module`; Node and Bun retain their native defaults. Vercel provider detection can still override Node and Bun defaults.

For Cloudflare, Alchemy runs the generated Nitro build from `apps/server`, tracks `.output`, deploys `.output/server/index.mjs` with `bundle: false`, uploads `.output/public` as Worker assets, enables `nodejs_compat`, and keeps the normal workerd dev server on port 3000. This is direct composition of two released provider contracts, not a framework wrapper.

### Retain existing cross-product rules

- tRPC remains limited to frontends that already have generated tRPC clients; oRPC and no API retain their current frontend matrix.
- Existing ORM/database compatibility remains unchanged for Node and Bun.
- Better Auth and Clerk retain their existing frontend compatibility. Nitro implements the server request boundary for both.
- Todo requires a database and API. AI requires a backend and a frontend with an existing AI client template.
- evlog is excluded because its current setup rewrites framework-specific server entrypoints.

### Mark Nitro experimental at selection points

The CLI and web builder will label Nitro as experimental while npm's current Nitro 3 release is a prerelease. Generated source uses the repository's centralized Nitro version and documented public APIs only.

## Risks / Trade-offs

- [Nitro 3 public APIs can still change] → Keep its version centralized, label the choice experimental, and cover official project shape plus builds in the generated matrix.
- [A build may work locally but package incorrectly for a provider] → Inspect provider source and run disposable live deployments with route probes and teardown.
- [Global middleware can accidentally consume request bodies before RPC handlers] → Implement CORS without parsing bodies and test POST and preflight requests.
- [Provider detection can be blocked by a hard-coded preset] → Use `defaultPreset`, then assert Vercel and local outputs separately.
- [A new backend value can drift across CLI and builder] → Drive both from the shared schema where possible and add CLI, JSON schema, builder, and preview assertions.
- [Prebuilt Cloudflare output may contain sibling ESM chunks] → Deploy it with `bundle: false`; Alchemy recursively uploads the default `.mjs` and `.js` module rules from the entrypoint directory.
- [A framework-owned dev server would not receive real Cloudflare bindings] → Keep Alchemy's local workerd runtime instead of configuring an external Nitro dev process.

## Migration Plan

1. Add the schema value and compatibility rules without changing existing defaults.
2. Add generation and integration templates behind `backend === "nitro"`.
3. Add deployment generation for Docker, Prisma, and Vercel.
4. Regenerate derived builder/template assets.
5. Run repository tests and generated application verification.
6. Live-deploy disposable targets, including Cloudflare, probe routes, and destroy them.

Rollback consists of reverting the Nitro schema option and its isolated templates/processors. Existing generated stacks are unaffected because Nitro is opt-in.

## Open Questions

None.
