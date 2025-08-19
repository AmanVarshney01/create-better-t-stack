import { isCancel, select } from "@clack/prompts";
import { DEFAULT_CONFIG } from "../constants";
import type { Backend, Frontend, Runtime, WebDeploy } from "../types";
import { WEB_FRAMEWORKS } from "../utils/compatibility";
import { exitCancelled } from "../utils/errors";

function hasWebFrontend(frontends: Frontend[]): boolean {
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

export async function getDeploymentChoice(
	deployment?: WebDeploy,
	_runtime?: Runtime,
	_backend?: Backend,
	frontend: Frontend[] = [],
): Promise<WebDeploy> {
	if (deployment !== undefined) return deployment;
	if (!hasWebFrontend(frontend)) {
		return "none";
	}

	const options: DeploymentOption[] = ["wrangler", "alchemy", "none"].map(
		(deploy) => {
			const { label, hint } = getDeploymentDisplay(deploy as WebDeploy);
			return {
				value: deploy as WebDeploy,
				label,
				hint,
			};
		},
	);

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
): Promise<WebDeploy> {
	if (!hasWebFrontend(frontend)) {
		return "none";
	}

	const options: DeploymentOption[] = [];

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
