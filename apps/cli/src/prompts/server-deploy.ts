import { isCancel, select } from "@clack/prompts";
import { DEFAULT_CONFIG } from "../constants";
import type { Backend, Runtime, ServerDeploy } from "../types";
import { exitCancelled } from "../utils/errors";

type DeploymentOption = {
	value: ServerDeploy;
	label: string;
	hint: string;
};

function getDeploymentDisplay(deployment: ServerDeploy): {
	label: string;
	hint: string;
} {
	if (deployment === "workers") {
		return {
			label: "Workers",
			hint: "Deploy to Cloudflare Workers using Wrangler",
		};
	}
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

export async function getServerDeploymentChoice(
	deployment?: ServerDeploy,
	runtime?: Runtime,
	backend?: Backend,
): Promise<ServerDeploy> {
	if (deployment !== undefined) return deployment;

	if (backend === "none" || backend === "convex") {
		return "none";
	}

	const options: DeploymentOption[] = [
		{ value: "none", label: "None", hint: "Manual setup" },
	];

	if (runtime === "workers") {
		["alchemy", "workers"].forEach((deploy) => {
			const { label, hint } = getDeploymentDisplay(deploy as ServerDeploy);
			options.unshift({
				value: deploy as ServerDeploy,
				label,
				hint,
			});
		});
	}

	const response = await select<ServerDeploy>({
		message: "Select server deployment",
		options,
		initialValue: DEFAULT_CONFIG.serverDeploy,
	});

	if (isCancel(response)) return exitCancelled("Operation cancelled");

	return response;
}

export async function getServerDeploymentToAdd(
	runtime?: Runtime,
	existingDeployment?: ServerDeploy,
): Promise<ServerDeploy> {
	const options: DeploymentOption[] = [];

	if (runtime === "workers") {
		if (existingDeployment !== "workers") {
			const { label, hint } = getDeploymentDisplay("workers");
			options.push({
				value: "workers",
				label,
				hint,
			});
		}

		if (existingDeployment !== "alchemy") {
			const { label, hint } = getDeploymentDisplay("alchemy");
			options.push({
				value: "alchemy",
				label,
				hint,
			});
		}
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

	const response = await select<ServerDeploy>({
		message: "Select server deployment",
		options,
		initialValue: DEFAULT_CONFIG.serverDeploy,
	});

	if (isCancel(response)) return exitCancelled("Operation cancelled");

	return response;
}
