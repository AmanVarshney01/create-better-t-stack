export type TechResourceLinks = {
  docsUrl?: string;
  githubUrl?: string;
};

type LinkMap = Record<string, TechResourceLinks>;

const BASE_LINKS: LinkMap = {
  trpc: { docsUrl: "https://trpc.io/docs", githubUrl: "https://github.com/trpc/trpc" },
  orpc: { docsUrl: "https://orpc.unnoq.com/", githubUrl: "https://github.com/unnoq/orpc" },
  "ts-rest": {
    docsUrl: "https://ts-rest.com/",
    githubUrl: "https://github.com/ts-rest/ts-rest",
  },
  garph: { docsUrl: "https://garph.dev/", githubUrl: "https://github.com/ghoullier/garph" },
  "tanstack-router": {
    docsUrl: "https://tanstack.com/router/latest",
    githubUrl: "https://github.com/TanStack/router",
  },
  "react-router": {
    docsUrl: "https://reactrouter.com/",
    githubUrl: "https://github.com/remix-run/react-router",
  },
  "tanstack-start": {
    docsUrl: "https://tanstack.com/start/latest",
    githubUrl: "https://github.com/TanStack/router",
  },
  next: { docsUrl: "https://nextjs.org/docs", githubUrl: "https://github.com/vercel/next.js" },
  nuxt: { docsUrl: "https://nuxt.com/docs", githubUrl: "https://github.com/nuxt/nuxt" },
  svelte: { docsUrl: "https://svelte.dev/docs", githubUrl: "https://github.com/sveltejs/svelte" },
  solid: { docsUrl: "https://docs.solidjs.com/", githubUrl: "https://github.com/solidjs/solid" },
  "solid-start": {
    docsUrl: "https://docs.solidjs.com/solid-start",
    githubUrl: "https://github.com/solidjs/solid-start",
  },
  astro: { docsUrl: "https://docs.astro.build/", githubUrl: "https://github.com/withastro/astro" },
  qwik: { docsUrl: "https://qwik.dev/docs/", githubUrl: "https://github.com/QwikDev/qwik" },
  angular: { docsUrl: "https://angular.dev/", githubUrl: "https://github.com/angular/angular" },
  redwood: {
    docsUrl: "https://docs.rwsdk.com/",
    githubUrl: "https://github.com/redwoodjs/redwood",
  },
  fresh: { docsUrl: "https://fresh.deno.dev/docs", githubUrl: "https://github.com/denoland/fresh" },
  react: { docsUrl: "https://react.dev/", githubUrl: "https://github.com/facebook/react" },
  vue: { docsUrl: "https://vuejs.org/guide/", githubUrl: "https://github.com/vuejs/core" },
  bun: { docsUrl: "https://bun.sh/docs", githubUrl: "https://github.com/oven-sh/bun" },
  node: {
    docsUrl: "https://nodejs.org/docs/latest/api/",
    githubUrl: "https://github.com/nodejs/node",
  },
  workers: {
    docsUrl: "https://developers.cloudflare.com/workers/",
    githubUrl: "https://github.com/cloudflare/workers-sdk",
  },
  hono: { docsUrl: "https://hono.dev/docs", githubUrl: "https://github.com/honojs/hono" },
  elysia: { docsUrl: "https://elysiajs.com/", githubUrl: "https://github.com/elysiajs/elysia" },
  express: { docsUrl: "https://expressjs.com/", githubUrl: "https://github.com/expressjs/express" },
  fastify: {
    docsUrl: "https://fastify.dev/docs/latest/",
    githubUrl: "https://github.com/fastify/fastify",
  },
  nestjs: { docsUrl: "https://docs.nestjs.com/", githubUrl: "https://github.com/nestjs/nest" },
  encore: {
    docsUrl: "https://encore.dev/docs/ts",
    githubUrl: "https://github.com/encoredev/encore",
  },
  adonisjs: {
    docsUrl: "https://docs.adonisjs.com/",
    githubUrl: "https://github.com/adonisjs/core",
  },
  nitro: { docsUrl: "https://nitro.build/guide", githubUrl: "https://github.com/nitrojs/nitro" },
  fets: {
    docsUrl: "https://the-guild.dev/openapi/fets",
    githubUrl: "https://github.com/the-guild-org/fets",
  },
  convex: {
    docsUrl: "https://docs.convex.dev/",
    githubUrl: "https://github.com/get-convex/convex-js",
  },
  "self-next": {
    docsUrl: "https://nextjs.org/docs",
    githubUrl: "https://github.com/vercel/next.js",
  },
  "self-tanstack-start": {
    docsUrl: "https://tanstack.com/start/latest",
    githubUrl: "https://github.com/TanStack/router",
  },
  "self-astro": {
    docsUrl: "https://docs.astro.build/",
    githubUrl: "https://github.com/withastro/astro",
  },
  "self-nuxt": { docsUrl: "https://nuxt.com/docs", githubUrl: "https://github.com/nuxt/nuxt" },
  "self-svelte": {
    docsUrl: "https://svelte.dev/docs/kit",
    githubUrl: "https://github.com/sveltejs/kit",
  },
  "self-solid-start": {
    docsUrl: "https://docs.solidjs.com/solid-start",
    githubUrl: "https://github.com/solidjs/solid-start",
  },
  "native-bare": { docsUrl: "https://docs.expo.dev/", githubUrl: "https://github.com/expo/expo" },
  "native-uniwind": {
    docsUrl: "https://www.uniwind.dev/",
    githubUrl: "https://github.com/uniwind/uniwind",
  },
  "native-unistyles": {
    docsUrl: "https://www.unistyl.es/v3/start/introduction",
    githubUrl: "https://github.com/jpudysz/react-native-unistyles",
  },
  sqlite: {
    docsUrl: "https://www.sqlite.org/docs.html",
    githubUrl: "https://github.com/sqlite/sqlite",
  },
  postgres: {
    docsUrl: "https://www.postgresql.org/docs/",
    githubUrl: "https://github.com/postgres/postgres",
  },
  mysql: {
    docsUrl: "https://dev.mysql.com/doc/",
    githubUrl: "https://github.com/mysql/mysql-server",
  },
  mongodb: {
    docsUrl: "https://www.mongodb.com/docs/",
    githubUrl: "https://github.com/mongodb/mongo",
  },
  edgedb: { docsUrl: "https://docs.geldata.com/", githubUrl: "https://github.com/geldata/gel" },
  redis: { docsUrl: "https://redis.io/docs/latest/", githubUrl: "https://github.com/redis/redis" },
  drizzle: {
    docsUrl: "https://orm.drizzle.team/docs/overview",
    githubUrl: "https://github.com/drizzle-team/drizzle-orm",
  },
  prisma: { docsUrl: "https://www.prisma.io/docs", githubUrl: "https://github.com/prisma/prisma" },
  mongoose: {
    docsUrl: "https://mongoosejs.com/docs/",
    githubUrl: "https://github.com/Automattic/mongoose",
  },
  typeorm: { docsUrl: "https://typeorm.io/", githubUrl: "https://github.com/typeorm/typeorm" },
  kysely: {
    docsUrl: "https://kysely.dev/docs/",
    githubUrl: "https://github.com/kysely-org/kysely",
  },
  mikroorm: {
    docsUrl: "https://mikro-orm.io/docs",
    githubUrl: "https://github.com/mikro-orm/mikro-orm",
  },
  sequelize: {
    docsUrl: "https://sequelize.org/docs/v6/",
    githubUrl: "https://github.com/sequelize/sequelize",
  },
  turso: {
    docsUrl: "https://docs.turso.tech/",
    githubUrl: "https://github.com/tursodatabase/turso",
  },
  d1: {
    docsUrl: "https://developers.cloudflare.com/d1/",
    githubUrl: "https://github.com/cloudflare/workers-sdk",
  },
  neon: { docsUrl: "https://neon.tech/docs", githubUrl: "https://github.com/neondatabase/neon" },
  "prisma-postgres": {
    docsUrl: "https://www.prisma.io/postgres",
    githubUrl: "https://github.com/prisma/prisma",
  },
  "mongodb-atlas": { docsUrl: "https://www.mongodb.com/docs/atlas/" },
  supabase: {
    docsUrl: "https://supabase.com/docs",
    githubUrl: "https://github.com/supabase/supabase",
  },
  planetscale: {
    docsUrl: "https://planetscale.com/docs",
    githubUrl: "https://github.com/planetscale/database-js",
  },
  upstash: { docsUrl: "https://upstash.com/docs", githubUrl: "https://github.com/upstash" },
  docker: { docsUrl: "https://docs.docker.com/", githubUrl: "https://github.com/docker/docs" },
  cloudflare: {
    docsUrl: "https://developers.cloudflare.com/",
    githubUrl: "https://github.com/cloudflare/cloudflare-docs",
  },
  fly: { docsUrl: "https://fly.io/docs/", githubUrl: "https://github.com/superfly/docs" },
  railway: { docsUrl: "https://docs.railway.com/" },
  sst: { docsUrl: "https://sst.dev/docs/", githubUrl: "https://github.com/sst/sst" },
  "better-auth": {
    docsUrl: "https://www.better-auth.com/docs",
    githubUrl: "https://github.com/better-auth/better-auth",
  },
  clerk: { docsUrl: "https://clerk.com/docs", githubUrl: "https://github.com/clerk/javascript" },
  nextauth: {
    docsUrl: "https://authjs.dev/",
    githubUrl: "https://github.com/nextauthjs/next-auth",
  },
  "stack-auth": {
    docsUrl: "https://docs.stack-auth.com/",
    githubUrl: "https://github.com/stack-auth/stack-auth",
  },
  "supabase-auth": {
    docsUrl: "https://supabase.com/docs/guides/auth",
    githubUrl: "https://github.com/supabase/supabase",
  },
  auth0: { docsUrl: "https://auth0.com/docs", githubUrl: "https://github.com/auth0" },
  polar: { docsUrl: "https://docs.polar.sh/", githubUrl: "https://github.com/polarsource/polar" },
  stripe: {
    docsUrl: "https://docs.stripe.com/",
    githubUrl: "https://github.com/stripe/stripe-node",
  },
  "lemon-squeezy": { docsUrl: "https://docs.lemonsqueezy.com/" },
  paddle: {
    docsUrl: "https://developer.paddle.com/",
    githubUrl: "https://github.com/PaddleHQ/paddle-node-sdk",
  },
  dodo: { docsUrl: "https://docs.dodopayments.com/" },
  resend: {
    docsUrl: "https://resend.com/docs",
    githubUrl: "https://github.com/resend/resend-node",
  },
  "react-email": {
    docsUrl: "https://react.email/docs",
    githubUrl: "https://github.com/resend/react-email",
  },
  nodemailer: {
    docsUrl: "https://nodemailer.com/",
    githubUrl: "https://github.com/nodemailer/nodemailer",
  },
  postmark: {
    docsUrl: "https://postmarkapp.com/developer",
    githubUrl: "https://github.com/ActiveCampaign/postmark.js",
  },
  sendgrid: {
    docsUrl: "https://docs.sendgrid.com/",
    githubUrl: "https://github.com/sendgrid/sendgrid-nodejs",
  },
  "aws-ses": {
    docsUrl: "https://docs.aws.amazon.com/ses/",
    githubUrl: "https://github.com/aws/aws-sdk-js-v3",
  },
  mailgun: {
    docsUrl: "https://documentation.mailgun.com/",
    githubUrl: "https://github.com/mailgun/mailgun.js",
  },
  plunk: { docsUrl: "https://docs.useplunk.com/", githubUrl: "https://github.com/useplunk/plunk" },
  uploadthing: {
    docsUrl: "https://docs.uploadthing.com/",
    githubUrl: "https://github.com/pingdotgg/uploadthing",
  },
  filepond: {
    docsUrl: "https://pqina.nl/filepond/docs/",
    githubUrl: "https://github.com/pqina/filepond",
  },
  uppy: { docsUrl: "https://uppy.io/docs/", githubUrl: "https://github.com/transloadit/uppy" },
  pino: { docsUrl: "https://getpino.io/#/", githubUrl: "https://github.com/pinojs/pino" },
  winston: {
    docsUrl: "https://github.com/winstonjs/winston#readme",
    githubUrl: "https://github.com/winstonjs/winston",
  },
  opentelemetry: {
    docsUrl: "https://opentelemetry.io/docs/",
    githubUrl: "https://github.com/open-telemetry/opentelemetry-js",
  },
  sentry: {
    docsUrl: "https://docs.sentry.io/",
    githubUrl: "https://github.com/getsentry/sentry-javascript",
  },
  grafana: {
    docsUrl: "https://grafana.com/docs/",
    githubUrl: "https://github.com/grafana/grafana",
  },
  growthbook: {
    docsUrl: "https://docs.growthbook.io/",
    githubUrl: "https://github.com/growthbook/growthbook",
  },
  posthog: { docsUrl: "https://posthog.com/docs", githubUrl: "https://github.com/PostHog/posthog" },
  plausible: {
    docsUrl: "https://plausible.io/docs",
    githubUrl: "https://github.com/plausible/analytics",
  },
  effect: {
    docsUrl: "https://effect.website/docs/",
    githubUrl: "https://github.com/Effect-TS/effect",
  },
  "effect-full": {
    docsUrl: "https://effect.website/docs/",
    githubUrl: "https://github.com/Effect-TS/effect",
  },
  "chat-sdk": {
    docsUrl: "https://chat-sdk.dev/docs",
    githubUrl: "https://github.com/vercel/chat",
  },
  zustand: {
    docsUrl: "https://zustand.docs.pmnd.rs/",
    githubUrl: "https://github.com/pmndrs/zustand",
  },
  jotai: { docsUrl: "https://jotai.org/docs", githubUrl: "https://github.com/pmndrs/jotai" },
  nanostores: {
    docsUrl: "https://github.com/nanostores/nanostores#readme",
    githubUrl: "https://github.com/nanostores/nanostores",
  },
  "redux-toolkit": {
    docsUrl: "https://redux-toolkit.js.org/",
    githubUrl: "https://github.com/reduxjs/redux-toolkit",
  },
  mobx: { docsUrl: "https://mobx.js.org/", githubUrl: "https://github.com/mobxjs/mobx" },
  xstate: {
    docsUrl: "https://stately.ai/docs/xstate",
    githubUrl: "https://github.com/statelyai/xstate",
  },
  valtio: {
    docsUrl: "https://valtio.dev/docs/introduction",
    githubUrl: "https://github.com/pmndrs/valtio",
  },
  "tanstack-store": {
    docsUrl: "https://tanstack.com/store/latest",
    githubUrl: "https://github.com/TanStack/store",
  },
  "legend-state": {
    docsUrl: "https://legendapp.com/open-source/state/v3/",
    githubUrl: "https://github.com/LegendApp/legend-state",
  },
  "react-hook-form": {
    docsUrl: "https://react-hook-form.com/docs",
    githubUrl: "https://github.com/react-hook-form/react-hook-form",
  },
  "tanstack-form": {
    docsUrl: "https://tanstack.com/form/latest",
    githubUrl: "https://github.com/TanStack/form",
  },
  formik: {
    docsUrl: "https://formik.org/docs/overview",
    githubUrl: "https://github.com/jaredpalmer/formik",
  },
  "final-form": {
    docsUrl: "https://final-form.org/",
    githubUrl: "https://github.com/final-form/final-form",
  },
  conform: {
    docsUrl: "https://conform.guide/",
    githubUrl: "https://github.com/edmundhung/conform",
  },
  "modular-forms": {
    docsUrl: "https://modularforms.dev/",
    githubUrl: "https://github.com/fabian-hiller/modular-forms",
  },
  zod: { docsUrl: "https://zod.dev/", githubUrl: "https://github.com/colinhacks/zod" },
  valibot: {
    docsUrl: "https://valibot.dev/",
    githubUrl: "https://github.com/fabian-hiller/valibot",
  },
  arktype: {
    docsUrl: "https://arktype.io/docs",
    githubUrl: "https://github.com/arktypeio/arktype",
  },
  typebox: {
    docsUrl: "https://sinclairzx81.github.io/typebox/",
    githubUrl: "https://github.com/sinclairzx81/typebox",
  },
  typia: { docsUrl: "https://typia.io/docs/", githubUrl: "https://github.com/samchon/typia" },
  runtypes: {
    docsUrl: "https://www.npmjs.com/package/runtypes",
    githubUrl: "https://github.com/runtypes/runtypes",
  },
  "effect-schema": {
    docsUrl: "https://effect.website/docs/schema/introduction/",
    githubUrl: "https://github.com/Effect-TS/effect",
  },
  tailwind: {
    docsUrl: "https://tailwindcss.com/docs",
    githubUrl: "https://github.com/tailwindlabs/tailwindcss",
  },
  scss: {
    docsUrl: "https://sass-lang.com/documentation/",
    githubUrl: "https://github.com/sass/dart-sass",
  },
  less: { docsUrl: "https://lesscss.org/", githubUrl: "https://github.com/less/less.js" },
  "postcss-only": {
    docsUrl: "https://postcss.org/",
    githubUrl: "https://github.com/postcss/postcss",
  },
  "shadcn-ui": {
    docsUrl: "https://ui.shadcn.com/docs",
    githubUrl: "https://github.com/shadcn-ui/ui",
  },
  daisyui: {
    docsUrl: "https://daisyui.com/docs/",
    githubUrl: "https://github.com/saadeghi/daisyui",
  },
  "radix-ui": {
    docsUrl: "https://www.radix-ui.com/primitives/docs/overview/introduction",
    githubUrl: "https://github.com/radix-ui/primitives",
  },
  "headless-ui": {
    docsUrl: "https://headlessui.com/",
    githubUrl: "https://github.com/tailwindlabs/headlessui",
  },
  "park-ui": {
    docsUrl: "https://park-ui.com/",
    githubUrl: "https://github.com/cschroeter/park-ui",
  },
  "chakra-ui": {
    docsUrl: "https://chakra-ui.com/docs",
    githubUrl: "https://github.com/chakra-ui/chakra-ui",
  },
  nextui: {
    docsUrl: "https://www.heroui.com/docs",
    githubUrl: "https://github.com/heroui-inc/heroui",
  },
  mantine: { docsUrl: "https://mantine.dev/", githubUrl: "https://github.com/mantinedev/mantine" },
  "base-ui": {
    docsUrl: "https://base-ui.com/react/overview/quick-start",
    githubUrl: "https://github.com/mui/base-ui",
  },
  "ark-ui": {
    docsUrl: "https://ark-ui.com/docs/overview/introduction",
    githubUrl: "https://github.com/chakra-ui/ark",
  },
  "react-aria": {
    docsUrl: "https://react-spectrum.adobe.com/react-aria/",
    githubUrl: "https://github.com/adobe/react-spectrum",
  },
  npm: { docsUrl: "https://docs.npmjs.com/", githubUrl: "https://github.com/npm/cli" },
  pnpm: { docsUrl: "https://pnpm.io/", githubUrl: "https://github.com/pnpm/pnpm" },
  biome: {
    docsUrl: "https://biomejs.dev/guides/getting-started/",
    githubUrl: "https://github.com/biomejs/biome",
  },
  oxlint: {
    docsUrl: "https://oxc.rs/docs/guide/usage/linter.html",
    githubUrl: "https://github.com/oxc-project/oxc",
  },
  ultracite: {
    docsUrl: "https://www.ultracite.ai/",
    githubUrl: "https://github.com/haydenbleasel/ultracite",
  },
  lefthook: {
    docsUrl: "https://lefthook.dev/",
    githubUrl: "https://github.com/evilmartians/lefthook",
  },
  husky: {
    docsUrl: "https://typicode.github.io/husky/",
    githubUrl: "https://github.com/typicode/husky",
  },
  ruler: { docsUrl: "https://ruler.dev/" },
  starlight: {
    docsUrl: "https://starlight.astro.build/",
    githubUrl: "https://github.com/withastro/starlight",
  },
  fumadocs: {
    docsUrl: "https://fumadocs.dev/docs/ui",
    githubUrl: "https://github.com/fuma-nama/fumadocs",
  },
  turborepo: {
    docsUrl: "https://turbo.build/repo/docs",
    githubUrl: "https://github.com/vercel/turborepo",
  },
  pwa: { docsUrl: "https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps" },
  tauri: { docsUrl: "https://tauri.app/start/", githubUrl: "https://github.com/tauri-apps/tauri" },
  wxt: { docsUrl: "https://wxt.dev/", githubUrl: "https://github.com/wxt-dev/wxt" },
  opentui: { docsUrl: "https://opentui.org/", githubUrl: "https://github.com/sst/opentui" },
  mcp: {
    docsUrl: "https://modelcontextprotocol.io/introduction",
    githubUrl: "https://github.com/modelcontextprotocol",
  },
  skills: { docsUrl: "https://www.npmjs.com/package/skills" },
  msw: { docsUrl: "https://mswjs.io/docs", githubUrl: "https://github.com/mswjs/msw" },
  storybook: {
    docsUrl: "https://storybook.js.org/docs",
    githubUrl: "https://github.com/storybookjs/storybook",
  },
  "vitest-playwright": {
    docsUrl: "https://vitest.dev/guide/browser/playwright.html",
    githubUrl: "https://github.com/vitest-dev/vitest",
  },
  ai: { docsUrl: "https://ai-sdk.dev/docs", githubUrl: "https://github.com/vercel/ai" },
  "vercel-ai": { docsUrl: "https://ai-sdk.dev/docs", githubUrl: "https://github.com/vercel/ai" },
  mastra: { docsUrl: "https://mastra.ai/docs", githubUrl: "https://github.com/mastra-ai/mastra" },
  voltagent: {
    docsUrl: "https://docs.voltagent.dev/",
    githubUrl: "https://github.com/VoltAgent/voltagent",
  },
  "openai-agents": {
    docsUrl: "https://openai.github.io/openai-agents-js/",
    githubUrl: "https://github.com/openai/openai-agents-js",
  },
  modelfusion: {
    docsUrl: "https://modelfusion.dev/",
    githubUrl: "https://github.com/vercel/modelfusion",
  },
  "socket-io": {
    docsUrl: "https://socket.io/docs/v4/",
    githubUrl: "https://github.com/socketio/socket.io",
  },
  partykit: {
    docsUrl: "https://docs.partykit.io/",
    githubUrl: "https://github.com/partykit/partykit",
  },
  ably: { docsUrl: "https://ably.com/docs", githubUrl: "https://github.com/ably/ably-js" },
  pusher: {
    docsUrl: "https://pusher.com/docs/",
    githubUrl: "https://github.com/pusher/pusher-http-node",
  },
  liveblocks: {
    docsUrl: "https://liveblocks.io/docs",
    githubUrl: "https://github.com/liveblocks/liveblocks",
  },
  yjs: { docsUrl: "https://docs.yjs.dev/", githubUrl: "https://github.com/yjs/yjs" },
  bullmq: {
    docsUrl: "https://docs.bullmq.io/",
    githubUrl: "https://github.com/taskforcesh/bullmq",
  },
  "trigger-dev": {
    docsUrl: "https://trigger.dev/docs",
    githubUrl: "https://github.com/triggerdotdev/trigger.dev",
  },
  inngest: {
    docsUrl: "https://www.inngest.com/docs",
    githubUrl: "https://github.com/inngest/inngest",
  },
  temporal: {
    docsUrl: "https://docs.temporal.io/",
    githubUrl: "https://github.com/temporalio/sdk-typescript",
  },
  "upstash-redis": {
    docsUrl: "https://upstash.com/docs/redis",
    githubUrl: "https://github.com/upstash/redis-js",
  },
  meilisearch: {
    docsUrl: "https://www.meilisearch.com/docs",
    githubUrl: "https://github.com/meilisearch/meilisearch",
  },
  typesense: {
    docsUrl: "https://typesense.org/docs/",
    githubUrl: "https://github.com/typesense/typesense",
  },
  s3: {
    docsUrl: "https://docs.aws.amazon.com/AmazonS3/",
    githubUrl: "https://github.com/aws/aws-sdk-js-v3",
  },
  r2: {
    docsUrl: "https://developers.cloudflare.com/r2/",
    githubUrl: "https://github.com/cloudflare/workers-sdk",
  },
  "framer-motion": {
    docsUrl: "https://motion.dev/docs",
    githubUrl: "https://github.com/motiondivision/motion",
  },
  gsap: { docsUrl: "https://gsap.com/docs/", githubUrl: "https://github.com/greensock/GSAP" },
  "react-spring": {
    docsUrl: "https://www.react-spring.dev/",
    githubUrl: "https://github.com/pmndrs/react-spring",
  },
  "auto-animate": {
    docsUrl: "https://auto-animate.formkit.com/",
    githubUrl: "https://github.com/formkit/auto-animate",
  },
  lottie: {
    docsUrl: "https://lottiefiles.com/blog/working-with-lottie",
    githubUrl: "https://github.com/airbnb/lottie-web",
  },
  vitest: {
    docsUrl: "https://vitest.dev/guide/",
    githubUrl: "https://github.com/vitest-dev/vitest",
  },
  jest: {
    docsUrl: "https://jestjs.io/docs/getting-started",
    githubUrl: "https://github.com/jestjs/jest",
  },
  playwright: {
    docsUrl: "https://playwright.dev/docs/intro",
    githubUrl: "https://github.com/microsoft/playwright",
  },
  cypress: {
    docsUrl: "https://docs.cypress.io/",
    githubUrl: "https://github.com/cypress-io/cypress",
  },
  payload: {
    docsUrl: "https://payloadcms.com/docs",
    githubUrl: "https://github.com/payloadcms/payload",
  },
  sanity: {
    docsUrl: "https://www.sanity.io/docs",
    githubUrl: "https://github.com/sanity-io/sanity",
  },
  strapi: { docsUrl: "https://docs.strapi.io/", githubUrl: "https://github.com/strapi/strapi" },
  axum: {
    docsUrl: "https://docs.rs/axum/latest/axum/",
    githubUrl: "https://github.com/tokio-rs/axum",
  },
  "actix-web": {
    docsUrl: "https://actix.rs/docs/",
    githubUrl: "https://github.com/actix/actix-web",
  },
  leptos: { docsUrl: "https://book.leptos.dev/", githubUrl: "https://github.com/leptos-rs/leptos" },
  dioxus: {
    docsUrl: "https://dioxuslabs.com/learn/",
    githubUrl: "https://github.com/DioxusLabs/dioxus",
  },
  "sea-orm": {
    docsUrl: "https://www.sea-ql.org/SeaORM/docs/",
    githubUrl: "https://github.com/SeaQL/sea-orm",
  },
  sqlx: {
    docsUrl: "https://docs.rs/sqlx/latest/sqlx/",
    githubUrl: "https://github.com/launchbadge/sqlx",
  },
  "async-graphql": {
    docsUrl: "https://async-graphql.github.io/async-graphql/en/",
    githubUrl: "https://github.com/async-graphql/async-graphql",
  },
  tonic: {
    docsUrl: "https://docs.rs/tonic/latest/tonic/",
    githubUrl: "https://github.com/hyperium/tonic",
  },
  clap: {
    docsUrl: "https://docs.rs/clap/latest/clap/",
    githubUrl: "https://github.com/clap-rs/clap",
  },
  ratatui: { docsUrl: "https://ratatui.rs/", githubUrl: "https://github.com/ratatui/ratatui" },
  serde: { docsUrl: "https://serde.rs/", githubUrl: "https://github.com/serde-rs/serde" },
  validator: {
    docsUrl: "https://docs.rs/validator/latest/validator/",
    githubUrl: "https://github.com/Keats/validator",
  },
  jsonwebtoken: {
    docsUrl: "https://docs.rs/jsonwebtoken/latest/jsonwebtoken/",
    githubUrl: "https://github.com/Keats/jsonwebtoken",
  },
  argon2: {
    docsUrl: "https://docs.rs/argon2/latest/argon2/",
    githubUrl: "https://github.com/RustCrypto/password-hashes",
  },
  "tokio-test": {
    docsUrl: "https://docs.rs/tokio-test/latest/tokio_test/",
    githubUrl: "https://github.com/tokio-rs/tokio",
  },
  mockall: {
    docsUrl: "https://docs.rs/mockall/latest/mockall/",
    githubUrl: "https://github.com/asomers/mockall",
  },
  fastapi: {
    docsUrl: "https://fastapi.tiangolo.com/",
    githubUrl: "https://github.com/fastapi/fastapi",
  },
  django: {
    docsUrl: "https://docs.djangoproject.com/",
    githubUrl: "https://github.com/django/django",
  },
  sqlalchemy: {
    docsUrl: "https://docs.sqlalchemy.org/",
    githubUrl: "https://github.com/sqlalchemy/sqlalchemy",
  },
  sqlmodel: {
    docsUrl: "https://sqlmodel.tiangolo.com/",
    githubUrl: "https://github.com/fastapi/sqlmodel",
  },
  pydantic: {
    docsUrl: "https://docs.pydantic.dev/",
    githubUrl: "https://github.com/pydantic/pydantic",
  },
  celery: { docsUrl: "https://docs.celeryq.dev/", githubUrl: "https://github.com/celery/celery" },
  ruff: { docsUrl: "https://docs.astral.sh/ruff/", githubUrl: "https://github.com/astral-sh/ruff" },
  gin: { docsUrl: "https://gin-gonic.com/docs/", githubUrl: "https://github.com/gin-gonic/gin" },
  echo: {
    docsUrl: "https://echo.labstack.com/docs",
    githubUrl: "https://github.com/labstack/echo",
  },
  gorm: { docsUrl: "https://gorm.io/docs/", githubUrl: "https://github.com/go-gorm/gorm" },
  sqlc: { docsUrl: "https://docs.sqlc.dev/", githubUrl: "https://github.com/sqlc-dev/sqlc" },
  "grpc-go": {
    docsUrl: "https://grpc.io/docs/languages/go/quickstart/",
    githubUrl: "https://github.com/grpc/grpc-go",
  },
  cobra: { docsUrl: "https://cobra.dev/", githubUrl: "https://github.com/spf13/cobra" },
  bubbletea: {
    docsUrl: "https://github.com/charmbracelet/bubbletea#readme",
    githubUrl: "https://github.com/charmbracelet/bubbletea",
  },
  zap: {
    docsUrl: "https://pkg.go.dev/go.uber.org/zap",
    githubUrl: "https://github.com/uber-go/zap",
  },
};

