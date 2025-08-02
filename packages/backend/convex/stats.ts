import { OssStats } from "@erquhart/convex-oss-stats";
import { components } from "./_generated/api";

export const ossStats = new OssStats(components.ossStats, {
	githubOwners: ["AmanVarshney01"],
	githubRepos: ["AmanVarshney01/create-better-t-stack"],
	npmPackages: ["create-better-t-stack"],
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
