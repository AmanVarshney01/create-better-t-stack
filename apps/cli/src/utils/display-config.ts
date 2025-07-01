import pc from "picocolors";
import type { ProjectConfig } from "../types";

export function displayConfig(config: Partial<ProjectConfig>) {
	const configDisplay: string[] = [];

	if (config.projectName) {
		configDisplay.push(`${pc.blue("Project Name:")} ${config.projectName}`);
	}

	if (config.frontend !== undefined) {
		const frontend = Array.isArray(config.frontend)
			? config.frontend
			: [config.frontend];
		const frontendText =
			frontend.length > 0 && frontend[0] !== undefined
				? frontend.join(", ")
				: "none";
		configDisplay.push(`${pc.blue("Frontend:")} ${frontendText}`);
	}

	if (config.backend !== undefined) {
		configDisplay.push(`${pc.blue("Backend:")} ${String(config.backend)}`);
	}

	if (config.runtime !== undefined) {
		configDisplay.push(`${pc.blue("Runtime:")} ${String(config.runtime)}`);
	}

	if (config.api !== undefined) {
		configDisplay.push(`${pc.blue("API:")} ${String(config.api)}`);
	}

	if (config.database !== undefined) {
		configDisplay.push(`${pc.blue("Database:")} ${String(config.database)}`);
	}

	if (config.orm !== undefined) {
		configDisplay.push(`${pc.blue("ORM:")} ${String(config.orm)}`);
	}

	if (config.auth !== undefined) {
		const authText =
			typeof config.auth === "boolean"
				? config.auth
					? "Yes"
					: "No"
				: String(config.auth);
		configDisplay.push(`${pc.blue("Authentication:")} ${authText}`);
	}

	if (config.addons !== undefined) {
		const addons = Array.isArray(config.addons)
			? config.addons
			: [config.addons];
		const addonsText =
			addons.length > 0 && addons[0] !== undefined ? addons.join(", ") : "none";
		configDisplay.push(`${pc.blue("Addons:")} ${addonsText}`);
	}

	if (config.examples !== undefined) {
		const examples = Array.isArray(config.examples)
			? config.examples
			: [config.examples];
		const examplesText =
			examples.length > 0 && examples[0] !== undefined
				? examples.join(", ")
				: "none";
		configDisplay.push(`${pc.blue("Examples:")} ${examplesText}`);
	}

	if (config.git !== undefined) {
		const gitText =
			typeof config.git === "boolean"
				? config.git
					? "Yes"
					: "No"
				: String(config.git);
		configDisplay.push(`${pc.blue("Git Init:")} ${gitText}`);
	}

	if (config.packageManager !== undefined) {
		configDisplay.push(
			`${pc.blue("Package Manager:")} ${String(config.packageManager)}`,
		);
	}

	if (config.install !== undefined) {
		const installText =
			typeof config.install === "boolean"
				? config.install
					? "Yes"
					: "No"
				: String(config.install);
		configDisplay.push(`${pc.blue("Install Dependencies:")} ${installText}`);
	}

	if (config.dbSetup !== undefined) {
		configDisplay.push(
			`${pc.blue("Database Setup:")} ${String(config.dbSetup)}`,
		);
	}

	if (config.webDeploy !== undefined) {
		configDisplay.push(
			`${pc.blue("Web Deployment:")} ${String(config.webDeploy)}`,
		);
	}

	if (configDisplay.length === 0) {
		return pc.yellow("No configuration selected.");
	}

	return configDisplay.join("\n");
}
