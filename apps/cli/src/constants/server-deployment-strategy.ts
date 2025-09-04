export const SERVER_DEPLOYMENT_STRATEGY_WITHOUT_NONE = {
	wrangler: "wrangler",
	alchemy: "alchemy",
} as const;

export const SERVER_DEPLOYMENT_STRATEGY = {
	...SERVER_DEPLOYMENT_STRATEGY_WITHOUT_NONE,
	none: "none",
} as const;

export const SERVER_DEPLOYMENT_STRATEGIES_WITHOUT_NONE = Object.values(
	SERVER_DEPLOYMENT_STRATEGY_WITHOUT_NONE,
);
export const SERVER_DEPLOYMENT_STRATEGIES = Object.values(
	SERVER_DEPLOYMENT_STRATEGY,
);
