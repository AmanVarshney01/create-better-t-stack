import { WEB_FRONTENDS, type WebFrontend } from "../constants";
import type { Frontend } from "../types";

export function isWebFrontend(frontend: Frontend): frontend is WebFrontend {
	return WEB_FRONTENDS.includes(frontend as WebFrontend);
}

export function hasWebFrontend(frontends: Frontend[]): boolean {
	return frontends.some(isWebFrontend);
}
