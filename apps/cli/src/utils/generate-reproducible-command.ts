import type { ProjectConfig } from "../types";

export function generateReproducibleCommand(config: ProjectConfig) {
	const flags: string[] = [];

	if (config.frontend && config.frontend.length > 0) {
		flags.push(`--frontend ${config.frontend.join(" ")}`);
	} else {
		flags.push("--frontend none");
	}

	flags.push(`--backend ${config.backend}`);
	flags.push(`--runtime ${config.runtime}`);
	flags.push(`--database ${config.database}`);
	flags.push(`--orm ${config.orm}`);
	flags.push(`--api ${config.api}`);
	flags.push(`--auth ${config.auth}`);

	if (config.addons && config.addons.length > 0) {
		flags.push(`--addons ${config.addons.join(" ")}`);
	} else {
		flags.push("--addons none");
	}

	if (config.examples && config.examples.length > 0) {
		flags.push(`--examples ${config.examples.join(" ")}`);
	} else {
		flags.push("--examples none");
	}

	flags.push(`--db-setup ${config.dbSetup}`);
	flags.push(`--web-deploy ${config.webDeploy}`);
	flags.push(`--server-deploy ${config.serverDeploy}`);
	flags.push(config.git ? "--git" : "--no-git");
	flags.push(`--package-manager ${config.packageManager}`);
	flags.push(config.install ? "--install" : "--no-install");

	let baseCommand = "npx create-better-t-stack@latest";
	const pkgManager = config.packageManager;

	if (pkgManager === "bun") {
		baseCommand = "bun create better-t-stack@latest";
	} else if (pkgManager === "pnpm") {
		baseCommand = "pnpm create better-t-stack@latest";
	} else if (pkgManager === "npm") {
		baseCommand = "npx create-better-t-stack@latest";
	}

	const projectPathArg = config.relativePath ? ` ${config.relativePath}` : "";

	return `${baseCommand}${projectPathArg} ${flags.join(" ")}`;
}
