import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/cli.ts"],
  format: ["esm"],
  clean: true,
  shims: true,
  outDir: "dist",
  dts: true,
  outputOptions: {
    banner: "#!/usr/bin/env node",
  },
  env: {
    BTS_TELEMETRY: process.env.BTS_TELEMETRY || "0",
  },
});
