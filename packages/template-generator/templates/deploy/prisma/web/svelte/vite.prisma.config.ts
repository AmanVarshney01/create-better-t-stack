import { cpSync, existsSync } from "node:fs";
import { resolve } from "node:path";

import { defineConfig, type Plugin } from "vite";

function copySvelteKitAssets(): Plugin {
  return {
    name: "prisma-copy-sveltekit-assets",
    closeBundle() {
      cpSync(resolve("build/client"), resolve(".prisma/client"), { recursive: true });
      if (existsSync(resolve("build/prerendered"))) {
        cpSync(resolve("build/prerendered"), resolve(".prisma/prerendered"), { recursive: true });
      }
    },
  };
}

export default defineConfig({
  plugins: [copySvelteKitAssets()],
  build: {
    ssr: "build/index.js",
    outDir: ".prisma",
    emptyOutDir: true,
    copyPublicDir: false,
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: "server.mjs",
        chunkFileNames: "chunks/[name]-[hash].mjs",
      },
    },
  },
  ssr: {
    noExternal: true,
  },
});
