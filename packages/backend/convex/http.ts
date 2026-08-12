import { AnalyticsEventSchema } from "@better-t-stack/types";
import { httpRouter } from "convex/server";

import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { ossStats } from "./stats";

const http = httpRouter();
const MAX_ANALYTICS_PAYLOAD_BYTES = 16 * 1024;

http.route({
  path: "/api/analytics/ingest",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const declaredLength = Number(req.headers.get("content-length"));
    if (Number.isFinite(declaredLength) && declaredLength > MAX_ANALYTICS_PAYLOAD_BYTES) {
      return new Response("Payload Too Large", { status: 413 });
    }

    let body: unknown;
    try {
      const rawBody = await req.text();
      if (new TextEncoder().encode(rawBody).byteLength > MAX_ANALYTICS_PAYLOAD_BYTES) {
        return new Response("Payload Too Large", { status: 413 });
      }
      body = JSON.parse(rawBody);
    } catch {
      return new Response("Bad Request", { status: 400 });
    }

    const parsed = AnalyticsEventSchema.safeParse(body);
    if (!parsed.success) {
      return new Response("Bad Request", { status: 400 });
    }

    try {
      await ctx.runMutation(internal.analytics.ingestEvent, parsed.data);
    } catch (error) {
      console.error("Failed to ingest analytics:", error);
      return new Response("Internal Server Error", { status: 500 });
    }

    return new Response("ok");
  }),
});

ossStats.registerRoutes(http);
export default http;
