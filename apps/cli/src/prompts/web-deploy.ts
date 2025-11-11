import { isCancel, select } from "@clack/prompts";
import { DEFAULT_CONFIG } from "../constants";
import type { Backend, Frontend, Runtime, WebDeploy } from "../types";
import { WEB_FRAMEWORKS } from "../utils/compatibility";
import { exitCancelled } from "../utils/errors";

function hasWebFrontend(frontends: Frontend[]) {
	return frontends.some((f) => WEB_FRAMEWORKS.includes(f));
}

type DeploymentOption = {
	value: WebDeploy;
	label: string;
	hint: string;
};

function getDeploymentDisplay(deployment: WebDeploy): {
	label: string;
	hint: string;
} {
	if (deployment === "alchemy") {
		return {
			label: "Alchemy",
			hint: "Deploy to Cloudflare Workers using Alchemy",
		};
	}
	return {
		label: deployment,
		hint: `Add ${deployment} deployment`,
	};
}

export async function getDeploymentChoice(
	deployment?: WebDeploy,
	_runtime?: Runtime,
	_backend?: Backend,
	frontend: Frontend[] = [],
) {
	if (deployment !== undefined) return deployment;
	if (!hasWebFrontend(frontend)) {
		return "none";
	}

	const availableDeployments = ["alchemy", "none"];

	const options: DeploymentOption[] = availableDeployments.map((deploy) => {
		const { label, hint } = getDeploymentDisplay(deploy as WebDeploy);
		return {
			value: deploy as WebDeploy,
			label,
			hint,
		};
	});

	const response = await select<WebDeploy>({
		message: "Select web deployment",
		options,
		initialValue: DEFAULT_CONFIG.webDeploy,
	});

	if (isCancel(response)) return exitCancelled("Operation cancelled");

	return response;
}

export async function getDeploymentToAdd(
	frontend: Frontend[],
	existingDeployment?: WebDeploy,
) {
	if (!hasWebFrontend(frontend)) {
		return "none";
	}

	const options: DeploymentOption[] = [];

	if (existingDeployment !== "alchemy") {
		const { label, hint } = getDeploymentDisplay("alchemy");
		options.push({
			value: "alchemy",
			label,
			hint,
		});
	}

	if (existingDeployment && existingDeployment !== "none") {
		return "none";
	}

	if (options.length > 0) {
		options.push({
			value: "none",
			label: "None",
			hint: "Skip deployment setup",
		});
	}

	if (options.length === 0) {
		return "none";
	}

	const response = await select<WebDeploy>({
		message: "Select web deployment",
		options,
		initialValue: DEFAULT_CONFIG.webDeploy,
	});

	if (isCancel(response)) return exitCancelled("Operation cancelled");

	return response;
}
