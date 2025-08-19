import path from "node:path";
import fs from "fs-extra";
import { PKG_ROOT } from "../constants";

export const getLatestCLIVersion = () => {
	const packageJsonPath = path.join(PKG_ROOT, "package.json");

	const packageJsonContent = fs.readJSONSync(packageJsonPath);

	return packageJsonContent.version ?? "1.0.0";
};
