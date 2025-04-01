import type { ProjectConfig } from "../types";

export function generateReproducibleCommand(config: ProjectConfig): string {
	const flags: string[] = [];

	if (config.database === "none") {
		flags.push("--database none");
	} else {
		flags.push(`--database ${config.database}`);

		if (config.orm) {
			flags.push(`--orm ${config.orm}`);
		}

		if (config.database === "sqlite") {
			flags.push(config.turso ? "--turso" : "--no-turso");
		}
	}

	flags.push(config.auth ? "--auth" : "--no-auth");

	flags.push(config.git ? "--git" : "--no-git");

	flags.push(config.noInstall ? "--no-install" : "--install");

	if (config.runtime) {
		flags.push(`--runtime ${config.runtime}`);
	}

	if (config.backend) {
		flags.push(`--backend ${config.backend}`);
	}

	if (config.frontend && config.frontend.length > 0) {
		flags.push(`--frontend ${config.frontend.join(" ")}`);
	}

	if (config.addons && config.addons.length > 0) {
		flags.push(`--addons ${config.addons.join(" ")}`);
	} else {
		flags.push("--no-addons");
	}

	if (config.examples && config.examples.length > 0) {
		flags.push(`--examples ${config.examples.join(" ")}`);
	} else {
		flags.push("--no-examples");
	}

	if (config.packageManager) {
		flags.push(`--package-manager ${config.packageManager}`);
	}

	let baseCommand = "";
	const pkgManager = config.packageManager;

	if (pkgManager === "npm") {
		baseCommand = "npm create better-t-stack@latest";
	} else if (pkgManager === "pnpm") {
		baseCommand = "pnpm create better-t-stack@latest";
	} else if (pkgManager === "bun") {
		baseCommand = "bun create better-t-stack@latest";
	}

	const projectName = config.projectName ? ` ${config.projectName}` : "";

	return `${baseCommand}${projectName} ${flags.join(" ")}`;
}
