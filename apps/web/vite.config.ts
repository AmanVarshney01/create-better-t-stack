import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3333,
  },
  plugins: [
    tsconfigPaths({
      projects: ["./tsconfig.json"],
      ignoreConfigErrors: true,
    }),
    tanstackStart({
      srcDirectory: "src",
    }),
    nitro(),
    // React's vite plugin must come after TanStack Start's plugin
    viteReact(),
    tailwindcss(),
  ],
});
