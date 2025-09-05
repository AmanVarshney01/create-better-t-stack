import { withNone } from "@/utils/common";

export const DOCKER_WITHOUT_NONE_MAPS = {
	SERVER: "app-server",
	WEB: "app-web",
} as const;

export const DOCKER_MAP = withNone(DOCKER_WITHOUT_NONE_MAPS);

export const DOCKERS_WITHOUT_NONE = Object.values(DOCKER_WITHOUT_NONE_MAPS);
export const DOCKERS = Object.values(DOCKER_MAP);
