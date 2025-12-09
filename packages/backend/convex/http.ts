import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { ossStats } from "./stats";

const http = httpRouter();

http.route({
  path: "/api/analytics/ingest",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json();
    if (!body) {
      return new Response("Bad Request", { status: 400 });
    }

    const ingest = internal.analytics?.ingestEvent;
    if (ingest) {
      try {
        await ctx.runMutation(ingest, {
          database: body.database,
          orm: body.orm,
          backend: body.backend,
          runtime: body.runtime,
          frontend: body.frontend,
          addons: body.addons,
          examples: body.examples,
          auth: body.auth,
          payments: body.payments,
          git: body.git,
          packageManager: body.packageManager,
          install: body.install,
          dbSetup: body.dbSetup,
          api: body.api,
          webDeploy: body.webDeploy,
          serverDeploy: body.serverDeploy,
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

ossStats.registerRoutes(http);
export default http;
