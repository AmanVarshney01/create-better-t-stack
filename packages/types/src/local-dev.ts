const VITE_WEB_FRONTENDS = new Set(["react-router", "svelte", "fresh"]);

export function getLocalWebDevPort(frontend: readonly string[]): 3001 | 5173 {
  return frontend.some((entry) => VITE_WEB_FRONTENDS.has(entry)) ? 5173 : 3001;
}
