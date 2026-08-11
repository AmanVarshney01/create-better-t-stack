import { createServer } from "node:http";
import { fileURLToPath } from "node:url";

import sirv from "sirv";

const serve = sirv(fileURLToPath(new URL("./dist/", import.meta.url)), {
  dev: false,
  etag: true,
  single: true,
});

const port = Number(process.env.PORT ?? 3000);
createServer((request, response) => serve(request, response)).listen(port, "0.0.0.0", () => {
  console.log(`TanStack Router server listening on port ${port}`);
});
