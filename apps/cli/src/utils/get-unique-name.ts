import path from "node:path";
import fs from "fs-extra";

export function getUniqueProjectDirectory() {
	let finalFolderName = folderName;
	let counter = 1;

	let fullPath = path.join(basePath, finalFolderName);

	while (fs.existsSync(fullPath)) {
		finalFolderName = `${folderName}_${counter}`;
		fullPath = path.join(basePath, finalFolderName);
		counter++;
	}

	fs.mkdirSync(fullPath);
	return fullPath;
}
