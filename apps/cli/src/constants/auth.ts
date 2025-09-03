export const AUTH_WITHOUT_NONE = {
	betterAuth: "better-auth",
	clerk: "clerk",
} as const;

export const AUTH = {
	...AUTH_WITHOUT_NONE,
	none: "none",
} as const;

export const AUTHS_WITHOUT_NONE = Object.values(AUTH_WITHOUT_NONE);
export const AUTHS = Object.values(AUTH);
