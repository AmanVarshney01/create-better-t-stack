import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/schemas.ts", "src/json-schema.ts"],
  format: ["esm"],
  clean: true,
  shims: true,
  outDir: "dist",
  dts: true,
});
