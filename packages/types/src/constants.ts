import type { DesktopWebFrontend } from "./types";

export const desktopWebFrontends = [
  "tanstack-router",
  "react-router",
  "tanstack-start",
  "next",
  "vinext",
  "nuxt",
  "svelte",
  "solid",
  "astro",
] as const satisfies readonly DesktopWebFrontend[];
