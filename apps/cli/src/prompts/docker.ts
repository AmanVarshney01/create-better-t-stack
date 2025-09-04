import { groupMultiselect, isCancel } from "@clack/prompts";
import { DEFAULT_CONFIG } from "@/constants";
import { type Docker, DockerSchema, type Frontend } from "@/types";
import {
	getCompatibleDockers,
	validateDockerCompatibility,
} from "@/utils/docker-compatibility";
import { exitCancelled } from "@/utils/errors";

type DockerOption = {
	value: Docker;
	label: string;
	hint: string;
};

function getDockerDisplay(docker: Docker): { label: string; hint: string } {
	let label: string;
	let hint: string;

	switch (docker) {
		case "app-server":
			label = "app-server";
			hint = "Dockerfile for server app";
			break;
		case "app-web":
			label = "app-web";
			hint = "Dockerfile for web app";
			break;
		default:
			label = docker;
			hint = `Add ${docker}`;
	}

	return { label, hint };
}

const DOCKER_GROUPS = {
	Documentation: ["starlight", "fumadocs"],
	Linting: ["biome", "oxlint", "ultracite"],
	Other: ["ruler", "turborepo", "pwa", "tauri", "husky"],
};

export async function getDockerChoice(
	docker?: Docker[],
	frontends?: Frontend[],
): Promise<Docker[]> {
	if (docker !== undefined) return docker;

	const allDockers = DockerSchema.options.filter((docker) => docker !== "none");
	const groupedOptions: Record<string, DockerOption[]> = {
		Documentation: [],
		Linting: [],
		Other: [],
	};

	const frontendsArray = frontends || [];

	for (const docker of allDockers) {
		const { isCompatible } = validateDockerCompatibility(
			docker,
			frontendsArray,
		);
		if (!isCompatible) continue;

		const { label, hint } = getDockerDisplay(docker);
		const option = { value: docker, label, hint };

		if (DOCKER_GROUPS.Documentation.includes(docker)) {
			groupedOptions.Documentation.push(option);
		} else if (DOCKER_GROUPS.Linting.includes(docker)) {
			groupedOptions.Linting.push(option);
		} else if (DOCKER_GROUPS.Other.includes(docker)) {
			groupedOptions.Other.push(option);
		}
	}

	Object.keys(groupedOptions).forEach((group) => {
		if (groupedOptions[group].length === 0) {
			delete groupedOptions[group];
		}
	});

	const initialValues = DEFAULT_CONFIG.docker.filter((dockerValue) =>
		Object.values(groupedOptions).some((options) =>
			options.some((opt) => opt.value === dockerValue),
		),
	);

	const response = await groupMultiselect<Docker>({
		message: "Select dockers",
		options: groupedOptions,
		initialValues: initialValues,
		required: false,
		selectableGroups: false,
	});

	if (isCancel(response)) return exitCancelled("Operation cancelled");

	return response;
}

export async function getDockerToAdd(
	frontend: Frontend[],
	existingDockers: Docker[] = [],
): Promise<Docker[]> {
	const groupedOptions: Record<string, DockerOption[]> = {
		Documentation: [],
		Linting: [],
		Other: [],
	};

	const frontendArray = frontend || [];

	const compatibleDockers = getCompatibleDockers(
		DockerSchema.options.filter((docker) => docker !== "none"),
		frontendArray,
		existingDockers,
	);

	for (const docker of compatibleDockers) {
		const { label, hint } = getDockerDisplay(docker);
		const option = { value: docker, label, hint };

		if (DOCKER_GROUPS.Documentation.includes(docker)) {
			groupedOptions.Documentation.push(option);
		} else if (DOCKER_GROUPS.Linting.includes(docker)) {
			groupedOptions.Linting.push(option);
		} else if (DOCKER_GROUPS.Other.includes(docker)) {
			groupedOptions.Other.push(option);
		}
	}

	Object.keys(groupedOptions).forEach((group) => {
		if (groupedOptions[group].length === 0) {
			delete groupedOptions[group];
		}
	});

	if (Object.keys(groupedOptions).length === 0) {
		return [];
	}

	const response = await groupMultiselect<Docker>({
		message: "Select dockers to add",
		options: groupedOptions,
		required: false,
		selectableGroups: false,
	});

	if (isCancel(response)) return exitCancelled("Operation cancelled");

	return response;
}
