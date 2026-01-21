import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, type PluginOption } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3333,
  },
  build: {
    rollupOptions: {
      external: ["@jsonjoy.com/util/lib/buffers/Writer"],
    },
  },
  plugins: [
    tsconfigPaths({
      projects: ["./tsconfig.json"],
      ignoreConfigErrors: true,
    }),
    tanstackStart({
      srcDirectory: "src",
    }),
    nitro() as PluginOption,
    // React's vite plugin must come after TanStack Start's plugin
    viteReact(),
    tailwindcss(),
  ],
  // @ts-expect-error - nitro config at root level
  nitro: {
    preset: "vercel",
  },
});
