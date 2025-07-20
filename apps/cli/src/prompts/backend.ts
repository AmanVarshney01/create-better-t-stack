import { cancel, isCancel, select } from "@clack/prompts";
import pc from "picocolors";
import {
	BACKEND_COMPATIBILITY,
	BACKEND_DETAILS,
	DEFAULT_CONFIG,
} from "../constants";
import type { Backend, Frontend } from "../types";

function getCompatibleBackends(frontendFrameworks?: Frontend[]): Backend[] {
	if (!frontendFrameworks || frontendFrameworks.length === 0) {
		return Object.keys(BACKEND_DETAILS) as Backend[];
	}

	// Find backends that are compatible with all selected frontend frameworks
	const allBackends = Object.keys(BACKEND_COMPATIBILITY) as Backend[];
	
	return allBackends.filter((backend) => {
		return frontendFrameworks.every((frontend) =>
			BACKEND_COMPATIBILITY[backend].frontends.includes(frontend)
		);
	});
}

export async function getBackendFrameworkChoice(
	backendFramework?: Backend,
	frontendFrameworks?: Frontend[],
): Promise<Backend> {
	if (backendFramework !== undefined) return backendFramework;

	// Get compatible backends based on the passed in frontend frameworks
	const compatibleBackends = getCompatibleBackends(frontendFrameworks);

	// Build backend options using BACKEND_DETAILS
	const backendOptions = compatibleBackends.map((backend) => ({
		value: backend,
		label: BACKEND_DETAILS[backend].label,
		hint: BACKEND_DETAILS[backend].hint,
	}));

	// Determine initial value, fallback to compatible option if needed
	let initialValue = DEFAULT_CONFIG.backend;
	if (!compatibleBackends.includes(initialValue)) {
		initialValue = compatibleBackends[0] || "hono";
	}

	const response = await select<Backend>({
		message: "Select backend",
		options: backendOptions,
		initialValue,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}
