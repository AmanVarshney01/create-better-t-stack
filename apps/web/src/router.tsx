import { createRouter as createTanStackRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
  });

  return router;
}

// TanStack Start requires getRouter to be exported
let router: ReturnType<typeof createRouter>;

export function getRouter() {
  if (!router) {
    router = createRouter();
  }
  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
