import { httpRouter } from "convex/server";

import { options, trackProjectCreation } from "./ingest";

const http = httpRouter();

// Route for tracking project creation
http.route({
  path: "/track",
  method: "POST",
  handler: trackProjectCreation,
});

// CORS preflight
http.route({
  path: "/track",
  method: "OPTIONS",
  handler: options,
});

export default http;
