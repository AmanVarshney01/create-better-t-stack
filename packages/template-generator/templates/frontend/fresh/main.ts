/// <reference lib="deno.ns" />

import { App, staticFiles } from "$fresh/server.ts";

export const app = new App({ root: import.meta.url }).use(staticFiles());

// To add custom routes, import { define } from "./utils.ts"
// app.get("/api/example", define.handlers(() => new Response("Hello!")));

if (import.meta.main) {
  await app.listen();
}
