import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3333,
  },
  ssr: {
    // Bundle react-tweet during SSR to handle its CSS imports
    noExternal: ["react-tweet"],
  },
  plugins: [
    tsconfigPaths({
      projects: ["./tsconfig.json"],
      ignoreConfigErrors: true,
    }),
    tanstackStart({
      srcDirectory: "src",
    }),
    // React's vite plugin must come after TanStack Start's plugin
    viteReact(),
    tailwindcss(),
  ],
});
