import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/cli.ts", "src/virtual.ts"],
  format: ["esm"],
  clean: true,
  shims: true,
  outDir: "dist",
  dts: true,
  deps: {
    alwaysBundle: [
      "@create-js-stack/types",
      "@create-js-stack/template-generator",
      /^@create-js-stack\//,
    ],
  },
  hooks: {
    "build:done": async () => {
      const fs = await import("node:fs/promises");
      const path = await import("node:path");
      const src = path.resolve("../../packages/template-generator/templates-binary");
      const dest = path.resolve("./templates-binary");
      await fs.rm(dest, { recursive: true, force: true });
      await fs.cp(src, dest, { recursive: true });
    },
  },
  outputOptions: {
    banner: "#!/usr/bin/env node",
  },
  env: {
    CJS_TELEMETRY: process.env.CJS_TELEMETRY || "0",
    CONVEX_INGEST_URL: process.env.CONVEX_INGEST_URL || "",
  },
});
