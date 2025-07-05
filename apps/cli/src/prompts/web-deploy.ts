import { cancel, isCancel, select } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import type { Backend, Frontend, Runtime, WebDeploy } from "../types";

const WORKERS_COMPATIBLE_FRONTENDS: Frontend[] = [
	"tanstack-router",
	"react-router",
	"solid",
	"next",
	"nuxt",
	"svelte",
];

type DeploymentOption = {
	value: WebDeploy;
	label: string;
	hint: string;
};

function getDeploymentDisplay(deployment: WebDeploy): {
	label: string;
	hint: string;
} {
	if (deployment === "workers") {
		return {
			label: "Cloudflare Workers",
			hint: "Deploy to Cloudflare Workers using Wrangler",
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

	const hasCompatibleFrontend = frontend.some((f) =>
		WORKERS_COMPATIBLE_FRONTENDS.includes(f),
	);

	if (!hasCompatibleFrontend) {
		return "none";
	}

	const options: DeploymentOption[] = [
		{
			value: "workers",
			label: "Cloudflare Workers",
			hint: "Deploy to Cloudflare Workers using Wrangler",
		},
		{ value: "none", label: "None", hint: "Manual setup" },
	];

	const response = await select<WebDeploy>({
		message: "Select web deployment",
		options,
		initialValue: DEFAULT_CONFIG.webDeploy,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}

export async function getDeploymentToAdd(
	frontend: Frontend[],
	existingDeployment?: WebDeploy,
): Promise<WebDeploy> {
	const options: DeploymentOption[] = [];

	if (
		frontend.some((f) => WORKERS_COMPATIBLE_FRONTENDS.includes(f)) &&
		existingDeployment !== "workers"
	) {
		const { label, hint } = getDeploymentDisplay("workers");
		options.push({
			value: "workers",
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

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}
