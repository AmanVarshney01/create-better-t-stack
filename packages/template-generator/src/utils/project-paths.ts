import type { Backend, Frontend } from "@better-fullstack/types";

export function getWebPackagePath(frontend: Frontend[], backend?: Backend): string {
  return frontend.includes("redwood") && backend === "none"
    ? "web/package.json"
    : "apps/web/package.json";
}

export function getServerPackagePath(frontend: Frontend[], backend?: Backend): string {
  return frontend.includes("redwood") && backend === "none"
    ? "api/package.json"
    : "apps/server/package.json";
}
