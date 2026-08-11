import { cpSync } from "node:fs";
import { resolve } from "node:path";

import { defineConfig, type Plugin } from "vite";

function copyClientBuild(): Plugin {
  return {
    name: "prisma-copy-vite-client",
    closeBundle() {
      cpSync(resolve("dist"), resolve(".prisma/dist"), { recursive: true });
    },
  };
}

export default defineConfig({
  plugins: [copyClientBuild()],
  build: {
    ssr: "prisma.server.mjs",
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
