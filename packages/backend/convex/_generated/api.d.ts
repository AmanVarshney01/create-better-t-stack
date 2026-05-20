/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as analytics from "../analytics.js";
import type * as analytics_date_utils from "../analytics_date_utils.js";
import type * as healthCheck from "../healthCheck.js";
import type * as hooks from "../hooks.js";
import type * as http from "../http.js";
import type * as showcase from "../showcase.js";
import type * as stats from "../stats.js";
import type * as testimonials from "../testimonials.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  analytics: typeof analytics;
  analytics_date_utils: typeof analytics_date_utils;
  healthCheck: typeof healthCheck;
  hooks: typeof hooks;
  http: typeof http;
  showcase: typeof showcase;
  stats: typeof stats;
  testimonials: typeof testimonials;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  ossStats: import("@erquhart/convex-oss-stats/_generated/component.js").ComponentApi<"ossStats">;
};
