import type { Frontend } from "@better-fullstack/types";

export function getWebPackagePath(frontend: Frontend[]): string {
  return frontend.includes("redwood") ? "web/package.json" : "apps/web/package.json";
}

export function getServerPackagePath(frontend: Frontend[]): string {
  return frontend.includes("redwood") ? "api/package.json" : "apps/server/package.json";
}