const CATEGORY_LINKS: LinkMap = {
  "ai:langchain": {
    docsUrl: "https://js.langchain.com/",
    githubUrl: "https://github.com/langchain-ai/langchainjs",
  },
  "ai:llamaindex": {
    docsUrl: "https://developers.llamaindex.ai/typescript/",
    githubUrl: "https://github.com/run-llama/LlamaIndexTS",
  },
  "ai:langgraph": {
    docsUrl: "https://langchain-ai.github.io/langgraphjs/",
    githubUrl: "https://github.com/langchain-ai/langgraphjs",
  },
  "ai:google-adk": { docsUrl: "https://google.github.io/adk-docs/" },
  "pythonAi:langchain": {
    docsUrl: "https://python.langchain.com/docs/introduction/",
    githubUrl: "https://github.com/langchain-ai/langchain",
  },
  "pythonAi:llamaindex": {
    docsUrl: "https://developers.llamaindex.ai/python/",
    githubUrl: "https://github.com/run-llama/llama_index",
  },
  "pythonAi:openai-sdk": {
    docsUrl: "https://platform.openai.com/docs",
    githubUrl: "https://github.com/openai/openai-python",
  },
  "pythonAi:anthropic-sdk": {
    docsUrl: "https://docs.anthropic.com/",
    githubUrl: "https://github.com/anthropics/anthropic-sdk-python",
  },
  "pythonAi:langgraph": {
    docsUrl: "https://langchain-ai.github.io/langgraph/",
    githubUrl: "https://github.com/langchain-ai/langgraph",
  },
  "pythonAi:crewai": {
    docsUrl: "https://docs.crewai.com/",
    githubUrl: "https://github.com/crewAIInc/crewAI",
  },
  "aiDocs:claude-md": { docsUrl: "https://docs.anthropic.com/en/docs/claude-code/memory" },
  "aiDocs:agents-md": { docsUrl: "https://agents.md/" },
  "aiDocs:cursorrules": { docsUrl: "https://docs.cursor.com/context/rules-for-ai" },
};

export function getTechResourceLinks(category: string, techId: string): TechResourceLinks {
  return CATEGORY_LINKS[`${category}:${techId}`] ?? BASE_LINKS[techId] ?? {};
}
