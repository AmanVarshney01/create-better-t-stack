/// <reference types="vite-plugin-pwa/client" />

if (!import.meta.env.SSR) {
  import("virtual:pwa-register").then(({ registerSW }) => {
    registerSW({ immediate: true });
  });
}
