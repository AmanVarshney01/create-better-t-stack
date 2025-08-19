/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as healthCheck from "../healthCheck.js";
import type * as hooks from "../hooks.js";
import type * as http from "../http.js";
import type * as showcase from "../showcase.js";
import type * as sponsors from "../sponsors.js";
import type * as stats from "../stats.js";
import type * as testimonials from "../testimonials.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  healthCheck: typeof healthCheck;
  hooks: typeof hooks;
  http: typeof http;
  showcase: typeof showcase;
  sponsors: typeof sponsors;
  stats: typeof stats;
  testimonials: typeof testimonials;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {
  ossStats: {
    github: {
      getGithubOwners: FunctionReference<
        "query",
        "internal",
        { owners: Array<string> },
        Array<null | {
          contributorCount: number;
          dependentCount: number;
          dependentCountPrevious?: { count: number; updatedAt: number };
          dependentCountUpdatedAt?: number;
          name: string;
          nameNormalized: string;
          starCount: number;
          updatedAt: number;
        }>
      >;
      getGithubRepo: FunctionReference<
        "query",
        "internal",
        { name: string },
        null | {
          contributorCount: number;
          dependentCount: number;
          dependentCountPrevious?: { count: number; updatedAt: number };
          dependentCountUpdatedAt?: number;
          name: string;
          nameNormalized: string;
          owner: string;
          ownerNormalized: string;
          starCount: number;
          updatedAt: number;
        }
      >;
      getGithubRepos: FunctionReference<
        "query",
        "internal",
        { names: Array<string> },
        Array<null | {
          contributorCount: number;
          dependentCount: number;
          dependentCountPrevious?: { count: number; updatedAt: number };
          dependentCountUpdatedAt?: number;
          name: string;
          nameNormalized: string;
          owner: string;
          ownerNormalized: string;
          starCount: number;
          updatedAt: number;
        }>
      >;
      updateGithubOwner: FunctionReference<
        "mutation",
        "internal",
        { name: string },
        any
      >;
      updateGithubOwnerStats: FunctionReference<
        "action",
        "internal",
        { githubAccessToken: string; owner: string; page?: number },
        any
      >;
      updateGithubRepoStars: FunctionReference<
        "mutation",
        "internal",
        { name: string; owner: string; starCount: number },
        any
      >;
      updateGithubRepoStats: FunctionReference<
        "action",
        "internal",
        { githubAccessToken: string; repo: string },
        any
      >;
      updateGithubRepos: FunctionReference<
        "mutation",
        "internal",
        {
          repos: Array<{
            contributorCount: number;
            dependentCount: number;
            name: string;
            owner: string;
            starCount: number;
          }>;
        },
        any
      >;
    };
    lib: {
      clearAndSync: FunctionReference<
        "action",
        "internal",
        {
          githubAccessToken: string;
          githubOwners?: Array<string>;
          githubRepos?: Array<string>;
          minStars?: number;
          npmOrgs?: Array<string>;
          npmPackages?: Array<string>;
        },
        any
      >;
      clearPage: FunctionReference<
        "mutation",
        "internal",
        { tableName: "githubRepos" | "npmPackages" },
        { isDone: boolean }
      >;
      clearTable: FunctionReference<
        "action",
        "internal",
        { tableName: "githubRepos" | "npmPackages" },
        null
      >;
      sync: FunctionReference<
        "action",
        "internal",
        {
          githubAccessToken: string;
          githubOwners?: Array<string>;
          githubRepos?: Array<string>;
          minStars?: number;
          npmOrgs?: Array<string>;
          npmPackages?: Array<string>;
        },
        null
      >;
    };
    npm: {
      getNpmOrgs: FunctionReference<
        "query",
        "internal",
        { names: Array<string> },
        Array<null | {
          dayOfWeekAverages: Array<number>;
          downloadCount: number;
          downloadCountUpdatedAt: number;
          name: string;
          updatedAt: number;
        }>
      >;
      getNpmPackage: FunctionReference<
        "query",
        "internal",
        { name: string },
        null | {
          dayOfWeekAverages: Array<number>;
          downloadCount: number;
          downloadCountUpdatedAt?: number;
          name: string;
          org?: string;
          updatedAt: number;
        }
      >;
      getNpmPackages: FunctionReference<
        "query",
        "internal",
        { names: Array<string> },
        {
          dayOfWeekAverages: Array<number>;
          downloadCount: number;
          downloadCountUpdatedAt: number;
          updatedAt: number;
        }
      >;
      updateNpmOrg: FunctionReference<
        "mutation",
        "internal",
        { name: string },
        any
      >;
      updateNpmOrgStats: FunctionReference<
        "action",
        "internal",
        { org: string; page?: number },
        any
      >;
      updateNpmPackage: FunctionReference<
        "mutation",
        "internal",
        {
          dayOfWeekAverages: Array<number>;
          downloadCount: number;
          name: string;
        },
        any
      >;
      updateNpmPackageStats: FunctionReference<
        "action",
        "internal",
        { name: string },
        any
      >;
      updateNpmPackagesForOrg: FunctionReference<
        "mutation",
        "internal",
        {
          org: string;
          packages: Array<{
            dayOfWeekAverages: Array<number>;
            downloadCount: number;
            isNotFound?: boolean;
            name: string;
          }>;
        },
        any
      >;
    };
  };
};
