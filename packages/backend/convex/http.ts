import { httpRouter } from "convex/server";

import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

interface AnalyticsBody {
  // Core
  ecosystem?: string;
  database?: string;
  orm?: string;
  backend?: string;
  runtime?: string;
  frontend?: string[];
  api?: string;
  auth?: string;
  // Deployment
  dbSetup?: string;
  webDeploy?: string;
  serverDeploy?: string;
  // Addons & Examples
  addons?: string[];
  examples?: string[];
  // Integrations
  payments?: string;
  email?: string;
  fileUpload?: string;
  // Frontend extras
  astroIntegration?: string;
  cssFramework?: string;
  uiLibrary?: string;
  stateManagement?: string;
  forms?: string;
  animation?: string;
  validation?: string;
  // Backend extras
  realtime?: string;
  jobQueue?: string;
  caching?: string;
  logging?: string;
  observability?: string;
  // AI & CMS
  ai?: string;
  cms?: string;
  // Testing
  testing?: string;
  // Effect
  effect?: string;
  // Rust ecosystem
  rustWebFramework?: string;
  rustFrontend?: string;
  rustOrm?: string;
  rustApi?: string;
  rustCli?: string;
  rustLibraries?: string[];
  // Setup options
  git?: boolean;
  packageManager?: string;
  install?: boolean;
  // Meta
  cli_version?: string;
  node_version?: string;
  platform?: string;
}

const http = httpRouter();

http.route({
  path: "/api/analytics/ingest",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = (await req.json()) as AnalyticsBody;
    if (!body) {
      return new Response("Bad Request", { status: 400 });
    }

    const ingest = internal.analytics?.ingestEvent;
    if (ingest) {
      try {
        await ctx.runMutation(ingest, {
          // Core
          ecosystem: body.ecosystem,
          database: body.database,
          orm: body.orm,
          backend: body.backend,
          runtime: body.runtime,
          frontend: body.frontend,
          api: body.api,
          auth: body.auth,
          // Deployment
          dbSetup: body.dbSetup,
          webDeploy: body.webDeploy,
          serverDeploy: body.serverDeploy,
          // Addons & Examples
          addons: body.addons,
          examples: body.examples,
          // Integrations
          payments: body.payments,
          email: body.email,
          fileUpload: body.fileUpload,
          // Frontend extras
          astroIntegration: body.astroIntegration,
          cssFramework: body.cssFramework,
          uiLibrary: body.uiLibrary,
          stateManagement: body.stateManagement,
          forms: body.forms,
          animation: body.animation,
          validation: body.validation,
          // Backend extras
          realtime: body.realtime,
          jobQueue: body.jobQueue,
          caching: body.caching,
          logging: body.logging,
          observability: body.observability,
          // AI & CMS
          ai: body.ai,
          cms: body.cms,
          // Testing
          testing: body.testing,
          // Effect
          effect: body.effect,
          // Rust ecosystem
          rustWebFramework: body.rustWebFramework,
          rustFrontend: body.rustFrontend,
          rustOrm: body.rustOrm,
          rustApi: body.rustApi,
          rustCli: body.rustCli,
          rustLibraries: body.rustLibraries,
          // Setup options
          git: body.git,
          packageManager: body.packageManager,
          install: body.install,
          // Meta
          cli_version: body.cli_version,
          node_version: body.node_version,
          platform: body.platform,
        });
      } catch (error) {
        console.error("Failed to ingest analytics:", error);
        return new Response("Internal Server Error", { status: 500 });
      }
    }
    return new Response("ok");
  }),
});

export default http;
