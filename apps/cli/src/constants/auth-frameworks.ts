import { withNone } from "@/utils/common";

export const AUTH_FRAMEWORKS_WITHOUT_NONE_MAP = {
	BETTER_AUTH: "better-auth",
	CLERK: "clerk",
} as const;

export const AUTH_FRAMEWORKS_MAP = withNone(AUTH_FRAMEWORKS_WITHOUT_NONE_MAP);

export const AUTH_FRAMEWORKS_WITHOUT_NONE = Object.values(
	AUTH_FRAMEWORKS_WITHOUT_NONE_MAP,
);
export const AUTHS_FRAMEWORKS = Object.values(AUTH_FRAMEWORKS_MAP);
