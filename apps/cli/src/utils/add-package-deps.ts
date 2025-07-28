import path from "node:path";
import fs from "fs-extra";

import { type AvailableDependencies, dependencyVersionMap } from "../constants";

export const addPackageDependency = async (opts: {
	dependencies?: AvailableDependencies[];
	devDependencies?: AvailableDependencies[];
	projectDir: string;
}) => {
	const { dependencies = [], devDependencies = [], projectDir } = opts;

	const pkgJsonPath = path.join(projectDir, "package.json");

	const pkgJson = await fs.readJson(pkgJsonPath);

	if (!pkgJson.dependencies) pkgJson.dependencies = {};
	if (!pkgJson.devDependencies) pkgJson.devDependencies = {};

	for (const pkgName of dependencies) {
		const version = dependencyVersionMap[pkgName];
		if (version) {
			pkgJson.dependencies[pkgName] = version;
		} else {
			console.warn(`Warning: Dependency ${pkgName} not found in version map.`);
		}
	}

	for (const pkgName of devDependencies) {
		const version = dependencyVersionMap[pkgName];
		if (version) {
			pkgJson.devDependencies[pkgName] = version;
		} else {
			console.warn(
				`Warning: Dev dependency ${pkgName} not found in version map.`,
			);
		}
	}

	await fs.writeJson(pkgJsonPath, pkgJson, {
		spaces: 2,
	});
};
