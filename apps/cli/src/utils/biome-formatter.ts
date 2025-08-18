import path from "node:path";
import { Biome } from "@biomejs/js-api/nodejs";

const biome = new Biome();
const projectKeyByRoot = new Map<string, number>();

function getOrOpenProject(projectRoot: string): number {
	const normalized = path.resolve(projectRoot);
	const existing = projectKeyByRoot.get(normalized);
	if (existing) return existing;
	const { projectKey } = biome.openProject(normalized);
	biome.applyConfiguration(projectKey, {
		assist: {
			actions: {
				source: {
					organizeImports: "on",
				},
			},
		},
	});
	projectKeyByRoot.set(normalized, projectKey);
	return projectKey;
}

export function formatWithBiome(
	projectRoot: string,
	filePath: string,
	content: string,
): string {
	try {
		const projectKey = getOrOpenProject(projectRoot);
		const result = biome.formatContent(projectKey, content, { filePath });
		return result?.content ?? content;
	} catch {
		return content;
	}
}
