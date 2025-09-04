import { DOCKER_COMPATIBILITY } from "@/constants";
import type { Docker, Frontend } from "@/types";

export function validateDockerCompatibility(
	docker: Docker,
	frontend: Frontend[],
): { isCompatible: boolean; reason?: string } {
	const compatibleFrontends = DOCKER_COMPATIBILITY[docker];

	if (compatibleFrontends.length === 0) {
		return { isCompatible: true };
	}

	const hasCompatibleFrontend = frontend.some((f) =>
		(compatibleFrontends as readonly string[]).includes(f),
	);

	if (!hasCompatibleFrontend) {
		const frontendList = compatibleFrontends.join(", ");
		return {
			isCompatible: false,
			reason: `${docker} docker requires one of these frontends: ${frontendList}`,
		};
	}

	return { isCompatible: true };
}

export function getCompatibleDockers(
	allDockers: Docker[],
	frontend: Frontend[],
	existingDockers: Docker[] = [],
): Docker[] {
	return allDockers.filter((docker) => {
		if (existingDockers.includes(docker)) return false;

		if (docker === "none") return false;

		const { isCompatible } = validateDockerCompatibility(docker, frontend);
		return isCompatible;
	});
}
