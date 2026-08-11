import path from "node:path";
import { fileURLToPath } from "node:url";

import { createRequestHandler } from "@react-router/express";
import express from "express";

const app = express();
const clientDirectory = fileURLToPath(new URL("../client/", import.meta.url));

app.disable("x-powered-by");
app.use(
  "/assets",
  express.static(path.join(clientDirectory, "assets"), {
    immutable: true,
    maxAge: "1y",
  }),
);
app.use(express.static(clientDirectory));
app.use(
  createRequestHandler({
    build: () => import("virtual:react-router/server-build"),
  }),
);

const port = Number(process.env.PORT ?? 3000);
app.listen(port, "0.0.0.0", () => {
  console.log(`React Router server listening on port ${port}`);
});
