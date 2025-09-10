import path from "node:path";
import consola from "consola";
import fs from "fs-extra";
import handlebars from "handlebars";
import type { ProjectConfig } from "../types";
import { formatFileWithBiome } from "./biome-formatter";

export async function processTemplate(
	srcPath: string,
	destPath: string,
	context: ProjectConfig,
) {
	try {
		await fs.ensureDir(path.dirname(destPath));

		let content: string;

		if (srcPath.endsWith(".hbs")) {
			const templateContent = await fs.readFile(srcPath, "utf-8");
			const template = handlebars.compile(templateContent);
			content = template(context);
		} else {
			content = await fs.readFile(srcPath, "utf-8");
		}

		try {
			const formattedContent = await formatFileWithBiome(destPath, content);
			if (formattedContent) {
				content = formattedContent;
			}
		} catch (formatError) {
			consola.debug(`Failed to format ${destPath}:`, formatError);
		}

		await fs.writeFile(destPath, content);
	} catch (error) {
		consola.error(`Error processing template ${srcPath}:`, error);
		throw new Error(`Failed to process template ${srcPath}`);
	}
}

handlebars.registerHelper("eq", (a, b) => a === b);
handlebars.registerHelper("ne", (a, b) => a !== b);
handlebars.registerHelper("and", (a, b) => a && b);
handlebars.registerHelper("or", (a, b) => a || b);

handlebars.registerHelper(
	"includes",
	(array, value) => Array.isArray(array) && array.includes(value),
);
