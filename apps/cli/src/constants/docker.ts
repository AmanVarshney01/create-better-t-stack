export const DOCKER_WITHOUT_NONE = {
	server: "app-server",
	web: "app-web",
} as const;

export const DOCKER = {
	...DOCKER_WITHOUT_NONE,
	none: "none",
} as const;

export const DOCKERS_WITHOUT_NONE = Object.values(DOCKER_WITHOUT_NONE);
export const DOCKERS = Object.values(DOCKER);
