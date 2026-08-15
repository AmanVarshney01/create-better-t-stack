## Why

Better T Stack should offer Nitro as a native backend for users who want its file-based routing, portable Web API runtime, and deployment presets without coupling their server to a frontend framework. Nitro 3 is now the version published under npm's `latest` tag and already underpins generated Solid and TanStack Start applications, so exposing its backend model directly makes the stack matrix more coherent.

## What Changes

- Add Nitro as an experimental backend choice throughout the CLI, saved configuration, generated README, and web stack builder.
- Generate the official Nitro 3 standalone project structure and native Nitro scripts instead of wrapping another HTTP framework.
- Integrate supported API layers, authentication, databases, ORMs, examples, and environment handling with Nitro's Web Request and file-route APIs.
- Support deployment only through documented provider paths: Nitro output for Docker, Nitro's Vercel preset through Vercel Services, and Prisma Compute's supported custom-build contract.
- Add deterministic generation/build/runtime coverage across package managers and representative stack combinations, plus disposable live deployment verification where provider credentials are available.
- Keep Cloudflare server deployment unavailable until Alchemy exposes a first-class standalone Nitro adapter; do not emulate one with a generic Worker or custom proxy.
- Treat Nitro as experimental while Nitro 3 remains a prerelease package, without pinning undocumented internals.

Non-goals:

- Do not add a second framework selection within Nitro or run Hono, Express, Fastify, or Elysia inside it.
- Do not add provider-specific shims, generated compatibility servers, or unreleased Alchemy APIs.
- Do not change existing backend output unless needed for shared validation or display logic.

## Capabilities

### New Capabilities

- `nitro-backend`: Native Nitro backend selection, generation, integration compatibility, deployment behavior, and verification requirements.

### Modified Capabilities

None.

## Impact

The change affects backend schemas and validation in `packages/types`, CLI prompts and summaries in `apps/cli`, backend and deployment generation in `packages/template-generator`, stack-builder options in `apps/web`, generated documentation, and compatibility/matrix tests. It adds Nitro's CLI/runtime packages to generated Nitro servers but does not add a new root runtime dependency. Cloudflare support is release-gated on a public first-class Alchemy adapter; other provider support must use released documented contracts.
