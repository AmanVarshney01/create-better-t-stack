/// <reference lib="deno.ns" />

import { App, staticFiles } from "fresh";
import type { State } from "./utils.ts";

export const app = new App<State>();

app.use(staticFiles());

app.use(async (ctx) => {
  ctx.state.siteName = "{{projectName}}";
  return await ctx.next();
});

app.fsRoutes();

if (import.meta.main) {
  await app.listen();
}
