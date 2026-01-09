import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/fs-writer.ts", "src/core/template-reader.ts"],
  format: ["esm"],
  clean: true,
  shims: true,
  outDir: "dist",
  dts: true,
});
