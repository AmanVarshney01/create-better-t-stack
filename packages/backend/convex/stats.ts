import { OssStats } from "@erquhart/convex-oss-stats";

import { components } from "./_generated/api";

export const ossStats = new OssStats(components.ossStats, {
  githubOwners: ["riteshintro"],
  githubRepos: ["riteshintro/create-js-stack"],
  npmPackages: ["create-js-stack"],
});

export const {
  sync,
  clearAndSync,
  getGithubOwner,
  getNpmOrg,
  getGithubRepo,
  getGithubRepos,
  getNpmPackage,
  getNpmPackages,
} = ossStats.api();
