import path from "node:path";
import consola from "consola";
import fs from "fs-extra";
import handlebars from "handlebars";
import type { ProjectConfig } from "../types";

/**
 * Processes a Handlebars template file and writes the output to the destination.
 * @param srcPath Path to the source .hbs template file.
 * @param destPath Path to write the processed file.
 * @param context Data to be passed to the Handlebars template.
 */
export async function processTemplate(
	srcPath: string,
	destPath: string,
	context: ProjectConfig,
) {
	try {
		const templateContent = await fs.readFile(srcPath, "utf-8");
		const template = handlebars.compile(templateContent);
		const processedContent = template(context);

		await fs.ensureDir(path.dirname(destPath));
		await fs.writeFile(destPath, processedContent);
	} catch (error) {
		consola.error(`Error processing template ${srcPath}:`, error);
		throw new Error(`Failed to process template ${srcPath}`);
	}
}

handlebars.registerHelper("eq", (a, b) => a === b);
handlebars.registerHelper("and", (a, b) => a && b);
handlebars.registerHelper("or", (a, b) => a || b);

handlebars.registerHelper(
	"includes",
	(array, value) => Array.isArray(array) && array.includes(value),
);

// Auth provider helpers
handlebars.registerHelper("hasAuth", (auth) => {
	if (typeof auth === "boolean") {
		return auth;
	}
	return auth !== "none";
});

handlebars.registerHelper("isBetterAuth", (auth) => {
	if (typeof auth === "boolean") {
		return auth; // Legacy: true means better-auth
	}
	return auth === "better-auth";
});

handlebars.registerHelper("isClerk", (auth) => {
	if (typeof auth === "boolean") {
		return false; // Legacy: boolean never means Clerk
	}
	return auth === "clerk";
});

handlebars.registerHelper("getAuthProvider", (auth) => {
	if (typeof auth === "boolean") {
		return auth ? "better-auth" : "none";
	}
	return auth;
});
