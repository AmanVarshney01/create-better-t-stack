import { isCancel, select } from "@clack/prompts";
import { DEFAULT_CONFIG } from "../constants";
import type { Backend, Runtime, ServerDeploy, WebDeploy } from "../types";
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
	if (deployment === "wrangler") {
		return {
			label: "Wrangler",
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
	webDeploy?: WebDeploy,
) {
	if (deployment !== undefined) return deployment;

	if (backend === "none" || backend === "convex") {
		return "none";
	}

	if (backend !== "hono") {
		return "none";
	}

	const options: DeploymentOption[] = [];

	if (runtime !== "workers") {
		return "none";
	}

	["alchemy", "wrangler"].forEach((deploy) => {
		const { label, hint } = getDeploymentDisplay(deploy as ServerDeploy);
		options.unshift({
			value: deploy as ServerDeploy,
			label,
			hint,
		});
	});

	const response = await select<ServerDeploy>({
		message: "Select server deployment",
		options,
		initialValue:
			webDeploy === "alchemy"
				? "alchemy"
				: runtime === "workers"
					? "wrangler"
					: DEFAULT_CONFIG.serverDeploy,
	});

	if (isCancel(response)) return exitCancelled("Operation cancelled");

	return response;
}

export async function getServerDeploymentToAdd(
	runtime?: Runtime,
	existingDeployment?: ServerDeploy,
	backend?: Backend,
) {
	if (backend !== "hono") {
		return "none";
	}

	const options: DeploymentOption[] = [];

	if (runtime === "workers") {
		if (existingDeployment !== "wrangler") {
			const { label, hint } = getDeploymentDisplay("wrangler");
			options.push({
				value: "wrangler",
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
	}

	if (options.length === 0) {
		return "none";
	}

	const response = await select<ServerDeploy>({
		message: "Select server deployment",
		options,
		initialValue:
			runtime === "workers" ? "wrangler" : DEFAULT_CONFIG.serverDeploy,
	});

	if (isCancel(response)) return exitCancelled("Operation cancelled");

	return response;
}
