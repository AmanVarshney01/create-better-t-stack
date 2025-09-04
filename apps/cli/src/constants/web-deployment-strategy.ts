export const WEB_DEPLOYMENT_STRATEGY_WITHOUT_NONE = {
	wrangler: "wrangler",
	alchemy: "alchemy",
} as const;

export const WEB_DEPLOYMENT_STRATEGY = {
	...WEB_DEPLOYMENT_STRATEGY_WITHOUT_NONE,
	none: "none",
} as const;

export const WEB_DEPLOYMENT_STRATEGIES_WITHOUT_NONE = Object.values(
	WEB_DEPLOYMENT_STRATEGY_WITHOUT_NONE,
);
export const WEB_DEPLOYMENT_STRATEGIES = Object.values(WEB_DEPLOYMENT_STRATEGY);
